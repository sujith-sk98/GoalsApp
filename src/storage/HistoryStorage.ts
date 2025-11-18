/**
 * History Storage Service
 * 
 * Manages historical goal completion data for analytics and tracking.
 */

import { StorageService } from './StorageService';
import { 
  StorageKeys, 
  GoalHistory, 
  DailyHistoryEntry,
  WeeklyHistoryEntry,
  MonthlyHistoryEntry,
  CompletedGoalEntry,
  GoalPeriod,
} from '../types/storage.types';
import { format, startOfWeek, endOfWeek, getISOWeek, getYear } from 'date-fns';

export class HistoryStorage {
  /**
   * Get complete history
   */
  static async getHistory(): Promise<GoalHistory> {
    const history = await StorageService.load<GoalHistory>(StorageKeys.HISTORY);
    return history || {
      daily: {},
      weekly: {},
      monthly: {},
    };
  }

  /**
   * Save complete history
   */
  static async saveHistory(history: GoalHistory): Promise<boolean> {
    return await StorageService.save(StorageKeys.HISTORY, history);
  }

  /**
   * Archive completed goals for a specific period
   */
  static async archiveCompletedGoals(
    completedGoals: CompletedGoalEntry[],
    period: GoalPeriod,
    date: Date = new Date()
  ): Promise<boolean> {
    try {
      const history = await this.getHistory();

      if (period === 'daily') {
        return await this.archiveDailyGoals(history, completedGoals, date);
      } else if (period === 'weekly') {
        return await this.archiveWeeklyGoals(history, completedGoals, date);
      } else if (period === 'monthly') {
        return await this.archiveMonthlyGoals(history, completedGoals, date);
      }

      return false;
    } catch (error) {
      console.error('Error archiving completed goals:', error);
      return false;
    }
  }

  /**
   * Archive daily goals
   */
  private static async archiveDailyGoals(
    history: GoalHistory,
    completedGoals: CompletedGoalEntry[],
    date: Date
  ): Promise<boolean> {
    const dateKey = format(date, 'yyyy-MM-dd');
    
    // Filter only daily goals
    const dailyGoals = completedGoals.filter(g => g.period === 'daily');
    
    const entry: DailyHistoryEntry = {
      date: dateKey,
      completed: dailyGoals.length,
      total: dailyGoals.length, // This should include all daily goals, not just completed
      goals: dailyGoals,
    };

    history.daily[dateKey] = entry;
    return await this.saveHistory(history);
  }

  /**
   * Archive weekly goals
   */
  private static async archiveWeeklyGoals(
    history: GoalHistory,
    completedGoals: CompletedGoalEntry[],
    date: Date
  ): Promise<boolean> {
    const year = getYear(date);
    const week = getISOWeek(date);
    const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;
    
    const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });
    
    // Filter only weekly goals
    const weeklyGoals = completedGoals.filter(g => g.period === 'weekly');
    
    const entry: WeeklyHistoryEntry = {
      weekKey,
      startDate: format(weekStart, 'yyyy-MM-dd'),
      endDate: format(weekEnd, 'yyyy-MM-dd'),
      completed: weeklyGoals.length,
      total: weeklyGoals.length,
      goals: weeklyGoals,
    };

    history.weekly[weekKey] = entry;
    return await this.saveHistory(history);
  }

  /**
   * Archive monthly goals
   */
  private static async archiveMonthlyGoals(
    history: GoalHistory,
    completedGoals: CompletedGoalEntry[],
    date: Date
  ): Promise<boolean> {
    const monthKey = format(date, 'yyyy-MM');
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    // Filter only monthly goals
    const monthlyGoals = completedGoals.filter(g => g.period === 'monthly');
    
    const entry: MonthlyHistoryEntry = {
      monthKey,
      year,
      month,
      completed: monthlyGoals.length,
      total: monthlyGoals.length,
      goals: monthlyGoals,
    };

    history.monthly[monthKey] = entry;
    return await this.saveHistory(history);
  }

  /**
   * Get daily history for a specific date
   */
  static async getDailyHistory(date: Date): Promise<DailyHistoryEntry | null> {
    const history = await this.getHistory();
    const dateKey = format(date, 'yyyy-MM-dd');
    return history.daily[dateKey] || null;
  }

  /**
   * Get weekly history for a specific date
   */
  static async getWeeklyHistory(date: Date): Promise<WeeklyHistoryEntry | null> {
    const history = await this.getHistory();
    const year = getYear(date);
    const week = getISOWeek(date);
    const weekKey = `${year}-W${week.toString().padStart(2, '0')}`;
    return history.weekly[weekKey] || null;
  }

  /**
   * Get monthly history for a specific date
   */
  static async getMonthlyHistory(date: Date): Promise<MonthlyHistoryEntry | null> {
    const history = await this.getHistory();
    const monthKey = format(date, 'yyyy-MM');
    return history.monthly[monthKey] || null;
  }

  /**
   * Get all daily history entries (sorted by date, newest first)
   */
  static async getAllDailyHistory(): Promise<DailyHistoryEntry[]> {
    const history = await this.getHistory();
    return Object.values(history.daily).sort((a, b) => 
      b.date.localeCompare(a.date)
    );
  }

  /**
   * Get all weekly history entries (sorted by week, newest first)
   */
  static async getAllWeeklyHistory(): Promise<WeeklyHistoryEntry[]> {
    const history = await this.getHistory();
    return Object.values(history.weekly).sort((a, b) => 
      b.weekKey.localeCompare(a.weekKey)
    );
  }

  /**
   * Get all monthly history entries (sorted by month, newest first)
   */
  static async getAllMonthlyHistory(): Promise<MonthlyHistoryEntry[]> {
    const history = await this.getHistory();
    return Object.values(history.monthly).sort((a, b) => 
      b.monthKey.localeCompare(a.monthKey)
    );
  }

  /**
   * Get history for a date range
   */
  static async getHistoryRange(
    startDate: Date,
    endDate: Date
  ): Promise<DailyHistoryEntry[]> {
    const history = await this.getHistory();
    const startKey = format(startDate, 'yyyy-MM-dd');
    const endKey = format(endDate, 'yyyy-MM-dd');
    
    return Object.values(history.daily)
      .filter(entry => entry.date >= startKey && entry.date <= endKey)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Calculate completion statistics for a period
   */
  static async getCompletionStats(period: 'daily' | 'weekly' | 'monthly', limit: number = 30) {
    const history = await this.getHistory();
    let entries: Array<{ completed: number; total: number }> = [];

    if (period === 'daily') {
      entries = Object.values(history.daily)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, limit);
    } else if (period === 'weekly') {
      entries = Object.values(history.weekly)
        .sort((a, b) => b.weekKey.localeCompare(a.weekKey))
        .slice(0, limit);
    } else {
      entries = Object.values(history.monthly)
        .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
        .slice(0, limit);
    }

    const totalCompleted = entries.reduce((sum, e) => sum + e.completed, 0);
    const totalGoals = entries.reduce((sum, e) => sum + e.total, 0);
    const averageCompletionRate = totalGoals > 0 ? (totalCompleted / totalGoals) * 100 : 0;

    return {
      totalCompleted,
      totalGoals,
      averageCompletionRate,
      entriesCount: entries.length,
    };
  }

  /**
   * Clear old history (keep last N days)
   */
  static async clearOldHistory(daysToKeep: number = 90): Promise<boolean> {
    try {
      const history = await this.getHistory();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
      const cutoffKey = format(cutoffDate, 'yyyy-MM-dd');

      // Filter daily history
      const filteredDaily: Record<string, DailyHistoryEntry> = {};
      Object.entries(history.daily).forEach(([key, value]) => {
        if (key >= cutoffKey) {
          filteredDaily[key] = value;
        }
      });
      history.daily = filteredDaily;

      return await this.saveHistory(history);
    } catch (error) {
      console.error('Error clearing old history:', error);
      return false;
    }
  }
}
