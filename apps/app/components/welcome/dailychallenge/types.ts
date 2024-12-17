/**
 * Type definitions for winner management
 */

export interface Winner {
  id: number;
  user_full_name: string;
  user_github?: string;
  user_discord?: string;
  playback_id: string;
  pipeline_name: string;
  prompt_used: string;
  description: string;
  rank: number;
  challenge_date: string;
}

export interface WinnerHistoryProps {
  initialWinners: Winner[];
}

export type WinnerFormData = Omit<Winner, 'id'>;

export interface ValidationError {
  field: keyof Winner;
  message: string;
}

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

export interface DateRangePickerProps {
  className?: string;
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  'aria-label'?: string;
}
