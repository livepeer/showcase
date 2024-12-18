"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@repo/design-system/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@repo/design-system/components/ui/form";
import { Input } from "@repo/design-system/components/ui/input";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { Calendar } from "@repo/design-system/components/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@repo/design-system/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@repo/design-system/components/ui/popover";
import { cn } from "@repo/design-system/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export const winnerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  playbackUrl: z.string().url("Invalid playback URL"),
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

interface WinnerFormProps {
  winner?: Winner;
  onSubmit: (data: Winner) => void;
  onCancel: () => void;
}

export function WinnerForm({ winner, onSubmit, onCancel }: WinnerFormProps) {
  const form = useForm<Winner>({
    resolver: zodResolver(winnerSchema),
    defaultValues: winner || {
      title: "",
      description: "",
      playbackUrl: "",
      winnerName: "",
      rank: 1,
      discordHandle: "",
      winningDate: new Date(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Title</FormLabel>
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
              <FormLabel className="text-muted-foreground">Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Describe the winning submission" className="h-24" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="playbackUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Playback URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://..." />
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
                <FormLabel className="text-muted-foreground">Winner Name</FormLabel>
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
                <FormLabel className="text-muted-foreground">Rank</FormLabel>
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
              <FormLabel className="text-muted-foreground">Discord Handle</FormLabel>
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
              <FormLabel className="text-muted-foreground">Winning Date</FormLabel>
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
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {winner ? "Save Changes" : "Add Winner"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function ManageWinnersModal({
  open,
  onOpenChange,
  winners,
  onAddWinner,
  onEditWinner,
  onDeleteWinner
}: ManageWinnersModalProps) {
  const [editingWinner, setEditingWinner] = React.useState<Winner | undefined>();
  const [isAdding, setIsAdding] = React.useState(false);

  const handleEdit = (winner: Winner) => {
    setEditingWinner(winner);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingWinner(undefined);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setEditingWinner(undefined);
    setIsAdding(false);
  };

  const handleSubmit = (data: Winner) => {
    if (editingWinner) {
      onEditWinner(data);
    } else {
      onAddWinner(data);
    }
    handleCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Winners</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add, edit, or remove winners from the showcase.
          </DialogDescription>
        </DialogHeader>

        {!isAdding && !editingWinner && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button onClick={handleAdd}>Add Winner</Button>
            </div>
            <WinnerList
              winners={winners}
              onEdit={handleEdit}
              onDelete={onDeleteWinner}
            />
          </div>
        )}

        {(isAdding || editingWinner) && (
          <WinnerForm
            winner={editingWinner}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
