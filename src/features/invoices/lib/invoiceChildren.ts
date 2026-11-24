import type { InvoiceLineItem, Payment } from "../types/invoice";

/** A saved child row, keyed by its server row id */
interface Row {
  id?: string;
}

/**
 * Rows to create and to remove so the saved set matches the edited one. A row
 * the user did not change is left alone (no delete and re-create), so a failed
 * save never loses data it did not touch, and a changed row is created before
 * its old version is removed
 */
export const planChildSync = <T extends Row>(
  saved: T[],
  edited: T[],
  same: (a: T, b: T) => boolean,
): { create: T[]; remove: T[] } => {
  const savedById = new Map(saved.map((row) => [row.id, row]));
  const kept = new Set<string | undefined>();
  const create: T[] = [];

  for (const row of edited) {
    const previous = row.id ? savedById.get(row.id) : undefined;

    if (previous && same(previous, row)) kept.add(previous.id);
    else create.push(row);
  }

  return { create, remove: saved.filter((row) => !kept.has(row.id)) };
};

/**
 * The line items that will be saved: those with a description, numbered in
 * their on-screen order
 */
export const savableLineItems = (
  items: Partial<InvoiceLineItem>[],
): Partial<InvoiceLineItem>[] =>
  items
    .filter((item) => item.description?.trim())
    .map((item, index) => ({ ...item, sortOrder: index }));

/**
 * The payments that will be saved: those with an amount above zero and a date.
 * The paid status is derived from exactly these, so an invoice is never marked
 * paid by a payment row that is not saved
 */
export const savablePayments = (
  payments: Partial<Payment>[],
): Partial<Payment>[] =>
  payments.filter(
    (payment) =>
      Number.parseFloat(payment.amount ?? "0") > 0 && !!payment.paidAt,
  );

export const sameLineItem = (
  a: Partial<InvoiceLineItem>,
  b: Partial<InvoiceLineItem>,
): boolean =>
  a.description === b.description &&
  a.quantity === b.quantity &&
  a.unitPrice === b.unitPrice &&
  a.amount === b.amount &&
  (a.productId ?? null) === (b.productId ?? null) &&
  (a.sortOrder ?? 0) === (b.sortOrder ?? 0);

export const samePayment = (
  a: Partial<Payment>,
  b: Partial<Payment>,
): boolean =>
  a.amount === b.amount &&
  a.paidAt === b.paidAt &&
  (a.reference ?? null) === (b.reference ?? null) &&
  (a.method ?? null) === (b.method ?? null);
