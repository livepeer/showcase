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
  const [prompt, setPrompt] = useState<string>("");
  const [streamId, setStreamId] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const { user } = usePrivy();

  const client = new Client({
    baseUrl: "rtmp://rtmp.livepeer.monster:1945",
  });

  const handleRun = async (): Promise<void> => {
    // Step 1: Create a stream
    const stream = await createStream(
      {
        pipeline_id: "pip_p4XsqEJk2ZqqWLuw",
        pipeline_params: {
          prompt,
        },
      },
      user?.id ?? ""
    );

    setStreamId(stream.id);
    setStreamInfo(stream);
    setStreamUrl(
      `https://mdw-staging.livepeer.monster/aiWebrtc/${stream.stream_key}/whip`
    );
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
        <Select
          defaultValue="webcam"
          value={source}
          disabled
          onValueChange={setSource}
        >
          <SelectTrigger>
            <SelectValue placeholder="Webcam" />
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
          {streamUrl && <BroadcastWithControls ingestUrl={streamUrl} />}

          {!streamUrl && (
            <p className="text-muted-foreground">
              Click on the "Run" button to begin
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
