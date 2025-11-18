/**
 * Goal Storage Service
 * 
 * Business logic layer for managing goals, groups, and friends.
 * This service will be easy to swap with API calls later.
 */

import { StorageService } from './StorageService';
import { StorageKeys, GoalGroup, Friend, UserProfile } from '../types/storage.types';
import { Goal } from '../components/GoalItem';

export class GoalStorage {
  // ==================== GROUPS ====================

  /**
   * Get all goal groups
   */
  static async getGroups(): Promise<GoalGroup[]> {
    const groups = await StorageService.load<GoalGroup[]>(StorageKeys.GROUPS);
    return groups || [];
  }

  /**
   * Save all goal groups
   */
  static async saveGroups(groups: GoalGroup[]): Promise<boolean> {
    return await StorageService.save(StorageKeys.GROUPS, groups);
  }

  /**
   * Get a single group by ID
   */
  static async getGroupById(groupId: string): Promise<GoalGroup | null> {
    const groups = await this.getGroups();
    return groups.find(g => g.id === groupId) || null;
  }

  /**
   * Add a new group
   */
  static async addGroup(name: string, color: string, friendIds: string[] = []): Promise<GoalGroup | null> {
    try {
      const groups = await this.getGroups();
      const now = new Date().toISOString();
      
      const newGroup: GoalGroup = {
        id: `group-${Date.now()}`,
        name,
        color,
        friendIds,
        createdAt: now,
        updatedAt: now,
        cards: [
          {
            id: `${Date.now()}-daily`,
            period: 'daily',
            title: 'Daily Goals',
            color: color,
            goals: [],
          },
          {
            id: `${Date.now()}-weekly`,
            period: 'weekly',
            title: 'Weekly Goals',
            color: color,
            goals: [],
          },
          {
            id: `${Date.now()}-monthly`,
            period: 'monthly',
            title: 'Monthly Goals',
            color: color,
            goals: [],
          },
        ],
      };

      groups.push(newGroup);
      const success = await this.saveGroups(groups);
      return success ? newGroup : null;
    } catch (error) {
      console.error('Error adding group:', error);
      return null;
    }
  }

  /**
   * Update an existing group
   */
  static async updateGroup(groupId: string, updates: Partial<GoalGroup>): Promise<boolean> {
    try {
      const groups = await this.getGroups();
      const groupIndex = groups.findIndex(g => g.id === groupId);
      
      if (groupIndex === -1) {
        return false;
      }

      groups[groupIndex] = {
        ...groups[groupIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return await this.saveGroups(groups);
    } catch (error) {
      console.error('Error updating group:', error);
      return false;
    }
  }

  /**
   * Delete a group
   */
  static async deleteGroup(groupId: string): Promise<boolean> {
    try {
      const groups = await this.getGroups();
      const filteredGroups = groups.filter(g => g.id !== groupId);
      
      if (filteredGroups.length === groups.length) {
        return false; // Group not found
      }

      return await this.saveGroups(filteredGroups);
    } catch (error) {
      console.error('Error deleting group:', error);
      return false;
    }
  }

  // ==================== GOALS ====================

  /**
   * Add a new goal to a specific group and period
   */
  static async addGoal(
    groupId: string,
    period: 'daily' | 'weekly' | 'monthly',
    title: string
  ): Promise<Goal | null> {
    try {
      const groups = await this.getGroups();
      const group = groups.find(g => g.id === groupId);
      
      if (!group) {
        console.error('Group not found');
        return null;
      }

      const card = group.cards.find(c => c.period === period);
      if (!card) {
        console.error('Card not found');
        return null;
      }

      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title,
        completed: false,
      };

      card.goals.push(newGoal);
      group.updatedAt = new Date().toISOString();
      
      const success = await this.saveGroups(groups);
      return success ? newGoal : null;
    } catch (error) {
      console.error('Error adding goal:', error);
      return null;
    }
  }

  /**
   * Toggle goal completion status
   */
  static async toggleGoal(groupId: string, cardId: string, goalId: string): Promise<boolean> {
    try {
      const groups = await this.getGroups();
      const group = groups.find(g => g.id === groupId);
      
      if (!group) return false;

      const card = group.cards.find(c => c.id === cardId);
      if (!card) return false;

      const goal = card.goals.find(g => g.id === goalId);
      if (!goal) return false;

      goal.completed = !goal.completed;
      group.updatedAt = new Date().toISOString();

      return await this.saveGroups(groups);
    } catch (error) {
      console.error('Error toggling goal:', error);
      return false;
    }
  }

  /**
   * Delete a goal
   */
  static async deleteGoal(groupId: string, cardId: string, goalId: string): Promise<boolean> {
    try {
      const groups = await this.getGroups();
      const group = groups.find(g => g.id === groupId);
      
      if (!group) return false;

      const card = group.cards.find(c => c.id === cardId);
      if (!card) return false;

      const initialLength = card.goals.length;
      card.goals = card.goals.filter(g => g.id !== goalId);
      
      if (card.goals.length === initialLength) {
        return false; // Goal not found
      }

      group.updatedAt = new Date().toISOString();
      return await this.saveGroups(groups);
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  }

  /**
   * Update all goals in a specific card (used for batch updates/resets)
   */
  static async updateCardGoals(
    groupId: string,
    cardId: string,
    goals: Goal[]
  ): Promise<boolean> {
    try {
      const groups = await this.getGroups();
      const group = groups.find(g => g.id === groupId);
      
      if (!group) return false;

      const card = group.cards.find(c => c.id === cardId);
      if (!card) return false;

      card.goals = goals;
      group.updatedAt = new Date().toISOString();

      return await this.saveGroups(groups);
    } catch (error) {
      console.error('Error updating card goals:', error);
      return false;
    }
  }

  // ==================== FRIENDS ====================

  /**
   * Get all friends
   */
  static async getFriends(): Promise<Friend[]> {
    const friends = await StorageService.load<Friend[]>(StorageKeys.FRIENDS);
    return friends || [];
  }

  /**
   * Save all friends
   */
  static async saveFriends(friends: Friend[]): Promise<boolean> {
    return await StorageService.save(StorageKeys.FRIENDS, friends);
  }

  /**
   * Add a new friend
   */
  static async addFriend(name: string, email?: string, phone?: string): Promise<Friend | null> {
    try {
      const friends = await this.getFriends();
      const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#34D399', '#FBBF24'];
      
      const newFriend: Friend = {
        id: `friend-${Date.now()}`,
        name,
        email,
        phone,
        avatarColor: colors[Math.floor(Math.random() * colors.length)],
        createdAt: new Date().toISOString(),
      };

      friends.push(newFriend);
      const success = await this.saveFriends(friends);
      return success ? newFriend : null;
    } catch (error) {
      console.error('Error adding friend:', error);
      return null;
    }
  }

  /**
   * Delete a friend
   */
  static async deleteFriend(friendId: string): Promise<boolean> {
    try {
      const friends = await this.getFriends();
      const filteredFriends = friends.filter(f => f.id !== friendId);
      
      if (filteredFriends.length === friends.length) {
        return false; // Friend not found
      }

      return await this.saveFriends(filteredFriends);
    } catch (error) {
      console.error('Error deleting friend:', error);
      return false;
    }
  }

  /**
   * Add friend to a group
   */
  static async addFriendToGroup(groupId: string, friendId: string): Promise<boolean> {
    try {
      const groups = await this.getGroups();
      const group = groups.find(g => g.id === groupId);
      
      if (!group) return false;

      if (!group.friendIds.includes(friendId)) {
        group.friendIds.push(friendId);
        group.updatedAt = new Date().toISOString();
        return await this.saveGroups(groups);
      }

      return true; // Already in group
    } catch (error) {
      console.error('Error adding friend to group:', error);
      return false;
    }
  }

  /**
   * Remove friend from a group
   */
  static async removeFriendFromGroup(groupId: string, friendId: string): Promise<boolean> {
    try {
      const groups = await this.getGroups();
      const group = groups.find(g => g.id === groupId);
      
      if (!group) return false;

      const initialLength = group.friendIds.length;
      group.friendIds = group.friendIds.filter(id => id !== friendId);
      
      if (group.friendIds.length < initialLength) {
        group.updatedAt = new Date().toISOString();
        return await this.saveGroups(groups);
      }

      return false; // Friend not in group
    } catch (error) {
      console.error('Error removing friend from group:', error);
      return false;
    }
  }

  // ==================== USER ====================

  /**
   * Get user profile
   */
  static async getUser(): Promise<UserProfile | null> {
    return await StorageService.load<UserProfile>(StorageKeys.USER);
  }

  /**
   * Save user profile
   */
  static async saveUser(user: UserProfile): Promise<boolean> {
    return await StorageService.save(StorageKeys.USER, user);
  }

  /**
   * Update user profile
   */
  static async updateUser(updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const user = await this.getUser();
      if (!user) return false;

      const updatedUser = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return await this.saveUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }
}
