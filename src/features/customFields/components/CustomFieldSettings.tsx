import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@omnidotdev/thornberry/dialog";
import { Input } from "@omnidotdev/thornberry/input";
import { Label } from "@omnidotdev/thornberry/label";
import { NativeSelect } from "@omnidotdev/thornberry/native-select";
import { ListPlus, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import EmptyState from "@/components/core/EmptyState";
import SectionCard from "@/components/core/SectionCard";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { FIELD_TYPE_LABELS, isSelectType } from "@/features/customFields/types";
import useCustomFields from "@/features/customFields/useCustomFields";
import { newOptionId } from "@/features/customFields/values";
import {
  useCreateCustomFieldMutation,
  useDeleteCustomFieldMutation,
  useUpdateCustomFieldMutation,
} from "@/generated/graphql";
import OptionChip from "./OptionChip";

import type {
  CustomField,
  CustomFieldEntity,
  CustomFieldOption,
  CustomFieldType,
} from "@/features/customFields/types";

const ENTITY_LABELS: Record<CustomFieldEntity, string> = {
  person: "Contacts",
  company: "Companies",
};

const TYPE_ORDER: CustomFieldType[] = [
  "select",
  "multi_select",
  "text",
  "number",
  "date",
  "checkbox",
];

interface Draft {
  label: string;
  type: CustomFieldType;
  options: CustomFieldOption[];
}

const emptyDraft = (): Draft => ({
  label: "",
  type: "select",
  options: [{ id: newOptionId([]), label: "" }],
});

/**
 * Settings: the workspace's custom fields on contacts and companies. Owners
 * and admins add, edit, and delete fields (the API enforces it); members see
 * the list read-only
 */
const CustomFieldSettings = ({
  organizationId,
  canManage,
}: {
  organizationId: string;
  canManage: boolean;
}) => {
  const [entity, setEntity] = useState<CustomFieldEntity>("person");
  const { fields: all, invalidate } = useCustomFields(organizationId);
  const fields = all.filter((field) => field.entity === entity);

  const [editing, setEditing] = useState<CustomField | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<CustomField | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const createField = useCreateCustomFieldMutation();
  const updateField = useUpdateCustomFieldMutation();
  const deleteField = useDeleteCustomFieldMutation();

  const openNew = () => {
    setDraft(emptyDraft());
    setEditing("new");
  };

  const openEdit = (field: CustomField) => {
    setDraft({
      label: field.label,
      type: field.type,
      options: field.options.map((option) => ({ ...option })),
    });
    setEditing(field);
  };

  const selectType = isSelectType(draft.type);
  const options = draft.options.filter((option) => option.label.trim());
  const labelTaken = fields.some(
    (field) =>
      field !== editing &&
      field.label.trim().toLowerCase() === draft.label.trim().toLowerCase(),
  );
  const canSave =
    !!draft.label.trim() &&
    !labelTaken &&
    (!selectType || options.length > 0) &&
    !saving;

  const removedInUse =
    editing !== "new" &&
    editing !== null &&
    editing.options.some(
      (option) => !draft.options.some((kept) => kept.id === option.id),
    );

  const save = async () => {
    setSaving(true);
    const cleanOptions = selectType
      ? options.map((option) => ({
          id: option.id,
          label: option.label.trim(),
        }))
      : [];

    try {
      if (editing === "new") {
        await createField.mutateAsync({
          input: {
            customField: {
              organizationId,
              entity,
              label: draft.label.trim(),
              type: draft.type,
              options: cleanOptions,
              position:
                fields.reduce((max, f) => Math.max(max, f.position), -1) + 1,
            },
          },
        });
        toast.success("Field added");
      } else if (editing) {
        await updateField.mutateAsync({
          input: {
            rowId: editing.id,
            patch: { label: draft.label.trim(), options: cleanOptions },
          },
        });
        toast.success("Field saved");
      }
      await invalidate();
      setEditing(null);
    } catch {
      toast.error("Failed to save field");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    try {
      await deleteField.mutateAsync({ input: { rowId: deleting.id } });
      await invalidate();
      toast.success("Field deleted");
      setDeleting(null);
    } catch {
      toast.error("Failed to delete field");
    } finally {
      setDeleteBusy(false);
    }
  };

  const setOption = (id: string, label: string) =>
    setDraft((d) => ({
      ...d,
      options: d.options.map((o) => (o.id === id ? { ...o, label } : o)),
    }));

  return (
    <SectionCard
      title="Custom fields"
      action={
        canManage && (
          <Button size="sm" variant="outline" onClick={openNew}>
            <Plus />
            Add field
          </Button>
        )
      }
    >
      <p className="mb-4 text-sm text-muted-foreground">
        Track what matters to your business on every record, like a lead's
        qualification or a client's budget.
        {!canManage && " Only workspace owners and admins can change fields."}
      </p>

      <SegmentedControl<CustomFieldEntity>
        label="Record type"
        size="sm"
        value={entity}
        onValueChange={setEntity}
        options={(["person", "company"] as const).map((value) => ({
          value,
          label: ENTITY_LABELS[value],
          count: all.filter((field) => field.entity === value).length,
        }))}
        className="mb-4 w-fit"
      />

      {fields.length === 0 ? (
        <EmptyState
          icon={ListPlus}
          title={`No fields on ${ENTITY_LABELS[entity].toLowerCase()} yet`}
          description="Add a select field for stages or qualifications, or a text, number, date, or checkbox field."
          action={
            canManage && (
              <Button variant="outline" onClick={openNew}>
                <Plus />
                Add field
              </Button>
            )
          }
        />
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border">
          {fields.map((field) => (
            <li
              key={field.id}
              className="flex flex-wrap items-center gap-x-3 gap-y-2 px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{field.label}</p>
                <p className="text-xs text-muted-foreground">
                  {FIELD_TYPE_LABELS[field.type]}
                </p>
              </div>
              {isSelectType(field.type) && (
                <div className="flex max-w-full flex-wrap gap-1">
                  {field.options.map((option, index) => (
                    <OptionChip
                      key={option.id}
                      label={option.label}
                      index={index}
                    />
                  ))}
                </div>
              )}
              {canManage && (
                <div className="flex gap-1">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Edit ${field.label}`}
                    onClick={() => openEdit(field)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`Delete ${field.label}`}
                    onClick={() => setDeleting(field)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 />
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <DialogRoot
        open={editing !== null}
        onOpenChange={(details) => {
          if (!details.open && !saving) setEditing(null);
        }}
        lazyMount
        unmountOnExit
      >
        <DialogPortal>
          <DialogBackdrop />
          <DialogPositioner>
            <DialogContent>
              <DialogTitle>
                {editing === "new"
                  ? `Add a field to ${ENTITY_LABELS[entity].toLowerCase()}`
                  : "Edit field"}
              </DialogTitle>

              <form
                method="post"
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (canSave) save();
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="custom-field-label">Name</Label>
                  <Input
                    id="custom-field-label"
                    value={draft.label}
                    maxLength={80}
                    placeholder="Qualification"
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, label: e.target.value }))
                    }
                    autoFocus
                  />
                  {labelTaken && (
                    <p className="text-xs text-destructive">
                      A field with this name already exists.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="custom-field-type">Type</Label>
                  <NativeSelect
                    id="custom-field-type"
                    value={draft.type}
                    disabled={editing !== "new"}
                    onChange={(e) =>
                      setDraft((d) => ({
                        ...d,
                        type: e.target.value as CustomFieldType,
                      }))
                    }
                    className="w-full"
                  >
                    {TYPE_ORDER.map((type) => (
                      <option key={type} value={type}>
                        {FIELD_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </NativeSelect>
                  {editing !== "new" && (
                    <p className="text-xs text-muted-foreground">
                      A field's type can't change. Delete it and add a new one
                      instead.
                    </p>
                  )}
                </div>

                {selectType && (
                  <fieldset className="space-y-2">
                    <legend className="mb-1.5 text-sm font-medium">
                      Options
                    </legend>
                    {draft.options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          aria-label={`Option ${index + 1}`}
                          value={option.label}
                          maxLength={80}
                          placeholder={
                            ["Lead", "Qualified", "Customer"][index] ?? "Option"
                          }
                          onChange={(e) => setOption(option.id, e.target.value)}
                        />
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          aria-label={`Remove option ${option.label || index + 1}`}
                          disabled={draft.options.length === 1}
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              options: d.options.filter(
                                (o) => o.id !== option.id,
                              ),
                            }))
                          }
                        >
                          <X />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={draft.options.length >= 100}
                      onClick={() =>
                        setDraft((d) => ({
                          ...d,
                          options: [
                            ...d.options,
                            {
                              id: newOptionId(d.options.map((o) => o.id)),
                              label: "",
                            },
                          ],
                        }))
                      }
                    >
                      <Plus />
                      Add option
                    </Button>
                    {removedInUse && (
                      <p className="text-xs text-muted-foreground">
                        Removed options are cleared from the records that use
                        them.
                      </p>
                    )}
                  </fieldset>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!canSave}>
                    {saving ? "Saving..." : "Save field"}
                  </Button>
                </div>
              </form>

              <DialogCloseTrigger />
            </DialogContent>
          </DialogPositioner>
        </DialogPortal>
      </DialogRoot>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open && !deleteBusy) setDeleting(null);
        }}
        title={`Delete field "${deleting?.label ?? ""}"?`}
        description="Its values are removed from every record. This action cannot be undone."
        confirmLabel="Delete field"
        closeOnConfirm={false}
        loading={deleteBusy}
        loadingLabel="Deleting..."
        onConfirm={confirmDelete}
      />
    </SectionCard>
  );
};

export default CustomFieldSettings;
