"use client";

import { useCallback } from "react";
import { useState } from "react";
import { Wand2, Loader2 } from "lucide-react";
import api from "@/services/api";
import { useApi } from "@/hooks/useApi";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

interface ImageData {
  prompt_used: string;
  image_url: string;
}

export default function ImagesPage() {
  const [prompt, setPrompt] = useState("");

  const apiCall = useCallback((p: string) => api.post("/images/generate", { prompt: p }), []);
  const { data, loading, error, execute } = useApi<ImageData>(apiCall);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await execute(prompt);
  };

  return (
    <main className="min-h-screen bg-organic flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl animate-fade-up">

        <div className="text-center mb-10 relative">
          <Wand2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 opacity-[0.03] text-[var(--accent)] pointer-events-none" />
          <h1 className="text-4xl font-semibold tracking-tight text-[var(--foreground)] leading-tight relative">
            Imagina algo<br />
            <span className="text-[var(--accent)]">y hazlo real</span>
          </h1>
          <p className="mt-3 text-[var(--muted)] text-base max-w-sm mx-auto leading-relaxed relative">
            Describe cualquier escena y la inteligencia artificial la convertirá en una imagen.
          </p>
        </div>

        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Un atardecer en Marte..."
              className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] placeholder-[var(--muted)] outline-none input-glow transition-all text-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="btn-warm text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2 text-sm whitespace-nowrap"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {loading ? "Creando..." : "Crear"}
            </button>
          </form>
        </div>

        <div className="mt-6">
          {loading && <LoadingState message="Dando forma a tu idea..." />}
          {error && !loading && <ErrorState message={error} />}
          {data && !loading && !error && (
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm animate-fade-up">
              <img src={data.image_url} alt={data.prompt_used} className="w-full aspect-square object-cover animate-image-reveal" />
              <div className="p-4 flex items-center justify-between">
                <p className="text-xs text-[var(--muted)] italic truncate max-w-[70%]">&ldquo;{data.prompt_used}&rdquo;</p>
                <span className="inline-flex items-center gap-1.5 bg-[var(--success-bg)] text-[var(--success)] text-xs font-medium px-3 py-1 rounded-full border border-green-200">
                  <span className="w-1.5 h-1.5 bg-[var(--success)] rounded-full" />
                  Generada
                </span>
              </div>
            </div>
          )}
          {!loading && !error && !data && (
            <div className="flex flex-col items-center py-16 text-[var(--muted)] animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-[var(--accent-glow)] flex items-center justify-center mb-4">
                <Wand2 className="w-7 h-7 text-[var(--accent)] opacity-60" />
              </div>
              <p className="text-sm">Tu creación aparecerá aquí</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
