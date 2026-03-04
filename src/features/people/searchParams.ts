import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const peopleListSearchSchema = z.object({
  tab: fallback(
    z.enum(["companies", "contacts", "network"]),
    "companies",
  ).default("companies"),
  search: fallback(z.string(), "").default(""),
  type: fallback(z.enum(["all", "internal", "external"]), "all").default("all"),
});

export { peopleListSearchSchema };
