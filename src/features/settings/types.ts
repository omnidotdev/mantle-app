type OrganizationProfile = {
  id: string;
  organizationId: string;
  companyName: string;
  contactName: string;
  contactTitle: string | null;
  email: string;
  phone: string | null;
  website: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  logoUrl: string | null;
  registrationState: string | null;
  createdAt: string;
  updatedAt: string;
};

export type { OrganizationProfile };
