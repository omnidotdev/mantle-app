import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const invoiceListSearchSchema = z.object({
  search: fallback(z.string(), "").default(""),
  status: fallback(z.string(), "all").default("all"),
  sort_by: fallback(z.string().optional(), undefined).default(undefined),
  sort_dir: fallback(z.enum(["asc", "desc"]).optional(), undefined).default(
    undefined,
  ),
});

export { invoiceListSearchSchema };
