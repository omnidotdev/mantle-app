import { Link, createFileRoute } from "@tanstack/react-router";
import { DollarSign, FileText, Loader2, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";

import { formatCurrency } from "@/features/invoices/types/invoice";
import {
  useAllCompaniesQuery,
  useAllInvoicesQuery,
  useAllPeopleQuery,
  useAllQuotesQuery,
} from "@/generated/graphql";
import appConfig from "@/lib/config/app.config";
import { formatStatus } from "@/lib/utils";

const statusColors: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-primary-100 text-primary-700",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  overdue: "bg-destructive/10 text-destructive",
};

const DashboardPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();

  const { data: companiesData, isLoading: companiesLoading } =
    useAllCompaniesQuery(
      { organizationId: organizationId ?? "" },
      { enabled: !!organizationId },
    );

  const { data: peopleData, isLoading: peopleLoading } = useAllPeopleQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const { data: quotesData, isLoading: quotesLoading } = useAllQuotesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const { data: invoiceData, isLoading: invoicesLoading } = useAllInvoicesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const companiesCount = companiesData?.companies?.nodes?.length ?? 0;
  const peopleCount = peopleData?.people?.nodes?.length ?? 0;

  const quotes = useMemo(
    () =>
      (quotesData?.quotes?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            status: (node.status ?? "draft") as string,
          },
        ];
      }),
    [quotesData],
  );

  const invoices = useMemo(
    () =>
      (invoiceData?.invoices?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            invoiceNumber: node.invoiceNumber,
            companyName: node.company?.name ?? null,
            status: (node.status ?? "draft") as string,
            total: node.total ?? "0",
            dueDate: node.dueDate ?? "",
            issueDate: node.issueDate ?? "",
            currency: node.currency ?? "USD",
          },
        ];
      }),
    [invoiceData],
  );

  const totalInvoiced = useMemo(
    () =>
      invoices.reduce(
        (sum, inv) => sum + (Number.parseFloat(inv.total) || 0),
        0,
      ),
    [invoices],
  );

  const paidTotal = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status === "paid")
        .reduce((sum, inv) => sum + (Number.parseFloat(inv.total) || 0), 0),
    [invoices],
  );

  const pendingCount = useMemo(
    () =>
      invoices.filter((inv) => inv.status !== "paid" && inv.status !== "void")
        .length,
    [invoices],
  );

  const recentInvoices = useMemo(
    () =>
      [...invoices]
        .sort((a, b) => b.issueDate.localeCompare(a.issueDate))
        .slice(0, 5),
    [invoices],
  );

  const isLoadingPeople = companiesLoading || peopleLoading;
  const isLoadingFinancials = invoicesLoading;

  const totalInvoicedLabel = formatCurrency(totalInvoiced.toFixed(2));
  const paidTotalLabel = formatCurrency(paidTotal.toFixed(2));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-xl">{appConfig.name}</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {appConfig.tagline}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="volcanic-glow min-w-0 rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="shrink-0 rounded-md bg-emerald-100 p-1.5">
              <DollarSign className="h-4 w-4 text-emerald-700" />
            </div>
            <span className="truncate text-muted-foreground text-xs">
              Total Invoiced
            </span>
          </div>
          {isLoadingFinancials ? (
            <Loader2
              className="h-5 w-5 animate-spin text-muted-foreground"
              aria-label="Loading"
            />
          ) : (
            <p
              className="truncate font-bold text-base md:text-lg"
              title={totalInvoicedLabel}
            >
              {totalInvoicedLabel}
            </p>
          )}
        </div>

        <div className="volcanic-glow min-w-0 rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="shrink-0 rounded-md bg-emerald-100 p-1.5">
              <TrendingUp className="h-4 w-4 text-emerald-700" />
            </div>
            <span className="truncate text-muted-foreground text-xs">Paid</span>
          </div>
          {isLoadingFinancials ? (
            <Loader2
              className="h-5 w-5 animate-spin text-muted-foreground"
              aria-label="Loading"
            />
          ) : (
            <p
              className="truncate font-bold text-base md:text-lg"
              title={paidTotalLabel}
            >
              {paidTotalLabel}
            </p>
          )}
        </div>

        <div className="volcanic-glow min-w-0 rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="shrink-0 rounded-md bg-primary-200 p-1.5">
              <FileText className="h-4 w-4 text-primary-800" />
            </div>
            <span className="truncate text-muted-foreground text-xs">
              Pending
            </span>
          </div>
          {isLoadingFinancials ? (
            <Loader2
              className="h-5 w-5 animate-spin text-muted-foreground"
              aria-label="Loading"
            />
          ) : (
            <p className="truncate font-bold text-base md:text-lg">
              {pendingCount}
            </p>
          )}
        </div>

        <div className="volcanic-glow min-w-0 rounded-lg border border-border bg-card p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="shrink-0 rounded-md bg-primary-100 p-1.5">
              <Users className="h-4 w-4 text-primary-700" />
            </div>
            <span className="truncate text-muted-foreground text-xs">
              People
            </span>
          </div>
          {isLoadingPeople ? (
            <Loader2
              className="h-5 w-5 animate-spin text-muted-foreground"
              aria-label="Loading"
            />
          ) : (
            <>
              <p className="truncate font-bold text-base md:text-lg">
                {companiesCount + peopleCount}
              </p>
              <p className="truncate text-muted-foreground text-xs">
                {companiesCount} companies, {peopleCount} contacts
              </p>
            </>
          )}
        </div>
      </div>

      {/* Module grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(appConfig.modules)
          .filter(([, config]) => config.enabled)
          .map(([key, config]) => (
            <Link
              key={key}
              to={
                `/@{$workspaceSlug}/${key}` as
                  | "/@{$workspaceSlug}/invoices"
                  | "/@{$workspaceSlug}/people"
                  | "/@{$workspaceSlug}/quotes"
                  | "/@{$workspaceSlug}/inventory"
              }
              params={{ workspaceSlug }}
              className="volcanic-glow flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl">{config.icon}</span>
              <span className="text-center font-medium text-card-foreground">
                {config.label}
              </span>
            </Link>
          ))}
      </div>

      {/* Recent invoices */}
      {recentInvoices.length > 0 && (
        <div className="rounded-lg border border-border bg-card">
          <div className="flex items-center justify-between border-border border-b px-4 py-3">
            <h2 className="font-semibold text-sm">Recent Invoices</h2>
            <Link
              to="/@{$workspaceSlug}/invoices"
              params={{ workspaceSlug }}
              className="text-muted-foreground text-xs hover:text-foreground"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentInvoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-sm">
                    {inv.invoiceNumber}
                  </p>
                  <p className="truncate text-muted-foreground text-xs">
                    {inv.companyName || "No company"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">
                    {formatCurrency(inv.total, inv.currency)}
                  </span>
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs ${statusColors[inv.status] || "bg-muted text-muted-foreground"}`}
                  >
                    {formatStatus(inv.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quote summary */}
      {!quotesLoading && quotes.length > 0 && (
        <div className="mt-4 rounded-lg border border-border bg-card px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              {quotes.length} {quotes.length === 1 ? "quote" : "quotes"} (
              {quotes.filter((q) => q.status === "accepted").length} accepted)
            </p>
            <Link
              to="/@{$workspaceSlug}/quotes"
              params={{ workspaceSlug }}
              className="text-muted-foreground text-xs hover:text-foreground"
            >
              View all
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export const Route = createFileRoute("/_app/@{$workspaceSlug}/")({
  component: DashboardPage,
});
