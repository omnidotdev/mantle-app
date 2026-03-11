import { ClipboardList } from "lucide-react";

import type { InventoryAdjustment } from "@/features/inventory/types/product";

interface AdjustmentLogProps {
  adjustments: InventoryAdjustment[];
}

const AdjustmentLog = ({ adjustments }: AdjustmentLogProps) => {
  if (adjustments.length === 0) {
    return (
      <div className="rounded-lg border-2 border-border border-dashed py-12 text-center">
        <ClipboardList
          size={32}
          className="mx-auto mb-2 text-muted-foreground"
        />
        <p className="text-muted-foreground">No adjustments recorded</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full min-w-[500px]">
        <thead className="bg-muted">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              Date
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              Change
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              Reason
            </th>
            <th className="px-4 py-3 text-left font-medium text-foreground text-sm">
              Reference ID
            </th>
          </tr>
        </thead>
        <tbody>
          {adjustments.map((adjustment) => (
            <tr key={adjustment.id} className="border-border border-t">
              <td className="px-4 py-3 text-foreground text-sm">
                {new Date(adjustment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium text-sm">
                <span
                  className={
                    adjustment.quantityChange >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-destructive"
                  }
                >
                  {adjustment.quantityChange >= 0 ? "+" : ""}
                  {adjustment.quantityChange}
                </span>
              </td>
              <td className="px-4 py-3 text-foreground text-sm">
                {adjustment.reason}
              </td>
              <td className="px-4 py-3 text-foreground text-sm">
                {adjustment.referenceId ?? "\u2014"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdjustmentLog;
