import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import React from "react";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";

export default function Explore() {
  return (
    <div className="flex-shrink-0 mt-2">
      <h3 className="font-medium text-lg">Explore Pipelines</h3>
      <p className="text-muted-foreground text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>

      <div className="flex flex-row gap-2 mt-6">
        <Filter />
      </div>
    </div>
  );
}

const Filter = () => {
  const types = [
    "Text to image",
    "Image to image",
    "Video to image",
    "Image to video",
    "Video to video",
    "Image to text",
    "Text to video",
  ];
  return (
    <div className="w-[15%] flex flex-col space-y-4">
      <div>
        <Label>Filter</Label>
        <Input placeholder="Search" />
      </div>
      <div>
        <Label>Pipeline Type</Label>
        <div className="flex flex-col space-y-2 mt-2">
          {types.map((type) => (
            <div className="flex items-center space-x-2 bg-sidebar p-3 rounded-md">
              <Checkbox className="" id={type} />
              <Label className="text-foreground/80 font-normal" htmlFor={type}>
                {type}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <Label>Comfy UI supported</Label>
        <div className="flex flex-col space-y-2 mt-2">
          <div className="flex items-center space-x-2 bg-sidebar p-3 rounded-md">
            <Checkbox className="" id="comfyui" />
            <Label className="text-foreground/80 font-normal" htmlFor="comfyui">
              Comfy UI supported
            </Label>
          </div>
          <div className="flex items-center space-x-2 bg-sidebar p-3 rounded-md">
            <Checkbox className="" id="comfyuinot" />
            <Label
              className="text-foreground/80 font-normal"
              htmlFor="comfyuinot"
            >
              Comfy UI not supported
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};
