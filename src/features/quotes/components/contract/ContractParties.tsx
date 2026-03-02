import dayjs from "dayjs";

import type { OrganizationProfile } from "@/features/settings/types";

interface ContractPartiesProps {
  orgProfile: OrganizationProfile | undefined;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  date: string;
}

const ContractParties = ({
  orgProfile,
  clientName,
  clientEmail,
  clientCompany,
  date,
}: ContractPartiesProps) => {
  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        This Service Agreement (&quot;Agreement&quot;) is entered into as of{" "}
        <strong>{dayjs(date).format("MMMM D, YYYY")}</strong>, by and between:
      </p>

      <div className="grid grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="mb-2 font-semibold text-teal-700">
            Developer (&quot;Service Provider&quot;)
          </h4>
          <p className="font-medium">
            {orgProfile?.companyName ?? "Your Company"}
          </p>
          {orgProfile?.contactName && (
            <p className="text-gray-600 text-sm">{orgProfile.contactName}</p>
          )}
          {orgProfile?.email && (
            <p className="text-gray-600 text-sm">{orgProfile.email}</p>
          )}
          {orgProfile?.addressLine1 && (
            <p className="text-gray-600 text-sm">
              {orgProfile.addressLine1}
              {orgProfile.city && `, ${orgProfile.city}`}
              {orgProfile.state && `, ${orgProfile.state}`}
              {orgProfile.postalCode && ` ${orgProfile.postalCode}`}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <h4 className="mb-2 font-semibold text-teal-700">
            Client (&quot;Recipient&quot;)
          </h4>
          <p className="font-medium">{clientName || "Client Name"}</p>
          {clientCompany && (
            <p className="text-gray-600 text-sm">{clientCompany}</p>
          )}
          {clientEmail && (
            <p className="text-gray-600 text-sm">{clientEmail}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractParties;
