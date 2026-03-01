export interface Company {
  id: string;
  organizationId: string;
  name: string;
  website: string | null;
  industry: string | null;
  phone: string | null;
  email: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  tags: string[] | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyMember {
  id: string;
  companyId: string;
  personId: string;
  title: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export const COMMON_TAGS = [
  "employee",
  "client",
  "prospect",
  "active",
  "inactive",
  "design",
  "engineering",
  "research",
  "leadership",
  "contractor",
] as const;

export type CommonTag = (typeof COMMON_TAGS)[number];
