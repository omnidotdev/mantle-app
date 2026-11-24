/**
 * One tag palette for every people surface (tag chips, the network graph, and
 * its legend). Each tone maps to a semantic theme token, so chips and graph
 * nodes stay readable in light and dark mode
 */
type TagTone =
  | "info"
  | "viewed"
  | "warning"
  | "success"
  | "brand"
  | "secondary"
  | "neutral";

const TAG_TONES: Record<string, TagTone> = {
  employee: "info",
  client: "viewed",
  prospect: "warning",
  active: "success",
  inactive: "neutral",
  contractor: "brand",
  leadership: "secondary",
  engineering: "info",
  design: "secondary",
  research: "success",
};

/** Soft chip fill with readable text in both themes */
const TONE_CHIP_CLASSES: Record<TagTone, string> = {
  info: "bg-info/12 text-info",
  viewed: "bg-viewed/12 text-viewed",
  warning: "bg-warning/14 text-warning",
  success: "bg-success/12 text-success",
  brand: "bg-primary/10 text-primary-600 dark:text-primary-300",
  secondary: "bg-secondary/12 text-secondary-700 dark:text-secondary-300",
  neutral: "bg-foreground/6 text-muted-foreground",
};

/** CSS variable holding each tone's solid color (read at runtime for canvas drawing) */
const TONE_CSS_VARS: Record<TagTone, string> = {
  info: "--info",
  viewed: "--viewed",
  warning: "--warning",
  success: "--success",
  brand: "--primary",
  secondary: "--secondary",
  neutral: "--muted-foreground",
};

/** Swatch class for legends and dots */
const TONE_DOT_CLASSES: Record<TagTone, string> = {
  info: "bg-info",
  viewed: "bg-viewed",
  warning: "bg-warning",
  success: "bg-success",
  brand: "bg-primary",
  secondary: "bg-secondary",
  neutral: "bg-muted-foreground",
};

/** Legend entries for the network graph, in display order */
const TAG_LEGEND: { label: string; tone: TagTone }[] = [
  { label: "Employee", tone: "info" },
  { label: "Client", tone: "viewed" },
  { label: "Prospect", tone: "warning" },
  { label: "Active", tone: "success" },
  { label: "Contractor", tone: "brand" },
  { label: "Leadership", tone: "secondary" },
  { label: "Other", tone: "neutral" },
];

const getTagTone = (tag: string): TagTone => TAG_TONES[tag] ?? "neutral";

/** Tone of the first tag with a known color, used to color a person's graph node */
const getPeopleTone = (tags: string[] | null): TagTone => {
  for (const tag of tags ?? []) {
    const tone = TAG_TONES[tag];
    if (tone) return tone;
  }

  return "neutral";
};

const getTagChipClass = (tag: string) => TONE_CHIP_CLASSES[getTagTone(tag)];

export {
  TAG_LEGEND,
  TONE_CSS_VARS,
  TONE_DOT_CLASSES,
  getPeopleTone,
  getTagChipClass,
  getTagTone,
};
export type { TagTone };
