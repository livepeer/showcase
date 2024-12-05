"use client";

import React, { useState, useRef, useEffect } from "react";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { createStream } from "@/app/api/streams/create";
import { usePrivy } from "@privy-io/react-auth";
import { BroadcastWithControls } from "./broadcast";
import { Input } from "@repo/design-system/components/ui/input";
import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";

export default function Try({
  isRunning,
  setStreamInfo,
  pipeline,
}: {
  isRunning: boolean;
  setStreamInfo: (streamInfo: any) => void;
  pipeline: any;
}): JSX.Element {
  const [source, setSource] = useState<string>("");
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);

  const { user } = usePrivy();

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const getFromLocalStorage = (key: string) => {
    return localStorage.getItem(key);
  };

  const handleRun = async (): Promise<void> => {
    const stream = await createStream(
      {
        pipeline_id: pipeline.id,
        pipeline_params: inputValues,
      },
      user?.id ?? ""
    );

    const whipUrl = getFromLocalStorage("whipUrl");

    setStreamId(stream.id);
    setStreamInfo(stream);
    setStreamUrl(
      `https://ai.livepeer.monster/aiWebrtc/${stream.stream_key}/whip`
    );
  };

  const inputs = pipeline.config.inputs;

  const createDefaultValues = () => {
    const primaryInput = inputs.primary; //object
    const advancedInputs = inputs.advanced; //array
    const allInputs = [primaryInput, ...advancedInputs];
    return allInputs.reduce((acc, input) => {
      acc[input.id] = input.defaultValue;
      return acc;
    }, {});
  };

  useEffect(() => {
    const defaultValues = createDefaultValues();
    setInputValues(defaultValues);
  }, [pipeline]);

  useEffect(() => {
    if (isRunning && !streamId) {
      handleRun();
    }
  }, [isRunning]);

  const renderInput = (input: any) => {
    switch (input.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={input.placeholder}
            value={inputValues[input.id] || ""}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <Textarea
            className="h-44"
            placeholder={input.placeholder}
            value={inputValues[input.id] || ""}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
          />
        );
      case "number":
        return (
          <Input
            type="number"
            min={input.min}
            max={input.max}
            step={input.step}
            value={inputValues[input.id]}
            onChange={(e) =>
              handleInputChange(input.id, parseFloat(e.target.value))
            }
          />
        );
      case "switch":
        return (
          <Switch
            checked={inputValues[input.id]}
            onCheckedChange={(checked) => handleInputChange(input.id, checked)}
          />
        );
      case "select":
        return (
          <Select
            value={inputValues[input.id]}
            onValueChange={(value) => handleInputChange(input.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={input.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {input.options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return (
          <Input
            type="text"
            placeholder={input.placeholder}
            value={inputValues[input.id] || ""}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-5">
      {/* Source Input */}
      <div className="flex flex-col gap-2">
        <Label className="text-muted-foreground">Source</Label>
        <Select
          defaultValue="webcam"
          value={source}
          disabled
          onValueChange={setSource}
        >
          <SelectTrigger>
            <SelectValue placeholder="Webcam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webcam">Webcam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Primary Input (Prompt) */}
      {inputs.primary && (
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">
            {inputs.primary.label}
          </Label>
          {renderInput(inputs.primary)}
        </div>
      )}

      {/* Advanced Settings Collapsible */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
          Advanced Settings
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ScrollArea className="h-[500px] rounded-md border">
                <div className="p-4 space-y-4">
                  {inputs.advanced
                    .filter((input: any) => input.id !== "prompt")
                    .map((input: any) => (
                      <div
                        key={input.id}
                        className={cn({
                          "flex flex-col gap-2": true,
                          "flex flex-row justify-between items-center":
                            input.type === "switch",
                        })}
                      >
                        <Label className="text-muted-foreground">
                          {input.label}
                        </Label>
                        {renderInput(input)}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stream Source */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground">Stream Source</Label>
        <div className="flex flex-row h-[300px] w-full bg-sidebar rounded-2xl items-center justify-center overflow-hidden relative">
          {streamUrl && <BroadcastWithControls ingestUrl={streamUrl} />}
          {!streamUrl && (
            <p className="text-muted-foreground">
              Click on the "Run" button to begin
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
