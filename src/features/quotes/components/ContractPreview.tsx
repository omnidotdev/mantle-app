import { useSettingsStore } from "@/features/settings/store/settingsStore";
import ContractHeader from "./contract/ContractHeader";
import ContractLegal from "./contract/ContractLegal";
import ContractParties from "./contract/ContractParties";
import ContractPricing from "./contract/ContractPricing";
import ContractScope from "./contract/ContractScope";
import ContractSignatures from "./contract/ContractSignatures";
import ContractTerms from "./contract/ContractTerms";

import type { Quote, QuoteLineItem } from "../types/quote";

interface ContractPreviewProps {
  quote: Partial<Quote>;
  lineItems: Partial<QuoteLineItem>[];
}

const ContractPreview = ({ quote, lineItems }: ContractPreviewProps) => {
  const { profiles } = useSettingsStore();
  const orgProfile = profiles[0];
  const currency = quote.currency || "USD";
  const date = quote.validUntil || new Date().toISOString().split("T")[0];

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm print:min-h-screen print:border-0 print:shadow-none">
      <ContractHeader contractId={quote.quoteNumber || "CT-0001"} date={date} />

      <div className="space-y-6 p-6">
        <ContractParties
          orgProfile={orgProfile}
          clientName={quote.clientName || ""}
          clientEmail={quote.clientEmail || ""}
          clientCompany={quote.companyId || ""}
          date={date}
        />

        <hr className="border-gray-200" />

        <ContractScope
          projectName={quote.title || "Untitled Project"}
          projectType={quote.projectType ?? null}
          description={quote.description ?? null}
        />

        <hr className="border-gray-200" />

        <ContractPricing lineItems={lineItems} currency={currency} />

        <hr className="border-gray-200" />

        <ContractTerms
          timeRange={quote.timeRange ?? null}
          additionalTerms={quote.additionalTerms ?? null}
          lineItems={lineItems}
        />

        <hr className="border-gray-200" />

        <ContractLegal
          registrationState={orgProfile?.registrationState ?? null}
        />

        <hr className="border-gray-200" />

        <ContractSignatures
          orgProfile={orgProfile}
          clientName={quote.clientName || ""}
        />
      </div>
    </div>
  );
};

export default ContractPreview;
