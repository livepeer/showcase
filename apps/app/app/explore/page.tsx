import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import React from "react";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import { availableModels } from "@/constants";
import ModelTile from "@/components/explore/mode-tile";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@repo/design-system/components/ui/card";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";

export default function Explore() {
  return (
    <div className="flex-shrink-0 mt-2">
      <h3 className="font-medium text-lg">Explore Pipelines</h3>
      <p className="text-muted-foreground text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>

      <div className="flex gap-[8rem] mt-8">
        <Filter />
        <div className="w-3/4">
          <ScrollArea className="h-[90vh] ">
            <CustomModelBanner />
            <div className="mt-6 grid grid-cols-3 gap-6 grid-rows-3 w-full   ">
              {availableModels.map((model, i) => (
                <ModelTile key={i} model={model} />
              ))}
            </div>
          </ScrollArea>
        </div>
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
    <div className="w-[17%] flex flex-col space-y-4 ">
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

const CustomModelBanner = () => {
  return (
    <Card className="relative ">
      <CardHeader>
        <CardTitle>Bring Your Custom AI Models to Livepeer</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="w-3/5">
          Leverage Livepeer's decentralized infrastructure to run AI models at
          scale: open-source, LoRA fine-tuned, custom ML, and proprietary
          solutions. Our network supports diverse architectures, delivers
          high-performance inference, and offers seamless API integration.
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-row gap-4">
        <Button>Request custom model</Button>
        <Button asChild variant="outline">
          <Link target="_blank" href="https://discord.gg/livepeer">
            Join Livepeer Community
          </Link>
        </Button>
      </CardFooter>
      <div className="absolute top-0 right-0 w-2/5 h-full">
        <Image
          src="/ai/banner.webp"
          className="w-full h-full object-cover"
          alt="Custom Model"
          width={500}
          height={500}
        />
      </div>
    </Card>
  );
};
