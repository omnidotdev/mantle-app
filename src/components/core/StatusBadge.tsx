import cn, { formatStatus } from "@/lib/utils";

/**
 * Tone per status, shared by invoices, quotes, and inventory so a status reads
 * the same everywhere. Every tone pairs color with a dot and a text label, so
 * state is never carried by color alone
 */
const tones = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/12 text-info",
  viewed: "bg-viewed/12 text-viewed",
  success: "bg-success/12 text-success",
  warning: "bg-warning/14 text-warning",
  danger: "bg-destructive/10 text-destructive",
  brand: "bg-primary/12 text-primary-600 dark:text-primary-300",
  void: "bg-transparent text-muted-foreground line-through",
} as const;

type Tone = keyof typeof tones;

const statusTones: Record<string, Tone> = {
  // invoices
  draft: "neutral",
  sent: "info",
  viewed: "viewed",
  paid: "success",
  overdue: "danger",
  void: "void",
  // quotes
  accepted: "success",
  declined: "danger",
  expired: "warning",
  converted: "viewed",
  // inventory and people
  active: "success",
  inactive: "neutral",
  low: "warning",
  out: "danger",
};

interface StatusBadgeProps {
  /** Status key (e.g. `paid`); unknown keys render neutral */
  status: string;
  /** Override the visible label (defaults to the formatted status) */
  label?: string;
  /** Force a tone instead of looking it up from the status */
  tone?: Tone;
  className?: string;
}

const StatusBadge = ({ status, label, tone, className }: StatusBadgeProps) => (
  <span
    className={cn(
      "inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap",
      tones[tone ?? statusTones[status] ?? "neutral"],
      className,
    )}
  >
    <span aria-hidden className="size-1.5 rounded-full bg-current" />
    {label ?? formatStatus(status)}
  </span>
);

export default StatusBadge;
