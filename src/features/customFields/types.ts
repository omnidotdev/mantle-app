/** Records a workspace can add custom fields to */
export type CustomFieldEntity = "person" | "company";

export type CustomFieldType =
  | "text"
  | "number"
  | "date"
  | "checkbox"
  | "select"
  | "multi_select";

export interface CustomFieldOption {
  id: string;
  label: string;
}

export interface CustomField {
  id: string;
  entity: CustomFieldEntity;
  label: string;
  type: CustomFieldType;
  options: CustomFieldOption[];
  position: number;
}

/** A record's values, keyed by field id */
export type CustomFieldValues = Record<string, unknown>;

export const FIELD_TYPE_LABELS: Record<CustomFieldType, string> = {
  text: "Text",
  number: "Number",
  date: "Date",
  checkbox: "Checkbox",
  select: "Select",
  multi_select: "Multi-select",
};

export const isSelectType = (type: CustomFieldType): boolean =>
  type === "select" || type === "multi_select";
