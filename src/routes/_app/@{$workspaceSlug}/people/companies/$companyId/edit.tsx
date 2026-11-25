import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Building2, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import BackLink from "@/components/core/BackLink";
import EmptyState from "@/components/core/EmptyState";
import LoadingState from "@/components/core/LoadingState";
import MobileActionBar from "@/components/core/MobileActionBar";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import useCustomFields from "@/features/customFields/useCustomFields";
import { savableValues, toValues } from "@/features/customFields/values";
import ClientInvoiceNumbering from "@/features/invoices/components/ClientInvoiceNumbering";
import CompanyForm from "@/features/people/components/CompanyForm";
import CompanyMembers from "@/features/people/components/CompanyMembers";
import { MobileDeleteMenu } from "@/features/people/components/RowActions";
import {
  useAllCompaniesQuery,
  useDeleteCompanyMutation,
  useUpdateCompanyMutation,
} from "@/generated/graphql";

import type { Company } from "@/features/people/types";

const EditCompanyPage = () => {
  const { organizationId } = Route.useRouteContext();
  const { fields: customFields } = useCustomFields(organizationId, "company");
  const { workspaceSlug, companyId } = Route.useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
            customFields: toValues(node.customFields),
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
            customFields: savableValues(
              currentCompany.customFields ?? {},
              customFields,
            ),
          },
        },
      });
      invalidateCompanies();
      toast.success("Company saved");
    } catch {
      toast.error("Failed to save company");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (company) {
      setCurrentCompany(company);
    }
  };

  const deleteCompanyMutation = useDeleteCompanyMutation();

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCompanyMutation.mutateAsync({ input: { rowId: companyId } });
      invalidateCompanies();
      toast.success("Company deleted");
      setDeleteOpen(false);
      navigate({
        to: "/@{$workspaceSlug}/people",
        params: { workspaceSlug },
        search: { tab: "companies" },
      });
    } catch {
      toast.error("Failed to delete company");
    } finally {
      setDeleting(false);
    }
  };

  const canSave = !!currentCompany.name?.trim() && !saving;

  const headerActions = (
    <div className="hidden md:flex md:flex-wrap md:gap-2">
      <Button
        variant="ghost"
        onClick={() => setDeleteOpen(true)}
        disabled={saving || deleting}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 />
        Delete
      </Button>
      <Button variant="outline" onClick={handleCancel} disabled={saving}>
        Cancel
      </Button>
      <Button onClick={handleSave} disabled={!canSave}>
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );

  const backLink = (
    <BackLink
      to="/@{$workspaceSlug}/people"
      params={{ workspaceSlug }}
      search={{ tab: "companies" }}
    >
      People
    </BackLink>
  );

  if (!organizationId) {
    return (
      <PageContainer width="narrow">
        <EmptyState
          icon={Building2}
          title="No workspace selected"
          description="Select a workspace to edit companies."
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer width="narrow">
        <LoadingState label="Loading company" />
      </PageContainer>
    );
  }

  if (!company) {
    return (
      <PageContainer width="narrow">
        <PageHeader back={backLink} title="Company" />
        <EmptyState
          icon={Building2}
          title="Company not found"
          description="It may have been deleted, or the link is out of date."
          action={
            <Link
              to="/@{$workspaceSlug}/people"
              params={{ workspaceSlug }}
              search={{ tab: "companies" }}
              className={buttonVariants({ variant: "outline" })}
            >
              Back to people
            </Link>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer width="narrow">
      <PageHeader
        back={backLink}
        title={`Edit ${company.name}`}
        actions={headerActions}
      />

      <div className="space-y-5">
        <CompanyForm
          company={currentCompany}
          onCompanyChange={setCurrentCompany}
          fields={customFields}
        />

        <CompanyMembers companyId={companyId} organizationId={organizationId} />

        <ClientInvoiceNumbering
          organizationId={organizationId}
          companyId={companyId}
        />
      </div>

      <MobileActionBar>
        <MobileDeleteMenu
          label="Delete company"
          onDelete={() => setDeleteOpen(true)}
          disabled={saving || deleting}
        />
        <Button variant="outline" onClick={handleCancel} disabled={saving}>
          Cancel
        </Button>
        <Button className="flex-1" onClick={handleSave} disabled={!canSave}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </MobileActionBar>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete company "${company.name}"?`}
        description="This permanently deletes the company. This action cannot be undone."
        confirmLabel="Delete company"
        closeOnConfirm={false}
        loading={deleting}
        loadingLabel="Deleting..."
        onConfirm={handleDelete}
      />
    </PageContainer>
  );
};

export const Route = createFileRoute(
  "/_app/@{$workspaceSlug}/people/companies/$companyId/edit",
)({
  staticData: { title: "Edit company" },
  component: EditCompanyPage,
});
