import { AlertCircle } from 'lucide-react';

export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="bg-error-bg rounded-2xl border border-red-200 p-6 animate-fade-up">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-error mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-error">Algo salió mal</p>
          <p className="text-sm text-red-400 mt-1">{message}</p>
        </div>
      </div>
    </div>
  );
}
