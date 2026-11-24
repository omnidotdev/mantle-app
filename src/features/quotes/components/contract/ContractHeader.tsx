import dayjs from "dayjs";

import DocumentBannerLogo from "@/features/settings/components/DocumentBannerLogo";
import { resolveDocumentLogo } from "@/features/settings/documentBranding";

import type { getAccentVariants } from "@/features/invoices/types/accentColor";
import type { OrganizationProfile } from "@/features/settings/types";

interface ContractHeaderProps {
  orgProfile: OrganizationProfile | undefined;
  contractId: string;
  date: string;
  /** Workspace accent variants, shared with the quote and invoice documents */
  accent: ReturnType<typeof getAccentVariants>;
}

const ContractHeader = ({
  orgProfile,
  contractId,
  date,
  accent,
}: ContractHeaderProps) => {
  const logo = resolveDocumentLogo(orgProfile);

  return (
    <div
      className="flex flex-col gap-4 px-4 py-6 text-base-50 sm:flex-row sm:items-start sm:justify-between sm:p-8 print:flex-row print:items-start print:justify-between print:rounded-none print:p-8"
      style={{
        background: `linear-gradient(to right, ${accent.gradientFrom}, ${accent.gradientTo})`,
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <DocumentBannerLogo logo={logo} />
        <div className="min-w-0">
          <h1 className="font-bold text-2xl">Service agreement</h1>
          <p style={{ color: accent.subtleText }}>
            Professional services contract
          </p>
        </div>
      </div>
      <div className="shrink-0 text-sm sm:text-right print:text-right">
        <p>Date: {dayjs(date).format("MMMM D, YYYY")}</p>
        <p>
          Contract ID: <span className="tabular">{contractId}</span>
        </p>
      </div>
    </div>
  );
};

export default ContractHeader;
