/**
 * Pure helpers behind the workspace dashboard: month bucketing, open and
 * overdue balances, payments received, and the "needs attention" lists. Dates
 * are compared as calendar keys ("YYYY-MM-DD" / "YYYY-MM") so a midnight-UTC
 * timestamp never drifts into the previous day in a western time zone
 */

interface DashboardPayment {
  /** Numeric string, e.g. "4500.00" */
  amount: string;
  /** Calendar date or timestamp; only the leading "YYYY-MM-DD" is read */
  paidAt: string;
}

interface DashboardInvoice {
  status: string;
  /** "YYYY-MM-DD" */
  issueDate: string;
  /** "YYYY-MM-DD", or null when no due date is set */
  dueDate: string | null;
  total: string;
  payments: DashboardPayment[];
  /** Workspace credit already applied to the invoice, in dollars */
  appliedCredit?: number;
}

interface DashboardQuote {
  status: string;
  /** "YYYY-MM-DD" */
  validUntil: string;
  total: string;
}

interface DashboardProduct {
  currentQuantity: number;
  lowStockThreshold: number | null;
  isActive: boolean;
}

interface MonthBucket {
  /** "YYYY-MM" */
  key: string;
  /** Short month name, e.g. "Nov" */
  label: string;
  /** Month and year, e.g. "November 2026" */
  longLabel: string;
  total: number;
}

/** Statuses that still expect a payment */
const OPEN_INVOICE_STATUSES = new Set(["sent", "viewed", "overdue"]);

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toNumber = (value: string | null | undefined): number =>
  Number.parseFloat(value ?? "") || 0;

/** Round to whole cents to avoid floating-point drift in sums */
const roundCents = (amount: number): number => Math.round(amount * 100) / 100;

/** Local calendar date of `date` as "YYYY-MM-DD" */
const toDateKey = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${date.getFullYear()}-${month}-${day}`;
};

/** "YYYY-MM" of a date key or timestamp */
const monthKeyOf = (value: string): string => value.slice(0, 7);

/** Shift a "YYYY-MM" key by `offset` months */
const addMonths = (monthKey: string, offset: number): string => {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year ?? 1970, (month ?? 1) - 1 + offset, 1));

  return date.toISOString().slice(0, 7);
};

/** Shift a "YYYY-MM-DD" key by `offset` days */
const addDays = (dateKey: string, offset: number): string =>
  new Date(Date.parse(`${dateKey}T00:00:00Z`) + offset * MS_PER_DAY)
    .toISOString()
    .slice(0, 10);

/** Whole days from one "YYYY-MM-DD" key to another (negative when earlier) */
const daysBetween = (fromKey: string, toKey: string): number =>
  Math.round(
    (Date.parse(`${toKey}T00:00:00Z`) - Date.parse(`${fromKey}T00:00:00Z`)) /
      MS_PER_DAY,
  );

const formatMonth = (
  monthKey: string,
  month: "short" | "long",
  withYear = false,
): string =>
  new Date(`${monthKey}-01T00:00:00Z`).toLocaleDateString("en-US", {
    month,
    year: withYear ? "numeric" : undefined,
    timeZone: "UTC",
  });

/** Short calendar date for list rows, e.g. "Dec 18, 2026" */
const formatShortDate = (dateKey: string): string =>
  new Date(`${dateKey.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

/** "November 2026" for a date key */
const formatMonthYear = (dateKey: string): string =>
  formatMonth(monthKeyOf(dateKey), "long", true);

/** Whole-unit currency for headline numbers, e.g. "$32,180" */
const formatWholeCurrency = (amount: number, currency = "USD"): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));

/** The last `count` months ending with the month of `todayKey`, oldest first */
const lastMonths = (
  todayKey: string,
  count: number,
): Omit<MonthBucket, "total">[] => {
  const current = monthKeyOf(todayKey);

  return Array.from({ length: count }, (_, index) => {
    const key = addMonths(current, index - (count - 1));

    return {
      key,
      label: formatMonth(key, "short"),
      longLabel: formatMonth(key, "long", true),
    };
  });
};

/**
 * Invoiced totals per month by issue date for the last `count` months. Drafts
 * and void invoices were never billed, so they are left out
 */
const invoicedPerMonth = (
  invoices: Pick<DashboardInvoice, "status" | "issueDate" | "total">[],
  todayKey: string,
  count = 6,
): MonthBucket[] => {
  const totals = new Map<string, number>();

  for (const invoice of invoices) {
    if (invoice.status === "draft" || invoice.status === "void") continue;

    const key = monthKeyOf(invoice.issueDate);
    totals.set(key, (totals.get(key) ?? 0) + toNumber(invoice.total));
  }

  return lastMonths(todayKey, count).map((month) => ({
    ...month,
    total: roundCents(totals.get(month.key) ?? 0),
  }));
};

/** What is still owed on an invoice after payments and applied credit */
const balanceDue = (
  invoice: Pick<DashboardInvoice, "total" | "payments" | "appliedCredit">,
): number =>
  roundCents(
    toNumber(invoice.total) -
      invoice.payments.reduce((sum, p) => sum + toNumber(p.amount), 0) -
      (invoice.appliedCredit ?? 0),
  );

const isOpenInvoice = (invoice: Pick<DashboardInvoice, "status">): boolean =>
  OPEN_INVOICE_STATUSES.has(invoice.status);

/**
 * Whether an open invoice with a balance is past due: either marked overdue or
 * sent with a due date before today
 */
const isOverdue = (invoice: DashboardInvoice, todayKey: string): boolean =>
  isOpenInvoice(invoice) &&
  balanceDue(invoice) > 0 &&
  (invoice.status === "overdue" ||
    (invoice.dueDate != null && invoice.dueDate.slice(0, 10) < todayKey));

/** Open balance across sent, viewed, and overdue invoices */
const outstandingSummary = (
  invoices: DashboardInvoice[],
): { amount: number; count: number } => {
  const open = invoices.filter(
    (invoice) => isOpenInvoice(invoice) && balanceDue(invoice) > 0,
  );

  return {
    amount: roundCents(open.reduce((sum, inv) => sum + balanceDue(inv), 0)),
    count: open.length,
  };
};

/**
 * Overdue invoices, most overdue first, with whole days past the due date
 * (null when marked overdue without a past due date)
 */
const overdueInvoices = <T extends DashboardInvoice>(
  invoices: T[],
  todayKey: string,
): { invoice: T; balance: number; daysOverdue: number | null }[] =>
  invoices
    .filter((invoice) => isOverdue(invoice, todayKey))
    .map((invoice) => {
      const days =
        invoice.dueDate != null
          ? daysBetween(invoice.dueDate.slice(0, 10), todayKey)
          : null;

      return {
        invoice,
        balance: balanceDue(invoice),
        daysOverdue: days != null && days > 0 ? days : null,
      };
    })
    .sort((a, b) => (b.daysOverdue ?? 0) - (a.daysOverdue ?? 0));

/**
 * Payments received in a month (by payment date), across every invoice that
 * is not void
 */
const paidInMonth = (
  invoices: Pick<DashboardInvoice, "status" | "payments">[],
  monthKey: string,
): { amount: number; count: number } => {
  let amount = 0;
  let count = 0;

  for (const invoice of invoices) {
    if (invoice.status === "void") continue;

    for (const payment of invoice.payments) {
      if (monthKeyOf(payment.paidAt) !== monthKey) continue;
      amount += toNumber(payment.amount);
      count += 1;
    }
  }

  return { amount: roundCents(amount), count };
};

/** Whole-percent change from `previous` to `current`, or null with no base */
const percentChange = (current: number, previous: number): number | null =>
  previous > 0 ? Math.round(((current - previous) / previous) * 100) : null;

/** Quotes sent and awaiting the client's decision */
const openQuotesSummary = (
  quotes: Pick<DashboardQuote, "status" | "total">[],
): { amount: number; count: number } => {
  const open = quotes.filter((quote) => quote.status === "sent");

  return {
    amount: roundCents(open.reduce((sum, q) => sum + toNumber(q.total), 0)),
    count: open.length,
  };
};

/**
 * Sent quotes whose validity ends within `withinDays` days (today included),
 * soonest first
 */
const expiringQuotes = <T extends DashboardQuote>(
  quotes: T[],
  todayKey: string,
  withinDays = 7,
): { quote: T; daysLeft: number }[] => {
  const lastDay = addDays(todayKey, withinDays);

  return quotes
    .filter(
      (quote) =>
        quote.status === "sent" &&
        quote.validUntil.slice(0, 10) >= todayKey &&
        quote.validUntil.slice(0, 10) <= lastDay,
    )
    .map((quote) => ({
      quote,
      daysLeft: daysBetween(todayKey, quote.validUntil.slice(0, 10)),
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
};

/** Active products at or below their low-stock threshold */
const lowStockProducts = <T extends DashboardProduct>(products: T[]): T[] =>
  products.filter(
    (product) =>
      product.isActive &&
      product.lowStockThreshold != null &&
      product.currentQuantity <= product.lowStockThreshold,
  );

/** The most common currency in a list, so totals are never mixed */
const primaryCurrency = (currencies: (string | null | undefined)[]): string => {
  const counts = new Map<string, number>();

  for (const currency of currencies) {
    const code = currency || "USD";
    counts.set(code, (counts.get(code) ?? 0) + 1);
  }

  let best = "USD";
  let bestCount = 0;

  for (const [code, count] of counts) {
    if (count > bestCount) {
      best = code;
      bestCount = count;
    }
  }

  return best;
};

/** "1 invoice" / "3 invoices" */
const pluralize = (count: number, singular: string, plural?: string): string =>
  `${count} ${count === 1 ? singular : (plural ?? `${singular}s`)}`;

export type {
  DashboardInvoice,
  DashboardPayment,
  DashboardProduct,
  DashboardQuote,
  MonthBucket,
};
export {
  addDays,
  addMonths,
  balanceDue,
  daysBetween,
  expiringQuotes,
  formatMonthYear,
  formatShortDate,
  formatWholeCurrency,
  invoicedPerMonth,
  isOverdue,
  lastMonths,
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
};
