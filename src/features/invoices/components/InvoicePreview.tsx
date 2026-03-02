import { formatCurrency } from "@/features/invoices/types/invoice";

import type { Invoice, InvoiceLineItem } from "@/features/invoices/types/invoice";

interface InvoicePreviewProps {
  invoice: Partial<Invoice>;
  lineItems: Partial<InvoiceLineItem>[];
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  viewed: "bg-indigo-100 text-indigo-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-red-100 text-red-700",
  void: "bg-gray-100 text-gray-500",
};

const InvoicePreview = ({ invoice, lineItems }: InvoicePreviewProps) => {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + Number.parseFloat(item.amount || "0"),
    0,
  );
  const taxRate = Number.parseFloat(invoice.taxRate || "0");
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;
  const currency = invoice.currency || "USD";

  return (
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
                {invoice.companyId || "Your Company"}
              </h3>
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
            <p className="text-gray-800">
              {invoice.companyId || "Company not specified"}
            </p>
            {invoice.contactId && (
              <p className="text-gray-600">Contact: {invoice.contactId}</p>
            )}
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <span className="font-bold text-gray-700">Invoice #:</span>
              <span className="text-gray-600">
                {invoice.invoiceNumber || "INV-0001"}
              </span>
            </div>
            {invoice.issueDate && (
              <div className="mb-1 flex justify-between">
                <span className="font-bold text-gray-700">Issue Date:</span>
                <span className="text-gray-600">{invoice.issueDate}</span>
              </div>
            )}
            {invoice.dueDate && (
              <div className="mb-1 flex justify-between">
                <span className="font-bold text-gray-700">Due Date:</span>
                <span className="text-gray-600">{invoice.dueDate}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">Status:</span>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs ${statusColors[invoice.status || "draft"] || statusColors.draft}`}
              >
                {invoice.status || "draft"}
              </span>
            </div>
          </div>
        </div>

        {/* Line items table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-right">Qty</th>
                <th className="px-4 py-2 text-right">Unit Price</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map(
                (item) =>
                  item.description && (
                    <tr key={item.id} className="border-gray-200 border-b">
                      <td className="px-4 py-3 text-gray-800">
                        {item.description}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800">
                        {formatCurrency(item.unitPrice || "0", currency)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-800">
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
              <div className="mb-1 flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(String(subtotal), currency)}</span>
              </div>
              {taxRate > 0 && (
                <div className="mb-1 flex justify-between text-sm">
                  <span>Tax ({taxRate}%)</span>
                  <span>{formatCurrency(String(taxAmount), currency)}</span>
                </div>
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
              {invoice.notes.split("\n").map((line) => (
                <p key={`note-${line}`}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoicePreview;
