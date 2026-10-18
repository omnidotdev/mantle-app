import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
   * Action in flight: disables both buttons and blocks dismissal (backdrop,
   * escape, the close control) until it settles
   */
  loading?: boolean;
  /** Label shown on the confirm button while `loading` is true */
  loadingLabel?: string;
}

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
}: ConfirmDialogProps) => {
  const confirmClass =
    variant === "danger"
      ? "bg-destructive text-white hover:bg-destructive/90"
      : "bg-primary text-white hover:bg-primary-700";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        // Hold the dialog open while the action is in flight
        if (loading) return;
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-lg border border-input px-4 py-2 text-sm hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              if (closeOnConfirm) onOpenChange(false);
            }}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${confirmClass}`}
          >
            {loading ? (loadingLabel ?? confirmLabel) : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
