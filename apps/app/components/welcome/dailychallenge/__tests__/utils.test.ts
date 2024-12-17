import { describe, it, expect, vi } from 'vitest';
import {
  validatePlaybackUrl,
  validateGithubUsername,
  validateDiscordId,
  validateRank,
  validateWinnerData,
  VALIDATION_RULES,
} from '../utils';

describe('Validation Utils', () => {
  describe('validatePlaybackUrl', () => {
    it('should validate correct playback ID format', async () => {
      const validId = 'abcd1234efgh5678';
      global.fetch = vi.fn().mockResolvedValue({ ok: true });

      const result = await validatePlaybackUrl(validId);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid playback ID format', async () => {
      const invalidId = 'short';
      const result = await validatePlaybackUrl(invalidId);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe(VALIDATION_RULES.PLAYBACK_ID.MESSAGE);
    });

    it('should handle non-existent playback URLs', async () => {
      const validFormatId = 'abcd1234efgh5678';
      global.fetch = vi.fn().mockResolvedValue({ ok: false });

      const result = await validatePlaybackUrl(validFormatId);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe('Video not found');
    });
  });

  describe('validateGithubUsername', () => {
    it('should validate correct GitHub username format', () => {
      const validUsername = 'user-123';
      const result = validateGithubUsername(validUsername);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid GitHub username format', () => {
      const invalidUsername = 'user@123';
      const result = validateGithubUsername(invalidUsername);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe(VALIDATION_RULES.GITHUB_USERNAME.MESSAGE);
    });

    it('should allow optional GitHub username', () => {
      const result = validateGithubUsername(undefined);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateDiscordId', () => {
    it('should validate correct Discord ID format', () => {
      const validId = '123456789012345678';
      const result = validateDiscordId(validId);
      expect(result.isValid).toBe(true);
    });

    it('should reject invalid Discord ID format', () => {
      const invalidId = '123';
      const result = validateDiscordId(invalidId);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe(VALIDATION_RULES.DISCORD_ID.MESSAGE);
    });

    it('should allow optional Discord ID', () => {
      const result = validateDiscordId(undefined);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateRank', () => {
    it('should validate positive integer rank', () => {
      const result = validateRank(1);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-positive rank', () => {
      const result = validateRank(0);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe(VALIDATION_RULES.RANK.MESSAGE);
    });

    it('should reject non-integer rank', () => {
      const result = validateRank(1.5);
      expect(result.isValid).toBe(false);
      expect(result.errors[0].message).toBe(VALIDATION_RULES.RANK.MESSAGE);
    });
  });

  describe('validateWinnerData', () => {
    const validWinner = {
      user_full_name: 'John Doe',
      user_github: 'johndoe',
      user_discord: '123456789012345678',
      playback_id: 'abcd1234efgh5678',
      pipeline_name: 'Test Pipeline',
      prompt_used: 'Test prompt',
      description: 'Test description',
      rank: 1,
      challenge_date: new Date().toISOString(),
    };

    it('should validate complete valid winner data', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });
      const result = await validateWinnerData(validWinner);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate winner data with optional fields missing', async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: true });
      const { user_github, user_discord, ...requiredFields } = validWinner;
      const result = await validateWinnerData(requiredFields);
      expect(result.isValid).toBe(true);
    });

    it('should reject winner data with missing required fields', async () => {
      const { user_full_name, ...missingRequired } = validWinner;
      const result = await validateWinnerData(missingRequired);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContainEqual({
        field: 'user_full_name',
        message: 'Full name is required',
      });
    });
  });
});
