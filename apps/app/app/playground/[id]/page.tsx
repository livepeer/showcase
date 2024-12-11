"use client";

import React, { useEffect, useState } from "react";
import Form from "@/components/playground/form";
import Output from "@/components/playground/output";
import { Badge } from "@repo/design-system/components/ui/badge";
import { pipelines } from "@/components/welcome/featured";
import { ScrollArea } from "@repo/design-system/components/ui/scroll-area";
import Modals from "@/components/modals";
import { getPipeline } from "@/app/api/pipelines/get";
import track from "@/lib/track";
import { usePrivy } from "@privy-io/react-auth";

export default function Playground({
  searchParams,
  params,
}: {
  searchParams: any;
  params: { id: string };
}) {
  const { user, authenticated } = usePrivy();
  const [tab, setTab] = useState<string>("try");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [streamInfo, setStreamInfo] = useState<any>(null);
  const [pipelineData, setPipelineData] = useState<any>(null);

  const getPipelineData = async () => {
    console.log("params", params);
    const pipeline = await getPipeline(params.id);
    console.log(pipeline);
    setPipelineData(pipeline);
  };

  useEffect(() => {
    getPipelineData();
  }, [params.id]);

  useEffect(() => {
    if (pipelineData) {
      track("pipeline_viewed", {
        pipeline_id: params.id,
        pipeline_name: pipelineData?.name,
        pipeline_type: pipelineData?.type,
        is_authenticated: authenticated,
        referrer: document.referrer
      }, user || undefined);
    }
  }, [pipelineData]);

  return (
    <div className="flex flex-col h-[calc(100%-1rem)]  border border-border rounded-2xl p-4">
      {pipelineData && (
        <ScrollArea className="h-full">
          <div className="flex-shrink-0 flex flex-row justify-between  w-full items-center  md:w-[34%] h-10">
            <h3 className="text-lg font-medium">{pipelineData?.name}</h3>
            {tab === "remix" && (
              <div>
                {pipelineData?.type === "comfyUI" ? (
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
            <div className="w-full md:w-[35%] flex-shrink-0 overflow-hidden flex flex-col ">
              <Form
                tab={tab}
                onTabChange={setTab}
                onRunClick={(isRunning) => setIsRunning(isRunning)}
                setStreamInfo={setStreamInfo}
                pipeline={pipelineData}
              />
            </div>
            <div className="flex-grow overflow-hidden ">
              <Output
                tab={tab as string}
                isRunning={isRunning}
                pipeline={pipelineData}
                streamInfo={streamInfo}
              />
            </div>
          </div>
        </ScrollArea>
      )}
      <Modals searchParams={searchParams} />
    </div>
  );
}
