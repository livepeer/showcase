"use client";

import React from "react";
import { TabsList, TabsTrigger } from "@repo/design-system/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { Link, Link2 } from "lucide-react";
import { ArrowTopLeftIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import { usePathname } from "next/navigation";

export default function Tabs() {
  return (
    <TabsList>
      <TabsTrigger value="try">Try it out</TabsTrigger>
      <TabsTrigger value="remix">Remix</TabsTrigger>
      <TabsTrigger value="build">
        Build with it <ArrowTopRightIcon className="w-4 h-4 ml-1" />
      </TabsTrigger>
    </TabsList>
  );
}
