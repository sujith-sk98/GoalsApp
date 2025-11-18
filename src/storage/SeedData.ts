/**
 * Seed Data
 * 
 * Initial placeholder data for first-time users.
 * Provides a starter set of groups and goals to demonstrate the app.
 */

import { GoalGroup, Friend, UserProfile } from '../types/storage.types';
import { Colors } from '../utils/theme';

/**
 * Generate seed groups with sample goals
 */
export const generateSeedGroups = (): GoalGroup[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'seed-group-1',
      name: 'Health & Fitness',
      color: Colors.mint400,
      friendIds: [],
      createdAt: now,
      updatedAt: now,
      cards: [
        {
          id: 'seed-1-daily',
          period: 'daily',
          title: 'Daily Goals',
          color: Colors.mint400,
          goals: [
            { id: 'seed-1-d-1', title: 'Morning workout - 30 minutes', completed: false },
            { id: 'seed-1-d-2', title: 'Drink 8 glasses of water', completed: false },
            { id: 'seed-1-d-3', title: '10,000 steps daily', completed: false },
          ],
        },
        {
          id: 'seed-1-weekly',
          period: 'weekly',
          title: 'Weekly Goals',
          color: Colors.mint400,
          goals: [
            { id: 'seed-1-w-1', title: 'Gym 5 times this week', completed: false },
            { id: 'seed-1-w-2', title: 'Try a new healthy recipe', completed: false },
          ],
        },
        {
          id: 'seed-1-monthly',
          period: 'monthly',
          title: 'Monthly Goals',
          color: Colors.mint400,
          goals: [
            { id: 'seed-1-m-1', title: 'Complete 30-day fitness challenge', completed: false },
          ],
        },
      ],
    },
    {
      id: 'seed-group-2',
      name: 'Work & Productivity',
      color: Colors.blue600,
      friendIds: [],
      createdAt: now,
      updatedAt: now,
      cards: [
        {
          id: 'seed-2-daily',
          period: 'daily',
          title: 'Daily Goals',
          color: Colors.blue600,
          goals: [
            { id: 'seed-2-d-1', title: 'Review emails', completed: false },
            { id: 'seed-2-d-2', title: 'Plan tomorrow\'s tasks', completed: false },
            { id: 'seed-2-d-3', title: 'Focus work - 2 hours deep work', completed: false },
          ],
        },
        {
          id: 'seed-2-weekly',
          period: 'weekly',
          title: 'Weekly Goals',
          color: Colors.blue600,
          goals: [
            { id: 'seed-2-w-1', title: 'Complete project milestone', completed: false },
            { id: 'seed-2-w-2', title: 'Team meeting preparation', completed: false },
          ],
        },
        {
          id: 'seed-2-monthly',
          period: 'monthly',
          title: 'Monthly Goals',
          color: Colors.blue600,
          goals: [
            { id: 'seed-2-m-1', title: 'Deliver major feature', completed: false },
          ],
        },
      ],
    },
    {
      id: 'seed-group-3',
      name: 'Learning & Growth',
      color: Colors.purple600,
      friendIds: [],
      createdAt: now,
      updatedAt: now,
      cards: [
        {
          id: 'seed-3-daily',
          period: 'daily',
          title: 'Daily Goals',
          color: Colors.purple600,
          goals: [
            { id: 'seed-3-d-1', title: 'Read for 20 minutes', completed: false },
            { id: 'seed-3-d-2', title: 'Practice coding - 1 problem', completed: false },
          ],
        },
        {
          id: 'seed-3-weekly',
          period: 'weekly',
          title: 'Weekly Goals',
          color: Colors.purple600,
          goals: [
            { id: 'seed-3-w-1', title: 'Complete online course module', completed: false },
            { id: 'seed-3-w-2', title: 'Watch 2 educational videos', completed: false },
          ],
        },
        {
          id: 'seed-3-monthly',
          period: 'monthly',
          title: 'Monthly Goals',
          color: Colors.purple600,
          goals: [
            { id: 'seed-3-m-1', title: 'Finish React Native course', completed: false },
            { id: 'seed-3-m-2', title: 'Build a side project', completed: false },
          ],
        },
      ],
    },
  ];
};

/**
 * Generate seed friends
 */
export const generateSeedFriends = (): Friend[] => {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'seed-friend-1',
      name: 'Alex Johnson',
      email: 'alex@example.com',
      avatarColor: Colors.blue600,
      createdAt: now,
    },
    {
      id: 'seed-friend-2',
      name: 'Sarah Williams',
      email: 'sarah@example.com',
      avatarColor: Colors.purple600,
      createdAt: now,
    },
    {
      id: 'seed-friend-3',
      name: 'Michael Chen',
      email: 'michael@example.com',
      avatarColor: Colors.green600,
      createdAt: now,
    },
  ];
};

/**
 * Generate default user profile
 */
export const generateDefaultUser = (): UserProfile => {
  const now = new Date().toISOString();
  
  return {
    id: 'user-default',
    name: 'Sujith',
    email: 'sujith@example.com',
    phone: '7907003467',
    isPremium: true,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Check if this is the first launch and initialize data if needed
 */
import { GoalStorage } from './GoalStorage';
import { ResetService } from './ResetService';
import { StorageService } from './StorageService';
import { StorageKeys } from '../types/storage.types';

export const initializeAppData = async (): Promise<boolean> => {
  try {
    console.log('🚀 Checking if app data needs initialization...');
    
    // Check if groups already exist
    const existingGroups = await GoalStorage.getGroups();
    
    if (existingGroups.length === 0) {
      console.log('📦 First launch detected - initializing with seed data...');
      
      // Initialize groups
      const seedGroups = generateSeedGroups();
      await GoalStorage.saveGroups(seedGroups);
      console.log(`✅ Created ${seedGroups.length} starter groups`);
      
      // Initialize friends
      const seedFriends = generateSeedFriends();
      await GoalStorage.saveFriends(seedFriends);
      console.log(`✅ Created ${seedFriends.length} sample friends`);
      
      // Initialize user
      const defaultUser = generateDefaultUser();
      await GoalStorage.saveUser(defaultUser);
      console.log('✅ Created user profile');
      
      // Initialize metadata
      await ResetService.getMetadata(); // This will create it if it doesn't exist
      console.log('✅ Initialized reset metadata');
      
      // Set version
      await StorageService.save(StorageKeys.VERSION, '1.0.0');
      
      console.log('🎉 App initialization complete!');
      return true;
    } else {
      console.log('ℹ️ App data already exists - skipping initialization');
      
      // Still check for resets on every launch
      await ResetService.performResets();
      
      return false;
    }
  } catch (error) {
    console.error('❌ Error initializing app data:', error);
    return false;
  }
};
