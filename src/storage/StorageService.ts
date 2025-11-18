/**
 * Core Storage Service
 * 
 * Low-level AsyncStorage wrapper with error handling and type safety.
 * This service provides the foundation for all storage operations.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  /**
   * Save data to storage
   * @param key Storage key
   * @param value Data to store (will be JSON stringified)
   */
  static async save<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`✅ Saved to storage: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error saving to storage (${key}):`, error);
      return false;
    }
  }

  /**
   * Load data from storage
   * @param key Storage key
   * @returns Parsed data or null if not found
   */
  static async load<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        console.log(`ℹ️ No data found for key: ${key}`);
        return null;
      }
      const parsed = JSON.parse(jsonValue) as T;
      console.log(`✅ Loaded from storage: ${key}`);
      return parsed;
    } catch (error) {
      console.error(`❌ Error loading from storage (${key}):`, error);
      return null;
    }
  }

  /**
   * Remove data from storage
   * @param key Storage key
   */
  static async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`✅ Removed from storage: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error removing from storage (${key}):`, error);
      return false;
    }
  }

  /**
   * Clear all storage (use with caution!)
   */
  static async clearAll(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      console.log('✅ Cleared all storage');
      return true;
    } catch (error) {
      console.error('❌ Error clearing storage:', error);
      return false;
    }
  }

  /**
   * Get all storage keys
   */
  static async getAllKeys(): Promise<readonly string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
      console.error('❌ Error getting all keys:', error);
      return [];
    }
  }

  /**
   * Load multiple items at once (batch operation)
   */
  static async loadMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};
      
      values.forEach(([key, value]) => {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value) as T;
          } catch {
            result[key] = null;
          }
        } else {
          result[key] = null;
        }
      });
      
      return result;
    } catch (error) {
      console.error('❌ Error loading multiple items:', error);
      return {};
    }
  }

  /**
   * Save multiple items at once (batch operation)
   */
  static async saveMultiple(items: Array<[string, any]>): Promise<boolean> {
    try {
      const stringifiedItems = items.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]) as Array<[string, string]>;
      
      await AsyncStorage.multiSet(stringifiedItems);
      console.log(`✅ Saved ${items.length} items to storage`);
      return true;
    } catch (error) {
      console.error('❌ Error saving multiple items:', error);
      return false;
    }
  }
}
