import { Badge } from "@omnidotdev/thornberry/badge";
import {
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@omnidotdev/thornberry/menu";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDown, PlusIcon } from "lucide-react";

import {
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import app from "@/lib/config/app.config";
import { AUTH_BASE_URL, CONSOLE_URL } from "@/lib/config/env.config";
import cn from "@/lib/utils";
import { useOrganization } from "@/providers/OrganizationProvider";

const AppSidebarHeader = () => {
  const navigate = useNavigate();
  const { organizationId } = useRouteContext({
    from: "/_app/@{$workspaceSlug}",
  });
  const orgCtx = useOrganization();
  const { closeMobileSidebar } = useSidebar();

  const organizations = orgCtx?.organizations ?? [];
  const currentOrg = organizations.find((o) => o.id === organizationId);
  const manageUrl = CONSOLE_URL || AUTH_BASE_URL;

  return (
    <SidebarHeader>
      {/* App branding */}
      <div className="flex items-center gap-2 px-1 py-1.5">
        <span className="text-lg">🌋</span>
        <span className="truncate font-semibold text-sm group-data-[collapsible=icon]:hidden">
          {app.name}
        </span>
        <Badge className="border-primary/20 bg-primary/10 text-primary text-xs group-data-[collapsible=icon]:hidden">
          Early Access
        </Badge>
      </div>

      {/* Org switcher */}
      <MenuRoot>
        <MenuTrigger asChild>
          <SidebarMenuButton className="w-full justify-between">
            <span className="truncate text-xs">
              {currentOrg?.name ?? "Select organization"}
            </span>
            <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </MenuTrigger>

        <MenuPositioner>
          <MenuContent className="min-w-56">
            {organizations.map((org) => {
              const isActive = org.id === organizationId;

              return (
                <MenuItem
                  key={org.id}
                  value={org.id}
                  className={cn(
                    "flex items-center justify-between gap-2",
                    isActive && "font-medium",
                  )}
                  onClick={() => {
                    if (isActive) return;
                    closeMobileSidebar();
                    // Switching workspace means changing the URL, not toggling a
                    // global selector: navigate to the target workspace's home
                    navigate({
                      to: "/@{$workspaceSlug}",
                      params: { workspaceSlug: org.slug },
                    });
                  }}
                >
                  <span className="truncate">{org.name}</span>
                  {isActive && <CheckIcon className="size-4 shrink-0" />}
                </MenuItem>
              );
            })}

            {manageUrl && (
              <>
                <MenuSeparator />
                <MenuItem value="manage" asChild>
                  <a
                    href={manageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <PlusIcon className="size-4" />
                    <span>Manage Organizations</span>
                  </a>
                </MenuItem>
              </>
            )}
          </MenuContent>
        </MenuPositioner>
      </MenuRoot>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
