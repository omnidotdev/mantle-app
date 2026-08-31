/**
 * Display labels for the quote `projectType` enum (web | mobile | desktop |
 * api | other). Rendered on customer-facing quotes and contracts, so acronyms
 * must not be title-cased (e.g. "api" -> "API", never "Api").
 */
const PROJECT_TYPE_LABELS: Record<string, string> = {
  web: "Web",
  mobile: "Mobile",
  desktop: "Desktop",
  api: "API",
  other: "Other",
};

/**
 * Format a quote project type for display, falling back to a capitalized form
 * for any value not in the known map.
 */
const formatProjectType = (projectType: string) =>
  PROJECT_TYPE_LABELS[projectType] ??
  projectType.charAt(0).toUpperCase() + projectType.slice(1);

export { formatProjectType };
