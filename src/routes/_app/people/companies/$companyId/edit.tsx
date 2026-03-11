import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import CompanyForm from "@/features/people/components/CompanyForm";
import CompanyMembers from "@/features/people/components/CompanyMembers";
import {
  useAllCompaniesQuery,
  useUpdateCompanyMutation,
} from "@/generated/graphql";

import type { Company } from "@/features/people/types";

const EditCompanyPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { companyId } = Route.useParams();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<Company>>({});
  const [initialized, setInitialized] = useState(false);

  const { data: companiesData, isLoading } = useAllCompaniesQuery(
    { organizationId: organizationId ?? "" },
    { enabled: !!organizationId },
  );

  const companies = useMemo(
    () =>
      (companiesData?.companies?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            organizationId: node.organizationId,
            name: node.name,
            website: node.website ?? null,
            industry: node.industry ?? null,
            phone: node.phone ?? null,
            email: node.email ?? null,
            addressLine1: node.addressLine1 ?? null,
            addressLine2: node.addressLine2 ?? null,
            city: node.city ?? null,
            state: node.state ?? null,
            postalCode: node.postalCode ?? null,
            country: node.country ?? null,
            notes: node.notes ?? null,
            createdAt: node.createdAt ?? "",
            updatedAt: node.updatedAt ?? "",
          },
        ];
      }),
    [companiesData],
  );

  const company = useMemo(
    () => companies.find((c) => c.id === companyId),
    [companies, companyId],
  );

  useEffect(() => {
    if (company && !initialized) {
      setCurrentCompany(company);
      setInitialized(true);
    }
  }, [company, initialized]);

  const invalidateCompanies = () => {
    queryClient.invalidateQueries({
      queryKey: useAllCompaniesQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const updateCompanyMutation = useUpdateCompanyMutation();

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCompanyMutation.mutateAsync({
        input: {
          rowId: companyId,
          patch: {
            name: currentCompany.name,
            website: currentCompany.website,
            industry: currentCompany.industry,
            phone: currentCompany.phone,
            email: currentCompany.email,
            addressLine1: currentCompany.addressLine1,
            addressLine2: currentCompany.addressLine2,
            city: currentCompany.city,
            state: currentCompany.state,
            postalCode: currentCompany.postalCode,
            country: currentCompany.country,
            notes: currentCompany.notes,
          },
        },
      });
      invalidateCompanies();
      toast.success("Company saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save company",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setCurrentCompany(company);
    }
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to edit companies
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading company"
        />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="p-6">
        <Link
          to="/people"
          search={{ tab: "companies" }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">Company not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link
          to="/people"
          search={{ tab: "companies" }}
          className="text-muted-foreground text-sm hover:text-foreground"
        >
          &larr; Back to list
        </Link>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-6 font-semibold text-lg">Edit Company</h2>
        <CompanyForm
          company={currentCompany}
          onCompanyChange={setCurrentCompany}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>

      <CompanyMembers companyId={companyId} organizationId={organizationId} />
    </div>
  );
};

export const Route = createFileRoute("/_app/people/companies/$companyId/edit")({
  component: EditCompanyPage,
});
