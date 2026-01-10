// Model: Exchange rate data types

export interface ExchangeRate {
  base: string;
  quote: string;
  rate: number;
  timestamp: Date;
}

export interface RateHistory {
  rate: number;
  timestamp: Date;
}

export interface ExchangeState {
  currentRate: ExchangeRate | null;
  history: RateHistory[];
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
}

export type CurrencyPair = {
  base: string;
  quote: string;
};
