/**
 * useHistory Hook
 * 
 * Custom hook for accessing and managing goal completion history.
 */

import { useState, useEffect, useCallback } from 'react';
import { HistoryStorage } from '../storage/HistoryStorage';
import {
  GoalHistory,
  DailyHistoryEntry,
  WeeklyHistoryEntry,
  MonthlyHistoryEntry,
} from '../types/storage.types';

export const useHistory = () => {
  const [history, setHistory] = useState<GoalHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load history from storage
   */
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedHistory = await HistoryStorage.getHistory();
      setHistory(loadedHistory);
    } catch (err) {
      console.error('Error loading history:', err);
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get daily history
   */
  const getDailyHistory = useCallback(async (date: Date): Promise<DailyHistoryEntry | null> => {
    return await HistoryStorage.getDailyHistory(date);
  }, []);

  /**
   * Get weekly history
   */
  const getWeeklyHistory = useCallback(async (date: Date): Promise<WeeklyHistoryEntry | null> => {
    return await HistoryStorage.getWeeklyHistory(date);
  }, []);

  /**
   * Get monthly history
   */
  const getMonthlyHistory = useCallback(async (date: Date): Promise<MonthlyHistoryEntry | null> => {
    return await HistoryStorage.getMonthlyHistory(date);
  }, []);

  /**
   * Get all daily entries
   */
  const getAllDailyHistory = useCallback(async (): Promise<DailyHistoryEntry[]> => {
    return await HistoryStorage.getAllDailyHistory();
  }, []);

  /**
   * Get all weekly entries
   */
  const getAllWeeklyHistory = useCallback(async (): Promise<WeeklyHistoryEntry[]> => {
    return await HistoryStorage.getAllWeeklyHistory();
  }, []);

  /**
   * Get all monthly entries
   */
  const getAllMonthlyHistory = useCallback(async (): Promise<MonthlyHistoryEntry[]> => {
    return await HistoryStorage.getAllMonthlyHistory();
  }, []);

  /**
   * Get completion statistics
   */
  const getCompletionStats = useCallback(async (
    period: 'daily' | 'weekly' | 'monthly',
    limit: number = 30
  ) => {
    return await HistoryStorage.getCompletionStats(period, limit);
  }, []);

  /**
   * Get history for date range
   */
  const getHistoryRange = useCallback(async (
    startDate: Date,
    endDate: Date
  ): Promise<DailyHistoryEntry[]> => {
    return await HistoryStorage.getHistoryRange(startDate, endDate);
  }, []);

  /**
   * Refresh history
   */
  const refresh = useCallback(async () => {
    await loadHistory();
  }, [loadHistory]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    // State
    history,
    loading,
    error,

    // Actions
    refresh,
    getDailyHistory,
    getWeeklyHistory,
    getMonthlyHistory,
    getAllDailyHistory,
    getAllWeeklyHistory,
    getAllMonthlyHistory,
    getCompletionStats,
    getHistoryRange,
  };
};
