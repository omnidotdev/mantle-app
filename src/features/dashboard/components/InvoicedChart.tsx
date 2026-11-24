import { formatWholeCurrency } from "@/features/dashboard/lib/metrics";
import cn from "@/lib/utils";

import type { MonthBucket } from "@/features/dashboard/lib/metrics";

interface InvoicedChartProps {
  months: MonthBucket[];
  currency: string;
}

/**
 * Single-series bar chart of invoiced totals per month. Bars sit on a shared
 * baseline, the current month is full strength, and each bar shows its value
 * on hover. Screen readers get the summary label plus a hidden data table
 */
const InvoicedChart = ({ months, currency }: InvoicedChartProps) => {
  const total = months.reduce((sum, month) => sum + month.total, 0);
  const max = Math.max(...months.map((month) => month.total), 0);
  const first = months[0];
  const last = months[months.length - 1];

  const rangeLabel =
    first && last ? `${first.longLabel} to ${last.longLabel}` : "";

  return (
    <div>
      <p className="flex flex-wrap items-baseline gap-x-2.5">
        <span className="tabular text-xl font-bold tracking-tight sm:text-2xl">
          {formatWholeCurrency(total, currency)}
        </span>
        <span className="text-sm text-muted-foreground">
          last {months.length} months
        </span>
      </p>

      <div
        role="img"
        aria-label={`Invoiced per month, ${rangeLabel}, ${formatWholeCurrency(total, currency)} in total`}
        className="mt-4 grid h-40 items-end gap-2.5 border-b border-border pt-8"
        style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}
      >
        {months.map((month, index) => {
          const isCurrent = index === months.length - 1;
          const height = max > 0 ? (month.total / max) * 100 : 0;

          return (
            <div
              key={month.key}
              className="group relative flex h-full items-end justify-center"
            >
              <div
                className={cn(
                  "relative w-full max-w-9 rounded-t-[0.25rem] bg-primary transition-opacity group-hover:opacity-100",
                  !isCurrent && "opacity-80",
                )}
                style={{
                  height: `${height}%`,
                  minHeight: month.total > 0 ? 2 : 0,
                }}
              >
                <span className="tabular pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs whitespace-nowrap text-background opacity-0 shadow-raised transition-opacity group-hover:opacity-100">
                  {month.label}: {formatWholeCurrency(month.total, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div
        aria-hidden
        className="mt-1.5 grid gap-2.5 text-center text-xs text-muted-foreground"
        style={{ gridTemplateColumns: `repeat(${months.length}, 1fr)` }}
      >
        {months.map((month) => (
          <span key={month.key}>{month.label}</span>
        ))}
      </div>

      {/* sr-only on the wrapper: a table ignores the 1px box and widens the page */}
      <div className="sr-only">
        <table>
          <caption>Invoiced per month, {rangeLabel}</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Invoiced</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month) => (
              <tr key={month.key}>
                <th scope="row">{month.longLabel}</th>
                <td>{formatWholeCurrency(month.total, currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoicedChart;
