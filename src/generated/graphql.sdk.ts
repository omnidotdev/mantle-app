// @ts-nocheck
import { GraphQLClient, type RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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
  customFields?: unknown;
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
  customFields?: unknown;
  email?: string | null | undefined;
  industry?: string | null | undefined;
  name?: string | null | undefined;
  notes?: string | null | undefined;
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

/** All input for the create `CustomField` mutation. */
export type CreateCustomFieldInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** The `CustomField` to be created by this mutation. */
  customField: CustomFieldInput;
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

/** An input for mutations affecting `CustomField` */
export type CustomFieldInput = {
  createdAt?: Date | null | undefined;
  entity: string;
  label: string;
  options?: unknown;
  organizationId: string;
  position?: number | null | undefined;
  rowId?: string | null | undefined;
  type: string;
  updatedAt?: Date | null | undefined;
};

/** Represents an update to a `CustomField`. Fields that are set will be updated. */
export type CustomFieldPatch = {
  createdAt?: Date | null | undefined;
  label?: string | null | undefined;
  options?: unknown;
  position?: number | null | undefined;
  rowId?: string | null | undefined;
  updatedAt?: Date | null | undefined;
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

/** All input for the `deleteCustomField` mutation. */
export type DeleteCustomFieldInput = {
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
  customFields?: unknown;
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
  customFields?: unknown;
  emailConsent?: boolean | null | undefined;
  emails?: Array<string | null | undefined> | null | undefined;
  firstName?: string | null | undefined;
  internal?: boolean | null | undefined;
  lastName?: string | null | undefined;
  notes?: string | null | undefined;
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

/** All input for the `updateCustomField` mutation. */
export type UpdateCustomFieldInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: string | null | undefined;
  /** An object where the defined keys will be set on the `CustomField` being updated. */
  patch: CustomFieldPatch;
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


export type AllCompaniesQuery = { companies: { nodes: Array<{ rowId: string, organizationId: string, name: string, website: string | null, industry: string | null, phone: string | null, email: string | null, addressLine1: string | null, addressLine2: string | null, city: string | null, state: string | null, postalCode: string | null, country: string | null, notes: string | null, customFields: unknown, createdAt: string | null, updatedAt: string | null } | null> } | null };

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

export type CustomFieldsQueryVariables = Exact<{
  organizationId: string;
}>;


export type CustomFieldsQuery = { customFields: { nodes: Array<{ rowId: string, entity: string, label: string, type: string, options: unknown, position: number } | null> } | null };

export type CreateCustomFieldMutationVariables = Exact<{
  input: CreateCustomFieldInput;
}>;


export type CreateCustomFieldMutation = { createCustomField: { customField: { rowId: string } | null } | null };

export type UpdateCustomFieldMutationVariables = Exact<{
  input: UpdateCustomFieldInput;
}>;


export type UpdateCustomFieldMutation = { updateCustomField: { customField: { rowId: string } | null } | null };

export type DeleteCustomFieldMutationVariables = Exact<{
  input: DeleteCustomFieldInput;
}>;


export type DeleteCustomFieldMutation = { deleteCustomField: { deletedCustomFieldId: string | null } | null };

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


export type AllPeopleQuery = { people: { nodes: Array<{ rowId: string, organizationId: string, firstName: string, lastName: string, emails: Array<string | null> | null, phone: string | null, internal: boolean, avatarUrl: string | null, tags: Array<string | null> | null, notes: string | null, customFields: unknown, createdAt: string | null, updatedAt: string | null } | null> } | null };

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

export const WorkspaceProfileFieldsFragmentDoc = gql`
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
    `;
export const AllCompaniesDocument = gql`
    query AllCompanies($organizationId: String!) {
  companies(condition: { organizationId: $organizationId }) {
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
      customFields
      createdAt
      updatedAt
    }
  }
}
    `;
export const CreateCompanyDocument = gql`
    mutation CreateCompany($input: CreateCompanyInput!) {
  createCompany(input: $input) {
    company {
      rowId
      name
    }
  }
}
    `;
export const UpdateCompanyDocument = gql`
    mutation UpdateCompany($input: UpdateCompanyInput!) {
  updateCompany(input: $input) {
    company {
      rowId
      name
    }
  }
}
    `;
export const DeleteCompanyDocument = gql`
    mutation DeleteCompany($input: DeleteCompanyInput!) {
  deleteCompany(input: $input) {
    deletedCompanyId
  }
}
    `;
export const CompanyMembersByCompanyDocument = gql`
    query CompanyMembersByCompany($companyId: UUID!) {
  companyMembers(condition: { companyId: $companyId }) {
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
    `;
export const CompanyMembersByPersonDocument = gql`
    query CompanyMembersByPerson($personId: UUID!) {
  companyMembers(condition: { personId: $personId }) {
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
    `;
export const CreateCompanyMemberDocument = gql`
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
    `;
export const UpdateCompanyMemberDocument = gql`
    mutation UpdateCompanyMember($input: UpdateCompanyMemberInput!) {
  updateCompanyMember(input: $input) {
    companyMember {
      rowId
      title
      isPrimary
    }
  }
}
    `;
export const DeleteCompanyMemberDocument = gql`
    mutation DeleteCompanyMember($input: DeleteCompanyMemberInput!) {
  deleteCompanyMember(input: $input) {
    deletedCompanyMemberId
  }
}
    `;
export const WorkspaceCreditsDocument = gql`
    query WorkspaceCredits($organizationId: String!) {
  creditTransactions(condition: { organizationId: $organizationId }) {
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
    `;
export const ApplyInvoiceCreditDocument = gql`
    mutation ApplyInvoiceCredit($input: ApplyInvoiceCreditInput!) {
  applyInvoiceCredit(input: $input) {
    creditTransactionId
    amountApplied
    remainingCredit
    invoiceOutstanding
  }
}
    `;
export const CustomFieldsDocument = gql`
    query CustomFields($organizationId: String!) {
  customFields(condition: { organizationId: $organizationId }) {
    nodes {
      rowId
      entity
      label
      type
      options
      position
    }
  }
}
    `;
export const CreateCustomFieldDocument = gql`
    mutation CreateCustomField($input: CreateCustomFieldInput!) {
  createCustomField(input: $input) {
    customField {
      rowId
    }
  }
}
    `;
export const UpdateCustomFieldDocument = gql`
    mutation UpdateCustomField($input: UpdateCustomFieldInput!) {
  updateCustomField(input: $input) {
    customField {
      rowId
    }
  }
}
    `;
export const DeleteCustomFieldDocument = gql`
    mutation DeleteCustomField($input: DeleteCustomFieldInput!) {
  deleteCustomField(input: $input) {
    deletedCustomFieldId
  }
}
    `;
export const DocumentNumberingConfigsDocument = gql`
    query DocumentNumberingConfigs($organizationId: String!) {
  documentNumberingConfigs(condition: { organizationId: $organizationId }) {
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
    `;
export const CreateDocumentNumberingConfigDocument = gql`
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
    `;
export const UpdateDocumentNumberingConfigDocument = gql`
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
    `;
export const DeleteDocumentNumberingConfigDocument = gql`
    mutation DeleteDocumentNumberingConfig($input: DeleteDocumentNumberingConfigInput!) {
  deleteDocumentNumberingConfig(input: $input) {
    deletedDocumentNumberingConfigId
  }
}
    `;
export const GenerateDocumentNumberDocument = gql`
    mutation GenerateDocumentNumber($input: GenerateDocumentNumberInput!) {
  generateDocumentNumber(input: $input) {
    documentNumber
  }
}
    `;
export const AllInvoicesDocument = gql`
    query AllInvoices($organizationId: String!) {
  invoices(condition: { organizationId: $organizationId }) {
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
    `;
export const CreateInvoiceDocument = gql`
    mutation CreateInvoice($input: CreateInvoiceInput!) {
  createInvoice(input: $input) {
    invoice {
      rowId
      invoiceNumber
    }
  }
}
    `;
export const UpdateInvoiceDocument = gql`
    mutation UpdateInvoice($input: UpdateInvoiceInput!) {
  updateInvoice(input: $input) {
    invoice {
      rowId
      invoiceNumber
    }
  }
}
    `;
export const DeleteInvoiceDocument = gql`
    mutation DeleteInvoice($input: DeleteInvoiceInput!) {
  deleteInvoice(input: $input) {
    deletedInvoiceId
  }
}
    `;
export const CreateInvoiceLineItemDocument = gql`
    mutation CreateInvoiceLineItem($input: CreateInvoiceLineItemInput!) {
  createInvoiceLineItem(input: $input) {
    invoiceLineItem {
      rowId
    }
  }
}
    `;
export const DeleteInvoiceLineItemDocument = gql`
    mutation DeleteInvoiceLineItem($input: DeleteInvoiceLineItemInput!) {
  deleteInvoiceLineItem(input: $input) {
    deletedInvoiceLineItemId
  }
}
    `;
export const CreatePaymentDocument = gql`
    mutation CreatePayment($input: CreatePaymentInput!) {
  createPayment(input: $input) {
    payment {
      rowId
    }
  }
}
    `;
export const DeletePaymentDocument = gql`
    mutation DeletePayment($input: DeletePaymentInput!) {
  deletePayment(input: $input) {
    deletedPaymentId
  }
}
    `;
export const AllPeopleDocument = gql`
    query AllPeople($organizationId: String!) {
  people(condition: { organizationId: $organizationId }) {
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
      customFields
      createdAt
      updatedAt
    }
  }
}
    `;
export const CreatePersonDocument = gql`
    mutation CreatePerson($input: CreatePersonInput!) {
  createPerson(input: $input) {
    person {
      rowId
      firstName
      lastName
    }
  }
}
    `;
export const UpdatePersonDocument = gql`
    mutation UpdatePerson($input: UpdatePersonInput!) {
  updatePerson(input: $input) {
    person {
      rowId
      firstName
      lastName
    }
  }
}
    `;
export const DeletePersonDocument = gql`
    mutation DeletePerson($input: DeletePersonInput!) {
  deletePerson(input: $input) {
    deletedPersonId
  }
}
    `;
export const AllProductsDocument = gql`
    query AllProducts($organizationId: String!) {
  products(condition: { organizationId: $organizationId }) {
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
    `;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    product {
      rowId
      name
    }
  }
}
    `;
export const UpdateProductDocument = gql`
    mutation UpdateProduct($input: UpdateProductInput!) {
  updateProduct(input: $input) {
    product {
      rowId
      name
    }
  }
}
    `;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($input: DeleteProductInput!) {
  deleteProduct(input: $input) {
    deletedProductId
  }
}
    `;
export const InventoryAdjustmentsDocument = gql`
    query InventoryAdjustments($productId: UUID!) {
  inventoryAdjustments(condition: { productId: $productId }) {
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
    `;
export const CreateInventoryAdjustmentDocument = gql`
    mutation CreateInventoryAdjustment($input: CreateInventoryAdjustmentInput!) {
  createInventoryAdjustment(input: $input) {
    inventoryAdjustment {
      rowId
      quantityChange
    }
  }
}
    `;
export const AllQuotesDocument = gql`
    query AllQuotes($organizationId: String!) {
  quotes(condition: { organizationId: $organizationId }) {
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
    `;
export const CreateQuoteDocument = gql`
    mutation CreateQuote($input: CreateQuoteInput!) {
  createQuote(input: $input) {
    quote {
      rowId
      quoteNumber
    }
  }
}
    `;
export const UpdateQuoteDocument = gql`
    mutation UpdateQuote($input: UpdateQuoteInput!) {
  updateQuote(input: $input) {
    quote {
      rowId
      quoteNumber
    }
  }
}
    `;
export const DeleteQuoteDocument = gql`
    mutation DeleteQuote($input: DeleteQuoteInput!) {
  deleteQuote(input: $input) {
    deletedQuoteId
  }
}
    `;
export const CreateQuoteLineItemDocument = gql`
    mutation CreateQuoteLineItem($input: CreateQuoteLineItemInput!) {
  createQuoteLineItem(input: $input) {
    quoteLineItem {
      rowId
    }
  }
}
    `;
export const DeleteQuoteLineItemDocument = gql`
    mutation DeleteQuoteLineItem($input: DeleteQuoteLineItemInput!) {
  deleteQuoteLineItem(input: $input) {
    deletedQuoteLineItemId
  }
}
    `;
export const ConvertQuoteToInvoiceDocument = gql`
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
    `;
export const WorkspaceProfileDocument = gql`
    query WorkspaceProfile($organizationId: String!) {
  organizationSettings(condition: { organizationId: $organizationId }, first: 1) {
    nodes {
      ...WorkspaceProfileFields
    }
  }
}
    ${WorkspaceProfileFieldsFragmentDoc}`;
export const CreateWorkspaceProfileDocument = gql`
    mutation CreateWorkspaceProfile($input: CreateOrganizationSettingInput!) {
  createOrganizationSetting(input: $input) {
    organizationSetting {
      ...WorkspaceProfileFields
    }
  }
}
    ${WorkspaceProfileFieldsFragmentDoc}`;
export const UpdateWorkspaceProfileDocument = gql`
    mutation UpdateWorkspaceProfile($input: UpdateOrganizationSettingInput!) {
  updateOrganizationSetting(input: $input) {
    organizationSetting {
      ...WorkspaceProfileFields
    }
  }
}
    ${WorkspaceProfileFieldsFragmentDoc}`;
export const WorkspacePlanDocument = gql`
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
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    AllCompanies(variables: AllCompaniesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllCompaniesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllCompaniesQuery>({ document: AllCompaniesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllCompanies', 'query', variables);
    },
    CreateCompany(variables: CreateCompanyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateCompanyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCompanyMutation>({ document: CreateCompanyDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateCompany', 'mutation', variables);
    },
    UpdateCompany(variables: UpdateCompanyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateCompanyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCompanyMutation>({ document: UpdateCompanyDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateCompany', 'mutation', variables);
    },
    DeleteCompany(variables: DeleteCompanyMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteCompanyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCompanyMutation>({ document: DeleteCompanyDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteCompany', 'mutation', variables);
    },
    CompanyMembersByCompany(variables: CompanyMembersByCompanyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CompanyMembersByCompanyQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CompanyMembersByCompanyQuery>({ document: CompanyMembersByCompanyDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CompanyMembersByCompany', 'query', variables);
    },
    CompanyMembersByPerson(variables: CompanyMembersByPersonQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CompanyMembersByPersonQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CompanyMembersByPersonQuery>({ document: CompanyMembersByPersonDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CompanyMembersByPerson', 'query', variables);
    },
    CreateCompanyMember(variables: CreateCompanyMemberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateCompanyMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCompanyMemberMutation>({ document: CreateCompanyMemberDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateCompanyMember', 'mutation', variables);
    },
    UpdateCompanyMember(variables: UpdateCompanyMemberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateCompanyMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCompanyMemberMutation>({ document: UpdateCompanyMemberDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateCompanyMember', 'mutation', variables);
    },
    DeleteCompanyMember(variables: DeleteCompanyMemberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteCompanyMemberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCompanyMemberMutation>({ document: DeleteCompanyMemberDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteCompanyMember', 'mutation', variables);
    },
    WorkspaceCredits(variables: WorkspaceCreditsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkspaceCreditsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkspaceCreditsQuery>({ document: WorkspaceCreditsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WorkspaceCredits', 'query', variables);
    },
    ApplyInvoiceCredit(variables: ApplyInvoiceCreditMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ApplyInvoiceCreditMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ApplyInvoiceCreditMutation>({ document: ApplyInvoiceCreditDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ApplyInvoiceCredit', 'mutation', variables);
    },
    CustomFields(variables: CustomFieldsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CustomFieldsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CustomFieldsQuery>({ document: CustomFieldsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CustomFields', 'query', variables);
    },
    CreateCustomField(variables: CreateCustomFieldMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateCustomFieldMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCustomFieldMutation>({ document: CreateCustomFieldDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateCustomField', 'mutation', variables);
    },
    UpdateCustomField(variables: UpdateCustomFieldMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateCustomFieldMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCustomFieldMutation>({ document: UpdateCustomFieldDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateCustomField', 'mutation', variables);
    },
    DeleteCustomField(variables: DeleteCustomFieldMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteCustomFieldMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCustomFieldMutation>({ document: DeleteCustomFieldDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteCustomField', 'mutation', variables);
    },
    DocumentNumberingConfigs(variables: DocumentNumberingConfigsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DocumentNumberingConfigsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DocumentNumberingConfigsQuery>({ document: DocumentNumberingConfigsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DocumentNumberingConfigs', 'query', variables);
    },
    CreateDocumentNumberingConfig(variables: CreateDocumentNumberingConfigMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateDocumentNumberingConfigMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateDocumentNumberingConfigMutation>({ document: CreateDocumentNumberingConfigDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateDocumentNumberingConfig', 'mutation', variables);
    },
    UpdateDocumentNumberingConfig(variables: UpdateDocumentNumberingConfigMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateDocumentNumberingConfigMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateDocumentNumberingConfigMutation>({ document: UpdateDocumentNumberingConfigDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateDocumentNumberingConfig', 'mutation', variables);
    },
    DeleteDocumentNumberingConfig(variables: DeleteDocumentNumberingConfigMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteDocumentNumberingConfigMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteDocumentNumberingConfigMutation>({ document: DeleteDocumentNumberingConfigDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteDocumentNumberingConfig', 'mutation', variables);
    },
    GenerateDocumentNumber(variables: GenerateDocumentNumberMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GenerateDocumentNumberMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenerateDocumentNumberMutation>({ document: GenerateDocumentNumberDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GenerateDocumentNumber', 'mutation', variables);
    },
    AllInvoices(variables: AllInvoicesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllInvoicesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllInvoicesQuery>({ document: AllInvoicesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllInvoices', 'query', variables);
    },
    CreateInvoice(variables: CreateInvoiceMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateInvoiceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateInvoiceMutation>({ document: CreateInvoiceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateInvoice', 'mutation', variables);
    },
    UpdateInvoice(variables: UpdateInvoiceMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateInvoiceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateInvoiceMutation>({ document: UpdateInvoiceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateInvoice', 'mutation', variables);
    },
    DeleteInvoice(variables: DeleteInvoiceMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteInvoiceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteInvoiceMutation>({ document: DeleteInvoiceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteInvoice', 'mutation', variables);
    },
    CreateInvoiceLineItem(variables: CreateInvoiceLineItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateInvoiceLineItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateInvoiceLineItemMutation>({ document: CreateInvoiceLineItemDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateInvoiceLineItem', 'mutation', variables);
    },
    DeleteInvoiceLineItem(variables: DeleteInvoiceLineItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteInvoiceLineItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteInvoiceLineItemMutation>({ document: DeleteInvoiceLineItemDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteInvoiceLineItem', 'mutation', variables);
    },
    CreatePayment(variables: CreatePaymentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreatePaymentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePaymentMutation>({ document: CreatePaymentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreatePayment', 'mutation', variables);
    },
    DeletePayment(variables: DeletePaymentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletePaymentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePaymentMutation>({ document: DeletePaymentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletePayment', 'mutation', variables);
    },
    AllPeople(variables: AllPeopleQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllPeopleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllPeopleQuery>({ document: AllPeopleDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllPeople', 'query', variables);
    },
    CreatePerson(variables: CreatePersonMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreatePersonMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePersonMutation>({ document: CreatePersonDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreatePerson', 'mutation', variables);
    },
    UpdatePerson(variables: UpdatePersonMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdatePersonMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePersonMutation>({ document: UpdatePersonDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdatePerson', 'mutation', variables);
    },
    DeletePerson(variables: DeletePersonMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletePersonMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePersonMutation>({ document: DeletePersonDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletePerson', 'mutation', variables);
    },
    AllProducts(variables: AllProductsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllProductsQuery>({ document: AllProductsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllProducts', 'query', variables);
    },
    CreateProduct(variables: CreateProductMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateProductMutation>({ document: CreateProductDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateProduct', 'mutation', variables);
    },
    UpdateProduct(variables: UpdateProductMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProductMutation>({ document: UpdateProductDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateProduct', 'mutation', variables);
    },
    DeleteProduct(variables: DeleteProductMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteProductMutation>({ document: DeleteProductDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteProduct', 'mutation', variables);
    },
    InventoryAdjustments(variables: InventoryAdjustmentsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<InventoryAdjustmentsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<InventoryAdjustmentsQuery>({ document: InventoryAdjustmentsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'InventoryAdjustments', 'query', variables);
    },
    CreateInventoryAdjustment(variables: CreateInventoryAdjustmentMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateInventoryAdjustmentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateInventoryAdjustmentMutation>({ document: CreateInventoryAdjustmentDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateInventoryAdjustment', 'mutation', variables);
    },
    AllQuotes(variables: AllQuotesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllQuotesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllQuotesQuery>({ document: AllQuotesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AllQuotes', 'query', variables);
    },
    CreateQuote(variables: CreateQuoteMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateQuoteMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateQuoteMutation>({ document: CreateQuoteDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateQuote', 'mutation', variables);
    },
    UpdateQuote(variables: UpdateQuoteMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateQuoteMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateQuoteMutation>({ document: UpdateQuoteDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateQuote', 'mutation', variables);
    },
    DeleteQuote(variables: DeleteQuoteMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteQuoteMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteQuoteMutation>({ document: DeleteQuoteDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteQuote', 'mutation', variables);
    },
    CreateQuoteLineItem(variables: CreateQuoteLineItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateQuoteLineItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateQuoteLineItemMutation>({ document: CreateQuoteLineItemDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateQuoteLineItem', 'mutation', variables);
    },
    DeleteQuoteLineItem(variables: DeleteQuoteLineItemMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeleteQuoteLineItemMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteQuoteLineItemMutation>({ document: DeleteQuoteLineItemDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeleteQuoteLineItem', 'mutation', variables);
    },
    ConvertQuoteToInvoice(variables: ConvertQuoteToInvoiceMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ConvertQuoteToInvoiceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConvertQuoteToInvoiceMutation>({ document: ConvertQuoteToInvoiceDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ConvertQuoteToInvoice', 'mutation', variables);
    },
    WorkspaceProfile(variables: WorkspaceProfileQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkspaceProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkspaceProfileQuery>({ document: WorkspaceProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WorkspaceProfile', 'query', variables);
    },
    CreateWorkspaceProfile(variables: CreateWorkspaceProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateWorkspaceProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateWorkspaceProfileMutation>({ document: CreateWorkspaceProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateWorkspaceProfile', 'mutation', variables);
    },
    UpdateWorkspaceProfile(variables: UpdateWorkspaceProfileMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateWorkspaceProfileMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateWorkspaceProfileMutation>({ document: UpdateWorkspaceProfileDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateWorkspaceProfile', 'mutation', variables);
    },
    WorkspacePlan(variables: WorkspacePlanQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<WorkspacePlanQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<WorkspacePlanQuery>({ document: WorkspacePlanDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'WorkspacePlan', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;