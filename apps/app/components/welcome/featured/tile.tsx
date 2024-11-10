"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Label } from "@repo/design-system/components/ui/label";
import { cn } from "@repo/design-system/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
        router.replace(`?pipeline=${id}`);
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
        "relative ml-2 h-48 min-w-[20rem] cursor-pointer rounded-xl",
        isSelected && "border-2 border-foreground"
      )}
    >
      <div className="relative z-10 flex h-full flex-col justify-between overflow-visible p-4">
        <div className="flex h-[2rem] items-center justify-between">
          {isComfyUI ? (
            <Badge className="font-medium text-xs">Comfy UI supported</Badge>
          ) : (
            <div>
              <div />
            </div>
          )}
          <div
            className="relative flex items-center justify-end"
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
                  "flex items-center gap-2 overflow-hidden rounded-full bg-white",
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
                  src="/suhail.png"
                  alt="suhail"
                  width={100}
                  height={100}
                  className="h-6 w-6 flex-shrink-0 rounded-full"
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
                      className="whitespace-nowrap text-black text-xs"
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
          <p className="font-medium text-white">{title}</p>
          <Label className="text-gray-300 text-xs">{description}</Label>
        </div>
      </div>
      <Image
        className="absolute top-0 left-0 h-full w-full rounded-[10px] object-cover"
        src={image}
        alt="pipeline"
        width={500}
        height={500}
      />
      <div className="absolute bottom-0 left-0 h-1/2 w-full rounded-b-[10px] bg-gradient-to-t from-black/60 via-black/60 to-transparent" />
    </motion.div>
  );
}
