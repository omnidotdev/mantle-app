import { useMemo } from "react";

import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useAllCompaniesQuery, useAllPeopleQuery } from "@/generated/graphql";
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
  const orgProfile = organizationId
    ? getProfileForOrg(organizationId)
    : undefined;
  const currency = quote.currency || "USD";
  const date = quote.validUntil || new Date().toISOString().split("T")[0];

  const { data: companiesData } = useAllCompaniesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const { data: peopleData } = useAllPeopleQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const company = useMemo(() => {
    if (!quote.companyId) return null;
    return (
      companiesData?.companies?.nodes?.find(
        (n) => n?.rowId === quote.companyId,
      ) ?? null
    );
  }, [companiesData, quote.companyId]);

  const contact = useMemo(() => {
    if (!quote.contactId) return null;
    return (
      peopleData?.people?.nodes?.find((n) => n?.rowId === quote.contactId) ??
      null
    );
  }, [peopleData, quote.contactId]);

  const resolvedClientName =
    quote.clientName ||
    (contact ? `${contact.firstName} ${contact.lastName}` : "");
  const resolvedClientCompany = company?.name || "";

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm print:mx-auto print:min-h-screen print:w-[210mm] print:border-0 print:shadow-none">
      <ContractHeader contractId={quote.quoteNumber || "CT-0001"} date={date} />

      <div className="space-y-6 p-6">
        <ContractParties
          orgProfile={orgProfile}
          clientName={resolvedClientName}
          clientEmail={quote.clientEmail || ""}
          clientCompany={resolvedClientCompany}
          date={date}
        />

        <hr className="border-border" />

        <ContractScope
          projectName={quote.title || "Untitled Project"}
          projectType={quote.projectType ?? null}
          description={quote.description ?? null}
        />

        <hr className="border-border" />

        <ContractPricing lineItems={lineItems} currency={currency} />

        <hr className="border-border" />

        <ContractTerms
          timeRange={quote.timeRange ?? null}
          additionalTerms={quote.additionalTerms ?? null}
          lineItems={lineItems}
        />

        <hr className="border-border" />

        <ContractLegal
          registrationState={orgProfile?.registrationState ?? null}
        />

        <hr className="border-border" />

        <ContractSignatures
          orgProfile={orgProfile}
          clientName={quote.clientName || ""}
        />
      </div>
    </div>
  );
};

export default ContractPreview;
