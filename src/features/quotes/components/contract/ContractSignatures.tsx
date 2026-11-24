import type { OrganizationProfile } from "@/features/settings/types";

interface ContractSignaturesProps {
  orgProfile: OrganizationProfile | undefined;
  clientName: string;
  /** Workspace accent used for the party headings */
  accentColor: string;
}

/** Blank line to sign or write on by hand */
const SignLine = ({ tall }: { tall?: boolean }) => (
  <div className={`mb-1 border-b border-base-300 ${tall ? "pb-6" : "pb-4"}`} />
);

/** A filled-in value, or a blank line to write it in by hand when unknown */
const Field = ({ value, label }: { value?: string | null; label: string }) => (
  <div>
    {value ? <p className="text-sm">{value}</p> : <SignLine />}
    <p className="text-xs text-base-500">{label}</p>
  </div>
);

const ContractSignatures = ({
  orgProfile,
  clientName,
  accentColor,
}: ContractSignaturesProps) => {
  return (
    <div className="mt-8 break-inside-avoid space-y-4">
      <h3 className="text-lg font-semibold">Signatures</h3>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 print:grid-cols-2">
        {/* Developer signature */}
        <div className="space-y-4">
          <h4 className="font-medium" style={{ color: accentColor }}>
            Service provider
          </h4>
          <div className="space-y-3">
            <div>
              <SignLine tall />
              <p className="text-xs text-base-500">Signature</p>
            </div>
            <Field value={orgProfile?.contactName} label="Name" />
            <Field value={orgProfile?.contactTitle} label="Title" />
            <Field label="Date" />
          </div>
        </div>

        {/* Client signature */}
        <div className="space-y-4">
          <h4 className="font-medium" style={{ color: accentColor }}>
            Client
          </h4>
          <div className="space-y-3">
            <div>
              <SignLine tall />
              <p className="text-xs text-base-500">Signature</p>
            </div>
            <Field value={clientName} label="Name" />
            <Field label="Title" />
            <Field label="Date" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSignatures;
