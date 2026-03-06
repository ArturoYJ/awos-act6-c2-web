// No imports needed for this component anymore

export default function LoadingState({ message = 'Cargando...' }: { message?: string }) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-8 animate-fade-up">
      <div className="flex flex-col items-center gap-4">
        <div className="w-full h-48 rounded-xl overflow-hidden shimmer-bar" />
        <p className="text-sm text-muted animate-breathe">{message}</p>
      </div>
    </div>
  );
}
