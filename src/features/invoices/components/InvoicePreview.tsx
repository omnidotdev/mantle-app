import { useMemo, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DEFAULT_ACCENT,
  getAccentVariants,
} from "@/features/invoices/types/accentColor";
import {
  formatCurrency,
  formatDate,
  invoiceBalance,
  isPaidInFull,
  paidInFullDate,
  sumPayments,
} from "@/features/invoices/types/invoice";
import DocumentBannerLogo from "@/features/settings/components/DocumentBannerLogo";
import { resolveDocumentLogo } from "@/features/settings/documentBranding";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useAllCompaniesQuery, useAllPeopleQuery } from "@/generated/graphql";
import cn, { formatStatus } from "@/lib/utils";

import type {
  Invoice,
  InvoiceLineItem,
  Payment,
} from "@/features/invoices/types/invoice";

interface InvoicePreviewProps {
  invoice: Partial<Invoice>;
  lineItems: Partial<InvoiceLineItem>[];
  payments: Partial<Payment>[];
  organizationId?: string;
}

const InvoicePreview = ({
  invoice,
  lineItems,
  payments,
  organizationId,
}: InvoicePreviewProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const { getProfileForOrg } = useSettingsStore();
  const orgProfile = organizationId
    ? getProfileForOrg(organizationId)
    : undefined;
  const logo = resolveDocumentLogo(orgProfile);

  const accent = useMemo(
    () => getAccentVariants(orgProfile?.accentColor ?? DEFAULT_ACCENT),
    [orgProfile?.accentColor],
  );

  const { data: companiesData } = useAllCompaniesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const { data: peopleData } = useAllPeopleQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const company = useMemo(() => {
    if (!invoice.companyId) return undefined;
    return companiesData?.companies?.nodes?.find(
      (n) => n?.rowId === invoice.companyId,
    );
  }, [companiesData, invoice.companyId]);

  const contact = useMemo(() => {
    if (!invoice.contactId) return undefined;
    return peopleData?.people?.nodes?.find(
      (n) => n?.rowId === invoice.contactId,
    );
  }, [peopleData, invoice.contactId]);

  const subtotal = lineItems.reduce(
    (sum, item) => sum + (Number.parseFloat(item.amount || "0") || 0),
    0,
  );
  const taxRate = Number.parseFloat(invoice.taxRate || "0") || 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  const currency = invoice.currency || "USD";
  const hasTax = taxRate > 0;

  const recordedPayments = payments.map((payment) => ({
    amount: payment.amount ?? "0",
    paidAt: payment.paidAt ?? "",
    reference: payment.reference ?? null,
  }));
  const hasPayments = recordedPayments.length > 0;
  const amountPaid = sumPayments(recordedPayments);
  const balance = invoiceBalance(String(total), recordedPayments);
  const paidInFull = isPaidInFull(String(total), recordedPayments);
  const settledDate = paidInFullDate(String(total), recordedPayments);

  return (
    <div className="min-w-0 space-y-3">
      {/* Toggle for Qty / Unit Price columns */}
      <div className="flex items-center gap-2.5 print:hidden">
        <Switch
          id="show-details"
          checked={showDetails}
          onCheckedChange={setShowDetails}
        />
        <Label htmlFor="show-details" className="text-muted-foreground text-sm">
          Show quantity and unit price
        </Label>
      </div>

      {/* Paper document: stays light on screen in dark mode, since it previews a printed page */}
      <div className="overflow-hidden rounded-2xl border border-base-200 bg-white text-base-900 shadow-card dark:border-transparent print:min-h-screen print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
        {/* Gradient header */}
        <div
          className="p-4 text-white sm:p-6 print:rounded-none print:p-6"
          style={{
            background: `linear-gradient(to right, ${accent.gradientFrom}, ${accent.gradientTo})`,
          }}
        >
          <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:justify-between print:flex-row print:justify-between">
            <div className="flex min-w-0 items-start gap-3">
              <DocumentBannerLogo logo={logo} />
              <div className="min-w-0">
                {orgProfile?.companyName ? (
                  <h3 className="font-bold text-white text-xl">
                    {orgProfile.companyName}
                  </h3>
                ) : (
                  // Placeholder hint on screen only, so a print never shows fake data
                  <p
                    className="text-sm italic print:hidden"
                    style={{ color: accent.subtleText }}
                  >
                    Add your business details in Settings
                  </p>
                )}
                {orgProfile?.addressLine1 && (
                  <p className="text-sm" style={{ color: accent.subtleText }}>
                    {orgProfile.addressLine1}
                  </p>
                )}
                {(orgProfile?.city ||
                  orgProfile?.state ||
                  orgProfile?.postalCode) && (
                  <p className="text-sm" style={{ color: accent.subtleText }}>
                    {[
                      orgProfile.city,
                      [orgProfile.state, orgProfile.postalCode]
                        .filter(Boolean)
                        .join(" "),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
            <div className="sm:text-right print:text-right">
              {/* Not an h1: the page header owns the only h1 */}
              <h2 className="font-bold text-3xl text-white sm:text-4xl print:text-4xl">
                INVOICE
              </h2>
              {paidInFull && (
                <span className="mt-2 inline-block rounded-md bg-white px-3 py-1 font-bold text-sm text-success uppercase tracking-wide dark:bg-success dark:text-base-1000">
                  Paid
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 print:p-6">
          {/* Invoice details and client */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 print:grid-cols-2 print:gap-8">
            <div>
              <h4 className="mb-2 font-bold text-base-900">Bill To:</h4>
              {invoice.billTo ? (
                <div className="text-base-900">
                  {invoice.billTo.split("\n").map((line, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static address lines, never reordered
                    <p key={`bill-${i}`}>{line}</p>
                  ))}
                </div>
              ) : company ? (
                <>
                  {contact && (
                    <p className="text-base-900">
                      {contact.firstName} {contact.lastName}
                    </p>
                  )}
                  <p className="text-base-900">{company.name}</p>
                  {company.email && (
                    <p className="text-base-600 text-sm">{company.email}</p>
                  )}
                  {company.addressLine1 && (
                    <p className="text-base-600 text-sm">
                      {[
                        company.addressLine1,
                        [
                          company.city,
                          [company.state, company.postalCode]
                            .filter(Boolean)
                            .join(" "),
                        ]
                          .filter(Boolean)
                          .join(", "),
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-base-500">Not specified</p>
              )}
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="font-bold text-base-900">Invoice ID:</span>
                {invoice.invoiceNumber ? (
                  <span className="tabular text-base-900">
                    {invoice.invoiceNumber}
                  </span>
                ) : (
                  <span className="text-base-500 italic print:hidden">
                    Not assigned yet
                  </span>
                )}
              </div>
              {invoice.issueDate && (
                <div className="mb-1 flex justify-between">
                  <span className="font-bold text-base-900">Invoice Date:</span>
                  <span className="text-base-900">
                    {formatDate(invoice.issueDate)}
                  </span>
                </div>
              )}
              {invoice.dueDate && (
                <div className="mb-1 flex justify-between">
                  <span className="font-bold text-base-900">Due Date:</span>
                  <span className="text-base-900">
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>
              )}
              {paidInFull && settledDate && (
                <div className="mb-1 flex justify-between">
                  <span className="font-bold text-base-900">Paid Date:</span>
                  <span className="text-base-900">
                    {formatDate(settledDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Line items table */}
          <div className="mb-8">
            <div className="overflow-x-auto print:overflow-visible">
              <table
                className={cn(
                  "w-full print:min-w-0",
                  // Only force a sideways scroll on phones when qty and price columns are shown
                  showDetails && "min-w-88",
                )}
              >
                <thead>
                  <tr
                    className="text-white"
                    style={{ backgroundColor: accent.base }}
                  >
                    <th className="px-4 py-2 text-left">Item Description</th>
                    {showDetails && (
                      <>
                        <th className="px-4 py-2 text-right">Qty</th>
                        <th className="px-4 py-2 text-right">Unit Price</th>
                      </>
                    )}
                    <th className="px-4 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map(
                    (item) =>
                      item.description && (
                        <tr key={item.id}>
                          <td className="border-base-200 border-b px-4 py-3 text-base-900">
                            {item.description}
                          </td>
                          {showDetails && (
                            <>
                              <td className="border-base-200 border-b px-4 py-3 text-right text-base-900">
                                {item.quantity}
                              </td>
                              <td className="border-base-200 border-b px-4 py-3 text-right text-base-900">
                                {formatCurrency(
                                  item.unitPrice || "0",
                                  currency,
                                )}
                              </td>
                            </>
                          )}
                          <td className="border-base-200 border-b px-4 py-3 text-right text-base-900">
                            {formatCurrency(item.amount || "0", currency)}
                          </td>
                        </tr>
                      ),
                  )}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div
                className="tabular w-full rounded p-3 sm:w-1/2 sm:min-w-64 2xl:w-1/3 print:w-1/3 print:min-w-0"
                style={{
                  backgroundColor: accent.light,
                  color: accent.gradientFrom,
                }}
              >
                {hasTax && (
                  <>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(String(subtotal), currency)}</span>
                    </div>
                    <div className="mb-1 flex justify-between text-sm">
                      <span>Tax ({taxRate}%)</span>
                      <span>{formatCurrency(String(taxAmount), currency)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between font-bold">
                  <span>TOTAL</span>
                  <span>{formatCurrency(String(total), currency)}</span>
                </div>
                {hasPayments && (
                  <>
                    <div className="mt-1 flex justify-between text-sm">
                      <span>Amount Paid</span>
                      <span>
                        {formatCurrency(String(amountPaid), currency)}
                      </span>
                    </div>
                    <div className="mt-1 flex justify-between font-bold">
                      <span>{paidInFull ? "Balance" : "Balance Due"}</span>
                      <span>{formatCurrency(String(balance), currency)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment schedule */}
          {hasPayments && (
            <div className="mb-8">
              <h4 className="mb-2 font-bold text-base-900">Payments:</h4>
              <div className="overflow-x-auto print:overflow-visible">
                <table className="w-full">
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="border-base-200 border-b px-4 py-2 text-base-900 text-sm">
                          {payment.paidAt ? formatDate(payment.paidAt) : ""}
                        </td>
                        <td className="border-base-200 border-b px-4 py-2 text-base-600 text-sm">
                          {[
                            payment.method && formatStatus(payment.method),
                            payment.reference,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </td>
                        <td className="border-base-200 border-b px-4 py-2 text-right text-base-900 text-sm">
                          {formatCurrency(payment.amount || "0", currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h4 className="mb-2 font-bold text-base-900">Notes:</h4>
              <div className="text-base-900">
                {invoice.notes.split("\n").map((line, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static note lines, never reordered
                  <p key={`note-${i}`}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
