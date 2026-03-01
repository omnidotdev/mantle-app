import type { InventoryAdjustment } from "@/features/inventory/types/product";

interface AdjustmentLogProps {
  adjustments: InventoryAdjustment[];
}

const AdjustmentLog = ({ adjustments }: AdjustmentLogProps) => {
  if (adjustments.length === 0) {
    return (
      <div className="rounded-lg border-2 border-gray-200 border-dashed py-12 text-center">
        <p className="text-gray-500">No adjustments recorded</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Date
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Change
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Reason
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Reference ID
            </th>
          </tr>
        </thead>
        <tbody>
          {adjustments.map((adjustment) => (
            <tr key={adjustment.id} className="border-gray-100 border-t">
              <td className="px-4 py-3 text-gray-600 text-sm">
                {new Date(adjustment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium text-sm">
                <span
                  className={
                    adjustment.quantityChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {adjustment.quantityChange >= 0 ? "+" : ""}
                  {adjustment.quantityChange}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 text-sm">
                {adjustment.reason}
              </td>
              <td className="px-4 py-3 text-gray-600 text-sm">
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
