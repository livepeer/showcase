import { z } from "zod";

export const playbackIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]{16}$/, "Invalid playback ID format")
  .refine(async (id) => {
    try {
      const response = await fetch(`https://lvpr.tv/${id}`);
      return response.ok;
    } catch {
      return false;
    }
  }, "Invalid playback URL");

export const winnerFormSchema = z.object({
  user_full_name: z.string().min(1, "Full name is required"),
  user_github: z.string().optional(),
  user_discord: z.string().optional(),
  playback_id: playbackIdSchema,
  pipeline_name: z.string().min(1, "Pipeline name is required"),
  prompt_used: z.string().min(1, "Prompt is required"),
  description: z.string().min(1, "Description is required"),
  rank: z.number().int().min(1, "Rank must be a positive integer"),
  challenge_date: z.string().datetime(),
});

export type WinnerFormData = z.infer<typeof winnerFormSchema>;

export async function validatePlaybackUrl(playbackId: string): Promise<string | null> {
  try {
    await playbackIdSchema.parseAsync(playbackId);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0].message;
    }
    return "Failed to validate playback URL";
  }
}
