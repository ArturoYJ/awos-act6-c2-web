"use client";

import { useCallback, useEffect } from "react";
import { Globe, AlertTriangle, Shield } from "lucide-react";
import api from "@/services/api";
import { useApi } from "@/hooks/useApi";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

interface Asteroid {
  id: string;
  name: string;
  estimated_diameter_km: { min: number; max: number };
  is_potentially_hazardous: boolean;
  close_approach_date: string;
  velocity_km_h: string;
  miss_distance_km: string;
}

interface AsteroidData {
  total_count: number;
  date_range: { start: string; end: string };
  asteroids: Asteroid[];
}

export default function AsteroidsPage() {
  const apiCall = useCallback(() => api.get("/asteroids"), []);
  const { data, loading, error, execute } = useApi<AsteroidData>(apiCall);

  useEffect(() => { execute(); }, [execute]);

  // Calcular el diámetro máximo para escalar las barras
  const maxDiameter = data
    ? Math.max(...data.asteroids.slice(0, 15).map(a => a.estimated_diameter_km.max))
    : 1;

  return (
    <main className="min-h-screen bg-organic px-4 py-12">
      <div className="w-full max-w-3xl mx-auto animate-fade-up">

        {/* Header con watermark */}
        <div className="text-center mb-10 relative">
          <Globe className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] text-[#5a9a6e] pointer-events-none" />
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] leading-tight relative">
            Asteroides<br />
            <span style={{ color: '#5a9a6e' }}>Cercanos a la Tierra</span>
          </h1>
          <p className="mt-3 text-[var(--muted)] text-base max-w-md mx-auto leading-relaxed relative">
            Objetos detectados por la NASA en los próximos 7 días.
          </p>
        </div>

        {loading && <LoadingState message="Consultando a la NASA..." />}
        {error && !loading && <ErrorState message={error} />}

        {data && !loading && !error && (
          <div className="space-y-3 animate-fade-up">
            {/* Stats */}
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{data.total_count}</p>
                <p className="text-xs text-[var(--muted)]">asteroides detectados</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--muted)]">{data.date_range.start}</p>
                <p className="text-xs text-[var(--muted)]">→ {data.date_range.end}</p>
              </div>
            </div>

            {/* List */}
            {data.asteroids.slice(0, 15).map((asteroid) => {
              const sizePercent = (asteroid.estimated_diameter_km.max / maxDiameter) * 100;

              return (
                <div
                  key={asteroid.id}
                  className={`bg-[var(--surface)] rounded-2xl border p-5 transition-all ${
                    asteroid.is_potentially_hazardous
                      ? 'border-red-200 bg-[var(--error-bg)]'
                      : 'border-[var(--border)]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {asteroid.is_potentially_hazardous ? (
                          <AlertTriangle className="w-4 h-4 text-[var(--error)]" />
                        ) : (
                          <Shield className="w-4 h-4 text-[var(--success)]" />
                        )}
                        <h3 className="font-semibold text-sm text-[var(--foreground)]">{asteroid.name}</h3>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-1">
                        Acercamiento: {asteroid.close_approach_date}
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        Diámetro: {asteroid.estimated_diameter_km.min.toFixed(3)} – {asteroid.estimated_diameter_km.max.toFixed(3)} km
                      </p>

                      {/* Barra de tamaño proporcional */}
                      <div className="mt-2 w-full bg-[var(--border)] rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(sizePercent, 3)}%`,
                            backgroundColor: asteroid.is_potentially_hazardous ? 'var(--error)' : '#5a9a6e'
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-[var(--muted)]">
                        {Number(asteroid.velocity_km_h).toLocaleString('es-MX', { maximumFractionDigits: 0 })} km/h
                      </p>
                      <p className="text-xs text-[var(--muted)]">
                        {Number(asteroid.miss_distance_km).toLocaleString('es-MX', { maximumFractionDigits: 0 })} km
                      </p>
                      {asteroid.is_potentially_hazardous && (
                        <span className="inline-block mt-2 text-[10px] font-semibold text-[var(--error)] bg-red-100 px-2 py-0.5 rounded-full">
                          Peligroso
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
