"use client";

import { useCallback, useState } from "react";
import { TrendingUp, Search, Loader2, ArrowUp, ArrowDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "@/services/api";
import { useApi } from "@/hooks/useApi";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

interface StockDay {
  date: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

interface StockData {
  symbol: string;
  last_refreshed: string;
  time_zone: string;
  daily_prices: StockDay[];
}

export default function StocksPage() {
  const [symbol, setSymbol] = useState("");

  const apiCall = useCallback((s: string) => api.get(`/stocks/${s}`), []);
  const { data, loading, error, execute } = useApi<StockData, [string]>(apiCall);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim()) return;
    await execute(symbol.trim());
  };

  const getChange = (day: StockDay) => {
    const open = parseFloat(day.open);
    const close = parseFloat(day.close);
    return ((close - open) / open) * 100;
  };

  // Preparar datos para el gráfico (invertir para mostrar cronológicamente)
  const chartData = data
    ? [...data.daily_prices].reverse().map(day => ({
        date: day.date.slice(5), // "03-05" en vez de "2026-03-05"
        close: parseFloat(day.close),
      }))
    : [];

  // Stats del periodo
  const stats = data ? (() => {
    const closes = data.daily_prices.map(d => parseFloat(d.close));
    const high = Math.max(...closes);
    const low = Math.min(...closes);
    const latest = closes[0];
    const oldest = closes[closes.length - 1];
    const periodChange = ((latest - oldest) / oldest) * 100;
    return { high, low, latest, periodChange };
  })() : null;

  return (
    <main className="min-h-screen bg-organic px-4 py-12">
      <div className="w-full max-w-3xl mx-auto animate-fade-up">

        {/* Header con watermark */}
        <div className="text-center mb-10 relative">
          <TrendingUp className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] text-[#4a90d9] pointer-events-none" />
          <h1 className="text-4xl font-semibold tracking-tight text-(--foreground) leading-tight relative">
            Mercado de<br />
            <span style={{ color: '#4a90d9' }}>Valores</span>
          </h1>
          <p className="mt-3 text-(--muted) text-base max-w-md mx-auto leading-relaxed relative">
            Consulta precios diarios de cualquier acción bursátil.
          </p>
        </div>

        {/* Search */}
        <div className="bg-(--surface) rounded-2xl border border-(--border) p-6 shadow-sm mb-6">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="AAPL, MSFT, TSLA, IBM..."
              className="flex-1 px-4 py-3 rounded-xl border border-(--border) bg-(--background) text-(--foreground) placeholder-(--muted) outline-none input-glow transition-all text-sm font-mono tracking-wider"
              disabled={loading}
              maxLength={10}
            />
            <button
              type="submit"
              disabled={loading || !symbol.trim()}
              className="btn-warm text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 text-sm whitespace-nowrap"
              style={{ background: loading ? undefined : '#4a90d9' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </form>
        </div>

        {loading && <LoadingState message="Consultando Alpha Vantage..." />}
        {error && !loading && <ErrorState message={error} />}

        {data && stats && !loading && !error && (
          <div className="animate-fade-up space-y-3">
            {/* Header con stats */}
            <div className="bg-(--surface) rounded-2xl border border-(--border) p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-2xl font-bold font-mono text-(--foreground)">{data.symbol}</p>
                  <p className="text-xs text-(--muted)">Últimos 30 días · {data.time_zone}</p>
                </div>
                <div className="text-right">
                  <div className={`flex items-center gap-1 justify-end ${stats.periodChange >= 0 ? 'text-(--success)' : 'text-(--error)'}`}>
                    {stats.periodChange >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    <span className="font-bold font-mono text-lg">{Math.abs(stats.periodChange).toFixed(2)}%</span>
                  </div>
                  <p className="text-xs text-(--muted)">en 30 días</p>
                </div>
              </div>

              {/* High / Low indicator bar */}
              <div className="flex items-center gap-3 text-xs">
                <span className="text-(--error) font-mono font-medium">${stats.low.toFixed(2)}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 rounded-full"
                    style={{
                      left: '0%',
                      right: '0%',
                      background: 'linear-gradient(90deg, #e74c3c, #f39c12, #2ecc71)'
                    }}
                  />
                  {/* Current price marker */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-[#4a90d9] rounded-full shadow-sm"
                    style={{
                      left: `${((stats.latest - stats.low) / (stats.high - stats.low)) * 100}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  />
                </div>
                <span className="text-(--success) font-mono font-medium">${stats.high.toFixed(2)}</span>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-(--surface) rounded-2xl border border-(--border) p-5">
              <p className="text-xs text-(--muted) mb-3 font-medium">Precio de cierre (USD)</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: 'var(--muted)' }}
                    tickLine={false}
                    axisLine={false}
                    interval={Math.floor(chartData.length / 6)}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 10, fill: 'var(--muted)' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v: number) => `$${v.toFixed(0)}`}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                    formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Cierre']}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    stroke="#4a90d9"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 5, fill: '#4a90d9', stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="bg-(--surface) rounded-2xl border border-(--border) overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-(--background)">
                    <th className="text-left px-4 py-3 text-xs font-medium text-(--muted)">Fecha</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-(--muted)">Apertura</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-(--muted)">Cierre</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-(--muted)">Cambio</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-(--muted) hidden sm:table-cell">Volumen</th>
                  </tr>
                </thead>
                <tbody>
                  {data.daily_prices.map((day, i) => {
                    const change = getChange(day);
                    return (
                      <tr key={day.date} className={`border-t border-(--border) ${i % 2 === 0 ? '' : 'bg-(--background)/50'}`}>
                        <td className="px-4 py-3 font-mono text-xs text-(--foreground)">{day.date}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs">${parseFloat(day.open).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-mono text-xs">${parseFloat(day.close).toFixed(2)}</td>
                        <td className={`px-4 py-3 text-right font-mono text-xs font-semibold ${change >= 0 ? 'text-(--success)' : 'text-(--error)'}`}>
                          {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs text-(--muted) hidden sm:table-cell">
                          {Number(day.volume).toLocaleString('es-MX')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && !error && !data && (
          <div className="flex flex-col items-center py-16 text-(--muted) animate-fade-up">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(74, 144, 217, 0.1)' }}>
              <TrendingUp className="w-7 h-7 opacity-60" style={{ color: '#4a90d9' }} />
            </div>
            <p className="text-sm">Busca un símbolo para ver sus datos</p>
          </div>
        )}
      </div>
    </main>
  );
}
