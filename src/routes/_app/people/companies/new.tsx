import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

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
          to: "/people/companies/$companyId/edit",
          params: { companyId: newId },
        });
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save company",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/people", search: { tab: "companies" } });
  };

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to create companies
        </p>
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
        <h2 className="mb-6 font-semibold text-lg">New Company</h2>
        <CompanyForm
          company={currentCompany}
          onCompanyChange={setCurrentCompany}
          onSave={handleSave}
          onCancel={handleCancel}
          saving={saving}
        />
      </div>
    </div>
  );
};

export const Route = createFileRoute("/_app/people/companies/new")({
  component: NewCompanyPage,
});
