import { Portal } from "@ark-ui/react";
import {
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@omnidotdev/thornberry/popover";
import { Building2 } from "lucide-react";
import { useMemo, useState } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
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
    <PopoverRoot
      open={open}
      onOpenChange={(details) => setOpen(details.open)}
      positioning={{ placement: "bottom-end", gutter: 8 }}
    >
      <PopoverTrigger
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <Building2 />
        Select client
      </PopoverTrigger>
      <Portal>
        <PopoverPositioner>
          <PopoverContent className="w-[min(20rem,calc(100vw-2rem))] rounded-2xl bg-card p-4 shadow-raised">
            <PopoverTitle className="mb-3 flex items-center gap-1.5 font-semibold text-sm">
              <Building2 className="size-4 text-muted-foreground" />
              Client
            </PopoverTitle>
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
              <Button
                className="w-full"
                onClick={handleApplyClient}
                disabled={!selectedCompany}
              >
                Apply client
              </Button>
            </div>
          </PopoverContent>
        </PopoverPositioner>
      </Portal>
    </PopoverRoot>
  );
};

export default PopulateButton;
