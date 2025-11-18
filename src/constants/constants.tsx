/**
 * Application Constants
 * 
 * Legacy constants file - now using storage layer for data persistence.
 * This file is kept for backwards compatibility and color constants.
 */

import { Colors } from '../utils/theme';

export const USER_INFO = {
  // Deprecated - use storage layer UserProfile instead
  // This is a placeholder for user subscription status
  isPremium: false,
};

// Re-export types from storage layer for backwards compatibility
export type { GoalPeriodCard, GoalGroup, Friend, UserProfile, GoalPeriod } from '../types/storage.types';

/**
 * These mock constants are now deprecated.
 * Use the storage layer and hooks instead:
 * - useGoals() for groups, friends, and goal operations
 * - useHistory() for historical data
 * - useAutoReset() for automatic cycle resets
 */
