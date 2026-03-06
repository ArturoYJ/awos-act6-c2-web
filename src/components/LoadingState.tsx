import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8 animate-fade-up">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full h-48 rounded-xl overflow-hidden shimmer-bar" />
        <p className="text-sm text-[var(--muted)] animate-breathe">{message}</p>
      </div>
    </div>
  );
}
