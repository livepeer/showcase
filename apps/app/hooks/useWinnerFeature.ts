import { app } from '../lib/env';

interface WinnerFeatureState {
  enabled: boolean;
}

/**
 * Hook to check if the winner workflow feature is enabled
 * @returns {WinnerFeatureState} Object containing enabled state of winner workflow
 */
export const useWinnerFeature = (): WinnerFeatureState => {
  return { enabled: app.enableWinners };
};
