import { useState, useCallback, useRef, useEffect } from 'react';
import { ExchangeRate, RateHistory, ExchangeState } from '@/types/exchange';
import { fetchExchangeRate } from '@/services/exchangeService';
import { saveRate, loadRate, saveHistory, loadHistory } from '@/services/storageService';
import { validateCurrencyPair, formatCurrency } from '@/utils/validators';

const DEBOUNCE_MS = 1000;

export function useExchangeController() {
  const [state, setState] = useState<ExchangeState>({
    currentRate: null,
    history: [],
    isLoading: false,
    error: null,
    isOffline: false,
  });

  const [base, setBase] = useState('USD');
  const [quote, setQuote] = useState('EUR');
  const [validationError, setValidationError] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const lastRefreshRef = useRef(0);

  useEffect(() => {
    const cached = loadRate(base, quote);
    const history = loadHistory(base, quote);
    
    if (cached) {
      setState(prev => ({
        ...prev,
        currentRate: cached,
        history,
        isOffline: false,
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentRate: null,
        history,
      }));
    }
  }, [base, quote]);

  const refresh = useCallback(async () => {
    const formattedBase = formatCurrency(base);
    const formattedQuote = formatCurrency(quote);

    const error = validateCurrencyPair(formattedBase, formattedQuote);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);

    if (formattedBase === formattedQuote) {
      const rate: ExchangeRate = {
        base: formattedBase,
        quote: formattedQuote,
        rate: 1.0,
        timestamp: new Date(),
      };
      setState(prev => ({
        ...prev,
        currentRate: rate,
        error: null,
        isOffline: false,
      }));
      return;
    }

    const now = Date.now();
    if (now - lastRefreshRef.current < DEBOUNCE_MS) {
      return;
    }
    lastRefreshRef.current = now;

    const currentRequest = ++requestIdRef.current;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const rate = await fetchExchangeRate(formattedBase, formattedQuote);

      if (currentRequest !== requestIdRef.current) {
        return;
      }

      const exchangeRate: ExchangeRate = {
        base: formattedBase,
        quote: formattedQuote,
        rate,
        timestamp: new Date(),
      };

      const historyEntry: RateHistory = {
        rate,
        timestamp: new Date(),
      };

      saveRate(formattedBase, formattedQuote, exchangeRate);
      saveHistory(formattedBase, formattedQuote, historyEntry);

      const updatedHistory = loadHistory(formattedBase, formattedQuote);

      setState(prev => ({
        ...prev,
        currentRate: exchangeRate,
        history: updatedHistory,
        isLoading: false,
        error: null,
        isOffline: false,
      }));
    } catch (err) {
      if (currentRequest !== requestIdRef.current) {
        return;
      }

      const cached = loadRate(formattedBase, formattedQuote);
      
      setState(prev => ({
        ...prev,
        currentRate: cached || prev.currentRate,
        isLoading: false,
        error: 'Offline / failed to update',
        isOffline: true,
      }));
    }
  }, [base, quote]);

  useEffect(() => {
    if (base.length === 3 && quote.length === 3 && base !== quote) {
      const timeoutId = setTimeout(() => {
        refresh();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [base, quote, refresh]);

  useEffect(() => {
    refresh();
  }, []);

  const updateBase = useCallback((value: string) => {
    setBase(value.toUpperCase());
    setValidationError(null);
  }, []);

  const updateQuote = useCallback((value: string) => {
    setQuote(value.toUpperCase());
    setValidationError(null);
  }, []);

  const swapCurrencies = useCallback(() => {
    setBase(quote);
    setQuote(base);
  }, [base, quote]);

  const isValid = !validateCurrencyPair(base, quote);

  return {
    ...state,
    base,
    quote,
    validationError,
    isValid,
    updateBase,
    updateQuote,
    swapCurrencies,
    refresh,
  };
}
