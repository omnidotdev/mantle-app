import { Button } from "@/components/ui/button";
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
    </Dialog>
  );
};

export default ConfirmDialog;
