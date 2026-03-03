import { useMemo, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatCurrency, formatDate } from "@/features/invoices/types/invoice";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useAllCompaniesQuery, useAllPeopleQuery } from "@/generated/graphql";

import type {
  Invoice,
  InvoiceLineItem,
} from "@/features/invoices/types/invoice";

interface InvoicePreviewProps {
  invoice: Partial<Invoice>;
  lineItems: Partial<InvoiceLineItem>[];
  organizationId?: string;
}

const InvoicePreview = ({
  invoice,
  lineItems,
  organizationId,
}: InvoicePreviewProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const { getProfileForOrg } = useSettingsStore();
  const orgProfile = organizationId
    ? getProfileForOrg(organizationId)
    : undefined;

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

  return (
    <div className="space-y-2">
      {/* Toggle for Qty / Unit Price columns */}
      <div className="flex items-center gap-2 print:hidden">
        <Switch
          id="show-details"
          checked={showDetails}
          onCheckedChange={setShowDetails}
        />
        <Label htmlFor="show-details" className="text-gray-500 text-sm">
          Show Qty &amp; Unit Price
        </Label>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm print:min-h-screen print:border-0 print:shadow-none">
        {/* Gradient header */}
        <div className="rounded-t-lg bg-linear-to-r from-teal-700 to-teal-500 p-6 text-white print:rounded-none">
          <div className="mb-2 flex justify-between">
            <div className="flex items-start gap-3">
              <img
                src="/omni-logo.svg"
                alt="Omni Logo"
                className="h-12 w-12 object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
              <div>
                <h3 className="font-bold text-white text-xl">
                  {orgProfile?.companyName || "Your Company"}
                </h3>
                {orgProfile?.addressLine1 && (
                  <p className="text-sm text-teal-100">
                    {orgProfile.addressLine1}
                  </p>
                )}
                {(orgProfile?.city ||
                  orgProfile?.state ||
                  orgProfile?.postalCode) && (
                  <p className="text-sm text-teal-100">
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
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Invoice details and client */}
          <div className="mb-8 grid grid-cols-2 gap-8">
            <div>
              <h4 className="mb-2 font-bold text-gray-700">Bill To:</h4>
              {invoice.billTo ? (
                <div className="text-gray-800">
                  {invoice.billTo.split("\n").map((line, i) => (
                    <p key={`bill-${i}`}>{line}</p>
                  ))}
                </div>
              ) : company ? (
                <>
                  <p className="text-gray-800">{company.name}</p>
                  {contact && (
                    <p className="text-gray-600">
                      {contact.firstName} {contact.lastName}
                    </p>
                  )}
                  {company.email && (
                    <p className="text-gray-500 text-sm">{company.email}</p>
                  )}
                  {company.addressLine1 && (
                    <p className="text-gray-500 text-sm">
                      {[
                        company.addressLine1,
                        [company.city, [company.state, company.postalCode].filter(Boolean).join(" ")]
                          .filter(Boolean)
                          .join(", "),
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-400">Not specified</p>
              )}
            </div>
            <div>
              <div className="mb-1 flex justify-between">
                <span className="font-bold text-gray-700">Invoice ID:</span>
                <span className="text-gray-600">
                  {invoice.invoiceNumber || "INV-0001"}
                </span>
              </div>
              {invoice.issueDate && (
                <div className="mb-1 flex justify-between">
                  <span className="font-bold text-gray-700">Invoice Date:</span>
                  <span className="text-gray-600">
                    {formatDate(invoice.issueDate)}
                  </span>
                </div>
              )}
              {invoice.dueDate && (
                <div className="mb-1 flex justify-between">
                  <span className="font-bold text-gray-700">Due Date:</span>
                  <span className="text-gray-600">
                    {formatDate(invoice.dueDate)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Line items table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-600 text-white">
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
                        <td className="border-b border-gray-200 px-4 py-3 text-gray-800">
                          {item.description}
                        </td>
                        {showDetails && (
                          <>
                            <td className="border-b border-gray-200 px-4 py-3 text-right text-gray-800">
                              {item.quantity}
                            </td>
                            <td className="border-b border-gray-200 px-4 py-3 text-right text-gray-800">
                              {formatCurrency(item.unitPrice || "0", currency)}
                            </td>
                          </>
                        )}
                        <td className="border-b border-gray-200 px-4 py-3 text-right text-gray-800">
                          {formatCurrency(item.amount || "0", currency)}
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </table>

            {/* Totals */}
            <div className="mt-6 flex justify-end">
              <div className="w-1/3 rounded bg-teal-100 p-3">
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
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h4 className="mb-2 font-bold text-gray-700">Notes:</h4>
              <div className="text-gray-600">
                {invoice.notes.split("\n").map((line, i) => (
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
