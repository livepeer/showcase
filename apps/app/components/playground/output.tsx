"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Info, Share } from "lucide-react";
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

export default function Output({
  tab,
}: {
  tab: string | string[] | undefined;
}) {
  const searchParams = useSearchParams();

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showModelInfo, setShowModelInfo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (tab === "try") {
      const isRunning = searchParams.get("isRunning");
      if (isRunning) {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [tab, searchParams]);

  const showCamera = async () => {
    const constraints: MediaStreamConstraints = {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "user",
      },
      audio: false,
    };

    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      // Ensure video plays after loading
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error("Error playing video:", error);
        });
      }
    }

    setStream(mediaStream);
  };

  useEffect(() => {
    if (tab === "try" && searchParams.get("isRunning")) {
      showCamera();
    }
  }, [tab, searchParams]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const pipeline = searchParams.get("pipeline");
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex justify-end mb-4 space-x-4">
        <Button
          variant="outline"
          onClick={() => setShowModelInfo(!showModelInfo)}
        >
          <Info className="mr-2" /> View model info
        </Button>
        <Button variant="outline" onClick={copyLink}>
          <Share className="mr-2" /> Share Pipeline
        </Button>
      </div>
      <div className="flex-grow min-h-0 bg-sidebar rounded-2xl relative">
        {tab === "remix" && pipelineData?.isComfyUI && (
          <iframe
            src="https://comfyui.alpha.fal.ai/"
            className="w-full h-full rounded-2xl"
          />
        )}
        {tab === "try" && searchParams.get("isRunning") && (
          <div className="w-full h-full">
            <video
              className="w-full h-full rounded-2xl object-cover"
              autoPlay
              muted
              loop
              ref={videoRef}
            />
            <div className="absolute bottom-4 right-4 text-xl px-2 py-1 font-medium bg-white rounded-md">
              {formatTime(timeLeft)}
            </div>
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
