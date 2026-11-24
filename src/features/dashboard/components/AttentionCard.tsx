import { Link } from "@tanstack/react-router";
import { BoxesIcon, CircleAlertIcon, ClockIcon } from "lucide-react";

import SectionCard from "@/components/core/SectionCard";
import {
  IconChip,
  RowText,
  dashboardRowClass,
} from "@/features/dashboard/components/DashboardRow";
import { pluralize } from "@/features/dashboard/lib/metrics";
import { formatCurrency } from "@/features/invoices/types/invoice";

/** How many records of one kind to list before summarizing the rest */
const MAX_ITEMS = 3;

interface OverdueItem {
  id: string;
  number: string;
  clientName: string | null;
  balance: number;
  currency: string;
  daysOverdue: number | null;
}

interface LowStockItem {
  id: string;
  name: string;
  currentQuantity: number;
  lowStockThreshold: number | null;
}

interface ExpiringQuoteItem {
  id: string;
  number: string;
  clientName: string | null;
  total: string;
  currency: string;
  daysLeft: number;
}

interface AttentionCardProps {
  workspaceSlug: string;
  overdue: OverdueItem[];
  lowStock: LowStockItem[];
  expiringQuotes: ExpiringQuoteItem[];
}

const overdueTitle = (item: OverdueItem) =>
  item.daysOverdue == null
    ? `${item.number} is overdue`
    : `${item.number} is ${pluralize(item.daysOverdue, "day")} overdue`;

const expiresIn = (daysLeft: number) =>
  daysLeft === 0
    ? "expires today"
    : daysLeft === 1
      ? "expires tomorrow"
      : `expires in ${daysLeft} days`;

const withClient = (clientName: string | null, amount: string) =>
  clientName ? `${clientName} · ${amount}` : amount;

/**
 * Things to act on: overdue invoices, low-stock products, and quotes about to
 * expire. Every row links to the record. Renders nothing when all is clear
 */
const AttentionCard = ({
  workspaceSlug,
  overdue,
  lowStock,
  expiringQuotes,
}: AttentionCardProps) => {
  if (!overdue.length && !lowStock.length && !expiringQuotes.length) {
    return null;
  }

  const [onlyLowStock] = lowStock;
  const hiddenOverdue = overdue.length - MAX_ITEMS;

  return (
    <SectionCard title="Needs attention" flush>
      <ul className="divide-y divide-border">
        {overdue.slice(0, MAX_ITEMS).map((item) => (
          <li key={item.id}>
            <Link
              to="/@{$workspaceSlug}/invoices/$invoiceId"
              params={{ workspaceSlug, invoiceId: item.id }}
              className={dashboardRowClass}
            >
              <IconChip icon={CircleAlertIcon} tone="danger" />
              <RowText
                title={overdueTitle(item)}
                sub={
                  <span className="tabular">
                    {withClient(
                      item.clientName,
                      `${formatCurrency(item.balance.toFixed(2), item.currency)} due`,
                    )}
                  </span>
                }
              />
            </Link>
          </li>
        ))}

        {hiddenOverdue > 0 && (
          <li>
            <Link
              to="/@{$workspaceSlug}/invoices"
              params={{ workspaceSlug }}
              className={dashboardRowClass}
            >
              <IconChip icon={CircleAlertIcon} tone="danger" />
              <RowText
                title={pluralize(hiddenOverdue, "more overdue invoice")}
                sub="Open the invoice list"
              />
            </Link>
          </li>
        )}

        {lowStock.length === 1 && onlyLowStock && (
          <li>
            <Link
              to="/@{$workspaceSlug}/inventory/$productId"
              params={{ workspaceSlug, productId: onlyLowStock.id }}
              className={dashboardRowClass}
            >
              <IconChip icon={BoxesIcon} tone="warning" />
              <RowText
                title={
                  onlyLowStock.currentQuantity <= 0
                    ? `${onlyLowStock.name} is out of stock`
                    : `${onlyLowStock.name} is low on stock`
                }
                sub={
                  <span className="tabular">
                    {onlyLowStock.currentQuantity} left, reorder at{" "}
                    {onlyLowStock.lowStockThreshold}
                  </span>
                }
              />
            </Link>
          </li>
        )}

        {lowStock.length > 1 && (
          <li>
            <Link
              to="/@{$workspaceSlug}/inventory"
              params={{ workspaceSlug }}
              className={dashboardRowClass}
            >
              <IconChip icon={BoxesIcon} tone="warning" />
              <RowText
                title={`${pluralize(lowStock.length, "product")} are low on stock`}
                sub={lowStock.map((product) => product.name).join(", ")}
              />
            </Link>
          </li>
        )}

        {expiringQuotes.slice(0, MAX_ITEMS).map((item) => (
          <li key={item.id}>
            <Link
              to="/@{$workspaceSlug}/quotes/$quoteId"
              params={{ workspaceSlug, quoteId: item.id }}
              className={dashboardRowClass}
            >
              <IconChip icon={ClockIcon} tone="info" />
              <RowText
                title={`Quote ${item.number} ${expiresIn(item.daysLeft)}`}
                sub={
                  <span className="tabular">
                    {withClient(
                      item.clientName,
                      formatCurrency(item.total, item.currency),
                    )}
                  </span>
                }
              />
            </Link>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
};

export default AttentionCard;
export type { ExpiringQuoteItem, LowStockItem, OverdueItem };
