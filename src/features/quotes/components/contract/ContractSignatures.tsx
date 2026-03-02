import type { OrganizationProfile } from "@/features/settings/types";

interface ContractSignaturesProps {
  orgProfile: OrganizationProfile | undefined;
  clientName: string;
}

const ContractSignatures = ({
  orgProfile,
  clientName,
}: ContractSignaturesProps) => {
  return (
    <div className="mt-8 space-y-4">
      <h3 className="font-semibold text-gray-900 text-lg">Signatures</h3>

      <div className="grid grid-cols-2 gap-8">
        {/* Developer signature */}
        <div className="space-y-4">
          <h4 className="font-medium text-teal-700">Service Provider</h4>
          <div className="space-y-3">
            <div>
              <div className="mb-1 border-gray-300 border-b pb-6" />
              <p className="text-gray-500 text-xs">Signature</p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                {orgProfile?.contactName ?? "_______________"}
              </p>
              <p className="text-gray-500 text-xs">Name</p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                {orgProfile?.contactTitle ?? "_______________"}
              </p>
              <p className="text-gray-500 text-xs">Title</p>
            </div>
            <div>
              <div className="mb-1 border-gray-300 border-b pb-4" />
              <p className="text-gray-500 text-xs">Date</p>
            </div>
          </div>
        </div>

        {/* Client signature */}
        <div className="space-y-4">
          <h4 className="font-medium text-teal-700">Client</h4>
          <div className="space-y-3">
            <div>
              <div className="mb-1 border-gray-300 border-b pb-6" />
              <p className="text-gray-500 text-xs">Signature</p>
            </div>
            <div>
              <p className="text-gray-700 text-sm">
                {clientName || "_______________"}
              </p>
              <p className="text-gray-500 text-xs">Name</p>
            </div>
            <div>
              <div className="mb-1 border-gray-300 border-b pb-4" />
              <p className="text-gray-500 text-xs">Title</p>
            </div>
            <div>
              <div className="mb-1 border-gray-300 border-b pb-4" />
              <p className="text-gray-500 text-xs">Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSignatures;
