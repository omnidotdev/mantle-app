import { Label } from "@omnidotdev/thornberry/label";
import {
  SwitchControl,
  SwitchHiddenInput,
  SwitchRoot,
  SwitchThumb,
} from "@omnidotdev/thornberry/switch";
import { useMemo, useState } from "react";

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
    <div className="space-y-2">
      {/* Toggle for Qty / Unit Price columns */}
      <div className="flex items-center gap-2 print:hidden">
        <SwitchRoot
          ids={{ hiddenInput: "show-details" }}
          checked={showDetails}
          onCheckedChange={(details) => setShowDetails(details.checked)}
        >
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchHiddenInput />
        </SwitchRoot>
        <Label htmlFor="show-details" className="text-muted-foreground text-sm">
          Show Qty &amp; Unit Price
        </Label>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-sm print:min-h-screen print:border-0 print:shadow-none">
        {/* Gradient header */}
        <div
          className="rounded-t-lg p-6 text-white print:rounded-none"
          style={{
            background: `linear-gradient(to right, ${accent.gradientFrom}, ${accent.gradientTo})`,
          }}
        >
          <div className="mb-2 flex justify-between">
            <div className="flex items-start gap-3">
              <DocumentBannerLogo logo={logo} />
              <div>
                <h3 className="font-bold text-white text-xl">
                  {orgProfile?.companyName || "Your Company"}
                </h3>
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
            <div className="text-right">
              <h1 className="font-bold text-4xl text-white">INVOICE</h1>
              {paidInFull && (
                <span className="mt-2 inline-block rounded-md bg-white px-3 py-1 font-bold text-green-700 text-sm uppercase tracking-wide">
                  Paid
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice details and client */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-2 font-bold text-foreground">Bill To:</h4>
              {invoice.billTo ? (
                <div className="text-foreground">
                  {invoice.billTo.split("\n").map((line, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: static address lines, never reordered
                    <p key={`bill-${i}`}>{line}</p>
                  ))}
                </div>
              ) : company ? (
                <>
                  {contact && (
                    <p className="text-foreground">
                      {contact.firstName} {contact.lastName}
                    </p>
                  )}
                  <p className="text-foreground">{company.name}</p>
                  {company.email && (
                    <p className="text-muted-foreground text-sm">
                      {company.email}
                    </p>
                  )}
                  {company.addressLine1 && (
                    <p className="text-muted-foreground text-sm">
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
                <p className="text-muted-foreground">Not specified</p>
              )}
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="font-bold text-foreground">Invoice ID:</span>
                <span className="text-foreground">
                  {invoice.invoiceNumber || "INV-0001"}
                </span>
              </div>
              {invoice.issueDate && (
                <div className="mb-1 flex justify-between">
                  <span className="font-bold text-foreground">
                    Invoice Date:
                  </span>
                  <span className="text-foreground">
                    {formatDate(invoice.issueDate)}
                  </span>
                </div>
              )}
              {invoice.dueDate && (
                <div className="mb-1 flex justify-between">
                  <span className="font-bold text-foreground">Due Date:</span>
                  <span className="text-foreground">
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>
              )}
              {paidInFull && settledDate && (
                <div className="mb-1 flex justify-between">
                  <span className="font-bold text-foreground">Paid Date:</span>
                  <span className="text-foreground">
                    {formatDate(settledDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Line items table */}
          <div className="mb-8">
            <table className="w-full">
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
                        <td className="border-border border-b px-4 py-3 text-foreground">
                          {item.description}
                        </td>
                        {showDetails && (
                          <>
                            <td className="border-border border-b px-4 py-3 text-right text-foreground">
                              {item.quantity}
                            </td>
                            <td className="border-border border-b px-4 py-3 text-right text-foreground">
                              {formatCurrency(item.unitPrice || "0", currency)}
                            </td>
                          </>
                        )}
                        <td className="border-border border-b px-4 py-3 text-right text-foreground">
                          {formatCurrency(item.amount || "0", currency)}
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div
                className="w-1/3 rounded p-3"
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
              <h4 className="mb-2 font-bold text-foreground">Payments:</h4>
              <table className="w-full">
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="border-border border-b px-4 py-2 text-foreground text-sm">
                        {payment.paidAt ? formatDate(payment.paidAt) : ""}
                      </td>
                      <td className="border-border border-b px-4 py-2 text-muted-foreground text-sm">
                        {[payment.method, payment.reference]
                          .filter(Boolean)
                          .join(" · ")}
                      </td>
                      <td className="border-border border-b px-4 py-2 text-right text-foreground text-sm">
                        {formatCurrency(payment.amount || "0", currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h4 className="mb-2 font-bold text-foreground">Notes:</h4>
              <div className="text-foreground">
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
