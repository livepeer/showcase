import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import React from "react";
import { Checkbox } from "@repo/design-system/components/ui/checkbox";
import {
  ScrollArea,
  ScrollBar,
} from "@repo/design-system/components/ui/scroll-area";
import Modals from "@/components/modals";
import PipelineTile from "@/components/welcome/featured/tile";
import { pipelines } from "@/components/welcome/featured";
import { Scroll } from "lucide-react";

export default function Explore({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="flex-shrink-0 mt-2">
      <h3 className="font-medium text-lg">Explore Pipelines</h3>
      <p className="text-muted-foreground text-sm">
       Discover and experiment with community-built pipelines.
      </p>

      <div className="flex  mt-8">
        <Filter />
        <div className="w-full md:w-3/4 md:border-l border-border/50 md:ml-[3rem] md:pl-[3rem]">
          <FeaturedPipelines />
          <div className="border p-4  mt-6">
            <div>
              <h3 className="font-medium text-lg">Browse All Pipelines</h3>
              <p className="text-muted-foreground text-sm">
                Explore the entire collection of community-built video AI pipelines.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1  md:grid-cols-2 gap-6 lg:grid-cols-3 w-full">
              {pipelines.map((pipeline, index) => (
                <PipelineTile
                  key={index}
                  id={pipeline.id}
                  title={pipeline.title}
                  description={pipeline.description}
                  image={`/images/${pipeline.image}`}
                  isComfyUI={pipeline.isComfyUI || false}
                  author="Suhail"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Modals searchParams={searchParams} />
    </div>
  );
}

const Filter = () => {
  return (
    <div className="hidden md:flex w-[17%] flex-col space-y-4 ">
      <div>
        <Label>Filter</Label>
        <Input className="mt-2" placeholder="Search" />
      </div>
      <div>
        <Label>ComfyUI supported</Label>
        <div className="flex flex-col space-y-2 mt-2">
          <div className="flex items-center space-x-2 bg-sidebar p-3 ">
            <Checkbox className="" id="comfyui" />
            <Label className="text-foreground/80 font-normal" htmlFor="comfyui">
              ComfyUI supported
            </Label>
          </div>
          {/* 
          UNNECESSARY UNTIL WE SUPPORT NON-COMFY PIPELINES
          <div className="flex items-center space-x-2 bg-sidebar p-3 ">
            <Checkbox className="" id="comfyuinot" />
            <Label
              className="text-foreground/80 font-normal"
              htmlFor="comfyuinot"
            >
              Comfy UI not supported
            </Label>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const FeaturedPipelines = () => {
  const featuredPipelines = pipelines.filter((pipeline) => pipeline.isFeatured);
  const featuredPipelinesLimited = featuredPipelines.slice(0, 3);

  return (
    <div className="border p-4 ">
      <div>
        <h3 className="font-medium text-lg">Featured Pipelines</h3>
        <p className="text-muted-foreground text-sm">
        Hand-picked examples showcasing different video AI capabilities. Perfect for getting started or finding inspiration.
        </p>
      </div>

      <div className="flex md:flex-row flex-col md:space-x-4  mt-2 overflow-x-auto">
        {featuredPipelinesLimited.map((pipeline, index) => (
          <PipelineTile
            key={index}
            id={pipeline.id}
            isFeatured={true}
            title={pipeline.title}
            description={pipeline.description}
            image={`/images/${pipeline.image}`}
            isComfyUI={pipeline.isComfyUI || false}
            author="Suhail"
          />
        ))}
      </div>
    </div>
  );
};
