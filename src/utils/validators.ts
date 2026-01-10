// Utility: Currency validation (ISO 4217)

const ISO_4217_PATTERN = /^[A-Z]{3}$/;

export function isValidCurrency(code: string): boolean {
  return ISO_4217_PATTERN.test(code.toUpperCase());
}

export function validateCurrencyPair(base: string, quote: string): string | null {
  const upperBase = base.toUpperCase().trim();
  const upperQuote = quote.toUpperCase().trim();

  if (!upperBase || !upperQuote) {
    return 'Please enter both currency codes';
  }

  if (!isValidCurrency(upperBase)) {
    return `Invalid base currency: ${base}. Use 3-letter ISO code (e.g., USD)`;
  }

  if (!isValidCurrency(upperQuote)) {
    return `Invalid quote currency: ${quote}. Use 3-letter ISO code (e.g., EUR)`;
  }

  return null;
}

export function formatCurrency(code: string): string {
  return code.toUpperCase().trim();
}
