import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Edit,
  Network,
  Plus,
  Share2,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
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
import { usePeopleStore } from "@/features/people/store/peopleStore";

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
  const {
    companies,
    people,
    createCompany,
    updateCompany,
    deleteCompany,
    createPerson,
    updatePerson,
    deletePerson,
  } = usePeopleStore();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [activeTab, setActiveTab] = useState<ActiveTab>("companies");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentCompany, setCurrentCompany] =
    useState<Partial<Company>>(defaultCompany);
  const [currentPerson, setCurrentPerson] =
    useState<Partial<Person>>(defaultPerson);
  const [importExportOpen, setImportExportOpen] = useState(false);

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

  const handleSaveCompany = () => {
    if (editingId) {
      updateCompany(editingId, currentCompany);
    } else {
      createCompany({
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
      });
    }
    setViewMode("list");
    setEditingId(null);
  };

  const handleDeleteCompany = (id: string) => {
    if (confirm("Delete this company?")) {
      deleteCompany(id);
    }
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

  const handleSaveContact = () => {
    if (editingId) {
      updatePerson(editingId, currentPerson);
    } else {
      createPerson({
        firstName: currentPerson.firstName ?? "",
        lastName: currentPerson.lastName ?? "",
        emails: currentPerson.emails ?? [],
        phone: currentPerson.phone ?? null,
        avatarUrl: currentPerson.avatarUrl ?? null,
        tags: currentPerson.tags ?? null,
        internal: currentPerson.internal ?? false,
        notes: currentPerson.notes ?? null,
      });
    }
    setViewMode("list");
    setEditingId(null);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm("Delete this contact?")) {
      deletePerson(id);
    }
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
      <div className="mx-auto max-w-6xl p-8">
        <div className="mb-6">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to list
          </button>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-6 font-bold text-xl">{title}</h2>

          {isCompanyForm ? (
            <CompanyForm
              company={currentCompany}
              onCompanyChange={setCurrentCompany}
              onSave={handleSaveCompany}
              onCancel={handleCancel}
            />
          ) : (
            <ContactForm
              person={currentPerson}
              onPersonChange={setCurrentPerson}
              onSave={handleSaveContact}
              onCancel={handleCancel}
            />
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to="/dashboard"
            className="text-gray-500 text-sm hover:text-gray-700"
          >
            &larr; Back
          </Link>
          <h1 className="font-bold text-2xl">People</h1>
        </div>
        <div className="flex gap-2">
          {activeTab !== "network" && (
            <button
              type="button"
              onClick={() => setImportExportOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50"
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
              className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
            >
              <Plus size={18} />
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
            <tr key={company.id} className="border-gray-100 border-t">
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
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(company)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(company.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
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

// Contacts table sub-component
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
          {people.map((person) => (
            <tr key={person.id} className="border-gray-100 border-t">
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
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">{"\u2014"}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(person)}
                    className="text-gray-500 hover:text-gray-700"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(person.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete"
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

export const Route = createFileRoute("/_auth/people/")({
  component: PeoplePage,
});
