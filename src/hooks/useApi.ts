"use client";

import { useState, useCallback } from 'react';
import { AxiosResponse, AxiosError } from 'axios';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface ErrorResponse {
  error: string;
}

interface UseApiReturn<T, Args extends unknown[]> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: Args) => Promise<void>;
  reset: () => void;
}

/**
 * Hook genérico para peticiones asíncronas.
 * Encapsula los estados loading, error y data.
 */
export function useApi<T, Args extends unknown[] = []>(
  apiCall: (...args: Args) => Promise<AxiosResponse<ApiResponse<T>>>
): UseApiReturn<T, Args> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: Args) => {
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
      } catch (err: unknown) {
        if (err instanceof Error) {
          const axiosError = err as AxiosError<ErrorResponse>;
          if (axiosError.response?.data?.error) {
            setError(axiosError.response.data.error);
          } else {
            setError(err.message || 'Ocurrió un error. Por favor, intenta de nuevo.');
          }
        } else {
          setError('Ocurrió un error inesperado.');
        }
      } finally {
        setLoading(false);
      }
    },
    [apiCall]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}
