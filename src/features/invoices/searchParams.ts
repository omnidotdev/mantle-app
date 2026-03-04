import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const invoiceListSearchSchema = z.object({
  search: fallback(z.string(), "").default(""),
  status: fallback(z.string(), "all").default("all"),
});

export { invoiceListSearchSchema };
