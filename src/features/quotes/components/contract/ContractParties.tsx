import dayjs from "dayjs";

import DocumentHint from "../DocumentHint";

import type { OrganizationProfile } from "@/features/settings/types";

interface ContractPartiesProps {
  orgProfile: OrganizationProfile | undefined;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  date: string;
  /** Workspace accent used for the party headings */
  accentColor: string;
}

const ContractParties = ({
  orgProfile,
  clientName,
  clientEmail,
  clientCompany,
  date,
  accentColor,
}: ContractPartiesProps) => {
  return (
    <div className="space-y-4">
      <p>
        This Service Agreement (&quot;Agreement&quot;) is entered into as of{" "}
        <strong>{dayjs(date).format("MMMM D, YYYY")}</strong>, by and between:
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 print:grid-cols-2 print:gap-6">
        <div className="break-inside-avoid rounded-xl border border-base-200 p-4">
          <h4 className="mb-2 font-semibold" style={{ color: accentColor }}>
            Developer (&quot;Service Provider&quot;)
          </h4>
          <p className="font-medium">
            {orgProfile?.companyName || (
              <DocumentHint>Add your company name in settings</DocumentHint>
            )}
          </p>
          {orgProfile?.contactName && (
            <p className="text-sm">{orgProfile.contactName}</p>
          )}
          {orgProfile?.email && <p className="text-sm">{orgProfile.email}</p>}
          {orgProfile?.addressLine1 && (
            <p className="text-sm">
              {orgProfile.addressLine1}
              {orgProfile.city && `, ${orgProfile.city}`}
              {orgProfile.state && `, ${orgProfile.state}`}
              {orgProfile.postalCode && ` ${orgProfile.postalCode}`}
            </p>
          )}
        </div>

        <div className="break-inside-avoid rounded-xl border border-base-200 p-4">
          <h4 className="mb-2 font-semibold" style={{ color: accentColor }}>
            Client (&quot;Recipient&quot;)
          </h4>
          <p className="font-medium">
            {clientName || <DocumentHint>No client yet</DocumentHint>}
          </p>
          {clientCompany && <p className="text-sm">{clientCompany}</p>}
          {clientEmail && <p className="text-sm">{clientEmail}</p>}
        </div>
      </div>
    </div>
  );
};

export default ContractParties;
