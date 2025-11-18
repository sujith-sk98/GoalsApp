/**
 * Reset Service
 * 
 * Handles automatic resetting of goals based on their cycle (daily/weekly/monthly).
 * Archives completed goals to history before resetting.
 */

import { StorageService } from './StorageService';
import { GoalStorage } from './GoalStorage';
import { HistoryStorage } from './HistoryStorage';
import { 
  StorageKeys, 
  ResetMetadata, 
  GoalGroup, 
  CompletedGoalEntry,
  GoalPeriod,
} from '../types/storage.types';
import { 
  format, 
  isSameDay, 
  startOfWeek, 
  getISOWeek, 
  getYear,
  isSameMonth,
} from 'date-fns';

export class ResetService {
  /**
   * Get reset metadata
   */
  static async getMetadata(): Promise<ResetMetadata> {
    const metadata = await StorageService.load<ResetMetadata>(StorageKeys.METADATA);
    
    if (!metadata) {
      // Initialize metadata for first time
      const now = new Date();
      const initialMetadata: ResetMetadata = {
        lastDailyReset: now.toISOString(),
        lastWeeklyReset: now.toISOString(),
        lastMonthlyReset: now.toISOString(),
        currentDailyDate: format(now, 'yyyy-MM-dd'),
        currentWeekKey: this.getWeekKey(now),
        currentMonthKey: format(now, 'yyyy-MM'),
      };
      await this.saveMetadata(initialMetadata);
      return initialMetadata;
    }

    return metadata;
  }

  /**
   * Save reset metadata
   */
  static async saveMetadata(metadata: ResetMetadata): Promise<boolean> {
    return await StorageService.save(StorageKeys.METADATA, metadata);
  }

  /**
   * Get week key in format YYYY-Wxx
   */
  private static getWeekKey(date: Date): string {
    const year = getYear(date);
    const week = getISOWeek(date);
    return `${year}-W${week.toString().padStart(2, '0')}`;
  }

  /**
   * Check if daily goals need to be reset
   */
  static shouldResetDaily(metadata: ResetMetadata): boolean {
    const now = new Date();
    const lastReset = new Date(metadata.lastDailyReset);
    return !isSameDay(now, lastReset);
  }

  /**
   * Check if weekly goals need to be reset
   */
  static shouldResetWeekly(metadata: ResetMetadata): boolean {
    const now = new Date();
    const currentWeekKey = this.getWeekKey(now);
    return currentWeekKey !== metadata.currentWeekKey;
  }

  /**
   * Check if monthly goals need to be reset
   */
  static shouldResetMonthly(metadata: ResetMetadata): boolean {
    const now = new Date();
    const lastReset = new Date(metadata.lastMonthlyReset);
    return !isSameMonth(now, lastReset);
  }

  /**
   * Perform all necessary resets based on current date
   */
  static async performResets(): Promise<{
    dailyReset: boolean;
    weeklyReset: boolean;
    monthlyReset: boolean;
  }> {
    const metadata = await this.getMetadata();
    const results = {
      dailyReset: false,
      weeklyReset: false,
      monthlyReset: false,
    };

    // Check and perform daily reset
    if (this.shouldResetDaily(metadata)) {
      console.log('🔄 Performing daily reset...');
      results.dailyReset = await this.resetDaily();
    }

    // Check and perform weekly reset
    if (this.shouldResetWeekly(metadata)) {
      console.log('🔄 Performing weekly reset...');
      results.weeklyReset = await this.resetWeekly();
    }

    // Check and perform monthly reset
    if (this.shouldResetMonthly(metadata)) {
      console.log('🔄 Performing monthly reset...');
      results.monthlyReset = await this.resetMonthly();
    }

    return results;
  }

  /**
   * Reset daily goals
   */
  private static async resetDaily(): Promise<boolean> {
    try {
      const groups = await GoalStorage.getGroups();
      const completedGoals: CompletedGoalEntry[] = [];
      const now = new Date();

      // Collect completed goals and reset all daily goals
      groups.forEach(group => {
        const dailyCard = group.cards.find(c => c.period === 'daily');
        if (dailyCard) {
          // Archive completed goals
          dailyCard.goals.forEach(goal => {
            if (goal.completed) {
              completedGoals.push({
                id: `${goal.id}-${now.getTime()}`,
                goalId: goal.id,
                title: goal.title,
                groupId: group.id,
                groupName: group.name,
                period: 'daily',
                completedAt: now.toISOString(),
              });
            }
          });

          // Reset all goals to incomplete
          dailyCard.goals = dailyCard.goals.map(goal => ({
            ...goal,
            completed: false,
          }));
        }
      });

      // Save updated groups
      await GoalStorage.saveGroups(groups);

      // Archive completed goals to history
      if (completedGoals.length > 0) {
        await HistoryStorage.archiveCompletedGoals(completedGoals, 'daily', now);
      }

      // Update metadata
      const metadata = await this.getMetadata();
      metadata.lastDailyReset = now.toISOString();
      metadata.currentDailyDate = format(now, 'yyyy-MM-dd');
      await this.saveMetadata(metadata);

      console.log(`✅ Daily reset complete. Archived ${completedGoals.length} completed goals.`);
      return true;
    } catch (error) {
      console.error('❌ Error resetting daily goals:', error);
      return false;
    }
  }

  /**
   * Reset weekly goals
   */
  private static async resetWeekly(): Promise<boolean> {
    try {
      const groups = await GoalStorage.getGroups();
      const completedGoals: CompletedGoalEntry[] = [];
      const now = new Date();

      // Collect completed goals and reset all weekly goals
      groups.forEach(group => {
        const weeklyCard = group.cards.find(c => c.period === 'weekly');
        if (weeklyCard) {
          // Archive completed goals
          weeklyCard.goals.forEach(goal => {
            if (goal.completed) {
              completedGoals.push({
                id: `${goal.id}-${now.getTime()}`,
                goalId: goal.id,
                title: goal.title,
                groupId: group.id,
                groupName: group.name,
                period: 'weekly',
                completedAt: now.toISOString(),
              });
            }
          });

          // Reset all goals to incomplete
          weeklyCard.goals = weeklyCard.goals.map(goal => ({
            ...goal,
            completed: false,
          }));
        }
      });

      // Save updated groups
      await GoalStorage.saveGroups(groups);

      // Archive completed goals to history
      if (completedGoals.length > 0) {
        await HistoryStorage.archiveCompletedGoals(completedGoals, 'weekly', now);
      }

      // Update metadata
      const metadata = await this.getMetadata();
      metadata.lastWeeklyReset = now.toISOString();
      metadata.currentWeekKey = this.getWeekKey(now);
      await this.saveMetadata(metadata);

      console.log(`✅ Weekly reset complete. Archived ${completedGoals.length} completed goals.`);
      return true;
    } catch (error) {
      console.error('❌ Error resetting weekly goals:', error);
      return false;
    }
  }

  /**
   * Reset monthly goals
   */
  private static async resetMonthly(): Promise<boolean> {
    try {
      const groups = await GoalStorage.getGroups();
      const completedGoals: CompletedGoalEntry[] = [];
      const now = new Date();

      // Collect completed goals and reset all monthly goals
      groups.forEach(group => {
        const monthlyCard = group.cards.find(c => c.period === 'monthly');
        if (monthlyCard) {
          // Archive completed goals
          monthlyCard.goals.forEach(goal => {
            if (goal.completed) {
              completedGoals.push({
                id: `${goal.id}-${now.getTime()}`,
                goalId: goal.id,
                title: goal.title,
                groupId: group.id,
                groupName: group.name,
                period: 'monthly',
                completedAt: now.toISOString(),
              });
            }
          });

          // Reset all goals to incomplete
          monthlyCard.goals = monthlyCard.goals.map(goal => ({
            ...goal,
            completed: false,
          }));
        }
      });

      // Save updated groups
      await GoalStorage.saveGroups(groups);

      // Archive completed goals to history
      if (completedGoals.length > 0) {
        await HistoryStorage.archiveCompletedGoals(completedGoals, 'monthly', now);
      }

      // Update metadata
      const metadata = await this.getMetadata();
      metadata.lastMonthlyReset = now.toISOString();
      metadata.currentMonthKey = format(now, 'yyyy-MM');
      await this.saveMetadata(metadata);

      console.log(`✅ Monthly reset complete. Archived ${completedGoals.length} completed goals.`);
      return true;
    } catch (error) {
      console.error('❌ Error resetting monthly goals:', error);
      return false;
    }
  }

  /**
   * Force reset all goals (for testing or manual reset)
   */
  static async forceResetAll(): Promise<boolean> {
    try {
      await this.resetDaily();
      await this.resetWeekly();
      await this.resetMonthly();
      console.log('✅ All goals forcefully reset');
      return true;
    } catch (error) {
      console.error('❌ Error force resetting:', error);
      return false;
    }
  }

  /**
   * Get next reset times
   */
  static async getNextResetTimes(): Promise<{
    nextDaily: Date;
    nextWeekly: Date;
    nextMonthly: Date;
  }> {
    const metadata = await this.getMetadata();
    const now = new Date();
    
    // Next daily: tomorrow at midnight
    const nextDaily = new Date(now);
    nextDaily.setDate(nextDaily.getDate() + 1);
    nextDaily.setHours(0, 0, 0, 0);

    // Next weekly: next Monday at midnight
    const nextWeekly = startOfWeek(now, { weekStartsOn: 1 });
    nextWeekly.setDate(nextWeekly.getDate() + 7);
    nextWeekly.setHours(0, 0, 0, 0);

    // Next monthly: 1st of next month at midnight
    const nextMonthly = new Date(now);
    nextMonthly.setMonth(nextMonthly.getMonth() + 1);
    nextMonthly.setDate(1);
    nextMonthly.setHours(0, 0, 0, 0);

    return {
      nextDaily,
      nextWeekly,
      nextMonthly,
    };
  }
}
