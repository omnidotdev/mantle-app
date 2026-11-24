import { Portal } from "@ark-ui/react";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@omnidotdev/thornberry/menu";
import { Mail, MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

import type { ReactNode } from "react";

/** Stops a click inside a table row cell from opening the row */
const StopRowClick = ({ children }: { children: ReactNode }) => (
  <div
    className="flex items-center justify-end gap-0.5"
    onClick={(e) => e.stopPropagation()}
    onKeyDown={(e) => e.stopPropagation()}
    role="presentation"
  >
    {children}
  </div>
);

const mailtoHref = (email: string, name: string) =>
  `mailto:${email}?subject=${encodeURIComponent(`Hello ${name}`)}`;

const iconButtonClass = buttonVariants({
  variant: "ghost",
  size: "icon-sm",
  className: "text-muted-foreground",
});

/**
 * Quick email action for a contact row: a plain mail link for one address, or
 * a menu of addresses (rendered in a portal so the table scroller never clips
 * it and it stays inside the viewport)
 */
const EmailAction = ({ emails, name }: { emails: string[]; name: string }) => {
  const [first] = emails;
  if (!first) return null;

  if (emails.length === 1) {
    return (
      <a
        href={mailtoHref(first, name)}
        className={iconButtonClass}
        aria-label={`Email ${first}`}
      >
        <Mail />
      </a>
    );
  }

  return (
    <MenuRoot positioning={{ placement: "bottom-end" }}>
      <MenuTrigger className={iconButtonClass} aria-label={`Email ${name}`}>
        <Mail />
      </MenuTrigger>
      <Portal>
        <MenuPositioner>
          <MenuContent className="max-w-[calc(100vw-2rem)] min-w-48">
            {emails.map((email) => (
              <MenuItem key={email} value={email} asChild>
                <a href={mailtoHref(email, name)} className="truncate">
                  {email}
                </a>
              </MenuItem>
            ))}
          </MenuContent>
        </MenuPositioner>
      </Portal>
    </MenuRoot>
  );
};

/** Trailing kebab menu for a list row: edit, then a guarded delete */
const RowMenu = ({
  label,
  onEdit,
  onDelete,
  deleteLabel = "Delete",
}: {
  /** Accessible name for the trigger (e.g. "Actions for Acme") */
  label: string;
  onEdit: () => void;
  /** Opens the confirm dialog; never deletes directly */
  onDelete: () => void;
  deleteLabel?: string;
}) => (
  <MenuRoot
    positioning={{ placement: "bottom-end" }}
    onSelect={({ value }) => {
      if (value === "edit") onEdit();
      if (value === "delete") onDelete();
    }}
  >
    <MenuTrigger className={iconButtonClass} aria-label={label}>
      <MoreHorizontal />
    </MenuTrigger>
    <Portal>
      <MenuPositioner>
        <MenuContent className="min-w-40">
          <MenuItem value="edit">
            <Pencil />
            Edit
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="delete" variant="destructive">
            <Trash2 />
            {deleteLabel}
          </MenuItem>
        </MenuContent>
      </MenuPositioner>
    </Portal>
  </MenuRoot>
);

/**
 * Phone-only overflow menu for an editor's bottom action bar, holding the
 * record's destructive action (it opens a confirm dialog, never deletes directly)
 */
const MobileDeleteMenu = ({
  label,
  onDelete,
  disabled,
}: {
  /** Menu item text, e.g. "Delete company" */
  label: string;
  onDelete: () => void;
  disabled?: boolean;
}) => (
  <MenuRoot
    positioning={{ placement: "top-start", gutter: 8 }}
    onSelect={({ value }) => {
      if (value === "delete") onDelete();
    }}
  >
    <MenuTrigger
      className={buttonVariants({ variant: "outline", size: "icon" })}
      aria-label="More actions"
      disabled={disabled}
    >
      <MoreHorizontal />
    </MenuTrigger>
    <Portal>
      <MenuPositioner>
        <MenuContent className="min-w-44">
          <MenuItem value="delete" variant="destructive">
            <Trash2 />
            {label}
          </MenuItem>
        </MenuContent>
      </MenuPositioner>
    </Portal>
  </MenuRoot>
);

export { EmailAction, MobileDeleteMenu, RowMenu, StopRowClick };
