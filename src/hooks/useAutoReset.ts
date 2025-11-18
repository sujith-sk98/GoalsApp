/**
 * useAutoReset Hook
 * 
 * Handles automatic goal resets based on app lifecycle.
 * Checks for necessary resets when app comes to foreground.
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { ResetService } from '../storage/ResetService';

interface UseAutoResetOptions {
  onReset?: (type: 'daily' | 'weekly' | 'monthly') => void;
  onResetComplete?: () => void;
}

export const useAutoReset = (options: UseAutoResetOptions = {}) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const { onReset, onResetComplete } = options;

  /**
   * Perform reset check
   */
  const checkAndPerformResets = async () => {
    try {
      console.log('🔍 Checking for necessary resets...');
      const results = await ResetService.performResets();

      // Notify about each reset type
      if (results.dailyReset && onReset) {
        onReset('daily');
      }
      if (results.weeklyReset && onReset) {
        onReset('weekly');
      }
      if (results.monthlyReset && onReset) {
        onReset('monthly');
      }

      // Notify completion if any resets occurred
      if ((results.dailyReset || results.weeklyReset || results.monthlyReset) && onResetComplete) {
        onResetComplete();
      }

      return results;
    } catch (error) {
      console.error('Error checking resets:', error);
      return {
        dailyReset: false,
        weeklyReset: false,
        monthlyReset: false,
      };
    }
  };

  useEffect(() => {
    // Check on mount
    checkAndPerformResets();

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      // When app comes to foreground from background
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('📱 App came to foreground - checking for resets');
        await checkAndPerformResets();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [onReset, onResetComplete]);

  return {
    checkAndPerformResets,
  };
};
