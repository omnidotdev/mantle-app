import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Company, Person } from "../types";

// TODO: Migrate to database persistence via GraphQL API

type ActiveTab = "companies" | "contacts" | "network";

interface PeopleStore {
  companies: Company[];
  people: Person[];

  // Company CRUD
  createCompany: (
    company: Omit<Company, "id" | "createdAt" | "updatedAt" | "organizationId">,
    organizationId: string,
  ) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  getCompany: (id: string) => Company | undefined;
  getCompaniesForOrg: (orgId: string) => Company[];

  // Person CRUD
  createPerson: (
    person: Omit<Person, "id" | "createdAt" | "updatedAt" | "organizationId">,
    organizationId: string,
  ) => Person;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  getPerson: (id: string) => Person | undefined;
  getPeopleForOrg: (orgId: string) => Person[];

  // Bulk operations
  importPeople: (
    people: Omit<Person, "id" | "createdAt" | "updatedAt" | "organizationId">[],
    organizationId: string,
  ) => void;
  importCompanies: (
    companies: Omit<
      Company,
      "id" | "createdAt" | "updatedAt" | "organizationId"
    >[],
    organizationId: string,
  ) => void;
}

const usePeopleStore = create<PeopleStore>()(
  persist(
    (set, get) => ({
      companies: [],
      people: [],

      createCompany: (company, organizationId) => {
        const now = new Date().toISOString();
        const newCompany: Company = {
          ...company,
          id: crypto.randomUUID(),
          organizationId,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          companies: [...state.companies, newCompany],
        }));

        return newCompany;
      },

      updateCompany: (id, updates) => {
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id
              ? { ...c, ...updates, updatedAt: new Date().toISOString() }
              : c,
          ),
        }));
      },

      deleteCompany: (id) => {
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
        }));
      },

      getCompany: (id) => {
        return get().companies.find((c) => c.id === id);
      },

      getCompaniesForOrg: (orgId) =>
        get().companies.filter((c) => c.organizationId === orgId),

      createPerson: (person, organizationId) => {
        const now = new Date().toISOString();
        const newPerson: Person = {
          ...person,
          id: crypto.randomUUID(),
          organizationId,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          people: [...state.people, newPerson],
        }));

        return newPerson;
      },

      updatePerson: (id, updates) => {
        set((state) => ({
          people: state.people.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p,
          ),
        }));
      },

      deletePerson: (id) => {
        set((state) => ({
          people: state.people.filter((p) => p.id !== id),
        }));
      },

      getPerson: (id) => {
        return get().people.find((p) => p.id === id);
      },

      getPeopleForOrg: (orgId) =>
        get().people.filter((p) => p.organizationId === orgId),

      importPeople: (newPeople, organizationId) => {
        const now = new Date().toISOString();
        const created = newPeople.map((p) => ({
          ...p,
          id: crypto.randomUUID(),
          organizationId,
          createdAt: now,
          updatedAt: now,
        }));

        set((state) => ({
          people: [...state.people, ...created],
        }));
      },

      importCompanies: (newCompanies, organizationId) => {
        const now = new Date().toISOString();
        const created = newCompanies.map((c) => ({
          ...c,
          id: crypto.randomUUID(),
          organizationId,
          createdAt: now,
          updatedAt: now,
        }));

        set((state) => ({
          companies: [...state.companies, ...created],
        }));
      },
    }),
    {
      name: "mantle-people",
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>;

        // v0 → v1: email → emails[], add internal flag
        if (version === 0) {
          const people = (state.people as Record<string, unknown>[]) ?? [];
          state.people = people.map((p) => {
            const email = p.email as string | null;
            return {
              ...p,
              emails: email ? [email] : [],
              internal: false,
            };
          });
        }

        return state as unknown as PeopleStore;
      },
      // Only persist data, not UI state
      partialize: (state) => ({
        companies: state.companies,
        people: state.people,
      }),
    },
  ),
);

export { usePeopleStore };
export type { ActiveTab };
