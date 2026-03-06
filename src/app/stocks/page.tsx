"use client";

import { useCallback, useState } from "react";
import api from "@/services/api";
import { useApi } from "@/hooks/useApi";
import { StockData } from "@/types/stocks.types";
import StocksView from "@/components/StocksView";

export default function StocksPage() {
  const [symbol, setSymbol] = useState("");

  const apiCall = useCallback((s: string) => api.get(`/stocks/${s}`), []);
  const { data, loading, error, execute } = useApi<StockData, [string]>(apiCall);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    await execute(symbol.trim());
  };

  return (
    <StocksView
      symbol={symbol}
      onSymbolChange={setSymbol}
      onSubmit={handleSubmit}
      data={data}
      stats={data?.stats ?? null}
      chartData={data?.chart_data ?? []}
      loading={loading}
      error={error}
    />
  );
}
