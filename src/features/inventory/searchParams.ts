import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const inventoryListSearchSchema = z.object({
  sortBy: fallback(z.string().optional(), undefined).default(undefined),
  sortDir: fallback(z.enum(["asc", "desc"]).optional(), undefined).default(
    undefined,
  ),
});

export { inventoryListSearchSchema };
