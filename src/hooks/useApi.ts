"use client";

import { useState, useCallback } from 'react';

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

/**
 * Hook genérico para peticiones asíncronas.
 * Encapsula los estados loading, error y data.
 */
export function useApi<T>(apiCall: (...args: any[]) => Promise<any>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await apiCall(...args);
      if (response.data.success) {
        setData(response.data.data);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || 'Ocurrió un error. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
