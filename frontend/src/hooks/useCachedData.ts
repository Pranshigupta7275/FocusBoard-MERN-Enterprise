import { useEffect, useState } from 'react';
import { cacheManager } from '../utils/cacheManager';

/**
 * Custom hook for managing cached data with offline fallback
 * Falls back to localStorage cache if network request fails
 */
export const useCachedData = <T,>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 300
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await fetchFn();
        setData(result);
        cacheManager.set(key, result, ttl);
        setError(null);
      } catch (err) {
        // Try to get from cache on error
        const cachedData = cacheManager.get(key);
        if (cachedData) {
          setData(cachedData);
          console.log(`Using cached data for ${key}`);
        } else {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFn, ttl]);

  return { data, isLoading, error };
};
