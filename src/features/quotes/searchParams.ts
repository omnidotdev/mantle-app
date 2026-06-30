import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const quoteListSearchSchema = z.object({
  search: fallback(z.string(), "").default(""),
  status: fallback(z.string(), "all").default("all"),
  sort_by: fallback(z.string().optional(), undefined).default(undefined),
  sort_dir: fallback(z.enum(["asc", "desc"]).optional(), undefined).default(
    undefined,
  ),
});

const quotePreviewSearchSchema = z.object({
  preview_type: fallback(z.enum(["quote", "contract"]), "quote").default(
    "quote",
  ),
});

export { quoteListSearchSchema, quotePreviewSearchSchema };
