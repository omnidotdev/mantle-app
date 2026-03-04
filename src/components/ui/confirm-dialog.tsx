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
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Delete",
  variant = "danger",
}: ConfirmDialogProps) => {
  const confirmClass =
    variant === "danger"
      ? "bg-destructive text-white hover:bg-destructive/90"
      : "bg-primary text-white hover:bg-primary-700";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-input px-4 py-2 text-sm hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={`rounded-lg px-4 py-2 text-sm ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDialog;
