"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import {
  Tabs as TabsC,
  TabsContent,
} from "@repo/design-system/components/ui/tabs";
import Tabs from "./tab";
import Try from "./try";
import { motion, AnimatePresence } from "framer-motion";
import track from "@/lib/track";
import { usePrivy } from "@privy-io/react-auth";

export default function Form({
  tab,
  onTabChange,
  onRunClick,
  setStreamInfo,
  pipeline,
}: {
  tab: string;
  onTabChange: (tab: string) => void;
  onRunClick: (isRunning: boolean) => void;
  setStreamInfo: (streamInfo: any) => void;
  pipeline: any;
}) {
  const { user } = usePrivy();
  const [isRunPipelineLoading, setIsRunPipelineLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(tab);

  const handleValueChange = (value: string) => {
    setActiveTab(value);
    onTabChange(value);
    
    // Track when user switches to learn tab
    track(value + "_tab_clicked", {
      pipeline_id: pipeline?.id,
      pipeline_name: pipeline?.name,
      pipeline_type: pipeline?.type
    }, user || undefined);
  };

  const handleDownloadJson = () => {
    // Add download logic here
    track("pipeline_json_downloaded", {
      pipeline_id: pipeline?.id,
      pipeline_name: pipeline?.name,
      pipeline_type: pipeline?.type
    }, user || undefined);
  };

  return (
    <div className="w-full h-full overflow-y-auto rounded-lg p-0.5 overflow-hidden z-10  pr-6 pt-6  ">
      <TabsC
        onValueChange={handleValueChange}
        value={activeTab}
        defaultValue="try"
        className="h-full"
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <Tabs />
          <div className="flex flex-row gap-2 mt-4 md:mt-0  md:w-auto self-end relative">
            <HeartButton />
            {tab === "try" && (
              <>
                {isRunPipelineLoading ? (
                  <Button
                    onClick={() => {
                      setIsRunPipelineLoading(false);
                      onRunClick(false);
                    }}
                  >
                    <Loader2 className="animate-spin" />
                    Running...
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setIsRunPipelineLoading(true);
                      track("pipeline_run", {
                        pipeline_id: pipeline?.id,
                        pipeline_name: pipeline?.name,
                        pipeline_type: pipeline?.type
                      }, user || undefined);
                    }}
                  >
                    Run Pipeline
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
        <TabsContent value={"try"}>
          <Try
            pipeline={pipeline}
            setStreamInfo={setStreamInfo}
            isRunning={isRunPipelineLoading}
          />
        </TabsContent>
        <TabsContent value="remix">
          <div className="flex flex-col gap-6 my-6 h-full">
            {pipeline?.type === "comfyUI" ? (
              <p className="font-medium">
                Inspired by this pipeline?
                <br />
                <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Quisquam, quos. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Quisquam, quos.
              </p>
            ) : (
              <p className="font-medium">
                This pipeline is not supported by ComfyUI.
                <br />
                <br />
                Custom Python pipelines coming in March 2025
              </p>
            )}
          </div>
          {pipeline?.type === "comfyUI" && (
            <div className="flex flex-row gap-2">
              <Button variant="outline">View JSON</Button>
              <Button onClick={handleDownloadJson}>Download JSON</Button>
            </div>
          )}
        </TabsContent>
      </TabsC>
    </div>
  );
}

const HeartButton = () => {
  const [isLiked, setIsLiked] = useState(false);

  // Generate more particles with varying shapes
  const particles = Array.from({ length: 12 }).map(() => ({
    x: Math.random() * 100 - 50, // Wider spread
    y: Math.random() * -80 - 20, // Higher spread
    rotation: Math.random() * 720 - 360, // More rotation
    scale: Math.random() * 0.6 + 0.4,
    shape: Math.random() > 0.5 ? "circle" : "heart", // Randomize shapes
  }));

  return (
    <Button
      size="icon"
      variant="outline"
      className="max-w-10 max-h-10 relative"
      onClick={() => setIsLiked(!isLiked)}
    >
      <motion.div
        animate={
          isLiked
            ? {
                scale: [1, 1.5, 0.8, 1.2, 1],
                rotate: [0, -20, 20, -10, 0],
                y: [0, -5, 5, -3, 0],
              }
            : {
                scale: [1, 0.9, 1],
                rotate: 0,
                y: 0,
              }
        }
        transition={{
          duration: isLiked ? 0.7 : 0.3,
          type: "spring",
          stiffness: 400,
          damping: 15,
        }}
        className="relative z-10"
      >
        <Heart
          className={`h-4 w-4 transition-all duration-300 transform ${
            isLiked
              ? "fill-red-500 stroke-red-500 scale-110"
              : "fill-none stroke-current group-hover:stroke-red-400 group-hover:scale-105"
          }`}
        />
      </motion.div>

      <AnimatePresence>
        {isLiked &&
          particles.map((particle, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, x: 0, y: 0, opacity: 1, rotate: 0 }}
              animate={{
                scale: particle.scale,
                x: particle.x,
                y: particle.y,
                opacity: [1, 1, 0],
                rotate: particle.rotation,
              }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.32, 0.72, 0, 1],
                opacity: { times: [0, 0.7, 1] },
              }}
              className="absolute left-1/2 top-1/2 -ml-1 -mt-1"
            >
              {particle.shape === "circle" ? (
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500" />
              ) : (
                <Heart className="w-2 h-2 fill-red-500 stroke-red-500" />
              )}
            </motion.div>
          ))}
      </AnimatePresence>

      <AnimatePresence>
        {isLiked && (
          <>
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{
                scale: [1, 2.5],
                opacity: [0.5, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-full border-2 border-red-500"
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 1 }}
              animate={{
                scale: [1, 2.2],
                opacity: [0.5, 0],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="absolute inset-0 rounded-full border-2 border-pink-500"
            />
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={
          isLiked
            ? {
                scale: [1, 2, 0],
                opacity: [0.4, 0.2, 0],
              }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.6 }}
        className="absolute inset-0 bg-gradient-to-r from-red-100 to-pink-100 rounded-full z-0"
      />

      {/* Hover ring effect */}
      <motion.div
        initial={false}
        animate={isLiked ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100  transition-opacity"
      />
    </Button>
  );
};
