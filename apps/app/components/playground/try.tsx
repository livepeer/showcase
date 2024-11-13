"use client";

import React, { useState, useRef, useEffect } from "react";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Textarea } from "@repo/design-system/components/ui/textarea";

interface MediaStreamState {
  active: boolean;
  id: string;
}

export default function Try(): JSX.Element {
  const [source, setSource] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const startWebcam = async (): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      console.log("Starting webcam...");
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user",
        },
        audio: false,
      };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

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
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access webcam";
      console.error("Error accessing webcam:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopWebcam = (): void => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setError("");
  };

  useEffect(() => {
    if (source === "webcam") {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [source]);

  return (
    <div className="flex flex-col gap-4 mt-5">
      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground">Source</Label>
        <Select value={source} onValueChange={setSource}>
          <SelectTrigger>
            <SelectValue placeholder="Select a source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webcam">Webcam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground">Prompt</Label>
        <Textarea
          className="h-44"
          placeholder="a cat in a business suit sitting in a crowded subway train during rush hour, commuting, sad expressions. intricate details, photo taken on Hasselblad, creative photoshoot, unreal render 8k"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-muted-foreground">Stream Source</Label>
        <div className="flex flex-row h-[300px] w-full bg-sidebar rounded-2xl items-center justify-center overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <p className="text-muted-foreground">Loading camera...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-50">
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}

          {source === "webcam" && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />
          )}

          {!source && !error && !isLoading && (
            <p className="text-muted-foreground">Select a source to begin</p>
          )}
        </div>
      </div>
    </div>
  );
}
