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
import { useState, useEffect } from "react";
import track from "@/lib/track";
import { fetchPipelines } from "./fetchPipelines";


export default function Search({ pipeline, onPipelineSelect }: { pipeline?: any, onPipelineSelect?: (pipelineId: string) => void }) {
  const [open, setOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<any | null>(pipeline);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any>([]);

  const selectPipeline = (pipeline: any) => {
    setSelectedPipeline(pipeline);
    if (onPipelineSelect) {
      onPipelineSelect(pipeline);
    }
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (query.length >= 3) {
        const data = await fetchPipelines(query);
        setResults(data);
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
        defaultValue={selectedPipeline?.name}
        value={selectedPipeline?.name}
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
          {results.length === 0 && query.length >= 3 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          {results.length === 0 && query.length < 3 && (
            <CommandEmpty>Enter at least three characters to begin searching.</CommandEmpty>
          )}
          {results.length > 0 && (
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