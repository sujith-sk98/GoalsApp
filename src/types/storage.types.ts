/**
 * Storage Type Definitions
 * 
 * Type definitions for local storage and future API integration
 */

import { Goal } from '../components/GoalItem';

/**
 * Goal Period Types
 */
export type GoalPeriod = 'daily' | 'weekly' | 'monthly';

/**
 * Goal Period Card stored in database
 */
export interface GoalPeriodCard {
  id: string;
  period: GoalPeriod;
  title: string;
  goals: Goal[];
  color?: string;
}

/**
 * Goal Group stored in database
 */
export interface GoalGroup {
  id: string;
  name: string;
  color?: string;
  friendIds: string[];
  cards: GoalPeriodCard[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Friend/User stored in database
 */
export interface Friend {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarColor?: string;
  createdAt: string;
}

/**
 * Completed Goal Entry for History
 */
export interface CompletedGoalEntry {
  id: string;
  goalId: string;
  title: string;
  groupId: string;
  groupName: string;
  period: GoalPeriod;
  completedAt: string;
}

/**
 * Daily History Entry
 */
export interface DailyHistoryEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  completed: number;
  total: number;
  goals: CompletedGoalEntry[];
}

/**
 * Weekly History Entry
 */
export interface WeeklyHistoryEntry {
  weekKey: string; // Format: YYYY-Wxx (e.g., 2024-W03)
  startDate: string;
  endDate: string;
  completed: number;
  total: number;
  goals: CompletedGoalEntry[];
}

/**
 * Monthly History Entry
 */
export interface MonthlyHistoryEntry {
  monthKey: string; // Format: YYYY-MM (e.g., 2024-01)
  year: number;
  month: number;
  completed: number;
  total: number;
  goals: CompletedGoalEntry[];
}

/**
 * Complete History Storage Structure
 */
export interface GoalHistory {
  daily: Record<string, DailyHistoryEntry>;
  weekly: Record<string, WeeklyHistoryEntry>;
  monthly: Record<string, MonthlyHistoryEntry>;
}

/**
 * Reset Metadata to track last reset times
 */
export interface ResetMetadata {
  lastDailyReset: string; // ISO timestamp
  lastWeeklyReset: string; // ISO timestamp
  lastMonthlyReset: string; // ISO timestamp
  currentDailyDate: string; // YYYY-MM-DD
  currentWeekKey: string; // YYYY-Wxx
  currentMonthKey: string; // YYYY-MM
}

/**
 * User Profile Information
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete Application Data Structure
 */
export interface AppData {
  groups: GoalGroup[];
  friends: Friend[];
  user: UserProfile;
  history: GoalHistory;
  metadata: ResetMetadata;
  version: string; // For data migration
}

/**
 * Storage Keys for AsyncStorage
 */
export enum StorageKeys {
  GROUPS = '@goals_app/groups',
  FRIENDS = '@goals_app/friends',
  USER = '@goals_app/user',
  HISTORY = '@goals_app/history',
  METADATA = '@goals_app/metadata',
  VERSION = '@goals_app/version',
}

/**
 * API Response wrapper for future backend integration
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

/**
 * Sync Queue Item for offline changes
 */
export interface SyncQueueItem {
  id: string;
  action: 'create' | 'update' | 'delete';
  entity: 'goal' | 'group' | 'friend';
  data: any;
  timestamp: string;
  synced: boolean;
}
