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
import { createStream } from "@/app/api/streams/create";
import { usePrivy } from "@privy-io/react-auth";
import { Client } from "@livepeer/webrtmp-sdk";
import { EnableVideoIcon, StopIcon } from "@livepeer/react/assets";
import { getIngest } from "@livepeer/react/external";
import { BroadcastWithControls } from "./broadcast";

interface MediaStreamState {
  active: boolean;
  id: string;
}

export default function Try({
  isRunning,
  setStreamInfo,
}: {
  isRunning: boolean;
  setStreamInfo: (streamInfo: any) => void;
}): JSX.Element {
  const [source, setSource] = useState<string>("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const { user } = usePrivy();

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

  const client = new Client({
    baseUrl: "rtmp://rtmp.livepeer.monster:1945",
  });

  const startStreaming = async (streamKey: string): Promise<void> => {
    if (!stream) {
      setError("Video stream was not started.");
      return;
    }

    try {
      const session = client.cast(stream, streamKey);

      session.on("open", () => {
        console.log("Stream started");
      });

      session.on("close", () => {
        console.log("Stream stopped");
      });

      session.on("error", (err) => {
        console.log("Stream error:", err.message);
        setError(`Streaming error: ${err.message}`);
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to start streaming";
      console.error("Error starting stream:", errorMessage);
      setError(errorMessage);
    }
  };

  const handleRun = async (): Promise<void> => {
    // Step 1: Create a stream
    const stream = await createStream(
      {
        pipeline_id: "pip_fPJPE3QdSw2SrF6W",
        pipeline_params: {
          prompt,
        },
      },
      user?.id ?? ""
    );

    setStreamId(stream.id);
    setStreamInfo(stream);
    setStreamUrl(
      `https://origin.livepeer.monster/mediamtx/${stream.stream_key}/whip`
    );

    // Step 2: Broadcast the webcam to the streamKey and RTMP URL
    if (stream.stream_key) {
      await startStreaming(stream.stream_key);
    } else {
      setError("No stream key received from server");
    }
  };

  useEffect(() => {
    if (isRunning && !streamId) {
      handleRun();
    }
  }, [isRunning]);

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
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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

          {streamUrl && <BroadcastWithControls ingestUrl={streamUrl} />}

          {!error && !isLoading && (
            <p className="text-muted-foreground">
              Click on the "Run" button to begin
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
