/**
 * Storage Module Exports
 * 
 * Central export file for all storage-related modules.
 * Makes imports cleaner throughout the app.
 */

// Services
export { StorageService } from './StorageService';
export { GoalStorage } from './GoalStorage';
export { HistoryStorage } from './HistoryStorage';
export { ResetService } from './ResetService';

// Utilities
export { initializeAppData, generateSeedGroups, generateSeedFriends, generateDefaultUser } from './SeedData';
