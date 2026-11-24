import {
  DialogBackdrop,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
} from "@omnidotdev/thornberry/dialog";

import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  variant?: "danger" | "default";
  /**
   * Keep the dialog open after confirming so the caller can close it once an
   * async action settles. Defaults to closing immediately on confirm
   */
  closeOnConfirm?: boolean;
  /**
   * Action in flight: disables both buttons and blocks dismissal until it
   * settles
   */
  loading?: boolean;
  /** Label shown on the confirm button while `loading` is true */
  loadingLabel?: string;
}

/**
 * Confirmation for destructive or irreversible actions. Built on the shared
 * thornberry dialog parts with Mantle's buttons, so its actions match the pill
 * buttons used everywhere else in the app
 */
const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Delete",
  variant = "danger",
  closeOnConfirm = true,
  loading = false,
  loadingLabel,
}: ConfirmDialogProps) => (
  <DialogRoot
    open={open}
    onOpenChange={(details) => {
      // Hold the dialog open while the action is in flight
      if (loading) return;
      onOpenChange(details.open);
    }}
    role="alertdialog"
    lazyMount
    unmountOnExit
  >
    <DialogPortal>
      <DialogBackdrop />
      <DialogPositioner>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col gap-1.5">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={variant === "danger" ? "destructive" : "solid"}
              onClick={() => {
                onConfirm();
                if (closeOnConfirm) onOpenChange(false);
              }}
              disabled={loading}
            >
              {loading ? (loadingLabel ?? confirmLabel) : confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </DialogPositioner>
    </DialogPortal>
  </DialogRoot>
);

export default ConfirmDialog;
