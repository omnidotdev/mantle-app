import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const inventoryListSearchSchema = z.object({
  sort_by: fallback(z.string().optional(), undefined).default(undefined),
  sort_dir: fallback(z.enum(["asc", "desc"]).optional(), undefined).default(
    undefined,
  ),
});

export { inventoryListSearchSchema };
