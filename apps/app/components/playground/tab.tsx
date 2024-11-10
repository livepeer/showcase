"use client";

import React from "react";
import { TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";

export default function Tabs() {
  const { replace } = useRouter();

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
      <TabsTrigger onClick={() => handleTabChange("build")} value="build">
        Build with it
      </TabsTrigger>
      <TabsTrigger onClick={() => handleTabChange("remix")} value="remix">
        Remix
      </TabsTrigger>
    </TabsList>
  );
}
