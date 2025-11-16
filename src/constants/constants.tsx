/**
 * Application Constants
 * 
 * Centralized location for mock data and constant values.
 */

import { Colors } from '../utils/theme';
import { Goal } from '../components/GoalItem';

/**
 * Goal Period Card Type
 */
export type GoalPeriodCard = {
  id: string;
  period: 'daily' | 'weekly' | 'monthly';
  title: string;
  goals: Goal[];
  color?: string;
};

/**
 * Goal Group Type
 */
export type GoalGroup = {
  id: string;
  name: string;
  color?: string;
  friendIds: string[];
  cards: GoalPeriodCard[];
};

/**
 * Mock goal groups for demonstration
 */
export const MOCK_GOAL_GROUPS: GoalGroup[] = [
  {
    id: '1',
    name: 'Health & Fitness',
    color: Colors.mint400,
    friendIds: ['f1', 'f2'],
    cards: [
      {
        id: '1-daily',
        period: 'daily',
        title: 'Daily Goals',
        color: Colors.mint400,
        goals: [
          { id: '1-d-1', title: 'Morning workout - 30 minutes', completed: true },
          { id: '1-d-2', title: 'Drink 8 glasses of water', completed: true },
          { id: '1-d-3', title: 'Eat healthy lunch', completed: false },
          { id: '1-d-4', title: 'Evening yoga session', completed: false },
          { id: '1-d-5', title: '10,000 steps daily', completed: false },
        ],
      },
      {
        id: '1-weekly',
        period: 'weekly',
        title: 'Weekly Goals',
        color: Colors.mint400,
        goals: [
          { id: '1-w-1', title: 'Gym 5 times this week', completed: true },
          { id: '1-w-2', title: 'Meal prep for the week', completed: false },
          { id: '1-w-3', title: 'Try new healthy recipe', completed: false },
        ],
      },
      {
        id: '1-monthly',
        period: 'monthly',
        title: 'Monthly Goals',
        color: Colors.mint400,
        goals: [
          { id: '1-m-1', title: 'Lose 2kg weight', completed: false },
          { id: '1-m-2', title: 'Complete 30-day yoga challenge', completed: false },
          { id: '1-m-3', title: 'Run 50km total distance', completed: false },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Work Projects',
    color: Colors.blue600,
    friendIds: ['f3'],
    cards: [
      {
        id: '2-daily',
        period: 'daily',
        title: 'Daily Goals',
        color: Colors.blue600,
        goals: [
          { id: '2-d-1', title: 'Review pull requests', completed: true },
          { id: '2-d-2', title: 'Team standup meeting', completed: true },
          { id: '2-d-3', title: 'Update task board', completed: false },
          { id: '2-d-4', title: 'Code review session', completed: false },
        ],
      },
      {
        id: '2-weekly',
        period: 'weekly',
        title: 'Weekly Goals',
        color: Colors.blue600,
        goals: [
          { id: '2-w-1', title: 'Complete dashboard design', completed: true },
          { id: '2-w-2', title: 'Write unit tests', completed: false },
          { id: '2-w-3', title: 'Update documentation', completed: false },
        ],
      },
      {
        id: '2-monthly',
        period: 'monthly',
        title: 'Monthly Goals',
        color: Colors.blue600,
        goals: [
          { id: '2-m-1', title: 'Launch new feature', completed: false },
          { id: '2-m-2', title: 'Improve code coverage to 80%', completed: false },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Learning & Growth',
    color: Colors.purple600,
    friendIds: [],
    cards: [
      {
        id: '3-daily',
        period: 'daily',
        title: 'Daily Goals',
        color: Colors.purple600,
        goals: [
          { id: '3-d-1', title: 'Read 20 pages of book', completed: false },
          { id: '3-d-2', title: 'Practice coding for 1 hour', completed: true },
          { id: '3-d-3', title: 'Learn 10 new words', completed: false },
        ],
      },
      {
        id: '3-weekly',
        period: 'weekly',
        title: 'Weekly Goals',
        color: Colors.purple600,
        goals: [
          { id: '3-w-1', title: 'Complete React Native tutorial', completed: true },
          { id: '3-w-2', title: 'Watch 2 tech talks', completed: false },
        ],
      },
      {
        id: '3-monthly',
        period: 'monthly',
        title: 'Monthly Goals',
        color: Colors.purple600,
        goals: [
          { id: '3-m-1', title: 'Finish TypeScript course', completed: false },
          { id: '3-m-2', title: 'Build a side project', completed: false },
          { id: '3-m-3', title: 'Write 4 blog posts', completed: false },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Personal Tasks',
    color: Colors.green600,
    friendIds: ['f1'],
    cards: [
      {
        id: '4-daily',
        period: 'daily',
        title: 'Daily Goals',
        color: Colors.green600,
        goals: [
          { id: '4-d-1', title: 'Make bed in morning', completed: true },
          { id: '4-d-2', title: 'Call mom', completed: false },
          { id: '4-d-3', title: 'Journal for 10 minutes', completed: false },
        ],
      },
      {
        id: '4-weekly',
        period: 'weekly',
        title: 'Weekly Goals',
        color: Colors.green600,
        goals: [
          { id: '4-w-1', title: 'Clean the apartment', completed: false },
          { id: '4-w-2', title: 'Buy groceries', completed: true },
          { id: '4-w-3', title: 'Organize closet', completed: false },
        ],
      },
      {
        id: '4-monthly',
        period: 'monthly',
        title: 'Monthly Goals',
        color: Colors.green600,
        goals: [
          { id: '4-m-1', title: 'Pay all bills on time', completed: true },
          { id: '4-m-2', title: 'Deep clean entire house', completed: false },
          { id: '4-m-3', title: 'Donate old clothes', completed: false },
        ],
      },
    ],
  },
];

/**
 * Friend Type
 */
export type Friend = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarColor?: string;
};

/**
 * Mock friends list
 */
export const MOCK_FRIENDS: Friend[] = [
  {
    id: 'f1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatarColor: Colors.blue600,
  },
  {
    id: 'f2',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    avatarColor: Colors.purple600,
  },
  {
    id: 'f3',
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    avatarColor: Colors.green600,
  },
];

/**
 * User information
 */
export const USER_INFO = {
  name: 'Sujith',
  greeting: 'Welcome back',
  email: 'sujith@example.com',
  phone: '+1 234 567 8900',
  isPremium: true,
};

/**
 * Helper function to add a new group
 */
export const addNewGroup = (name: string, color: string, friendIds: string[]): GoalGroup => {
  const newGroup: GoalGroup = {
    id: `group-${Date.now()}`,
    name,
    color,
    friendIds,
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
  
  MOCK_GOAL_GROUPS.push(newGroup);
  return newGroup;
};

/**
 * Helper function to delete a group
 */
export const deleteGroup = (groupId: string): boolean => {
  const index = MOCK_GOAL_GROUPS.findIndex(g => g.id === groupId);
  if (index > -1) {
    MOCK_GOAL_GROUPS.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * Helper function to add a new friend (invite)
 */
export const addNewFriend = (name: string, email?: string, phone?: string): Friend => {
  const newFriend: Friend = {
    id: `friend-${Date.now()}`,
    name,
    ...(email && { email }),
    ...(phone && { phone }),
    avatarColor: [Colors.blue600, Colors.purple600, Colors.green600, Colors.mint400, Colors.yellow500][
      Math.floor(Math.random() * 5)
    ],
  };
  
  MOCK_FRIENDS.push(newFriend);
  return newFriend;
};

/**
 * Helper function to add a new goal to a specific group and frequency
 */
export const addNewGoal = (
  title: string, 
  frequency: 'daily' | 'weekly' | 'monthly', 
  groupId: string
): Goal | null => {
  const group = MOCK_GOAL_GROUPS.find(g => g.id === groupId);
  if (!group) {
    return null;
  }

  const card = group.cards.find(c => c.period === frequency);
  if (!card) {
    return null;
  }

  const newGoal: Goal = {
    id: `goal-${Date.now()}`,
    title,
    completed: false,
  };

  card.goals.push(newGoal);
  return newGoal;
};
