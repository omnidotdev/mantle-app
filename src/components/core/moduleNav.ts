import {
  BoxesIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  UsersIcon,
} from "lucide-react";

import app from "@/lib/config/app.config";

import type { LucideIcon } from "lucide-react";

type ModuleKey = keyof typeof app.modules;

interface ModuleNavItem {
  key: ModuleKey | "dashboard";
  label: string;
  /** Short label for the phone tab bar */
  shortLabel: string;
  icon: LucideIcon;
  to:
    | "/@{$workspaceSlug}"
    | "/@{$workspaceSlug}/people"
    | "/@{$workspaceSlug}/invoices"
    | "/@{$workspaceSlug}/quotes"
    | "/@{$workspaceSlug}/inventory";
}

const moduleMeta: Record<
  ModuleKey,
  Pick<ModuleNavItem, "icon" | "to" | "shortLabel">
> = {
  people: {
    icon: UsersIcon,
    to: "/@{$workspaceSlug}/people",
    shortLabel: "People",
  },
  invoices: {
    icon: ReceiptIcon,
    to: "/@{$workspaceSlug}/invoices",
    shortLabel: "Invoices",
  },
  quotes: {
    icon: FileTextIcon,
    to: "/@{$workspaceSlug}/quotes",
    shortLabel: "Quotes",
  },
  inventory: {
    icon: BoxesIcon,
    to: "/@{$workspaceSlug}/inventory",
    shortLabel: "Inventory",
  },
};

const dashboardNav: ModuleNavItem = {
  key: "dashboard",
  label: "Dashboard",
  shortLabel: "Home",
  icon: LayoutDashboardIcon,
  to: "/@{$workspaceSlug}",
};

/** Enabled modules in display order, with their icon and route */
const moduleNav: ModuleNavItem[] = (
  Object.entries(app.modules) as [ModuleKey, (typeof app.modules)[ModuleKey]][]
)
  .filter(([, config]) => config.enabled)
  .map(([key, config]) => ({ key, label: config.label, ...moduleMeta[key] }));

/**
 * Whether a nav item is active for the concrete pathname (`/@acme/...`). The
 * dashboard only matches the workspace root exactly
 */
const isNavActive = (
  item: ModuleNavItem,
  pathname: string,
  workspaceSlug: string,
) => {
  const home = `/@${workspaceSlug}`;

  return item.key === "dashboard"
    ? pathname === home || pathname === `${home}/`
    : pathname.startsWith(`${home}/${item.key}`);
};

export type { ModuleNavItem };
export { dashboardNav, isNavActive, moduleNav };
