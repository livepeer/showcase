
"use client";

import React, {useEffect, useRef, useState} from "react";
import {Button} from "@repo/design-system/components/ui/button";
import {LoaderCircleIcon} from "lucide-react";
import LoggedOutComponent from "@/components/modals/logged-out";
import StreamForm from "@/components/stream/stream-form";
import {getStream} from "@/app/api/streams/get";
import {createStream} from "@/app/api/streams/create";
import {usePrivy} from "@privy-io/react-auth";
import {ExternalToast, toast} from "sonner";
import {useRouter} from "next/navigation";
import Modals from "@/components/modals";

export function Stream({
                          searchParams,
                          params,
                        }: {
  searchParams: any;
  params: { id: string };
}){

  const streamId = params.id;
  const router = useRouter();
  const { authenticated, user, ready: isAuthLoaded } = usePrivy();
  const [stream, setStream] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toastOptions:ExternalToast = {
    position: 'top-center',
    richColors: true
  };

  const streamFormRef = useRef<any>(null);

  const fetchStream = async () => {
    if (!streamId || streamId === "create") return;
    const { data: fetchedStream, error } = await getStream(streamId);
    if (error) {
      toast.error("Failed to fetch stream: " + error, toastOptions);
      return;
    }
    setStream(fetchedStream);
  };

  useEffect(() => {
    if (streamId && streamId !== "create" && !stream) {
      fetchStream();
      setIsLoading(false);
    }
  }, [streamId]);

  const handleSaveStream = async () => {
    if (streamFormRef.current) {
      const updatedStream = streamFormRef.current.getFormData();

      //make sure that stream has a name and a pipeline id before saving
      if (!updatedStream.name || !updatedStream.pipeline.id) {
        toast.error("Stream must have a name and a pipeline", toastOptions);
        return;
      }

      if(!updatedStream.output_stream_url){
        toast.error("Stream must have a a Destination URL", toastOptions);
        return;
      }

      try{
        new URL(updatedStream.output_stream_url)
      }catch(e){
        toast.error("The destination url provided is invalid.  It must be a valid url.", toastOptions);
        return;
      }

      const toastId = toast.loading("Saving stream...", toastOptions);
      updatedStream.author = user?.id;
      const { data: savedStream, error } = await createStream(updatedStream, updatedStream.author);
      if (error) {
        toast.error("Failed to save stream: " + error, toastOptions);
        return;
      }
      toast.dismiss(toastId);
      toast.success("Saved stream!", toastOptions);
      setStream(savedStream);
      router.push(`/streams/my-streams`);
    }
  };

  return (
      <div className="p-4">
        {!isAuthLoaded || isLoading ? (
            <LoaderCircleIcon className="w-8 h-8 animate-spin" />
        ) : (
            <>
              <h4 className="text-lg mb-4 font-medium">
                {!stream ? "Create" : "Edit"} Stream
              </h4>
              {authenticated ? (
                  <>
                    <StreamForm
                        pipeline={stream?.pipelines }
                        stream={stream}
                        ref={streamFormRef}
                    />
                    <div className="pt-10">
                      <Button onClick={handleSaveStream} className="mt-4">
                        Save
                      </Button>
                    </div>
                  </>
              ) : (
                  <LoggedOutComponent text="Sign in to create or edit a stream" />
              )}
            </>
        )}
        <Modals searchParams={searchParams} />
      </div>
  );
}

export default Stream;
