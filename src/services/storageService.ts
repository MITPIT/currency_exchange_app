// Model/Service: Local storage persistence

import { ExchangeRate, RateHistory } from '@/types/exchange';

const RATE_PREFIX = 'exchange_rate_';
const HISTORY_PREFIX = 'exchange_history_';
const MAX_HISTORY_ITEMS = 50;

function getStorageKey(base: string, quote: string, prefix: string): string {
  return `${prefix}${base.toUpperCase()}_${quote.toUpperCase()}`;
}

export function saveRate(base: string, quote: string, rate: ExchangeRate): void {
  const key = getStorageKey(base, quote, RATE_PREFIX);
  const data = {
    ...rate,
    timestamp: rate.timestamp.toISOString(),
  };
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadRate(base: string, quote: string): ExchangeRate | null {
  const key = getStorageKey(base, quote, RATE_PREFIX);
  const stored = localStorage.getItem(key);
  
  if (!stored) return null;

  try {
    const data = JSON.parse(stored);
    return {
      ...data,
      timestamp: new Date(data.timestamp),
    };
  } catch {
    return null;
  }
}

export function saveHistory(base: string, quote: string, entry: RateHistory): void {
  const key = getStorageKey(base, quote, HISTORY_PREFIX);
  const history = loadHistory(base, quote);
  
  history.push({
    rate: entry.rate,
    timestamp: entry.timestamp,
  });

  // Keep only last N items
  const trimmed = history.slice(-MAX_HISTORY_ITEMS);
  
  localStorage.setItem(key, JSON.stringify(
    trimmed.map(h => ({
      rate: h.rate,
      timestamp: h.timestamp.toISOString(),
    }))
  ));
}

export function loadHistory(base: string, quote: string): RateHistory[] {
  const key = getStorageKey(base, quote, HISTORY_PREFIX);
  const stored = localStorage.getItem(key);
  
  if (!stored) return [];

  try {
    const data = JSON.parse(stored);
    return data.map((item: { rate: number; timestamp: string }) => ({
      rate: item.rate,
      timestamp: new Date(item.timestamp),
    }));
  } catch {
    return [];
  }
}
