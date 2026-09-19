import { Building2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import CompanyPicker from "@/features/people/components/CompanyPicker";
import ContactPicker from "@/features/people/components/ContactPicker";
import { useAllCompaniesQuery, useAllPeopleQuery } from "@/generated/graphql";

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

  const { data: companiesData } = useAllCompaniesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const { data: peopleData } = useAllPeopleQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const companies = useMemo(
    () =>
      (companiesData?.companies?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [{ id: node.rowId, name: node.name }];
      }),
    [companiesData],
  );

  const people = useMemo(
    () =>
      (peopleData?.people?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            firstName: node.firstName,
            lastName: node.lastName,
            emails: (node.emails as string[]) ?? [],
          },
        ];
      }),
    [peopleData],
  );

  // Close on outside click or ESC, ignoring Portal-rendered elements (e.g. Select dropdowns)
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

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleApplyClient = () => {
    const company = companies.find((c) => c.id === selectedCompany);
    const contact = selectedContact
      ? people.find((p) => p.id === selectedContact)
      : null;

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
        className="flex items-center gap-1.5 rounded-lg bg-primary-50 px-3 py-1.5 font-medium text-primary-700 text-sm hover:bg-primary-100"
      >
        <Building2 size={14} />
        Select client
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="Select client"
          className="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border border-border bg-card p-4 shadow-lg"
        >
          {/* Client section */}
          <div>
            <h4 className="mb-2 flex items-center gap-1.5 font-medium text-foreground text-sm">
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
                className="w-full rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
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
