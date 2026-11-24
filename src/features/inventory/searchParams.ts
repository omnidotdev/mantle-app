import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const INVENTORY_FILTERS = ["all", "low", "out", "inactive"] as const;

type InventoryFilter = (typeof INVENTORY_FILTERS)[number];

const inventoryListSearchSchema = z.object({
  search: fallback(z.string(), "").default(""),
  status: fallback(z.enum(INVENTORY_FILTERS), "all").default("all"),
  sortBy: fallback(z.string().optional(), undefined).default(undefined),
  sortDir: fallback(z.enum(["asc", "desc"]).optional(), undefined).default(
    undefined,
  ),
});

export { INVENTORY_FILTERS, inventoryListSearchSchema };
export type { InventoryFilter };
