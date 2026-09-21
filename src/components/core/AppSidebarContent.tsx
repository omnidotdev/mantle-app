import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboardIcon } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import app from "@/lib/config/app.config";
import { useWorkspaceSlug } from "@/lib/hooks/util/useWorkspaceSlug";

const moduleRoutes: Record<string, string> = {
  people: "/@{$workspaceSlug}/people",
  invoices: "/@{$workspaceSlug}/invoices",
  quotes: "/@{$workspaceSlug}/quotes",
  inventory: "/@{$workspaceSlug}/inventory",
};

const AppSidebarContent = () => {
  const { pathname } = useLocation();
  const workspaceSlug = useWorkspaceSlug();

  // Active state compares against the resolved path (`/@acme/...`), not the
  // route template, since `pathname` carries the concrete handle
  const workspaceHome = `/@${workspaceSlug}`;

  return (
    <SidebarContent>
      {/* Dashboard */}
      <SidebarGroup className="pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === workspaceHome}>
              <Link to="/@{$workspaceSlug}" params={{ workspaceSlug }}>
                <LayoutDashboardIcon className="size-4" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Modules */}
      <SidebarGroup>
        <SidebarGroupLabel>Modules</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {Object.entries(app.modules)
              .filter(([, config]) => config.enabled)
              .map(([key, config]) => (
                <SidebarMenuItem key={key}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(`${workspaceHome}/${key}`)}
                  >
                    <Link
                      to={moduleRoutes[key] as "/@{$workspaceSlug}/people"}
                      params={{ workspaceSlug }}
                    >
                      <span>{config.icon}</span>
                      <span>{config.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default AppSidebarContent;
