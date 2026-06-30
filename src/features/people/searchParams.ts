import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const peopleListSearchSchema = z.object({
  tab: fallback(
    z.enum(["companies", "contacts", "network"]),
    "companies",
  ).default("companies"),
  search: fallback(z.string(), "").default(""),
  type: fallback(z.enum(["all", "internal", "external"]), "all").default("all"),
  sort_by: fallback(z.string().optional(), undefined).default(undefined),
  sort_dir: fallback(z.enum(["asc", "desc"]).optional(), undefined).default(
    undefined,
  ),
});

export { peopleListSearchSchema };
