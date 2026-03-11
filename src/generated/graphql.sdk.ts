// @ts-nocheck
import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigFloat: { input: string; output: string; }
  Cursor: { input: string; output: string; }
  Date: { input: Date; output: string; }
  Datetime: { input: Date; output: string; }
  UUID: { input: string; output: string; }
};

export type Company = Node & {
  __typename?: 'Company';
  addressLine1?: Maybe<Scalars['String']['output']>;
  addressLine2?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMemberConnection;
  country?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  industry?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Invoice`. */
  invoices: InvoiceConnection;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  postalCode?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Quote`. */
  quotes: QuoteConnection;
  rowId: Scalars['UUID']['output'];
  state?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};


export type CompanyCompanyMembersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CompanyMemberCondition>;
  filter?: InputMaybe<CompanyMemberFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CompanyMemberOrderBy>>;
};


export type CompanyInvoicesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<InvoiceCondition>;
  filter?: InputMaybe<InvoiceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InvoiceOrderBy>>;
};


export type CompanyQuotesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<QuoteCondition>;
  filter?: InputMaybe<QuoteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<QuoteOrderBy>>;
};

/** A condition to be used against `Company` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CompanyCondition = {
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Company` values. */
export type CompanyConnection = {
  __typename?: 'CompanyConnection';
  /** A list of edges which contains the `Company` and cursor to aid in pagination. */
  edges: Array<Maybe<CompanyEdge>>;
  /** A list of `Company` objects. */
  nodes: Array<Maybe<Company>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Company` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Company` edge in the connection. */
export type CompanyEdge = {
  __typename?: 'CompanyEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Company` at the end of the edge. */
  node?: Maybe<Company>;
};

/** A filter to be used against `Company` object types. All fields are combined with a logical ‘and.’ */
export type CompanyFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CompanyFilter>>;
  /** Filter by the object’s `companyMembers` relation. */
  companyMembers?: InputMaybe<CompanyToManyCompanyMemberFilter>;
  /** Some related `companyMembers` exist. */
  companyMembersExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `invoices` relation. */
  invoices?: InputMaybe<CompanyToManyInvoiceFilter>;
  /** Some related `invoices` exist. */
  invoicesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<CompanyFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CompanyFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `quotes` relation. */
  quotes?: InputMaybe<CompanyToManyQuoteFilter>;
  /** Some related `quotes` exist. */
  quotesExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Company` */
export type CompanyInput = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

export type CompanyMember = Node & {
  __typename?: 'CompanyMember';
  /** Reads a single `Company` that is related to this `CompanyMember`. */
  company?: Maybe<Company>;
  companyId: Scalars['UUID']['output'];
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  isPrimary?: Maybe<Scalars['Boolean']['output']>;
  /** Reads a single `Person` that is related to this `CompanyMember`. */
  person?: Maybe<Person>;
  personId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `CompanyMember` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type CompanyMemberCondition = {
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `personId` field. */
  personId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `CompanyMember` values. */
export type CompanyMemberConnection = {
  __typename?: 'CompanyMemberConnection';
  /** A list of edges which contains the `CompanyMember` and cursor to aid in pagination. */
  edges: Array<Maybe<CompanyMemberEdge>>;
  /** A list of `CompanyMember` objects. */
  nodes: Array<Maybe<CompanyMember>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `CompanyMember` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `CompanyMember` edge in the connection. */
export type CompanyMemberEdge = {
  __typename?: 'CompanyMemberEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `CompanyMember` at the end of the edge. */
  node?: Maybe<CompanyMember>;
};

/** A filter to be used against `CompanyMember` object types. All fields are combined with a logical ‘and.’ */
export type CompanyMemberFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<CompanyMemberFilter>>;
  /** Filter by the object’s `company` relation. */
  company?: InputMaybe<CompanyFilter>;
  /** Filter by the object’s `companyId` field. */
  companyId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<CompanyMemberFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<CompanyMemberFilter>>;
  /** Filter by the object’s `person` relation. */
  person?: InputMaybe<PersonFilter>;
  /** Filter by the object’s `personId` field. */
  personId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `CompanyMember` */
export type CompanyMemberInput = {
  companyId: Scalars['UUID']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  personId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `CompanyMember`. */
export enum CompanyMemberOrderBy {
  CompanyIdAsc = 'COMPANY_ID_ASC',
  CompanyIdDesc = 'COMPANY_ID_DESC',
  Natural = 'NATURAL',
  PersonIdAsc = 'PERSON_ID_ASC',
  PersonIdDesc = 'PERSON_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `CompanyMember`. Fields that are set will be updated. */
export type CompanyMemberPatch = {
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  isPrimary?: InputMaybe<Scalars['Boolean']['input']>;
  personId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `Company`. */
export enum CompanyOrderBy {
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `Company`. Fields that are set will be updated. */
export type CompanyPatch = {
  addressLine1?: InputMaybe<Scalars['String']['input']>;
  addressLine2?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  industry?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  postalCode?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against many `CompanyMember` object types. All fields are combined with a logical ‘and.’ */
export type CompanyToManyCompanyMemberFilter = {
  /** Every related `CompanyMember` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CompanyMemberFilter>;
  /** No related `CompanyMember` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CompanyMemberFilter>;
  /** Some related `CompanyMember` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CompanyMemberFilter>;
};

/** A filter to be used against many `Invoice` object types. All fields are combined with a logical ‘and.’ */
export type CompanyToManyInvoiceFilter = {
  /** Every related `Invoice` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<InvoiceFilter>;
  /** No related `Invoice` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<InvoiceFilter>;
  /** Some related `Invoice` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<InvoiceFilter>;
};

/** A filter to be used against many `Quote` object types. All fields are combined with a logical ‘and.’ */
export type CompanyToManyQuoteFilter = {
  /** Every related `Quote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<QuoteFilter>;
  /** No related `Quote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<QuoteFilter>;
  /** Some related `Quote` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<QuoteFilter>;
};

/** All input for the create `Company` mutation. */
export type CreateCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Company` to be created by this mutation. */
  company: CompanyInput;
};

/** All input for the create `CompanyMember` mutation. */
export type CreateCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `CompanyMember` to be created by this mutation. */
  companyMember: CompanyMemberInput;
};

/** The output of our create `CompanyMember` mutation. */
export type CreateCompanyMemberPayload = {
  __typename?: 'CreateCompanyMemberPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `CompanyMember` that was created by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMemberEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `CompanyMember` mutation. */
export type CreateCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: Array<CompanyMemberOrderBy>;
};

/** The output of our create `Company` mutation. */
export type CreateCompanyPayload = {
  __typename?: 'CreateCompanyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Company` that was created by this mutation. */
  company?: Maybe<Company>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompanyEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Company` mutation. */
export type CreateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Array<CompanyOrderBy>;
};

/** All input for the create `DocumentNumberingConfig` mutation. */
export type CreateDocumentNumberingConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `DocumentNumberingConfig` to be created by this mutation. */
  documentNumberingConfig: DocumentNumberingConfigInput;
};

/** The output of our create `DocumentNumberingConfig` mutation. */
export type CreateDocumentNumberingConfigPayload = {
  __typename?: 'CreateDocumentNumberingConfigPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `DocumentNumberingConfig` that was created by this mutation. */
  documentNumberingConfig?: Maybe<DocumentNumberingConfig>;
  /** An edge for our `DocumentNumberingConfig`. May be used by Relay 1. */
  documentNumberingConfigEdge?: Maybe<DocumentNumberingConfigEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `DocumentNumberingConfig` mutation. */
export type CreateDocumentNumberingConfigPayloadDocumentNumberingConfigEdgeArgs = {
  orderBy?: Array<DocumentNumberingConfigOrderBy>;
};

/** All input for the create `InventoryAdjustment` mutation. */
export type CreateInventoryAdjustmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `InventoryAdjustment` to be created by this mutation. */
  inventoryAdjustment: InventoryAdjustmentInput;
};

/** The output of our create `InventoryAdjustment` mutation. */
export type CreateInventoryAdjustmentPayload = {
  __typename?: 'CreateInventoryAdjustmentPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `InventoryAdjustment` that was created by this mutation. */
  inventoryAdjustment?: Maybe<InventoryAdjustment>;
  /** An edge for our `InventoryAdjustment`. May be used by Relay 1. */
  inventoryAdjustmentEdge?: Maybe<InventoryAdjustmentEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `InventoryAdjustment` mutation. */
export type CreateInventoryAdjustmentPayloadInventoryAdjustmentEdgeArgs = {
  orderBy?: Array<InventoryAdjustmentOrderBy>;
};

/** All input for the create `Invoice` mutation. */
export type CreateInvoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Invoice` to be created by this mutation. */
  invoice: InvoiceInput;
};

/** All input for the create `InvoiceLineItem` mutation. */
export type CreateInvoiceLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `InvoiceLineItem` to be created by this mutation. */
  invoiceLineItem: InvoiceLineItemInput;
};

/** The output of our create `InvoiceLineItem` mutation. */
export type CreateInvoiceLineItemPayload = {
  __typename?: 'CreateInvoiceLineItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `InvoiceLineItem` that was created by this mutation. */
  invoiceLineItem?: Maybe<InvoiceLineItem>;
  /** An edge for our `InvoiceLineItem`. May be used by Relay 1. */
  invoiceLineItemEdge?: Maybe<InvoiceLineItemEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `InvoiceLineItem` mutation. */
export type CreateInvoiceLineItemPayloadInvoiceLineItemEdgeArgs = {
  orderBy?: Array<InvoiceLineItemOrderBy>;
};

/** The output of our create `Invoice` mutation. */
export type CreateInvoicePayload = {
  __typename?: 'CreateInvoicePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Invoice` that was created by this mutation. */
  invoice?: Maybe<Invoice>;
  /** An edge for our `Invoice`. May be used by Relay 1. */
  invoiceEdge?: Maybe<InvoiceEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Invoice` mutation. */
export type CreateInvoicePayloadInvoiceEdgeArgs = {
  orderBy?: Array<InvoiceOrderBy>;
};

/** All input for the create `OrganizationSetting` mutation. */
export type CreateOrganizationSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `OrganizationSetting` to be created by this mutation. */
  organizationSetting: OrganizationSettingInput;
};

/** The output of our create `OrganizationSetting` mutation. */
export type CreateOrganizationSettingPayload = {
  __typename?: 'CreateOrganizationSettingPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `OrganizationSetting` that was created by this mutation. */
  organizationSetting?: Maybe<OrganizationSetting>;
  /** An edge for our `OrganizationSetting`. May be used by Relay 1. */
  organizationSettingEdge?: Maybe<OrganizationSettingEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `OrganizationSetting` mutation. */
export type CreateOrganizationSettingPayloadOrganizationSettingEdgeArgs = {
  orderBy?: Array<OrganizationSettingOrderBy>;
};

/** All input for the create `Person` mutation. */
export type CreatePersonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Person` to be created by this mutation. */
  person: PersonInput;
};

/** The output of our create `Person` mutation. */
export type CreatePersonPayload = {
  __typename?: 'CreatePersonPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Person` that was created by this mutation. */
  person?: Maybe<Person>;
  /** An edge for our `Person`. May be used by Relay 1. */
  personEdge?: Maybe<PersonEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Person` mutation. */
export type CreatePersonPayloadPersonEdgeArgs = {
  orderBy?: Array<PersonOrderBy>;
};

/** All input for the create `Product` mutation. */
export type CreateProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Product` to be created by this mutation. */
  product: ProductInput;
};

/** The output of our create `Product` mutation. */
export type CreateProductPayload = {
  __typename?: 'CreateProductPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Product` that was created by this mutation. */
  product?: Maybe<Product>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `Product` mutation. */
export type CreateProductPayloadProductEdgeArgs = {
  orderBy?: Array<ProductOrderBy>;
};

/** All input for the create `Quote` mutation. */
export type CreateQuoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Quote` to be created by this mutation. */
  quote: QuoteInput;
};

/** All input for the create `QuoteLineItem` mutation. */
export type CreateQuoteLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `QuoteLineItem` to be created by this mutation. */
  quoteLineItem: QuoteLineItemInput;
};

/** The output of our create `QuoteLineItem` mutation. */
export type CreateQuoteLineItemPayload = {
  __typename?: 'CreateQuoteLineItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `QuoteLineItem` that was created by this mutation. */
  quoteLineItem?: Maybe<QuoteLineItem>;
  /** An edge for our `QuoteLineItem`. May be used by Relay 1. */
  quoteLineItemEdge?: Maybe<QuoteLineItemEdge>;
};


/** The output of our create `QuoteLineItem` mutation. */
export type CreateQuoteLineItemPayloadQuoteLineItemEdgeArgs = {
  orderBy?: Array<QuoteLineItemOrderBy>;
};

/** The output of our create `Quote` mutation. */
export type CreateQuotePayload = {
  __typename?: 'CreateQuotePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Quote` that was created by this mutation. */
  quote?: Maybe<Quote>;
  /** An edge for our `Quote`. May be used by Relay 1. */
  quoteEdge?: Maybe<QuoteEdge>;
};


/** The output of our create `Quote` mutation. */
export type CreateQuotePayloadQuoteEdgeArgs = {
  orderBy?: Array<QuoteOrderBy>;
};

/** All input for the `deleteCompanyById` mutation. */
export type DeleteCompanyByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Company` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteCompany` mutation. */
export type DeleteCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `deleteCompanyMemberById` mutation. */
export type DeleteCompanyMemberByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `CompanyMember` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteCompanyMember` mutation. */
export type DeleteCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `CompanyMember` mutation. */
export type DeleteCompanyMemberPayload = {
  __typename?: 'DeleteCompanyMemberPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `CompanyMember` that was deleted by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMemberEdge>;
  deletedCompanyMemberId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `CompanyMember` mutation. */
export type DeleteCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: Array<CompanyMemberOrderBy>;
};

/** The output of our delete `Company` mutation. */
export type DeleteCompanyPayload = {
  __typename?: 'DeleteCompanyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Company` that was deleted by this mutation. */
  company?: Maybe<Company>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompanyEdge>;
  deletedCompanyId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Company` mutation. */
export type DeleteCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Array<CompanyOrderBy>;
};

/** All input for the `deleteDocumentNumberingConfigById` mutation. */
export type DeleteDocumentNumberingConfigByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `DocumentNumberingConfig` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteDocumentNumberingConfig` mutation. */
export type DeleteDocumentNumberingConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `DocumentNumberingConfig` mutation. */
export type DeleteDocumentNumberingConfigPayload = {
  __typename?: 'DeleteDocumentNumberingConfigPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedDocumentNumberingConfigId?: Maybe<Scalars['ID']['output']>;
  /** The `DocumentNumberingConfig` that was deleted by this mutation. */
  documentNumberingConfig?: Maybe<DocumentNumberingConfig>;
  /** An edge for our `DocumentNumberingConfig`. May be used by Relay 1. */
  documentNumberingConfigEdge?: Maybe<DocumentNumberingConfigEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `DocumentNumberingConfig` mutation. */
export type DeleteDocumentNumberingConfigPayloadDocumentNumberingConfigEdgeArgs = {
  orderBy?: Array<DocumentNumberingConfigOrderBy>;
};

/** All input for the `deleteInventoryAdjustmentById` mutation. */
export type DeleteInventoryAdjustmentByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `InventoryAdjustment` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteInventoryAdjustment` mutation. */
export type DeleteInventoryAdjustmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `InventoryAdjustment` mutation. */
export type DeleteInventoryAdjustmentPayload = {
  __typename?: 'DeleteInventoryAdjustmentPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedInventoryAdjustmentId?: Maybe<Scalars['ID']['output']>;
  /** The `InventoryAdjustment` that was deleted by this mutation. */
  inventoryAdjustment?: Maybe<InventoryAdjustment>;
  /** An edge for our `InventoryAdjustment`. May be used by Relay 1. */
  inventoryAdjustmentEdge?: Maybe<InventoryAdjustmentEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `InventoryAdjustment` mutation. */
export type DeleteInventoryAdjustmentPayloadInventoryAdjustmentEdgeArgs = {
  orderBy?: Array<InventoryAdjustmentOrderBy>;
};

/** All input for the `deleteInvoiceById` mutation. */
export type DeleteInvoiceByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Invoice` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteInvoice` mutation. */
export type DeleteInvoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `deleteInvoiceLineItemById` mutation. */
export type DeleteInvoiceLineItemByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `InvoiceLineItem` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteInvoiceLineItem` mutation. */
export type DeleteInvoiceLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `InvoiceLineItem` mutation. */
export type DeleteInvoiceLineItemPayload = {
  __typename?: 'DeleteInvoiceLineItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedInvoiceLineItemId?: Maybe<Scalars['ID']['output']>;
  /** The `InvoiceLineItem` that was deleted by this mutation. */
  invoiceLineItem?: Maybe<InvoiceLineItem>;
  /** An edge for our `InvoiceLineItem`. May be used by Relay 1. */
  invoiceLineItemEdge?: Maybe<InvoiceLineItemEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `InvoiceLineItem` mutation. */
export type DeleteInvoiceLineItemPayloadInvoiceLineItemEdgeArgs = {
  orderBy?: Array<InvoiceLineItemOrderBy>;
};

/** The output of our delete `Invoice` mutation. */
export type DeleteInvoicePayload = {
  __typename?: 'DeleteInvoicePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedInvoiceId?: Maybe<Scalars['ID']['output']>;
  /** The `Invoice` that was deleted by this mutation. */
  invoice?: Maybe<Invoice>;
  /** An edge for our `Invoice`. May be used by Relay 1. */
  invoiceEdge?: Maybe<InvoiceEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Invoice` mutation. */
export type DeleteInvoicePayloadInvoiceEdgeArgs = {
  orderBy?: Array<InvoiceOrderBy>;
};

/** All input for the `deleteOrganizationSettingById` mutation. */
export type DeleteOrganizationSettingByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `OrganizationSetting` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteOrganizationSetting` mutation. */
export type DeleteOrganizationSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `OrganizationSetting` mutation. */
export type DeleteOrganizationSettingPayload = {
  __typename?: 'DeleteOrganizationSettingPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedOrganizationSettingId?: Maybe<Scalars['ID']['output']>;
  /** The `OrganizationSetting` that was deleted by this mutation. */
  organizationSetting?: Maybe<OrganizationSetting>;
  /** An edge for our `OrganizationSetting`. May be used by Relay 1. */
  organizationSettingEdge?: Maybe<OrganizationSettingEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `OrganizationSetting` mutation. */
export type DeleteOrganizationSettingPayloadOrganizationSettingEdgeArgs = {
  orderBy?: Array<OrganizationSettingOrderBy>;
};

/** All input for the `deletePersonById` mutation. */
export type DeletePersonByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Person` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deletePerson` mutation. */
export type DeletePersonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Person` mutation. */
export type DeletePersonPayload = {
  __typename?: 'DeletePersonPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPersonId?: Maybe<Scalars['ID']['output']>;
  /** The `Person` that was deleted by this mutation. */
  person?: Maybe<Person>;
  /** An edge for our `Person`. May be used by Relay 1. */
  personEdge?: Maybe<PersonEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Person` mutation. */
export type DeletePersonPayloadPersonEdgeArgs = {
  orderBy?: Array<PersonOrderBy>;
};

/** All input for the `deleteProductById` mutation. */
export type DeleteProductByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Product` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteProduct` mutation. */
export type DeleteProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Product` mutation. */
export type DeleteProductPayload = {
  __typename?: 'DeleteProductPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedProductId?: Maybe<Scalars['ID']['output']>;
  /** The `Product` that was deleted by this mutation. */
  product?: Maybe<Product>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `Product` mutation. */
export type DeleteProductPayloadProductEdgeArgs = {
  orderBy?: Array<ProductOrderBy>;
};

/** All input for the `deleteQuoteById` mutation. */
export type DeleteQuoteByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Quote` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteQuote` mutation. */
export type DeleteQuoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `deleteQuoteLineItemById` mutation. */
export type DeleteQuoteLineItemByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `QuoteLineItem` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteQuoteLineItem` mutation. */
export type DeleteQuoteLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `QuoteLineItem` mutation. */
export type DeleteQuoteLineItemPayload = {
  __typename?: 'DeleteQuoteLineItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedQuoteLineItemId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `QuoteLineItem` that was deleted by this mutation. */
  quoteLineItem?: Maybe<QuoteLineItem>;
  /** An edge for our `QuoteLineItem`. May be used by Relay 1. */
  quoteLineItemEdge?: Maybe<QuoteLineItemEdge>;
};


/** The output of our delete `QuoteLineItem` mutation. */
export type DeleteQuoteLineItemPayloadQuoteLineItemEdgeArgs = {
  orderBy?: Array<QuoteLineItemOrderBy>;
};

/** The output of our delete `Quote` mutation. */
export type DeleteQuotePayload = {
  __typename?: 'DeleteQuotePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedQuoteId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Quote` that was deleted by this mutation. */
  quote?: Maybe<Quote>;
  /** An edge for our `Quote`. May be used by Relay 1. */
  quoteEdge?: Maybe<QuoteEdge>;
};


/** The output of our delete `Quote` mutation. */
export type DeleteQuotePayloadQuoteEdgeArgs = {
  orderBy?: Array<QuoteOrderBy>;
};

export type DocumentNumberingConfig = Node & {
  __typename?: 'DocumentNumberingConfig';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  dateFormat?: Maybe<Scalars['String']['output']>;
  documentType: Scalars['String']['output'];
  globalPrefix?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  idStrategy: Scalars['String']['output'];
  nextSequentialNumber: Scalars['Int']['output'];
  organizationId: Scalars['String']['output'];
  prefix: Scalars['String']['output'];
  randomLength: Scalars['Int']['output'];
  rowId: Scalars['UUID']['output'];
  separator: Scalars['String']['output'];
  sequentialPadding: Scalars['Int']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `DocumentNumberingConfig` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type DocumentNumberingConfigCondition = {
  /** Checks for equality with the object’s `documentType` field. */
  documentType?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `DocumentNumberingConfig` values. */
export type DocumentNumberingConfigConnection = {
  __typename?: 'DocumentNumberingConfigConnection';
  /** A list of edges which contains the `DocumentNumberingConfig` and cursor to aid in pagination. */
  edges: Array<Maybe<DocumentNumberingConfigEdge>>;
  /** A list of `DocumentNumberingConfig` objects. */
  nodes: Array<Maybe<DocumentNumberingConfig>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `DocumentNumberingConfig` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `DocumentNumberingConfig` edge in the connection. */
export type DocumentNumberingConfigEdge = {
  __typename?: 'DocumentNumberingConfigEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `DocumentNumberingConfig` at the end of the edge. */
  node?: Maybe<DocumentNumberingConfig>;
};

/** A filter to be used against `DocumentNumberingConfig` object types. All fields are combined with a logical ‘and.’ */
export type DocumentNumberingConfigFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<DocumentNumberingConfigFilter>>;
  /** Filter by the object’s `documentType` field. */
  documentType?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<DocumentNumberingConfigFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<DocumentNumberingConfigFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `DocumentNumberingConfig` */
export type DocumentNumberingConfigInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  dateFormat?: InputMaybe<Scalars['String']['input']>;
  documentType: Scalars['String']['input'];
  globalPrefix?: InputMaybe<Scalars['String']['input']>;
  idStrategy?: InputMaybe<Scalars['String']['input']>;
  nextSequentialNumber?: InputMaybe<Scalars['Int']['input']>;
  organizationId: Scalars['String']['input'];
  prefix?: InputMaybe<Scalars['String']['input']>;
  randomLength?: InputMaybe<Scalars['Int']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  separator?: InputMaybe<Scalars['String']['input']>;
  sequentialPadding?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `DocumentNumberingConfig`. */
export enum DocumentNumberingConfigOrderBy {
  DocumentTypeAsc = 'DOCUMENT_TYPE_ASC',
  DocumentTypeDesc = 'DOCUMENT_TYPE_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `DocumentNumberingConfig`. Fields that are set will be updated. */
export type DocumentNumberingConfigPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  dateFormat?: InputMaybe<Scalars['String']['input']>;
  documentType?: InputMaybe<Scalars['String']['input']>;
  globalPrefix?: InputMaybe<Scalars['String']['input']>;
  idStrategy?: InputMaybe<Scalars['String']['input']>;
  nextSequentialNumber?: InputMaybe<Scalars['Int']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  randomLength?: InputMaybe<Scalars['Int']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  separator?: InputMaybe<Scalars['String']['input']>;
  sequentialPadding?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type GenerateDocumentNumberInput = {
  documentType: Scalars['String']['input'];
  idStrategy?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
};

export type GenerateDocumentNumberPayload = {
  __typename?: 'GenerateDocumentNumberPayload';
  documentNumber: Scalars['String']['output'];
};

export type InventoryAdjustment = Node & {
  __typename?: 'InventoryAdjustment';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Product` that is related to this `InventoryAdjustment`. */
  product?: Maybe<Product>;
  productId: Scalars['UUID']['output'];
  quantityChange: Scalars['Int']['output'];
  reason: Scalars['String']['output'];
  referenceId?: Maybe<Scalars['UUID']['output']>;
  rowId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `InventoryAdjustment` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type InventoryAdjustmentCondition = {
  /** Checks for equality with the object’s `productId` field. */
  productId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `InventoryAdjustment` values. */
export type InventoryAdjustmentConnection = {
  __typename?: 'InventoryAdjustmentConnection';
  /** A list of edges which contains the `InventoryAdjustment` and cursor to aid in pagination. */
  edges: Array<Maybe<InventoryAdjustmentEdge>>;
  /** A list of `InventoryAdjustment` objects. */
  nodes: Array<Maybe<InventoryAdjustment>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `InventoryAdjustment` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `InventoryAdjustment` edge in the connection. */
export type InventoryAdjustmentEdge = {
  __typename?: 'InventoryAdjustmentEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `InventoryAdjustment` at the end of the edge. */
  node?: Maybe<InventoryAdjustment>;
};

/** A filter to be used against `InventoryAdjustment` object types. All fields are combined with a logical ‘and.’ */
export type InventoryAdjustmentFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<InventoryAdjustmentFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<InventoryAdjustmentFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<InventoryAdjustmentFilter>>;
  /** Filter by the object’s `product` relation. */
  product?: InputMaybe<ProductFilter>;
  /** Filter by the object’s `productId` field. */
  productId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `InventoryAdjustment` */
export type InventoryAdjustmentInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  productId: Scalars['UUID']['input'];
  quantityChange: Scalars['Int']['input'];
  reason: Scalars['String']['input'];
  referenceId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Methods to use when ordering `InventoryAdjustment`. */
export enum InventoryAdjustmentOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `InventoryAdjustment`. Fields that are set will be updated. */
export type InventoryAdjustmentPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  productId?: InputMaybe<Scalars['UUID']['input']>;
  quantityChange?: InputMaybe<Scalars['Int']['input']>;
  reason?: InputMaybe<Scalars['String']['input']>;
  referenceId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

export type Invoice = Node & {
  __typename?: 'Invoice';
  billTo?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Company` that is related to this `Invoice`. */
  company?: Maybe<Company>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `Person` that is related to this `Invoice`. */
  contact?: Maybe<Person>;
  contactId?: Maybe<Scalars['UUID']['output']>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['Date']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `InvoiceLineItem`. */
  invoiceLineItems: InvoiceLineItemConnection;
  invoiceNumber: Scalars['String']['output'];
  issueDate: Scalars['Date']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  paidAt?: Maybe<Scalars['Datetime']['output']>;
  paymentLinkUrl?: Maybe<Scalars['String']['output']>;
  paymentReference?: Maybe<Scalars['String']['output']>;
  rowId: Scalars['UUID']['output'];
  status: Scalars['String']['output'];
  subtotal?: Maybe<Scalars['BigFloat']['output']>;
  taxAmount?: Maybe<Scalars['BigFloat']['output']>;
  taxRate?: Maybe<Scalars['BigFloat']['output']>;
  total?: Maybe<Scalars['BigFloat']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};


export type InvoiceInvoiceLineItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<InvoiceLineItemCondition>;
  filter?: InputMaybe<InvoiceLineItemFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InvoiceLineItemOrderBy>>;
};

/** A condition to be used against `Invoice` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type InvoiceCondition = {
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `invoiceNumber` field. */
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Invoice` values. */
export type InvoiceConnection = {
  __typename?: 'InvoiceConnection';
  /** A list of edges which contains the `Invoice` and cursor to aid in pagination. */
  edges: Array<Maybe<InvoiceEdge>>;
  /** A list of `Invoice` objects. */
  nodes: Array<Maybe<Invoice>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Invoice` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Invoice` edge in the connection. */
export type InvoiceEdge = {
  __typename?: 'InvoiceEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Invoice` at the end of the edge. */
  node?: Maybe<Invoice>;
};

/** A filter to be used against `Invoice` object types. All fields are combined with a logical ‘and.’ */
export type InvoiceFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<InvoiceFilter>>;
  /** Filter by the object’s `company` relation. */
  company?: InputMaybe<CompanyFilter>;
  /** A related `company` exists. */
  companyExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `companyId` field. */
  companyId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `contact` relation. */
  contact?: InputMaybe<PersonFilter>;
  /** A related `contact` exists. */
  contactExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `invoiceLineItems` relation. */
  invoiceLineItems?: InputMaybe<InvoiceToManyInvoiceLineItemFilter>;
  /** Some related `invoiceLineItems` exist. */
  invoiceLineItemsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `invoiceNumber` field. */
  invoiceNumber?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<InvoiceFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<InvoiceFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Invoice` */
export type InvoiceInput = {
  billTo?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  contactId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['Date']['input']>;
  invoiceNumber: Scalars['String']['input'];
  issueDate: Scalars['Date']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  paidAt?: InputMaybe<Scalars['Datetime']['input']>;
  paymentLinkUrl?: InputMaybe<Scalars['String']['input']>;
  paymentReference?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtotal?: InputMaybe<Scalars['BigFloat']['input']>;
  taxAmount?: InputMaybe<Scalars['BigFloat']['input']>;
  taxRate?: InputMaybe<Scalars['BigFloat']['input']>;
  total?: InputMaybe<Scalars['BigFloat']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

export type InvoiceLineItem = Node & {
  __typename?: 'InvoiceLineItem';
  amount: Scalars['BigFloat']['output'];
  description: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads a single `Invoice` that is related to this `InvoiceLineItem`. */
  invoice?: Maybe<Invoice>;
  invoiceId: Scalars['UUID']['output'];
  /** Reads a single `Product` that is related to this `InvoiceLineItem`. */
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['UUID']['output']>;
  quantity: Scalars['BigFloat']['output'];
  rowId: Scalars['UUID']['output'];
  sortOrder?: Maybe<Scalars['Int']['output']>;
  unitPrice: Scalars['BigFloat']['output'];
};

/**
 * A condition to be used against `InvoiceLineItem` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type InvoiceLineItemCondition = {
  /** Checks for equality with the object’s `invoiceId` field. */
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `InvoiceLineItem` values. */
export type InvoiceLineItemConnection = {
  __typename?: 'InvoiceLineItemConnection';
  /** A list of edges which contains the `InvoiceLineItem` and cursor to aid in pagination. */
  edges: Array<Maybe<InvoiceLineItemEdge>>;
  /** A list of `InvoiceLineItem` objects. */
  nodes: Array<Maybe<InvoiceLineItem>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `InvoiceLineItem` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `InvoiceLineItem` edge in the connection. */
export type InvoiceLineItemEdge = {
  __typename?: 'InvoiceLineItemEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `InvoiceLineItem` at the end of the edge. */
  node?: Maybe<InvoiceLineItem>;
};

/** A filter to be used against `InvoiceLineItem` object types. All fields are combined with a logical ‘and.’ */
export type InvoiceLineItemFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<InvoiceLineItemFilter>>;
  /** Filter by the object’s `invoice` relation. */
  invoice?: InputMaybe<InvoiceFilter>;
  /** Filter by the object’s `invoiceId` field. */
  invoiceId?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<InvoiceLineItemFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<InvoiceLineItemFilter>>;
  /** Filter by the object’s `product` relation. */
  product?: InputMaybe<ProductFilter>;
  /** A related `product` exists. */
  productExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `InvoiceLineItem` */
export type InvoiceLineItemInput = {
  amount: Scalars['BigFloat']['input'];
  description: Scalars['String']['input'];
  invoiceId: Scalars['UUID']['input'];
  productId?: InputMaybe<Scalars['UUID']['input']>;
  quantity: Scalars['BigFloat']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  unitPrice: Scalars['BigFloat']['input'];
};

/** Methods to use when ordering `InvoiceLineItem`. */
export enum InvoiceLineItemOrderBy {
  InvoiceIdAsc = 'INVOICE_ID_ASC',
  InvoiceIdDesc = 'INVOICE_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `InvoiceLineItem`. Fields that are set will be updated. */
export type InvoiceLineItemPatch = {
  amount?: InputMaybe<Scalars['BigFloat']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
  productId?: InputMaybe<Scalars['UUID']['input']>;
  quantity?: InputMaybe<Scalars['BigFloat']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  unitPrice?: InputMaybe<Scalars['BigFloat']['input']>;
};

/** Methods to use when ordering `Invoice`. */
export enum InvoiceOrderBy {
  CompanyIdAsc = 'COMPANY_ID_ASC',
  CompanyIdDesc = 'COMPANY_ID_DESC',
  InvoiceNumberAsc = 'INVOICE_NUMBER_ASC',
  InvoiceNumberDesc = 'INVOICE_NUMBER_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC'
}

/** Represents an update to a `Invoice`. Fields that are set will be updated. */
export type InvoicePatch = {
  billTo?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  contactId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['Date']['input']>;
  invoiceNumber?: InputMaybe<Scalars['String']['input']>;
  issueDate?: InputMaybe<Scalars['Date']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  paidAt?: InputMaybe<Scalars['Datetime']['input']>;
  paymentLinkUrl?: InputMaybe<Scalars['String']['input']>;
  paymentReference?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtotal?: InputMaybe<Scalars['BigFloat']['input']>;
  taxAmount?: InputMaybe<Scalars['BigFloat']['input']>;
  taxRate?: InputMaybe<Scalars['BigFloat']['input']>;
  total?: InputMaybe<Scalars['BigFloat']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `InvoiceLineItem` object types. All fields are combined with a logical ‘and.’ */
export type InvoiceToManyInvoiceLineItemFilter = {
  /** Every related `InvoiceLineItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<InvoiceLineItemFilter>;
  /** No related `InvoiceLineItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<InvoiceLineItemFilter>;
  /** Some related `InvoiceLineItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<InvoiceLineItemFilter>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Company`. */
  createCompany?: Maybe<CreateCompanyPayload>;
  /** Creates a single `CompanyMember`. */
  createCompanyMember?: Maybe<CreateCompanyMemberPayload>;
  /** Creates a single `DocumentNumberingConfig`. */
  createDocumentNumberingConfig?: Maybe<CreateDocumentNumberingConfigPayload>;
  /** Creates a single `InventoryAdjustment`. */
  createInventoryAdjustment?: Maybe<CreateInventoryAdjustmentPayload>;
  /** Creates a single `Invoice`. */
  createInvoice?: Maybe<CreateInvoicePayload>;
  /** Creates a single `InvoiceLineItem`. */
  createInvoiceLineItem?: Maybe<CreateInvoiceLineItemPayload>;
  /** Creates a single `OrganizationSetting`. */
  createOrganizationSetting?: Maybe<CreateOrganizationSettingPayload>;
  /** Creates a single `Person`. */
  createPerson?: Maybe<CreatePersonPayload>;
  /** Creates a single `Product`. */
  createProduct?: Maybe<CreateProductPayload>;
  /** Creates a single `Quote`. */
  createQuote?: Maybe<CreateQuotePayload>;
  /** Creates a single `QuoteLineItem`. */
  createQuoteLineItem?: Maybe<CreateQuoteLineItemPayload>;
  /** Deletes a single `Company` using a unique key. */
  deleteCompany?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `Company` using its globally unique id. */
  deleteCompanyById?: Maybe<DeleteCompanyPayload>;
  /** Deletes a single `CompanyMember` using a unique key. */
  deleteCompanyMember?: Maybe<DeleteCompanyMemberPayload>;
  /** Deletes a single `CompanyMember` using its globally unique id. */
  deleteCompanyMemberById?: Maybe<DeleteCompanyMemberPayload>;
  /** Deletes a single `DocumentNumberingConfig` using a unique key. */
  deleteDocumentNumberingConfig?: Maybe<DeleteDocumentNumberingConfigPayload>;
  /** Deletes a single `DocumentNumberingConfig` using its globally unique id. */
  deleteDocumentNumberingConfigById?: Maybe<DeleteDocumentNumberingConfigPayload>;
  /** Deletes a single `InventoryAdjustment` using a unique key. */
  deleteInventoryAdjustment?: Maybe<DeleteInventoryAdjustmentPayload>;
  /** Deletes a single `InventoryAdjustment` using its globally unique id. */
  deleteInventoryAdjustmentById?: Maybe<DeleteInventoryAdjustmentPayload>;
  /** Deletes a single `Invoice` using a unique key. */
  deleteInvoice?: Maybe<DeleteInvoicePayload>;
  /** Deletes a single `Invoice` using its globally unique id. */
  deleteInvoiceById?: Maybe<DeleteInvoicePayload>;
  /** Deletes a single `InvoiceLineItem` using a unique key. */
  deleteInvoiceLineItem?: Maybe<DeleteInvoiceLineItemPayload>;
  /** Deletes a single `InvoiceLineItem` using its globally unique id. */
  deleteInvoiceLineItemById?: Maybe<DeleteInvoiceLineItemPayload>;
  /** Deletes a single `OrganizationSetting` using a unique key. */
  deleteOrganizationSetting?: Maybe<DeleteOrganizationSettingPayload>;
  /** Deletes a single `OrganizationSetting` using its globally unique id. */
  deleteOrganizationSettingById?: Maybe<DeleteOrganizationSettingPayload>;
  /** Deletes a single `Person` using a unique key. */
  deletePerson?: Maybe<DeletePersonPayload>;
  /** Deletes a single `Person` using its globally unique id. */
  deletePersonById?: Maybe<DeletePersonPayload>;
  /** Deletes a single `Product` using a unique key. */
  deleteProduct?: Maybe<DeleteProductPayload>;
  /** Deletes a single `Product` using its globally unique id. */
  deleteProductById?: Maybe<DeleteProductPayload>;
  /** Deletes a single `Quote` using a unique key. */
  deleteQuote?: Maybe<DeleteQuotePayload>;
  /** Deletes a single `Quote` using its globally unique id. */
  deleteQuoteById?: Maybe<DeleteQuotePayload>;
  /** Deletes a single `QuoteLineItem` using a unique key. */
  deleteQuoteLineItem?: Maybe<DeleteQuoteLineItemPayload>;
  /** Deletes a single `QuoteLineItem` using its globally unique id. */
  deleteQuoteLineItemById?: Maybe<DeleteQuoteLineItemPayload>;
  generateDocumentNumber?: Maybe<GenerateDocumentNumberPayload>;
  /** Updates a single `Company` using a unique key and a patch. */
  updateCompany?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `Company` using its globally unique id and a patch. */
  updateCompanyById?: Maybe<UpdateCompanyPayload>;
  /** Updates a single `CompanyMember` using a unique key and a patch. */
  updateCompanyMember?: Maybe<UpdateCompanyMemberPayload>;
  /** Updates a single `CompanyMember` using its globally unique id and a patch. */
  updateCompanyMemberById?: Maybe<UpdateCompanyMemberPayload>;
  /** Updates a single `DocumentNumberingConfig` using a unique key and a patch. */
  updateDocumentNumberingConfig?: Maybe<UpdateDocumentNumberingConfigPayload>;
  /** Updates a single `DocumentNumberingConfig` using its globally unique id and a patch. */
  updateDocumentNumberingConfigById?: Maybe<UpdateDocumentNumberingConfigPayload>;
  /** Updates a single `InventoryAdjustment` using a unique key and a patch. */
  updateInventoryAdjustment?: Maybe<UpdateInventoryAdjustmentPayload>;
  /** Updates a single `InventoryAdjustment` using its globally unique id and a patch. */
  updateInventoryAdjustmentById?: Maybe<UpdateInventoryAdjustmentPayload>;
  /** Updates a single `Invoice` using a unique key and a patch. */
  updateInvoice?: Maybe<UpdateInvoicePayload>;
  /** Updates a single `Invoice` using its globally unique id and a patch. */
  updateInvoiceById?: Maybe<UpdateInvoicePayload>;
  /** Updates a single `InvoiceLineItem` using a unique key and a patch. */
  updateInvoiceLineItem?: Maybe<UpdateInvoiceLineItemPayload>;
  /** Updates a single `InvoiceLineItem` using its globally unique id and a patch. */
  updateInvoiceLineItemById?: Maybe<UpdateInvoiceLineItemPayload>;
  /** Updates a single `OrganizationSetting` using a unique key and a patch. */
  updateOrganizationSetting?: Maybe<UpdateOrganizationSettingPayload>;
  /** Updates a single `OrganizationSetting` using its globally unique id and a patch. */
  updateOrganizationSettingById?: Maybe<UpdateOrganizationSettingPayload>;
  /** Updates a single `Person` using a unique key and a patch. */
  updatePerson?: Maybe<UpdatePersonPayload>;
  /** Updates a single `Person` using its globally unique id and a patch. */
  updatePersonById?: Maybe<UpdatePersonPayload>;
  /** Updates a single `Product` using a unique key and a patch. */
  updateProduct?: Maybe<UpdateProductPayload>;
  /** Updates a single `Product` using its globally unique id and a patch. */
  updateProductById?: Maybe<UpdateProductPayload>;
  /** Updates a single `Quote` using a unique key and a patch. */
  updateQuote?: Maybe<UpdateQuotePayload>;
  /** Updates a single `Quote` using its globally unique id and a patch. */
  updateQuoteById?: Maybe<UpdateQuotePayload>;
  /** Updates a single `QuoteLineItem` using a unique key and a patch. */
  updateQuoteLineItem?: Maybe<UpdateQuoteLineItemPayload>;
  /** Updates a single `QuoteLineItem` using its globally unique id and a patch. */
  updateQuoteLineItemById?: Maybe<UpdateQuoteLineItemPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCompanyMemberArgs = {
  input: CreateCompanyMemberInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateDocumentNumberingConfigArgs = {
  input: CreateDocumentNumberingConfigInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateInventoryAdjustmentArgs = {
  input: CreateInventoryAdjustmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateInvoiceArgs = {
  input: CreateInvoiceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateInvoiceLineItemArgs = {
  input: CreateInvoiceLineItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateOrganizationSettingArgs = {
  input: CreateOrganizationSettingInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePersonArgs = {
  input: CreatePersonInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateQuoteArgs = {
  input: CreateQuoteInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateQuoteLineItemArgs = {
  input: CreateQuoteLineItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyArgs = {
  input: DeleteCompanyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyByIdArgs = {
  input: DeleteCompanyByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyMemberArgs = {
  input: DeleteCompanyMemberInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCompanyMemberByIdArgs = {
  input: DeleteCompanyMemberByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteDocumentNumberingConfigArgs = {
  input: DeleteDocumentNumberingConfigInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteDocumentNumberingConfigByIdArgs = {
  input: DeleteDocumentNumberingConfigByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInventoryAdjustmentArgs = {
  input: DeleteInventoryAdjustmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInventoryAdjustmentByIdArgs = {
  input: DeleteInventoryAdjustmentByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvoiceArgs = {
  input: DeleteInvoiceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvoiceByIdArgs = {
  input: DeleteInvoiceByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvoiceLineItemArgs = {
  input: DeleteInvoiceLineItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteInvoiceLineItemByIdArgs = {
  input: DeleteInvoiceLineItemByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOrganizationSettingArgs = {
  input: DeleteOrganizationSettingInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOrganizationSettingByIdArgs = {
  input: DeleteOrganizationSettingByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePersonArgs = {
  input: DeletePersonInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePersonByIdArgs = {
  input: DeletePersonByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProductArgs = {
  input: DeleteProductInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProductByIdArgs = {
  input: DeleteProductByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteQuoteArgs = {
  input: DeleteQuoteInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteQuoteByIdArgs = {
  input: DeleteQuoteByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteQuoteLineItemArgs = {
  input: DeleteQuoteLineItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteQuoteLineItemByIdArgs = {
  input: DeleteQuoteLineItemByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationGenerateDocumentNumberArgs = {
  input: GenerateDocumentNumberInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyByIdArgs = {
  input: UpdateCompanyByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyMemberArgs = {
  input: UpdateCompanyMemberInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCompanyMemberByIdArgs = {
  input: UpdateCompanyMemberByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateDocumentNumberingConfigArgs = {
  input: UpdateDocumentNumberingConfigInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateDocumentNumberingConfigByIdArgs = {
  input: UpdateDocumentNumberingConfigByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInventoryAdjustmentArgs = {
  input: UpdateInventoryAdjustmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInventoryAdjustmentByIdArgs = {
  input: UpdateInventoryAdjustmentByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvoiceArgs = {
  input: UpdateInvoiceInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvoiceByIdArgs = {
  input: UpdateInvoiceByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvoiceLineItemArgs = {
  input: UpdateInvoiceLineItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateInvoiceLineItemByIdArgs = {
  input: UpdateInvoiceLineItemByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateOrganizationSettingArgs = {
  input: UpdateOrganizationSettingInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateOrganizationSettingByIdArgs = {
  input: UpdateOrganizationSettingByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePersonArgs = {
  input: UpdatePersonInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePersonByIdArgs = {
  input: UpdatePersonByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProductArgs = {
  input: UpdateProductInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProductByIdArgs = {
  input: UpdateProductByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateQuoteArgs = {
  input: UpdateQuoteInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateQuoteByIdArgs = {
  input: UpdateQuoteByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateQuoteLineItemArgs = {
  input: UpdateQuoteLineItemInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateQuoteLineItemByIdArgs = {
  input: UpdateQuoteLineItemByIdInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
};

export type OrganizationSetting = Node & {
  __typename?: 'OrganizationSetting';
  accentColor?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  organizationId: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `OrganizationSetting` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type OrganizationSettingCondition = {
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `OrganizationSetting` values. */
export type OrganizationSettingConnection = {
  __typename?: 'OrganizationSettingConnection';
  /** A list of edges which contains the `OrganizationSetting` and cursor to aid in pagination. */
  edges: Array<Maybe<OrganizationSettingEdge>>;
  /** A list of `OrganizationSetting` objects. */
  nodes: Array<Maybe<OrganizationSetting>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `OrganizationSetting` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `OrganizationSetting` edge in the connection. */
export type OrganizationSettingEdge = {
  __typename?: 'OrganizationSettingEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `OrganizationSetting` at the end of the edge. */
  node?: Maybe<OrganizationSetting>;
};

/** A filter to be used against `OrganizationSetting` object types. All fields are combined with a logical ‘and.’ */
export type OrganizationSettingFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<OrganizationSettingFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<OrganizationSettingFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<OrganizationSettingFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `OrganizationSetting` */
export type OrganizationSettingInput = {
  accentColor?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  organizationId: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `OrganizationSetting`. */
export enum OrganizationSettingOrderBy {
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `OrganizationSetting`. Fields that are set will be updated. */
export type OrganizationSettingPatch = {
  accentColor?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type Person = Node & {
  __typename?: 'Person';
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers: CompanyMemberConnection;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  emails?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  firstName: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  internal: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  rowId: Scalars['UUID']['output'];
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};


export type PersonCompanyMembersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CompanyMemberCondition>;
  filter?: InputMaybe<CompanyMemberFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CompanyMemberOrderBy>>;
};

/** A condition to be used against `Person` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PersonCondition = {
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Person` values. */
export type PersonConnection = {
  __typename?: 'PersonConnection';
  /** A list of edges which contains the `Person` and cursor to aid in pagination. */
  edges: Array<Maybe<PersonEdge>>;
  /** A list of `Person` objects. */
  nodes: Array<Maybe<Person>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Person` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Person` edge in the connection. */
export type PersonEdge = {
  __typename?: 'PersonEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Person` at the end of the edge. */
  node?: Maybe<Person>;
};

/** A filter to be used against `Person` object types. All fields are combined with a logical ‘and.’ */
export type PersonFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PersonFilter>>;
  /** Filter by the object’s `companyMembers` relation. */
  companyMembers?: InputMaybe<PersonToManyCompanyMemberFilter>;
  /** Some related `companyMembers` exist. */
  companyMembersExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `emails` field. */
  emails?: InputMaybe<StringListFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PersonFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PersonFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Person` */
export type PersonInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  emails?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  firstName: Scalars['String']['input'];
  internal?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Person`. */
export enum PersonOrderBy {
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `Person`. Fields that are set will be updated. */
export type PersonPatch = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  emails?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  internal?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `CompanyMember` object types. All fields are combined with a logical ‘and.’ */
export type PersonToManyCompanyMemberFilter = {
  /** Every related `CompanyMember` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<CompanyMemberFilter>;
  /** No related `CompanyMember` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<CompanyMemberFilter>;
  /** Some related `CompanyMember` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<CompanyMemberFilter>;
};

export type Product = Node & {
  __typename?: 'Product';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  currentQuantity?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `InventoryAdjustment`. */
  inventoryAdjustments: InventoryAdjustmentConnection;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lowStockThreshold?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  unitPrice?: Maybe<Scalars['BigFloat']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};


export type ProductInventoryAdjustmentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<InventoryAdjustmentCondition>;
  filter?: InputMaybe<InventoryAdjustmentFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InventoryAdjustmentOrderBy>>;
};

/** A condition to be used against `Product` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProductCondition = {
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `sku` field. */
  sku?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Product` values. */
export type ProductConnection = {
  __typename?: 'ProductConnection';
  /** A list of edges which contains the `Product` and cursor to aid in pagination. */
  edges: Array<Maybe<ProductEdge>>;
  /** A list of `Product` objects. */
  nodes: Array<Maybe<Product>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Product` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Product` edge in the connection. */
export type ProductEdge = {
  __typename?: 'ProductEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Product` at the end of the edge. */
  node?: Maybe<Product>;
};

/** A filter to be used against `Product` object types. All fields are combined with a logical ‘and.’ */
export type ProductFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProductFilter>>;
  /** Filter by the object’s `inventoryAdjustments` relation. */
  inventoryAdjustments?: InputMaybe<ProductToManyInventoryAdjustmentFilter>;
  /** Some related `inventoryAdjustments` exist. */
  inventoryAdjustmentsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<ProductFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProductFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `sku` field. */
  sku?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Product` */
export type ProductInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  currentQuantity?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Product`. */
export enum ProductOrderBy {
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  SkuAsc = 'SKU_ASC',
  SkuDesc = 'SKU_DESC'
}

/** Represents an update to a `Product`. Fields that are set will be updated. */
export type ProductPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  currentQuantity?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A filter to be used against many `InventoryAdjustment` object types. All fields are combined with a logical ‘and.’ */
export type ProductToManyInventoryAdjustmentFilter = {
  /** Every related `InventoryAdjustment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<InventoryAdjustmentFilter>;
  /** No related `InventoryAdjustment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<InventoryAdjustmentFilter>;
  /** Some related `InventoryAdjustment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<InventoryAdjustmentFilter>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Reads and enables pagination through a set of `Company`. */
  companies?: Maybe<CompanyConnection>;
  /** Get a single `Company`. */
  company?: Maybe<Company>;
  /** Reads a single `Company` using its globally unique `ID`. */
  companyById?: Maybe<Company>;
  /** Get a single `CompanyMember`. */
  companyMember?: Maybe<CompanyMember>;
  /** Reads a single `CompanyMember` using its globally unique `ID`. */
  companyMemberById?: Maybe<CompanyMember>;
  /** Reads and enables pagination through a set of `CompanyMember`. */
  companyMembers?: Maybe<CompanyMemberConnection>;
  /** Get a single `DocumentNumberingConfig`. */
  documentNumberingConfig?: Maybe<DocumentNumberingConfig>;
  /** Reads a single `DocumentNumberingConfig` using its globally unique `ID`. */
  documentNumberingConfigById?: Maybe<DocumentNumberingConfig>;
  /** Reads and enables pagination through a set of `DocumentNumberingConfig`. */
  documentNumberingConfigs?: Maybe<DocumentNumberingConfigConnection>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  id: Scalars['ID']['output'];
  /** Get a single `InventoryAdjustment`. */
  inventoryAdjustment?: Maybe<InventoryAdjustment>;
  /** Reads a single `InventoryAdjustment` using its globally unique `ID`. */
  inventoryAdjustmentById?: Maybe<InventoryAdjustment>;
  /** Reads and enables pagination through a set of `InventoryAdjustment`. */
  inventoryAdjustments?: Maybe<InventoryAdjustmentConnection>;
  /** Get a single `Invoice`. */
  invoice?: Maybe<Invoice>;
  /** Reads a single `Invoice` using its globally unique `ID`. */
  invoiceById?: Maybe<Invoice>;
  /** Get a single `InvoiceLineItem`. */
  invoiceLineItem?: Maybe<InvoiceLineItem>;
  /** Reads a single `InvoiceLineItem` using its globally unique `ID`. */
  invoiceLineItemById?: Maybe<InvoiceLineItem>;
  /** Reads and enables pagination through a set of `InvoiceLineItem`. */
  invoiceLineItems?: Maybe<InvoiceLineItemConnection>;
  /** Reads and enables pagination through a set of `Invoice`. */
  invoices?: Maybe<InvoiceConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Get a single `OrganizationSetting`. */
  organizationSetting?: Maybe<OrganizationSetting>;
  /** Reads a single `OrganizationSetting` using its globally unique `ID`. */
  organizationSettingById?: Maybe<OrganizationSetting>;
  /** Reads and enables pagination through a set of `OrganizationSetting`. */
  organizationSettings?: Maybe<OrganizationSettingConnection>;
  /** Reads and enables pagination through a set of `Person`. */
  people?: Maybe<PersonConnection>;
  /** Get a single `Person`. */
  person?: Maybe<Person>;
  /** Reads a single `Person` using its globally unique `ID`. */
  personById?: Maybe<Person>;
  /** Get a single `Product`. */
  product?: Maybe<Product>;
  /** Reads a single `Product` using its globally unique `ID`. */
  productById?: Maybe<Product>;
  /** Reads and enables pagination through a set of `Product`. */
  products?: Maybe<ProductConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** Get a single `Quote`. */
  quote?: Maybe<Quote>;
  /** Reads a single `Quote` using its globally unique `ID`. */
  quoteById?: Maybe<Quote>;
  /** Get a single `QuoteLineItem`. */
  quoteLineItem?: Maybe<QuoteLineItem>;
  /** Reads a single `QuoteLineItem` using its globally unique `ID`. */
  quoteLineItemById?: Maybe<QuoteLineItem>;
  /** Reads and enables pagination through a set of `QuoteLineItem`. */
  quoteLineItems?: Maybe<QuoteLineItemConnection>;
  /** Reads and enables pagination through a set of `Quote`. */
  quotes?: Maybe<QuoteConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCompaniesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CompanyCondition>;
  filter?: InputMaybe<CompanyFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CompanyOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCompanyArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCompanyByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCompanyMemberByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCompanyMembersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CompanyMemberCondition>;
  filter?: InputMaybe<CompanyMemberFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CompanyMemberOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryDocumentNumberingConfigArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryDocumentNumberingConfigByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryDocumentNumberingConfigsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<DocumentNumberingConfigCondition>;
  filter?: InputMaybe<DocumentNumberingConfigFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<DocumentNumberingConfigOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryInventoryAdjustmentArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInventoryAdjustmentByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInventoryAdjustmentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<InventoryAdjustmentCondition>;
  filter?: InputMaybe<InventoryAdjustmentFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InventoryAdjustmentOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryInvoiceArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvoiceByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvoiceLineItemArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvoiceLineItemByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryInvoiceLineItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<InvoiceLineItemCondition>;
  filter?: InputMaybe<InvoiceLineItemFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InvoiceLineItemOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryInvoicesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<InvoiceCondition>;
  filter?: InputMaybe<InvoiceFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<InvoiceOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOrganizationSettingArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOrganizationSettingByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOrganizationSettingsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<OrganizationSettingCondition>;
  filter?: InputMaybe<OrganizationSettingFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<OrganizationSettingOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPeopleArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PersonCondition>;
  filter?: InputMaybe<PersonFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PersonOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPersonArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPersonByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProductArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProductByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProductsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProductCondition>;
  filter?: InputMaybe<ProductFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProductOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryQuoteArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryQuoteByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryQuoteLineItemArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryQuoteLineItemByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryQuoteLineItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<QuoteLineItemCondition>;
  filter?: InputMaybe<QuoteLineItemFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<QuoteLineItemOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryQuotesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<QuoteCondition>;
  filter?: InputMaybe<QuoteFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<QuoteOrderBy>>;
};

export type Quote = Node & {
  __typename?: 'Quote';
  additionalItemsLabel?: Maybe<Scalars['String']['output']>;
  additionalTerms?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  clientEmail?: Maybe<Scalars['String']['output']>;
  clientName?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Company` that is related to this `Quote`. */
  company?: Maybe<Company>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `Person` that is related to this `Quote`. */
  contact?: Maybe<Person>;
  contactId?: Maybe<Scalars['UUID']['output']>;
  /** Reads a single `Invoice` that is related to this `Quote`. */
  convertedInvoice?: Maybe<Invoice>;
  convertedInvoiceId?: Maybe<Scalars['UUID']['output']>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  projectType?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `QuoteLineItem`. */
  quoteLineItems: QuoteLineItemConnection;
  quoteNumber: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  status: Scalars['String']['output'];
  subtotal?: Maybe<Scalars['BigFloat']['output']>;
  taxAmount?: Maybe<Scalars['BigFloat']['output']>;
  taxRate?: Maybe<Scalars['BigFloat']['output']>;
  terms?: Maybe<Scalars['String']['output']>;
  timeRange?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  total?: Maybe<Scalars['BigFloat']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  validUntil: Scalars['Date']['output'];
};


export type QuoteQuoteLineItemsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<QuoteLineItemCondition>;
  filter?: InputMaybe<QuoteLineItemFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<QuoteLineItemOrderBy>>;
};

/** A condition to be used against `Quote` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type QuoteCondition = {
  /** Checks for equality with the object’s `companyId` field. */
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `quoteNumber` field. */
  quoteNumber?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Quote` values. */
export type QuoteConnection = {
  __typename?: 'QuoteConnection';
  /** A list of edges which contains the `Quote` and cursor to aid in pagination. */
  edges: Array<Maybe<QuoteEdge>>;
  /** A list of `Quote` objects. */
  nodes: Array<Maybe<Quote>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Quote` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Quote` edge in the connection. */
export type QuoteEdge = {
  __typename?: 'QuoteEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Quote` at the end of the edge. */
  node?: Maybe<Quote>;
};

/** A filter to be used against `Quote` object types. All fields are combined with a logical ‘and.’ */
export type QuoteFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<QuoteFilter>>;
  /** Filter by the object’s `company` relation. */
  company?: InputMaybe<CompanyFilter>;
  /** A related `company` exists. */
  companyExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `companyId` field. */
  companyId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `contact` relation. */
  contact?: InputMaybe<PersonFilter>;
  /** A related `contact` exists. */
  contactExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `convertedInvoice` relation. */
  convertedInvoice?: InputMaybe<InvoiceFilter>;
  /** A related `convertedInvoice` exists. */
  convertedInvoiceExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Negates the expression. */
  not?: InputMaybe<QuoteFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<QuoteFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `quoteLineItems` relation. */
  quoteLineItems?: InputMaybe<QuoteToManyQuoteLineItemFilter>;
  /** Some related `quoteLineItems` exist. */
  quoteLineItemsExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `quoteNumber` field. */
  quoteNumber?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `status` field. */
  status?: InputMaybe<StringFilter>;
};

/** An input for mutations affecting `Quote` */
export type QuoteInput = {
  additionalItemsLabel?: InputMaybe<Scalars['String']['input']>;
  additionalTerms?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  clientEmail?: InputMaybe<Scalars['String']['input']>;
  clientName?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  contactId?: InputMaybe<Scalars['UUID']['input']>;
  convertedInvoiceId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  projectType?: InputMaybe<Scalars['String']['input']>;
  quoteNumber: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtotal?: InputMaybe<Scalars['BigFloat']['input']>;
  taxAmount?: InputMaybe<Scalars['BigFloat']['input']>;
  taxRate?: InputMaybe<Scalars['BigFloat']['input']>;
  terms?: InputMaybe<Scalars['String']['input']>;
  timeRange?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  total?: InputMaybe<Scalars['BigFloat']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  validUntil: Scalars['Date']['input'];
};

export type QuoteLineItem = Node & {
  __typename?: 'QuoteLineItem';
  amount: Scalars['BigFloat']['output'];
  description: Scalars['String']['output'];
  estimatedHours?: Maybe<Scalars['BigFloat']['output']>;
  hourlyRate?: Maybe<Scalars['BigFloat']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  maxCapHours?: Maybe<Scalars['Int']['output']>;
  minimumBillingMinutes?: Maybe<Scalars['Int']['output']>;
  monthlyCapHours?: Maybe<Scalars['Int']['output']>;
  pricingType: Scalars['String']['output'];
  /** Reads a single `Product` that is related to this `QuoteLineItem`. */
  product?: Maybe<Product>;
  productId?: Maybe<Scalars['UUID']['output']>;
  quantity: Scalars['BigFloat']['output'];
  /** Reads a single `Quote` that is related to this `QuoteLineItem`. */
  quote?: Maybe<Quote>;
  quoteId: Scalars['UUID']['output'];
  rowId: Scalars['UUID']['output'];
  royaltyBuyoutAmount?: Maybe<Scalars['BigFloat']['output']>;
  royaltyPercentage?: Maybe<Scalars['BigFloat']['output']>;
  royaltyThreshold?: Maybe<Scalars['BigFloat']['output']>;
  royaltyTimeframe?: Maybe<Scalars['Int']['output']>;
  royaltyTimeframeUnit?: Maybe<Scalars['String']['output']>;
  sortOrder?: Maybe<Scalars['Int']['output']>;
  subtitle?: Maybe<Scalars['String']['output']>;
  unitPrice: Scalars['BigFloat']['output'];
  weeklyCapHours?: Maybe<Scalars['Int']['output']>;
};

/**
 * A condition to be used against `QuoteLineItem` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type QuoteLineItemCondition = {
  /** Checks for equality with the object’s `quoteId` field. */
  quoteId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `QuoteLineItem` values. */
export type QuoteLineItemConnection = {
  __typename?: 'QuoteLineItemConnection';
  /** A list of edges which contains the `QuoteLineItem` and cursor to aid in pagination. */
  edges: Array<Maybe<QuoteLineItemEdge>>;
  /** A list of `QuoteLineItem` objects. */
  nodes: Array<Maybe<QuoteLineItem>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `QuoteLineItem` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `QuoteLineItem` edge in the connection. */
export type QuoteLineItemEdge = {
  __typename?: 'QuoteLineItemEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `QuoteLineItem` at the end of the edge. */
  node?: Maybe<QuoteLineItem>;
};

/** A filter to be used against `QuoteLineItem` object types. All fields are combined with a logical ‘and.’ */
export type QuoteLineItemFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<QuoteLineItemFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<QuoteLineItemFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<QuoteLineItemFilter>>;
  /** Filter by the object’s `product` relation. */
  product?: InputMaybe<ProductFilter>;
  /** A related `product` exists. */
  productExists?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `quote` relation. */
  quote?: InputMaybe<QuoteFilter>;
  /** Filter by the object’s `quoteId` field. */
  quoteId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `QuoteLineItem` */
export type QuoteLineItemInput = {
  amount: Scalars['BigFloat']['input'];
  description: Scalars['String']['input'];
  estimatedHours?: InputMaybe<Scalars['BigFloat']['input']>;
  hourlyRate?: InputMaybe<Scalars['BigFloat']['input']>;
  maxCapHours?: InputMaybe<Scalars['Int']['input']>;
  minimumBillingMinutes?: InputMaybe<Scalars['Int']['input']>;
  monthlyCapHours?: InputMaybe<Scalars['Int']['input']>;
  pricingType?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['UUID']['input']>;
  quantity: Scalars['BigFloat']['input'];
  quoteId: Scalars['UUID']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  royaltyBuyoutAmount?: InputMaybe<Scalars['BigFloat']['input']>;
  royaltyPercentage?: InputMaybe<Scalars['BigFloat']['input']>;
  royaltyThreshold?: InputMaybe<Scalars['BigFloat']['input']>;
  royaltyTimeframe?: InputMaybe<Scalars['Int']['input']>;
  royaltyTimeframeUnit?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  unitPrice: Scalars['BigFloat']['input'];
  weeklyCapHours?: InputMaybe<Scalars['Int']['input']>;
};

/** Methods to use when ordering `QuoteLineItem`. */
export enum QuoteLineItemOrderBy {
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  QuoteIdAsc = 'QUOTE_ID_ASC',
  QuoteIdDesc = 'QUOTE_ID_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `QuoteLineItem`. Fields that are set will be updated. */
export type QuoteLineItemPatch = {
  amount?: InputMaybe<Scalars['BigFloat']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  estimatedHours?: InputMaybe<Scalars['BigFloat']['input']>;
  hourlyRate?: InputMaybe<Scalars['BigFloat']['input']>;
  maxCapHours?: InputMaybe<Scalars['Int']['input']>;
  minimumBillingMinutes?: InputMaybe<Scalars['Int']['input']>;
  monthlyCapHours?: InputMaybe<Scalars['Int']['input']>;
  pricingType?: InputMaybe<Scalars['String']['input']>;
  productId?: InputMaybe<Scalars['UUID']['input']>;
  quantity?: InputMaybe<Scalars['BigFloat']['input']>;
  quoteId?: InputMaybe<Scalars['UUID']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  royaltyBuyoutAmount?: InputMaybe<Scalars['BigFloat']['input']>;
  royaltyPercentage?: InputMaybe<Scalars['BigFloat']['input']>;
  royaltyThreshold?: InputMaybe<Scalars['BigFloat']['input']>;
  royaltyTimeframe?: InputMaybe<Scalars['Int']['input']>;
  royaltyTimeframeUnit?: InputMaybe<Scalars['String']['input']>;
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
  subtitle?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  weeklyCapHours?: InputMaybe<Scalars['Int']['input']>;
};

/** Methods to use when ordering `Quote`. */
export enum QuoteOrderBy {
  CompanyIdAsc = 'COMPANY_ID_ASC',
  CompanyIdDesc = 'COMPANY_ID_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  QuoteNumberAsc = 'QUOTE_NUMBER_ASC',
  QuoteNumberDesc = 'QUOTE_NUMBER_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC'
}

/** Represents an update to a `Quote`. Fields that are set will be updated. */
export type QuotePatch = {
  additionalItemsLabel?: InputMaybe<Scalars['String']['input']>;
  additionalTerms?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  clientEmail?: InputMaybe<Scalars['String']['input']>;
  clientName?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  contactId?: InputMaybe<Scalars['UUID']['input']>;
  convertedInvoiceId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  projectType?: InputMaybe<Scalars['String']['input']>;
  quoteNumber?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subtotal?: InputMaybe<Scalars['BigFloat']['input']>;
  taxAmount?: InputMaybe<Scalars['BigFloat']['input']>;
  taxRate?: InputMaybe<Scalars['BigFloat']['input']>;
  terms?: InputMaybe<Scalars['String']['input']>;
  timeRange?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  total?: InputMaybe<Scalars['BigFloat']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  validUntil?: InputMaybe<Scalars['Date']['input']>;
};

/** A filter to be used against many `QuoteLineItem` object types. All fields are combined with a logical ‘and.’ */
export type QuoteToManyQuoteLineItemFilter = {
  /** Every related `QuoteLineItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<QuoteLineItemFilter>;
  /** No related `QuoteLineItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<QuoteLineItemFilter>;
  /** Some related `QuoteLineItem` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<QuoteLineItemFilter>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']['input']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']['input']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']['input']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']['input']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']['input']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']['input']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']['input']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']['input']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']['input']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']['input']>;
};

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['String']['input']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

/** All input for the `updateCompanyById` mutation. */
export type UpdateCompanyByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Company` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
};

/** All input for the `updateCompany` mutation. */
export type UpdateCompanyInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Company` being updated. */
  patch: CompanyPatch;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `updateCompanyMemberById` mutation. */
export type UpdateCompanyMemberByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `CompanyMember` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `CompanyMember` being updated. */
  patch: CompanyMemberPatch;
};

/** All input for the `updateCompanyMember` mutation. */
export type UpdateCompanyMemberInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `CompanyMember` being updated. */
  patch: CompanyMemberPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `CompanyMember` mutation. */
export type UpdateCompanyMemberPayload = {
  __typename?: 'UpdateCompanyMemberPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `CompanyMember` that was updated by this mutation. */
  companyMember?: Maybe<CompanyMember>;
  /** An edge for our `CompanyMember`. May be used by Relay 1. */
  companyMemberEdge?: Maybe<CompanyMemberEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `CompanyMember` mutation. */
export type UpdateCompanyMemberPayloadCompanyMemberEdgeArgs = {
  orderBy?: Array<CompanyMemberOrderBy>;
};

/** The output of our update `Company` mutation. */
export type UpdateCompanyPayload = {
  __typename?: 'UpdateCompanyPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Company` that was updated by this mutation. */
  company?: Maybe<Company>;
  /** An edge for our `Company`. May be used by Relay 1. */
  companyEdge?: Maybe<CompanyEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Company` mutation. */
export type UpdateCompanyPayloadCompanyEdgeArgs = {
  orderBy?: Array<CompanyOrderBy>;
};

/** All input for the `updateDocumentNumberingConfigById` mutation. */
export type UpdateDocumentNumberingConfigByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `DocumentNumberingConfig` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `DocumentNumberingConfig` being updated. */
  patch: DocumentNumberingConfigPatch;
};

/** All input for the `updateDocumentNumberingConfig` mutation. */
export type UpdateDocumentNumberingConfigInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `DocumentNumberingConfig` being updated. */
  patch: DocumentNumberingConfigPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `DocumentNumberingConfig` mutation. */
export type UpdateDocumentNumberingConfigPayload = {
  __typename?: 'UpdateDocumentNumberingConfigPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `DocumentNumberingConfig` that was updated by this mutation. */
  documentNumberingConfig?: Maybe<DocumentNumberingConfig>;
  /** An edge for our `DocumentNumberingConfig`. May be used by Relay 1. */
  documentNumberingConfigEdge?: Maybe<DocumentNumberingConfigEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `DocumentNumberingConfig` mutation. */
export type UpdateDocumentNumberingConfigPayloadDocumentNumberingConfigEdgeArgs = {
  orderBy?: Array<DocumentNumberingConfigOrderBy>;
};

/** All input for the `updateInventoryAdjustmentById` mutation. */
export type UpdateInventoryAdjustmentByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `InventoryAdjustment` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `InventoryAdjustment` being updated. */
  patch: InventoryAdjustmentPatch;
};

/** All input for the `updateInventoryAdjustment` mutation. */
export type UpdateInventoryAdjustmentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `InventoryAdjustment` being updated. */
  patch: InventoryAdjustmentPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `InventoryAdjustment` mutation. */
export type UpdateInventoryAdjustmentPayload = {
  __typename?: 'UpdateInventoryAdjustmentPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `InventoryAdjustment` that was updated by this mutation. */
  inventoryAdjustment?: Maybe<InventoryAdjustment>;
  /** An edge for our `InventoryAdjustment`. May be used by Relay 1. */
  inventoryAdjustmentEdge?: Maybe<InventoryAdjustmentEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `InventoryAdjustment` mutation. */
export type UpdateInventoryAdjustmentPayloadInventoryAdjustmentEdgeArgs = {
  orderBy?: Array<InventoryAdjustmentOrderBy>;
};

/** All input for the `updateInvoiceById` mutation. */
export type UpdateInvoiceByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Invoice` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Invoice` being updated. */
  patch: InvoicePatch;
};

/** All input for the `updateInvoice` mutation. */
export type UpdateInvoiceInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Invoice` being updated. */
  patch: InvoicePatch;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `updateInvoiceLineItemById` mutation. */
export type UpdateInvoiceLineItemByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `InvoiceLineItem` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `InvoiceLineItem` being updated. */
  patch: InvoiceLineItemPatch;
};

/** All input for the `updateInvoiceLineItem` mutation. */
export type UpdateInvoiceLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `InvoiceLineItem` being updated. */
  patch: InvoiceLineItemPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `InvoiceLineItem` mutation. */
export type UpdateInvoiceLineItemPayload = {
  __typename?: 'UpdateInvoiceLineItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `InvoiceLineItem` that was updated by this mutation. */
  invoiceLineItem?: Maybe<InvoiceLineItem>;
  /** An edge for our `InvoiceLineItem`. May be used by Relay 1. */
  invoiceLineItemEdge?: Maybe<InvoiceLineItemEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `InvoiceLineItem` mutation. */
export type UpdateInvoiceLineItemPayloadInvoiceLineItemEdgeArgs = {
  orderBy?: Array<InvoiceLineItemOrderBy>;
};

/** The output of our update `Invoice` mutation. */
export type UpdateInvoicePayload = {
  __typename?: 'UpdateInvoicePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Invoice` that was updated by this mutation. */
  invoice?: Maybe<Invoice>;
  /** An edge for our `Invoice`. May be used by Relay 1. */
  invoiceEdge?: Maybe<InvoiceEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Invoice` mutation. */
export type UpdateInvoicePayloadInvoiceEdgeArgs = {
  orderBy?: Array<InvoiceOrderBy>;
};

/** All input for the `updateOrganizationSettingById` mutation. */
export type UpdateOrganizationSettingByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `OrganizationSetting` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `OrganizationSetting` being updated. */
  patch: OrganizationSettingPatch;
};

/** All input for the `updateOrganizationSetting` mutation. */
export type UpdateOrganizationSettingInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `OrganizationSetting` being updated. */
  patch: OrganizationSettingPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `OrganizationSetting` mutation. */
export type UpdateOrganizationSettingPayload = {
  __typename?: 'UpdateOrganizationSettingPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `OrganizationSetting` that was updated by this mutation. */
  organizationSetting?: Maybe<OrganizationSetting>;
  /** An edge for our `OrganizationSetting`. May be used by Relay 1. */
  organizationSettingEdge?: Maybe<OrganizationSettingEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `OrganizationSetting` mutation. */
export type UpdateOrganizationSettingPayloadOrganizationSettingEdgeArgs = {
  orderBy?: Array<OrganizationSettingOrderBy>;
};

/** All input for the `updatePersonById` mutation. */
export type UpdatePersonByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Person` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Person` being updated. */
  patch: PersonPatch;
};

/** All input for the `updatePerson` mutation. */
export type UpdatePersonInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Person` being updated. */
  patch: PersonPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Person` mutation. */
export type UpdatePersonPayload = {
  __typename?: 'UpdatePersonPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Person` that was updated by this mutation. */
  person?: Maybe<Person>;
  /** An edge for our `Person`. May be used by Relay 1. */
  personEdge?: Maybe<PersonEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Person` mutation. */
export type UpdatePersonPayloadPersonEdgeArgs = {
  orderBy?: Array<PersonOrderBy>;
};

/** All input for the `updateProductById` mutation. */
export type UpdateProductByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Product` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Product` being updated. */
  patch: ProductPatch;
};

/** All input for the `updateProduct` mutation. */
export type UpdateProductInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Product` being updated. */
  patch: ProductPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Product` mutation. */
export type UpdateProductPayload = {
  __typename?: 'UpdateProductPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Product` that was updated by this mutation. */
  product?: Maybe<Product>;
  /** An edge for our `Product`. May be used by Relay 1. */
  productEdge?: Maybe<ProductEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `Product` mutation. */
export type UpdateProductPayloadProductEdgeArgs = {
  orderBy?: Array<ProductOrderBy>;
};

/** All input for the `updateQuoteById` mutation. */
export type UpdateQuoteByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Quote` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Quote` being updated. */
  patch: QuotePatch;
};

/** All input for the `updateQuote` mutation. */
export type UpdateQuoteInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Quote` being updated. */
  patch: QuotePatch;
  rowId: Scalars['UUID']['input'];
};

/** All input for the `updateQuoteLineItemById` mutation. */
export type UpdateQuoteLineItemByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `QuoteLineItem` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `QuoteLineItem` being updated. */
  patch: QuoteLineItemPatch;
};

/** All input for the `updateQuoteLineItem` mutation. */
export type UpdateQuoteLineItemInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `QuoteLineItem` being updated. */
  patch: QuoteLineItemPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `QuoteLineItem` mutation. */
export type UpdateQuoteLineItemPayload = {
  __typename?: 'UpdateQuoteLineItemPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `QuoteLineItem` that was updated by this mutation. */
  quoteLineItem?: Maybe<QuoteLineItem>;
  /** An edge for our `QuoteLineItem`. May be used by Relay 1. */
  quoteLineItemEdge?: Maybe<QuoteLineItemEdge>;
};


/** The output of our update `QuoteLineItem` mutation. */
export type UpdateQuoteLineItemPayloadQuoteLineItemEdgeArgs = {
  orderBy?: Array<QuoteLineItemOrderBy>;
};

/** The output of our update `Quote` mutation. */
export type UpdateQuotePayload = {
  __typename?: 'UpdateQuotePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Quote` that was updated by this mutation. */
  quote?: Maybe<Quote>;
  /** An edge for our `Quote`. May be used by Relay 1. */
  quoteEdge?: Maybe<QuoteEdge>;
};


/** The output of our update `Quote` mutation. */
export type UpdateQuotePayloadQuoteEdgeArgs = {
  orderBy?: Array<QuoteOrderBy>;
};

export type AllCompaniesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type AllCompaniesQuery = { __typename?: 'Query', companies?: { __typename?: 'CompanyConnection', nodes: Array<{ __typename?: 'Company', rowId: string, organizationId: string, name: string, website?: string | null, industry?: string | null, phone?: string | null, email?: string | null, addressLine1?: string | null, addressLine2?: string | null, city?: string | null, state?: string | null, postalCode?: string | null, country?: string | null, notes?: string | null, createdAt?: string | null, updatedAt?: string | null } | null> } | null };

export type CreateCompanyMutationVariables = Exact<{
  input: CreateCompanyInput;
}>;


export type CreateCompanyMutation = { __typename?: 'Mutation', createCompany?: { __typename?: 'CreateCompanyPayload', company?: { __typename?: 'Company', rowId: string, name: string } | null } | null };

export type UpdateCompanyMutationVariables = Exact<{
  input: UpdateCompanyInput;
}>;


export type UpdateCompanyMutation = { __typename?: 'Mutation', updateCompany?: { __typename?: 'UpdateCompanyPayload', company?: { __typename?: 'Company', rowId: string, name: string } | null } | null };

export type DeleteCompanyMutationVariables = Exact<{
  input: DeleteCompanyInput;
}>;


export type DeleteCompanyMutation = { __typename?: 'Mutation', deleteCompany?: { __typename?: 'DeleteCompanyPayload', deletedCompanyId?: string | null } | null };

export type CompanyMembersByCompanyQueryVariables = Exact<{
  companyId: Scalars['UUID']['input'];
}>;


export type CompanyMembersByCompanyQuery = { __typename?: 'Query', companyMembers?: { __typename?: 'CompanyMemberConnection', nodes: Array<{ __typename?: 'CompanyMember', rowId: string, companyId: string, personId: string, title?: string | null, isPrimary?: boolean | null, createdAt?: string | null, person?: { __typename?: 'Person', rowId: string, firstName: string, lastName: string } | null } | null> } | null };

export type CompanyMembersByPersonQueryVariables = Exact<{
  personId: Scalars['UUID']['input'];
}>;


export type CompanyMembersByPersonQuery = { __typename?: 'Query', companyMembers?: { __typename?: 'CompanyMemberConnection', nodes: Array<{ __typename?: 'CompanyMember', rowId: string, companyId: string, personId: string, title?: string | null, isPrimary?: boolean | null, createdAt?: string | null, company?: { __typename?: 'Company', rowId: string, name: string } | null } | null> } | null };

export type CreateCompanyMemberMutationVariables = Exact<{
  input: CreateCompanyMemberInput;
}>;


export type CreateCompanyMemberMutation = { __typename?: 'Mutation', createCompanyMember?: { __typename?: 'CreateCompanyMemberPayload', companyMember?: { __typename?: 'CompanyMember', rowId: string, companyId: string, personId: string, title?: string | null, isPrimary?: boolean | null } | null } | null };

export type UpdateCompanyMemberMutationVariables = Exact<{
  input: UpdateCompanyMemberInput;
}>;


export type UpdateCompanyMemberMutation = { __typename?: 'Mutation', updateCompanyMember?: { __typename?: 'UpdateCompanyMemberPayload', companyMember?: { __typename?: 'CompanyMember', rowId: string, title?: string | null, isPrimary?: boolean | null } | null } | null };

export type DeleteCompanyMemberMutationVariables = Exact<{
  input: DeleteCompanyMemberInput;
}>;


export type DeleteCompanyMemberMutation = { __typename?: 'Mutation', deleteCompanyMember?: { __typename?: 'DeleteCompanyMemberPayload', deletedCompanyMemberId?: string | null } | null };

export type DocumentNumberingConfigsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type DocumentNumberingConfigsQuery = { __typename?: 'Query', documentNumberingConfigs?: { __typename?: 'DocumentNumberingConfigConnection', nodes: Array<{ __typename?: 'DocumentNumberingConfig', rowId: string, organizationId: string, documentType: string, globalPrefix?: string | null, prefix: string, separator: string, dateFormat?: string | null, idStrategy: string, sequentialPadding: number, randomLength: number, nextSequentialNumber: number } | null> } | null };

export type CreateDocumentNumberingConfigMutationVariables = Exact<{
  input: CreateDocumentNumberingConfigInput;
}>;


export type CreateDocumentNumberingConfigMutation = { __typename?: 'Mutation', createDocumentNumberingConfig?: { __typename?: 'CreateDocumentNumberingConfigPayload', documentNumberingConfig?: { __typename?: 'DocumentNumberingConfig', rowId: string, globalPrefix?: string | null, prefix: string, separator: string, dateFormat?: string | null, idStrategy: string, sequentialPadding: number, randomLength: number } | null } | null };

export type UpdateDocumentNumberingConfigMutationVariables = Exact<{
  input: UpdateDocumentNumberingConfigInput;
}>;


export type UpdateDocumentNumberingConfigMutation = { __typename?: 'Mutation', updateDocumentNumberingConfig?: { __typename?: 'UpdateDocumentNumberingConfigPayload', documentNumberingConfig?: { __typename?: 'DocumentNumberingConfig', rowId: string, globalPrefix?: string | null, prefix: string, separator: string, dateFormat?: string | null, idStrategy: string, sequentialPadding: number, randomLength: number } | null } | null };

export type GenerateDocumentNumberMutationVariables = Exact<{
  input: GenerateDocumentNumberInput;
}>;


export type GenerateDocumentNumberMutation = { __typename?: 'Mutation', generateDocumentNumber?: { __typename?: 'GenerateDocumentNumberPayload', documentNumber: string } | null };

export type AllInvoicesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type AllInvoicesQuery = { __typename?: 'Query', invoices?: { __typename?: 'InvoiceConnection', nodes: Array<{ __typename?: 'Invoice', rowId: string, organizationId: string, invoiceNumber: string, companyId?: string | null, contactId?: string | null, billTo?: string | null, status: string, issueDate: string, dueDate?: string | null, notes?: string | null, subtotal?: string | null, taxRate?: string | null, taxAmount?: string | null, total?: string | null, currency?: string | null, paidAt?: string | null, paymentReference?: string | null, paymentLinkUrl?: string | null, createdAt?: string | null, updatedAt?: string | null, company?: { __typename?: 'Company', rowId: string, name: string } | null, contact?: { __typename?: 'Person', rowId: string, firstName: string, lastName: string } | null, invoiceLineItems: { __typename?: 'InvoiceLineItemConnection', nodes: Array<{ __typename?: 'InvoiceLineItem', rowId: string, invoiceId: string, productId?: string | null, description: string, quantity: string, unitPrice: string, amount: string, sortOrder?: number | null } | null> } } | null> } | null };

export type CreateInvoiceMutationVariables = Exact<{
  input: CreateInvoiceInput;
}>;


export type CreateInvoiceMutation = { __typename?: 'Mutation', createInvoice?: { __typename?: 'CreateInvoicePayload', invoice?: { __typename?: 'Invoice', rowId: string, invoiceNumber: string } | null } | null };

export type UpdateInvoiceMutationVariables = Exact<{
  input: UpdateInvoiceInput;
}>;


export type UpdateInvoiceMutation = { __typename?: 'Mutation', updateInvoice?: { __typename?: 'UpdateInvoicePayload', invoice?: { __typename?: 'Invoice', rowId: string, invoiceNumber: string } | null } | null };

export type DeleteInvoiceMutationVariables = Exact<{
  input: DeleteInvoiceInput;
}>;


export type DeleteInvoiceMutation = { __typename?: 'Mutation', deleteInvoice?: { __typename?: 'DeleteInvoicePayload', deletedInvoiceId?: string | null } | null };

export type CreateInvoiceLineItemMutationVariables = Exact<{
  input: CreateInvoiceLineItemInput;
}>;


export type CreateInvoiceLineItemMutation = { __typename?: 'Mutation', createInvoiceLineItem?: { __typename?: 'CreateInvoiceLineItemPayload', invoiceLineItem?: { __typename?: 'InvoiceLineItem', rowId: string } | null } | null };

export type DeleteInvoiceLineItemMutationVariables = Exact<{
  input: DeleteInvoiceLineItemInput;
}>;


export type DeleteInvoiceLineItemMutation = { __typename?: 'Mutation', deleteInvoiceLineItem?: { __typename?: 'DeleteInvoiceLineItemPayload', deletedInvoiceLineItemId?: string | null } | null };

export type AllPeopleQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type AllPeopleQuery = { __typename?: 'Query', people?: { __typename?: 'PersonConnection', nodes: Array<{ __typename?: 'Person', rowId: string, organizationId: string, firstName: string, lastName: string, emails?: Array<string | null> | null, phone?: string | null, internal: boolean, avatarUrl?: string | null, tags?: Array<string | null> | null, notes?: string | null, createdAt?: string | null, updatedAt?: string | null } | null> } | null };

export type CreatePersonMutationVariables = Exact<{
  input: CreatePersonInput;
}>;


export type CreatePersonMutation = { __typename?: 'Mutation', createPerson?: { __typename?: 'CreatePersonPayload', person?: { __typename?: 'Person', rowId: string, firstName: string, lastName: string } | null } | null };

export type UpdatePersonMutationVariables = Exact<{
  input: UpdatePersonInput;
}>;


export type UpdatePersonMutation = { __typename?: 'Mutation', updatePerson?: { __typename?: 'UpdatePersonPayload', person?: { __typename?: 'Person', rowId: string, firstName: string, lastName: string } | null } | null };

export type DeletePersonMutationVariables = Exact<{
  input: DeletePersonInput;
}>;


export type DeletePersonMutation = { __typename?: 'Mutation', deletePerson?: { __typename?: 'DeletePersonPayload', deletedPersonId?: string | null } | null };

export type AllProductsQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type AllProductsQuery = { __typename?: 'Query', products?: { __typename?: 'ProductConnection', nodes: Array<{ __typename?: 'Product', rowId: string, organizationId: string, name: string, description?: string | null, sku?: string | null, unitPrice?: string | null, currentQuantity?: number | null, lowStockThreshold?: number | null, isActive?: boolean | null, createdAt?: string | null, updatedAt?: string | null } | null> } | null };

export type CreateProductMutationVariables = Exact<{
  input: CreateProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct?: { __typename?: 'CreateProductPayload', product?: { __typename?: 'Product', rowId: string, name: string } | null } | null };

export type UpdateProductMutationVariables = Exact<{
  input: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct?: { __typename?: 'UpdateProductPayload', product?: { __typename?: 'Product', rowId: string, name: string } | null } | null };

export type DeleteProductMutationVariables = Exact<{
  input: DeleteProductInput;
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct?: { __typename?: 'DeleteProductPayload', deletedProductId?: string | null } | null };

export type InventoryAdjustmentsQueryVariables = Exact<{
  productId: Scalars['UUID']['input'];
}>;


export type InventoryAdjustmentsQuery = { __typename?: 'Query', inventoryAdjustments?: { __typename?: 'InventoryAdjustmentConnection', nodes: Array<{ __typename?: 'InventoryAdjustment', rowId: string, productId: string, quantityChange: number, reason: string, referenceId?: string | null, createdAt?: string | null } | null> } | null };

export type CreateInventoryAdjustmentMutationVariables = Exact<{
  input: CreateInventoryAdjustmentInput;
}>;


export type CreateInventoryAdjustmentMutation = { __typename?: 'Mutation', createInventoryAdjustment?: { __typename?: 'CreateInventoryAdjustmentPayload', inventoryAdjustment?: { __typename?: 'InventoryAdjustment', rowId: string, quantityChange: number } | null } | null };

export type AllQuotesQueryVariables = Exact<{
  organizationId: Scalars['String']['input'];
}>;


export type AllQuotesQuery = { __typename?: 'Query', quotes?: { __typename?: 'QuoteConnection', nodes: Array<{ __typename?: 'Quote', rowId: string, organizationId: string, quoteNumber: string, companyId?: string | null, contactId?: string | null, clientName?: string | null, clientEmail?: string | null, additionalItemsLabel?: string | null, title: string, description?: string | null, status: string, validUntil: string, projectType?: string | null, timeRange?: string | null, terms?: string | null, additionalTerms?: Array<string | null> | null, notes?: string | null, subtotal?: string | null, taxRate?: string | null, taxAmount?: string | null, total?: string | null, currency?: string | null, convertedInvoiceId?: string | null, createdAt?: string | null, updatedAt?: string | null, company?: { __typename?: 'Company', rowId: string, name: string } | null, contact?: { __typename?: 'Person', rowId: string, firstName: string, lastName: string } | null, quoteLineItems: { __typename?: 'QuoteLineItemConnection', nodes: Array<{ __typename?: 'QuoteLineItem', rowId: string, quoteId: string, productId?: string | null, description: string, subtitle?: string | null, quantity: string, unitPrice: string, amount: string, pricingType: string, estimatedHours?: string | null, hourlyRate?: string | null, weeklyCapHours?: number | null, monthlyCapHours?: number | null, maxCapHours?: number | null, minimumBillingMinutes?: number | null, royaltyPercentage?: string | null, royaltyTimeframe?: number | null, royaltyTimeframeUnit?: string | null, royaltyThreshold?: string | null, royaltyBuyoutAmount?: string | null, sortOrder?: number | null } | null> } } | null> } | null };

export type CreateQuoteMutationVariables = Exact<{
  input: CreateQuoteInput;
}>;


export type CreateQuoteMutation = { __typename?: 'Mutation', createQuote?: { __typename?: 'CreateQuotePayload', quote?: { __typename?: 'Quote', rowId: string, quoteNumber: string } | null } | null };

export type UpdateQuoteMutationVariables = Exact<{
  input: UpdateQuoteInput;
}>;


export type UpdateQuoteMutation = { __typename?: 'Mutation', updateQuote?: { __typename?: 'UpdateQuotePayload', quote?: { __typename?: 'Quote', rowId: string, quoteNumber: string } | null } | null };

export type DeleteQuoteMutationVariables = Exact<{
  input: DeleteQuoteInput;
}>;


export type DeleteQuoteMutation = { __typename?: 'Mutation', deleteQuote?: { __typename?: 'DeleteQuotePayload', deletedQuoteId?: string | null } | null };

export type CreateQuoteLineItemMutationVariables = Exact<{
  input: CreateQuoteLineItemInput;
}>;


export type CreateQuoteLineItemMutation = { __typename?: 'Mutation', createQuoteLineItem?: { __typename?: 'CreateQuoteLineItemPayload', quoteLineItem?: { __typename?: 'QuoteLineItem', rowId: string } | null } | null };

export type DeleteQuoteLineItemMutationVariables = Exact<{
  input: DeleteQuoteLineItemInput;
}>;


export type DeleteQuoteLineItemMutation = { __typename?: 'Mutation', deleteQuoteLineItem?: { __typename?: 'DeleteQuoteLineItemPayload', deletedQuoteLineItemId?: string | null } | null };


export const AllCompaniesDocument = gql`
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
    `;
export const CompanyMembersByPersonDocument = gql`
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
export const DocumentNumberingConfigsDocument = gql`
    query DocumentNumberingConfigs($organizationId: String!) {
  documentNumberingConfigs(condition: {organizationId: $organizationId}) {
    nodes {
      rowId
      organizationId
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
export const GenerateDocumentNumberDocument = gql`
    mutation GenerateDocumentNumber($input: GenerateDocumentNumberInput!) {
  generateDocumentNumber(input: $input) {
    documentNumber
  }
}
    `;
export const AllInvoicesDocument = gql`
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
export const AllPeopleDocument = gql`
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
      quoteLineItems {
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
    DocumentNumberingConfigs(variables: DocumentNumberingConfigsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DocumentNumberingConfigsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<DocumentNumberingConfigsQuery>({ document: DocumentNumberingConfigsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DocumentNumberingConfigs', 'query', variables);
    },
    CreateDocumentNumberingConfig(variables: CreateDocumentNumberingConfigMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CreateDocumentNumberingConfigMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateDocumentNumberingConfigMutation>({ document: CreateDocumentNumberingConfigDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CreateDocumentNumberingConfig', 'mutation', variables);
    },
    UpdateDocumentNumberingConfig(variables: UpdateDocumentNumberingConfigMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<UpdateDocumentNumberingConfigMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateDocumentNumberingConfigMutation>({ document: UpdateDocumentNumberingConfigDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'UpdateDocumentNumberingConfig', 'mutation', variables);
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
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;