"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Label } from "@repo/design-system/components/ui/label";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@repo/design-system/components/ui/badge";
import { cn } from "@repo/design-system/lib/utils";

export default function PipelineTile({
  title,
  description,
  image,
  isComfyUI,
  author,
  id,
}: {
  title: string;
  description: string;
  image: string;
  isComfyUI: boolean;
  author: string;
  id: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isHovering, setIsHovering] = useState(false);

  const tab = searchParams.get("tab");
  const pipeline = searchParams.get("pipeline");

  const isSelected = pipeline === id;

  return (
    <motion.div
      onClick={() => {
        router.replace(`?pipeline=${id}&tab=${tab}`);
      }}
      animate={{
        scale: isSelected ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={cn(
        "min-w-[20rem] h-48 rounded-xl relative cursor-pointer ml-2",
        isSelected && "border-2 border-foreground"
      )}
    >
      <div className="flex flex-col justify-between p-4 overflow-visible relative z-10 h-full">
        <div className="flex justify-between items-center h-[2rem]">
          {isComfyUI ? (
            <Badge className="font-medium text-xs">Comfy UI supported</Badge>
          ) : (
            <div>
              <div />
            </div>
          )}
          <div
            className="flex items-center justify-end relative"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <motion.div
              className="flex items-center justify-end"
              animate={{
                width: isHovering ? "auto" : "24px",
              }}
              transition={{
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.div
                className={cn(
                  "flex items-center gap-2 bg-white rounded-full overflow-hidden",
                  isHovering ? "px-3 py-1" : "p-0"
                )}
                animate={{
                  width: isHovering ? "auto" : "24px",
                }}
                transition={{
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Image
                  src={"/suhail.png"}
                  alt="suhail"
                  width={100}
                  height={100}
                  className="rounded-full w-6 h-6 flex-shrink-0"
                />
                <AnimatePresence>
                  {isHovering && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{
                        duration: 0.2,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="text-xs text-black whitespace-nowrap"
                    >
                      @{author}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-white font-medium">{title}</p>
          <Label className="text-xs text-gray-300">{description}</Label>
        </div>
      </div>
      <Image
        className="absolute top-0 left-0 w-full h-full object-cover rounded-[10px]"
        src={image}
        alt="pipeline"
        width={500}
        height={500}
      />
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 via-black/60 to-transparent rounded-b-[10px]" />
    </motion.div>
  );
}
