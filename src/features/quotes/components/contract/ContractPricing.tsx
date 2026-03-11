import { formatCurrency } from "@/features/invoices/types/invoice";

import type { QuoteLineItem } from "@/features/quotes/types/quote";

interface ContractPricingProps {
  lineItems: Partial<QuoteLineItem>[];
  currency: string;
}

const ContractPricing = ({ lineItems, currency }: ContractPricingProps) => {
  const fixedItems = lineItems.filter((li) => li.pricingType === "fixed");
  const hourlyItems = lineItems.filter((li) => li.pricingType === "hourly");
  const royaltyItems = lineItems.filter((li) => li.pricingType === "royalty");
  const complimentaryItems = lineItems.filter(
    (li) => li.pricingType === "complimentary",
  );

  const fixedTotal = fixedItems.reduce(
    (sum, li) => sum + Number.parseFloat(li.amount || "0"),
    0,
  );

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground text-lg">
        2. Payment Terms
      </h3>

      <div className="space-y-2 text-foreground text-sm">
        <p>
          Payment is due within 30 days of invoice date. No upfront payment is
          required. A late fee of 5% will be applied to overdue balances.
        </p>

        {fixedItems.length > 0 && (
          <div className="mt-3">
            <h4 className="mb-1 font-medium">Fixed Price Items</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-1">Description</th>
                  <th className="py-1 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {fixedItems.map((item) => (
                  <tr key={item.id} className="border-border border-b">
                    <td className="py-1">{item.description}</td>
                    <td className="py-1 text-right">
                      {formatCurrency(item.amount || "0", currency)}
                    </td>
                  </tr>
                ))}
                <tr className="font-medium">
                  <td className="py-1">Total Fixed</td>
                  <td className="py-1 text-right">
                    {formatCurrency(String(fixedTotal), currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {hourlyItems.length > 0 && (
          <div className="mt-3">
            <h4 className="mb-1 font-medium">Hourly Rate Items</h4>
            {hourlyItems.map((item) => (
              <div key={item.id} className="mb-2 rounded bg-muted p-2">
                <p className="font-medium">{item.description}</p>
                <p>
                  Rate:{" "}
                  {formatCurrency(
                    item.hourlyRate || item.unitPrice || "0",
                    currency,
                  )}
                  /hr
                </p>
                {item.weeklyCapHours && (
                  <p>Weekly cap: {item.weeklyCapHours} hours</p>
                )}
                {item.monthlyCapHours && (
                  <p>Monthly cap: {item.monthlyCapHours} hours</p>
                )}
                {item.maxCapHours && (
                  <p>Maximum total: {item.maxCapHours} hours</p>
                )}
              </div>
            ))}
          </div>
        )}

        {royaltyItems.length > 0 && (
          <div className="mt-3">
            <h4 className="mb-1 font-medium">Royalty Items</h4>
            {royaltyItems.map((item) => (
              <div key={item.id} className="mb-2 rounded bg-muted p-2">
                <p className="font-medium">{item.description}</p>
                {item.royaltyPercentage && (
                  <p>Royalty: {item.royaltyPercentage}%</p>
                )}
                {item.royaltyTimeframe && item.royaltyTimeframeUnit && (
                  <p>
                    Duration:{" "}
                    {item.royaltyTimeframeUnit === "perpetual"
                      ? "Perpetual"
                      : `${item.royaltyTimeframe} ${item.royaltyTimeframeUnit}`}
                  </p>
                )}
                {item.royaltyThreshold && (
                  <p>
                    Revenue threshold:{" "}
                    {formatCurrency(item.royaltyThreshold, currency)}
                  </p>
                )}
                {item.royaltyBuyoutAmount && (
                  <p>
                    Buyout option:{" "}
                    {formatCurrency(item.royaltyBuyoutAmount, currency)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {complimentaryItems.length > 0 && (
          <div className="mt-3">
            <h4 className="mb-1 font-medium">Complimentary Services</h4>
            {complimentaryItems.map((item) => (
              <div key={item.id} className="mb-2 rounded bg-muted p-2">
                <p className="font-medium">{item.description}</p>
                {item.subtitle && (
                  <p className="text-sm italic">{item.subtitle}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractPricing;
