import { z } from 'zod';

const VALIDATION_RULES = {
  GITHUB_USERNAME: {
    PATTERN: /^[a-zA-Z0-9-]+$/,
    MESSAGE: 'Invalid GitHub username format',
  },
  DISCORD_ID: {
    PATTERN: /^.+#\d{4}$/,
    MESSAGE: 'Invalid Discord ID format (should end with #XXXX)',
  },
  PLAYBACK_ID: {
    PATTERN: /^[a-zA-Z0-9]{16}$/,
    MESSAGE: 'Invalid playback ID format (must be exactly 16 characters)',
  },
  RANK: {
    MIN: 1,
    MESSAGE: 'Rank must be a positive number',
  },
  DATE: {
    PATTERN: /^\d{4}-\d{2}-\d{2}$/,
    MESSAGE: 'Invalid date format (YYYY-MM-DD)',
  },
};

export const winnerSchema = z.object({
  user_full_name: z.string().min(1, 'Full name is required').trim(),
  user_github: z.string().min(1, 'GitHub username is required').trim()
    .regex(VALIDATION_RULES.GITHUB_USERNAME.PATTERN, VALIDATION_RULES.GITHUB_USERNAME.MESSAGE),
  user_discord: z.string().optional()
    .refine((val) => !val || VALIDATION_RULES.DISCORD_ID.PATTERN.test(val), VALIDATION_RULES.DISCORD_ID.MESSAGE),
  playback_id: z.string().min(1, 'Playback ID is required').trim()
    .regex(VALIDATION_RULES.PLAYBACK_ID.PATTERN, VALIDATION_RULES.PLAYBACK_ID.MESSAGE),
  pipeline_name: z.string().min(1, 'Pipeline name is required').trim(),
  prompt_used: z.string().min(1, 'Prompt is required').trim(),
  description: z.string().min(1, 'Description is required').trim(),
  rank: z.number().int().min(VALIDATION_RULES.RANK.MIN, VALIDATION_RULES.RANK.MESSAGE),
  challenge_date: z.string()
    .regex(VALIDATION_RULES.DATE.PATTERN, VALIDATION_RULES.DATE.MESSAGE),
});

export type Winner = z.infer<typeof winnerSchema>;

export { VALIDATION_RULES };
