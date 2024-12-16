"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@repo/design-system/components/ui/command";
import { Input } from "@repo/design-system/components/ui/input";
import { Button } from "@repo/design-system/components/ui/button";
import React, { useState, useEffect } from "react";
import track from "@/lib/track";
import { fetchPipelines } from "./fetchPipelines";
import { LoaderCircleIcon } from "lucide-react";

export default function Search({ pipeline, onPipelineSelect }: { pipeline?: any; onPipelineSelect?: (pipeline: any) => void }) {
  const [open, setOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<any | null>(pipeline);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>([]);
  const [isSearching, setIsSearching] = useState(false);

  const selectPipeline = (pipeline: any) => {
    if (!pipeline) {
      console.error("No pipeline selected.");
      return;
    }
    setSelectedPipeline(pipeline);
    setOpen(false);
    setQuery("");
    if (onPipelineSelect) {
      onPipelineSelect(pipeline);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (query.length >= 3) {
        setIsSearching(true);
        const data = await fetchPipelines(query);
        setResults(data);
        setIsSearching(false);
      } else {
        setResults([]);
      }
    };

    fetchData();
  }, [query]);

  return (
      <div>
        <Input
            placeholder="Search Pipelines"
            value={selectedPipeline?.name || ""}
            readOnly={true}
            onClick={() => {
              track("search_clicked");
              setOpen(true);
            }}
        />
        <CommandDialog open={open} onOpenChange={setOpen}>
          <div className="flex justify-between items-center p-2">
            <CommandInput
                value={query}
                onValueChange={(value) => setQuery(value)}
                placeholder="Search Pipelines..."
            />
            <Button onClick={() => setOpen(false)}>Close</Button>
          </div>
          <CommandList>
            {isSearching ? (
                <div className="flex justify-center items-center py-4">
                  <LoaderCircleIcon className="w-8 h-8 animate-spin" />
                </div>
            ) : results.length === 0 && query.length >= 3 ? (
                <CommandEmpty>No results found.</CommandEmpty>
            ) : results.length === 0 && query.length < 3 ? (
                <CommandEmpty>Enter at least three characters to begin searching.</CommandEmpty>
            ) : (
                <CommandGroup heading="Search Results">
                  {results.map((pipeline: any) => (
                      <CommandItem
                          key={pipeline.id}
                          onSelect={() => selectPipeline(pipeline)}
                      >
                        {pipeline.name}
                      </CommandItem>
                  ))}
                </CommandGroup>
            )}
          </CommandList>
        </CommandDialog>
      </div>
  );
}
