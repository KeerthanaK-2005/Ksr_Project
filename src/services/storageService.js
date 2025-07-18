import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_PREFIX = 'VivaahAI_';

export const storageService = {
  /**
   * Get an item from storage
   * @param {string} key
   * @returns {Promise<any | null>}
   */
  async getItem(key) {
    try {
      const item = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (key === 'accessToken') {
        return item;
      }
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to get item with key "${key}"`, error);
      return null;
    }
  },

  /**
   * Set an item in storage
   * @param {string} key
   * @param {any} value
   * @returns {Promise<void>}
   */
  async setItem(key, value) {
    try {
      if (key === 'accessToken') {
        await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
      } else {
        await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Failed to set item with key "${key}"`, error);
    }
  },

  /**
   * Remove an item from storage
   * @param {string} key
   * @returns {Promise<void>}
   */
  async removeItem(key) {
    try {
      await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error(`Failed to remove item with key "${key}"`, error);
    }
  },

  /**
   * Clear all items from storage
   * @returns {Promise<void>}
   */
  async clearAll() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => key.startsWith(STORAGE_PREFIX));
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error('Failed to clear all items from storage', error);
    }
  },
}; 