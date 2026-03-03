import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
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

import { Badge } from "@/components/ui/badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@/components/ui/tabs";
import CompanyForm from "@/features/people/components/CompanyForm";
import ContactForm from "@/features/people/components/ContactForm";
import ImportExportDialog from "@/features/people/components/ImportExportDialog";
import NetworkSection from "@/features/people/components/NetworkSection";
import {
  useAllCompaniesQuery,
  useAllPeopleQuery,
  useCreateCompanyMutation,
  useCreatePersonMutation,
  useDeleteCompanyMutation,
  useDeletePersonMutation,
  useUpdateCompanyMutation,
  useUpdatePersonMutation,
} from "@/generated/graphql";

import type { ActiveTab } from "@/features/people/store/peopleStore";
import type { Company, Person } from "@/features/people/types";

type ViewMode = "list" | "create" | "edit";

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

const defaultPerson: Partial<Person> = {
  firstName: "",
  lastName: "",
  emails: [],
  phone: null,
  avatarUrl: null,
  tags: null,
  internal: false,
  notes: null,
};

const PeoplePage = () => {
  const { organizationId } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<ActiveTab>("companies");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentCompany, setCurrentCompany] =
    useState<Partial<Company>>(defaultCompany);
  const [currentPerson, setCurrentPerson] =
    useState<Partial<Person>>(defaultPerson);
  const [importExportOpen, setImportExportOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const createCompanyMutation = useCreateCompanyMutation();
  const updateCompanyMutation = useUpdateCompanyMutation();
  const deleteCompanyMutation = useDeleteCompanyMutation({
    onSuccess: invalidateCompanies,
  });

  const createPersonMutation = useCreatePersonMutation();
  const updatePersonMutation = useUpdatePersonMutation();
  const deletePersonMutation = useDeletePersonMutation({
    onSuccess: invalidatePeople,
  });

  if (!organizationId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-500">Select an organization to view people</p>
      </div>
    );
  }

  if (companiesLoading || peopleLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2
          className="h-8 w-8 animate-spin text-gray-400"
          aria-label="Loading people"
        />
      </div>
    );
  }

  // Company handlers
  const handleCreateCompany = () => {
    setCurrentCompany({ ...defaultCompany });
    setEditingId(null);
    setViewMode("create");
  };

  const handleEditCompany = (company: Company) => {
    setCurrentCompany(company);
    setEditingId(company.id);
    setViewMode("edit");
  };

  const handleSaveCompany = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updateCompanyMutation.mutateAsync({
          input: {
            rowId: editingId,
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
      } else {
        const result = await createCompanyMutation.mutateAsync({
          input: {
            company: {
              organizationId,
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
        if (newId) {
          setEditingId(newId);
          setViewMode("edit");
        }
      }
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

  const handleDeleteCompany = (id: string) => {
    setDeleteConfirm({ open: true, id, type: "company" });
  };

  // Contact handlers
  const handleCreateContact = () => {
    setCurrentPerson({ ...defaultPerson });
    setEditingId(null);
    setViewMode("create");
  };

  const handleEditContact = (person: Person) => {
    setCurrentPerson(person);
    setEditingId(person.id);
    setViewMode("edit");
  };

  const handleSaveContact = async () => {
    setSaving(true);
    try {
      if (editingId) {
        await updatePersonMutation.mutateAsync({
          input: {
            rowId: editingId,
            patch: {
              firstName: currentPerson.firstName,
              lastName: currentPerson.lastName,
              emails: currentPerson.emails,
              phone: currentPerson.phone,
              avatarUrl: currentPerson.avatarUrl,
              tags: currentPerson.tags,
              internal: currentPerson.internal,
              notes: currentPerson.notes,
            },
          },
        });
      } else {
        const result = await createPersonMutation.mutateAsync({
          input: {
            person: {
              organizationId,
              firstName: currentPerson.firstName ?? "",
              lastName: currentPerson.lastName ?? "",
              emails: currentPerson.emails ?? [],
              phone: currentPerson.phone ?? null,
              avatarUrl: currentPerson.avatarUrl ?? null,
              tags: currentPerson.tags ?? null,
              internal: currentPerson.internal ?? false,
              notes: currentPerson.notes ?? null,
            },
          },
        });

        const newId = result.createPerson?.person?.rowId;
        if (newId) {
          setEditingId(newId);
          setViewMode("edit");
        }
      }
      invalidatePeople();
      toast.success("Contact saved");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save contact",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = (id: string) => {
    setDeleteConfirm({ open: true, id, type: "contact" });
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingId(null);
  };

  // Create/edit views
  if (viewMode === "create" || viewMode === "edit") {
    const isCompanyForm = activeTab === "companies";
    const title = isCompanyForm
      ? editingId
        ? "Edit Company"
        : "New Company"
      : editingId
        ? "Edit Contact"
        : "New Contact";

    return (
      <div className="p-6">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1 text-gray-500 text-sm hover:text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 font-semibold text-lg">{title}</h2>

          {isCompanyForm ? (
            <CompanyForm
              company={currentCompany}
              onCompanyChange={setCurrentCompany}
              onSave={handleSaveCompany}
              onCancel={handleCancel}
              saving={saving}
            />
          ) : (
            <ContactForm
              person={currentPerson}
              onPersonChange={setCurrentPerson}
              onSave={handleSaveContact}
              onCancel={handleCancel}
              saving={saving}
            />
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-semibold text-xl">People</h1>
        <div className="flex gap-2">
          {activeTab !== "network" && (
            <button
              type="button"
              onClick={() => setImportExportOpen(true)}
              className="flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
            >
              <Share2 size={16} />
              Import/Export
            </button>
          )}
          {activeTab !== "network" && (
            <button
              type="button"
              onClick={
                activeTab === "companies"
                  ? handleCreateCompany
                  : handleCreateContact
              }
              className="flex items-center gap-1.5 rounded-md bg-teal-600 px-3 py-1.5 text-sm text-white hover:bg-teal-700"
            >
              <Plus size={16} />
              {activeTab === "companies" ? "Add Company" : "Add Contact"}
            </button>
          )}
        </div>
      </div>

      <TabsRoot
        value={activeTab}
        onValueChange={(details) => setActiveTab(details.value as ActiveTab)}
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
          <CompaniesTable
            companies={companies}
            onEdit={handleEditCompany}
            onDelete={handleDeleteCompany}
            onCreateNew={handleCreateCompany}
          />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsTable
            people={people}
            onEdit={handleEditContact}
            onDelete={handleDeleteContact}
            onCreateNew={handleCreateContact}
          />
        </TabsContent>

        <TabsContent value="network">
          <NetworkSection people={people} />
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

// Companies table sub-component
const CompaniesTable = ({
  companies,
  onEdit,
  onDelete,
  onCreateNew,
}: {
  companies: Company[];
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}) => {
  if (companies.length === 0) {
    return (
      <div className="rounded-lg border-2 border-gray-200 border-dashed py-12 text-center">
        <Building2 size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="mb-4 text-gray-500">No companies yet</p>
        <button
          type="button"
          onClick={onCreateNew}
          className="text-teal-600 hover:text-teal-700"
        >
          Add your first company
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Name
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Industry
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Email
            </th>
            <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
              Phone
            </th>
            <th className="px-4 py-3 text-right font-medium text-gray-700 text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr
              key={company.id}
              className="cursor-pointer border-gray-100 border-t hover:bg-gray-50"
              onClick={() => onEdit(company)}
            >
              <td className="px-4 py-3 font-medium text-sm">{company.name}</td>
              <td className="px-4 py-3 text-gray-600 text-sm">
                {company.industry ?? "\u2014"}
              </td>
              <td className="px-4 py-3 text-gray-600 text-sm">
                {company.email ?? "\u2014"}
              </td>
              <td className="px-4 py-3 text-gray-600 text-sm">
                {company.phone ?? "\u2014"}
              </td>
              <td
                className="px-4 py-3 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(company)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label="Edit company"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(company.id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Delete company"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Email action dropdown
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
        className="text-gray-500 hover:text-gray-700"
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
        className="text-gray-500 hover:text-gray-700"
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
          <div className="absolute right-0 z-20 mt-1 min-w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            {emails.map((email) => (
              <a
                key={email}
                href={`mailto:${email}?subject=${encodeURIComponent(`Hello ${name}`)}`}
                className="block px-4 py-2 text-gray-700 text-sm hover:bg-gray-50"
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

// Contacts table sub-component
type ContactTypeFilter = "all" | "internal" | "external";

const TYPE_BUTTONS: { value: ContactTypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "internal", label: "Internal" },
  { value: "external", label: "External" },
];

const ContactsTable = ({
  people,
  onEdit,
  onDelete,
  onCreateNew,
}: {
  people: Person[];
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<ContactTypeFilter>("all");

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

  if (people.length === 0) {
    return (
      <div className="rounded-lg border-2 border-gray-200 border-dashed py-12 text-center">
        <Users size={32} className="mx-auto mb-2 text-gray-400" />
        <p className="mb-4 text-gray-500">No contacts yet</p>
        <button
          type="button"
          onClick={onCreateNew}
          className="text-teal-600 hover:text-teal-700"
        >
          Add your first contact
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center gap-4 border-gray-200 border-b p-4">
        <div className="relative flex-1">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search contacts..."
            aria-label="Search contacts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
          {TYPE_BUTTONS.map((btn) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => setTypeFilter(btn.value)}
              className={`rounded-md px-3 py-1.5 font-medium text-sm transition-colors ${
                typeFilter === btn.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {filteredPeople.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">No contacts match your filters</p>
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setTypeFilter("all");
            }}
            className="mt-2 text-sm text-teal-600 hover:text-teal-700"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                Name
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                Phone
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                Type
              </th>
              <th className="px-4 py-3 text-left font-medium text-gray-700 text-sm">
                Tags
              </th>
              <th className="px-4 py-3 text-right font-medium text-gray-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPeople.map((person) => (
              <tr
                key={person.id}
                className="cursor-pointer border-gray-100 border-t hover:bg-gray-50"
                onClick={() => onEdit(person)}
              >
                <td className="px-4 py-3 font-medium text-sm">
                  {person.firstName} {person.lastName}
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {person.emails.length > 0 ? (
                    person.emails.length === 1 ? (
                      person.emails[0]
                    ) : (
                      <span title={person.emails.join(", ")}>
                        {person.emails[0]}{" "}
                        <span className="text-gray-400">
                          +{person.emails.length - 1}
                        </span>
                      </span>
                    )
                  ) : (
                    "\u2014"
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {person.phone ?? "\u2014"}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={person.internal ? "solid" : "outline"}
                    className="text-xs"
                  >
                    {person.internal ? "Internal" : "External"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {person.tags?.length ? (
                      person.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">{"\u2014"}</span>
                    )}
                  </div>
                </td>
                <td
                  className="px-4 py-3 text-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-end gap-2">
                    {person.emails.length > 0 && (
                      <EmailActionButton
                        emails={person.emails}
                        name={`${person.firstName} ${person.lastName}`}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => onEdit(person)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Edit contact"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(person.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete contact"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export const Route = createFileRoute("/_auth/people/")({
  component: PeoplePage,
});
