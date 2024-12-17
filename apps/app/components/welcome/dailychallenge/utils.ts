import { Winner, ValidationError, ValidationResult } from './types';

export const VALIDATION_RULES = {
  PLAYBACK_ID: {
    PATTERN: /^[a-zA-Z0-9]{16}$/,
    MESSAGE: 'Invalid playback ID format',
  },
  GITHUB_USERNAME: {
    PATTERN: /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/,
    MESSAGE: 'Invalid GitHub username format',
  },
  DISCORD_ID: {
    PATTERN: /^[0-9]{17,19}$/,
    MESSAGE: 'Invalid Discord ID format',
  },
  RANK: {
    MIN: 1,
    MESSAGE: 'Rank must be a positive integer',
  },
};

export async function validatePlaybackUrl(
  playbackId: string
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  if (!playbackId?.match(VALIDATION_RULES.PLAYBACK_ID.PATTERN)) {
    errors.push({
      field: 'playback_id',
      message: VALIDATION_RULES.PLAYBACK_ID.MESSAGE,
    });
    return { isValid: false, errors };
  }

  try {
    const response = await fetch(`https://lvpr.tv/${playbackId}`);
    if (!response.ok) {
      errors.push({
        field: 'playback_id',
        message: 'Video not found',
      });
    }
    return { isValid: response.ok, errors };
  } catch (error) {
    errors.push({
      field: 'playback_id',
      message: 'Error validating video URL',
    });
    return { isValid: false, errors };
  }
}

export function validateGithubUsername(username?: string): ValidationResult {
  if (!username) return { isValid: true, errors: [] };

  const errors: ValidationError[] = [];
  if (!username.match(VALIDATION_RULES.GITHUB_USERNAME.PATTERN)) {
    errors.push({
      field: 'user_github',
      message: VALIDATION_RULES.GITHUB_USERNAME.MESSAGE,
    });
  }
  return { isValid: errors.length === 0, errors };
}

export function validateDiscordId(discordId?: string): ValidationResult {
  if (!discordId) return { isValid: true, errors: [] };

  const errors: ValidationError[] = [];
  if (!discordId.match(VALIDATION_RULES.DISCORD_ID.PATTERN)) {
    errors.push({
      field: 'user_discord',
      message: VALIDATION_RULES.DISCORD_ID.MESSAGE,
    });
  }
  return { isValid: errors.length === 0, errors };
}

export function validateRank(rank: number): ValidationResult {
  const errors: ValidationError[] = [];
  if (!Number.isInteger(rank) || rank < VALIDATION_RULES.RANK.MIN) {
    errors.push({
      field: 'rank',
      message: VALIDATION_RULES.RANK.MESSAGE,
    });
  }
  return { isValid: errors.length === 0, errors };
}

export async function validateWinnerData(
  data: Partial<Winner>
): Promise<ValidationResult> {
  const errors: ValidationError[] = [];

  if (!data.user_full_name?.trim()) {
    errors.push({
      field: 'user_full_name',
      message: 'Full name is required',
    });
  }

  if (!data.pipeline_name?.trim()) {
    errors.push({
      field: 'pipeline_name',
      message: 'Pipeline name is required',
    });
  }

  if (!data.prompt_used?.trim()) {
    errors.push({
      field: 'prompt_used',
      message: 'Prompt is required',
    });
  }

  if (!data.description?.trim()) {
    errors.push({
      field: 'description',
      message: 'Description is required',
    });
  }

  if (data.user_github) {
    const githubResult = validateGithubUsername(data.user_github);
    errors.push(...githubResult.errors);
  }

  if (data.user_discord) {
    const discordResult = validateDiscordId(data.user_discord);
    errors.push(...discordResult.errors);
  }

  if (data.rank !== undefined) {
    const rankResult = validateRank(data.rank);
    errors.push(...rankResult.errors);
  }

  if (data.playback_id) {
    const playbackResult = await validatePlaybackUrl(data.playback_id);
    errors.push(...playbackResult.errors);
  }

  return { isValid: errors.length === 0, errors };
}
