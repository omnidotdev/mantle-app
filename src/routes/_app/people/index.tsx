import { Badge } from "@omnidotdev/thornberry/badge";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@omnidotdev/thornberry/tabs";
import { useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  Building2,
  Edit,
  Loader2,
  Mail,
  Network,
  Plus,
  Search,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import ConfirmDialog from "@/components/ui/confirm-dialog";
import { DataTable } from "@/components/ui/data-table";
import ImportExportDialog from "@/features/people/components/ImportExportDialog";
import NetworkSection from "@/features/people/components/NetworkSection";
import { peopleListSearchSchema } from "@/features/people/searchParams";
import {
  useAllCompaniesQuery,
  useAllPeopleQuery,
  useDeleteCompanyMutation,
  useDeletePersonMutation,
} from "@/generated/graphql";
import { useUrlSort } from "@/lib/hooks/util/useUrlSort";

import type { ColumnDef, SortingState } from "@tanstack/react-table";
import type { ActiveTab } from "@/features/people/store/peopleStore";
import type { Company, Person } from "@/features/people/types";

const COMPANIES_DEFAULT_SORTING: SortingState = [{ id: "name", desc: false }];
const CONTACTS_DEFAULT_SORTING: SortingState = [
  { id: "lastName", desc: false },
];

const PeoplePage = () => {
  const { organizationId } = Route.useRouteContext();
  const search = Route.useSearch();
  const { tab: activeTab, search: searchTerm, type: typeFilter } = search;
  const navigate = Route.useNavigate();
  const queryClient = useQueryClient();

  const [importExportOpen, setImportExportOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    type: "company" | "contact";
  }>({ open: false, id: "", type: "company" });

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
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">
          Select an organization to view people
        </p>
      </div>
    );
  }

  if (companiesLoading || peopleLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-muted-foreground"
          aria-label="Loading people"
        />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-xl">People</h1>
          <p className="mt-1 text-muted-foreground text-sm">
            {companies.length}{" "}
            {companies.length === 1 ? "company" : "companies"}
            {" · "}
            {people.length} {people.length === 1 ? "contact" : "contacts"}
          </p>
        </div>
        <div
          className={`flex gap-2 ${activeTab === "network" ? "invisible" : ""}`}
        >
          <button
            type="button"
            onClick={() => setImportExportOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-input px-3 py-1.5 text-sm hover:bg-muted"
          >
            <Share2 size={16} />
            Import/Export
          </button>
          <Link
            to={
              activeTab === "companies"
                ? "/people/companies/new"
                : "/people/contacts/new"
            }
            className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm text-white hover:bg-primary-700"
          >
            <Plus size={16} />
            {activeTab === "companies" ? "Add Company" : "Add Contact"}
          </Link>
        </div>
      </div>

      <TabsRoot
        value={activeTab}
        onValueChange={(details) =>
          navigate({
            search: (prev) => ({
              ...prev,
              tab: details.value as ActiveTab,
              sort_by: undefined,
              sort_dir: undefined,
            }),
          })
        }
      >
        <TabsList className="mb-4">
          <TabsTrigger value="companies" className="flex items-center gap-2">
            <Building2 size={16} />
            Companies
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users size={16} />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Network size={16} />
            Network
          </TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          {activeTab === "companies" && (
            <CompaniesTable
              companies={companies}
              search={search}
              navigate={navigate}
              onDelete={(id) =>
                setDeleteConfirm({ open: true, id, type: "company" })
              }
            />
          )}
        </TabsContent>

        <TabsContent value="contacts">
          {activeTab === "contacts" && (
            <ContactsTable
              people={people}
              search={search}
              navigate={navigate}
              searchTerm={searchTerm}
              typeFilter={typeFilter}
              onSearchChange={(value) =>
                navigate({ search: (prev) => ({ ...prev, search: value }) })
              }
              onTypeFilterChange={(value) =>
                navigate({ search: (prev) => ({ ...prev, type: value }) })
              }
              onDelete={(id) =>
                setDeleteConfirm({ open: true, id, type: "contact" })
              }
            />
          )}
        </TabsContent>

        <TabsContent value="network">
          {activeTab === "network" && <NetworkSection people={people} />}
        </TabsContent>
      </TabsRoot>

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
        title={`Delete ${deleteConfirm.type === "company" ? "Company" : "Contact"}`}
        description="Are you sure you want to delete this record? This action cannot be undone."
        onConfirm={() => {
          if (deleteConfirm.type === "company") {
            deleteCompanyMutation.mutate(
              { input: { rowId: deleteConfirm.id } },
              {
                onError: (err) =>
                  toast.error(
                    err instanceof Error
                      ? err.message
                      : "Failed to delete company",
                  ),
              },
            );
          } else {
            deletePersonMutation.mutate(
              { input: { rowId: deleteConfirm.id } },
              {
                onError: (err) =>
                  toast.error(
                    err instanceof Error
                      ? err.message
                      : "Failed to delete contact",
                  ),
              },
            );
          }
        }}
      />
    </div>
  );
};

type PeopleSearch = ReturnType<typeof Route.useSearch>;
type PeopleNavigate = ReturnType<typeof Route.useNavigate>;

const CompaniesTable = ({
  companies,
  search,
  navigate: routeNavigate,
  onDelete,
}: {
  companies: Company[];
  search: PeopleSearch;
  navigate: PeopleNavigate;
  onDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();

  const [sorting, setSorting] = useUrlSort({
    search,
    defaultSorting: COMPANIES_DEFAULT_SORTING,
    navigate: routeNavigate,
  });

  const columns = useMemo<ColumnDef<Company>[]>(
    () => [
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const company = row.original;
          return (
            <div
              className="flex gap-2"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="presentation"
            >
              <Link
                to="/people/companies/$companyId/edit"
                params={{ companyId: company.id }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Edit company"
              >
                <Edit size={16} />
              </Link>
              <button
                type="button"
                onClick={() => onDelete(company.id)}
                className="text-destructive hover:text-destructive/90"
                aria-label="Delete company"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
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
        cell: ({ getValue }) => getValue<string | null>() ?? "—",
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        cell: ({ getValue }) => getValue<string | null>() ?? "—",
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        cell: ({ getValue }) => getValue<string | null>() ?? "—",
      },
    ],
    [onDelete],
  );

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <DataTable
        data={companies}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        minWidth="600px"
        onRowClick={(company) =>
          navigate({
            to: "/people/companies/$companyId/edit",
            params: { companyId: company.id },
          })
        }
        emptyState={
          <div className="rounded-lg border-2 border-border border-dashed py-12 text-center">
            <Building2
              size={32}
              className="mx-auto mb-2 text-muted-foreground"
            />
            <p className="mb-4 text-muted-foreground">No companies yet</p>
            <Link
              to="/people/companies/new"
              className="text-primary-600 hover:text-primary-700"
            >
              Add your first company
            </Link>
          </div>
        }
      />
    </div>
  );
};

const EmailActionButton = ({
  emails,
  name,
}: {
  emails: string[];
  name: string;
}) => {
  const [open, setOpen] = useState(false);

  if (emails.length === 1) {
    return (
      <a
        href={`mailto:${emails[0]}?subject=${encodeURIComponent(`Hello ${name}`)}`}
        className="text-muted-foreground hover:text-foreground"
        aria-label={`Email ${emails[0]}`}
      >
        <Mail size={16} />
      </a>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Send email"
      >
        <Mail size={16} />
      </button>
      {open && (
        <>
          <div
            role="presentation"
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 min-w-48 rounded-lg border border-border bg-card py-1 shadow-lg">
            {emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}?subject=${encodeURIComponent(`Hello ${name}`)}`}
                className="block px-4 py-2 text-foreground text-sm hover:bg-muted"
                onClick={() => setOpen(false)}
              >
                {email}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

type ContactTypeFilter = "all" | "internal" | "external";

const TYPE_BUTTONS: { value: ContactTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
];

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
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: ContactTypeFilter) => void;
  onDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();

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
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(term) ||
        p.emails.some((e) => e.toLowerCase().includes(term)) ||
        (p.phone ?? "").toLowerCase().includes(term);

      const matchesType =
        typeFilter === "all" ||
        (typeFilter === "internal" && p.internal) ||
        (typeFilter === "external" && !p.internal);

      return matchesSearch && matchesType;
    });
  }, [people, searchTerm, typeFilter]);

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
          const person = row.original;
          return (
            <div
              className="flex gap-2"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="presentation"
            >
              {person.emails.length > 0 && (
                <EmailActionButton
                  emails={person.emails}
                  name={`${person.firstName} ${person.lastName}`}
                />
              )}
              <Link
                to="/people/contacts/$contactId/edit"
                params={{ contactId: person.id }}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Edit contact"
              >
                <Edit size={16} />
              </Link>
              <button
                type="button"
                onClick={() => onDelete(person.id)}
                className="text-destructive hover:text-destructive/90"
                aria-label="Delete contact"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        },
      },
      {
        id: "lastName",
        accessorFn: (row) => `${row.lastName} ${row.firstName}`,
        header: "Name",
        cell: ({ row }) => (
          <span className="font-medium">
            {row.original.firstName} {row.original.lastName}
          </span>
        ),
      },
      {
        id: "email",
        accessorFn: (row) => row.emails[0] ?? "",
        header: "Email",
        cell: ({ row }) => {
          const emails = row.original.emails;
          if (emails.length === 0) return "—";
          if (emails.length === 1) return emails[0];
          return (
            <span title={emails.join(", ")}>
              {emails[0]}{" "}
              <span className="text-muted-foreground">
                +{emails.length - 1}
              </span>
            </span>
          );
        },
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Phone",
        cell: ({ getValue }) => getValue<string | null>() ?? "—",
      },
      {
        id: "internal",
        accessorKey: "internal",
        header: "Type",
        cell: ({ getValue }) => {
          const internal = getValue<boolean>();
          return (
            <Badge variant={internal ? "solid" : "outline"} className="text-xs">
              {internal ? "Internal" : "External"}
            </Badge>
          );
        },
      },
      {
        id: "tags",
        accessorFn: (row) => row.tags?.join(", ") ?? "",
        header: "Tags",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.tags?.length ? (
              row.original.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">{"—"}</span>
            )}
          </div>
        ),
      },
    ],
    [onDelete],
  );

  if (people.length === 0) {
    return (
      <div className="rounded-lg border-2 border-border border-dashed py-12 text-center">
        <Users size={32} className="mx-auto mb-2 text-muted-foreground" />
        <p className="mb-4 text-muted-foreground">No contacts yet</p>
        <Link
          to="/people/contacts/new"
          className="text-primary-600 hover:text-primary-700"
        >
          Add your first contact
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <div className="flex min-w-[700px] items-center gap-4 border-border border-b p-4">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search contacts..."
            aria-label="Search contacts"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-input py-2 pr-4 pl-9 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="inline-flex rounded-lg border border-border bg-muted p-1">
          {TYPE_BUTTONS.map((btn) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => onTypeFilterChange(btn.value)}
              className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
                typeFilter === btn.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <DataTable
        data={filteredPeople}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
        minWidth="700px"
        onRowClick={(person) =>
          navigate({
            to: "/people/contacts/$contactId/edit",
            params: { contactId: person.id },
          })
        }
        emptyState={
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No contacts match your filters
            </p>
            <button
              type="button"
              onClick={() => {
                onSearchChange("");
                onTypeFilterChange("all");
              }}
              className="mt-2 text-primary-600 text-sm hover:text-primary-700"
            >
              Clear filters
            </button>
          </div>
        }
      />
    </div>
  );
};

export const Route = createFileRoute("/_app/people/")({
  component: PeoplePage,
  validateSearch: zodValidator(peopleListSearchSchema),
});
