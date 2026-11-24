import StatusBadge from "@/components/core/StatusBadge";
import { getStockLevel } from "@/features/inventory/types/product";

import type { Product } from "@/features/inventory/types/product";

/** "Low" or "Out" badge for a product at or below its threshold; nothing otherwise */
const StockBadge = ({
  product,
}: {
  product: Pick<Product, "currentQuantity" | "lowStockThreshold">;
}) => {
  const level = getStockLevel(product);

  if (level === "ok") return null;

  return (
    <StatusBadge
      status={level}
      label={level === "out" ? "Out" : "Low"}
      tone={level === "out" ? "danger" : "warning"}
    />
  );
};

export default StockBadge;
