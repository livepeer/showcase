"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@repo/design-system/components/ui/command";
import { Input } from "@repo/design-system/components/ui/input";
import { useState } from "react";
export default function Search() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Input
        placeholder="I want to build..."
        onClick={() => setOpen(true)}
        className="hidden w-80 md:block"
      />
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="I want to build..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem> Object Detection App</CommandItem>
            <CommandItem> Face Swap App</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="All Pipelines">
            <CommandItem>Image Segmentation</CommandItem>
            <CommandItem>Image Classification</CommandItem>
            <CommandItem>Text to Speech</CommandItem>
            <CommandItem>Video Summarization</CommandItem>
            <CommandItem>Object Detection</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
