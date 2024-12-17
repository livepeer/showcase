"use client";

import { type FC, FormEvent, ChangeEvent } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { useState } from "react";
import React from "react";
import { Alert, AlertDescription } from "@repo/design-system/components/ui/alert";

interface Winner {
  playbackId: string;
  username: string;
  error?: string;
}

interface Challenge {
  id: string;
  prompt: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface WinnerUpdateFormProps {
  challenge?: Challenge;
}

const validatePlaybackId = async (playbackId: string): Promise<string | undefined> => {
  if (!playbackId) return "Playback ID is required";
  if (!/^[a-zA-Z0-9]{16}$/.test(playbackId)) {
    return "Invalid playback ID format. Must be 16 alphanumeric characters.";
  }

  try {
    const response = await fetch(`/api/streams/${playbackId}`);
    if (!response.ok) {
      return "Invalid playback ID. Stream not found.";
    }
    return undefined;
  } catch (error) {
    return "Error validating playback ID";
  }
}

const validateUsername = (username: string): string | undefined => {
  if (!username.trim()) return "Username is required";
  return undefined;
}

export const WinnerUpdateForm: FC<WinnerUpdateFormProps> = ({ challenge }) => {
  const [winners, setWinners] = useState<Winner[]>([
    { playbackId: "", username: "", error: undefined },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!challenge) return;

    setIsSubmitting(true);

    const validationResults = await Promise.all(
      winners.map(async (winner) => {
        const playbackError = await validatePlaybackId(winner.playbackId);
        const usernameError = validateUsername(winner.username);
        return { ...winner, error: playbackError || usernameError };
      })
    );

    setWinners(validationResults);

    if (validationResults.some(winner => winner.error)) {
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/api/admin/winners", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ challengeId: challenge.id, winners }),
    });

    if (response.ok) {
      console.log("Winners updated successfully");
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {winners.map((winner, index) => (
        <div key={index} className="space-y-2">
          <div className="flex gap-4">
            <Input
              placeholder="Playback ID"
              value={winner.playbackId}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newWinners = [...winners];
                newWinners[index] = {
                  ...newWinners[index],
                  playbackId: e.target.value,
                  error: undefined,
                };
                setWinners(newWinners);
              }}
              className={winner.error ? "border-red-500" : ""}
            />
            <Input
              placeholder="Username"
              value={winner.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newWinners = [...winners];
                newWinners[index] = {
                  ...newWinners[index],
                  username: e.target.value,
                };
                setWinners(newWinners);
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newWinners = winners.filter((_, i) => i !== index);
                setWinners(newWinners);
              }}
            >
              Remove
            </Button>
          </div>
          {winner.error && (
            <Alert variant="destructive">
              <AlertDescription>{winner.error}</AlertDescription>
            </Alert>
          )}
        </div>
      ))}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setWinners([...winners, { playbackId: "", username: "" }]);
          }}
        >
          Add Winner
        </Button>
        <Button type="submit" disabled={!challenge || isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Winners"}
        </Button>
      </div>
    </form>
  );
};
