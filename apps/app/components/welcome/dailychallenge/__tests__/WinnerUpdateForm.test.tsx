import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from './test-utils';
import userEvent from '@testing-library/user-event';
import { WinnerUpdateForm } from '../WinnerUpdateForm';
import { validatePlaybackUrl, validateWinnerData } from '../utils';
import type { ValidationResult, ValidationError } from '../types';
import { app } from '../../../../lib/env';

// Mock env and validation utilities
vi.mock('../../../../lib/env', () => ({
  app: {
    enableWinners: true,
  },
}));

vi.mock('../utils', () => ({
  validatePlaybackUrl: vi.fn(),
  validateWinnerData: vi.fn(),
}));

const mockedValidatePlaybackUrl = vi.mocked(validatePlaybackUrl);
const mockedValidateWinnerData = vi.mocked(validateWinnerData);

describe('WinnerUpdateForm', () => {
  const mockOnSubmit = vi.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(app).enableWinners = true;
  });

  describe('Feature Flag Tests', () => {
    it('does not render when feature flag is disabled', () => {
      vi.mocked(app).enableWinners = false;
      const { container } = render(<WinnerUpdateForm {...defaultProps} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders when feature flag is enabled', () => {
      vi.mocked(app).enableWinners = true;
      render(<WinnerUpdateForm {...defaultProps} />);
      expect(screen.getByText(/Update Daily Winners/i)).toBeInTheDocument();
    });
  });

  it('renders all form fields', () => {
    render(<WinnerUpdateForm {...defaultProps} />);

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GitHub Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Discord ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Playback ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pipeline Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Prompt/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rank/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Challenge Date/i)).toBeInTheDocument();
  });

  it('validates playback ID on input', async () => {
    mockedValidatePlaybackUrl.mockResolvedValue({
      isValid: false,
      errors: [{ field: 'playback_id', message: 'Invalid playback ID' }],
    });

    render(<WinnerUpdateForm {...defaultProps} />);
    const playbackInput = screen.getByLabelText(/Playback ID/i);

    await userEvent.type(playbackInput, 'invalid');

    await waitFor(() => {
      expect(screen.getByText(/Invalid playback ID/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    mockedValidatePlaybackUrl.mockResolvedValue({
      isValid: true,
      errors: [],
    });
    mockedValidateWinnerData.mockResolvedValue({
      isValid: true,
      errors: [],
    });

    render(<WinnerUpdateForm {...defaultProps} />);
    const user = userEvent.setup();

    // Fill in required fields
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Playback ID/i), 'abcd1234efgh5678');
    await user.type(screen.getByLabelText(/Pipeline Name/i), 'Test Pipeline');
    await user.type(screen.getByLabelText(/Prompt/i), 'Test prompt');
    await user.type(screen.getByLabelText(/Description/i), 'Test description');
    await user.type(screen.getByLabelText(/Rank/i), '1');

    // Submit form
    await user.click(screen.getByText(/Save Winner/i));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        user_full_name: 'John Doe',
        playback_id: 'abcd1234efgh5678',
        pipeline_name: 'Test Pipeline',
        prompt_used: 'Test prompt',
        description: 'Test description',
        rank: 1,
      });
    });
  });

  it('shows validation errors for required fields', async () => {
    mockedValidateWinnerData.mockResolvedValue({
      isValid: false,
      errors: [
        { field: 'user_full_name', message: 'Full name is required' },
        { field: 'pipeline_name', message: 'Pipeline name is required' },
        { field: 'prompt_used', message: 'Prompt is required' },
        { field: 'description', message: 'Description is required' },
      ],
    });

    render(<WinnerUpdateForm {...defaultProps} />);
    const user = userEvent.setup();

    // Submit form without filling required fields
    await user.click(screen.getByText(/Save Winner/i));

    await waitFor(() => {
      expect(screen.getByText(/Full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Pipeline name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Prompt is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Description is required/i)).toBeInTheDocument();
    });
  });

  it('handles submission errors', async () => {
    const error = new Error('Submission failed');
    const mockOnSubmitError = vi.fn().mockRejectedValue(error);

    mockedValidatePlaybackUrl.mockResolvedValue({
      isValid: true,
      errors: [],
    });
    mockedValidateWinnerData.mockResolvedValue({
      isValid: true,
      errors: [],
    });

    render(<WinnerUpdateForm onSubmit={mockOnSubmitError} />);
    const user = userEvent.setup();

    // Fill in required fields
    await user.type(screen.getByLabelText(/Full Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Pipeline Name/i), 'Test Pipeline');
    await user.type(screen.getByLabelText(/Prompt/i), 'Test prompt');
    await user.type(screen.getByLabelText(/Description/i), 'Test description');
    await user.type(screen.getByLabelText(/Rank/i), '1');

    // Submit form
    await user.click(screen.getByText(/Save Winner/i));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Submission failed');
    });
  });
});
