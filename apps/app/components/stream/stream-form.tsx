import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { Input } from "@repo/design-system/components/ui/input";
import { Switch } from "@repo/design-system/components/ui/switch";
import { cn } from "@repo/design-system/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import Search from "../header/search";

const StreamForm = forwardRef(
(
  { stream }: { stream?: any | null },
  ref: React.Ref<any>
) => {

  const [inputValues, setInputValues] = useState<Record<string, any>>(() =>
    stream?.pipeline_params || {}
  );
  const [isOpen, setIsOpen] = useState(true);
  const [selectedPipeline, setSelectedPipeline] = useState<any | null>(stream?.pipelines || {});
  const [selectedStream, setSelectedStream] = useState<any | null>(stream || "");
  const [inputs, setInputs] = useState<Record<string, any>>(selectedPipeline?.config?.inputs || {})

  useEffect(() => {
    const defaultValues = createDefaultValues();
    setInputValues(defaultValues);
  }, [inputs]);

  useEffect(() => {
    setInputs(selectedPipeline?.config?.inputs);
  }, [selectedPipeline]);

  const handleInputChange = (id: string, value: any) => {
    if (['name', 'output_stream_url'].includes(id)) {
      setSelectedStream((prev: any) => ({
        ...prev,
        [id]: value
      }));
    } else {
      setInputValues((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      ...selectedStream,
      pipelines: selectedPipeline,
      pipeline_id: selectedPipeline.id,
      pipeline_params: inputValues,
    }),
    
  }));

  const createDefaultValues = () => {
    const primaryInput = inputs?.primary;
    const advancedInputs = inputs?.advanced || [];
    const allInputs = [primaryInput, ...advancedInputs];
    if (allInputs.length === 0) return {};
    return allInputs.reduce((acc, input) => {
      if (!input?.id) return acc;
      //if there is an existing stream and the pipeline is same as the selectedPipeline, use the values from the
      //stream.pipeline_params object instead of the default values
      if (selectedStream && selectedStream?.pipelines === selectedPipeline && selectedStream?.pipeline_params) {
        acc[input.id] = selectedStream.pipeline_params?.[input.id];
        return acc;
      }
      acc[input.id] = input.defaultValue;
      return acc;
    }, {});
  };

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
            value={typeof inputValues[input.id] === "object" ? JSON.stringify(inputValues[input.id], undefined, 4) : inputValues[input.id]}
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
      <div className="flex items-center gap-8">
        <h6>Pipeline</h6>
        <Search onPipelineSelect={setSelectedPipeline} pipeline={selectedPipeline}/>
      </div>

      {(selectedStream?.pipelines || selectedPipeline) &&
        <>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">
              Stream Name
            </Label>
            <Input
                  type="text"
                  placeholder={"Stream Name"}
                  value={selectedStream?.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
          </div>
          {stream?.stream_key && (
            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground">
                Stream Key
              </Label>
              {stream?.stream_key}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">
              Stream Destination
            </Label>
            <Input
                  type="text"
                  placeholder={"Stream Destination URL (RTMP)"}
                  value={selectedStream?.output_stream_url}
                  onChange={(e) => handleInputChange('output_stream_url', e.target.value)}
                />
            {/* <RestreamDropdown onOutputStreamsChange={setStreamOutputs} initialStreams={selectedStream?.restream_config} /> */}
          </div>
        </>
      }

      {/* Primary Input (Prompt) */}
      {inputs?.primary && (
        <div className="flex flex-col gap-2">
          <Label className="text-muted-foreground">
            {inputs?.primary.label}
          </Label>
          {renderInput(inputs?.primary)}
        </div>
      )}

      {/* Advanced Settings Collapsible */}
      {inputs?.advanced && inputs.advanced.length > 0 && (
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
                    {(inputs?.advanced || [])
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
      )}
    </div>
  );
});

export default StreamForm;
