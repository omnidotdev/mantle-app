import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@omnidotdev/thornberry/sidebar";
import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import {
  LogOutIcon,
  MoonIcon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";

import signOut from "@/lib/auth/signOut";
import { useWorkspaceSlug } from "@/lib/hooks/util/useWorkspaceSlug";
import { useTheme } from "@/providers/ThemeProvider";

const AppSidebarFooter = () => {
  const { pathname } = useLocation();
  const { session } = useRouteContext({ from: "__root__" });
  const workspaceSlug = useWorkspaceSlug();
  const user = session?.user;
  const { open, setOpen } = useSidebar();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () =>
    theme === "dark" ? setTheme("light") : setTheme("dark");

  return (
    <SidebarFooter>
      {user && (
        <div className="flex items-center gap-2 px-2 py-1.5">
          {user.image ? (
            <img
              src={user.image}
              alt="User avatar"
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 font-medium text-primary-700 text-xs">
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
          <SidebarMenuButton onClick={() => setOpen(!open)}>
            {open ? (
              <PanelLeftCloseIcon className="size-4" />
            ) : (
              <PanelLeftIcon className="size-4" />
            )}
            <span>{open ? "Collapse" : "Expand"} Sidebar</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton onClick={toggleTheme}>
            {theme === "dark" ? (
              <MoonIcon className="size-4" />
            ) : (
              <SunIcon className="size-4" />
            )}
            <span>Toggle Theme</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(`/@${workspaceSlug}/settings`)}
          >
            <Link to="/@{$workspaceSlug}/settings" params={{ workspaceSlug }}>
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
