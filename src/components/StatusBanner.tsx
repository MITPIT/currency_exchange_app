import { AlertCircle, WifiOff, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBannerProps {
  error: string | null;
  isOffline: boolean;
  validationError: string | null;
}

export function StatusBanner({ error, isOffline, validationError }: StatusBannerProps) {
  if (validationError) {
    return (
      <div className="status-pill status-pill-error w-full justify-center py-2">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>{validationError}</span>
      </div>
    );
  }

  if (isOffline || error) {
    return (
      <div className="status-pill status-pill-warning w-full justify-center py-2">
        <WifiOff className="w-3.5 h-3.5" />
        <span>{error || 'You are offline'}</span>
      </div>
    );
  }

  return null;
}
