import { useMemo } from "react";

import {
  DEFAULT_ACCENT,
  getAccentVariants,
} from "@/features/invoices/types/accentColor";
import { useWorkspaceProfile } from "@/features/settings/hooks/useWorkspaceProfile";
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

/**
 * Printable service agreement built from a quote. Like the quote document, the
 * paper surface stays light in dark mode and uses the fixed `base-*` scale
 */
const ContractPreview = ({
  quote,
  lineItems,
  organizationId,
}: ContractPreviewProps) => {
  const { profile: orgProfile } = useWorkspaceProfile(organizationId);
  const currency = quote.currency || "USD";
  const date = quote.validUntil || new Date().toISOString().split("T")[0];

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
    <div className="overflow-hidden rounded-2xl border border-base-200 bg-white text-base-900 shadow-card print:min-h-screen print:overflow-visible print:rounded-none print:border-0 print:shadow-none">
      <ContractHeader
        orgProfile={orgProfile}
        contractId={quote.quoteNumber || "CT-0001"}
        date={date}
        accent={accent}
      />

      <div className="space-y-6 px-4 py-6 sm:px-6 print:px-6">
        <ContractParties
          orgProfile={orgProfile}
          clientName={resolvedClientName}
          clientEmail={quote.clientEmail || ""}
          clientCompany={resolvedClientCompany}
          date={date}
          accentColor={accent.gradientFrom}
        />

        <hr className="border-base-200" />

        <ContractScope
          projectName={quote.title || "Untitled project"}
          projectType={quote.projectType ?? null}
          description={quote.description ?? null}
          lineItems={lineItems}
        />

        <hr className="border-base-200" />

        <ContractPricing lineItems={lineItems} currency={currency} />

        <hr className="border-base-200" />

        <ContractTerms
          timeRange={quote.timeRange ?? null}
          lineItems={lineItems}
        />

        <hr className="border-base-200" />

        <ContractLegal
          registrationState={orgProfile?.registrationState ?? null}
          additionalTerms={quote.additionalTerms ?? null}
        />

        <hr className="border-base-200" />

        <ContractSignatures
          orgProfile={orgProfile}
          clientName={quote.clientName || ""}
          accentColor={accent.gradientFrom}
        />
      </div>
    </div>
  );
};

export default ContractPreview;
