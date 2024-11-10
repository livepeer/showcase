"use client";

import React, { useEffect } from "react";
import Form from "./form";
import Output from "./output";
import { Badge } from "@repo/design-system/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation";
import { pipelines } from "../welcome/featured/index";

export default function Playground() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = searchParams.get("tab");
  const pipeline = searchParams.get("pipeline");
  const pipelineData = pipelines.find((p) => p.id === pipeline);

  return (
    <div className="flex flex-col h-[calc(100%-1rem)] mt-6  border border-border rounded-2xl p-4">
      <div className="flex-shrink-0 flex flex-row justify-between items-center w-full md:w-[27.5%] h-10">
        <h3 className="text-lg font-medium">{pipelineData?.title}</h3>
        {tab === "remix" && (
          <>
            {pipelineData?.isComfyUI ? (
              <Badge className="font-medium text-sm px-4 rounded-full bg-[#04FF00]/40 text-foreground hover:bg-[#04FF00]/60">
                Comfy UI supported
              </Badge>
            ) : (
              <Badge className="font-medium text-sm px-4 py-1 rounded-full bg-[#FF0000]/40 text-foreground hover:bg-[#FF0000]/60">
                Comfy UI not supported
              </Badge>
            )}
          </>
        )}
      </div>
      <div className="flex-grow flex flex-col md:flex-row gap-14 h-full mt-4">
        <div className="w-1/3 flex-shrink-0 overflow-hidden flex flex-col">
          <Form tab={tab as string} />
        </div>
        <div className="flex-grow overflow-hidden">
          <Output tab={tab as string} />
        </div>
      </div>
    </div>
  );
}
