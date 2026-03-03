import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import { LogOutIcon, SettingsIcon } from "lucide-react";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import signOut from "@/lib/auth/signOut";

const AppSidebarFooter = () => {
  const { pathname } = useLocation();
  const { session } = useRouteContext({ from: "__root__" });
  const user = session?.user;

  return (
    <SidebarFooter>
      {user && (
        <div className="flex items-center gap-2 px-2 py-1.5">
          {user.image ? (
            <img
              src={user.image}
              alt=""
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 font-medium text-teal-700 text-xs">
              {(user.name?.[0] || user.email?.[0] || "?").toUpperCase()}
            </div>
          )}
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate font-medium text-sm leading-tight">
              {user.name || user.username}
            </p>
            <p className="truncate text-muted-foreground text-xs">
              {user.email}
            </p>
          </div>
        </div>
      )}
      <SidebarSeparator />
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith("/settings")}
          >
            <Link to="/settings">
              <SettingsIcon className="size-4" />
              <span>Settings</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={signOut}>
            <LogOutIcon className="size-4" />
            <span>Sign Out</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
