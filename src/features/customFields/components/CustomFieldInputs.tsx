import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { NativeSelect } from "@omnidotdev/thornberry/native-select";
import {
  SwitchControl,
  SwitchHiddenInput,
  SwitchRoot,
  SwitchThumb,
} from "@omnidotdev/thornberry/switch";

import SectionCard from "@/components/core/SectionCard";
import OptionChip from "./OptionChip";

import type {
  CustomField,
  CustomFieldValues,
} from "@/features/customFields/types";

interface CustomFieldInputsProps {
  fields: CustomField[];
  values: CustomFieldValues;
  onChange: (values: CustomFieldValues) => void;
}

/**
 * The workspace's custom fields as form inputs, in one section card. Renders
 * nothing when the workspace has no fields for this record type
 */
const CustomFieldInputs = ({
  fields,
  values,
  onChange,
}: CustomFieldInputsProps) => {
  if (fields.length === 0) return null;

  const set = (fieldId: string, value: unknown) =>
    onChange({ ...values, [fieldId]: value });

  return (
    <SectionCard title="Custom fields">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const id = `custom-field-${field.id}`;
          const value = values[field.id];

          if (field.type === "checkbox") {
            return (
              <div
                key={field.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 sm:self-end"
              >
                <Label htmlFor={id}>{field.label}</Label>
                <SwitchRoot
                  ids={{ hiddenInput: id }}
                  checked={value === true}
                  onCheckedChange={(details) =>
                    set(field.id, details.checked || null)
                  }
                >
                  <SwitchControl>
                    <SwitchThumb />
                  </SwitchControl>
                  <SwitchHiddenInput />
                </SwitchRoot>
              </div>
            );
          }

          if (field.type === "multi_select") {
            const chosen = new Set(Array.isArray(value) ? value : []);

            return (
              <fieldset key={field.id} className="space-y-1.5 sm:col-span-2">
                <legend className="mb-1.5 text-sm font-medium">
                  {field.label}
                </legend>
                <div className="flex flex-wrap gap-1.5">
                  {field.options.map((option, index) => {
                    const on = chosen.has(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => {
                          const next = new Set(chosen);
                          if (on) next.delete(option.id);
                          else next.add(option.id);
                          set(
                            field.id,
                            field.options
                              .map((o) => o.id)
                              .filter((o) => next.has(o)),
                          );
                        }}
                        className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        <OptionChip
                          label={option.label}
                          index={index}
                          muted={!on}
                        />
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            );
          }

          return (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={id}>{field.label}</Label>
              {field.type === "select" ? (
                <NativeSelect
                  id={id}
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => set(field.id, e.target.value || null)}
                  className="w-full"
                >
                  <option value="">Not set</option>
                  {field.options.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </NativeSelect>
              ) : field.type === "number" ? (
                <Input
                  id={id}
                  type="number"
                  inputMode="decimal"
                  value={typeof value === "number" ? String(value) : ""}
                  onChange={(e) => {
                    const parsed = Number.parseFloat(e.target.value);
                    set(field.id, Number.isFinite(parsed) ? parsed : null);
                  }}
                />
              ) : field.type === "date" ? (
                <Input
                  id={id}
                  type="date"
                  value={typeof value === "string" ? value : ""}
                  onChange={(e) => set(field.id, e.target.value || null)}
                />
              ) : (
                <Input
                  id={id}
                  value={typeof value === "string" ? value : ""}
                  maxLength={2000}
                  onChange={(e) => set(field.id, e.target.value || null)}
                />
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default CustomFieldInputs;
