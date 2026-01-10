import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CurrencyInput } from '@/components/CurrencyInput';
import { RateDisplay } from '@/components/RateDisplay';
import { RateChart } from '@/components/RateChart';
import { StatusBanner } from '@/components/StatusBanner';
import { useExchangeController } from '@/hooks/useExchangeController';
import { RefreshCw, ArrowLeftRight, TrendingUp } from 'lucide-react';

const Index = () => {
  const {
    currentRate,
    history,
    isLoading,
    error,
    isOffline,
    base,
    quote,
    validationError,
    isValid,
    updateBase,
    updateQuote,
    swapCurrencies,
    refresh,
  } = useExchangeController();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold">Currency Exchange</h1>
          </div>
          <Button
            onClick={refresh}
            disabled={isLoading || !isValid}
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Status Banner */}
        <StatusBanner 
          error={error} 
          isOffline={isOffline} 
          validationError={validationError} 
        />

        {/* Currency Selector Card - Increased z-index to stay above the next card */}
        <Card className="glass-card relative z-30">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-medium">Select Currency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <CurrencyInput
                  label="From"
                  value={base}
                  onChange={updateBase}
                  placeholder="USD"
                  error={!!validationError && validationError.includes('base')}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={swapCurrencies}
                className="h-12 w-12 shrink-0"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>
              <div className="flex-1">
                <CurrencyInput
                  label="To"
                  value={quote}
                  onChange={updateQuote}
                  placeholder="EUR"
                  error={!!validationError && validationError.includes('quote')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Rate Card - Lower z-index than the selector above */}
        <Card className="glass-card relative z-20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Current Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <RateDisplay rate={currentRate} isLoading={isLoading} />
          </CardContent>
        </Card>

        {/* History Chart Card */}
        <Card className="glass-card relative z-10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Rate History</CardTitle>
          </CardHeader>
          <CardContent>
            <RateChart history={history} base={base} quote={quote} />
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Data from ExchangeRate-API • ISO 4217 currency codes
        </p>
      </main>
    </div>
  );
};

export default Index;