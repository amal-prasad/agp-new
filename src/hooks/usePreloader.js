import { useState, useCallback } from 'react';

/**
 * usePreloader — manages loading state.
 * Returns { isLoading, setLoaded }.
 */
export function usePreloader() {
  const [isLoading, setIsLoading] = useState(true);

  const setLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  return { isLoading, setLoaded };
}
