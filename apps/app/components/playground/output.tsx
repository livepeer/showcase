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
  pipeline: string;
}) {
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_STUDIO_API_KEY,
  });

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [playbackInfo, setPlaybackInfo] = useState<any>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (tab === "try") {
      if (isRunning) {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [tab, isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const pipelineData = pipelines.find((p) => p.id === pipeline);

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
    console.log("playbackInfo", playbackInfo);
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
        {tab === "remix" && pipelineData?.isComfyUI && (
          <iframe
            src="https://comfyui.alpha.fal.ai/"
            className="w-full h-full rounded-2xl"
          />
        )}
        {playbackInfo && (
          <div className="w-full h-full  relative overflow-hidden z-10">
            <LPPLayer src={getSrc(playbackInfo)} />
          </div>
        )}
      </div>

      <AlertDialog open={showModelInfo} onOpenChange={setShowModelInfo}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-medium">
              {pipelineData?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pipelineData?.description}
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
