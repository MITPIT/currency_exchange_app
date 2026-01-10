// Model/Service: API calls for exchange rates

const API_BASE = 'https://api.exchangerate-api.com/v4/latest';

export interface ApiResponse {
  base: string;
  rates: Record<string, number>;
  date: string;
}

export async function fetchExchangeRate(base: string, quote: string): Promise<number> {
  const response = await fetch(`${API_BASE}/${base.toUpperCase()}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data: ApiResponse = await response.json();
  const rate = data.rates[quote.toUpperCase()];

  if (rate === undefined) {
    throw new Error(`Invalid target currency: ${quote}`);
  }

  return rate;
}
