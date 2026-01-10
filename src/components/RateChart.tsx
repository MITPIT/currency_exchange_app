import { RateHistory } from '@/types/exchange';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface RateChartProps {
  history: RateHistory[];
  base: string;
  quote: string;
}

export function RateChart({ history, base, quote }: RateChartProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-3">
          <TrendingUp className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium">No history yet</p>
        <p className="text-xs">Refresh to start tracking rates</p>
      </div>
    );
  }

  const chartData = history.map((item, index) => ({
    index,
    rate: item.rate,
    time: format(item.timestamp, 'HH:mm'),
    fullTime: format(item.timestamp, 'MMM d, HH:mm:ss'),
  }));

  const rates = history.map(h => h.rate);
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const first = rates[0];
  const last = rates[rates.length - 1];
  const change = last - first;
  const changePercent = ((change / first) * 100);

  const isUp = change > 0;
  const isFlat = change === 0;

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-muted-foreground">Min: </span>
            <span className="font-mono font-medium">{min.toFixed(4)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Max: </span>
            <span className="font-mono font-medium">{max.toFixed(4)}</span>
          </div>
        </div>
        <div className={`flex items-center gap-1 ${isUp ? 'text-green-600' : isFlat ? 'text-muted-foreground' : 'text-red-600'}`}>
          {isUp ? <TrendingUp className="w-4 h-4" /> : isFlat ? <Minus className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span className="font-mono font-medium">
            {isUp ? '+' : ''}{changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              domain={[min * 0.999, max * 1.001]}
              tick={{ fontSize: 10 }}
              stroke="hsl(var(--muted-foreground))"
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(value) => value.toFixed(3)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelFormatter={(_, payload) => payload[0]?.payload?.fullTime || ''}
              formatter={(value: number) => [
                `${value.toFixed(4)} ${quote}`,
                `1 ${base}`,
              ]}
            />
            <ReferenceLine y={first} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" opacity={0.5} />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="hsl(var(--chart-line))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        {history.length} data point{history.length !== 1 ? 's' : ''} for {base}/{quote}
      </p>
    </div>
  );
}
