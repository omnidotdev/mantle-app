import { Link, useLocation } from "@tanstack/react-router";

import {
  dashboardNav,
  isNavActive,
  moduleNav,
} from "@/components/core/moduleNav";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useWorkspaceSlug } from "@/lib/hooks/util/useWorkspaceSlug";

import type { ModuleNavItem } from "@/components/core/moduleNav";

const NavItem = ({ item }: { item: ModuleNavItem }) => {
  const { pathname } = useLocation();
  const workspaceSlug = useWorkspaceSlug();
  const Icon = item.icon;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isNavActive(item, pathname, workspaceSlug)}
      >
        <Link to={item.to} params={{ workspaceSlug }}>
          <Icon className="size-4" />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const AppSidebarContent = () => (
  <SidebarContent>
    <SidebarGroup className="pt-1">
      <SidebarMenu>
        <NavItem item={dashboardNav} />
      </SidebarMenu>
    </SidebarGroup>

    <SidebarGroup>
      <SidebarGroupLabel className="px-2.5">Modules</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {moduleNav.map((item) => (
            <NavItem key={item.key} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
);

export default AppSidebarContent;
