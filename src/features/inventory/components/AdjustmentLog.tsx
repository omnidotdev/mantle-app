import { ClipboardListIcon, PlusIcon } from "lucide-react";

import EmptyState from "@/components/core/EmptyState";
import EmptyValue from "@/components/core/EmptyValue";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/features/invoices/types/invoice";
import cn from "@/lib/utils";

import type { InventoryAdjustment } from "@/features/inventory/types/product";

interface AdjustmentLogProps {
  adjustments: InventoryAdjustment[];
  /** Open the adjustment form (offered from the empty state) */
  onAdd?: () => void;
}

/** Calendar day of a timestamp in the viewer's time zone, as "YYYY-MM-DD" */
const toLocalDay = (timestamp: string) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return null;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

const AdjustmentDate = ({ timestamp }: { timestamp: string }) => {
  const day = toLocalDay(timestamp);

  return day ? formatDate(day) : <EmptyValue />;
};

const QuantityChange = ({ value }: { value: number }) => (
  <span
    className={cn(
      "tabular font-semibold",
      value >= 0 ? "text-success" : "text-destructive",
    )}
  >
    {value >= 0 ? "+" : ""}
    {value}
  </span>
);

/** Stock movements for a product: a table on wide screens, stacked rows on phones */
const AdjustmentLog = ({ adjustments, onAdd }: AdjustmentLogProps) => {
  if (adjustments.length === 0) {
    return (
      <EmptyState
        icon={ClipboardListIcon}
        title="No adjustments yet"
        description="Record restocks, sales, and write-offs to keep a history of every stock change."
        action={
          onAdd && (
            <Button variant="outline" onClick={onAdd}>
              <PlusIcon />
              Add adjustment
            </Button>
          )
        }
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto max-md:hidden">
        <table className="w-full">
          <thead>
            <tr className="border-border border-b">
              <th className="px-4 py-3 pl-5 text-left font-medium text-muted-foreground text-xs">
                Date
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground text-xs">
                Change
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs">
                Reason
              </th>
              <th className="px-4 py-3 pr-5 text-left font-medium text-muted-foreground text-xs">
                Reference
              </th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map((adjustment) => (
              <tr
                key={adjustment.id}
                className="border-border border-b text-sm last:border-b-0"
              >
                <td className="h-12 whitespace-nowrap px-4 pl-5">
                  <AdjustmentDate timestamp={adjustment.createdAt} />
                </td>
                <td className="h-12 whitespace-nowrap px-4 text-right">
                  <QuantityChange value={adjustment.quantityChange} />
                </td>
                <td className="h-12 px-4">
                  {adjustment.reason || <EmptyValue>No reason</EmptyValue>}
                </td>
                <td className="h-12 whitespace-nowrap px-4 pr-5">
                  {adjustment.referenceId ?? <EmptyValue>None</EmptyValue>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-border md:hidden">
        {adjustments.map((adjustment) => (
          <li
            key={adjustment.id}
            className="flex items-start justify-between gap-3 px-4 py-3 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">
                {adjustment.reason || <EmptyValue>No reason</EmptyValue>}
              </p>
              <p className="mt-0.5 text-muted-foreground text-xs">
                <AdjustmentDate timestamp={adjustment.createdAt} />
                {adjustment.referenceId && ` · ${adjustment.referenceId}`}
              </p>
            </div>
            <QuantityChange value={adjustment.quantityChange} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default AdjustmentLog;
