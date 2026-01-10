import { ExchangeRate } from '@/types/exchange';
import { ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface RateDisplayProps {
  rate: ExchangeRate | null;
  isLoading: boolean;
}

export function RateDisplay({ rate, isLoading }: RateDisplayProps) {
  if (!rate) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Enter currency codes and refresh to see the exchange rate
        </p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-3">
        <span className="currency-badge">{rate.base}</span>
        <ArrowRight className="w-4 h-4 text-muted-foreground" />
        <span className="currency-badge">{rate.quote}</span>
      </div>

      <div className={isLoading ? 'animate-pulse' : ''}>
        <p className="rate-display text-foreground">
          {rate.rate.toFixed(4)}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          1 {rate.base} = {rate.rate.toFixed(4)} {rate.quote}
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span>Last updated: {format(rate.timestamp, 'MMM d, yyyy HH:mm:ss')}</span>
      </div>
    </div>
  );
}
