import { redisClient } from '../config/redis.js';

// Cache setter with expiration (TTL)
// This utility function saves data to Redis with a specified time-to-live 
// to ensure the cache doesn't grow indefinitely or serve stale data for too long.
export const setCache = async (key, value, ttl = 3600) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    await redisClient.set(key, stringValue, {
      EX: ttl // EX is the standard Redis option for time in seconds
    });
  } catch (err) {
    console.error('Error setting cache:', err);
  }
};

// Cache getter
// Returns parsed JSON if the data is an object, or the raw string otherwise.
export const getCache = async (key) => {
  try {
    const cachedData = await redisClient.get(key);
    if (!cachedData) return null;

    try {
      return JSON.parse(cachedData);
    } catch (e) {
      return cachedData;
    }
  } catch (err) {
    console.error('Error getting cache:', err);
    return null;
  }
};

// Cache invalidator
// Used when the underlying data is updated or deleted in the primary database.
export const invalidateCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error('Error invalidating cache:', err);
  }
};
