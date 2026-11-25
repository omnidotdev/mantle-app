/**
 * Application configuration.
 */
const app = {
  /** App name */
  name: "Mantle",
  /** Product symbol (mirrors the Omni product catalog SSOT) */
  icon: "🌋",
  /** App description (used in SEO meta tags) */
  description:
    "Open-source, self-hostable relationship management (CRM), quote to cash, invoicing, and inventory for small businesses.",
  /** Search keywords (used in SEO meta tags) */
  keywords:
    "crm, relationship management, quote to cash, invoicing, billing, quotes, contracts, inventory management, small business, back office, business operations, open source, self-hosted",
  /** App tagline */
  tagline: "Forged under pressure",
  /** Production URL */
  url: "https://mantle.omni.dev",
  /** Organization info */
  organization: {
    name: "Omni",
    url: "https://omni.dev",
    website: "https://omni.dev",
    discord: "https://discord.gg/omnidotdev",
    x: "https://x.com/omnidotdev",
    linkedin: "https://www.linkedin.com/company/omnidotdev",
    threads: "https://www.threads.com/@omnidotdev",
  },
  /** External links */
  links: {
    docs: "https://docs.omni.dev/products/mantle",
    github: "https://github.com/omnidotdev/mantle-stack",
    feedback: "https://backfeed.omni.dev/workspaces/omni/projects/mantle",
  },
  /** Module configuration - toggle modules on/off */
  modules: {
    people: { enabled: true, label: "People", icon: "👥" },
    invoices: { enabled: true, label: "Invoices", icon: "🧾" },
    quotes: { enabled: true, label: "Quotes & Contracts", icon: "📝" },
    inventory: { enabled: true, label: "Inventory", icon: "📦" },
  },
};

export default app;
