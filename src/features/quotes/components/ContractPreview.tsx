import { usePeopleStore } from "@/features/people/store/peopleStore";
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
  organizationId?: string;
}

const ContractPreview = ({
  quote,
  lineItems,
  organizationId,
}: ContractPreviewProps) => {
  const { getProfileForOrg } = useSettingsStore();
  const { getCompany, getPerson } = usePeopleStore();
  const orgProfile = organizationId
    ? getProfileForOrg(organizationId)
    : undefined;
  const currency = quote.currency || "USD";
  const date = quote.validUntil || new Date().toISOString().split("T")[0];

  const company = quote.companyId ? getCompany(quote.companyId) : null;
  const contact = quote.contactId ? getPerson(quote.contactId) : null;
  const resolvedClientName =
    quote.clientName ||
    (contact ? `${contact.firstName} ${contact.lastName}` : "");
  const resolvedClientCompany = company?.name || "";

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm print:mx-auto print:min-h-screen print:w-[210mm] print:border-0 print:shadow-none">
      <ContractHeader contractId={quote.quoteNumber || "CT-0001"} date={date} />

      <div className="space-y-6 p-6">
        <ContractParties
          orgProfile={orgProfile}
          clientName={resolvedClientName}
          clientEmail={quote.clientEmail || ""}
          clientCompany={resolvedClientCompany}
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
