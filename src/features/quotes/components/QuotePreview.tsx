import { formatCurrency } from "@/features/invoices/types/invoice";

import type { Quote, QuoteLineItem } from "../types/quote";

interface QuotePreviewProps {
  quote: Partial<Quote>;
  lineItems: Partial<QuoteLineItem>[];
}

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  sent: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
  expired: "bg-yellow-100 text-yellow-700",
  converted: "bg-purple-100 text-purple-700",
};

const QuotePreview = ({ quote, lineItems }: QuotePreviewProps) => {
  const subtotal = lineItems.reduce(
    (sum, item) => sum + Number.parseFloat(item.amount || "0"),
    0,
  );
  const taxRate = Number.parseFloat(quote.taxRate || "0");
  const taxAmount = subtotal * taxRate / 100;
  const total = subtotal + taxAmount;
  const currency = quote.currency || "USD";

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
                {quote.companyId || "Your Company"}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <h1 className="font-bold text-4xl text-white">QUOTE</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quote details and client */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h4 className="mb-2 font-bold text-gray-700">Client</h4>
            <p className="text-gray-800">
              {quote.companyId || "Company not specified"}
            </p>
            {quote.contactId && (
              <p className="text-gray-600">Contact: {quote.contactId}</p>
            )}
          </div>
          <div>
            <div className="mb-1 flex justify-between">
              <span className="font-bold text-gray-700">Quote #:</span>
              <span className="text-gray-600">
                {quote.quoteNumber || "QT-0001"}
              </span>
            </div>
            {quote.validUntil && (
              <div className="mb-1 flex justify-between">
                <span className="font-bold text-gray-700">Valid Until:</span>
                <span className="text-gray-600">{quote.validUntil}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="font-bold text-gray-700">Status:</span>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs ${statusColors[quote.status || "draft"] || statusColors.draft}`}
              >
                {quote.status || "draft"}
              </span>
            </div>
          </div>
        </div>

        {/* Title and description */}
        {(quote.title || quote.description) && (
          <div className="mb-6">
            {quote.title && (
              <h3 className="mb-1 font-bold text-gray-800 text-lg">
                {quote.title}
              </h3>
            )}
            {quote.description && (
              <p className="text-gray-600">{quote.description}</p>
            )}
          </div>
        )}

        {/* Line items table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-teal-600 text-white">
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Pricing Type</th>
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
                        <div>{item.description}</div>
                        {item.pricingType === "hourly" &&
                          item.estimatedHours && (
                            <div className="text-gray-500 text-xs">
                              Est. {item.estimatedHours} hours
                            </div>
                          )}
                        {item.pricingType === "royalty" &&
                          item.royaltyPercentage && (
                            <div className="text-gray-500 text-xs">
                              {item.royaltyPercentage}% royalty
                            </div>
                          )}
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-800">
                        {item.pricingType || "fixed"}
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

        {/* Terms */}
        {quote.terms && (
          <div className="mb-4">
            <h4 className="mb-2 font-bold text-gray-700">Terms:</h4>
            <div className="text-gray-600">
              {quote.terms.split("\n").map((line) => (
                <p key={`term-${line}`}>{line}</p>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {quote.notes && (
          <div>
            <h4 className="mb-2 font-bold text-gray-700">Notes:</h4>
            <div className="text-gray-600">
              {quote.notes.split("\n").map((line) => (
                <p key={`note-${line}`}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotePreview;
