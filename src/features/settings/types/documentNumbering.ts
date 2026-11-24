type DocumentNumberingPreview = {
  globalPrefix: string;
  prefix: string;
  separator: string;
  dateFormat: string | null;
  idStrategy: "sequential" | "random" | "timestamp";
  sequentialPadding: number;
  randomLength: number;
};

/**
 * Generate a preview string for the document numbering format.
 */
const formatPreview = (config: DocumentNumberingPreview): string => {
  const parts: string[] = [];

  if (config.globalPrefix) {
    parts.push(config.globalPrefix);
  }

  if (config.prefix) {
    parts.push(config.prefix);
  }

  if (config.dateFormat) {
    const now = new Date();
    const yyyy = now.getFullYear().toString();
    const mm = (now.getMonth() + 1).toString().padStart(2, "0");

    switch (config.dateFormat) {
      case "YYYY":
        parts.push(yyyy);
        break;
      case "YYMM":
        parts.push(`${yyyy.slice(2)}${mm}`);
        break;
      case "YYYYMM":
        parts.push(`${yyyy}${mm}`);
        break;
    }
  }

  if (config.idStrategy === "sequential") {
    parts.push("1".padStart(config.sequentialPadding, "0"));
  } else if (config.idStrategy === "timestamp") {
    parts.push(`20260203${config.separator}115447`);
  } else {
    const sample = "A7F3BC90DE12".slice(0, config.randomLength);
    parts.push(sample);
  }

  return parts.join(config.separator);
};

export type { DocumentNumberingPreview };
export { formatPreview };
