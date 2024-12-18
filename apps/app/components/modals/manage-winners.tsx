"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export const winnerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  playbackId: z.string().min(1, "Playback ID is required"),
  winnerName: z.string().min(1, "Winner name is required"),
  rank: z.number().min(1, "Rank must be at least 1"),
  discordHandle: z.string().min(1, "Discord handle is required"),
  winningDate: z.date({
    required_error: "Winning date is required",
  })
});

export type Winner = z.infer<typeof winnerSchema>;

interface ManageWinnersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  winners: Winner[];
  onAddWinner: (winner: Winner) => void;
  onEditWinner: (winner: Winner) => void;
  onDeleteWinner: (winner: Winner) => void;
}

export function ManageWinnersModal({
  open,
  onOpenChange,
  winners = [],
  onAddWinner,
  onEditWinner,
  onDeleteWinner,
}: ManageWinnersModalProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingWinner, setEditingWinner] = React.useState<Winner | null>(null);

  const form = useForm<Winner>({
    resolver: zodResolver(winnerSchema),
    defaultValues: {
      title: "",
      description: "",
      playbackId: "",
      winnerName: "",
      rank: 1,
      discordHandle: "",
      winningDate: new Date(),
    },
  });

  const onSubmit = async (data: Winner) => {
    if (editingWinner) {
      onEditWinner?.(data);
    } else {
      onAddWinner?.(data);
    }
    form.reset();
    setIsAdding(false);
    setEditingWinner(null);
  };

  const handleEdit = (winner: Winner) => {
    setEditingWinner(winner);
    form.reset(winner);
    setIsAdding(true);
  };

  const handleDelete = (winner: Winner) => {
    onDeleteWinner?.(winner);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingWinner(null);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Winners</DialogTitle>
          <DialogDescription>
            Add, edit, or remove winners from the showcase.
          </DialogDescription>
        </DialogHeader>

        {!isAdding ? (
          <div className="space-y-4">
            <Button onClick={() => setIsAdding(true)} className="w-full">
              Add Winner
            </Button>
            <div className="space-y-4">
              {winners.map((winner, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{winner.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {winner.winnerName} ({winner.discordHandle})
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(winner.winningDate, "PPP")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleEdit(winner)}>
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(winner)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Best AI Video Generation" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe the winning submission" className="h-24" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="playbackId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Playback ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., c99filnga205mzqh" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="winnerName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Winner Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rank"
                  render={({ field }) => (
                    <FormItem className="w-24">
                      <FormLabel>Rank</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="discordHandle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discord Handle</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@username" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="winningDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Winning Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingWinner ? "Save Changes" : "Add Winner"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
