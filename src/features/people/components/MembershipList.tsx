import { Plus, Star, Trash2 } from "lucide-react";
import { useState } from "react";

import SectionCard from "@/components/core/SectionCard";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import cn from "@/lib/utils";

import type { ReactNode } from "react";

interface MembershipItem {
  rowId: string;
  /** Person or company name shown on the row */
  name: string;
  title: string | null;
  isPrimary: boolean;
}

interface MembershipListProps {
  /** Card heading ("Members", "Companies") */
  heading: string;
  items: MembershipItem[];
  /** Shown when there are no rows yet ("No members yet") */
  emptyLabel: string;
  /** Tooltip for the filled star ("Primary contact") */
  primaryLabel: string;
  /** Body of the remove confirmation (what is unlinked, and that the record stays) */
  removeDescription: string;
  /** Picker for the record to add (a contact or company picker) */
  picker: ReactNode;
  canAdd: boolean;
  newTitle: string;
  onNewTitleChange: (title: string) => void;
  onAdd: () => void;
  onUpdateTitle: (rowId: string, title: string) => void;
  onTogglePrimary: (rowId: string, isPrimary: boolean) => void;
  onRemove: (rowId: string) => void;
}

/**
 * Company membership rows (a company's members, or a contact's companies):
 * name, an editable title, a primary star, and remove, plus an add row. Rows
 * wrap on phones so the title field never squeezes the name
 */
const MembershipList = ({
  heading,
  items,
  emptyLabel,
  primaryLabel,
  removeDescription,
  picker,
  canAdd,
  newTitle,
  onNewTitleChange,
  onAdd,
  onUpdateTitle,
  onTogglePrimary,
  onRemove,
}: MembershipListProps) => {
  const [removing, setRemoving] = useState<MembershipItem | null>(null);

  return (
    <SectionCard title={heading}>
      {items.length > 0 ? (
        <ul className="mb-4 space-y-2">
          {items.map((item) => (
            <li
              key={item.rowId}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-border px-3 py-2 sm:flex-nowrap sm:gap-3"
            >
              <span className="basis-full truncate font-medium text-sm sm:w-48 sm:shrink-0 sm:basis-auto">
                {item.name}
              </span>
              <Input
                placeholder="Title"
                aria-label={`Title for ${item.name}`}
                defaultValue={item.title ?? ""}
                onBlur={(e) => {
                  if (e.target.value !== (item.title ?? "")) {
                    onUpdateTitle(item.rowId, e.target.value);
                  }
                }}
                className="min-w-0 flex-1"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onTogglePrimary(item.rowId, item.isPrimary)}
                className={cn(
                  item.isPrimary
                    ? "text-primary hover:text-primary"
                    : "text-muted-foreground",
                )}
                aria-label={
                  item.isPrimary ? "Remove primary" : "Set as primary"
                }
                aria-pressed={item.isPrimary}
                title={item.isPrimary ? primaryLabel : "Set as primary"}
              >
                <Star fill={item.isPrimary ? "currentColor" : "none"} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setRemoving(item)}
                className="text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-muted-foreground text-sm">{emptyLabel}</p>
      )}

      <div className="grid gap-2 sm:grid-cols-[1fr_12rem_auto]">
        {picker}
        <Input
          placeholder="Title"
          aria-label="Title"
          value={newTitle}
          onChange={(e) => onNewTitleChange(e.target.value)}
        />
        <Button variant="outline" onClick={onAdd} disabled={!canAdd}>
          <Plus />
          Add
        </Button>
      </div>

      <ConfirmDialog
        open={!!removing}
        onOpenChange={(open) => {
          if (!open) setRemoving(null);
        }}
        title={`Remove ${removing?.name ?? "link"}?`}
        description={removeDescription}
        confirmLabel="Remove"
        onConfirm={() => {
          if (removing) onRemove(removing.rowId);
          setRemoving(null);
        }}
      />
    </SectionCard>
  );
};

export default MembershipList;
export type { MembershipItem };
