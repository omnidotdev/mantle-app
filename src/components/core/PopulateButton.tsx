import { Building2, Info, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import CompanyPicker from "@/features/people/components/CompanyPicker";
import ContactPicker from "@/features/people/components/ContactPicker";
import { usePeopleStore } from "@/features/people/store/peopleStore";

interface PopulateButtonProps {
  onPopulateClient: (fields: {
    companyId: string;
    contactId: string | null;
    companyName: string;
    contactName: string | null;
    contactEmail: string | null;
  }) => void;
  organizationId?: string;
}

const PopulateButton = ({
  onPopulateClient,
  organizationId,
}: PopulateButtonProps) => {
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedContact, setSelectedContact] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const { getCompany, getPerson } = usePeopleStore();

  // Close on outside click, ignoring Portal-rendered elements (e.g. Select dropdowns)
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: PointerEvent) => {
      if (!popoverRef.current) return;

      const target = e.target as HTMLElement;

      // Ignore clicks inside the popover
      if (popoverRef.current.contains(target)) return;

      // Ignore clicks inside Portal-rendered elements (Ark UI renders into [data-scope])
      if (target.closest("[data-scope]")) return;

      setOpen(false);
    };

    document.addEventListener("pointerdown", handleClickOutside);

    return () =>
      document.removeEventListener("pointerdown", handleClickOutside);
  }, [open]);

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
        <div
          ref={popoverRef}
          className="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg"
        >
          {/* Sender info note */}
          <div className="mb-4 flex items-start gap-2 rounded-md bg-gray-50 p-2 text-gray-500 text-xs">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>Sender details auto-fill from org profile in Settings</span>
          </div>

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
                organizationId={organizationId}
              />
              <ContactPicker
                value={selectedContact}
                onValueChange={setSelectedContact}
                organizationId={organizationId}
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
      )}
    </div>
  );
};

export default PopulateButton;
