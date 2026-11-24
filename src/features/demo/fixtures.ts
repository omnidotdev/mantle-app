import { DEMO_ORGANIZATION_ID as ORG } from "@/features/demo/config";

/**
 * Sample data for the public demo: Basalt Studio, a small design studio with
 * clients, invoices in every status, quotes, and a few products running low.
 * Rows are stored flat (one table per entity, foreign keys by id) so the demo
 * resolver can create, update, and delete them the way the API would.
 *
 * The dates were written against 2026-11-24 and are shifted to the visitor's
 * today on load, so "overdue", "this month", and the invoiced chart always
 * read as current
 */

export type Row = Record<string, unknown> & { rowId: string };

export interface DemoDb {
  companies: Row[];
  people: Row[];
  companyMembers: Row[];
  invoices: Row[];
  invoiceLineItems: Row[];
  payments: Row[];
  quotes: Row[];
  quoteLineItems: Row[];
  products: Row[];
  inventoryAdjustments: Row[];
  organizationSettings: Row[];
  documentNumberingConfigs: Row[];
  creditTransactions: Row[];
}

const ANCHOR = "2026-11-24";
const DAY_MS = 86_400_000;

const pad = (n: number) => String(n).padStart(2, "0");

/** Local calendar date as `YYYY-MM-DD` */
export const localDateKey = (date = new Date()) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const dayNumber = (key: string) => Date.parse(`${key}T00:00:00.000Z`) / DAY_MS;

const shiftDays = Math.round(dayNumber(localDateKey()) - dayNumber(ANCHOR));

/** A fixture date moved by the same offset as today moved from the anchor */
const d = (key: string) =>
  new Date((dayNumber(key) + shiftDays) * DAY_MS).toISOString().slice(0, 10);

/** Afternoon timestamp on a fixture date */
const ts = (key: string) => `${d(key)}T16:00:00.000Z`;

const money = (n: number) => n.toFixed(2);

let seq = 0;

/** Deterministic UUID-shaped id, so a reload lands on the same records */
export const nextId = (prefix: string) => {
  seq += 1;

  return `${prefix.padEnd(8, "0").slice(0, 8)}-0000-4000-8000-${String(seq).padStart(12, "0")}`;
};

type CompanyRow = [string, string, string, string, string];
type PersonRow = [string, string, string, string, string, string[]];
type LineRow = [string, number, number];
type PaymentRow = [number, string, string, string | null];
type InvoiceRow = [
  string,
  string,
  string,
  string,
  string,
  LineRow[],
  PaymentRow[],
];
type QuoteLineRow = [string, number, number, "fixed" | "hourly"];
type QuoteRow = [
  string,
  string,
  string,
  string,
  string,
  QuoteLineRow[],
  string | null,
];

const companyRows: CompanyRow[] = [
  [
    "Northwind Coffee Roasters",
    "Food and beverage",
    "northwindcoffee.com",
    "Portland",
    "OR",
  ],
  [
    "Harbor & Pine Architects",
    "Architecture",
    "harborandpine.com",
    "Seattle",
    "WA",
  ],
  ["Fernway Outdoor Co.", "Retail", "fernwayoutdoor.com", "Boulder", "CO"],
  ["Kestrel Bikes", "Retail", "kestrelbikes.com", "Austin", "TX"],
  ["Bluebird Dental", "Healthcare", "bluebirddental.com", "Denver", "CO"],
  [
    "Ridgeline Credit Union",
    "Finance",
    "ridgelinecu.org",
    "Salt Lake City",
    "UT",
  ],
  ["Lumen Yoga", "Fitness", "lumenyoga.studio", "Santa Fe", "NM"],
  [
    "Saltbox Bakery",
    "Food and beverage",
    "saltboxbakery.com",
    "Asheville",
    "NC",
  ],
  ["Marigold Books", "Retail", "marigoldbooks.com", "Madison", "WI"],
];

const streets = [
  "Alder",
  "Water",
  "Pearl",
  "Congress",
  "Larimer",
  "Main",
  "Canyon",
  "Lexington",
  "State",
];

const postalCodes = [
  "97209",
  "98101",
  "80302",
  "78701",
  "80202",
  "84111",
  "87501",
  "28801",
  "53703",
];

const personRows: PersonRow[] = [
  [
    "Priya",
    "Raman",
    "priya@northwindcoffee.com",
    "Northwind",
    "Head of marketing",
    ["decision maker"],
  ],
  [
    "Daniel",
    "Brooks",
    "daniel@harborandpine.com",
    "Harbor",
    "Principal",
    ["decision maker"],
  ],
  [
    "Elena",
    "Vasquez",
    "elena@fernwayoutdoor.com",
    "Fernway",
    "Brand manager",
    ["vip"],
  ],
  [
    "Sam",
    "Whitaker",
    "sam@kestrelbikes.com",
    "Kestrel",
    "Founder",
    ["decision maker", "vip"],
  ],
  [
    "Hannah",
    "Cho",
    "hannah@bluebirddental.com",
    "Bluebird",
    "Office manager",
    ["billing"],
  ],
  [
    "Marcus",
    "Bell",
    "marcus.bell@ridgelinecu.org",
    "Ridgeline",
    "VP, member experience",
    ["decision maker"],
  ],
  ["Jun", "Tanaka", "jun@lumenyoga.studio", "Lumen", "Owner", []],
  [
    "Rosa",
    "Delgado",
    "rosa@saltboxbakery.com",
    "Saltbox",
    "Co-owner",
    ["billing"],
  ],
  ["Ava", "Lindgren", "ava@marigoldbooks.com", "Marigold", "Store manager", []],
  [
    "Leo",
    "Park",
    "accounts@fernwayoutdoor.com",
    "Fernway",
    "Accounts payable",
    ["billing"],
  ],
];

const teamRows: [string, string, string, string][] = [
  ["Mara", "Lindqvist", "mara@basaltstudio.co", "Design lead"],
  ["Theo", "Okafor", "theo@basaltstudio.co", "Producer"],
];

// [number, company, status, issued, due, lines, payments]
const invoiceRows: InvoiceRow[] = [
  [
    "INV-0031",
    "Northwind",
    "paid",
    "2026-06-04",
    "2026-07-04",
    [
      ["Brand refresh, phase 1", 1, 4800],
      ["Packaging dielines", 4, 350],
    ],
    [[6200, "2026-06-28", "bank_transfer", "ACH 55120"]],
  ],
  [
    "INV-0032",
    "Lumen",
    "paid",
    "2026-06-18",
    "2026-07-18",
    [
      ["Website design", 1, 3200],
      ["Class schedule template", 1, 400],
    ],
    [[3600, "2026-07-09", "card", null]],
  ],
  [
    "INV-0033",
    "Harbor",
    "paid",
    "2026-07-07",
    "2026-08-06",
    [
      ["Portfolio book layout", 1, 6200],
      ["Project photography edit", 22, 100],
    ],
    [[8400, "2026-08-01", "bank_transfer", "ACH 58841"]],
  ],
  [
    "INV-0034",
    "Saltbox",
    "paid",
    "2026-07-22",
    "2026-08-21",
    [
      ["Pastry box packaging", 1, 4200],
      ["Label system", 1, 1600],
    ],
    [[5800, "2026-08-14", "check", "Check 2207"]],
  ],
  [
    "INV-0035",
    "Fernway",
    "paid",
    "2026-08-05",
    "2026-09-04",
    [
      ["Summer lookbook", 1, 5750],
      ["Retouching", 15, 100],
    ],
    [[7250, "2026-08-30", "bank_transfer", "ACH 61007"]],
  ],
  [
    "INV-0036",
    "Bluebird",
    "paid",
    "2026-08-19",
    "2026-09-18",
    [
      ["Patient welcome kit", 1, 3100],
      ["Appointment cards", 1, 1150],
    ],
    [[4250, "2026-09-10", "card", null]],
  ],
  [
    "INV-0037",
    "Ridgeline",
    "paid",
    "2026-09-03",
    "2026-10-03",
    [
      ["Annual report design", 1, 9800],
      ["Infographics", 7, 400],
    ],
    [[12600, "2026-09-29", "bank_transfer", "ACH 64410"]],
  ],
  [
    "INV-0038",
    "Kestrel",
    "paid",
    "2026-09-16",
    "2026-10-16",
    [
      ["Fall catalog", 1, 5100],
      ["Product photo edit", 12, 100],
    ],
    [[6300, "2026-10-02", "bank_transfer", "ACH 65530"]],
  ],
  [
    "INV-0039",
    "Marigold",
    "paid",
    "2026-10-01",
    "2026-10-31",
    [
      ["Author event posters", 6, 450],
      ["Bookmark series", 1, 2200],
    ],
    [[4900, "2026-10-21", "card", null]],
  ],
  [
    "INV-0040",
    "Northwind",
    "overdue",
    "2026-10-06",
    "2026-11-05",
    [
      ["Brand refresh, phase 2", 1, 5600],
      ["Cafe menu boards", 3, 400],
    ],
    [[2000, "2026-10-28", "bank_transfer", "ACH 66902"]],
  ],
  [
    "INV-0041",
    "Harbor",
    "paid",
    "2026-10-14",
    "2026-11-13",
    [
      ["Website art direction", 1, 3900],
      ["Icon set", 1, 800],
    ],
    [[4700, "2026-11-03", "bank_transfer", "ACH 67318"]],
  ],
  [
    "INV-0042",
    "Bluebird",
    "overdue",
    "2026-10-16",
    "2026-11-15",
    [
      ["Waiting room signage", 1, 2650],
      ["Install", 1, 800],
    ],
    [],
  ],
  [
    "INV-0043",
    "Fernway",
    "viewed",
    "2026-11-04",
    "2026-12-04",
    [
      ["Winter catalog design", 1, 7400],
      ["Product photography edit", 24, 100],
    ],
    [[4900, "2026-11-10", "bank_transfer", "Deposit, ACH 67755"]],
  ],
  [
    "INV-0044",
    "Ridgeline",
    "paid",
    "2026-11-06",
    "2026-12-06",
    [
      ["Member newsletter templates", 1, 3700],
      ["Mailer design", 1, 1500],
    ],
    [[5200, "2026-11-20", "bank_transfer", "ACH 68420"]],
  ],
  [
    "INV-0045",
    "Lumen",
    "sent",
    "2026-11-12",
    "2026-12-12",
    [
      ["Studio signage", 1, 1800],
      ["Gift card design", 1, 600],
    ],
    [],
  ],
  [
    "INV-0046",
    "Saltbox",
    "sent",
    "2026-11-17",
    "2026-12-17",
    [
      ["Holiday menu", 1, 1650],
      ["Window decals", 3, 500],
    ],
    [],
  ],
  [
    "INV-0047",
    "Kestrel",
    "draft",
    "2026-11-21",
    "2026-12-21",
    [
      ["Spring teaser posters", 4, 650],
      ["Social templates", 1, 2000],
    ],
    [],
  ],
  [
    "INV-0048",
    "Marigold",
    "draft",
    "2026-11-23",
    "2026-12-23",
    [["Holiday gift guide", 1, 1850]],
    [],
  ],
];

// [number, company, status, title, valid until, lines, converted invoice]
const quoteRows: QuoteRow[] = [
  [
    "Q-0018",
    "Fernway",
    "converted",
    "Winter catalog",
    "2026-11-15",
    [
      ["Winter catalog design", 1, 7400, "fixed"],
      ["Product photography edit", 24, 100, "hourly"],
    ],
    "INV-0043",
  ],
  [
    "Q-0019",
    "Saltbox",
    "declined",
    "Seasonal menu refresh",
    "2026-10-30",
    [["Menu design", 1, 1200, "fixed"]],
    null,
  ],
  [
    "Q-0020",
    "Bluebird",
    "draft",
    "Patient newsletter",
    "2026-12-31",
    [
      ["Newsletter template", 1, 1400, "fixed"],
      ["Copy edit", 5, 100, "hourly"],
    ],
    null,
  ],
  [
    "Q-0021",
    "Marigold",
    "accepted",
    "Holiday window display",
    "2026-12-01",
    [
      ["Window display design", 1, 1900, "fixed"],
      ["Vinyl production", 1, 700, "fixed"],
    ],
    null,
  ],
  [
    "Q-0022",
    "Lumen",
    "sent",
    "Second studio launch kit",
    "2026-12-20",
    [
      ["Launch poster series", 3, 600, "fixed"],
      ["Opening week social kit", 1, 1400, "fixed"],
    ],
    null,
  ],
  [
    "Q-0023",
    "Harbor",
    "sent",
    "Website redesign",
    "2026-11-28",
    [
      ["Discovery and sitemap", 1, 2500, "fixed"],
      ["Design system and templates", 1, 7800, "fixed"],
      ["Build support", 42, 100, "hourly"],
    ],
    null,
  ],
  [
    "Q-0024",
    "Kestrel",
    "accepted",
    "Spring 2027 campaign",
    "2026-12-15",
    [
      ["Campaign concept and art direction", 1, 3800, "fixed"],
      ["Poster series, 4 designs", 4, 650, "fixed"],
      ["Product photo retouching", 24, 95, "hourly"],
    ],
    null,
  ],
];

// [name, sku, price, on hand, low stock threshold]
const productRows: [string, string, number, number, number][] = [
  ["Letterpress cards", "LP-BC-250", 45, 24, 10],
  ["Riso poster, A2", "RISO-A2", 28, 62, 20],
  ["Kraft mailer box", "BOX-K96", 1.8, 0, 50],
  ["Canvas tote", "TOTE-NAT", 18, 7, 15],
  ["Sticker sheet", "STK-M", 6, 240, 50],
  ["Enamel pin", "PIN-VOL", 12, 3, 20],
  ["Art print, 8x10", "PRT-810", 24, 88, 25],
  ["Brand binder", "BND-A4", 65, 16, 5],
];

export const INVOICE_NOTES =
  "Thank you for working with Basalt Studio. Payment is due within 30 days.";

/** A fresh copy of the sample workspace */
export const createDemoDb = (): DemoDb => {
  seq = 0;

  const companies: Row[] = companyRows.map(
    ([name, industry, site, city, state], i) => ({
      rowId: nextId("c0a1"),
      organizationId: ORG,
      name,
      website: `https://${site}`,
      industry,
      phone: `+1512555${String(140 + i * 7).padStart(4, "0")}`,
      email: `hello@${site}`,
      addressLine1: `${120 + i * 37} ${streets[i]} St`,
      addressLine2: null,
      city,
      state,
      postalCode: postalCodes[i],
      country: "US",
      notes: null,
      createdAt: ts(`2026-0${1 + (i % 5)}-1${i}`),
      updatedAt: ts("2026-11-02"),
    }),
  );

  const companyByKey = new Map(
    companies.map((company) => [
      String(company.name).split(" ")[0],
      company.rowId,
    ]),
  );
  const companyId = (key: string) => {
    const id = companyByKey.get(key);
    if (!id) throw new Error(`Unknown demo company ${key}`);

    return id;
  };

  const people: Row[] = [];
  const companyMembers: Row[] = [];

  personRows.forEach(([firstName, lastName, email, key, title, tags], i) => {
    const person: Row = {
      rowId: nextId("b0e1"),
      organizationId: ORG,
      firstName,
      lastName,
      emails: [email],
      phone: `+1512555${String(210 + i * 11).padStart(4, "0")}`,
      internal: false,
      avatarUrl: null,
      tags,
      notes: null,
      createdAt: ts(`2026-0${2 + (i % 6)}-0${1 + (i % 8)}`),
      updatedAt: ts("2026-11-10"),
    };
    people.push(person);
    companyMembers.push({
      rowId: nextId("a0e1"),
      companyId: companyId(key),
      personId: person.rowId,
      title,
      isPrimary: !tags.includes("billing") || key !== "Fernway",
      createdAt: person.createdAt,
    });
  });

  teamRows.forEach(([firstName, lastName, email, title], i) => {
    people.push({
      rowId: nextId("b0e1"),
      organizationId: ORG,
      firstName,
      lastName,
      emails: [email],
      phone: `+1512555${String(330 + i * 9).padStart(4, "0")}`,
      internal: true,
      avatarUrl: null,
      tags: [title.toLowerCase()],
      notes: null,
      createdAt: ts("2026-01-05"),
      updatedAt: ts("2026-10-01"),
    });
  });

  // The primary contact a document for this company is addressed to
  const contactId = (company: string) => {
    const id = companyId(company);
    const member =
      companyMembers.find((m) => m.companyId === id && m.isPrimary) ??
      companyMembers.find((m) => m.companyId === id);

    return (member?.personId as string | undefined) ?? null;
  };

  const invoices: Row[] = [];
  const invoiceLineItems: Row[] = [];
  const payments: Row[] = [];

  for (const [number, key, status, issued, due, lines, paid] of invoiceRows) {
    const rowId = nextId("10e1");
    const total = lines.reduce((sum, [, qty, unit]) => sum + qty * unit, 0);

    lines.forEach(([description, qty, unit], i) => {
      invoiceLineItems.push({
        rowId: nextId("11e1"),
        invoiceId: rowId,
        productId: null,
        description,
        quantity: String(qty),
        unitPrice: money(unit),
        amount: money(qty * unit),
        sortOrder: i,
      });
    });

    for (const [amount, paidAt, method, reference] of paid) {
      payments.push({
        rowId: nextId("12e1"),
        invoiceId: rowId,
        amount: money(amount),
        paidAt: d(paidAt),
        reference,
        method,
      });
    }

    const lastPaidAt = paid.at(-1)?.[1];

    invoices.push({
      rowId,
      organizationId: ORG,
      invoiceNumber: number,
      companyId: companyId(key),
      contactId: contactId(key),
      billTo: null,
      status,
      issueDate: d(issued),
      dueDate: d(due),
      notes: INVOICE_NOTES,
      subtotal: money(total),
      taxRate: null,
      taxAmount: "0.00",
      total: money(total),
      currency: "USD",
      paidAt: status === "paid" && lastPaidAt ? d(lastPaidAt) : null,
      paymentReference: null,
      paymentLinkUrl: null,
      createdAt: ts(issued),
      updatedAt: ts(lastPaidAt ?? issued),
    });
  }

  const invoiceId = (number: string) =>
    invoices.find((invoice) => invoice.invoiceNumber === number)?.rowId ?? null;

  const quotes: Row[] = [];
  const quoteLineItems: Row[] = [];

  for (const [
    number,
    key,
    status,
    title,
    validUntil,
    lines,
    converted,
  ] of quoteRows) {
    const rowId = nextId("20e1");
    const total = lines.reduce((sum, [, qty, unit]) => sum + qty * unit, 0);
    const contact = contactId(key);
    const company = companies.find((c) => c.rowId === companyId(key));

    lines.forEach(([description, qty, unit, pricingType], i) => {
      quoteLineItems.push({
        rowId: nextId("21e1"),
        quoteId: rowId,
        productId: null,
        description,
        subtitle: null,
        quantity: String(qty),
        unitPrice: money(unit),
        amount: money(qty * unit),
        pricingType,
        estimatedHours: pricingType === "hourly" ? String(qty) : null,
        hourlyRate: pricingType === "hourly" ? money(unit) : null,
        weeklyCapHours: null,
        monthlyCapHours: null,
        maxCapHours: null,
        minimumBillingMinutes: null,
        royaltyPercentage: null,
        royaltyTimeframe: null,
        royaltyTimeframeUnit: null,
        royaltyThreshold: null,
        royaltyBuyoutAmount: null,
        sortOrder: i,
        deliverables: [],
        acceptanceCriteria: [],
      });
    });

    quotes.push({
      rowId,
      organizationId: ORG,
      quoteNumber: number,
      companyId: companyId(key),
      contactId: contact,
      clientName: null,
      clientEmail:
        (people.find((p) => p.rowId === contact)?.emails as string[])?.[0] ??
        null,
      additionalItemsLabel: null,
      title,
      description: `${title} for ${String(company?.name)}.`,
      status,
      validUntil: d(validUntil),
      projectType: "Design",
      timeRange: "4 to 6 weeks",
      terms: "50% deposit to start, balance on delivery.",
      additionalTerms: [],
      notes: null,
      subtotal: money(total),
      taxRate: null,
      taxAmount: "0.00",
      total: money(total),
      currency: "USD",
      convertedInvoiceId: converted ? invoiceId(converted) : null,
      createdAt: ts("2026-11-01"),
      updatedAt: ts("2026-11-18"),
    });
  }

  const products: Row[] = productRows.map(
    ([name, sku, price, qty, low], i) => ({
      rowId: nextId("30e1"),
      organizationId: ORG,
      name,
      description: null,
      sku,
      unitPrice: money(price),
      currentQuantity: qty,
      lowStockThreshold: low,
      isActive: true,
      createdAt: ts(`2026-0${3 + (i % 6)}-12`),
      updatedAt: ts("2026-11-19"),
    }),
  );

  const tote = products.find((product) => product.sku === "TOTE-NAT");
  const inventoryAdjustments: Row[] = (
    [
      [60, "Initial stock", "2026-08-12"],
      [-18, "Fernway event order", "2026-09-30"],
      [-20, "Holiday market", "2026-11-08"],
      [-15, "Online shop orders", "2026-11-19"],
    ] as const
  ).map(([quantityChange, reason, date]) => ({
    rowId: nextId("31e1"),
    productId: tote?.rowId,
    quantityChange,
    reason,
    referenceId: null,
    createdAt: ts(date),
  }));

  const organizationSettings: Row[] = [
    {
      rowId: nextId("40e1"),
      organizationId: ORG,
      accentColor: "#c2612e",
      companyName: "Basalt Studio",
      contactName: "Orin",
      contactTitle: "Studio director",
      email: "hello@basaltstudio.co",
      phone: "+15125550100",
      website: "https://basaltstudio.co",
      addressLine1: "412 Juniper Ave",
      addressLine2: "Suite 3",
      city: "Austin",
      state: "TX",
      postalCode: "78702",
      country: "US",
      logoUrl: null,
      registrationState: "TX",
      createdAt: ts("2026-01-05"),
      updatedAt: ts("2026-10-12"),
    },
  ];

  return {
    companies,
    people,
    companyMembers,
    invoices,
    invoiceLineItems,
    payments,
    quotes,
    quoteLineItems,
    products,
    inventoryAdjustments,
    organizationSettings,
    documentNumberingConfigs: [],
    creditTransactions: [],
  };
};
