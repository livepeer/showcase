"use client";

import React, { useEffect, useState } from "react";
import Form from "@/components/playground/form";
import Output from "@/components/playground/output";
import { Badge } from "@repo/design-system/components/ui/badge";
import { useSearchParams, useRouter } from "next/navigation";
import { pipelines } from "@/components/welcome/featured";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import Modals from "@/components/modals";

export default function Playground({
  searchParams,
  params,
}: {
  searchParams: any;
  params: { id: string };
}) {
  const [tab, setTab] = useState<string>("try");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const pipelineData = pipelines.find((p) => p.id === params.id);

  return (
    <div className="flex flex-col h-[calc(100%-1rem)]  border border-border rounded-2xl p-4">
      <ScrollArea className="h-full">
        <div className="flex-shrink-0 flex flex-row justify-between  w-full items-center  md:w-[34%] h-10">
          <h3 className="text-lg font-medium">{pipelineData?.title}</h3>
          {tab === "remix" && (
            <div>
              {pipelineData?.isComfyUI ? (
                <Badge className="font-medium text-sm px-4 rounded-full bg-[#04FF00]/40 text-foreground hover:bg-[#04FF00]/60">
                  Comfy UI supported
                </Badge>
              ) : (
                <Badge className="font-medium text-sm px-4 py-1 rounded-full bg-[#FF0000]/40 text-foreground hover:bg-[#FF0000]/60">
                  Comfy UI not supported
                </Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex-grow flex flex-col md:flex-row gap-14 h-full ">
          <div className="w-[35%] flex-shrink-0 overflow-hidden flex flex-col ">
            <Form
              tab={tab}
              onTabChange={setTab}
              onRunClick={(isRunning) => setIsRunning(isRunning)}
              pipeline={params.id}
            />
          </div>
          <div className="flex-grow overflow-hidden ">
            <Output
              tab={tab as string}
              isRunning={isRunning}
              pipeline={params.id}
            />
          </div>
        </div>
      </ScrollArea>
      <Modals searchParams={searchParams} />
    </div>
  );
}
