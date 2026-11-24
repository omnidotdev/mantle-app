// @ts-nocheck
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useInfiniteQuery, useSuspenseInfiniteQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseInfiniteQueryOptions, InfiniteData, UseSuspenseInfiniteQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { graphqlFetch } from '@/lib/graphql/graphqlFetch';
export type ApplyInvoiceCreditInput = {
  amount: string;
  invoiceId: string;
  note?: string | null | undefined;
};

/** An input for mutations affecting `Company` */
export type CompanyInput = {
  addressLine1?: string | null | undefined;
  addressLine2?: string | null | undefined;
  city?: string | null | undefined;
  country?: string | null | undefined;
  createdAt?: Date | null | undefined;
  email?: string | null | undefined;
  industry?: string | null | undefined;
  name: string;
  notes?: string | null | undefined;
  organizationId: string;
  phone?: string | null | undefined;
  postalCode?: string | null | undefined;
  rowId?: string | null | undefined;
  state?: string | null | undefined;
  updatedAt?: Date | null | undefined;
  website?: string | null | undefined;
};

/** An input for mutations affecting `CompanyMember` */
export type CompanyMemberInput = {
  companyId: string;
  createdAt?: Date | null | undefined;
  isPrimary?: boolean | null | undefined;
  personId: string;
  rowId?: string | null | undefined;
  title?: string | null | undefined;
};

/** Represents an update to a `CompanyMember`. Fields that are set will be updated. */
export type CompanyMemberPatch = {
  companyId?: string | null | undefined;
  createdAt?: Date | null | undefined;
  isPrimary?: boolean | null | undefined;
  personId?: string | null | undefined;
  rowId?: string | null | undefined;
  title?: string | null | undefined;
};

/** Represents an update to a `Company`. Fields that are set will be updated. */
export type CompanyPatch = {
  addressLine1?: string | null | undefined;
  addressLine2?: string | null | undefined;
  city?: string | null | undefined;
  country?: string | null | undefined;
  createdAt?: Date | null | undefined;
  email?: string | null | undefined;
  industry?: string | null | undefined;
  name?: string | null | undefined;
  notes?: string | null | undefined;
  organizationId?: string | null | undefined;
  phone?: string | null | undefined;
  postalCode?: string | null | undefined;
  rowId?: string | null | undefined;
  state?: string | null | undefined;
  updatedAt?: Date | null | undefined;
  website?: string | null | undefined;
};

export type ConvertQuoteToInvoiceInput = {
  quoteId: string;
};

/** All input for the create `Company` mutation. */
export type CreateCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `Company` to be created by this mutation. */
  company: CompanyInput;
};

/** All input for the create `CompanyMember` mutation. */
export type CreateCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `CompanyMember` to be created by this mutation. */
  companyMember: CompanyMemberInput;
};

/** All input for the create `DocumentNumberingConfig` mutation. */
export type CreateDocumentNumberingConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `DocumentNumberingConfig` to be created by this mutation. */
  documentNumberingConfig: DocumentNumberingConfigInput;
};

/** All input for the create `InventoryAdjustment` mutation. */
export type CreateInventoryAdjustmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `InventoryAdjustment` to be created by this mutation. */
  inventoryAdjustment: InventoryAdjustmentInput;
};

/** All input for the create `Invoice` mutation. */
export type CreateInvoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `Invoice` to be created by this mutation. */
  invoice: InvoiceInput;
};

/** All input for the create `InvoiceLineItem` mutation. */
export type CreateInvoiceLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `InvoiceLineItem` to be created by this mutation. */
  invoiceLineItem: InvoiceLineItemInput;
};

/** All input for the create `OrganizationSetting` mutation. */
export type CreateOrganizationSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `OrganizationSetting` to be created by this mutation. */
  organizationSetting: OrganizationSettingInput;
};

/** All input for the create `Payment` mutation. */
export type CreatePaymentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `Payment` to be created by this mutation. */
  payment: PaymentInput;
};

/** All input for the create `Person` mutation. */
export type CreatePersonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `Person` to be created by this mutation. */
  person: PersonInput;
};

/** All input for the create `Product` mutation. */
export type CreateProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `Product` to be created by this mutation. */
  product: ProductInput;
};

/** All input for the create `Quote` mutation. */
export type CreateQuoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `Quote` to be created by this mutation. */
  quote: QuoteInput;
};

/** All input for the create `QuoteLineItem` mutation. */
export type CreateQuoteLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `QuoteLineItem` to be created by this mutation. */
  quoteLineItem: QuoteLineItemInput;
};

/** All input for the `deleteCompany` mutation. */
export type DeleteCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deleteCompanyMember` mutation. */
export type DeleteCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deleteDocumentNumberingConfig` mutation. */
export type DeleteDocumentNumberingConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deleteInvoice` mutation. */
export type DeleteInvoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deleteInvoiceLineItem` mutation. */
export type DeleteInvoiceLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deletePayment` mutation. */
export type DeletePaymentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deletePerson` mutation. */
export type DeletePersonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deleteProduct` mutation. */
export type DeleteProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deleteQuote` mutation. */
export type DeleteQuoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** All input for the `deleteQuoteLineItem` mutation. */
export type DeleteQuoteLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  rowId: string;
};

/** An input for mutations affecting `DocumentNumberingConfig` */
export type DocumentNumberingConfigInput = {
  companyId?: string | null | undefined;
  createdAt?: Date | null | undefined;
  dateFormat?: string | null | undefined;
  documentType: string;
  globalPrefix?: string | null | undefined;
  idStrategy?: string | null | undefined;
  nextSequentialNumber?: number | null | undefined;
  organizationId: string;
  prefix?: string | null | undefined;
  randomLength?: number | null | undefined;
  rowId?: string | null | undefined;
  separator?: string | null | undefined;
  sequentialPadding?: number | null | undefined;
  updatedAt?: Date | null | undefined;
};

/** Represents an update to a `DocumentNumberingConfig`. Fields that are set will be updated. */
export type DocumentNumberingConfigPatch = {
  companyId?: string | null | undefined;
  createdAt?: Date | null | undefined;
  dateFormat?: string | null | undefined;
  documentType?: string | null | undefined;
  globalPrefix?: string | null | undefined;
  idStrategy?: string | null | undefined;
  nextSequentialNumber?: number | null | undefined;
  organizationId?: string | null | undefined;
  prefix?: string | null | undefined;
  randomLength?: number | null | undefined;
  rowId?: string | null | undefined;
  separator?: string | null | undefined;
  sequentialPadding?: number | null | undefined;
  updatedAt?: Date | null | undefined;
};

export type GenerateDocumentNumberInput = {
  companyId?: string | null | undefined;
  documentType: string;
  idStrategy?: string | null | undefined;
  organizationId: string;
};

/** An input for mutations affecting `InventoryAdjustment` */
export type InventoryAdjustmentInput = {
  createdAt?: Date | null | undefined;
  productId: string;
  quantityChange: number;
  reason: string;
  referenceId?: string | null | undefined;
  rowId?: string | null | undefined;
};

/** An input for mutations affecting `Invoice` */
export type InvoiceInput = {
  billTo?: string | null | undefined;
  companyId?: string | null | undefined;
  contactId?: string | null | undefined;
  createdAt?: Date | null | undefined;
  currency?: string | null | undefined;
  dueDate?: Date | null | undefined;
  invoiceNumber: string;
  issueDate: Date;
  notes?: string | null | undefined;
  organizationId: string;
  paidAt?: Date | null | undefined;
  paymentLinkUrl?: string | null | undefined;
  paymentReference?: string | null | undefined;
  rowId?: string | null | undefined;
  status?: string | null | undefined;
  subtotal?: string | null | undefined;
  taxAmount?: string | null | undefined;
  taxRate?: string | null | undefined;
  total?: string | null | undefined;
  updatedAt?: Date | null | undefined;
};

/** An input for mutations affecting `InvoiceLineItem` */
export type InvoiceLineItemInput = {
  amount: string;
  description: string;
  invoiceId: string;
  productId?: string | null | undefined;
  quantity: string;
  rowId?: string | null | undefined;
  sortOrder?: number | null | undefined;
  unitPrice: string;
};

/** Represents an update to a `Invoice`. Fields that are set will be updated. */
export type InvoicePatch = {
  billTo?: string | null | undefined;
  companyId?: string | null | undefined;
  contactId?: string | null | undefined;
  createdAt?: Date | null | undefined;
  currency?: string | null | undefined;
  dueDate?: Date | null | undefined;
  invoiceNumber?: string | null | undefined;
  issueDate?: Date | null | undefined;
  notes?: string | null | undefined;
  organizationId?: string | null | undefined;
  paidAt?: Date | null | undefined;
  paymentLinkUrl?: string | null | undefined;
  paymentReference?: string | null | undefined;
  rowId?: string | null | undefined;
  status?: string | null | undefined;
  subtotal?: string | null | undefined;
  taxAmount?: string | null | undefined;
  taxRate?: string | null | undefined;
  total?: string | null | undefined;
  updatedAt?: Date | null | undefined;
};

/** An input for mutations affecting `OrganizationSetting` */
export type OrganizationSettingInput = {
  accentColor?: string | null | undefined;
  addressLine1?: string | null | undefined;
  addressLine2?: string | null | undefined;
  city?: string | null | undefined;
  companyName?: string | null | undefined;
  contactName?: string | null | undefined;
  contactTitle?: string | null | undefined;
  country?: string | null | undefined;
  createdAt?: Date | null | undefined;
  email?: string | null | undefined;
  logoUrl?: string | null | undefined;
  organizationId: string;
  phone?: string | null | undefined;
  postalCode?: string | null | undefined;
  registrationState?: string | null | undefined;
  rowId?: string | null | undefined;
  state?: string | null | undefined;
  updatedAt?: Date | null | undefined;
  website?: string | null | undefined;
};

/** Represents an update to a `OrganizationSetting`. Fields that are set will be updated. */
export type OrganizationSettingPatch = {
  accentColor?: string | null | undefined;
  addressLine1?: string | null | undefined;
  addressLine2?: string | null | undefined;
  city?: string | null | undefined;
  companyName?: string | null | undefined;
  contactName?: string | null | undefined;
  contactTitle?: string | null | undefined;
  country?: string | null | undefined;
  createdAt?: Date | null | undefined;
  email?: string | null | undefined;
  logoUrl?: string | null | undefined;
  organizationId?: string | null | undefined;
  phone?: string | null | undefined;
  postalCode?: string | null | undefined;
  registrationState?: string | null | undefined;
  rowId?: string | null | undefined;
  state?: string | null | undefined;
  updatedAt?: Date | null | undefined;
  website?: string | null | undefined;
};

/** An input for mutations affecting `Payment` */
export type PaymentInput = {
  amount: string;
  invoiceId: string;
  method?: string | null | undefined;
  paidAt: Date;
  reference?: string | null | undefined;
  rowId?: string | null | undefined;
};

/** An input for mutations affecting `Person` */
export type PersonInput = {
  avatarUrl?: string | null | undefined;
  createdAt?: Date | null | undefined;
  emailConsent?: boolean | null | undefined;
  emails?: Array<string | null | undefined> | null | undefined;
  firstName: string;
  internal?: boolean | null | undefined;
  lastName: string;
  notes?: string | null | undefined;
  organizationId: string;
  phone?: string | null | undefined;
  rowId?: string | null | undefined;
  tags?: Array<string | null | undefined> | null | undefined;
  updatedAt?: Date | null | undefined;
};

/** Represents an update to a `Person`. Fields that are set will be updated. */
export type PersonPatch = {
  avatarUrl?: string | null | undefined;
  createdAt?: Date | null | undefined;
  emailConsent?: boolean | null | undefined;
  emails?: Array<string | null | undefined> | null | undefined;
  firstName?: string | null | undefined;
  internal?: boolean | null | undefined;
  lastName?: string | null | undefined;
  notes?: string | null | undefined;
  organizationId?: string | null | undefined;
  phone?: string | null | undefined;
  rowId?: string | null | undefined;
  tags?: Array<string | null | undefined> | null | undefined;
  updatedAt?: Date | null | undefined;
};

/** An input for mutations affecting `Product` */
export type ProductInput = {
  category1?: string | null | undefined;
  category2?: string | null | undefined;
  channels?: Array<string | null | undefined> | null | undefined;
  costPrice?: string | null | undefined;
  createdAt?: Date | null | undefined;
  currentQuantity?: number | null | undefined;
  description?: string | null | undefined;
  fulfillmentType?: string | null | undefined;
  imageUrl?: string | null | undefined;
  imageUrl2?: string | null | undefined;
  imageUrl3?: string | null | undefined;
  isActive?: boolean | null | undefined;
  isRestricted?: boolean | null | undefined;
  lowStockThreshold?: number | null | undefined;
  name: string;
  organizationId: string;
  retailPrice?: string | null | undefined;
  rowId?: string | null | undefined;
  sku?: string | null | undefined;
  supplierId?: string | null | undefined;
  supplierSku?: string | null | undefined;
  unitPrice?: string | null | undefined;
  upc?: string | null | undefined;
  updatedAt?: Date | null | undefined;
  weight?: string | null | undefined;
};

/** Represents an update to a `Product`. Fields that are set will be updated. */
export type ProductPatch = {
  category1?: string | null | undefined;
  category2?: string | null | undefined;
  channels?: Array<string | null | undefined> | null | undefined;
  costPrice?: string | null | undefined;
  createdAt?: Date | null | undefined;
  currentQuantity?: number | null | undefined;
  description?: string | null | undefined;
  fulfillmentType?: string | null | undefined;
  imageUrl?: string | null | undefined;
  imageUrl2?: string | null | undefined;
  imageUrl3?: string | null | undefined;
  isActive?: boolean | null | undefined;
  isRestricted?: boolean | null | undefined;
  lowStockThreshold?: number | null | undefined;
  name?: string | null | undefined;
  organizationId?: string | null | undefined;
  retailPrice?: string | null | undefined;
  rowId?: string | null | undefined;
  sku?: string | null | undefined;
  supplierId?: string | null | undefined;
  supplierSku?: string | null | undefined;
  unitPrice?: string | null | undefined;
  upc?: string | null | undefined;
  updatedAt?: Date | null | undefined;
  weight?: string | null | undefined;
};

/** An input for mutations affecting `Quote` */
export type QuoteInput = {
  additionalItemsLabel?: string | null | undefined;
  additionalTerms?: Array<string | null | undefined> | null | undefined;
  clientEmail?: string | null | undefined;
  clientName?: string | null | undefined;
  companyId?: string | null | undefined;
  contactId?: string | null | undefined;
  convertedInvoiceId?: string | null | undefined;
  createdAt?: Date | null | undefined;
  currency?: string | null | undefined;
  description?: string | null | undefined;
  notes?: string | null | undefined;
  organizationId: string;
  projectType?: string | null | undefined;
  quoteNumber: string;
  rowId?: string | null | undefined;
  status?: string | null | undefined;
  subtotal?: string | null | undefined;
  taxAmount?: string | null | undefined;
  taxRate?: string | null | undefined;
  terms?: string | null | undefined;
  timeRange?: string | null | undefined;
  title: string;
  total?: string | null | undefined;
  updatedAt?: Date | null | undefined;
  validUntil: Date;
};

/** An input for mutations affecting `QuoteLineItem` */
export type QuoteLineItemInput = {
  acceptanceCriteria?: Array<string | null | undefined> | null | undefined;
  amount: string;
  deliverables?: Array<string | null | undefined> | null | undefined;
  description: string;
  estimatedHours?: string | null | undefined;
  hourlyRate?: string | null | undefined;
  maxCapHours?: number | null | undefined;
  minimumBillingMinutes?: number | null | undefined;
  monthlyCapHours?: number | null | undefined;
  pricingType?: string | null | undefined;
  productId?: string | null | undefined;
  quantity: string;
  quoteId: string;
  rowId?: string | null | undefined;
  royaltyBuyoutAmount?: string | null | undefined;
  royaltyPercentage?: string | null | undefined;
  royaltyThreshold?: string | null | undefined;
  royaltyTimeframe?: number | null | undefined;
  royaltyTimeframeUnit?: string | null | undefined;
  sortOrder?: number | null | undefined;
  subtitle?: string | null | undefined;
  unitPrice: string;
  weeklyCapHours?: number | null | undefined;
};

/** Represents an update to a `Quote`. Fields that are set will be updated. */
export type QuotePatch = {
  additionalItemsLabel?: string | null | undefined;
  additionalTerms?: Array<string | null | undefined> | null | undefined;
  clientEmail?: string | null | undefined;
  clientName?: string | null | undefined;
  companyId?: string | null | undefined;
  contactId?: string | null | undefined;
  convertedInvoiceId?: string | null | undefined;
  createdAt?: Date | null | undefined;
  currency?: string | null | undefined;
  description?: string | null | undefined;
  notes?: string | null | undefined;
  organizationId?: string | null | undefined;
  projectType?: string | null | undefined;
  quoteNumber?: string | null | undefined;
  rowId?: string | null | undefined;
  status?: string | null | undefined;
  subtotal?: string | null | undefined;
  taxAmount?: string | null | undefined;
  taxRate?: string | null | undefined;
  terms?: string | null | undefined;
  timeRange?: string | null | undefined;
  title?: string | null | undefined;
  total?: string | null | undefined;
  updatedAt?: Date | null | undefined;
  validUntil?: Date | null | undefined;
};

/** All input for the `updateCompany` mutation. */
export type UpdateCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
  rowId: string;
};

/** All input for the `updateCompanyMember` mutation. */
export type UpdateCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `CompanyMember` being updated. */
  patch: CompanyMemberPatch;
  rowId: string;
};

/** All input for the `updateDocumentNumberingConfig` mutation. */
export type UpdateDocumentNumberingConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `DocumentNumberingConfig` being updated. */
  patch: DocumentNumberingConfigPatch;
  rowId: string;
};

/** All input for the `updateInvoice` mutation. */
export type UpdateInvoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `Invoice` being updated. */
  patch: InvoicePatch;
  rowId: string;
};

/** All input for the `updateOrganizationSetting` mutation. */
export type UpdateOrganizationSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `OrganizationSetting` being updated. */
  patch: OrganizationSettingPatch;
  rowId: string;
};

/** All input for the `updatePerson` mutation. */
export type UpdatePersonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `Person` being updated. */
  patch: PersonPatch;
  rowId: string;
};

/** All input for the `updateProduct` mutation. */
export type UpdateProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `Product` being updated. */
  patch: ProductPatch;
  rowId: string;
};

/** All input for the `updateQuote` mutation. */
export type UpdateQuoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `Quote` being updated. */
  patch: QuotePatch;
  rowId: string;
};

export type AllCompaniesQueryVariables = Exact<{
  organizationId: string;
}>;


export type AllCompaniesQuery = { companies: { nodes: Array<{ rowId: string, organizationId: string, name: string, website: string | null, industry: string | null, phone: string | null, email: string | null, addressLine1: string | null, addressLine2: string | null, city: string | null, state: string | null, postalCode: string | null, country: string | null, notes: string | null, createdAt: string | null, updatedAt: string | null } | null> } | null };

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = { createCompany: { company: { rowId: string, name: string } | null } | null };

export type UpdateCompanyMutationVariables = Exact<{
  input: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = { updateCompany: { company: { rowId: string, name: string } | null } | null };

export type DeleteCompanyMutationVariables = Exact<{
  input: DeleteCompanyInput;
}>;


export type DeleteCompanyMutation = { deleteCompany: { deletedCompanyId: string | null } | null };

export type CompanyMembersByCompanyQueryVariables = Exact<{
  companyId: string;
}>;


export type CompanyMembersByCompanyQuery = { companyMembers: { nodes: Array<{ rowId: string, companyId: string, personId: string, title: string | null, isPrimary: boolean | null, createdAt: string | null, person: { rowId: string, firstName: string, lastName: string } | null } | null> } | null };

export type CompanyMembersByPersonQueryVariables = Exact<{
  personId: string;
}>;


export type CompanyMembersByPersonQuery = { companyMembers: { nodes: Array<{ rowId: string, companyId: string, personId: string, title: string | null, isPrimary: boolean | null, createdAt: string | null, company: { rowId: string, name: string } | null } | null> } | null };

export type CreateCompanyMemberMutationVariables = Exact<{
  input: CreateCompanyMemberInput;
}>;


export type CreateCompanyMemberMutation = { createCompanyMember: { companyMember: { rowId: string, companyId: string, personId: string, title: string | null, isPrimary: boolean | null } | null } | null };

export type UpdateCompanyMemberMutationVariables = Exact<{
  input: UpdateCompanyMemberInput;
}>;


export type UpdateCompanyMemberMutation = { updateCompanyMember: { companyMember: { rowId: string, title: string | null, isPrimary: boolean | null } | null } | null };

export type DeleteCompanyMemberMutationVariables = Exact<{
  input: DeleteCompanyMemberInput;
}>;


export type DeleteCompanyMemberMutation = { deleteCompanyMember: { deletedCompanyMemberId: string | null } | null };

export type WorkspaceCreditsQueryVariables = Exact<{
  organizationId: string;
}>;


export type WorkspaceCreditsQuery = { creditTransactions: { nodes: Array<{ rowId: string, organizationId: string, currency: string, amount: string, kind: string, invoiceId: string | null, paymentId: string | null, note: string | null, createdAt: string | null } | null> } | null };

export type ApplyInvoiceCreditMutationVariables = Exact<{
  input: ApplyInvoiceCreditInput;
}>;


export type ApplyInvoiceCreditMutation = { applyInvoiceCredit: { creditTransactionId: string, amountApplied: string, remainingCredit: string, invoiceOutstanding: string } | null };

export type DocumentNumberingConfigsQueryVariables = Exact<{
  organizationId: string;
}>;


export type DocumentNumberingConfigsQuery = { documentNumberingConfigs: { nodes: Array<{ rowId: string, organizationId: string, companyId: string | null, documentType: string, globalPrefix: string | null, prefix: string, separator: string, dateFormat: string | null, idStrategy: string, sequentialPadding: number, randomLength: number, nextSequentialNumber: number } | null> } | null };

export type CreateDocumentNumberingConfigMutationVariables = Exact<{
  input: CreateDocumentNumberingConfigInput;
}>;


export type CreateDocumentNumberingConfigMutation = { createDocumentNumberingConfig: { documentNumberingConfig: { rowId: string, globalPrefix: string | null, prefix: string, separator: string, dateFormat: string | null, idStrategy: string, sequentialPadding: number, randomLength: number } | null } | null };

export type UpdateDocumentNumberingConfigMutationVariables = Exact<{
  input: UpdateDocumentNumberingConfigInput;
}>;


export type UpdateDocumentNumberingConfigMutation = { updateDocumentNumberingConfig: { documentNumberingConfig: { rowId: string, globalPrefix: string | null, prefix: string, separator: string, dateFormat: string | null, idStrategy: string, sequentialPadding: number, randomLength: number } | null } | null };

export type DeleteDocumentNumberingConfigMutationVariables = Exact<{
  input: DeleteDocumentNumberingConfigInput;
}>;


export type DeleteDocumentNumberingConfigMutation = { deleteDocumentNumberingConfig: { deletedDocumentNumberingConfigId: string | null } | null };

export type GenerateDocumentNumberMutationVariables = Exact<{
  input: GenerateDocumentNumberInput;
}>;


export type GenerateDocumentNumberMutation = { generateDocumentNumber: { documentNumber: string } | null };

export type AllInvoicesQueryVariables = Exact<{
  organizationId: string;
}>;


export type AllInvoicesQuery = { invoices: { nodes: Array<{ rowId: string, organizationId: string, invoiceNumber: string, companyId: string | null, contactId: string | null, billTo: string | null, status: string, issueDate: string, dueDate: string | null, notes: string | null, subtotal: string | null, taxRate: string | null, taxAmount: string | null, total: string | null, currency: string | null, paidAt: string | null, paymentReference: string | null, paymentLinkUrl: string | null, createdAt: string | null, updatedAt: string | null, company: { rowId: string, name: string } | null, contact: { rowId: string, firstName: string, lastName: string } | null, invoiceLineItems: { nodes: Array<{ rowId: string, invoiceId: string, productId: string | null, description: string, quantity: string, unitPrice: string, amount: string, sortOrder: number | null } | null> }, payments: { nodes: Array<{ rowId: string, invoiceId: string, amount: string, paidAt: string, reference: string | null, method: string | null } | null> } } | null> } | null };

export type CreateInvoiceMutationVariables = Exact<{
  input: CreateInvoiceInput;
}>;


export type CreateInvoiceMutation = { createInvoice: { invoice: { rowId: string, invoiceNumber: string } | null } | null };

export type UpdateInvoiceMutationVariables = Exact<{
  input: UpdateInvoiceInput;
}>;


export type UpdateInvoiceMutation = { updateInvoice: { invoice: { rowId: string, invoiceNumber: string } | null } | null };

export type DeleteInvoiceMutationVariables = Exact<{
  input: DeleteInvoiceInput;
}>;


export type DeleteInvoiceMutation = { deleteInvoice: { deletedInvoiceId: string | null } | null };

export type CreateInvoiceLineItemMutationVariables = Exact<{
  input: CreateInvoiceLineItemInput;
}>;


export type CreateInvoiceLineItemMutation = { createInvoiceLineItem: { invoiceLineItem: { rowId: string } | null } | null };

export type DeleteInvoiceLineItemMutationVariables = Exact<{
  input: DeleteInvoiceLineItemInput;
}>;


export type DeleteInvoiceLineItemMutation = { deleteInvoiceLineItem: { deletedInvoiceLineItemId: string | null } | null };

export type CreatePaymentMutationVariables = Exact<{
  input: CreatePaymentInput;
}>;


export type CreatePaymentMutation = { createPayment: { payment: { rowId: string } | null } | null };

export type DeletePaymentMutationVariables = Exact<{
  input: DeletePaymentInput;
}>;


export type DeletePaymentMutation = { deletePayment: { deletedPaymentId: string | null } | null };

export type AllPeopleQueryVariables = Exact<{
  organizationId: string;
}>;


export type AllPeopleQuery = { people: { nodes: Array<{ rowId: string, organizationId: string, firstName: string, lastName: string, emails: Array<string | null> | null, phone: string | null, internal: boolean, avatarUrl: string | null, tags: Array<string | null> | null, notes: string | null, createdAt: string | null, updatedAt: string | null } | null> } | null };

export type CreatePersonMutationVariables = Exact<{
  input: CreatePersonInput;
}>;


export type CreatePersonMutation = { createPerson: { person: { rowId: string, firstName: string, lastName: string } | null } | null };

export type UpdatePersonMutationVariables = Exact<{
  input: UpdatePersonInput;
}>;


export type UpdatePersonMutation = { updatePerson: { person: { rowId: string, firstName: string, lastName: string } | null } | null };

export type DeletePersonMutationVariables = Exact<{
  input: DeletePersonInput;
}>;


export type DeletePersonMutation = { deletePerson: { deletedPersonId: string | null } | null };

export type AllProductsQueryVariables = Exact<{
  organizationId: string;
}>;


export type AllProductsQuery = { products: { nodes: Array<{ rowId: string, organizationId: string, name: string, description: string | null, sku: string | null, unitPrice: string | null, currentQuantity: number | null, lowStockThreshold: number | null, isActive: boolean | null, createdAt: string | null, updatedAt: string | null } | null> } | null };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { createProduct: { product: { rowId: string, name: string } | null } | null };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { updateProduct: { product: { rowId: string, name: string } | null } | null };

export type DeleteProductMutationVariables = Exact<{
  input: DeleteProductInput;
}>;


export type DeleteProductMutation = { deleteProduct: { deletedProductId: string | null } | null };

export type InventoryAdjustmentsQueryVariables = Exact<{
  productId: string;
}>;


export type InventoryAdjustmentsQuery = { inventoryAdjustments: { nodes: Array<{ rowId: string, productId: string, quantityChange: number, reason: string, referenceId: string | null, createdAt: string | null } | null> } | null };

export type CreateInventoryAdjustmentMutationVariables = Exact<{
  input: CreateInventoryAdjustmentInput;
}>;


export type CreateInventoryAdjustmentMutation = { createInventoryAdjustment: { inventoryAdjustment: { rowId: string, quantityChange: number } | null } | null };

export type AllQuotesQueryVariables = Exact<{
  organizationId: string;
}>;


export type AllQuotesQuery = { quotes: { nodes: Array<{ rowId: string, organizationId: string, quoteNumber: string, companyId: string | null, contactId: string | null, clientName: string | null, clientEmail: string | null, additionalItemsLabel: string | null, title: string, description: string | null, status: string, validUntil: string, projectType: string | null, timeRange: string | null, terms: string | null, additionalTerms: Array<string | null> | null, notes: string | null, subtotal: string | null, taxRate: string | null, taxAmount: string | null, total: string | null, currency: string | null, convertedInvoiceId: string | null, createdAt: string | null, updatedAt: string | null, company: { rowId: string, name: string } | null, contact: { rowId: string, firstName: string, lastName: string } | null, quoteLineItems: { nodes: Array<{ rowId: string, quoteId: string, productId: string | null, description: string, subtitle: string | null, quantity: string, unitPrice: string, amount: string, pricingType: string, estimatedHours: string | null, hourlyRate: string | null, weeklyCapHours: number | null, monthlyCapHours: number | null, maxCapHours: number | null, minimumBillingMinutes: number | null, royaltyPercentage: string | null, royaltyTimeframe: number | null, royaltyTimeframeUnit: string | null, royaltyThreshold: string | null, royaltyBuyoutAmount: string | null, sortOrder: number | null, deliverables: Array<string | null> | null, acceptanceCriteria: Array<string | null> | null } | null> } } | null> } | null };

export type CreateQuoteMutationVariables = Exact<{
  input: CreateQuoteInput;
}>;


export type CreateQuoteMutation = { createQuote: { quote: { rowId: string, quoteNumber: string } | null } | null };

export type UpdateQuoteMutationVariables = Exact<{
  input: UpdateQuoteInput;
}>;


export type UpdateQuoteMutation = { updateQuote: { quote: { rowId: string, quoteNumber: string } | null } | null };

export type DeleteQuoteMutationVariables = Exact<{
  input: DeleteQuoteInput;
}>;


export type DeleteQuoteMutation = { deleteQuote: { deletedQuoteId: string | null } | null };

export type CreateQuoteLineItemMutationVariables = Exact<{
  input: CreateQuoteLineItemInput;
}>;


export type CreateQuoteLineItemMutation = { createQuoteLineItem: { quoteLineItem: { rowId: string } | null } | null };

export type DeleteQuoteLineItemMutationVariables = Exact<{
  input: DeleteQuoteLineItemInput;
}>;


export type DeleteQuoteLineItemMutation = { deleteQuoteLineItem: { deletedQuoteLineItemId: string | null } | null };

export type ConvertQuoteToInvoiceMutationVariables = Exact<{
  input: ConvertQuoteToInvoiceInput;
}>;


export type ConvertQuoteToInvoiceMutation = { convertQuoteToInvoice: { invoiceId: string, invoiceNumber: string, skippedLineItems: Array<{ rowId: string, description: string, pricingType: string }> } | null };

export type WorkspaceProfileFieldsFragment = { rowId: string, organizationId: string, accentColor: string | null, companyName: string | null, contactName: string | null, contactTitle: string | null, email: string | null, phone: string | null, website: string | null, addressLine1: string | null, addressLine2: string | null, city: string | null, state: string | null, postalCode: string | null, country: string | null, logoUrl: string | null, registrationState: string | null, createdAt: string | null, updatedAt: string | null };

export type WorkspaceProfileQueryVariables = Exact<{
  organizationId: string;
}>;


export type WorkspaceProfileQuery = { organizationSettings: { nodes: Array<{ rowId: string, organizationId: string, accentColor: string | null, companyName: string | null, contactName: string | null, contactTitle: string | null, email: string | null, phone: string | null, website: string | null, addressLine1: string | null, addressLine2: string | null, city: string | null, state: string | null, postalCode: string | null, country: string | null, logoUrl: string | null, registrationState: string | null, createdAt: string | null, updatedAt: string | null } | null> } | null };

export type CreateWorkspaceProfileMutationVariables = Exact<{
  input: CreateOrganizationSettingInput;
}>;


export type CreateWorkspaceProfileMutation = { createOrganizationSetting: { organizationSetting: { rowId: string, organizationId: string, accentColor: string | null, companyName: string | null, contactName: string | null, contactTitle: string | null, email: string | null, phone: string | null, website: string | null, addressLine1: string | null, addressLine2: string | null, city: string | null, state: string | null, postalCode: string | null, country: string | null, logoUrl: string | null, registrationState: string | null, createdAt: string | null, updatedAt: string | null } | null } | null };

export type UpdateWorkspaceProfileMutationVariables = Exact<{
  input: UpdateOrganizationSettingInput;
}>;


export type UpdateWorkspaceProfileMutation = { updateOrganizationSetting: { organizationSetting: { rowId: string, organizationId: string, accentColor: string | null, companyName: string | null, contactName: string | null, contactTitle: string | null, email: string | null, phone: string | null, website: string | null, addressLine1: string | null, addressLine2: string | null, city: string | null, state: string | null, postalCode: string | null, country: string | null, logoUrl: string | null, registrationState: string | null, createdAt: string | null, updatedAt: string | null } | null } | null };

export type WorkspacePlanQueryVariables = Exact<{
  organizationId: string;
}>;


export type WorkspacePlanQuery = { workspacePlan: { tier: string, source: string, limits: Array<{ key: string, limit: number, used: number | null }> } | null };


export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>['__apiType']>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}
export const WorkspaceProfileFieldsFragmentDoc = new TypedDocumentString(`
    fragment WorkspaceProfileFields on OrganizationSetting {
  rowId
  organizationId
  accentColor
  companyName
  contactName
  contactTitle
  email
  phone
  website
  addressLine1
  addressLine2
  city
  state
  postalCode
  country
  logoUrl
  registrationState
  createdAt
  updatedAt
}
    `, {"fragmentName":"WorkspaceProfileFields"});
export const AllCompaniesDocument = new TypedDocumentString(`
    query AllCompanies($organizationId: String!) {
  companies(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
      name
      website
      industry
      phone
      email
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      notes
      createdAt
      updatedAt
    }
  }
}
    `);

export const useAllCompaniesQuery = <
      TData = AllCompaniesQuery,
      TError = unknown
    >(
      variables: AllCompaniesQueryVariables,
      options?: Omit<UseQueryOptions<AllCompaniesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AllCompaniesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AllCompaniesQuery, TError, TData>(
      {
    queryKey: ['AllCompanies', variables],
    queryFn: graphqlFetch<AllCompaniesQuery, AllCompaniesQueryVariables>(AllCompaniesDocument, variables),
    ...options
  }
    )};

useAllCompaniesQuery.getKey = (variables: AllCompaniesQueryVariables) => ['AllCompanies', variables];

export const useSuspenseAllCompaniesQuery = <
      TData = AllCompaniesQuery,
      TError = unknown
    >(
      variables: AllCompaniesQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AllCompaniesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AllCompaniesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AllCompaniesQuery, TError, TData>(
      {
    queryKey: ['AllCompanies', variables],
    queryFn: graphqlFetch<AllCompaniesQuery, AllCompaniesQueryVariables>(AllCompaniesDocument, variables),
    ...options
  }
    )};

useSuspenseAllCompaniesQuery.getKey = (variables: AllCompaniesQueryVariables) => ['AllCompanies', variables];

export const useInfiniteAllCompaniesQuery = <
      TData = InfiniteData<AllCompaniesQuery>,
      TError = unknown
    >(
      variables: AllCompaniesQueryVariables,
      options: Omit<UseInfiniteQueryOptions<AllCompaniesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<AllCompaniesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<AllCompaniesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllCompanies.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllCompaniesQuery, AllCompaniesQueryVariables>(AllCompaniesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteAllCompaniesQuery.getKey = (variables: AllCompaniesQueryVariables) => ['AllCompanies.infinite', variables];

export const useSuspenseInfiniteAllCompaniesQuery = <
      TData = InfiniteData<AllCompaniesQuery>,
      TError = unknown
    >(
      variables: AllCompaniesQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<AllCompaniesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<AllCompaniesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<AllCompaniesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllCompanies.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllCompaniesQuery, AllCompaniesQueryVariables>(AllCompaniesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteAllCompaniesQuery.getKey = (variables: AllCompaniesQueryVariables) => ['AllCompanies.infinite', variables];


useAllCompaniesQuery.fetcher = (variables: AllCompaniesQueryVariables, options?: RequestInit['headers']) => graphqlFetch<AllCompaniesQuery, AllCompaniesQueryVariables>(AllCompaniesDocument, variables, options);

export const CreateCompanyDocument = new TypedDocumentString(`
    mutation CreateCompany($input: CreateCompanyInput!) {
  createCompany(input: $input) {
    company {
      rowId
      name
    }
  }
}
    `);

export const useCreateCompanyMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateCompanyMutation, TError, CreateCompanyMutationVariables, TContext>) => {
    
    return useMutation<CreateCompanyMutation, TError, CreateCompanyMutationVariables, TContext>(
      {
    mutationKey: ['CreateCompany'],
    mutationFn: (variables?: CreateCompanyMutationVariables) => graphqlFetch<CreateCompanyMutation, CreateCompanyMutationVariables>(CreateCompanyDocument, variables)(),
    ...options
  }
    )};

useCreateCompanyMutation.getKey = () => ['CreateCompany'];


useCreateCompanyMutation.fetcher = (variables: CreateCompanyMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateCompanyMutation, CreateCompanyMutationVariables>(CreateCompanyDocument, variables, options);

export const UpdateCompanyDocument = new TypedDocumentString(`
    mutation UpdateCompany($input: UpdateCompanyInput!) {
  updateCompany(input: $input) {
    company {
      rowId
      name
    }
  }
}
    `);

export const useUpdateCompanyMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCompanyMutation, TError, UpdateCompanyMutationVariables, TContext>) => {
    
    return useMutation<UpdateCompanyMutation, TError, UpdateCompanyMutationVariables, TContext>(
      {
    mutationKey: ['UpdateCompany'],
    mutationFn: (variables?: UpdateCompanyMutationVariables) => graphqlFetch<UpdateCompanyMutation, UpdateCompanyMutationVariables>(UpdateCompanyDocument, variables)(),
    ...options
  }
    )};

useUpdateCompanyMutation.getKey = () => ['UpdateCompany'];


useUpdateCompanyMutation.fetcher = (variables: UpdateCompanyMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateCompanyMutation, UpdateCompanyMutationVariables>(UpdateCompanyDocument, variables, options);

export const DeleteCompanyDocument = new TypedDocumentString(`
    mutation DeleteCompany($input: DeleteCompanyInput!) {
  deleteCompany(input: $input) {
    deletedCompanyId
  }
}
    `);

export const useDeleteCompanyMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteCompanyMutation, TError, DeleteCompanyMutationVariables, TContext>) => {
    
    return useMutation<DeleteCompanyMutation, TError, DeleteCompanyMutationVariables, TContext>(
      {
    mutationKey: ['DeleteCompany'],
    mutationFn: (variables?: DeleteCompanyMutationVariables) => graphqlFetch<DeleteCompanyMutation, DeleteCompanyMutationVariables>(DeleteCompanyDocument, variables)(),
    ...options
  }
    )};

useDeleteCompanyMutation.getKey = () => ['DeleteCompany'];


useDeleteCompanyMutation.fetcher = (variables: DeleteCompanyMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteCompanyMutation, DeleteCompanyMutationVariables>(DeleteCompanyDocument, variables, options);

export const CompanyMembersByCompanyDocument = new TypedDocumentString(`
    query CompanyMembersByCompany($companyId: UUID!) {
  companyMembers(condition: {companyId: $companyId}) {
    nodes {
      rowId
      companyId
      personId
      title
      isPrimary
      createdAt
      person {
        rowId
        firstName
        lastName
      }
    }
  }
}
    `);

export const useCompanyMembersByCompanyQuery = <
      TData = CompanyMembersByCompanyQuery,
      TError = unknown
    >(
      variables: CompanyMembersByCompanyQueryVariables,
      options?: Omit<UseQueryOptions<CompanyMembersByCompanyQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<CompanyMembersByCompanyQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<CompanyMembersByCompanyQuery, TError, TData>(
      {
    queryKey: ['CompanyMembersByCompany', variables],
    queryFn: graphqlFetch<CompanyMembersByCompanyQuery, CompanyMembersByCompanyQueryVariables>(CompanyMembersByCompanyDocument, variables),
    ...options
  }
    )};

useCompanyMembersByCompanyQuery.getKey = (variables: CompanyMembersByCompanyQueryVariables) => ['CompanyMembersByCompany', variables];

export const useSuspenseCompanyMembersByCompanyQuery = <
      TData = CompanyMembersByCompanyQuery,
      TError = unknown
    >(
      variables: CompanyMembersByCompanyQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<CompanyMembersByCompanyQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<CompanyMembersByCompanyQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<CompanyMembersByCompanyQuery, TError, TData>(
      {
    queryKey: ['CompanyMembersByCompany', variables],
    queryFn: graphqlFetch<CompanyMembersByCompanyQuery, CompanyMembersByCompanyQueryVariables>(CompanyMembersByCompanyDocument, variables),
    ...options
  }
    )};

useSuspenseCompanyMembersByCompanyQuery.getKey = (variables: CompanyMembersByCompanyQueryVariables) => ['CompanyMembersByCompany', variables];

export const useInfiniteCompanyMembersByCompanyQuery = <
      TData = InfiniteData<CompanyMembersByCompanyQuery>,
      TError = unknown
    >(
      variables: CompanyMembersByCompanyQueryVariables,
      options: Omit<UseInfiniteQueryOptions<CompanyMembersByCompanyQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<CompanyMembersByCompanyQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<CompanyMembersByCompanyQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['CompanyMembersByCompany.infinite', variables],
      queryFn: (metaData) => graphqlFetch<CompanyMembersByCompanyQuery, CompanyMembersByCompanyQueryVariables>(CompanyMembersByCompanyDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteCompanyMembersByCompanyQuery.getKey = (variables: CompanyMembersByCompanyQueryVariables) => ['CompanyMembersByCompany.infinite', variables];

export const useSuspenseInfiniteCompanyMembersByCompanyQuery = <
      TData = InfiniteData<CompanyMembersByCompanyQuery>,
      TError = unknown
    >(
      variables: CompanyMembersByCompanyQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<CompanyMembersByCompanyQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<CompanyMembersByCompanyQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<CompanyMembersByCompanyQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['CompanyMembersByCompany.infinite', variables],
      queryFn: (metaData) => graphqlFetch<CompanyMembersByCompanyQuery, CompanyMembersByCompanyQueryVariables>(CompanyMembersByCompanyDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteCompanyMembersByCompanyQuery.getKey = (variables: CompanyMembersByCompanyQueryVariables) => ['CompanyMembersByCompany.infinite', variables];


useCompanyMembersByCompanyQuery.fetcher = (variables: CompanyMembersByCompanyQueryVariables, options?: RequestInit['headers']) => graphqlFetch<CompanyMembersByCompanyQuery, CompanyMembersByCompanyQueryVariables>(CompanyMembersByCompanyDocument, variables, options);

export const CompanyMembersByPersonDocument = new TypedDocumentString(`
    query CompanyMembersByPerson($personId: UUID!) {
  companyMembers(condition: {personId: $personId}) {
    nodes {
      rowId
      companyId
      personId
      title
      isPrimary
      createdAt
      company {
        rowId
        name
      }
    }
  }
}
    `);

export const useCompanyMembersByPersonQuery = <
      TData = CompanyMembersByPersonQuery,
      TError = unknown
    >(
      variables: CompanyMembersByPersonQueryVariables,
      options?: Omit<UseQueryOptions<CompanyMembersByPersonQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<CompanyMembersByPersonQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<CompanyMembersByPersonQuery, TError, TData>(
      {
    queryKey: ['CompanyMembersByPerson', variables],
    queryFn: graphqlFetch<CompanyMembersByPersonQuery, CompanyMembersByPersonQueryVariables>(CompanyMembersByPersonDocument, variables),
    ...options
  }
    )};

useCompanyMembersByPersonQuery.getKey = (variables: CompanyMembersByPersonQueryVariables) => ['CompanyMembersByPerson', variables];

export const useSuspenseCompanyMembersByPersonQuery = <
      TData = CompanyMembersByPersonQuery,
      TError = unknown
    >(
      variables: CompanyMembersByPersonQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<CompanyMembersByPersonQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<CompanyMembersByPersonQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<CompanyMembersByPersonQuery, TError, TData>(
      {
    queryKey: ['CompanyMembersByPerson', variables],
    queryFn: graphqlFetch<CompanyMembersByPersonQuery, CompanyMembersByPersonQueryVariables>(CompanyMembersByPersonDocument, variables),
    ...options
  }
    )};

useSuspenseCompanyMembersByPersonQuery.getKey = (variables: CompanyMembersByPersonQueryVariables) => ['CompanyMembersByPerson', variables];

export const useInfiniteCompanyMembersByPersonQuery = <
      TData = InfiniteData<CompanyMembersByPersonQuery>,
      TError = unknown
    >(
      variables: CompanyMembersByPersonQueryVariables,
      options: Omit<UseInfiniteQueryOptions<CompanyMembersByPersonQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<CompanyMembersByPersonQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<CompanyMembersByPersonQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['CompanyMembersByPerson.infinite', variables],
      queryFn: (metaData) => graphqlFetch<CompanyMembersByPersonQuery, CompanyMembersByPersonQueryVariables>(CompanyMembersByPersonDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteCompanyMembersByPersonQuery.getKey = (variables: CompanyMembersByPersonQueryVariables) => ['CompanyMembersByPerson.infinite', variables];

export const useSuspenseInfiniteCompanyMembersByPersonQuery = <
      TData = InfiniteData<CompanyMembersByPersonQuery>,
      TError = unknown
    >(
      variables: CompanyMembersByPersonQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<CompanyMembersByPersonQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<CompanyMembersByPersonQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<CompanyMembersByPersonQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['CompanyMembersByPerson.infinite', variables],
      queryFn: (metaData) => graphqlFetch<CompanyMembersByPersonQuery, CompanyMembersByPersonQueryVariables>(CompanyMembersByPersonDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteCompanyMembersByPersonQuery.getKey = (variables: CompanyMembersByPersonQueryVariables) => ['CompanyMembersByPerson.infinite', variables];


useCompanyMembersByPersonQuery.fetcher = (variables: CompanyMembersByPersonQueryVariables, options?: RequestInit['headers']) => graphqlFetch<CompanyMembersByPersonQuery, CompanyMembersByPersonQueryVariables>(CompanyMembersByPersonDocument, variables, options);

export const CreateCompanyMemberDocument = new TypedDocumentString(`
    mutation CreateCompanyMember($input: CreateCompanyMemberInput!) {
  createCompanyMember(input: $input) {
    companyMember {
      rowId
      companyId
      personId
      title
      isPrimary
    }
  }
}
    `);

export const useCreateCompanyMemberMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateCompanyMemberMutation, TError, CreateCompanyMemberMutationVariables, TContext>) => {
    
    return useMutation<CreateCompanyMemberMutation, TError, CreateCompanyMemberMutationVariables, TContext>(
      {
    mutationKey: ['CreateCompanyMember'],
    mutationFn: (variables?: CreateCompanyMemberMutationVariables) => graphqlFetch<CreateCompanyMemberMutation, CreateCompanyMemberMutationVariables>(CreateCompanyMemberDocument, variables)(),
    ...options
  }
    )};

useCreateCompanyMemberMutation.getKey = () => ['CreateCompanyMember'];


useCreateCompanyMemberMutation.fetcher = (variables: CreateCompanyMemberMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateCompanyMemberMutation, CreateCompanyMemberMutationVariables>(CreateCompanyMemberDocument, variables, options);

export const UpdateCompanyMemberDocument = new TypedDocumentString(`
    mutation UpdateCompanyMember($input: UpdateCompanyMemberInput!) {
  updateCompanyMember(input: $input) {
    companyMember {
      rowId
      title
      isPrimary
    }
  }
}
    `);

export const useUpdateCompanyMemberMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateCompanyMemberMutation, TError, UpdateCompanyMemberMutationVariables, TContext>) => {
    
    return useMutation<UpdateCompanyMemberMutation, TError, UpdateCompanyMemberMutationVariables, TContext>(
      {
    mutationKey: ['UpdateCompanyMember'],
    mutationFn: (variables?: UpdateCompanyMemberMutationVariables) => graphqlFetch<UpdateCompanyMemberMutation, UpdateCompanyMemberMutationVariables>(UpdateCompanyMemberDocument, variables)(),
    ...options
  }
    )};

useUpdateCompanyMemberMutation.getKey = () => ['UpdateCompanyMember'];


useUpdateCompanyMemberMutation.fetcher = (variables: UpdateCompanyMemberMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateCompanyMemberMutation, UpdateCompanyMemberMutationVariables>(UpdateCompanyMemberDocument, variables, options);

export const DeleteCompanyMemberDocument = new TypedDocumentString(`
    mutation DeleteCompanyMember($input: DeleteCompanyMemberInput!) {
  deleteCompanyMember(input: $input) {
    deletedCompanyMemberId
  }
}
    `);

export const useDeleteCompanyMemberMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteCompanyMemberMutation, TError, DeleteCompanyMemberMutationVariables, TContext>) => {
    
    return useMutation<DeleteCompanyMemberMutation, TError, DeleteCompanyMemberMutationVariables, TContext>(
      {
    mutationKey: ['DeleteCompanyMember'],
    mutationFn: (variables?: DeleteCompanyMemberMutationVariables) => graphqlFetch<DeleteCompanyMemberMutation, DeleteCompanyMemberMutationVariables>(DeleteCompanyMemberDocument, variables)(),
    ...options
  }
    )};

useDeleteCompanyMemberMutation.getKey = () => ['DeleteCompanyMember'];


useDeleteCompanyMemberMutation.fetcher = (variables: DeleteCompanyMemberMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteCompanyMemberMutation, DeleteCompanyMemberMutationVariables>(DeleteCompanyMemberDocument, variables, options);

export const WorkspaceCreditsDocument = new TypedDocumentString(`
    query WorkspaceCredits($organizationId: String!) {
  creditTransactions(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
      currency
      amount
      kind
      invoiceId
      paymentId
      note
      createdAt
    }
  }
}
    `);

export const useWorkspaceCreditsQuery = <
      TData = WorkspaceCreditsQuery,
      TError = unknown
    >(
      variables: WorkspaceCreditsQueryVariables,
      options?: Omit<UseQueryOptions<WorkspaceCreditsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<WorkspaceCreditsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<WorkspaceCreditsQuery, TError, TData>(
      {
    queryKey: ['WorkspaceCredits', variables],
    queryFn: graphqlFetch<WorkspaceCreditsQuery, WorkspaceCreditsQueryVariables>(WorkspaceCreditsDocument, variables),
    ...options
  }
    )};

useWorkspaceCreditsQuery.getKey = (variables: WorkspaceCreditsQueryVariables) => ['WorkspaceCredits', variables];

export const useSuspenseWorkspaceCreditsQuery = <
      TData = WorkspaceCreditsQuery,
      TError = unknown
    >(
      variables: WorkspaceCreditsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<WorkspaceCreditsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<WorkspaceCreditsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<WorkspaceCreditsQuery, TError, TData>(
      {
    queryKey: ['WorkspaceCredits', variables],
    queryFn: graphqlFetch<WorkspaceCreditsQuery, WorkspaceCreditsQueryVariables>(WorkspaceCreditsDocument, variables),
    ...options
  }
    )};

useSuspenseWorkspaceCreditsQuery.getKey = (variables: WorkspaceCreditsQueryVariables) => ['WorkspaceCredits', variables];

export const useInfiniteWorkspaceCreditsQuery = <
      TData = InfiniteData<WorkspaceCreditsQuery>,
      TError = unknown
    >(
      variables: WorkspaceCreditsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<WorkspaceCreditsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<WorkspaceCreditsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<WorkspaceCreditsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['WorkspaceCredits.infinite', variables],
      queryFn: (metaData) => graphqlFetch<WorkspaceCreditsQuery, WorkspaceCreditsQueryVariables>(WorkspaceCreditsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteWorkspaceCreditsQuery.getKey = (variables: WorkspaceCreditsQueryVariables) => ['WorkspaceCredits.infinite', variables];

export const useSuspenseInfiniteWorkspaceCreditsQuery = <
      TData = InfiniteData<WorkspaceCreditsQuery>,
      TError = unknown
    >(
      variables: WorkspaceCreditsQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<WorkspaceCreditsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<WorkspaceCreditsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<WorkspaceCreditsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['WorkspaceCredits.infinite', variables],
      queryFn: (metaData) => graphqlFetch<WorkspaceCreditsQuery, WorkspaceCreditsQueryVariables>(WorkspaceCreditsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteWorkspaceCreditsQuery.getKey = (variables: WorkspaceCreditsQueryVariables) => ['WorkspaceCredits.infinite', variables];


useWorkspaceCreditsQuery.fetcher = (variables: WorkspaceCreditsQueryVariables, options?: RequestInit['headers']) => graphqlFetch<WorkspaceCreditsQuery, WorkspaceCreditsQueryVariables>(WorkspaceCreditsDocument, variables, options);

export const ApplyInvoiceCreditDocument = new TypedDocumentString(`
    mutation ApplyInvoiceCredit($input: ApplyInvoiceCreditInput!) {
  applyInvoiceCredit(input: $input) {
    creditTransactionId
    amountApplied
    remainingCredit
    invoiceOutstanding
  }
}
    `);

export const useApplyInvoiceCreditMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ApplyInvoiceCreditMutation, TError, ApplyInvoiceCreditMutationVariables, TContext>) => {
    
    return useMutation<ApplyInvoiceCreditMutation, TError, ApplyInvoiceCreditMutationVariables, TContext>(
      {
    mutationKey: ['ApplyInvoiceCredit'],
    mutationFn: (variables?: ApplyInvoiceCreditMutationVariables) => graphqlFetch<ApplyInvoiceCreditMutation, ApplyInvoiceCreditMutationVariables>(ApplyInvoiceCreditDocument, variables)(),
    ...options
  }
    )};

useApplyInvoiceCreditMutation.getKey = () => ['ApplyInvoiceCredit'];


useApplyInvoiceCreditMutation.fetcher = (variables: ApplyInvoiceCreditMutationVariables, options?: RequestInit['headers']) => graphqlFetch<ApplyInvoiceCreditMutation, ApplyInvoiceCreditMutationVariables>(ApplyInvoiceCreditDocument, variables, options);

export const DocumentNumberingConfigsDocument = new TypedDocumentString(`
    query DocumentNumberingConfigs($organizationId: String!) {
  documentNumberingConfigs(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
      companyId
      documentType
      globalPrefix
      prefix
      separator
      dateFormat
      idStrategy
      sequentialPadding
      randomLength
      nextSequentialNumber
    }
  }
}
    `);

export const useDocumentNumberingConfigsQuery = <
      TData = DocumentNumberingConfigsQuery,
      TError = unknown
    >(
      variables: DocumentNumberingConfigsQueryVariables,
      options?: Omit<UseQueryOptions<DocumentNumberingConfigsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<DocumentNumberingConfigsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<DocumentNumberingConfigsQuery, TError, TData>(
      {
    queryKey: ['DocumentNumberingConfigs', variables],
    queryFn: graphqlFetch<DocumentNumberingConfigsQuery, DocumentNumberingConfigsQueryVariables>(DocumentNumberingConfigsDocument, variables),
    ...options
  }
    )};

useDocumentNumberingConfigsQuery.getKey = (variables: DocumentNumberingConfigsQueryVariables) => ['DocumentNumberingConfigs', variables];

export const useSuspenseDocumentNumberingConfigsQuery = <
      TData = DocumentNumberingConfigsQuery,
      TError = unknown
    >(
      variables: DocumentNumberingConfigsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<DocumentNumberingConfigsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<DocumentNumberingConfigsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<DocumentNumberingConfigsQuery, TError, TData>(
      {
    queryKey: ['DocumentNumberingConfigs', variables],
    queryFn: graphqlFetch<DocumentNumberingConfigsQuery, DocumentNumberingConfigsQueryVariables>(DocumentNumberingConfigsDocument, variables),
    ...options
  }
    )};

useSuspenseDocumentNumberingConfigsQuery.getKey = (variables: DocumentNumberingConfigsQueryVariables) => ['DocumentNumberingConfigs', variables];

export const useInfiniteDocumentNumberingConfigsQuery = <
      TData = InfiniteData<DocumentNumberingConfigsQuery>,
      TError = unknown
    >(
      variables: DocumentNumberingConfigsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<DocumentNumberingConfigsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<DocumentNumberingConfigsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<DocumentNumberingConfigsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['DocumentNumberingConfigs.infinite', variables],
      queryFn: (metaData) => graphqlFetch<DocumentNumberingConfigsQuery, DocumentNumberingConfigsQueryVariables>(DocumentNumberingConfigsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteDocumentNumberingConfigsQuery.getKey = (variables: DocumentNumberingConfigsQueryVariables) => ['DocumentNumberingConfigs.infinite', variables];

export const useSuspenseInfiniteDocumentNumberingConfigsQuery = <
      TData = InfiniteData<DocumentNumberingConfigsQuery>,
      TError = unknown
    >(
      variables: DocumentNumberingConfigsQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<DocumentNumberingConfigsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<DocumentNumberingConfigsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<DocumentNumberingConfigsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['DocumentNumberingConfigs.infinite', variables],
      queryFn: (metaData) => graphqlFetch<DocumentNumberingConfigsQuery, DocumentNumberingConfigsQueryVariables>(DocumentNumberingConfigsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteDocumentNumberingConfigsQuery.getKey = (variables: DocumentNumberingConfigsQueryVariables) => ['DocumentNumberingConfigs.infinite', variables];


useDocumentNumberingConfigsQuery.fetcher = (variables: DocumentNumberingConfigsQueryVariables, options?: RequestInit['headers']) => graphqlFetch<DocumentNumberingConfigsQuery, DocumentNumberingConfigsQueryVariables>(DocumentNumberingConfigsDocument, variables, options);

export const CreateDocumentNumberingConfigDocument = new TypedDocumentString(`
    mutation CreateDocumentNumberingConfig($input: CreateDocumentNumberingConfigInput!) {
  createDocumentNumberingConfig(input: $input) {
    documentNumberingConfig {
      rowId
      globalPrefix
      prefix
      separator
      dateFormat
      idStrategy
      sequentialPadding
      randomLength
    }
  }
}
    `);

export const useCreateDocumentNumberingConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateDocumentNumberingConfigMutation, TError, CreateDocumentNumberingConfigMutationVariables, TContext>) => {
    
    return useMutation<CreateDocumentNumberingConfigMutation, TError, CreateDocumentNumberingConfigMutationVariables, TContext>(
      {
    mutationKey: ['CreateDocumentNumberingConfig'],
    mutationFn: (variables?: CreateDocumentNumberingConfigMutationVariables) => graphqlFetch<CreateDocumentNumberingConfigMutation, CreateDocumentNumberingConfigMutationVariables>(CreateDocumentNumberingConfigDocument, variables)(),
    ...options
  }
    )};

useCreateDocumentNumberingConfigMutation.getKey = () => ['CreateDocumentNumberingConfig'];


useCreateDocumentNumberingConfigMutation.fetcher = (variables: CreateDocumentNumberingConfigMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateDocumentNumberingConfigMutation, CreateDocumentNumberingConfigMutationVariables>(CreateDocumentNumberingConfigDocument, variables, options);

export const UpdateDocumentNumberingConfigDocument = new TypedDocumentString(`
    mutation UpdateDocumentNumberingConfig($input: UpdateDocumentNumberingConfigInput!) {
  updateDocumentNumberingConfig(input: $input) {
    documentNumberingConfig {
      rowId
      globalPrefix
      prefix
      separator
      dateFormat
      idStrategy
      sequentialPadding
      randomLength
    }
  }
}
    `);

export const useUpdateDocumentNumberingConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateDocumentNumberingConfigMutation, TError, UpdateDocumentNumberingConfigMutationVariables, TContext>) => {
    
    return useMutation<UpdateDocumentNumberingConfigMutation, TError, UpdateDocumentNumberingConfigMutationVariables, TContext>(
      {
    mutationKey: ['UpdateDocumentNumberingConfig'],
    mutationFn: (variables?: UpdateDocumentNumberingConfigMutationVariables) => graphqlFetch<UpdateDocumentNumberingConfigMutation, UpdateDocumentNumberingConfigMutationVariables>(UpdateDocumentNumberingConfigDocument, variables)(),
    ...options
  }
    )};

useUpdateDocumentNumberingConfigMutation.getKey = () => ['UpdateDocumentNumberingConfig'];


useUpdateDocumentNumberingConfigMutation.fetcher = (variables: UpdateDocumentNumberingConfigMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateDocumentNumberingConfigMutation, UpdateDocumentNumberingConfigMutationVariables>(UpdateDocumentNumberingConfigDocument, variables, options);

export const DeleteDocumentNumberingConfigDocument = new TypedDocumentString(`
    mutation DeleteDocumentNumberingConfig($input: DeleteDocumentNumberingConfigInput!) {
  deleteDocumentNumberingConfig(input: $input) {
    deletedDocumentNumberingConfigId
  }
}
    `);

export const useDeleteDocumentNumberingConfigMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteDocumentNumberingConfigMutation, TError, DeleteDocumentNumberingConfigMutationVariables, TContext>) => {
    
    return useMutation<DeleteDocumentNumberingConfigMutation, TError, DeleteDocumentNumberingConfigMutationVariables, TContext>(
      {
    mutationKey: ['DeleteDocumentNumberingConfig'],
    mutationFn: (variables?: DeleteDocumentNumberingConfigMutationVariables) => graphqlFetch<DeleteDocumentNumberingConfigMutation, DeleteDocumentNumberingConfigMutationVariables>(DeleteDocumentNumberingConfigDocument, variables)(),
    ...options
  }
    )};

useDeleteDocumentNumberingConfigMutation.getKey = () => ['DeleteDocumentNumberingConfig'];


useDeleteDocumentNumberingConfigMutation.fetcher = (variables: DeleteDocumentNumberingConfigMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteDocumentNumberingConfigMutation, DeleteDocumentNumberingConfigMutationVariables>(DeleteDocumentNumberingConfigDocument, variables, options);

export const GenerateDocumentNumberDocument = new TypedDocumentString(`
    mutation GenerateDocumentNumber($input: GenerateDocumentNumberInput!) {
  generateDocumentNumber(input: $input) {
    documentNumber
  }
}
    `);

export const useGenerateDocumentNumberMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<GenerateDocumentNumberMutation, TError, GenerateDocumentNumberMutationVariables, TContext>) => {
    
    return useMutation<GenerateDocumentNumberMutation, TError, GenerateDocumentNumberMutationVariables, TContext>(
      {
    mutationKey: ['GenerateDocumentNumber'],
    mutationFn: (variables?: GenerateDocumentNumberMutationVariables) => graphqlFetch<GenerateDocumentNumberMutation, GenerateDocumentNumberMutationVariables>(GenerateDocumentNumberDocument, variables)(),
    ...options
  }
    )};

useGenerateDocumentNumberMutation.getKey = () => ['GenerateDocumentNumber'];


useGenerateDocumentNumberMutation.fetcher = (variables: GenerateDocumentNumberMutationVariables, options?: RequestInit['headers']) => graphqlFetch<GenerateDocumentNumberMutation, GenerateDocumentNumberMutationVariables>(GenerateDocumentNumberDocument, variables, options);

export const AllInvoicesDocument = new TypedDocumentString(`
    query AllInvoices($organizationId: String!) {
  invoices(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
      invoiceNumber
      companyId
      contactId
      billTo
      status
      issueDate
      dueDate
      notes
      subtotal
      taxRate
      taxAmount
      total
      currency
      paidAt
      paymentReference
      paymentLinkUrl
      createdAt
      updatedAt
      company {
        rowId
        name
      }
      contact {
        rowId
        firstName
        lastName
      }
      invoiceLineItems {
        nodes {
          rowId
          invoiceId
          productId
          description
          quantity
          unitPrice
          amount
          sortOrder
        }
      }
      payments {
        nodes {
          rowId
          invoiceId
          amount
          paidAt
          reference
          method
        }
      }
    }
  }
}
    `);

export const useAllInvoicesQuery = <
      TData = AllInvoicesQuery,
      TError = unknown
    >(
      variables: AllInvoicesQueryVariables,
      options?: Omit<UseQueryOptions<AllInvoicesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AllInvoicesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AllInvoicesQuery, TError, TData>(
      {
    queryKey: ['AllInvoices', variables],
    queryFn: graphqlFetch<AllInvoicesQuery, AllInvoicesQueryVariables>(AllInvoicesDocument, variables),
    ...options
  }
    )};

useAllInvoicesQuery.getKey = (variables: AllInvoicesQueryVariables) => ['AllInvoices', variables];

export const useSuspenseAllInvoicesQuery = <
      TData = AllInvoicesQuery,
      TError = unknown
    >(
      variables: AllInvoicesQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AllInvoicesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AllInvoicesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AllInvoicesQuery, TError, TData>(
      {
    queryKey: ['AllInvoices', variables],
    queryFn: graphqlFetch<AllInvoicesQuery, AllInvoicesQueryVariables>(AllInvoicesDocument, variables),
    ...options
  }
    )};

useSuspenseAllInvoicesQuery.getKey = (variables: AllInvoicesQueryVariables) => ['AllInvoices', variables];

export const useInfiniteAllInvoicesQuery = <
      TData = InfiniteData<AllInvoicesQuery>,
      TError = unknown
    >(
      variables: AllInvoicesQueryVariables,
      options: Omit<UseInfiniteQueryOptions<AllInvoicesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<AllInvoicesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<AllInvoicesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllInvoices.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllInvoicesQuery, AllInvoicesQueryVariables>(AllInvoicesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteAllInvoicesQuery.getKey = (variables: AllInvoicesQueryVariables) => ['AllInvoices.infinite', variables];

export const useSuspenseInfiniteAllInvoicesQuery = <
      TData = InfiniteData<AllInvoicesQuery>,
      TError = unknown
    >(
      variables: AllInvoicesQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<AllInvoicesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<AllInvoicesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<AllInvoicesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllInvoices.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllInvoicesQuery, AllInvoicesQueryVariables>(AllInvoicesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteAllInvoicesQuery.getKey = (variables: AllInvoicesQueryVariables) => ['AllInvoices.infinite', variables];


useAllInvoicesQuery.fetcher = (variables: AllInvoicesQueryVariables, options?: RequestInit['headers']) => graphqlFetch<AllInvoicesQuery, AllInvoicesQueryVariables>(AllInvoicesDocument, variables, options);

export const CreateInvoiceDocument = new TypedDocumentString(`
    mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    invoice {
      rowId
      invoiceNumber
    }
  }
}
    `);

export const useCreateInvoiceMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateInvoiceMutation, TError, CreateInvoiceMutationVariables, TContext>) => {
    
    return useMutation<CreateInvoiceMutation, TError, CreateInvoiceMutationVariables, TContext>(
      {
    mutationKey: ['CreateInvoice'],
    mutationFn: (variables?: CreateInvoiceMutationVariables) => graphqlFetch<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, variables)(),
    ...options
  }
    )};

useCreateInvoiceMutation.getKey = () => ['CreateInvoice'];


useCreateInvoiceMutation.fetcher = (variables: CreateInvoiceMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, variables, options);

export const UpdateInvoiceDocument = new TypedDocumentString(`
    mutation UpdateInvoice($input: UpdateInvoiceInput!) {
  updateInvoice(input: $input) {
    invoice {
      rowId
      invoiceNumber
    }
  }
}
    `);

export const useUpdateInvoiceMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateInvoiceMutation, TError, UpdateInvoiceMutationVariables, TContext>) => {
    
    return useMutation<UpdateInvoiceMutation, TError, UpdateInvoiceMutationVariables, TContext>(
      {
    mutationKey: ['UpdateInvoice'],
    mutationFn: (variables?: UpdateInvoiceMutationVariables) => graphqlFetch<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>(UpdateInvoiceDocument, variables)(),
    ...options
  }
    )};

useUpdateInvoiceMutation.getKey = () => ['UpdateInvoice'];


useUpdateInvoiceMutation.fetcher = (variables: UpdateInvoiceMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>(UpdateInvoiceDocument, variables, options);

export const DeleteInvoiceDocument = new TypedDocumentString(`
    mutation DeleteInvoice($input: DeleteInvoiceInput!) {
  deleteInvoice(input: $input) {
    deletedInvoiceId
  }
}
    `);

export const useDeleteInvoiceMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteInvoiceMutation, TError, DeleteInvoiceMutationVariables, TContext>) => {
    
    return useMutation<DeleteInvoiceMutation, TError, DeleteInvoiceMutationVariables, TContext>(
      {
    mutationKey: ['DeleteInvoice'],
    mutationFn: (variables?: DeleteInvoiceMutationVariables) => graphqlFetch<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>(DeleteInvoiceDocument, variables)(),
    ...options
  }
    )};

useDeleteInvoiceMutation.getKey = () => ['DeleteInvoice'];


useDeleteInvoiceMutation.fetcher = (variables: DeleteInvoiceMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>(DeleteInvoiceDocument, variables, options);

export const CreateInvoiceLineItemDocument = new TypedDocumentString(`
    mutation CreateInvoiceLineItem($input: CreateInvoiceLineItemInput!) {
  createInvoiceLineItem(input: $input) {
    invoiceLineItem {
      rowId
    }
  }
}
    `);

export const useCreateInvoiceLineItemMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateInvoiceLineItemMutation, TError, CreateInvoiceLineItemMutationVariables, TContext>) => {
    
    return useMutation<CreateInvoiceLineItemMutation, TError, CreateInvoiceLineItemMutationVariables, TContext>(
      {
    mutationKey: ['CreateInvoiceLineItem'],
    mutationFn: (variables?: CreateInvoiceLineItemMutationVariables) => graphqlFetch<CreateInvoiceLineItemMutation, CreateInvoiceLineItemMutationVariables>(CreateInvoiceLineItemDocument, variables)(),
    ...options
  }
    )};

useCreateInvoiceLineItemMutation.getKey = () => ['CreateInvoiceLineItem'];


useCreateInvoiceLineItemMutation.fetcher = (variables: CreateInvoiceLineItemMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateInvoiceLineItemMutation, CreateInvoiceLineItemMutationVariables>(CreateInvoiceLineItemDocument, variables, options);

export const DeleteInvoiceLineItemDocument = new TypedDocumentString(`
    mutation DeleteInvoiceLineItem($input: DeleteInvoiceLineItemInput!) {
  deleteInvoiceLineItem(input: $input) {
    deletedInvoiceLineItemId
  }
}
    `);

export const useDeleteInvoiceLineItemMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteInvoiceLineItemMutation, TError, DeleteInvoiceLineItemMutationVariables, TContext>) => {
    
    return useMutation<DeleteInvoiceLineItemMutation, TError, DeleteInvoiceLineItemMutationVariables, TContext>(
      {
    mutationKey: ['DeleteInvoiceLineItem'],
    mutationFn: (variables?: DeleteInvoiceLineItemMutationVariables) => graphqlFetch<DeleteInvoiceLineItemMutation, DeleteInvoiceLineItemMutationVariables>(DeleteInvoiceLineItemDocument, variables)(),
    ...options
  }
    )};

useDeleteInvoiceLineItemMutation.getKey = () => ['DeleteInvoiceLineItem'];


useDeleteInvoiceLineItemMutation.fetcher = (variables: DeleteInvoiceLineItemMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteInvoiceLineItemMutation, DeleteInvoiceLineItemMutationVariables>(DeleteInvoiceLineItemDocument, variables, options);

export const CreatePaymentDocument = new TypedDocumentString(`
    mutation CreatePayment($input: CreatePaymentInput!) {
  createPayment(input: $input) {
    payment {
      rowId
    }
  }
}
    `);

export const useCreatePaymentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePaymentMutation, TError, CreatePaymentMutationVariables, TContext>) => {
    
    return useMutation<CreatePaymentMutation, TError, CreatePaymentMutationVariables, TContext>(
      {
    mutationKey: ['CreatePayment'],
    mutationFn: (variables?: CreatePaymentMutationVariables) => graphqlFetch<CreatePaymentMutation, CreatePaymentMutationVariables>(CreatePaymentDocument, variables)(),
    ...options
  }
    )};

useCreatePaymentMutation.getKey = () => ['CreatePayment'];


useCreatePaymentMutation.fetcher = (variables: CreatePaymentMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreatePaymentMutation, CreatePaymentMutationVariables>(CreatePaymentDocument, variables, options);

export const DeletePaymentDocument = new TypedDocumentString(`
    mutation DeletePayment($input: DeletePaymentInput!) {
  deletePayment(input: $input) {
    deletedPaymentId
  }
}
    `);

export const useDeletePaymentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeletePaymentMutation, TError, DeletePaymentMutationVariables, TContext>) => {
    
    return useMutation<DeletePaymentMutation, TError, DeletePaymentMutationVariables, TContext>(
      {
    mutationKey: ['DeletePayment'],
    mutationFn: (variables?: DeletePaymentMutationVariables) => graphqlFetch<DeletePaymentMutation, DeletePaymentMutationVariables>(DeletePaymentDocument, variables)(),
    ...options
  }
    )};

useDeletePaymentMutation.getKey = () => ['DeletePayment'];


useDeletePaymentMutation.fetcher = (variables: DeletePaymentMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeletePaymentMutation, DeletePaymentMutationVariables>(DeletePaymentDocument, variables, options);

export const AllPeopleDocument = new TypedDocumentString(`
    query AllPeople($organizationId: String!) {
  people(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
      firstName
      lastName
      emails
      phone
      internal
      avatarUrl
      tags
      notes
      createdAt
      updatedAt
    }
  }
}
    `);

export const useAllPeopleQuery = <
      TData = AllPeopleQuery,
      TError = unknown
    >(
      variables: AllPeopleQueryVariables,
      options?: Omit<UseQueryOptions<AllPeopleQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AllPeopleQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AllPeopleQuery, TError, TData>(
      {
    queryKey: ['AllPeople', variables],
    queryFn: graphqlFetch<AllPeopleQuery, AllPeopleQueryVariables>(AllPeopleDocument, variables),
    ...options
  }
    )};

useAllPeopleQuery.getKey = (variables: AllPeopleQueryVariables) => ['AllPeople', variables];

export const useSuspenseAllPeopleQuery = <
      TData = AllPeopleQuery,
      TError = unknown
    >(
      variables: AllPeopleQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AllPeopleQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AllPeopleQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AllPeopleQuery, TError, TData>(
      {
    queryKey: ['AllPeople', variables],
    queryFn: graphqlFetch<AllPeopleQuery, AllPeopleQueryVariables>(AllPeopleDocument, variables),
    ...options
  }
    )};

useSuspenseAllPeopleQuery.getKey = (variables: AllPeopleQueryVariables) => ['AllPeople', variables];

export const useInfiniteAllPeopleQuery = <
      TData = InfiniteData<AllPeopleQuery>,
      TError = unknown
    >(
      variables: AllPeopleQueryVariables,
      options: Omit<UseInfiniteQueryOptions<AllPeopleQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<AllPeopleQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<AllPeopleQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllPeople.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllPeopleQuery, AllPeopleQueryVariables>(AllPeopleDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteAllPeopleQuery.getKey = (variables: AllPeopleQueryVariables) => ['AllPeople.infinite', variables];

export const useSuspenseInfiniteAllPeopleQuery = <
      TData = InfiniteData<AllPeopleQuery>,
      TError = unknown
    >(
      variables: AllPeopleQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<AllPeopleQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<AllPeopleQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<AllPeopleQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllPeople.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllPeopleQuery, AllPeopleQueryVariables>(AllPeopleDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteAllPeopleQuery.getKey = (variables: AllPeopleQueryVariables) => ['AllPeople.infinite', variables];


useAllPeopleQuery.fetcher = (variables: AllPeopleQueryVariables, options?: RequestInit['headers']) => graphqlFetch<AllPeopleQuery, AllPeopleQueryVariables>(AllPeopleDocument, variables, options);

export const CreatePersonDocument = new TypedDocumentString(`
    mutation CreatePerson($input: CreatePersonInput!) {
  createPerson(input: $input) {
    person {
      rowId
      firstName
      lastName
    }
  }
}
    `);

export const useCreatePersonMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreatePersonMutation, TError, CreatePersonMutationVariables, TContext>) => {
    
    return useMutation<CreatePersonMutation, TError, CreatePersonMutationVariables, TContext>(
      {
    mutationKey: ['CreatePerson'],
    mutationFn: (variables?: CreatePersonMutationVariables) => graphqlFetch<CreatePersonMutation, CreatePersonMutationVariables>(CreatePersonDocument, variables)(),
    ...options
  }
    )};

useCreatePersonMutation.getKey = () => ['CreatePerson'];


useCreatePersonMutation.fetcher = (variables: CreatePersonMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreatePersonMutation, CreatePersonMutationVariables>(CreatePersonDocument, variables, options);

export const UpdatePersonDocument = new TypedDocumentString(`
    mutation UpdatePerson($input: UpdatePersonInput!) {
  updatePerson(input: $input) {
    person {
      rowId
      firstName
      lastName
    }
  }
}
    `);

export const useUpdatePersonMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdatePersonMutation, TError, UpdatePersonMutationVariables, TContext>) => {
    
    return useMutation<UpdatePersonMutation, TError, UpdatePersonMutationVariables, TContext>(
      {
    mutationKey: ['UpdatePerson'],
    mutationFn: (variables?: UpdatePersonMutationVariables) => graphqlFetch<UpdatePersonMutation, UpdatePersonMutationVariables>(UpdatePersonDocument, variables)(),
    ...options
  }
    )};

useUpdatePersonMutation.getKey = () => ['UpdatePerson'];


useUpdatePersonMutation.fetcher = (variables: UpdatePersonMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdatePersonMutation, UpdatePersonMutationVariables>(UpdatePersonDocument, variables, options);

export const DeletePersonDocument = new TypedDocumentString(`
    mutation DeletePerson($input: DeletePersonInput!) {
  deletePerson(input: $input) {
    deletedPersonId
  }
}
    `);

export const useDeletePersonMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeletePersonMutation, TError, DeletePersonMutationVariables, TContext>) => {
    
    return useMutation<DeletePersonMutation, TError, DeletePersonMutationVariables, TContext>(
      {
    mutationKey: ['DeletePerson'],
    mutationFn: (variables?: DeletePersonMutationVariables) => graphqlFetch<DeletePersonMutation, DeletePersonMutationVariables>(DeletePersonDocument, variables)(),
    ...options
  }
    )};

useDeletePersonMutation.getKey = () => ['DeletePerson'];


useDeletePersonMutation.fetcher = (variables: DeletePersonMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeletePersonMutation, DeletePersonMutationVariables>(DeletePersonDocument, variables, options);

export const AllProductsDocument = new TypedDocumentString(`
    query AllProducts($organizationId: String!) {
  products(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
      name
      description
      sku
      unitPrice
      currentQuantity
      lowStockThreshold
      isActive
      createdAt
      updatedAt
    }
  }
}
    `);

export const useAllProductsQuery = <
      TData = AllProductsQuery,
      TError = unknown
    >(
      variables: AllProductsQueryVariables,
      options?: Omit<UseQueryOptions<AllProductsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AllProductsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AllProductsQuery, TError, TData>(
      {
    queryKey: ['AllProducts', variables],
    queryFn: graphqlFetch<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, variables),
    ...options
  }
    )};

useAllProductsQuery.getKey = (variables: AllProductsQueryVariables) => ['AllProducts', variables];

export const useSuspenseAllProductsQuery = <
      TData = AllProductsQuery,
      TError = unknown
    >(
      variables: AllProductsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AllProductsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AllProductsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AllProductsQuery, TError, TData>(
      {
    queryKey: ['AllProducts', variables],
    queryFn: graphqlFetch<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, variables),
    ...options
  }
    )};

useSuspenseAllProductsQuery.getKey = (variables: AllProductsQueryVariables) => ['AllProducts', variables];

export const useInfiniteAllProductsQuery = <
      TData = InfiniteData<AllProductsQuery>,
      TError = unknown
    >(
      variables: AllProductsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<AllProductsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<AllProductsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<AllProductsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllProducts.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteAllProductsQuery.getKey = (variables: AllProductsQueryVariables) => ['AllProducts.infinite', variables];

export const useSuspenseInfiniteAllProductsQuery = <
      TData = InfiniteData<AllProductsQuery>,
      TError = unknown
    >(
      variables: AllProductsQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<AllProductsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<AllProductsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<AllProductsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllProducts.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteAllProductsQuery.getKey = (variables: AllProductsQueryVariables) => ['AllProducts.infinite', variables];


useAllProductsQuery.fetcher = (variables: AllProductsQueryVariables, options?: RequestInit['headers']) => graphqlFetch<AllProductsQuery, AllProductsQueryVariables>(AllProductsDocument, variables, options);

export const CreateProductDocument = new TypedDocumentString(`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    product {
      rowId
      name
    }
  }
}
    `);

export const useCreateProductMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateProductMutation, TError, CreateProductMutationVariables, TContext>) => {
    
    return useMutation<CreateProductMutation, TError, CreateProductMutationVariables, TContext>(
      {
    mutationKey: ['CreateProduct'],
    mutationFn: (variables?: CreateProductMutationVariables) => graphqlFetch<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, variables)(),
    ...options
  }
    )};

useCreateProductMutation.getKey = () => ['CreateProduct'];


useCreateProductMutation.fetcher = (variables: CreateProductMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, variables, options);

export const UpdateProductDocument = new TypedDocumentString(`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    product {
      rowId
      name
    }
  }
}
    `);

export const useUpdateProductMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateProductMutation, TError, UpdateProductMutationVariables, TContext>) => {
    
    return useMutation<UpdateProductMutation, TError, UpdateProductMutationVariables, TContext>(
      {
    mutationKey: ['UpdateProduct'],
    mutationFn: (variables?: UpdateProductMutationVariables) => graphqlFetch<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, variables)(),
    ...options
  }
    )};

useUpdateProductMutation.getKey = () => ['UpdateProduct'];


useUpdateProductMutation.fetcher = (variables: UpdateProductMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateProductMutation, UpdateProductMutationVariables>(UpdateProductDocument, variables, options);

export const DeleteProductDocument = new TypedDocumentString(`
    mutation DeleteProduct($input: DeleteProductInput!) {
  deleteProduct(input: $input) {
    deletedProductId
  }
}
    `);

export const useDeleteProductMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteProductMutation, TError, DeleteProductMutationVariables, TContext>) => {
    
    return useMutation<DeleteProductMutation, TError, DeleteProductMutationVariables, TContext>(
      {
    mutationKey: ['DeleteProduct'],
    mutationFn: (variables?: DeleteProductMutationVariables) => graphqlFetch<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, variables)(),
    ...options
  }
    )};

useDeleteProductMutation.getKey = () => ['DeleteProduct'];


useDeleteProductMutation.fetcher = (variables: DeleteProductMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, variables, options);

export const InventoryAdjustmentsDocument = new TypedDocumentString(`
    query InventoryAdjustments($productId: UUID!) {
  inventoryAdjustments(condition: {productId: $productId}) {
    nodes {
      rowId
      productId
      quantityChange
      reason
      referenceId
      createdAt
    }
  }
}
    `);

export const useInventoryAdjustmentsQuery = <
      TData = InventoryAdjustmentsQuery,
      TError = unknown
    >(
      variables: InventoryAdjustmentsQueryVariables,
      options?: Omit<UseQueryOptions<InventoryAdjustmentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<InventoryAdjustmentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<InventoryAdjustmentsQuery, TError, TData>(
      {
    queryKey: ['InventoryAdjustments', variables],
    queryFn: graphqlFetch<InventoryAdjustmentsQuery, InventoryAdjustmentsQueryVariables>(InventoryAdjustmentsDocument, variables),
    ...options
  }
    )};

useInventoryAdjustmentsQuery.getKey = (variables: InventoryAdjustmentsQueryVariables) => ['InventoryAdjustments', variables];

export const useSuspenseInventoryAdjustmentsQuery = <
      TData = InventoryAdjustmentsQuery,
      TError = unknown
    >(
      variables: InventoryAdjustmentsQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<InventoryAdjustmentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<InventoryAdjustmentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<InventoryAdjustmentsQuery, TError, TData>(
      {
    queryKey: ['InventoryAdjustments', variables],
    queryFn: graphqlFetch<InventoryAdjustmentsQuery, InventoryAdjustmentsQueryVariables>(InventoryAdjustmentsDocument, variables),
    ...options
  }
    )};

useSuspenseInventoryAdjustmentsQuery.getKey = (variables: InventoryAdjustmentsQueryVariables) => ['InventoryAdjustments', variables];

export const useInfiniteInventoryAdjustmentsQuery = <
      TData = InfiniteData<InventoryAdjustmentsQuery>,
      TError = unknown
    >(
      variables: InventoryAdjustmentsQueryVariables,
      options: Omit<UseInfiniteQueryOptions<InventoryAdjustmentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<InventoryAdjustmentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<InventoryAdjustmentsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['InventoryAdjustments.infinite', variables],
      queryFn: (metaData) => graphqlFetch<InventoryAdjustmentsQuery, InventoryAdjustmentsQueryVariables>(InventoryAdjustmentsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteInventoryAdjustmentsQuery.getKey = (variables: InventoryAdjustmentsQueryVariables) => ['InventoryAdjustments.infinite', variables];

export const useSuspenseInfiniteInventoryAdjustmentsQuery = <
      TData = InfiniteData<InventoryAdjustmentsQuery>,
      TError = unknown
    >(
      variables: InventoryAdjustmentsQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<InventoryAdjustmentsQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<InventoryAdjustmentsQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<InventoryAdjustmentsQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['InventoryAdjustments.infinite', variables],
      queryFn: (metaData) => graphqlFetch<InventoryAdjustmentsQuery, InventoryAdjustmentsQueryVariables>(InventoryAdjustmentsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteInventoryAdjustmentsQuery.getKey = (variables: InventoryAdjustmentsQueryVariables) => ['InventoryAdjustments.infinite', variables];


useInventoryAdjustmentsQuery.fetcher = (variables: InventoryAdjustmentsQueryVariables, options?: RequestInit['headers']) => graphqlFetch<InventoryAdjustmentsQuery, InventoryAdjustmentsQueryVariables>(InventoryAdjustmentsDocument, variables, options);

export const CreateInventoryAdjustmentDocument = new TypedDocumentString(`
    mutation CreateInventoryAdjustment($input: CreateInventoryAdjustmentInput!) {
  createInventoryAdjustment(input: $input) {
    inventoryAdjustment {
      rowId
      quantityChange
    }
  }
}
    `);

export const useCreateInventoryAdjustmentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateInventoryAdjustmentMutation, TError, CreateInventoryAdjustmentMutationVariables, TContext>) => {
    
    return useMutation<CreateInventoryAdjustmentMutation, TError, CreateInventoryAdjustmentMutationVariables, TContext>(
      {
    mutationKey: ['CreateInventoryAdjustment'],
    mutationFn: (variables?: CreateInventoryAdjustmentMutationVariables) => graphqlFetch<CreateInventoryAdjustmentMutation, CreateInventoryAdjustmentMutationVariables>(CreateInventoryAdjustmentDocument, variables)(),
    ...options
  }
    )};

useCreateInventoryAdjustmentMutation.getKey = () => ['CreateInventoryAdjustment'];


useCreateInventoryAdjustmentMutation.fetcher = (variables: CreateInventoryAdjustmentMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateInventoryAdjustmentMutation, CreateInventoryAdjustmentMutationVariables>(CreateInventoryAdjustmentDocument, variables, options);

export const AllQuotesDocument = new TypedDocumentString(`
    query AllQuotes($organizationId: String!) {
  quotes(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
      quoteNumber
      companyId
      contactId
      clientName
      clientEmail
      additionalItemsLabel
      title
      description
      status
      validUntil
      projectType
      timeRange
      terms
      additionalTerms
      notes
      subtotal
      taxRate
      taxAmount
      total
      currency
      convertedInvoiceId
      createdAt
      updatedAt
      company {
        rowId
        name
      }
      contact {
        rowId
        firstName
        lastName
      }
      quoteLineItems(orderBy: [SORT_ORDER_ASC]) {
        nodes {
          rowId
          quoteId
          productId
          description
          subtitle
          quantity
          unitPrice
          amount
          pricingType
          estimatedHours
          hourlyRate
          weeklyCapHours
          monthlyCapHours
          maxCapHours
          minimumBillingMinutes
          royaltyPercentage
          royaltyTimeframe
          royaltyTimeframeUnit
          royaltyThreshold
          royaltyBuyoutAmount
          sortOrder
          deliverables
          acceptanceCriteria
        }
      }
    }
  }
}
    `);

export const useAllQuotesQuery = <
      TData = AllQuotesQuery,
      TError = unknown
    >(
      variables: AllQuotesQueryVariables,
      options?: Omit<UseQueryOptions<AllQuotesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<AllQuotesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<AllQuotesQuery, TError, TData>(
      {
    queryKey: ['AllQuotes', variables],
    queryFn: graphqlFetch<AllQuotesQuery, AllQuotesQueryVariables>(AllQuotesDocument, variables),
    ...options
  }
    )};

useAllQuotesQuery.getKey = (variables: AllQuotesQueryVariables) => ['AllQuotes', variables];

export const useSuspenseAllQuotesQuery = <
      TData = AllQuotesQuery,
      TError = unknown
    >(
      variables: AllQuotesQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<AllQuotesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<AllQuotesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<AllQuotesQuery, TError, TData>(
      {
    queryKey: ['AllQuotes', variables],
    queryFn: graphqlFetch<AllQuotesQuery, AllQuotesQueryVariables>(AllQuotesDocument, variables),
    ...options
  }
    )};

useSuspenseAllQuotesQuery.getKey = (variables: AllQuotesQueryVariables) => ['AllQuotes', variables];

export const useInfiniteAllQuotesQuery = <
      TData = InfiniteData<AllQuotesQuery>,
      TError = unknown
    >(
      variables: AllQuotesQueryVariables,
      options: Omit<UseInfiniteQueryOptions<AllQuotesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<AllQuotesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<AllQuotesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllQuotes.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllQuotesQuery, AllQuotesQueryVariables>(AllQuotesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteAllQuotesQuery.getKey = (variables: AllQuotesQueryVariables) => ['AllQuotes.infinite', variables];

export const useSuspenseInfiniteAllQuotesQuery = <
      TData = InfiniteData<AllQuotesQuery>,
      TError = unknown
    >(
      variables: AllQuotesQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<AllQuotesQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<AllQuotesQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<AllQuotesQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['AllQuotes.infinite', variables],
      queryFn: (metaData) => graphqlFetch<AllQuotesQuery, AllQuotesQueryVariables>(AllQuotesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteAllQuotesQuery.getKey = (variables: AllQuotesQueryVariables) => ['AllQuotes.infinite', variables];


useAllQuotesQuery.fetcher = (variables: AllQuotesQueryVariables, options?: RequestInit['headers']) => graphqlFetch<AllQuotesQuery, AllQuotesQueryVariables>(AllQuotesDocument, variables, options);

export const CreateQuoteDocument = new TypedDocumentString(`
    mutation CreateQuote($input: CreateQuoteInput!) {
  createQuote(input: $input) {
    quote {
      rowId
      quoteNumber
    }
  }
}
    `);

export const useCreateQuoteMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateQuoteMutation, TError, CreateQuoteMutationVariables, TContext>) => {
    
    return useMutation<CreateQuoteMutation, TError, CreateQuoteMutationVariables, TContext>(
      {
    mutationKey: ['CreateQuote'],
    mutationFn: (variables?: CreateQuoteMutationVariables) => graphqlFetch<CreateQuoteMutation, CreateQuoteMutationVariables>(CreateQuoteDocument, variables)(),
    ...options
  }
    )};

useCreateQuoteMutation.getKey = () => ['CreateQuote'];


useCreateQuoteMutation.fetcher = (variables: CreateQuoteMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateQuoteMutation, CreateQuoteMutationVariables>(CreateQuoteDocument, variables, options);

export const UpdateQuoteDocument = new TypedDocumentString(`
    mutation UpdateQuote($input: UpdateQuoteInput!) {
  updateQuote(input: $input) {
    quote {
      rowId
      quoteNumber
    }
  }
}
    `);

export const useUpdateQuoteMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateQuoteMutation, TError, UpdateQuoteMutationVariables, TContext>) => {
    
    return useMutation<UpdateQuoteMutation, TError, UpdateQuoteMutationVariables, TContext>(
      {
    mutationKey: ['UpdateQuote'],
    mutationFn: (variables?: UpdateQuoteMutationVariables) => graphqlFetch<UpdateQuoteMutation, UpdateQuoteMutationVariables>(UpdateQuoteDocument, variables)(),
    ...options
  }
    )};

useUpdateQuoteMutation.getKey = () => ['UpdateQuote'];


useUpdateQuoteMutation.fetcher = (variables: UpdateQuoteMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateQuoteMutation, UpdateQuoteMutationVariables>(UpdateQuoteDocument, variables, options);

export const DeleteQuoteDocument = new TypedDocumentString(`
    mutation DeleteQuote($input: DeleteQuoteInput!) {
  deleteQuote(input: $input) {
    deletedQuoteId
  }
}
    `);

export const useDeleteQuoteMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteQuoteMutation, TError, DeleteQuoteMutationVariables, TContext>) => {
    
    return useMutation<DeleteQuoteMutation, TError, DeleteQuoteMutationVariables, TContext>(
      {
    mutationKey: ['DeleteQuote'],
    mutationFn: (variables?: DeleteQuoteMutationVariables) => graphqlFetch<DeleteQuoteMutation, DeleteQuoteMutationVariables>(DeleteQuoteDocument, variables)(),
    ...options
  }
    )};

useDeleteQuoteMutation.getKey = () => ['DeleteQuote'];


useDeleteQuoteMutation.fetcher = (variables: DeleteQuoteMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteQuoteMutation, DeleteQuoteMutationVariables>(DeleteQuoteDocument, variables, options);

export const CreateQuoteLineItemDocument = new TypedDocumentString(`
    mutation CreateQuoteLineItem($input: CreateQuoteLineItemInput!) {
  createQuoteLineItem(input: $input) {
    quoteLineItem {
      rowId
    }
  }
}
    `);

export const useCreateQuoteLineItemMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateQuoteLineItemMutation, TError, CreateQuoteLineItemMutationVariables, TContext>) => {
    
    return useMutation<CreateQuoteLineItemMutation, TError, CreateQuoteLineItemMutationVariables, TContext>(
      {
    mutationKey: ['CreateQuoteLineItem'],
    mutationFn: (variables?: CreateQuoteLineItemMutationVariables) => graphqlFetch<CreateQuoteLineItemMutation, CreateQuoteLineItemMutationVariables>(CreateQuoteLineItemDocument, variables)(),
    ...options
  }
    )};

useCreateQuoteLineItemMutation.getKey = () => ['CreateQuoteLineItem'];


useCreateQuoteLineItemMutation.fetcher = (variables: CreateQuoteLineItemMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateQuoteLineItemMutation, CreateQuoteLineItemMutationVariables>(CreateQuoteLineItemDocument, variables, options);

export const DeleteQuoteLineItemDocument = new TypedDocumentString(`
    mutation DeleteQuoteLineItem($input: DeleteQuoteLineItemInput!) {
  deleteQuoteLineItem(input: $input) {
    deletedQuoteLineItemId
  }
}
    `);

export const useDeleteQuoteLineItemMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<DeleteQuoteLineItemMutation, TError, DeleteQuoteLineItemMutationVariables, TContext>) => {
    
    return useMutation<DeleteQuoteLineItemMutation, TError, DeleteQuoteLineItemMutationVariables, TContext>(
      {
    mutationKey: ['DeleteQuoteLineItem'],
    mutationFn: (variables?: DeleteQuoteLineItemMutationVariables) => graphqlFetch<DeleteQuoteLineItemMutation, DeleteQuoteLineItemMutationVariables>(DeleteQuoteLineItemDocument, variables)(),
    ...options
  }
    )};

useDeleteQuoteLineItemMutation.getKey = () => ['DeleteQuoteLineItem'];


useDeleteQuoteLineItemMutation.fetcher = (variables: DeleteQuoteLineItemMutationVariables, options?: RequestInit['headers']) => graphqlFetch<DeleteQuoteLineItemMutation, DeleteQuoteLineItemMutationVariables>(DeleteQuoteLineItemDocument, variables, options);

export const ConvertQuoteToInvoiceDocument = new TypedDocumentString(`
    mutation ConvertQuoteToInvoice($input: ConvertQuoteToInvoiceInput!) {
  convertQuoteToInvoice(input: $input) {
    invoiceId
    invoiceNumber
    skippedLineItems {
      rowId
      description
      pricingType
    }
  }
}
    `);

export const useConvertQuoteToInvoiceMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ConvertQuoteToInvoiceMutation, TError, ConvertQuoteToInvoiceMutationVariables, TContext>) => {
    
    return useMutation<ConvertQuoteToInvoiceMutation, TError, ConvertQuoteToInvoiceMutationVariables, TContext>(
      {
    mutationKey: ['ConvertQuoteToInvoice'],
    mutationFn: (variables?: ConvertQuoteToInvoiceMutationVariables) => graphqlFetch<ConvertQuoteToInvoiceMutation, ConvertQuoteToInvoiceMutationVariables>(ConvertQuoteToInvoiceDocument, variables)(),
    ...options
  }
    )};

useConvertQuoteToInvoiceMutation.getKey = () => ['ConvertQuoteToInvoice'];


useConvertQuoteToInvoiceMutation.fetcher = (variables: ConvertQuoteToInvoiceMutationVariables, options?: RequestInit['headers']) => graphqlFetch<ConvertQuoteToInvoiceMutation, ConvertQuoteToInvoiceMutationVariables>(ConvertQuoteToInvoiceDocument, variables, options);

export const WorkspaceProfileDocument = new TypedDocumentString(`
    query WorkspaceProfile($organizationId: String!) {
  organizationSettings(condition: {organizationId: $organizationId}, first: 1) {
    nodes {
      ...WorkspaceProfileFields
    }
  }
}
    fragment WorkspaceProfileFields on OrganizationSetting {
  rowId
  organizationId
  accentColor
  companyName
  contactName
  contactTitle
  email
  phone
  website
  addressLine1
  addressLine2
  city
  state
  postalCode
  country
  logoUrl
  registrationState
  createdAt
  updatedAt
}`);

export const useWorkspaceProfileQuery = <
      TData = WorkspaceProfileQuery,
      TError = unknown
    >(
      variables: WorkspaceProfileQueryVariables,
      options?: Omit<UseQueryOptions<WorkspaceProfileQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<WorkspaceProfileQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<WorkspaceProfileQuery, TError, TData>(
      {
    queryKey: ['WorkspaceProfile', variables],
    queryFn: graphqlFetch<WorkspaceProfileQuery, WorkspaceProfileQueryVariables>(WorkspaceProfileDocument, variables),
    ...options
  }
    )};

useWorkspaceProfileQuery.getKey = (variables: WorkspaceProfileQueryVariables) => ['WorkspaceProfile', variables];

export const useSuspenseWorkspaceProfileQuery = <
      TData = WorkspaceProfileQuery,
      TError = unknown
    >(
      variables: WorkspaceProfileQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<WorkspaceProfileQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<WorkspaceProfileQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<WorkspaceProfileQuery, TError, TData>(
      {
    queryKey: ['WorkspaceProfile', variables],
    queryFn: graphqlFetch<WorkspaceProfileQuery, WorkspaceProfileQueryVariables>(WorkspaceProfileDocument, variables),
    ...options
  }
    )};

useSuspenseWorkspaceProfileQuery.getKey = (variables: WorkspaceProfileQueryVariables) => ['WorkspaceProfile', variables];

export const useInfiniteWorkspaceProfileQuery = <
      TData = InfiniteData<WorkspaceProfileQuery>,
      TError = unknown
    >(
      variables: WorkspaceProfileQueryVariables,
      options: Omit<UseInfiniteQueryOptions<WorkspaceProfileQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<WorkspaceProfileQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<WorkspaceProfileQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['WorkspaceProfile.infinite', variables],
      queryFn: (metaData) => graphqlFetch<WorkspaceProfileQuery, WorkspaceProfileQueryVariables>(WorkspaceProfileDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteWorkspaceProfileQuery.getKey = (variables: WorkspaceProfileQueryVariables) => ['WorkspaceProfile.infinite', variables];

export const useSuspenseInfiniteWorkspaceProfileQuery = <
      TData = InfiniteData<WorkspaceProfileQuery>,
      TError = unknown
    >(
      variables: WorkspaceProfileQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<WorkspaceProfileQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<WorkspaceProfileQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<WorkspaceProfileQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['WorkspaceProfile.infinite', variables],
      queryFn: (metaData) => graphqlFetch<WorkspaceProfileQuery, WorkspaceProfileQueryVariables>(WorkspaceProfileDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteWorkspaceProfileQuery.getKey = (variables: WorkspaceProfileQueryVariables) => ['WorkspaceProfile.infinite', variables];


useWorkspaceProfileQuery.fetcher = (variables: WorkspaceProfileQueryVariables, options?: RequestInit['headers']) => graphqlFetch<WorkspaceProfileQuery, WorkspaceProfileQueryVariables>(WorkspaceProfileDocument, variables, options);

export const CreateWorkspaceProfileDocument = new TypedDocumentString(`
    mutation CreateWorkspaceProfile($input: CreateOrganizationSettingInput!) {
  createOrganizationSetting(input: $input) {
    organizationSetting {
      ...WorkspaceProfileFields
    }
  }
}
    fragment WorkspaceProfileFields on OrganizationSetting {
  rowId
  organizationId
  accentColor
  companyName
  contactName
  contactTitle
  email
  phone
  website
  addressLine1
  addressLine2
  city
  state
  postalCode
  country
  logoUrl
  registrationState
  createdAt
  updatedAt
}`);

export const useCreateWorkspaceProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CreateWorkspaceProfileMutation, TError, CreateWorkspaceProfileMutationVariables, TContext>) => {
    
    return useMutation<CreateWorkspaceProfileMutation, TError, CreateWorkspaceProfileMutationVariables, TContext>(
      {
    mutationKey: ['CreateWorkspaceProfile'],
    mutationFn: (variables?: CreateWorkspaceProfileMutationVariables) => graphqlFetch<CreateWorkspaceProfileMutation, CreateWorkspaceProfileMutationVariables>(CreateWorkspaceProfileDocument, variables)(),
    ...options
  }
    )};

useCreateWorkspaceProfileMutation.getKey = () => ['CreateWorkspaceProfile'];


useCreateWorkspaceProfileMutation.fetcher = (variables: CreateWorkspaceProfileMutationVariables, options?: RequestInit['headers']) => graphqlFetch<CreateWorkspaceProfileMutation, CreateWorkspaceProfileMutationVariables>(CreateWorkspaceProfileDocument, variables, options);

export const UpdateWorkspaceProfileDocument = new TypedDocumentString(`
    mutation UpdateWorkspaceProfile($input: UpdateOrganizationSettingInput!) {
  updateOrganizationSetting(input: $input) {
    organizationSetting {
      ...WorkspaceProfileFields
    }
  }
}
    fragment WorkspaceProfileFields on OrganizationSetting {
  rowId
  organizationId
  accentColor
  companyName
  contactName
  contactTitle
  email
  phone
  website
  addressLine1
  addressLine2
  city
  state
  postalCode
  country
  logoUrl
  registrationState
  createdAt
  updatedAt
}`);

export const useUpdateWorkspaceProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<UpdateWorkspaceProfileMutation, TError, UpdateWorkspaceProfileMutationVariables, TContext>) => {
    
    return useMutation<UpdateWorkspaceProfileMutation, TError, UpdateWorkspaceProfileMutationVariables, TContext>(
      {
    mutationKey: ['UpdateWorkspaceProfile'],
    mutationFn: (variables?: UpdateWorkspaceProfileMutationVariables) => graphqlFetch<UpdateWorkspaceProfileMutation, UpdateWorkspaceProfileMutationVariables>(UpdateWorkspaceProfileDocument, variables)(),
    ...options
  }
    )};

useUpdateWorkspaceProfileMutation.getKey = () => ['UpdateWorkspaceProfile'];


useUpdateWorkspaceProfileMutation.fetcher = (variables: UpdateWorkspaceProfileMutationVariables, options?: RequestInit['headers']) => graphqlFetch<UpdateWorkspaceProfileMutation, UpdateWorkspaceProfileMutationVariables>(UpdateWorkspaceProfileDocument, variables, options);

export const WorkspacePlanDocument = new TypedDocumentString(`
    query WorkspacePlan($organizationId: String!) {
  workspacePlan(organizationId: $organizationId) {
    tier
    source
    limits {
      key
      limit
      used
    }
  }
}
    `);

export const useWorkspacePlanQuery = <
      TData = WorkspacePlanQuery,
      TError = unknown
    >(
      variables: WorkspacePlanQueryVariables,
      options?: Omit<UseQueryOptions<WorkspacePlanQuery, TError, TData>, 'queryKey'> & { queryKey?: UseQueryOptions<WorkspacePlanQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useQuery<WorkspacePlanQuery, TError, TData>(
      {
    queryKey: ['WorkspacePlan', variables],
    queryFn: graphqlFetch<WorkspacePlanQuery, WorkspacePlanQueryVariables>(WorkspacePlanDocument, variables),
    ...options
  }
    )};

useWorkspacePlanQuery.getKey = (variables: WorkspacePlanQueryVariables) => ['WorkspacePlan', variables];

export const useSuspenseWorkspacePlanQuery = <
      TData = WorkspacePlanQuery,
      TError = unknown
    >(
      variables: WorkspacePlanQueryVariables,
      options?: Omit<UseSuspenseQueryOptions<WorkspacePlanQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseQueryOptions<WorkspacePlanQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseQuery<WorkspacePlanQuery, TError, TData>(
      {
    queryKey: ['WorkspacePlan', variables],
    queryFn: graphqlFetch<WorkspacePlanQuery, WorkspacePlanQueryVariables>(WorkspacePlanDocument, variables),
    ...options
  }
    )};

useSuspenseWorkspacePlanQuery.getKey = (variables: WorkspacePlanQueryVariables) => ['WorkspacePlan', variables];

export const useInfiniteWorkspacePlanQuery = <
      TData = InfiniteData<WorkspacePlanQuery>,
      TError = unknown
    >(
      variables: WorkspacePlanQueryVariables,
      options: Omit<UseInfiniteQueryOptions<WorkspacePlanQuery, TError, TData>, 'queryKey'> & { queryKey?: UseInfiniteQueryOptions<WorkspacePlanQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useInfiniteQuery<WorkspacePlanQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['WorkspacePlan.infinite', variables],
      queryFn: (metaData) => graphqlFetch<WorkspacePlanQuery, WorkspacePlanQueryVariables>(WorkspacePlanDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useInfiniteWorkspacePlanQuery.getKey = (variables: WorkspacePlanQueryVariables) => ['WorkspacePlan.infinite', variables];

export const useSuspenseInfiniteWorkspacePlanQuery = <
      TData = InfiniteData<WorkspacePlanQuery>,
      TError = unknown
    >(
      variables: WorkspacePlanQueryVariables,
      options: Omit<UseSuspenseInfiniteQueryOptions<WorkspacePlanQuery, TError, TData>, 'queryKey'> & { queryKey?: UseSuspenseInfiniteQueryOptions<WorkspacePlanQuery, TError, TData>['queryKey'] }
    ) => {
    
    return useSuspenseInfiniteQuery<WorkspacePlanQuery, TError, TData>(
      (() => {
    const { queryKey: optionsQueryKey, ...restOptions } = options;
    return {
      queryKey: optionsQueryKey ?? ['WorkspacePlan.infinite', variables],
      queryFn: (metaData) => graphqlFetch<WorkspacePlanQuery, WorkspacePlanQueryVariables>(WorkspacePlanDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      ...restOptions
    }
  })()
    )};

useSuspenseInfiniteWorkspacePlanQuery.getKey = (variables: WorkspacePlanQueryVariables) => ['WorkspacePlan.infinite', variables];


useWorkspacePlanQuery.fetcher = (variables: WorkspacePlanQueryVariables, options?: RequestInit['headers']) => graphqlFetch<WorkspacePlanQuery, WorkspacePlanQueryVariables>(WorkspacePlanDocument, variables, options);
