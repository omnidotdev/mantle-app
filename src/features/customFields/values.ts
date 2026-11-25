import { isSelectType } from "./types";

import type {
  CustomField,
  CustomFieldEntity,
  CustomFieldOption,
  CustomFieldType,
  CustomFieldValues,
} from "./types";

const FIELD_TYPES: readonly CustomFieldType[] = [
  "text",
  "number",
  "date",
  "checkbox",
  "select",
  "multi_select",
];

/** Read a field definition off the wire, or null if it is not one Mantle knows */
export const toCustomField = (node: {
  rowId: string;
  entity: string;
  label: string;
  type: string;
  options?: unknown;
  position?: number | null;
}): CustomField | null => {
  if (node.entity !== "person" && node.entity !== "company") return null;
  if (!FIELD_TYPES.includes(node.type as CustomFieldType)) return null;

  const options = Array.isArray(node.options)
    ? (node.options as CustomFieldOption[]).filter(
        (option) =>
          typeof option?.id === "string" && typeof option?.label === "string",
      )
    : [];

  return {
    id: node.rowId,
    entity: node.entity,
    label: node.label,
    type: node.type as CustomFieldType,
    options,
    position: node.position ?? 0,
  };
};

/** A workspace's fields for one record type, in display order */
export const fieldsFor = (
  fields: CustomField[],
  entity: CustomFieldEntity,
): CustomField[] =>
  fields
    .filter((field) => field.entity === entity)
    .sort((a, b) => a.position - b.position || a.label.localeCompare(b.label));

/** A record's stored values, or an empty set for anything else */
export const toValues = (raw: unknown): CustomFieldValues =>
  raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as CustomFieldValues)
    : {};

const isEmpty = (value: unknown): boolean =>
  value === null ||
  value === undefined ||
  value === "" ||
  (Array.isArray(value) && value.length === 0);

/**
 * The values to save: only the record type's current fields, only values that
 * fit them, and no empty ones. A value for a field or option that was removed
 * since the record loaded is dropped rather than refused by the API
 */
export const savableValues = (
  values: CustomFieldValues,
  fields: CustomField[],
): CustomFieldValues => {
  const out: CustomFieldValues = {};

  for (const field of fields) {
    const value = values[field.id];
    if (isEmpty(value)) continue;

    const optionIds = new Set(field.options.map((option) => option.id));

    switch (field.type) {
      case "text":
        if (typeof value === "string" && value.trim()) out[field.id] = value;
        break;
      case "number":
        if (typeof value === "number" && Number.isFinite(value))
          out[field.id] = value;
        break;
      case "date":
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value))
          out[field.id] = value;
        break;
      case "checkbox":
        // Unchecked is the same as unset
        if (value === true) out[field.id] = true;
        break;
      case "select":
        if (typeof value === "string" && optionIds.has(value))
          out[field.id] = value;
        break;
      case "multi_select": {
        const kept = Array.isArray(value)
          ? [...new Set(value)].filter(
              (v): v is string => typeof v === "string" && optionIds.has(v),
            )
          : [];
        if (kept.length > 0) out[field.id] = kept;
        break;
      }
    }
  }

  return out;
};

/** Option labels for a select value, in the field's option order */
export const selectedOptions = (
  field: CustomField,
  value: unknown,
): CustomFieldOption[] => {
  if (!isSelectType(field.type)) return [];
  const chosen = new Set(
    Array.isArray(value) ? value : typeof value === "string" ? [value] : [],
  );

  return field.options.filter((option) => chosen.has(option.id));
};

/** A value as plain text, for sorting, search and exports */
export const formatValue = (field: CustomField, value: unknown): string => {
  if (isEmpty(value)) return "";

  switch (field.type) {
    case "checkbox":
      return value === true ? "Yes" : "";
    case "select":
    case "multi_select":
      return selectedOptions(field, value)
        .map((option) => option.label)
        .join(", ");
    case "number":
      return typeof value === "number" ? value.toLocaleString() : "";
    default:
      return typeof value === "string" ? value : "";
  }
};

/**
 * Whether a record matches every active field filter. Filters pair a select
 * field with one of its options; a multi-select matches when it includes it
 */
export const matchesFilters = (
  values: CustomFieldValues,
  filters: Record<string, string>,
): boolean =>
  Object.entries(filters).every(([fieldId, optionId]) => {
    const value = values[fieldId];
    return Array.isArray(value) ? value.includes(optionId) : value === optionId;
  });

/** A new option id: short, lowercase, and unique within the field */
export const newOptionId = (taken: Iterable<string>): string => {
  const used = new Set(taken);
  for (;;) {
    const id = Math.random().toString(36).slice(2, 8);
    if (!used.has(id)) return id;
  }
};

/**
 * Field filters to and from the `fields` search param: `fieldId:optionId`
 * pairs joined by commas. Ids are lowercase, so the URL stays lowercase
 */
export const parseFieldFilters = (raw: string): Record<string, string> =>
  Object.fromEntries(
    raw
      .split(",")
      .map((pair) => pair.split(":"))
      .filter(
        (parts): parts is [string, string] =>
          parts.length === 2 && !!parts[0] && !!parts[1],
      ),
  );

export const serializeFieldFilters = (
  filters: Record<string, string>,
): string =>
  Object.entries(filters)
    .filter(([, optionId]) => !!optionId)
    .map(([fieldId, optionId]) => `${fieldId}:${optionId}`)
    .join(",");
