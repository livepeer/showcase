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
import { upsertStream } from "@/app/api/streams/upsert";
import { usePrivy } from "@privy-io/react-auth";
import { BroadcastWithControls } from "./broadcast";
import { Input } from "@repo/design-system/components/ui/input";
import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import { Button } from "@repo/design-system/components/ui/button";
import { toast } from "sonner";
import { updateParams } from "@/app/api/streams/update-params";
import { app } from "@/lib/env";

export default function Try({
  setStreamInfo,
  pipeline,
}: {
  setStreamInfo: (streamInfo: any) => void;
  pipeline: any;
}): JSX.Element {
  const [source, setSource] = useState<string>("");
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [gatewayHost, setGatewayHost] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [streamKey, setStreamKey] = useState<string | null>(null);
  const { user } = usePrivy();

  const handleInputChange = (id: string, value: any) => {
    const newValues = {
      ...inputValues,
      [id]: value,
    };
    setInputValues(newValues);

    const hasAnyChange = Object.keys(newValues).some(
      (key) => newValues[key] !== initialValues[key]
    );
    setHasChanges(hasAnyChange);
  };

  const handleUpdate = async () => {
    toast("Params updated successfully");
    if (!streamKey) return;
    updateParams(streamKey, inputValues, gatewayHost);
    setInitialValues({ ...inputValues });

    setHasChanges(false);
  };

  const handleRun = async (): Promise<void> => {
    const { data: stream, error } = await upsertStream(
      {
        pipeline_id: pipeline.id,
        pipeline_params: inputValues,
      },
      user?.id ?? ""
    );

    if (error) {
      toast.error(`Error creating stream for playback ${error}`);
      return;
    }
    setStreamId(stream.id);
    setStreamInfo(stream);
    setStreamUrl(`${app.whipUrl}${stream.stream_key}/whip`);
    setGatewayHost(stream.gateway_host);
    setStreamKey(stream.stream_key);
  };

  const inputs = pipeline.config.inputs;

  const createDefaultValues = () => {
    const primaryInput = inputs.primary;
    const advancedInputs = inputs.advanced;
    const allInputs = [primaryInput, ...advancedInputs];
    return allInputs.reduce((acc, input) => {
      acc[input.id] = input.defaultValue;
      return acc;
    }, {});
  };

  useEffect(() => {
    const defaultValues = createDefaultValues();
    setInputValues(defaultValues);
    setInitialValues(defaultValues);
    if (!streamId) {
      handleRun();
    }
  }, [pipeline]);

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
    <div>
      <div className="flex justify-end h-10">
        {streamId && (
          <>
            <Button onClick={handleUpdate} disabled={!hasChanges}>
              Save Parameters
            </Button>
          </>
        )}
      </div>
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">Source</Label>
          <Select
            defaultValue="Video"
            value={source}
            disabled
            onValueChange={setSource}
          >
            <SelectTrigger>
              <SelectValue placeholder="Video" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Video">Webcam</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {inputs.primary && (
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">
              {inputs.primary.label}
            </Label>
            {renderInput(inputs.primary)}
          </div>
        )}

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

        <div className="flex flex-col gap-1.5">
          <Label className="text-muted-foreground">Video Source</Label>
          <div className="flex flex-row h-[300px] w-full bg-sidebar rounded-2xl items-center justify-center overflow-hidden relative">
            {streamUrl ? (
              <BroadcastWithControls ingestUrl={streamUrl} />
            ) : (
              <p className="text-muted-foreground">
                Waiting for stream to start...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
