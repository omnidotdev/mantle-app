import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import { Button } from "@/components/ui/button";
import CompanyForm from "@/features/people/components/CompanyForm";
import {
  useAllCompaniesQuery,
  useCreateCompanyMutation,
} from "@/generated/graphql";

import type { Company } from "@/features/people/types";

const defaultCompany: Partial<Company> = {
  name: "",
  website: null,
  industry: null,
  phone: null,
  email: null,
  addressLine1: null,
  addressLine2: null,
  city: null,
  state: null,
  postalCode: null,
  country: null,
  notes: null,
};

const NewCompanyPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentCompany, setCurrentCompany] =
    useState<Partial<Company>>(defaultCompany);
  const [saving, setSaving] = useState(false);

  const createCompanyMutation = useCreateCompanyMutation();

  const invalidateCompanies = () => {
    queryClient.invalidateQueries({
      queryKey: useAllCompaniesQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await createCompanyMutation.mutateAsync({
        input: {
          company: {
            organizationId: organizationId ?? "",
            name: currentCompany.name ?? "",
            website: currentCompany.website ?? null,
            industry: currentCompany.industry ?? null,
            phone: currentCompany.phone ?? null,
            email: currentCompany.email ?? null,
            addressLine1: currentCompany.addressLine1 ?? null,
            addressLine2: currentCompany.addressLine2 ?? null,
            city: currentCompany.city ?? null,
            state: currentCompany.state ?? null,
            postalCode: currentCompany.postalCode ?? null,
            country: currentCompany.country ?? null,
            notes: currentCompany.notes ?? null,
          },
        },
      });

      const newId = result.createCompany?.company?.rowId;
      invalidateCompanies();
      toast.success("Company saved");

      if (newId) {
        navigate({
          to: "/@{$workspaceSlug}/people/companies/$companyId/edit",
          params: { workspaceSlug, companyId: newId },
        });
      }
    } catch {
      toast.error("Failed to save company");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate({
      to: "/@{$workspaceSlug}/people",
      params: { workspaceSlug },
      search: { tab: "companies" },
    });
  };

  const canSave = !!currentCompany.name?.trim() && !saving;

  const headerActions = (
    <div className="hidden md:flex md:flex-wrap md:gap-2">
      <Button variant="outline" onClick={handleCancel} disabled={saving}>
        Cancel
      </Button>
      <Button onClick={handleSave} disabled={!canSave}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );

  if (!organizationId) {
    return (
      <PageContainer width="narrow">
        <EmptyState
          icon={Building2}
          title="No workspace selected"
          description="Select a workspace to create companies."
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="narrow">
      <PageHeader
        back={
          <BackLink
            to="/@{$workspaceSlug}/people"
            params={{ workspaceSlug }}
            search={{ tab: "companies" }}
          >
            People
          </BackLink>
        }
        title="New company"
        actions={headerActions}
      />

      <CompanyForm
        company={currentCompany}
        onCompanyChange={setCurrentCompany}
      />

      <MobileActionBar>
        <Button variant="outline" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={!canSave}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </MobileActionBar>
    </PageContainer>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/people/companies/new",
)({
  staticData: { title: "New company" },
  component: NewCompanyPage,
});
