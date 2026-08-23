import dayjs from "dayjs";

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
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm">
            <img
              src={logo.src}
              alt={logo.alt}
              className="h-full w-full object-contain"
            />
          </div>
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
