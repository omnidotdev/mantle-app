import { NativeSelect } from "@omnidotdev/thornberry/native-select";

import EmptyValue from "@/components/core/EmptyValue";
import { isSelectType } from "@/features/customFields/types";
import { formatValue, selectedOptions } from "@/features/customFields/values";
import OptionChip from "./OptionChip";

import type { RowData } from "@tanstack/react-table";
import type { DataTableColumnDef } from "@/components/ui/data-table";
import type {
  CustomField,
  CustomFieldValues,
} from "@/features/customFields/types";

/** Select fields shown as list columns and filters, at most this many */
const MAX_LIST_FIELDS = 2;

/** The select fields a list shows as columns and offers as filters */
export const listFields = (fields: CustomField[]): CustomField[] =>
  fields.filter((field) => isSelectType(field.type)).slice(0, MAX_LIST_FIELDS);

/** A select field's value as option chips */
export const OptionChips = ({
  field,
  value,
}: {
  field: CustomField;
  value: unknown;
}) => {
  const chosen = selectedOptions(field, value);
  if (chosen.length === 0) return <EmptyValue />;

  return (
    <div className="flex flex-wrap gap-1">
      {chosen.map((option) => (
        <OptionChip
          key={option.id}
          label={option.label}
          index={field.options.indexOf(option)}
        />
      ))}
    </div>
  );
};

/** One sortable column per list field */
export const customFieldColumns = <T extends RowData>(
  fields: CustomField[],
  valuesOf: (row: T) => CustomFieldValues,
): DataTableColumnDef<T>[] =>
  listFields(fields).map((field) => ({
    id: `field-${field.id}`,
    accessorFn: (row: T) => formatValue(field, valuesOf(row)[field.id]),
    header: field.label,
    cell: ({ row }) => (
      <OptionChips field={field} value={valuesOf(row.original)[field.id]} />
    ),
  }));

/** A dropdown per list field that narrows the list to one option */
export const CustomFieldFilters = ({
  fields,
  filters,
  onChange,
}: {
  fields: CustomField[];
  filters: Record<string, string>;
  onChange: (filters: Record<string, string>) => void;
}) => (
  <>
    {listFields(fields).map((field) => (
      <NativeSelect
        key={field.id}
        aria-label={`Filter by ${field.label}`}
        value={filters[field.id] ?? ""}
        onChange={(e) => onChange({ ...filters, [field.id]: e.target.value })}
        className="h-9 w-full sm:w-auto"
      >
        <option value="">Any {field.label.toLowerCase()}</option>
        {field.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </NativeSelect>
    ))}
  </>
);
