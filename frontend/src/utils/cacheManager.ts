interface CachedData<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

const CACHE_PREFIX = 'app_cache_';

export const cacheManager = {
  /**
   * Save data to localStorage cache
   */
  set: <T>(key: string, data: T, ttl: number = 300): void => {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cachedItem: CachedData<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttl * 1000,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cachedItem));
    } catch (error) {
      console.warn(`Failed to cache ${key}:`, error);
    }
  },

  /**
   * Retrieve data from localStorage cache if valid
   */
  get: <T>(key: string): T | null => {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return null;

      const item: CachedData<T> = JSON.parse(cached);
      const now = Date.now();
      const age = now - item.timestamp;

      if (age > item.ttl) {
        cacheManager.remove(key);
        return null;
      }

      return item.data;
    } catch (error) {
      console.warn(`Failed to retrieve cache for ${key}:`, error);
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      const cacheKey = `${CACHE_PREFIX}${key}`;
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.warn(`Failed to remove cache for ${key}:`, error);
    }
  },

  clear: (): void => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(CACHE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  },

  getStats: () => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));
    let totalSize = 0;

    cacheKeys.forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });

    return {
      count: cacheKeys.length,
      size: `${(totalSize / 1024).toFixed(2)} KB`,
      keys: cacheKeys.map((k) => k.replace(CACHE_PREFIX, '')),
    };
  },
};