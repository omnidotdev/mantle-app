import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const quoteListSearchSchema = z.object({
  search: fallback(z.string(), "").default(""),
  status: fallback(z.string(), "all").default("all"),
});

const quotePreviewSearchSchema = z.object({
  previewType: fallback(z.enum(["quote", "contract"]), "quote").default(
    "quote",
  ),
});

export { quoteListSearchSchema, quotePreviewSearchSchema };
