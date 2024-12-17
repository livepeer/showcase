import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { WinnerUpdateForm } from "../winner-update-form";
import "./setup";

interface Challenge {
  id: string;
  title: string;
  prompt: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

const mockChallenge: Challenge = {
  id: "challenge-123",
  title: "Test Challenge",
  prompt: "Create something amazing",
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 86400000).toISOString(),
  created_at: new Date().toISOString(),
};

describe("WinnerUpdateForm", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it("renders form inputs correctly", () => {
    render(<WinnerUpdateForm challenge={mockChallenge} />);

    expect(screen.getByPlaceholderText("Playback ID")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByText("Add Winner")).toBeInTheDocument();
    expect(screen.getByText("Update Winners")).toBeInTheDocument();
  });

  it("validates playback ID format", async () => {
    render(<WinnerUpdateForm challenge={mockChallenge} />);

    const playbackInput = screen.getByPlaceholderText("Playback ID");
    fireEvent.change(playbackInput, { target: { value: "invalid-id" } });

    const submitButton = screen.getByText("Update Winners");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid playback ID format/)).toBeInTheDocument();
    });
  });

  it("validates required username", async () => {
    render(<WinnerUpdateForm challenge={mockChallenge} />);

    const playbackInput = screen.getByPlaceholderText("Playback ID");
    fireEvent.change(playbackInput, { target: { value: "1234567890123456" } });

    const submitButton = screen.getByText("Update Winners");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
    });
  });

  it("handles successful form submission", async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = mockFetch;

    render(<WinnerUpdateForm challenge={mockChallenge} />);

    const playbackInput = screen.getByPlaceholderText("Playback ID");
    const usernameInput = screen.getByPlaceholderText("Username");

    fireEvent.change(playbackInput, { target: { value: "1234567890123456" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    const submitButton = screen.getByText("Update Winners");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/admin/winners", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: mockChallenge.id,
          winners: [{
            playbackId: "1234567890123456",
            username: "testuser",
          }],
        }),
      });
    });
  });

  it("handles API errors", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "API Error" }),
    });
    global.fetch = mockFetch;

    render(<WinnerUpdateForm challenge={mockChallenge} />);

    const playbackInput = screen.getByPlaceholderText("Playback ID");
    const usernameInput = screen.getByPlaceholderText("Username");

    fireEvent.change(playbackInput, { target: { value: "1234567890123456" } });
    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    const submitButton = screen.getByText("Update Winners");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(screen.getByText("Failed to update winners")).toBeInTheDocument();
    });
  });
});
