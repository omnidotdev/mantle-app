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

const moduleRoutes: Record<string, string> = {
  people: "/people",
  invoices: "/invoices",
  quotes: "/quotes",
  inventory: "/inventory",
};

const AppSidebarContent = () => {
  const { pathname } = useLocation();

  return (
    <SidebarContent>
      {/* Dashboard */}
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
              <Link to="/dashboard">
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
                    isActive={pathname.startsWith(
                      moduleRoutes[key] as string,
                    )}
                  >
                    <Link to={moduleRoutes[key] as "/people"}>
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
