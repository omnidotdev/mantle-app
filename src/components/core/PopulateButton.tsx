import { Building2, User, Zap } from "lucide-react";
import { useState } from "react";

import CompanyPicker from "@/features/people/components/CompanyPicker";
import ContactPicker from "@/features/people/components/ContactPicker";
import { usePeopleStore } from "@/features/people/store/peopleStore";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

interface PopulateButtonProps {
  onPopulateSender: (fields: {
    companyName: string;
    contactName: string;
    email: string;
    phone: string | null;
  }) => void;
  onPopulateClient: (fields: {
    companyId: string;
    contactId: string | null;
    companyName: string;
    contactName: string | null;
    contactEmail: string | null;
  }) => void;
}

const PopulateButton = ({
  onPopulateSender,
  onPopulateClient,
}: PopulateButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedContact, setSelectedContact] = useState("");

  const { profiles } = useSettingsStore();
  const { getCompany, getPerson } = usePeopleStore();
  const orgProfile = profiles[0];

  const handlePopulateSender = () => {
    if (!orgProfile) return;
    onPopulateSender({
      companyName: orgProfile.companyName,
      contactName: orgProfile.contactName,
      email: orgProfile.email,
      phone: orgProfile.phone,
    });
    setOpen(false);
  };

  const handleApplyClient = () => {
    const company = getCompany(selectedCompany);
    const contact = selectedContact ? getPerson(selectedContact) : null;

    onPopulateClient({
      companyId: selectedCompany,
      contactId: selectedContact || null,
      companyName: company?.name ?? "",
      contactName: contact ? `${contact.firstName} ${contact.lastName}` : null,
      contactEmail: contact?.emails[0] ?? null,
    });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 font-medium text-sm text-teal-700 hover:bg-teal-100"
      >
        <Zap size={14} />
        Populate with Omni
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
          />
          <div className="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
            {/* Sender section */}
            <div className="mb-4">
              <h4 className="mb-2 flex items-center gap-1.5 font-medium text-gray-700 text-sm">
                <User size={14} />
                Sender (from Org Profile)
              </h4>
              {orgProfile ? (
                <button
                  type="button"
                  onClick={handlePopulateSender}
                  className="w-full rounded-md border border-gray-200 p-2 text-left text-sm hover:bg-gray-50"
                >
                  <p className="font-medium">{orgProfile.companyName}</p>
                  <p className="text-gray-500 text-xs">{orgProfile.email}</p>
                </button>
              ) : (
                <p className="text-gray-400 text-sm">
                  No org profile configured. Go to Settings to add one.
                </p>
              )}
            </div>

            <hr className="mb-4 border-gray-100" />

            {/* Client section */}
            <div>
              <h4 className="mb-2 flex items-center gap-1.5 font-medium text-gray-700 text-sm">
                <Building2 size={14} />
                Client
              </h4>
              <div className="space-y-2">
                <CompanyPicker
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                />
                <ContactPicker
                  value={selectedContact}
                  onValueChange={setSelectedContact}
                />
                <button
                  type="button"
                  onClick={handleApplyClient}
                  disabled={!selectedCompany}
                  className="w-full rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Apply Client
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PopulateButton;
