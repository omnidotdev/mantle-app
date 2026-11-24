import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { Building2, Plus, Share2, Users } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import EmptyState from "@/components/core/EmptyState";
import EmptyValue from "@/components/core/EmptyValue";
import ListToolbar from "@/components/core/ListToolbar";
import LoadingState from "@/components/core/LoadingState";
import PageContainer from "@/components/core/PageContainer";
import PageHeader from "@/components/core/PageHeader";
import SectionCard from "@/components/core/SectionCard";
import StatusBadge from "@/components/core/StatusBadge";
import { Button, buttonVariants } from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import { PhoneDisplay } from "@/components/ui/phone-display";
import { SearchInput } from "@/components/ui/search-input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import ImportExportDialog from "@/features/people/components/ImportExportDialog";
import NetworkSection from "@/features/people/components/NetworkSection";
import {
  EmailAction,
  RowMenu,
  StopRowClick,
} from "@/features/people/components/RowActions";
import TagChip from "@/features/people/components/TagChip";
import { peopleListSearchSchema } from "@/features/people/searchParams";
import {
  useAllCompaniesQuery,
  useAllPeopleQuery,
  useDeleteCompanyMutation,
  useDeletePersonMutation,
} from "@/generated/graphql";
import { useUrlSort } from "@/lib/hooks/util/useUrlSort";
import { useWorkspaceSlug } from "@/lib/hooks/util/useWorkspaceSlug";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { ActiveTab } from "@/features/people/store/peopleStore";
import type { Company, Person } from "@/features/people/types";

const COMPANIES_DEFAULT_SORTING: SortingState = [{ id: "name", desc: false }];
const CONTACTS_DEFAULT_SORTING: SortingState = [
  { id: "lastName", desc: false },
];

const plural = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

const fullName = (person: Person) => `${person.firstName} ${person.lastName}`;

const PeoplePage = () => {
  const { organizationId } = Route.useRouteContext();
  const { workspaceSlug } = Route.useParams();
  const search = Route.useSearch();
  const { tab: activeTab, search: searchTerm, type: typeFilter } = search;
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const [importExportOpen, setImportExportOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    name: string;
    type: "company" | "contact";
  }>({ open: false, id: "", name: "", type: "company" });

  const { data: companiesData, isLoading: companiesLoading } =
    useAllCompaniesQuery(
      { organizationId: organizationId ?? "" },
      { enabled: !!organizationId },
    );

  const { data: peopleData, isLoading: peopleLoading } = useAllPeopleQuery(
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

  const people = useMemo(
    () =>
      (peopleData?.people?.nodes ?? []).flatMap((node) => {
        if (!node) return [];
        return [
          {
            id: node.rowId,
            organizationId: node.organizationId,
            firstName: node.firstName,
            lastName: node.lastName,
            emails: (node.emails as string[]) ?? [],
            phone: node.phone ?? null,
            avatarUrl: node.avatarUrl ?? null,
            tags: (node.tags as string[]) ?? null,
            internal: node.internal ?? false,
            notes: node.notes ?? null,
            createdAt: node.createdAt ?? "",
            updatedAt: node.updatedAt ?? "",
          },
        ];
      }),
    [peopleData],
  );

  const invalidateCompanies = () => {
    queryClient.invalidateQueries({
      queryKey: useAllCompaniesQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const invalidatePeople = () => {
    queryClient.invalidateQueries({
      queryKey: useAllPeopleQuery.getKey({
        organizationId: organizationId ?? "",
      }),
    });
  };

  const deleteCompanyMutation = useDeleteCompanyMutation({
    onSuccess: invalidateCompanies,
  });

  const deletePersonMutation = useDeletePersonMutation({
    onSuccess: invalidatePeople,
  });

  if (!organizationId) {
    return (
      <PageContainer>
        <EmptyState
          icon={Users}
          title="No workspace selected"
          description="Select a workspace to view people."
        />
      </PageContainer>
    );
  }

  if (companiesLoading || peopleLoading) {
    return (
      <PageContainer>
        <LoadingState label="Loading people" />
      </PageContainer>
    );
  }

  const isNetwork = activeTab === "network";

  const setSearchTerm = (value: string) =>
    navigate({ search: (prev) => ({ ...prev, search: value }) });

  return (
    <PageContainer>
      <PageHeader
        title="People"
        description={
          <>
            <span className="tabular">
              {plural(companies.length, "company", "companies")}
            </span>
            {" · "}
            <span className="tabular">
              {plural(people.length, "contact", "contacts")}
            </span>
          </>
        }
        actions={
          isNetwork ? undefined : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setImportExportOpen(true)}
              >
                <Share2 />
                Import or export
              </Button>
              <Link
                to={
                  activeTab === "companies"
                    ? "/@{$workspaceSlug}/people/companies/new"
                    : "/@{$workspaceSlug}/people/contacts/new"
                }
                params={{ workspaceSlug }}
                className={buttonVariants({
                  variant: "solid",
                  className: "max-md:hidden",
                })}
              >
                <Plus />
                {activeTab === "companies" ? "Add company" : "Add contact"}
              </Link>
            </>
          )
        }
      />

      <SegmentedControl<ActiveTab>
        label="People view"
        value={activeTab}
        onValueChange={(tab) =>
          navigate({
            search: (prev) => ({
              ...prev,
              tab,
              search: "",
              sortBy: undefined,
              sortDir: undefined,
            }),
          })
        }
        options={[
          { value: "companies", label: "Companies", count: companies.length },
          { value: "contacts", label: "Contacts", count: people.length },
          { value: "network", label: "Network" },
        ]}
        className="mb-4 w-full sm:w-fit [&>button]:flex-1 [&>button]:justify-center sm:[&>button]:flex-none"
      />

      {activeTab === "companies" && (
        <CompaniesTable
          companies={companies}
          search={search}
          navigate={navigate}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onDelete={(company) =>
            setDeleteConfirm({
              open: true,
              id: company.id,
              name: company.name,
              type: "company",
            })
          }
        />
      )}

      {activeTab === "contacts" && (
        <ContactsTable
          people={people}
          search={search}
          navigate={navigate}
          searchTerm={searchTerm}
          typeFilter={typeFilter}
          onSearchChange={setSearchTerm}
          onTypeFilterChange={(value) =>
            navigate({ search: (prev) => ({ ...prev, type: value }) })
          }
          onDelete={(person) =>
            setDeleteConfirm({
              open: true,
              id: person.id,
              name: fullName(person),
              type: "contact",
            })
          }
        />
      )}

      {isNetwork && <NetworkSection people={people} />}

      <ImportExportDialog
        open={importExportOpen}
        onOpenChange={setImportExportOpen}
        context={activeTab === "companies" ? "companies" : "contacts"}
        organizationId={organizationId}
        companies={companies}
        people={people}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title={`Delete ${deleteConfirm.type} "${deleteConfirm.name}"?`}
        description="This permanently deletes the record. This action cannot be undone."
        onConfirm={() => {
          if (deleteConfirm.type === "company") {
            deleteCompanyMutation.mutate(
              { input: { rowId: deleteConfirm.id } },
              { onError: () => toast.error("Failed to delete company") },
            );
          } else {
            deletePersonMutation.mutate(
              { input: { rowId: deleteConfirm.id } },
              { onError: () => toast.error("Failed to delete contact") },
            );
          }
        }}
      />
    </PageContainer>
  );
};

type PeopleSearch = ReturnType<typeof Route.useSearch>;
type PeopleNavigate = ReturnType<typeof Route.useNavigate>;

const CompaniesTable = ({
  companies,
  search,
  navigate: routeNavigate,
  searchTerm,
  onSearchChange,
  onDelete,
}: {
  companies: Company[];
  search: PeopleSearch;
  navigate: PeopleNavigate;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onDelete: (company: Company) => void;
}) => {
  const navigate = useNavigate();
  const workspaceSlug = useWorkspaceSlug();

  const [sorting, setSorting] = useUrlSort({
    search,
    defaultSorting: COMPANIES_DEFAULT_SORTING,
    navigate: routeNavigate,
  });

  const filteredCompanies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return companies;

    return companies.filter((c) =>
      [c.name, c.industry, c.email, c.phone, c.website].some((field) =>
        (field ?? "").toLowerCase().includes(term),
      ),
    );
  }, [companies, searchTerm]);

  const openCompany = useCallback(
    (company: Company) =>
      navigate({
        to: "/@{$workspaceSlug}/people/companies/$companyId/edit",
        params: { workspaceSlug, companyId: company.id },
      }),
    [navigate, workspaceSlug],
  );

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<string>()}</span>
        ),
      },
      {
        id: "industry",
        accessorKey: "industry",
        header: "Industry",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {getValue<string | null>() ?? <EmptyValue />}
          </span>
        ),
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => getValue<string | null>() ?? <EmptyValue />,
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        cell: ({ getValue }) => (
          <PhoneDisplay value={getValue<string | null>()} />
        ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => (
          <StopRowClick>
            <RowMenu
              label={`Actions for ${row.original.name}`}
              onEdit={() => openCompany(row.original)}
              onDelete={() => onDelete(row.original)}
            />
          </StopRowClick>
        ),
      },
    ],
    [onDelete, openCompany],
  );

  if (companies.length === 0) {
    return (
      <SectionCard>
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Add the businesses you work with to link contacts, quotes, and invoices to them."
          action={
            <Link
              to="/@{$workspaceSlug}/people/companies/new"
              params={{ workspaceSlug }}
              className={buttonVariants({ variant: "solid" })}
            >
              <Plus />
              Add company
            </Link>
          }
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard flush>
      <ListToolbar>
        <SearchInput
          label="Search companies"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </ListToolbar>

      <DataTable
        data={filteredCompanies}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        minWidth="640px"
        onRowClick={openCompany}
        rowLabel={(company) => `Open company ${company.name}`}
        renderMobileRow={(company) => (
          <div className="min-w-0">
            <p className="truncate font-medium text-sm">{company.name}</p>
            <p className="mt-0.5 truncate text-muted-foreground text-xs">
              {[company.industry, company.email].filter(Boolean).join(" · ") ||
                "No details yet"}
            </p>
          </div>
        )}
        emptyState={
          <EmptyState
            title="No companies match your search"
            action={
              <Button variant="outline" onClick={() => onSearchChange("")}>
                Clear search
              </Button>
            }
          />
        }
      />
    </SectionCard>
  );
};

type ContactTypeFilter = "all" | "internal" | "external";

const ContactsTable = ({
  people,
  search,
  navigate: routeNavigate,
  searchTerm,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
  onDelete,
}: {
  people: Person[];
  search: PeopleSearch;
  navigate: PeopleNavigate;
  searchTerm: string;
  typeFilter: ContactTypeFilter;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: ContactTypeFilter) => void;
  onDelete: (person: Person) => void;
}) => {
  const navigate = useNavigate();
  const workspaceSlug = useWorkspaceSlug();

  const [sorting, setSorting] = useUrlSort({
    search,
    defaultSorting: CONTACTS_DEFAULT_SORTING,
    navigate: routeNavigate,
  });

  const filteredPeople = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return people.filter((p) => {
      const matchesSearch =
        !term ||
        fullName(p).toLowerCase().includes(term) ||
        p.emails.some((e) => e.toLowerCase().includes(term)) ||
        (p.phone ?? "").toLowerCase().includes(term);

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "internal" && p.internal) ||
        (typeFilter === "external" && !p.internal);

      return matchesSearch && matchesType;
    });
  }, [people, searchTerm, typeFilter]);

  const internalCount = useMemo(
    () => people.filter((p) => p.internal).length,
    [people],
  );

  const openContact = useCallback(
    (person: Person) =>
      navigate({
        to: "/@{$workspaceSlug}/people/contacts/$contactId/edit",
        params: { workspaceSlug, contactId: person.id },
      }),
    [navigate, workspaceSlug],
  );

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: "lastName",
        accessorFn: (row) => `${row.lastName} ${row.firstName}`,
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">{fullName(row.original)}</span>
        ),
      },
      {
        id: "email",
        accessorFn: (row) => row.emails[0] ?? "",
        header: "Email",
        cell: ({ row }) => {
          const [first, ...rest] = row.original.emails;
          if (!first) return <EmptyValue />;
          if (rest.length === 0) return first;
          return (
            <span title={row.original.emails.join(", ")}>
              {first}{" "}
              <span className="tabular text-muted-foreground">
                +{rest.length}
              </span>
            </span>
          );
        },
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        cell: ({ getValue }) => (
          <PhoneDisplay value={getValue<string | null>()} />
        ),
      },
      {
        id: "internal",
        accessorKey: "internal",
        header: "Type",
        cell: ({ getValue }) => (
          <ContactTypeBadge internal={getValue<boolean>()} />
        ),
      },
      {
        id: "tags",
        accessorFn: (row) => row.tags?.join(", ") ?? "",
        header: "Tags",
        enableSorting: false,
        cell: ({ row }) =>
          row.original.tags?.length ? (
            <div className="flex flex-wrap gap-1">
              {row.original.tags.map((tag) => (
                <TagChip key={tag} tag={tag} />
              ))}
            </div>
          ) : (
            <EmptyValue>No tags</EmptyValue>
          ),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        enableSorting: false,
        meta: { align: "right" },
        cell: ({ row }) => {
          const person = row.original;
          return (
            <StopRowClick>
              <EmailAction emails={person.emails} name={fullName(person)} />
              <RowMenu
                label={`Actions for ${fullName(person)}`}
                onEdit={() => openContact(person)}
                onDelete={() => onDelete(person)}
              />
            </StopRowClick>
          );
        },
      },
    ],
    [onDelete, openContact],
  );

  if (people.length === 0) {
    return (
      <SectionCard>
        <EmptyState
          icon={Users}
          title="No contacts yet"
          description="Add the people you work with, then tag them and link them to companies."
          action={
            <Link
              to="/@{$workspaceSlug}/people/contacts/new"
              params={{ workspaceSlug }}
              className={buttonVariants({ variant: "solid" })}
            >
              <Plus />
              Add contact
            </Link>
          }
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard flush>
      <ListToolbar>
        <SegmentedControl<ContactTypeFilter>
          label="Filter by type"
          size="sm"
          value={typeFilter}
          onValueChange={onTypeFilterChange}
          options={[
            { value: "all", label: "All", count: people.length },
            { value: "internal", label: "Internal", count: internalCount },
            {
              value: "external",
              label: "External",
              count: people.length - internalCount,
            },
          ]}
        />
        <SearchInput
          label="Search contacts"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </ListToolbar>

      <DataTable
        data={filteredPeople}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        minWidth="760px"
        onRowClick={openContact}
        rowLabel={(person) => `Open contact ${fullName(person)}`}
        renderMobileRow={(person) => (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-sm">{fullName(person)}</p>
              <p className="mt-0.5 truncate text-muted-foreground text-xs">
                {person.emails[0] ?? "No email yet"}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-end gap-1">
              {person.tags?.length ? (
                <>
                  {person.tags.slice(0, 2).map((tag) => (
                    <TagChip key={tag} tag={tag} />
                  ))}
                  {person.tags.length > 2 && (
                    <span className="tabular self-center text-muted-foreground text-xs">
                      +{person.tags.length - 2}
                    </span>
                  )}
                </>
              ) : (
                <ContactTypeBadge internal={person.internal} />
              )}
            </div>
          </div>
        )}
        emptyState={
          <EmptyState
            title="No contacts match your filters"
            action={
              <Button
                variant="outline"
                onClick={() => {
                  onSearchChange("");
                  onTypeFilterChange("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        }
      />
    </SectionCard>
  );
};

const ContactTypeBadge = ({ internal }: { internal: boolean }) => (
  <StatusBadge
    status={internal ? "internal" : "external"}
    label={internal ? "Internal" : "External"}
    tone={internal ? "brand" : "neutral"}
  />
);

export const Route = createFileRoute("/_app/@{$workspaceSlug}/people/")({
  staticData: { title: "People" },
  component: PeoplePage,
  validateSearch: zodValidator(peopleListSearchSchema),
});
