import { ConfirmDialog as ThornberryConfirmDialog } from "@omnidotdev/thornberry/confirm-dialog";

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
 * Mantle's confirm dialog: the shared thornberry `ConfirmDialog` plus the
 * close-on-confirm default every Mantle call site relies on
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
  <ThornberryConfirmDialog
    open={open}
    onOpenChange={(next) => {
      // Hold the dialog open while the action is in flight
      if (loading) return;
      onOpenChange(next);
    }}
    title={title}
    description={description}
    confirmLabel={confirmLabel}
    confirmVariant={variant === "danger" ? "destructive" : "solid"}
    isPending={loading}
    pendingLabel={loadingLabel}
    onConfirm={() => {
      onConfirm();
      if (closeOnConfirm) onOpenChange(false);
    }}
  />
);

export default ConfirmDialog;
