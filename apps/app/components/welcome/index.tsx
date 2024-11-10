"use client";

import React, { useState } from "react";
import FeaturedPipelines from "./featured";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea, ScrollBar } from "@repo/design-system/components/ui/scroll-area";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption, TableFooter } from "@repo/design-system/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/design-system/components/ui/avatar";

export default function Head() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const contentVariants = {
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: {
          duration: 0.5,
          ease: [0.32, 0.72, 0, 1], // Custom easing for smoother motion
        },
        opacity: {
          duration: 0.4,
          delay: 0.1,
        },
      },
    },
    collapsed: {
      height: "64px", // Match the height of the header when collapsed
      opacity: 0,
      transition: {
        height: {
          duration: 0.5,
          ease: [0.32, 0.72, 0, 1],
        },
        opacity: {
          duration: 0.3,
        },
      },
    },
  };

  return (
    <div className="relative border rounded-2xl">
      {isCollapsed && (
        <div className="absolute top-0 left-0 p-4">
          <h3 className="font-medium text-lg">Featured Pipelines</h3>
        </div>
      )}

      <motion.div
        className="absolute right-0 top-1 p-4 cursor-pointer z-10"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{isCollapsed ? "Expand" : "Collapse"}</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        <motion.div
          variants={contentVariants}
          initial="expanded"
          animate={isCollapsed ? "collapsed" : "expanded"}
          exit="collapsed"
          className="overflow-hidden"
        >
          <ScrollArea className="">
            <div className="grid grid-cols-4 gap-10 p-4 rounded-2xl">
              <Intro />
              <Leaderboard />
              <div className="col-span-2">
                <FeaturedPipelines />
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const Intro = () => {
  return (
    <div className="col-span-1">
      <h3 className="font-medium text-lg">
        Welcome to Livepeer
      </h3>
      <p className="text-sm text-muted-foreground mt-3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
      <Input
        className="mt-5 h-11"
        placeholder="I want to build a live portrait app..."
      />
      <div>
        <Button className="mt-5 w-auto">Create a pipeline</Button>
        <Button variant="ghost" className="mt-5 w-auto ml-2">
          What is a Pipeline? <ArrowTopRightIcon className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const data = [
    { name: "Text to Speech", author: "johndoe", usage: 100 },
    { name: "Image to Image", author: "janedoe", usage: 95 },
    { name: "Video to Video", author: "janedoe", usage: 95 },
  ];

  return (
    <div className="col-span-1">
      <h3 className="font-medium text-lg">
        Leaderboard
      </h3>
     <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pipeline</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Usage</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell className="flex items-center gap-2">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={`https://github.com/suhailkakar.png`} />
                </Avatar>
                {row.author}</TableCell>
              <TableCell>{row.usage}k mins</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <div className="mt-1">
          <Button variant="ghost">See all <ArrowTopRightIcon className="w-4 h-4 ml-1" /></Button>
        </div>
      </Table>
    </div>
  )
};
