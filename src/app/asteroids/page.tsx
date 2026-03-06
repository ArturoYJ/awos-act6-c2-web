"use client";

import { useCallback, useEffect } from "react";
import api from "@/services/api";
import { useApi } from "@/hooks/useApi";
import { AsteroidData } from "@/types/asteroids.types";
import AsteroidsView from "@/components/AsteroidsView";

export default function AsteroidsPage() {
  const apiCall = useCallback(() => api.get("/asteroids"), []);
  const { data, loading, error, execute } = useApi<AsteroidData, [string?, string?]>(apiCall);

  useEffect(() => { execute(); }, [execute]);

  return (
    <AsteroidsView
      data={data}
      loading={loading}
      error={error}
    />
  );
}
