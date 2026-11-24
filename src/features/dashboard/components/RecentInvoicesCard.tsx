import { Link } from "@tanstack/react-router";
import { ArrowRightIcon, ReceiptIcon } from "lucide-react";

import EmptyState from "@/components/core/EmptyState";
import EmptyValue from "@/components/core/EmptyValue";
import LoadingState from "@/components/core/LoadingState";
import SectionCard from "@/components/core/SectionCard";
import StatusBadge from "@/components/core/StatusBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  RowText,
  dashboardRowClass,
} from "@/features/dashboard/components/DashboardRow";
import { formatShortDate } from "@/features/dashboard/lib/metrics";
import { formatCurrency } from "@/features/invoices/types/invoice";

interface RecentInvoice {
  id: string;
  number: string;
  clientName: string | null;
  dueDate: string | null;
  total: string;
  currency: string;
  status: string;
}

interface RecentInvoicesCardProps {
  workspaceSlug: string;
  invoices: RecentInvoice[];
  loading?: boolean;
}

/** The five most recent invoices, each row opening the invoice */
const RecentInvoicesCard = ({
  workspaceSlug,
  invoices,
  loading,
}: RecentInvoicesCardProps) => (
  <SectionCard
    title="Recent invoices"
    flush
    action={
      <Link
        to="/@{$workspaceSlug}/invoices"
        params={{ workspaceSlug }}
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        View all
        <ArrowRightIcon />
      </Link>
    }
  >
    {loading ? (
      <LoadingState label="Loading invoices" />
    ) : invoices.length === 0 ? (
      <EmptyState
        icon={ReceiptIcon}
        title="No invoices yet"
        description="Invoices you create show up here."
        action={
          <Link
            to="/@{$workspaceSlug}/invoices/new"
            params={{ workspaceSlug }}
            className={buttonVariants({ variant: "solid" })}
          >
            New invoice
          </Link>
        }
      />
    ) : (
      <ul className="divide-y divide-border">
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            <Link
              to="/@{$workspaceSlug}/invoices/$invoiceId"
              params={{ workspaceSlug, invoiceId: invoice.id }}
              className={dashboardRowClass}
            >
              <RowText
                title={
                  invoice.clientName ?? <EmptyValue>No client yet</EmptyValue>
                }
                sub={
                  <span className="tabular">
                    {invoice.number}
                    {" · "}
                    {invoice.dueDate
                      ? `due ${formatShortDate(invoice.dueDate)}`
                      : "no due date"}
                  </span>
                }
              />
              <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="tabular font-medium text-sm">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
                <StatusBadge status={invoice.status} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    )}
  </SectionCard>
);

export default RecentInvoicesCard;
export type { RecentInvoice };
