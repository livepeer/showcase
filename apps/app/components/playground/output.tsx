"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Info, PauseIcon, PlayIcon, Share } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { pipelines } from "../welcome/featured/index";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@repo/design-system/components/ui/alert-dialog";
import { Livepeer } from "livepeer";
import { getSrc } from "@livepeer/react/external";
import * as Player from "@livepeer/react/player";
import { LPPLayer } from "./player";

export default function Output({
  tab,
  isRunning,
  pipeline,
  streamInfo,
}: {
  tab: string | string[] | undefined;
  isRunning: boolean;
  streamInfo: any;
  pipeline: any;
}) {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const livepeer = new Livepeer({
    serverURL: "https://livepeer.monster/api",
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_API_KEY,
  });

  const [playbackInfo, setPlaybackInfo] = useState<any>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);

  const modelInfo = [
    {
      title: "Model Type",
      value: "Lightning",
    },
    {
      title: "Model Size",
      value: "1.3GB",
    },
    {
      title: "Model Speed",
      value: "10 FPS",
    },
    {
      title: "Model Cost",
      value: "$0.00",
    },
    {
      title: "Model License",
      value: "Commercial",
    },
  ];

  const handleGetPlaybackInfo = async () => {
    const { playbackInfo } = await livepeer.playback.get(
      streamInfo.output_playback_id
    );
    setPlaybackInfo(playbackInfo);
  };

  useEffect(() => {
    if (streamInfo) {
      handleGetPlaybackInfo();
    }
  }, [streamInfo]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-shrink-0 flex justify-end mb-4 space-x-4">
        <Button
          variant="outline"
          onClick={() => setShowModelInfo(!showModelInfo)}
        >
          <Info className="mr-2" /> View pipeline info
        </Button>
        <Button variant="outline" onClick={copyLink}>
          <Share className="mr-2" /> Share Pipeline
        </Button>
      </div>
      <div className="bg-sidebar rounded-2xl relative h-[calc(100vh-16rem)] w-full">
        {tab === "remix" && pipeline?.type === "comfyUI" && (
          <iframe
            src="https://comfyui.alpha.fal.ai/"
            className="w-full h-full rounded-2xl"
          />
        )}
        {streamInfo?.output_playback_id && (
          <div className="w-full h-full  relative overflow-hidden z-10">
            <LPPLayer output_playback_id={streamInfo?.output_playback_id} />
          </div>
        )}
      </div>

      <AlertDialog open={showModelInfo} onOpenChange={setShowModelInfo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium">
              {pipeline?.name}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pipeline?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="text-sm">
            {modelInfo.map((info) => (
              <div key={info.title} className="font-medium mt-1.5">
                {info.title}:{" "}
                <span className="text-muted-foreground">{info.value}</span>{" "}
              </div>
            ))}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
