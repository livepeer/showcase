"use client";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarImage } from "@repo/design-system/components/ui/avatar";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import {
  ScrollArea,
  ScrollBar,
} from "@repo/design-system/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import FeaturedPipelines from "./featured";
import { usePrivy } from "@privy-io/react-auth";
import { cn } from "@repo/design-system/lib/utils";
import track from "@/lib/track";

export default function Head() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { authenticated } = usePrivy();

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
    <div className="relative rounded-2xl border">
      {isCollapsed && (
        <div className="absolute top-0 left-0 p-4">
          <h3 className="font-medium text-lg">Featured Pipelines</h3>
        </div>
      )}

      <motion.div
        className="absolute top-1 right-0 z-10 cursor-pointer p-4"
        onClick={() => {
          track("welcome_collapse_clicked");
          setIsCollapsed(!isCollapsed);
        }}
      >
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <span>{isCollapsed ? "Expand" : "Collapse"}</span>
          <ChevronRight className="h-4 w-4" />
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
            <div className="grid grid-cols-4 gap-10 rounded-2xl p-4">
              <Intro />
              {authenticated && <MyStats />}
              <Leaderboard />
              <div className={cn(authenticated ? "col-span-1" : "col-span-2")}>
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
  const { user } = usePrivy();

  const name = user?.github?.name || user?.discord?.username;

  return (
    <div className="col-span-1">
      <h3 className="font-medium text-lg">
        Welcome {name ? `back, ${name}` : "to Livepeer"}
      </h3>
      <p className="mt-3 text-muted-foreground text-sm">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
      </p>
      <Input
        className="mt-5 h-11"
        placeholder="I want to build a live portrait app..."
      />
      <div>
        <Button
          onClick={() => {
            track("create_pipeline_clicked");
          }}
          className="mt-5 w-auto"
        >
          Create a pipeline
        </Button>
        <Button
          onClick={() => {
            track("what_is_a_pipeline_clicked");
          }}
          variant="ghost"
          className="mt-5 ml-2 w-auto"
        >
          What is a pipeline? <ArrowTopRightIcon className="ml-1 h-4 w-4" />
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
      <h3 className="font-medium text-lg">Leaderboard</h3>
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
                <Avatar className="h-5 w-5">
                  <AvatarImage src="https://github.com/suhailkakar.png" />
                </Avatar>
                {row.author}
              </TableCell>
              <TableCell>{row.usage}k mins</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={() => {
          track("leaderboard_see_all_clicked");
        }}
        className="mt-2"
        variant="ghost"
      >
        See all <ArrowTopRightIcon className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

const MyStats = () => {
  const data = [
    { name: "Text to Speech", users: 100, usage: 100 },
    { name: "Image to Image", users: 95, usage: 95 },
    { name: "Video to Video", users: 95, usage: 95 },
  ];

  return (
    <div className="col-span-1">
      <h3 className="font-medium text-lg">My Stats</h3>
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
                {row.users} users
              </TableCell>
              <TableCell>{row.usage}k mins</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={() => {
          track("my_stats_see_all_clicked");
        }}
        className="mt-2"
        variant="ghost"
      >
        See all <ArrowTopRightIcon className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};
