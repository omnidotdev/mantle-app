import dayjs from "dayjs";

import DocumentBannerLogo from "@/features/settings/components/DocumentBannerLogo";
import { resolveDocumentLogo } from "@/features/settings/documentBranding";

import type { OrganizationProfile } from "@/features/settings/types";

interface ContractHeaderProps {
  orgProfile: OrganizationProfile | undefined;
  contractId: string;
  date: string;
}

const ContractHeader = ({
  orgProfile,
  contractId,
  date,
}: ContractHeaderProps) => {
  const logo = resolveDocumentLogo(orgProfile);

  return (
    <div className="rounded-t-lg bg-linear-to-r from-primary-700 to-primary-500 p-8 text-white">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <DocumentBannerLogo logo={logo} />
          <div>
            <h1 className="font-bold text-2xl">Service Agreement</h1>
            <p className="text-primary-100">Professional Services Contract</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p>Date: {dayjs(date).format("MMMM D, YYYY")}</p>
          <p>Contract ID: {contractId}</p>
        </div>
      </div>
    </div>
  );
};

export default ContractHeader;
