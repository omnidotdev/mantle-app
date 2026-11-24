import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRightIcon,
  CircleAlertIcon,
  FileTextIcon,
  PlusIcon,
  ReceiptIcon,
  TrendingUpIcon,
} from "lucide-react";
import { useMemo } from "react";

import LoadingState from "@/components/core/LoadingState";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import SectionCard from "@/components/core/SectionCard";
import StatCard from "@/components/core/StatCard";
import { buttonVariants } from "@/components/ui/button";
import AttentionCard from "@/features/dashboard/components/AttentionCard";
import GetStartedCard from "@/features/dashboard/components/GetStartedCard";
import InvoicedChart from "@/features/dashboard/components/InvoicedChart";
import ModulesCard from "@/features/dashboard/components/ModulesCard";
import RecentInvoicesCard from "@/features/dashboard/components/RecentInvoicesCard";
import {
  addMonths,
  expiringQuotes,
  formatMonthYear,
  formatWholeCurrency,
  invoicedPerMonth,
  lowStockProducts,
  monthKeyOf,
  openQuotesSummary,
  outstandingSummary,
  overdueInvoices,
  paidInMonth,
  percentChange,
  pluralize,
  primaryCurrency,
  toDateKey,
} from "@/features/dashboard/lib/metrics";
import { appliedCredit } from "@/features/invoices/types/invoice";
import {
  useAllCompaniesQuery,
  useAllInvoicesQuery,
  useAllPeopleQuery,
  useAllProductsQuery,
  useAllQuotesQuery,
  useWorkspaceCreditsQuery,
} from "@/generated/graphql";
import cn from "@/lib/utils";
import { useWorkspace } from "@/providers/WorkspaceProvider";

/** First non-empty line of a free-text bill-to block (usually the name) */
const billToName = (billTo: string | null): string | null =>
  billTo
    ?.split("\n")
    .map((line) => line.trim())
    .find(Boolean) ?? null;

const personName = (
  person: { firstName: string; lastName: string } | null,
): string | null =>
  person ? `${person.firstName} ${person.lastName}`.trim() || null : null;

const DashboardPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const workspaceCtx = useWorkspace();

  const workspaceName =
    workspaceCtx?.workspaces?.find((ws) => ws.slug === workspaceSlug)?.name ??
    `@${workspaceSlug}`;

  const queryVars = { organizationId: organizationId ?? "" };
  const queryOptions = { enabled: !!organizationId };

  const { data: companiesData, isLoading: companiesLoading } =
    useAllCompaniesQuery(queryVars, queryOptions);
  const { data: peopleData, isLoading: peopleLoading } = useAllPeopleQuery(
    queryVars,
    queryOptions,
  );
  const { data: quotesData, isLoading: quotesLoading } = useAllQuotesQuery(
    queryVars,
    queryOptions,
  );
  const { data: invoiceData, isLoading: invoicesLoading } = useAllInvoicesQuery(
    queryVars,
    queryOptions,
  );
  const { data: productsData, isLoading: productsLoading } =
    useAllProductsQuery(queryVars, queryOptions);
  const { data: creditsData } = useWorkspaceCreditsQuery(
    queryVars,
    queryOptions,
  );

  const todayKey = toDateKey(new Date());
  const monthKey = monthKeyOf(todayKey);

  const companiesCount = companiesData?.companies?.nodes?.length ?? 0;
  const peopleCount = peopleData?.people?.nodes?.length ?? 0;

  // Only credit applications reduce an invoice's balance
  const credits = useMemo(
    () =>
      (creditsData?.creditTransactions?.nodes ?? []).flatMap((node) =>
        node?.kind === "application"
          ? [
              {
                amount: node.amount,
                kind: "application" as const,
                invoiceId: node.invoiceId ?? null,
              },
            ]
          : [],
      ),
    [creditsData],
  );

  const allInvoices = useMemo(
    () =>
      (invoiceData?.invoices?.nodes ?? []).flatMap((node) => {
        if (!node) return [];

        return [
          {
            id: node.rowId,
            number: node.invoiceNumber,
            status: node.status ?? "draft",
            issueDate: node.issueDate ?? "",
            dueDate: node.dueDate ?? null,
            total: node.total ?? "0",
            currency: node.currency ?? "USD",
            createdAt: node.createdAt ?? "",
            clientName:
              node.company?.name ??
              personName(node.contact) ??
              billToName(node.billTo ?? null),
            payments: node.payments.nodes.flatMap((payment) =>
              payment
                ? [{ amount: payment.amount, paidAt: payment.paidAt }]
                : [],
            ),
            appliedCredit: appliedCredit(credits, node.rowId),
          },
        ];
      }),
    [invoiceData, credits],
  );

  const allQuotes = useMemo(
    () =>
      (quotesData?.quotes?.nodes ?? []).flatMap((node) => {
        if (!node) return [];

        return [
          {
            id: node.rowId,
            number: node.quoteNumber,
            status: node.status ?? "draft",
            validUntil: node.validUntil ?? "",
            total: node.total ?? "0",
            currency: node.currency ?? "USD",
            clientName:
              node.company?.name ?? node.clientName ?? personName(node.contact),
          },
        ];
      }),
    [quotesData],
  );

  const products = useMemo(
    () =>
      (productsData?.products?.nodes ?? []).flatMap((node) =>
        node
          ? [
              {
                id: node.rowId,
                name: node.name,
                currentQuantity: node.currentQuantity ?? 0,
                lowStockThreshold: node.lowStockThreshold ?? null,
                isActive: node.isActive ?? true,
              },
            ]
          : [],
      ),
    [productsData],
  );

  // Money totals use one currency so amounts in different currencies are
  // never added together
  const currency = useMemo(
    () =>
      primaryCurrency([
        ...allInvoices.map((inv) => inv.currency),
        ...allQuotes.map((quote) => quote.currency),
      ]),
    [allInvoices, allQuotes],
  );

  const invoices = useMemo(
    () => allInvoices.filter((inv) => inv.currency === currency),
    [allInvoices, currency],
  );
  const quotes = useMemo(
    () => allQuotes.filter((quote) => quote.currency === currency),
    [allQuotes, currency],
  );
  const hasOtherCurrencies =
    invoices.length !== allInvoices.length ||
    quotes.length !== allQuotes.length;

  const outstanding = useMemo(() => outstandingSummary(invoices), [invoices]);

  const overdue = useMemo(
    () => overdueInvoices(allInvoices, todayKey),
    [allInvoices, todayKey],
  );
  const overdueInCurrency = overdue.filter(
    (item) => item.invoice.currency === currency,
  );
  const overdueAmount = overdueInCurrency.reduce(
    (sum, item) => sum + item.balance,
    0,
  );

  const paidThisMonth = useMemo(
    () => paidInMonth(invoices, monthKey),
    [invoices, monthKey],
  );
  const paidLastMonth = useMemo(
    () => paidInMonth(invoices, addMonths(monthKey, -1)),
    [invoices, monthKey],
  );
  const paidChange = percentChange(paidThisMonth.amount, paidLastMonth.amount);
  const lastMonthName = new Date(
    `${addMonths(monthKey, -1)}-01T00:00:00Z`,
  ).toLocaleDateString("en-US", { month: "long", timeZone: "UTC" });

  const openQuotes = useMemo(() => openQuotesSummary(quotes), [quotes]);

  const months = useMemo(
    () => invoicedPerMonth(invoices, todayKey, 6),
    [invoices, todayKey],
  );

  const recentInvoices = useMemo(
    () =>
      [...allInvoices]
        .sort(
          (a, b) =>
            b.issueDate.localeCompare(a.issueDate) ||
            b.createdAt.localeCompare(a.createdAt),
        )
        .slice(0, 5),
    [allInvoices],
  );

  const expiring = useMemo(
    () => expiringQuotes(allQuotes, todayKey, 7),
    [allQuotes, todayKey],
  );
  const lowStock = useMemo(() => lowStockProducts(products), [products]);

  const openInvoiceCount = allInvoices.filter((inv) =>
    ["sent", "viewed", "overdue"].includes(inv.status),
  ).length;
  const openQuoteCount = allQuotes.filter(
    (quote) => quote.status === "sent",
  ).length;

  const isLoadingCore =
    invoicesLoading || quotesLoading || peopleLoading || companiesLoading;

  const isNewWorkspace =
    !isLoadingCore &&
    allInvoices.length === 0 &&
    allQuotes.length === 0 &&
    peopleCount === 0 &&
    companiesCount === 0;

  const money = (amount: number) => formatWholeCurrency(amount, currency);

  return (
    <PageContainer>
      <PageHeader
        title="Overview"
        description={`${workspaceName} · ${formatMonthYear(todayKey)}`}
        actions={
          <>
            <Link
              to="/@{$workspaceSlug}/quotes/new"
              params={{ workspaceSlug }}
              className={buttonVariants({
                variant: "outline",
                className: "max-md:hidden",
              })}
            >
              <FileTextIcon />
              New quote
            </Link>
            <Link
              to="/@{$workspaceSlug}/invoices/new"
              params={{ workspaceSlug }}
              className={buttonVariants({
                variant: "solid",
                className: "max-md:hidden",
              })}
            >
              <PlusIcon />
              New invoice
            </Link>
          </>
        }
      />

      {isNewWorkspace && <GetStartedCard workspaceSlug={workspaceSlug} />}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          icon={ReceiptIcon}
          label="Outstanding"
          value={money(outstanding.amount)}
          title={money(outstanding.amount)}
          sub={pluralize(outstanding.count, "open invoice")}
          loading={invoicesLoading}
        />
        <StatCard
          icon={CircleAlertIcon}
          label="Overdue"
          value={money(overdueAmount)}
          title={money(overdueAmount)}
          sub={
            overdueInCurrency.length > 0 ? (
              <>
                <span className="text-destructive">
                  {pluralize(overdueInCurrency.length, "invoice")}
                </span>{" "}
                past due
              </>
            ) : (
              "Nothing past due"
            )
          }
          loading={invoicesLoading}
        />
        <StatCard
          icon={TrendingUpIcon}
          label="Paid this month"
          value={money(paidThisMonth.amount)}
          title={money(paidThisMonth.amount)}
          sub={
            paidChange != null ? (
              <>
                <span
                  className={cn(
                    paidChange >= 0 ? "text-success" : "text-destructive",
                  )}
                >
                  {paidChange >= 0 ? "+" : ""}
                  {paidChange}%
                </span>{" "}
                vs {lastMonthName}
              </>
            ) : (
              `${pluralize(paidThisMonth.count, "payment")} received`
            )
          }
          loading={invoicesLoading}
        />
        <StatCard
          icon={FileTextIcon}
          label="Open quotes"
          value={money(openQuotes.amount)}
          title={money(openQuotes.amount)}
          sub={`${openQuotes.count} awaiting a decision`}
          loading={quotesLoading}
        />
      </div>

      {hasOtherCurrencies && (
        <p className="mt-2 text-muted-foreground text-xs">
          Totals include {currency} amounts only.
        </p>
      )}

      <div className="mt-4 grid gap-4 lg:mt-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {!isNewWorkspace && (
          <div className="grid content-start gap-4">
            <SectionCard
              title="Invoiced per month"
              action={
                <Link
                  to="/@{$workspaceSlug}/invoices"
                  params={{ workspaceSlug }}
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Invoices
                  <ArrowRightIcon />
                </Link>
              }
            >
              {invoicesLoading ? (
                <LoadingState label="Loading invoiced totals" />
              ) : (
                <InvoicedChart months={months} currency={currency} />
              )}
            </SectionCard>

            <RecentInvoicesCard
              workspaceSlug={workspaceSlug}
              invoices={recentInvoices}
              loading={invoicesLoading}
            />
          </div>
        )}

        {/* Below lg this column dissolves into the page grid so "Needs attention" leads on phones */}
        <div
          className={cn(
            "grid content-start gap-4 max-lg:contents",
            isNewWorkspace && "lg:col-span-2",
          )}
        >
          {!isLoadingCore && !productsLoading && (
            <div className="empty:hidden max-lg:order-first">
              <AttentionCard
                workspaceSlug={workspaceSlug}
                overdue={overdue.map((item) => ({
                  id: item.invoice.id,
                  number: item.invoice.number,
                  clientName: item.invoice.clientName,
                  balance: item.balance,
                  currency: item.invoice.currency,
                  daysOverdue: item.daysOverdue,
                }))}
                lowStock={lowStock}
                expiringQuotes={expiring.map((item) => ({
                  id: item.quote.id,
                  number: item.quote.number,
                  clientName: item.quote.clientName,
                  total: item.quote.total,
                  currency: item.quote.currency,
                  daysLeft: item.daysLeft,
                }))}
              />
            </div>
          )}

          <ModulesCard
            workspaceSlug={workspaceSlug}
            summaries={{
              people: `${pluralize(peopleCount, "contact")} · ${pluralize(companiesCount, "company", "companies")}`,
              invoices: `${pluralize(allInvoices.length, "invoice")} · ${openInvoiceCount} open`,
              quotes: `${pluralize(allQuotes.length, "quote")} · ${openQuoteCount} open`,
              inventory: `${pluralize(products.length, "product")} · ${lowStock.length} low`,
            }}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/")({
  staticData: { title: "Dashboard" },
  component: DashboardPage,
});
