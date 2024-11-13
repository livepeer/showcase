"use client";

import React from "react";
import { TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { Link, Link2 } from "lucide-react";
import { ArrowTopLeftIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";

export default function Tabs() {
  const { replace, push } = useRouter();

  const searchParams = useSearchParams();

  const pipeline = searchParams.get("pipeline");

  const handleTabChange = (tab: string) => {
    replace(`?pipeline=${pipeline}`);
  };
  return (
    <TabsList>
      <TabsTrigger onClick={() => handleTabChange("try")} value="try">
        Try it out
      </TabsTrigger>
      <TabsTrigger onClick={() => handleTabChange("remix")} value="remix">
        Remix
      </TabsTrigger>
      <TabsTrigger
        onClick={() => {
          window.open("https://docs.livepeer.org", "_blank");
        }}
        value="build"
        disabled
      >
        Build with it <ArrowTopRightIcon className="w-4 h-4 ml-1" />
      </TabsTrigger>
    </TabsList>
  );
}
