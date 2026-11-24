import {
  INVOICE_NOTES,
  createDemoDb,
  localDateKey,
  nextId,
} from "@/features/demo/fixtures";

import type { DemoDb, Row } from "@/features/demo/fixtures";

/**
 * In-memory GraphQL resolver for the public demo. `graphqlFetch` hands it each
 * operation while the demo is open; it answers by operation name from the
 * sample data and applies mutations to that data, so the real screens and
 * flows work without an API. State lives in this module, so a reload starts
 * the sample workspace fresh
 */

type Vars = Record<string, unknown>;

type Table = keyof DemoDb;

let db: DemoDb | null = null;

const getDb = () => {
  db ??= createDemoDb();

  return db;
};

const nodes = <T>(list: T[]) => ({ nodes: list });

const nowIso = () => new Date().toISOString();

/** Calendar date columns; every other date value is a timestamp */
const DATE_COLUMNS = new Set(["issueDate", "dueDate", "paidAt", "validUntil"]);

/**
 * Normalize mutation input the way the wire would: drop `undefined`, and turn
 * `Date` values into the strings the API returns for that column
 */
const normalize = (input: Record<string, unknown>) => {
  const out: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;

    if (value instanceof Date) {
      out[key] = DATE_COLUMNS.has(key)
        ? value.toISOString().slice(0, 10)
        : value.toISOString();
      continue;
    }

    out[key] =
      DATE_COLUMNS.has(key) && typeof value === "string" && value.length > 10
        ? value.slice(0, 10)
        : value;
  }

  return out;
};

/** Every column a screen reads, so a newly created row is complete */
const COLUMNS: Record<Table, string[]> = {
  companies: [
    "organizationId",
    "name",
    "website",
    "industry",
    "phone",
    "email",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "country",
    "notes",
  ],
  people: [
    "organizationId",
    "firstName",
    "lastName",
    "emails",
    "phone",
    "internal",
    "avatarUrl",
    "tags",
    "notes",
  ],
  companyMembers: ["companyId", "personId", "title", "isPrimary"],
  invoices: [
    "organizationId",
    "invoiceNumber",
    "companyId",
    "contactId",
    "billTo",
    "status",
    "issueDate",
    "dueDate",
    "notes",
    "subtotal",
    "taxRate",
    "taxAmount",
    "total",
    "currency",
    "paidAt",
    "paymentReference",
    "paymentLinkUrl",
  ],
  invoiceLineItems: [
    "invoiceId",
    "productId",
    "description",
    "quantity",
    "unitPrice",
    "amount",
    "sortOrder",
  ],
  payments: ["invoiceId", "amount", "paidAt", "reference", "method"],
  quotes: [
    "organizationId",
    "quoteNumber",
    "companyId",
    "contactId",
    "clientName",
    "clientEmail",
    "additionalItemsLabel",
    "title",
    "description",
    "status",
    "validUntil",
    "projectType",
    "timeRange",
    "terms",
    "additionalTerms",
    "notes",
    "subtotal",
    "taxRate",
    "taxAmount",
    "total",
    "currency",
    "convertedInvoiceId",
  ],
  quoteLineItems: [
    "quoteId",
    "productId",
    "description",
    "subtitle",
    "quantity",
    "unitPrice",
    "amount",
    "pricingType",
    "estimatedHours",
    "hourlyRate",
    "weeklyCapHours",
    "monthlyCapHours",
    "maxCapHours",
    "minimumBillingMinutes",
    "royaltyPercentage",
    "royaltyTimeframe",
    "royaltyTimeframeUnit",
    "royaltyThreshold",
    "royaltyBuyoutAmount",
    "sortOrder",
    "deliverables",
    "acceptanceCriteria",
  ],
  products: [
    "organizationId",
    "name",
    "description",
    "sku",
    "unitPrice",
    "currentQuantity",
    "lowStockThreshold",
    "isActive",
  ],
  inventoryAdjustments: [
    "productId",
    "quantityChange",
    "reason",
    "referenceId",
  ],
  organizationSettings: [
    "organizationId",
    "accentColor",
    "companyName",
    "contactName",
    "contactTitle",
    "email",
    "phone",
    "website",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "country",
    "logoUrl",
    "registrationState",
  ],
  documentNumberingConfigs: [
    "organizationId",
    "companyId",
    "documentType",
    "globalPrefix",
    "prefix",
    "separator",
    "dateFormat",
    "idStrategy",
    "sequentialPadding",
    "randomLength",
    "nextSequentialNumber",
  ],
  creditTransactions: [
    "organizationId",
    "currency",
    "amount",
    "kind",
    "invoiceId",
    "paymentId",
    "note",
  ],
};

/** Defaults the database would fill in on insert */
const DEFAULTS: Partial<Record<Table, Record<string, unknown>>> = {
  people: { emails: [], tags: [], internal: false },
  invoices: { status: "draft", currency: "USD", taxAmount: "0.00" },
  quotes: { status: "draft", currency: "USD", additionalTerms: [] },
  quoteLineItems: { deliverables: [], acceptanceCriteria: [] },
  products: { currentQuantity: 0, isActive: true },
  companyMembers: { isPrimary: false },
  documentNumberingConfigs: { nextSequentialNumber: 1 },
};

const ID_PREFIX: Record<Table, string> = {
  companies: "c0a1",
  people: "b0e1",
  companyMembers: "a0e1",
  invoices: "10e1",
  invoiceLineItems: "11e1",
  payments: "12e1",
  quotes: "20e1",
  quoteLineItems: "21e1",
  products: "30e1",
  inventoryAdjustments: "31e1",
  organizationSettings: "40e1",
  documentNumberingConfigs: "50e1",
  creditTransactions: "60e1",
};

const insert = (table: Table, input: Record<string, unknown>): Row => {
  const blank = Object.fromEntries(
    COLUMNS[table].map((column) => [column, null]),
  );
  const now = nowIso();
  const row: Row = {
    ...blank,
    ...DEFAULTS[table],
    ...normalize(input),
    rowId: nextId(ID_PREFIX[table]),
    createdAt: now,
    updatedAt: now,
  };
  getDb()[table].push(row);

  return row;
};

const find = (table: Table, rowId: unknown) =>
  getDb()[table].find((row) => row.rowId === rowId);

const update = (table: Table, rowId: unknown, patch: unknown): Row => {
  const row = find(table, rowId);
  if (!row) throw new Error("Record not found");

  Object.assign(row, normalize((patch ?? {}) as Record<string, unknown>), {
    updatedAt: nowIso(),
  });

  return row;
};

const remove = (table: Table, rowId: unknown) => {
  const rows = getDb()[table];
  const index = rows.findIndex((row) => row.rowId === rowId);
  if (index === -1) throw new Error("Record not found");

  rows.splice(index, 1);
};

/** Drop child rows whose parent was deleted (the database cascades) */
const cascade = (table: Table, column: string, rowId: unknown) => {
  getDb()[table] = getDb()[table].filter((row) => row[column] !== rowId);
};

/** Clear references to a deleted row (the database sets them null) */
const detach = (table: Table, column: string, rowId: unknown) => {
  for (const row of getDb()[table]) {
    if (row[column] === rowId) row[column] = null;
  }
};

const companyRef = (companyId: unknown) => {
  const company = find("companies", companyId);

  return company ? { rowId: company.rowId, name: company.name } : null;
};

const personRef = (personId: unknown) => {
  const person = find("people", personId);

  return person
    ? {
        rowId: person.rowId,
        firstName: person.firstName,
        lastName: person.lastName,
      }
    : null;
};

const bySortOrder = (a: Row, b: Row) =>
  Number(a.sortOrder ?? 0) - Number(b.sortOrder ?? 0);

const invoiceView = (invoice: Row) => ({
  ...invoice,
  company: companyRef(invoice.companyId),
  contact: personRef(invoice.contactId),
  invoiceLineItems: nodes(
    getDb()
      .invoiceLineItems.filter((item) => item.invoiceId === invoice.rowId)
      .sort(bySortOrder),
  ),
  payments: nodes(
    getDb().payments.filter((payment) => payment.invoiceId === invoice.rowId),
  ),
});

const quoteView = (quote: Row) => ({
  ...quote,
  company: companyRef(quote.companyId),
  contact: personRef(quote.contactId),
  quoteLineItems: nodes(
    getDb()
      .quoteLineItems.filter((item) => item.quoteId === quote.rowId)
      .sort(bySortOrder),
  ),
});

/** Next free number for a document type, after the highest one in use */
const nextDocumentNumber = (documentType: unknown) => {
  const isQuote = documentType === "quote";
  const rows = isQuote ? getDb().quotes : getDb().invoices;
  const column = isQuote ? "quoteNumber" : "invoiceNumber";
  const highest = Math.max(
    0,
    ...rows.map((row) => Number(/(\d+)$/.exec(String(row[column]))?.[1] ?? 0)),
  );

  return `${isQuote ? "Q" : "INV"}-${String(highest + 1).padStart(4, "0")}`;
};

/** Thirty days after a `YYYY-MM-DD` date */
const thirtyDaysAfter = (key: string) =>
  new Date(Date.parse(`${key}T00:00:00.000Z`) + 30 * 86_400_000)
    .toISOString()
    .slice(0, 10);

const input = (vars: Vars) => (vars.input ?? {}) as Record<string, unknown>;

const create =
  (table: Table, field: string, inputKey = field) =>
  (vars: Vars) => {
    const values = (input(vars)[inputKey] ?? {}) as Record<string, unknown>;

    return { [field]: insert(table, values) };
  };

const handlers: Record<string, (vars: Vars) => unknown> = {
  // Queries
  AllCompanies: () => ({ companies: nodes(getDb().companies) }),
  AllPeople: () => ({ people: nodes(getDb().people) }),
  AllInvoices: () => ({ invoices: nodes(getDb().invoices.map(invoiceView)) }),
  AllQuotes: () => ({ quotes: nodes(getDb().quotes.map(quoteView)) }),
  AllProducts: () => ({ products: nodes(getDb().products) }),
  InventoryAdjustments: ({ productId }) => ({
    inventoryAdjustments: nodes(
      getDb().inventoryAdjustments.filter((row) => row.productId === productId),
    ),
  }),
  CompanyMembersByCompany: ({ companyId }) => ({
    companyMembers: nodes(
      getDb()
        .companyMembers.filter((member) => member.companyId === companyId)
        .map((member) => ({ ...member, person: personRef(member.personId) })),
    ),
  }),
  CompanyMembersByPerson: ({ personId }) => ({
    companyMembers: nodes(
      getDb()
        .companyMembers.filter((member) => member.personId === personId)
        .map((member) => ({
          ...member,
          company: companyRef(member.companyId),
        })),
    ),
  }),
  WorkspaceCredits: () => ({
    creditTransactions: nodes(getDb().creditTransactions),
  }),
  DocumentNumberingConfigs: () => ({
    documentNumberingConfigs: nodes(getDb().documentNumberingConfigs),
  }),
  WorkspaceProfile: () => ({
    organizationSettings: nodes(getDb().organizationSettings.slice(0, 1)),
  }),
  WorkspacePlan: () => ({
    workspacePlan: { tier: "free", source: "free", limits: [] },
  }),

  // People
  CreatePerson: (vars) => ({
    createPerson: create("people", "person")(vars),
  }),
  UpdatePerson: (vars) => ({
    updatePerson: {
      person: update("people", input(vars).rowId, input(vars).patch),
    },
  }),
  DeletePerson: (vars) => {
    const { rowId } = input(vars);
    remove("people", rowId);
    cascade("companyMembers", "personId", rowId);
    detach("invoices", "contactId", rowId);
    detach("quotes", "contactId", rowId);

    return { deletePerson: { deletedPersonId: rowId } };
  },
  CreateCompany: (vars) => ({
    createCompany: create("companies", "company")(vars),
  }),
  UpdateCompany: (vars) => ({
    updateCompany: {
      company: update("companies", input(vars).rowId, input(vars).patch),
    },
  }),
  DeleteCompany: (vars) => {
    const { rowId } = input(vars);
    remove("companies", rowId);
    cascade("companyMembers", "companyId", rowId);
    detach("invoices", "companyId", rowId);
    detach("quotes", "companyId", rowId);

    return { deleteCompany: { deletedCompanyId: rowId } };
  },
  CreateCompanyMember: (vars) => ({
    createCompanyMember: create("companyMembers", "companyMember")(vars),
  }),
  UpdateCompanyMember: (vars) => ({
    updateCompanyMember: {
      companyMember: update(
        "companyMembers",
        input(vars).rowId,
        input(vars).patch,
      ),
    },
  }),
  DeleteCompanyMember: (vars) => {
    const { rowId } = input(vars);
    remove("companyMembers", rowId);

    return { deleteCompanyMember: { deletedCompanyMemberId: rowId } };
  },

  // Invoices
  CreateInvoice: (vars) => ({
    createInvoice: create("invoices", "invoice")(vars),
  }),
  UpdateInvoice: (vars) => ({
    updateInvoice: {
      invoice: update("invoices", input(vars).rowId, input(vars).patch),
    },
  }),
  DeleteInvoice: (vars) => {
    const { rowId } = input(vars);
    remove("invoices", rowId);
    cascade("invoiceLineItems", "invoiceId", rowId);
    cascade("payments", "invoiceId", rowId);
    detach("quotes", "convertedInvoiceId", rowId);

    return { deleteInvoice: { deletedInvoiceId: rowId } };
  },
  CreateInvoiceLineItem: (vars) => ({
    createInvoiceLineItem: create("invoiceLineItems", "invoiceLineItem")(vars),
  }),
  DeleteInvoiceLineItem: (vars) => {
    const { rowId } = input(vars);
    remove("invoiceLineItems", rowId);

    return { deleteInvoiceLineItem: { deletedInvoiceLineItemId: rowId } };
  },
  CreatePayment: (vars) => ({
    createPayment: create("payments", "payment")(vars),
  }),
  DeletePayment: (vars) => {
    const { rowId } = input(vars);
    remove("payments", rowId);

    return { deletePayment: { deletedPaymentId: rowId } };
  },

  // Quotes
  CreateQuote: (vars) => ({
    createQuote: create("quotes", "quote")(vars),
  }),
  UpdateQuote: (vars) => ({
    updateQuote: {
      quote: update("quotes", input(vars).rowId, input(vars).patch),
    },
  }),
  DeleteQuote: (vars) => {
    const { rowId } = input(vars);
    remove("quotes", rowId);
    cascade("quoteLineItems", "quoteId", rowId);

    return { deleteQuote: { deletedQuoteId: rowId } };
  },
  CreateQuoteLineItem: (vars) => ({
    createQuoteLineItem: create("quoteLineItems", "quoteLineItem")(vars),
  }),
  DeleteQuoteLineItem: (vars) => {
    const { rowId } = input(vars);
    remove("quoteLineItems", rowId);

    return { deleteQuoteLineItem: { deletedQuoteLineItemId: rowId } };
  },
  ConvertQuoteToInvoice: (vars) => {
    const quote = find("quotes", input(vars).quoteId);
    if (!quote) throw new Error("Quote not found");
    if (quote.convertedInvoiceId) {
      throw new Error("This quote already has an invoice");
    }

    const lines = getDb()
      .quoteLineItems.filter((item) => item.quoteId === quote.rowId)
      .sort(bySortOrder);
    // Royalty terms have no fixed amount yet, so they stay off the invoice
    const skipped = lines.filter((item) => item.pricingType === "royalty");
    const billed = lines.filter((item) => item.pricingType !== "royalty");
    const total = billed.reduce((sum, item) => sum + Number(item.amount), 0);
    const today = localDateKey();

    const invoice = insert("invoices", {
      organizationId: quote.organizationId,
      invoiceNumber: nextDocumentNumber("invoice"),
      companyId: quote.companyId,
      contactId: quote.contactId,
      status: "draft",
      issueDate: today,
      dueDate: thirtyDaysAfter(today),
      notes: INVOICE_NOTES,
      subtotal: total.toFixed(2),
      taxRate: quote.taxRate,
      taxAmount: "0.00",
      total: total.toFixed(2),
      currency: quote.currency,
    });

    billed.forEach((item, sortOrder) => {
      insert("invoiceLineItems", {
        invoiceId: invoice.rowId,
        productId: item.productId,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        amount: item.amount,
        sortOrder,
      });
    });

    update("quotes", quote.rowId, {
      status: "converted",
      convertedInvoiceId: invoice.rowId,
    });

    return {
      convertQuoteToInvoice: {
        invoiceId: invoice.rowId,
        invoiceNumber: invoice.invoiceNumber,
        skippedLineItems: skipped.map((item) => ({
          rowId: item.rowId,
          description: item.description,
          pricingType: item.pricingType,
        })),
      },
    };
  },

  // Inventory
  CreateProduct: (vars) => ({
    createProduct: create("products", "product")(vars),
  }),
  UpdateProduct: (vars) => ({
    updateProduct: {
      product: update("products", input(vars).rowId, input(vars).patch),
    },
  }),
  DeleteProduct: (vars) => {
    const { rowId } = input(vars);
    remove("products", rowId);
    cascade("inventoryAdjustments", "productId", rowId);
    detach("invoiceLineItems", "productId", rowId);
    detach("quoteLineItems", "productId", rowId);

    return { deleteProduct: { deletedProductId: rowId } };
  },
  // The API applies the change to the product's stock in the same write
  CreateInventoryAdjustment: (vars) => {
    const adjustment = insert(
      "inventoryAdjustments",
      (input(vars).inventoryAdjustment ?? {}) as Record<string, unknown>,
    );
    const product = find("products", adjustment.productId);

    if (product) {
      product.currentQuantity =
        Number(product.currentQuantity ?? 0) +
        Number(adjustment.quantityChange);
      product.updatedAt = adjustment.createdAt;
    }

    return { createInventoryAdjustment: { inventoryAdjustment: adjustment } };
  },

  // Numbering and workspace profile
  GenerateDocumentNumber: (vars) => ({
    generateDocumentNumber: {
      documentNumber: nextDocumentNumber(input(vars).documentType),
    },
  }),
  CreateDocumentNumberingConfig: (vars) => ({
    createDocumentNumberingConfig: create(
      "documentNumberingConfigs",
      "documentNumberingConfig",
    )(vars),
  }),
  UpdateDocumentNumberingConfig: (vars) => ({
    updateDocumentNumberingConfig: {
      documentNumberingConfig: update(
        "documentNumberingConfigs",
        input(vars).rowId,
        input(vars).patch,
      ),
    },
  }),
  DeleteDocumentNumberingConfig: (vars) => {
    const { rowId } = input(vars);
    remove("documentNumberingConfigs", rowId);

    return {
      deleteDocumentNumberingConfig: {
        deletedDocumentNumberingConfigId: rowId,
      },
    };
  },
  CreateWorkspaceProfile: (vars) => ({
    createOrganizationSetting: create(
      "organizationSettings",
      "organizationSetting",
    )(vars),
  }),
  UpdateWorkspaceProfile: (vars) => ({
    updateOrganizationSetting: {
      organizationSetting: update(
        "organizationSettings",
        input(vars).rowId,
        input(vars).patch,
      ),
    },
  }),
};

/** The operation name of a GraphQL document (its first query or mutation) */
const operationName = (query: string) =>
  /\b(?:query|mutation)\s+(\w+)/.exec(query)?.[1] ?? "";

// A short pause, so saving and loading states show as they would for real
const LATENCY_MS = 120;

/**
 * Answer one GraphQL operation from the sample workspace. Results are deep
 * copies, so cached query data never changes underneath React Query
 */
export const resolveDemoOperation = async <TData>(
  query: string,
  variables: Vars = {},
): Promise<TData> => {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));

  const handler = handlers[operationName(query)];
  if (!handler) throw new Error("This action is not available in the demo");

  return structuredClone(handler(variables)) as TData;
};
