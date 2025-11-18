/**
 * useGoals Hook
 * 
 * Custom hook for managing goals, groups, and friends with local storage.
 * Provides an easy-to-use interface that can later be swapped for API calls.
 */

import { useState, useEffect, useCallback } from 'react';
import { GoalStorage } from '../storage/GoalStorage';
import { GoalGroup, Friend } from '../types/storage.types';
import { Goal } from '../components/GoalItem';

export const useGoals = () => {
  const [groups, setGroups] = useState<GoalGroup[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load all data from storage
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [loadedGroups, loadedFriends] = await Promise.all([
        GoalStorage.getGroups(),
        GoalStorage.getFriends(),
      ]);

      setGroups(loadedGroups);
      setFriends(loadedFriends);
    } catch (err) {
      console.error('Error loading goals data:', err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh data (useful after external changes)
   */
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  /**
   * Add a new group
   */
  const addGroup = useCallback(async (name: string, color: string, friendIds: string[] = []) => {
    try {
      const newGroup = await GoalStorage.addGroup(name, color, friendIds);
      if (newGroup) {
        setGroups(prev => [...prev, newGroup]);
        return newGroup;
      }
      return null;
    } catch (err) {
      console.error('Error adding group:', err);
      setError('Failed to add group');
      return null;
    }
  }, []);

  /**
   * Update a group
   */
  const updateGroup = useCallback(async (groupId: string, updates: Partial<GoalGroup>) => {
    try {
      const success = await GoalStorage.updateGroup(groupId, updates);
      if (success) {
        setGroups(prev =>
          prev.map(g => (g.id === groupId ? { ...g, ...updates } : g))
        );
      }
      return success;
    } catch (err) {
      console.error('Error updating group:', err);
      setError('Failed to update group');
      return false;
    }
  }, []);

  /**
   * Delete a group
   */
  const deleteGroup = useCallback(async (groupId: string) => {
    try {
      const success = await GoalStorage.deleteGroup(groupId);
      if (success) {
        setGroups(prev => prev.filter(g => g.id !== groupId));
      }
      return success;
    } catch (err) {
      console.error('Error deleting group:', err);
      setError('Failed to delete group');
      return false;
    }
  }, []);

  /**
   * Add a new goal
   */
  const addGoal = useCallback(async (
    groupId: string,
    period: 'daily' | 'weekly' | 'monthly',
    title: string
  ) => {
    try {
      const newGoal = await GoalStorage.addGoal(groupId, period, title);
      if (newGoal) {
        // Update local state
        setGroups(prev =>
          prev.map(group => {
            if (group.id === groupId) {
              return {
                ...group,
                cards: group.cards.map(card => {
                  if (card.period === period) {
                    return {
                      ...card,
                      goals: [...card.goals, newGoal],
                    };
                  }
                  return card;
                }),
              };
            }
            return group;
          })
        );
      }
      return newGoal;
    } catch (err) {
      console.error('Error adding goal:', err);
      setError('Failed to add goal');
      return null;
    }
  }, []);

  /**
   * Toggle goal completion
   */
  const toggleGoal = useCallback(async (groupId: string, cardId: string, goalId: string) => {
    try {
      const success = await GoalStorage.toggleGoal(groupId, cardId, goalId);
      if (success) {
        // Update local state
        setGroups(prev =>
          prev.map(group => {
            if (group.id === groupId) {
              return {
                ...group,
                cards: group.cards.map(card => {
                  if (card.id === cardId) {
                    return {
                      ...card,
                      goals: card.goals.map(goal => {
                        if (goal.id === goalId) {
                          return { ...goal, completed: !goal.completed };
                        }
                        return goal;
                      }),
                    };
                  }
                  return card;
                }),
              };
            }
            return group;
          })
        );
      }
      return success;
    } catch (err) {
      console.error('Error toggling goal:', err);
      setError('Failed to toggle goal');
      return false;
    }
  }, []);

  /**
   * Delete a goal
   */
  const deleteGoal = useCallback(async (groupId: string, cardId: string, goalId: string) => {
    try {
      const success = await GoalStorage.deleteGoal(groupId, cardId, goalId);
      if (success) {
        // Update local state
        setGroups(prev =>
          prev.map(group => {
            if (group.id === groupId) {
              return {
                ...group,
                cards: group.cards.map(card => {
                  if (card.id === cardId) {
                    return {
                      ...card,
                      goals: card.goals.filter(g => g.id !== goalId),
                    };
                  }
                  return card;
                }),
              };
            }
            return group;
          })
        );
      }
      return success;
    } catch (err) {
      console.error('Error deleting goal:', err);
      setError('Failed to delete goal');
      return false;
    }
  }, []);

  /**
   * Add a friend
   */
  const addFriend = useCallback(async (name: string, email?: string, phone?: string) => {
    try {
      const newFriend = await GoalStorage.addFriend(name, email, phone);
      if (newFriend) {
        setFriends(prev => [...prev, newFriend]);
      }
      return newFriend;
    } catch (err) {
      console.error('Error adding friend:', err);
      setError('Failed to add friend');
      return null;
    }
  }, []);

  /**
   * Delete a friend
   */
  const deleteFriend = useCallback(async (friendId: string) => {
    try {
      const success = await GoalStorage.deleteFriend(friendId);
      if (success) {
        setFriends(prev => prev.filter(f => f.id !== friendId));
      }
      return success;
    } catch (err) {
      console.error('Error deleting friend:', err);
      setError('Failed to delete friend');
      return false;
    }
  }, []);

  /**
   * Add friend to group
   */
  const addFriendToGroup = useCallback(async (groupId: string, friendId: string) => {
    try {
      const success = await GoalStorage.addFriendToGroup(groupId, friendId);
      if (success) {
        setGroups(prev =>
          prev.map(g => {
            if (g.id === groupId && !g.friendIds.includes(friendId)) {
              return { ...g, friendIds: [...g.friendIds, friendId] };
            }
            return g;
          })
        );
      }
      return success;
    } catch (err) {
      console.error('Error adding friend to group:', err);
      setError('Failed to add friend to group');
      return false;
    }
  }, []);

  /**
   * Remove friend from group
   */
  const removeFriendFromGroup = useCallback(async (groupId: string, friendId: string) => {
    try {
      const success = await GoalStorage.removeFriendFromGroup(groupId, friendId);
      if (success) {
        setGroups(prev =>
          prev.map(g => {
            if (g.id === groupId) {
              return { ...g, friendIds: g.friendIds.filter(id => id !== friendId) };
            }
            return g;
          })
        );
      }
      return success;
    } catch (err) {
      console.error('Error removing friend from group:', err);
      setError('Failed to remove friend from group');
      return false;
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // State
    groups,
    friends,
    loading,
    error,
    
    // Actions
    refresh,
    addGroup,
    updateGroup,
    deleteGroup,
    addGoal,
    toggleGoal,
    deleteGoal,
    addFriend,
    deleteFriend,
    addFriendToGroup,
    removeFriendFromGroup,
  };
};
