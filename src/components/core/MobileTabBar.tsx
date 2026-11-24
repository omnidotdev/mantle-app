import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
} from "@omnidotdev/thornberry/menu";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  BoxesIcon,
  Building2Icon,
  FileTextIcon,
  PlusIcon,
  ReceiptIcon,
  UserPlusIcon,
} from "lucide-react";

import {
  dashboardNav,
  isNavActive,
  moduleNav,
} from "@/components/core/moduleNav";
import { useWorkspaceSlug } from "@/lib/hooks/util/useWorkspaceSlug";
import cn from "@/lib/utils";

import type { LucideIcon } from "lucide-react";

const createActions: {
  module: string;
  label: string;
  icon: LucideIcon;
  to:
    | "/@{$workspaceSlug}/invoices/new"
    | "/@{$workspaceSlug}/quotes/new"
    | "/@{$workspaceSlug}/people/contacts/new"
    | "/@{$workspaceSlug}/people/companies/new"
    | "/@{$workspaceSlug}/inventory/new";
}[] = [
  {
    module: "invoices",
    label: "New invoice",
    icon: ReceiptIcon,
    to: "/@{$workspaceSlug}/invoices/new",
  },
  {
    module: "quotes",
    label: "New quote",
    icon: FileTextIcon,
    to: "/@{$workspaceSlug}/quotes/new",
  },
  {
    module: "people",
    label: "New contact",
    icon: UserPlusIcon,
    to: "/@{$workspaceSlug}/people/contacts/new",
  },
  {
    module: "people",
    label: "New company",
    icon: Building2Icon,
    to: "/@{$workspaceSlug}/people/companies/new",
  },
  {
    module: "inventory",
    label: "New product",
    icon: BoxesIcon,
    to: "/@{$workspaceSlug}/inventory/new",
  },
];

/**
 * Create button for phones: a floating button over the dashboard and module
 * lists that opens a menu of "New ..." actions, the current module's first.
 * Hidden on detail and editor pages, which carry their own action bar
 */
const CreateFab = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const workspaceSlug = useWorkspaceSlug();

  const home = `/@${workspaceSlug}`;
  const rest = pathname.slice(home.length).replace(/^\/|\/$/g, "");
  const currentModule = rest.split("/")[0] ?? "";
  // Only the workspace root and a module's index (e.g. `/@acme/invoices`)
  const isListPage = rest === "" || !rest.includes("/");

  if (!isListPage) return null;

  const actions = [...createActions].sort(
    (a, b) =>
      Number(b.module === currentModule) - Number(a.module === currentModule),
  );

  return (
    <MenuRoot
      positioning={{ placement: "top-end", gutter: 10 }}
      onSelect={({ value }) => {
        const action = actions.find((a) => a.label === value);
        if (action) navigate({ to: action.to, params: { workspaceSlug } });
      }}
    >
      <MenuTrigger
        aria-label="Create"
        className="fixed right-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-40 flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_20px_-6px_oklch(0.5_0.16_32/0.55)] md:hidden print:hidden"
      >
        <PlusIcon className="size-6" />
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent className="min-w-48">
          {actions.map(({ label, icon: Icon }) => (
            <MenuItem key={label} value={label}>
              <Icon className="size-4" />
              {label}
            </MenuItem>
          ))}
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  );
};

/** Bottom tab bar for phones: dashboard plus each enabled module */
const MobileTabBar = () => {
  const { pathname } = useLocation();
  const workspaceSlug = useWorkspaceSlug();

  return (
    <>
      <nav
        aria-label="Modules"
        className="fixed inset-x-0 bottom-0 z-40 grid h-[calc(4rem+env(safe-area-inset-bottom))] auto-cols-fr grid-flow-col border-border border-t bg-card/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden print:hidden"
      >
        {[dashboardNav, ...moduleNav].map((item) => {
          const active = isNavActive(item, pathname, workspaceSlug);
          const Icon = item.icon;

          return (
            <Link
              key={item.key}
              to={item.to}
              params={{ workspaceSlug }}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 font-medium text-[0.6875rem]",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.shortLabel}
            </Link>
          );
        })}
      </nav>
      <CreateFab />
    </>
  );
};

export default MobileTabBar;
