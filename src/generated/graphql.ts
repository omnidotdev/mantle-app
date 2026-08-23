// @ts-nocheck
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { DocumentTypeDecoration } from '@graphql-typed-document-node/core';
import { useQuery, useSuspenseQuery, useInfiniteQuery, useSuspenseInfiniteQuery, useMutation, UseQueryOptions, UseSuspenseQueryOptions, UseInfiniteQueryOptions, InfiniteData, UseSuspenseInfiniteQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { graphqlFetch } from '@/lib/graphql/graphqlFetch';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: { input: string; output: string; }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: string; output: string; }
  /** A calendar date in YYYY-MM-DD format. */
  Date: { input: Date; output: string; }
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
   * 3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
   * that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
   * to unexpected results.
   */
  Datetime: { input: Date; output: string; }
  /** Represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: unknown; output: unknown; }
  /** A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122). */
  UUID: { input: string; output: string; }
};

export type ChannelConnection = Node & {
  __typename?: 'ChannelConnection';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  credentials: Scalars['JSON']['output'];
  externalShopId?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  lastSyncedAt?: Maybe<Scalars['Datetime']['output']>;
  organizationId: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  scopes?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  status: Scalars['String']['output'];
  syncConfig: Scalars['JSON']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `ChannelConnection` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type ChannelConnectionCondition = {
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `provider` field. */
  provider?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `ChannelConnection` values. */
export type ChannelConnectionConnection = {
  __typename?: 'ChannelConnectionConnection';
  /** A list of edges which contains the `ChannelConnection` and cursor to aid in pagination. */
  edges: Array<Maybe<ChannelConnectionEdge>>;
  /** A list of `ChannelConnection` objects. */
  nodes: Array<Maybe<ChannelConnection>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ChannelConnection` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ChannelConnection` edge in the connection. */
export type ChannelConnectionEdge = {
  __typename?: 'ChannelConnectionEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ChannelConnection` at the end of the edge. */
  node?: Maybe<ChannelConnection>;
};

/** A filter to be used against `ChannelConnection` object types. All fields are combined with a logical ‘and.’ */
export type ChannelConnectionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ChannelConnectionFilter>>;
  /** Negates the expression. */
  not?: InputMaybe<ChannelConnectionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ChannelConnectionFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `provider` field. */
  provider?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `ChannelConnection` */
export type ChannelConnectionInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  credentials?: InputMaybe<Scalars['JSON']['input']>;
  externalShopId?: InputMaybe<Scalars['String']['input']>;
  lastSyncedAt?: InputMaybe<Scalars['Datetime']['input']>;
  organizationId: Scalars['String']['input'];
  provider: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  scopes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<Scalars['String']['input']>;
  syncConfig?: InputMaybe<Scalars['JSON']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `ChannelConnection`. */
export enum ChannelConnectionOrderBy {
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProviderAsc = 'PROVIDER_ASC',
  ProviderDesc = 'PROVIDER_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `ChannelConnection`. Fields that are set will be updated. */
export type ChannelConnectionPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  credentials?: InputMaybe<Scalars['JSON']['input']>;
  externalShopId?: InputMaybe<Scalars['String']['input']>;
  lastSyncedAt?: InputMaybe<Scalars['Datetime']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  scopes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<Scalars['String']['input']>;
  syncConfig?: InputMaybe<Scalars['JSON']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
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

/** All input for the create `ChannelConnection` mutation. */
export type CreateChannelConnectionInput = {
  /** The `ChannelConnection` to be created by this mutation. */
  channelConnection: ChannelConnectionInput;
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our create `ChannelConnection` mutation. */
export type CreateChannelConnectionPayload = {
  __typename?: 'CreateChannelConnectionPayload';
  /** The `ChannelConnection` that was created by this mutation. */
  channelConnection?: Maybe<ChannelConnection>;
  /** An edge for our `ChannelConnection`. May be used by Relay 1. */
  channelConnectionEdge?: Maybe<ChannelConnectionEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ChannelConnection` mutation. */
export type CreateChannelConnectionPayloadChannelConnectionEdgeArgs = {
  orderBy?: Array<ChannelConnectionOrderBy>;
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

/** All input for the create `PersonExternalLink` mutation. */
export type CreatePersonExternalLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `PersonExternalLink` to be created by this mutation. */
  personExternalLink: PersonExternalLinkInput;
};

/** The output of our create `PersonExternalLink` mutation. */
export type CreatePersonExternalLinkPayload = {
  __typename?: 'CreatePersonExternalLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `PersonExternalLink` that was created by this mutation. */
  personExternalLink?: Maybe<PersonExternalLink>;
  /** An edge for our `PersonExternalLink`. May be used by Relay 1. */
  personExternalLinkEdge?: Maybe<PersonExternalLinkEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `PersonExternalLink` mutation. */
export type CreatePersonExternalLinkPayloadPersonExternalLinkEdgeArgs = {
  orderBy?: Array<PersonExternalLinkOrderBy>;
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

/** All input for the create `ProductExternalLink` mutation. */
export type CreateProductExternalLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `ProductExternalLink` to be created by this mutation. */
  productExternalLink: ProductExternalLinkInput;
};

/** The output of our create `ProductExternalLink` mutation. */
export type CreateProductExternalLinkPayload = {
  __typename?: 'CreateProductExternalLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProductExternalLink` that was created by this mutation. */
  productExternalLink?: Maybe<ProductExternalLink>;
  /** An edge for our `ProductExternalLink`. May be used by Relay 1. */
  productExternalLinkEdge?: Maybe<ProductExternalLinkEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our create `ProductExternalLink` mutation. */
export type CreateProductExternalLinkPayloadProductExternalLinkEdgeArgs = {
  orderBy?: Array<ProductExternalLinkOrderBy>;
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

/** All input for the create `Supplier` mutation. */
export type CreateSupplierInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Supplier` to be created by this mutation. */
  supplier: SupplierInput;
};

/** The output of our create `Supplier` mutation. */
export type CreateSupplierPayload = {
  __typename?: 'CreateSupplierPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Supplier` that was created by this mutation. */
  supplier?: Maybe<Supplier>;
  /** An edge for our `Supplier`. May be used by Relay 1. */
  supplierEdge?: Maybe<SupplierEdge>;
};


/** The output of our create `Supplier` mutation. */
export type CreateSupplierPayloadSupplierEdgeArgs = {
  orderBy?: Array<SupplierOrderBy>;
};

/** All input for the `deleteChannelConnectionById` mutation. */
export type DeleteChannelConnectionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ChannelConnection` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteChannelConnection` mutation. */
export type DeleteChannelConnectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `ChannelConnection` mutation. */
export type DeleteChannelConnectionPayload = {
  __typename?: 'DeleteChannelConnectionPayload';
  /** The `ChannelConnection` that was deleted by this mutation. */
  channelConnection?: Maybe<ChannelConnection>;
  /** An edge for our `ChannelConnection`. May be used by Relay 1. */
  channelConnectionEdge?: Maybe<ChannelConnectionEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedChannelConnectionId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ChannelConnection` mutation. */
export type DeleteChannelConnectionPayloadChannelConnectionEdgeArgs = {
  orderBy?: Array<ChannelConnectionOrderBy>;
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

/** All input for the `deletePersonExternalLinkById` mutation. */
export type DeletePersonExternalLinkByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `PersonExternalLink` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deletePersonExternalLink` mutation. */
export type DeletePersonExternalLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `PersonExternalLink` mutation. */
export type DeletePersonExternalLinkPayload = {
  __typename?: 'DeletePersonExternalLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPersonExternalLinkId?: Maybe<Scalars['ID']['output']>;
  /** The `PersonExternalLink` that was deleted by this mutation. */
  personExternalLink?: Maybe<PersonExternalLink>;
  /** An edge for our `PersonExternalLink`. May be used by Relay 1. */
  personExternalLinkEdge?: Maybe<PersonExternalLinkEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `PersonExternalLink` mutation. */
export type DeletePersonExternalLinkPayloadPersonExternalLinkEdgeArgs = {
  orderBy?: Array<PersonExternalLinkOrderBy>;
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

/** All input for the `deleteProductExternalLinkById` mutation. */
export type DeleteProductExternalLinkByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProductExternalLink` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteProductExternalLink` mutation. */
export type DeleteProductExternalLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `ProductExternalLink` mutation. */
export type DeleteProductExternalLinkPayload = {
  __typename?: 'DeleteProductExternalLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedProductExternalLinkId?: Maybe<Scalars['ID']['output']>;
  /** The `ProductExternalLink` that was deleted by this mutation. */
  productExternalLink?: Maybe<ProductExternalLink>;
  /** An edge for our `ProductExternalLink`. May be used by Relay 1. */
  productExternalLinkEdge?: Maybe<ProductExternalLinkEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our delete `ProductExternalLink` mutation. */
export type DeleteProductExternalLinkPayloadProductExternalLinkEdgeArgs = {
  orderBy?: Array<ProductExternalLinkOrderBy>;
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

/** All input for the `deleteSupplierById` mutation. */
export type DeleteSupplierByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Supplier` to be deleted. */
  id: Scalars['ID']['input'];
};

/** All input for the `deleteSupplier` mutation. */
export type DeleteSupplierInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  rowId: Scalars['UUID']['input'];
};

/** The output of our delete `Supplier` mutation. */
export type DeleteSupplierPayload = {
  __typename?: 'DeleteSupplierPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedSupplierId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Supplier` that was deleted by this mutation. */
  supplier?: Maybe<Supplier>;
  /** An edge for our `Supplier`. May be used by Relay 1. */
  supplierEdge?: Maybe<SupplierEdge>;
};


/** The output of our delete `Supplier` mutation. */
export type DeleteSupplierPayloadSupplierEdgeArgs = {
  orderBy?: Array<SupplierOrderBy>;
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

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']['input']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']['input']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']['input']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']['input']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
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

export type InvoiceHtmlPayload = {
  __typename?: 'InvoiceHtmlPayload';
  filename: Scalars['String']['output'];
  html: Scalars['String']['output'];
  invoiceNumber: Scalars['String']['output'];
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
  /** Creates a single `ChannelConnection`. */
  createChannelConnection?: Maybe<CreateChannelConnectionPayload>;
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
  /** Creates a single `PersonExternalLink`. */
  createPersonExternalLink?: Maybe<CreatePersonExternalLinkPayload>;
  /** Creates a single `Product`. */
  createProduct?: Maybe<CreateProductPayload>;
  /** Creates a single `ProductExternalLink`. */
  createProductExternalLink?: Maybe<CreateProductExternalLinkPayload>;
  /** Creates a single `Quote`. */
  createQuote?: Maybe<CreateQuotePayload>;
  /** Creates a single `QuoteLineItem`. */
  createQuoteLineItem?: Maybe<CreateQuoteLineItemPayload>;
  /** Creates a single `Supplier`. */
  createSupplier?: Maybe<CreateSupplierPayload>;
  /** Deletes a single `ChannelConnection` using a unique key. */
  deleteChannelConnection?: Maybe<DeleteChannelConnectionPayload>;
  /** Deletes a single `ChannelConnection` using its globally unique id. */
  deleteChannelConnectionById?: Maybe<DeleteChannelConnectionPayload>;
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
  /** Deletes a single `PersonExternalLink` using a unique key. */
  deletePersonExternalLink?: Maybe<DeletePersonExternalLinkPayload>;
  /** Deletes a single `PersonExternalLink` using its globally unique id. */
  deletePersonExternalLinkById?: Maybe<DeletePersonExternalLinkPayload>;
  /** Deletes a single `Product` using a unique key. */
  deleteProduct?: Maybe<DeleteProductPayload>;
  /** Deletes a single `Product` using its globally unique id. */
  deleteProductById?: Maybe<DeleteProductPayload>;
  /** Deletes a single `ProductExternalLink` using a unique key. */
  deleteProductExternalLink?: Maybe<DeleteProductExternalLinkPayload>;
  /** Deletes a single `ProductExternalLink` using its globally unique id. */
  deleteProductExternalLinkById?: Maybe<DeleteProductExternalLinkPayload>;
  /** Deletes a single `Quote` using a unique key. */
  deleteQuote?: Maybe<DeleteQuotePayload>;
  /** Deletes a single `Quote` using its globally unique id. */
  deleteQuoteById?: Maybe<DeleteQuotePayload>;
  /** Deletes a single `QuoteLineItem` using a unique key. */
  deleteQuoteLineItem?: Maybe<DeleteQuoteLineItemPayload>;
  /** Deletes a single `QuoteLineItem` using its globally unique id. */
  deleteQuoteLineItemById?: Maybe<DeleteQuoteLineItemPayload>;
  /** Deletes a single `Supplier` using a unique key. */
  deleteSupplier?: Maybe<DeleteSupplierPayload>;
  /** Deletes a single `Supplier` using its globally unique id. */
  deleteSupplierById?: Maybe<DeleteSupplierPayload>;
  generateDocumentNumber?: Maybe<GenerateDocumentNumberPayload>;
  /** Updates a single `ChannelConnection` using a unique key and a patch. */
  updateChannelConnection?: Maybe<UpdateChannelConnectionPayload>;
  /** Updates a single `ChannelConnection` using its globally unique id and a patch. */
  updateChannelConnectionById?: Maybe<UpdateChannelConnectionPayload>;
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
  /** Updates a single `PersonExternalLink` using a unique key and a patch. */
  updatePersonExternalLink?: Maybe<UpdatePersonExternalLinkPayload>;
  /** Updates a single `PersonExternalLink` using its globally unique id and a patch. */
  updatePersonExternalLinkById?: Maybe<UpdatePersonExternalLinkPayload>;
  /** Updates a single `Product` using a unique key and a patch. */
  updateProduct?: Maybe<UpdateProductPayload>;
  /** Updates a single `Product` using its globally unique id and a patch. */
  updateProductById?: Maybe<UpdateProductPayload>;
  /** Updates a single `ProductExternalLink` using a unique key and a patch. */
  updateProductExternalLink?: Maybe<UpdateProductExternalLinkPayload>;
  /** Updates a single `ProductExternalLink` using its globally unique id and a patch. */
  updateProductExternalLinkById?: Maybe<UpdateProductExternalLinkPayload>;
  /** Updates a single `Quote` using a unique key and a patch. */
  updateQuote?: Maybe<UpdateQuotePayload>;
  /** Updates a single `Quote` using its globally unique id and a patch. */
  updateQuoteById?: Maybe<UpdateQuotePayload>;
  /** Updates a single `QuoteLineItem` using a unique key and a patch. */
  updateQuoteLineItem?: Maybe<UpdateQuoteLineItemPayload>;
  /** Updates a single `QuoteLineItem` using its globally unique id and a patch. */
  updateQuoteLineItemById?: Maybe<UpdateQuoteLineItemPayload>;
  /** Updates a single `Supplier` using a unique key and a patch. */
  updateSupplier?: Maybe<UpdateSupplierPayload>;
  /** Updates a single `Supplier` using its globally unique id and a patch. */
  updateSupplierById?: Maybe<UpdateSupplierPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateChannelConnectionArgs = {
  input: CreateChannelConnectionInput;
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
export type MutationCreatePersonExternalLinkArgs = {
  input: CreatePersonExternalLinkInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProductArgs = {
  input: CreateProductInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateProductExternalLinkArgs = {
  input: CreateProductExternalLinkInput;
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
export type MutationCreateSupplierArgs = {
  input: CreateSupplierInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChannelConnectionArgs = {
  input: DeleteChannelConnectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteChannelConnectionByIdArgs = {
  input: DeleteChannelConnectionByIdInput;
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
export type MutationDeletePersonExternalLinkArgs = {
  input: DeletePersonExternalLinkInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePersonExternalLinkByIdArgs = {
  input: DeletePersonExternalLinkByIdInput;
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
export type MutationDeleteProductExternalLinkArgs = {
  input: DeleteProductExternalLinkInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteProductExternalLinkByIdArgs = {
  input: DeleteProductExternalLinkByIdInput;
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
export type MutationDeleteSupplierArgs = {
  input: DeleteSupplierInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteSupplierByIdArgs = {
  input: DeleteSupplierByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationGenerateDocumentNumberArgs = {
  input: GenerateDocumentNumberInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChannelConnectionArgs = {
  input: UpdateChannelConnectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateChannelConnectionByIdArgs = {
  input: UpdateChannelConnectionByIdInput;
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
export type MutationUpdatePersonExternalLinkArgs = {
  input: UpdatePersonExternalLinkInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePersonExternalLinkByIdArgs = {
  input: UpdatePersonExternalLinkByIdInput;
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
export type MutationUpdateProductExternalLinkArgs = {
  input: UpdateProductExternalLinkInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateProductExternalLinkByIdArgs = {
  input: UpdateProductExternalLinkByIdInput;
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


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSupplierArgs = {
  input: UpdateSupplierInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateSupplierByIdArgs = {
  input: UpdateSupplierByIdInput;
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
  emailConsent: Scalars['Boolean']['output'];
  emails?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  firstName: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  internal: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `PersonExternalLink`. */
  personExternalLinks: PersonExternalLinkConnection;
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


export type PersonPersonExternalLinksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PersonExternalLinkCondition>;
  filter?: InputMaybe<PersonExternalLinkFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PersonExternalLinkOrderBy>>;
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

export type PersonExternalLink = Node & {
  __typename?: 'PersonExternalLink';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  externalId: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Reads a single `Person` that is related to this `PersonExternalLink`. */
  person?: Maybe<Person>;
  personId: Scalars['UUID']['output'];
  provider: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
};

/**
 * A condition to be used against `PersonExternalLink` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PersonExternalLinkCondition = {
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `personId` field. */
  personId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `provider` field. */
  provider?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `PersonExternalLink` values. */
export type PersonExternalLinkConnection = {
  __typename?: 'PersonExternalLinkConnection';
  /** A list of edges which contains the `PersonExternalLink` and cursor to aid in pagination. */
  edges: Array<Maybe<PersonExternalLinkEdge>>;
  /** A list of `PersonExternalLink` objects. */
  nodes: Array<Maybe<PersonExternalLink>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PersonExternalLink` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `PersonExternalLink` edge in the connection. */
export type PersonExternalLinkEdge = {
  __typename?: 'PersonExternalLinkEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `PersonExternalLink` at the end of the edge. */
  node?: Maybe<PersonExternalLink>;
};

/** A filter to be used against `PersonExternalLink` object types. All fields are combined with a logical ‘and.’ */
export type PersonExternalLinkFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PersonExternalLinkFilter>>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PersonExternalLinkFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PersonExternalLinkFilter>>;
  /** Filter by the object’s `person` relation. */
  person?: InputMaybe<PersonFilter>;
  /** Filter by the object’s `personId` field. */
  personId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `provider` field. */
  provider?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `PersonExternalLink` */
export type PersonExternalLinkInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  externalId: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  personId: Scalars['UUID']['input'];
  provider: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** Methods to use when ordering `PersonExternalLink`. */
export enum PersonExternalLinkOrderBy {
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  Natural = 'NATURAL',
  PersonIdAsc = 'PERSON_ID_ASC',
  PersonIdDesc = 'PERSON_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProviderAsc = 'PROVIDER_ASC',
  ProviderDesc = 'PROVIDER_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `PersonExternalLink`. Fields that are set will be updated. */
export type PersonExternalLinkPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  personId?: InputMaybe<Scalars['UUID']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
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
  /** Filter by the object’s `personExternalLinks` relation. */
  personExternalLinks?: InputMaybe<PersonToManyPersonExternalLinkFilter>;
  /** Some related `personExternalLinks` exist. */
  personExternalLinksExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Person` */
export type PersonInput = {
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  emailConsent?: InputMaybe<Scalars['Boolean']['input']>;
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
  emailConsent?: InputMaybe<Scalars['Boolean']['input']>;
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

/** A filter to be used against many `PersonExternalLink` object types. All fields are combined with a logical ‘and.’ */
export type PersonToManyPersonExternalLinkFilter = {
  /** Every related `PersonExternalLink` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PersonExternalLinkFilter>;
  /** No related `PersonExternalLink` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PersonExternalLinkFilter>;
  /** Some related `PersonExternalLink` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PersonExternalLinkFilter>;
};

export type Product = Node & {
  __typename?: 'Product';
  category1?: Maybe<Scalars['String']['output']>;
  category2?: Maybe<Scalars['String']['output']>;
  channels?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  costPrice?: Maybe<Scalars['BigFloat']['output']>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  currentQuantity?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fulfillmentType?: Maybe<Scalars['String']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  imageUrl2?: Maybe<Scalars['String']['output']>;
  imageUrl3?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `InventoryAdjustment`. */
  inventoryAdjustments: InventoryAdjustmentConnection;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isRestricted?: Maybe<Scalars['Boolean']['output']>;
  lowStockThreshold?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  organizationId: Scalars['String']['output'];
  /** Reads and enables pagination through a set of `ProductExternalLink`. */
  productExternalLinks: ProductExternalLinkConnection;
  retailPrice?: Maybe<Scalars['BigFloat']['output']>;
  rowId: Scalars['UUID']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Supplier` that is related to this `Product`. */
  supplier?: Maybe<Supplier>;
  supplierId?: Maybe<Scalars['UUID']['output']>;
  supplierSku?: Maybe<Scalars['String']['output']>;
  unitPrice?: Maybe<Scalars['BigFloat']['output']>;
  upc?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  weight?: Maybe<Scalars['BigFloat']['output']>;
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


export type ProductProductExternalLinksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProductExternalLinkCondition>;
  filter?: InputMaybe<ProductExternalLinkFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProductExternalLinkOrderBy>>;
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

export type ProductExternalLink = Node & {
  __typename?: 'ProductExternalLink';
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  externalId: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  metadata?: Maybe<Scalars['JSON']['output']>;
  /** Reads a single `Product` that is related to this `ProductExternalLink`. */
  product?: Maybe<Product>;
  productId: Scalars['UUID']['output'];
  provider: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
};

/**
 * A condition to be used against `ProductExternalLink` object types. All fields
 * are tested for equality and combined with a logical ‘and.’
 */
export type ProductExternalLinkCondition = {
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `productId` field. */
  productId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `provider` field. */
  provider?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `ProductExternalLink` values. */
export type ProductExternalLinkConnection = {
  __typename?: 'ProductExternalLinkConnection';
  /** A list of edges which contains the `ProductExternalLink` and cursor to aid in pagination. */
  edges: Array<Maybe<ProductExternalLinkEdge>>;
  /** A list of `ProductExternalLink` objects. */
  nodes: Array<Maybe<ProductExternalLink>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ProductExternalLink` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `ProductExternalLink` edge in the connection. */
export type ProductExternalLinkEdge = {
  __typename?: 'ProductExternalLinkEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `ProductExternalLink` at the end of the edge. */
  node?: Maybe<ProductExternalLink>;
};

/** A filter to be used against `ProductExternalLink` object types. All fields are combined with a logical ‘and.’ */
export type ProductExternalLinkFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ProductExternalLinkFilter>>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ProductExternalLinkFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ProductExternalLinkFilter>>;
  /** Filter by the object’s `product` relation. */
  product?: InputMaybe<ProductFilter>;
  /** Filter by the object’s `productId` field. */
  productId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `provider` field. */
  provider?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `ProductExternalLink` */
export type ProductExternalLinkInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  externalId: Scalars['String']['input'];
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  productId: Scalars['UUID']['input'];
  provider: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `ProductExternalLink`. */
export enum ProductExternalLinkOrderBy {
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ProductIdAsc = 'PRODUCT_ID_ASC',
  ProductIdDesc = 'PRODUCT_ID_DESC',
  ProviderAsc = 'PROVIDER_ASC',
  ProviderDesc = 'PROVIDER_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `ProductExternalLink`. Fields that are set will be updated. */
export type ProductExternalLinkPatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  externalId?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<Scalars['JSON']['input']>;
  productId?: InputMaybe<Scalars['UUID']['input']>;
  provider?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
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
  /** Filter by the object’s `productExternalLinks` relation. */
  productExternalLinks?: InputMaybe<ProductToManyProductExternalLinkFilter>;
  /** Some related `productExternalLinks` exist. */
  productExternalLinksExist?: InputMaybe<Scalars['Boolean']['input']>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `sku` field. */
  sku?: InputMaybe<StringFilter>;
  /** Filter by the object’s `supplier` relation. */
  supplier?: InputMaybe<SupplierFilter>;
  /** A related `supplier` exists. */
  supplierExists?: InputMaybe<Scalars['Boolean']['input']>;
};

/** An input for mutations affecting `Product` */
export type ProductInput = {
  category1?: InputMaybe<Scalars['String']['input']>;
  category2?: InputMaybe<Scalars['String']['input']>;
  channels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  costPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  currentQuantity?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  fulfillmentType?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  imageUrl2?: InputMaybe<Scalars['String']['input']>;
  imageUrl3?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isRestricted?: InputMaybe<Scalars['Boolean']['input']>;
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['String']['input'];
  retailPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  supplierId?: InputMaybe<Scalars['UUID']['input']>;
  supplierSku?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  upc?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  weight?: InputMaybe<Scalars['BigFloat']['input']>;
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
  category1?: InputMaybe<Scalars['String']['input']>;
  category2?: InputMaybe<Scalars['String']['input']>;
  channels?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  costPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  currentQuantity?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  fulfillmentType?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  imageUrl2?: InputMaybe<Scalars['String']['input']>;
  imageUrl3?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isRestricted?: InputMaybe<Scalars['Boolean']['input']>;
  lowStockThreshold?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  retailPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  supplierId?: InputMaybe<Scalars['UUID']['input']>;
  supplierSku?: InputMaybe<Scalars['String']['input']>;
  unitPrice?: InputMaybe<Scalars['BigFloat']['input']>;
  upc?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  weight?: InputMaybe<Scalars['BigFloat']['input']>;
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

/** A filter to be used against many `ProductExternalLink` object types. All fields are combined with a logical ‘and.’ */
export type ProductToManyProductExternalLinkFilter = {
  /** Every related `ProductExternalLink` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<ProductExternalLinkFilter>;
  /** No related `ProductExternalLink` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<ProductExternalLinkFilter>;
  /** Some related `ProductExternalLink` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<ProductExternalLinkFilter>;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Get a single `ChannelConnection`. */
  channelConnection?: Maybe<ChannelConnection>;
  /** Reads a single `ChannelConnection` using its globally unique `ID`. */
  channelConnectionById?: Maybe<ChannelConnection>;
  /** Reads and enables pagination through a set of `ChannelConnection`. */
  channelConnections?: Maybe<ChannelConnectionConnection>;
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
  /**
   * Render an invoice as a self-contained HTML document suitable for
   * print-to-PDF or embedding in an iframe. The caller must have
   * access to the invoice's organization.
   */
  invoiceHtml?: Maybe<InvoiceHtmlPayload>;
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
  /** Get a single `PersonExternalLink`. */
  personExternalLink?: Maybe<PersonExternalLink>;
  /** Reads a single `PersonExternalLink` using its globally unique `ID`. */
  personExternalLinkById?: Maybe<PersonExternalLink>;
  /** Reads and enables pagination through a set of `PersonExternalLink`. */
  personExternalLinks?: Maybe<PersonExternalLinkConnection>;
  /** Get a single `Product`. */
  product?: Maybe<Product>;
  /** Reads a single `Product` using its globally unique `ID`. */
  productById?: Maybe<Product>;
  /** Get a single `ProductExternalLink`. */
  productExternalLink?: Maybe<ProductExternalLink>;
  /** Reads a single `ProductExternalLink` using its globally unique `ID`. */
  productExternalLinkById?: Maybe<ProductExternalLink>;
  /** Reads and enables pagination through a set of `ProductExternalLink`. */
  productExternalLinks?: Maybe<ProductExternalLinkConnection>;
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
  /** Get a single `Supplier`. */
  supplier?: Maybe<Supplier>;
  /** Reads a single `Supplier` using its globally unique `ID`. */
  supplierById?: Maybe<Supplier>;
  /** Reads and enables pagination through a set of `Supplier`. */
  suppliers?: Maybe<SupplierConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelConnectionArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelConnectionByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryChannelConnectionsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ChannelConnectionCondition>;
  filter?: InputMaybe<ChannelConnectionFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ChannelConnectionOrderBy>>;
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
export type QueryInvoiceHtmlArgs = {
  invoiceId: Scalars['UUID']['input'];
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
export type QueryPersonExternalLinkArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPersonExternalLinkByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPersonExternalLinksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PersonExternalLinkCondition>;
  filter?: InputMaybe<PersonExternalLinkFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PersonExternalLinkOrderBy>>;
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
export type QueryProductExternalLinkArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProductExternalLinkByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProductExternalLinksArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ProductExternalLinkCondition>;
  filter?: InputMaybe<ProductExternalLinkFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProductExternalLinkOrderBy>>;
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


/** The root query type which gives access points into the data universe. */
export type QuerySupplierArgs = {
  rowId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySupplierByIdArgs = {
  id: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySuppliersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<SupplierCondition>;
  filter?: InputMaybe<SupplierFilter>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<SupplierOrderBy>>;
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
  acceptanceCriteria?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  amount: Scalars['BigFloat']['output'];
  deliverables?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
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
  /** Checks for equality with the object’s `sortOrder` field. */
  sortOrder?: InputMaybe<Scalars['Int']['input']>;
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
  /** Filter by the object’s `sortOrder` field. */
  sortOrder?: InputMaybe<IntFilter>;
};

/** An input for mutations affecting `QuoteLineItem` */
export type QuoteLineItemInput = {
  acceptanceCriteria?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  amount: Scalars['BigFloat']['input'];
  deliverables?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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
  RowIdDesc = 'ROW_ID_DESC',
  SortOrderAsc = 'SORT_ORDER_ASC',
  SortOrderDesc = 'SORT_ORDER_DESC'
}

/** Represents an update to a `QuoteLineItem`. Fields that are set will be updated. */
export type QuoteLineItemPatch = {
  acceptanceCriteria?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  amount?: InputMaybe<Scalars['BigFloat']['input']>;
  deliverables?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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

export type Supplier = Node & {
  __typename?: 'Supplier';
  code?: Maybe<Scalars['String']['output']>;
  contactEmail?: Maybe<Scalars['String']['output']>;
  contactPhone?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Datetime']['output']>;
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  id: Scalars['ID']['output'];
  isActive?: Maybe<Scalars['Boolean']['output']>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  organizationId: Scalars['String']['output'];
  rowId: Scalars['UUID']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  website?: Maybe<Scalars['String']['output']>;
};

/**
 * A condition to be used against `Supplier` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type SupplierCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `organizationId` field. */
  organizationId?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `rowId` field. */
  rowId?: InputMaybe<Scalars['UUID']['input']>;
};

/** A connection to a list of `Supplier` values. */
export type SupplierConnection = {
  __typename?: 'SupplierConnection';
  /** A list of edges which contains the `Supplier` and cursor to aid in pagination. */
  edges: Array<Maybe<SupplierEdge>>;
  /** A list of `Supplier` objects. */
  nodes: Array<Maybe<Supplier>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Supplier` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Supplier` edge in the connection. */
export type SupplierEdge = {
  __typename?: 'SupplierEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Supplier` at the end of the edge. */
  node?: Maybe<Supplier>;
};

/** A filter to be used against `Supplier` object types. All fields are combined with a logical ‘and.’ */
export type SupplierFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SupplierFilter>>;
  /** Filter by the object’s `code` field. */
  code?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SupplierFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SupplierFilter>>;
  /** Filter by the object’s `organizationId` field. */
  organizationId?: InputMaybe<StringFilter>;
  /** Filter by the object’s `rowId` field. */
  rowId?: InputMaybe<UuidFilter>;
};

/** An input for mutations affecting `Supplier` */
export type SupplierInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId: Scalars['String']['input'];
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
};

/** Methods to use when ordering `Supplier`. */
export enum SupplierOrderBy {
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  Natural = 'NATURAL',
  OrganizationIdAsc = 'ORGANIZATION_ID_ASC',
  OrganizationIdDesc = 'ORGANIZATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RowIdAsc = 'ROW_ID_ASC',
  RowIdDesc = 'ROW_ID_DESC'
}

/** Represents an update to a `Supplier`. Fields that are set will be updated. */
export type SupplierPatch = {
  code?: InputMaybe<Scalars['String']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  organizationId?: InputMaybe<Scalars['String']['input']>;
  rowId?: InputMaybe<Scalars['UUID']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  website?: InputMaybe<Scalars['String']['input']>;
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

/** All input for the `updateChannelConnectionById` mutation. */
export type UpdateChannelConnectionByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ChannelConnection` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ChannelConnection` being updated. */
  patch: ChannelConnectionPatch;
};

/** All input for the `updateChannelConnection` mutation. */
export type UpdateChannelConnectionInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ChannelConnection` being updated. */
  patch: ChannelConnectionPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `ChannelConnection` mutation. */
export type UpdateChannelConnectionPayload = {
  __typename?: 'UpdateChannelConnectionPayload';
  /** The `ChannelConnection` that was updated by this mutation. */
  channelConnection?: Maybe<ChannelConnection>;
  /** An edge for our `ChannelConnection`. May be used by Relay 1. */
  channelConnectionEdge?: Maybe<ChannelConnectionEdge>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ChannelConnection` mutation. */
export type UpdateChannelConnectionPayloadChannelConnectionEdgeArgs = {
  orderBy?: Array<ChannelConnectionOrderBy>;
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

/** All input for the `updatePersonExternalLinkById` mutation. */
export type UpdatePersonExternalLinkByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `PersonExternalLink` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `PersonExternalLink` being updated. */
  patch: PersonExternalLinkPatch;
};

/** All input for the `updatePersonExternalLink` mutation. */
export type UpdatePersonExternalLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `PersonExternalLink` being updated. */
  patch: PersonExternalLinkPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `PersonExternalLink` mutation. */
export type UpdatePersonExternalLinkPayload = {
  __typename?: 'UpdatePersonExternalLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `PersonExternalLink` that was updated by this mutation. */
  personExternalLink?: Maybe<PersonExternalLink>;
  /** An edge for our `PersonExternalLink`. May be used by Relay 1. */
  personExternalLinkEdge?: Maybe<PersonExternalLinkEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `PersonExternalLink` mutation. */
export type UpdatePersonExternalLinkPayloadPersonExternalLinkEdgeArgs = {
  orderBy?: Array<PersonExternalLinkOrderBy>;
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

/** All input for the `updateProductExternalLinkById` mutation. */
export type UpdateProductExternalLinkByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `ProductExternalLink` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `ProductExternalLink` being updated. */
  patch: ProductExternalLinkPatch;
};

/** All input for the `updateProductExternalLink` mutation. */
export type UpdateProductExternalLinkInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `ProductExternalLink` being updated. */
  patch: ProductExternalLinkPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `ProductExternalLink` mutation. */
export type UpdateProductExternalLinkPayload = {
  __typename?: 'UpdateProductExternalLinkPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `ProductExternalLink` that was updated by this mutation. */
  productExternalLink?: Maybe<ProductExternalLink>;
  /** An edge for our `ProductExternalLink`. May be used by Relay 1. */
  productExternalLinkEdge?: Maybe<ProductExternalLinkEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};


/** The output of our update `ProductExternalLink` mutation. */
export type UpdateProductExternalLinkPayloadProductExternalLinkEdgeArgs = {
  orderBy?: Array<ProductExternalLinkOrderBy>;
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

/** All input for the `updateSupplierById` mutation. */
export type UpdateSupplierByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Supplier` to be updated. */
  id: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Supplier` being updated. */
  patch: SupplierPatch;
};

/** All input for the `updateSupplier` mutation. */
export type UpdateSupplierInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Supplier` being updated. */
  patch: SupplierPatch;
  rowId: Scalars['UUID']['input'];
};

/** The output of our update `Supplier` mutation. */
export type UpdateSupplierPayload = {
  __typename?: 'UpdateSupplierPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `Supplier` that was updated by this mutation. */
  supplier?: Maybe<Supplier>;
  /** An edge for our `Supplier`. May be used by Relay 1. */
  supplierEdge?: Maybe<SupplierEdge>;
};


/** The output of our update `Supplier` mutation. */
export type UpdateSupplierPayloadSupplierEdgeArgs = {
  orderBy?: Array<SupplierOrderBy>;
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

export type DocumentNumberingConfigsQueryVariables = Exact<{
  organizationId: string;
}>;


export type DocumentNumberingConfigsQuery = { documentNumberingConfigs: { nodes: Array<{ rowId: string, organizationId: string, documentType: string, globalPrefix: string | null, prefix: string, separator: string, dateFormat: string | null, idStrategy: string, sequentialPadding: number, randomLength: number, nextSequentialNumber: number } | null> } | null };

export type CreateDocumentNumberingConfigMutationVariables = Exact<{
  input: CreateDocumentNumberingConfigInput;
}>;


export type CreateDocumentNumberingConfigMutation = { createDocumentNumberingConfig: { documentNumberingConfig: { rowId: string, globalPrefix: string | null, prefix: string, separator: string, dateFormat: string | null, idStrategy: string, sequentialPadding: number, randomLength: number } | null } | null };

export type UpdateDocumentNumberingConfigMutationVariables = Exact<{
  input: UpdateDocumentNumberingConfigInput;
}>;


export type UpdateDocumentNumberingConfigMutation = { updateDocumentNumberingConfig: { documentNumberingConfig: { rowId: string, globalPrefix: string | null, prefix: string, separator: string, dateFormat: string | null, idStrategy: string, sequentialPadding: number, randomLength: number } | null } | null };

export type GenerateDocumentNumberMutationVariables = Exact<{
  input: GenerateDocumentNumberInput;
}>;


export type GenerateDocumentNumberMutation = { generateDocumentNumber: { documentNumber: string } | null };

export type AllInvoicesQueryVariables = Exact<{
  organizationId: string;
}>;


export type AllInvoicesQuery = { invoices: { nodes: Array<{ rowId: string, organizationId: string, invoiceNumber: string, companyId: string | null, contactId: string | null, billTo: string | null, status: string, issueDate: string, dueDate: string | null, notes: string | null, subtotal: string | null, taxRate: string | null, taxAmount: string | null, total: string | null, currency: string | null, paidAt: string | null, paymentReference: string | null, paymentLinkUrl: string | null, createdAt: string | null, updatedAt: string | null, company: { rowId: string, name: string } | null, contact: { rowId: string, firstName: string, lastName: string } | null, invoiceLineItems: { nodes: Array<{ rowId: string, invoiceId: string, productId: string | null, description: string, quantity: string, unitPrice: string, amount: string, sortOrder: number | null } | null> } } | null> } | null };

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

export const DocumentNumberingConfigsDocument = new TypedDocumentString(`
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
