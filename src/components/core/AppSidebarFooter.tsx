import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import {
  LogOutIcon,
  MoonIcon,
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SettingsIcon,
  SunIcon,
} from "lucide-react";

import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import useIsDemo from "@/features/demo/useIsDemo";
import signOut from "@/lib/auth/signOut";
import { useWorkspaceSlug } from "@/lib/hooks/util/useWorkspaceSlug";
import { useTheme } from "@/providers/ThemeProvider";

const AppSidebarFooter = () => {
  const { pathname } = useLocation();
  const { session } = useRouteContext({ from: "__root__" });
  const workspaceSlug = useWorkspaceSlug();
  const user = session?.user;
  const { open, setOpen, isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  // The demo workspace has no settings to change and no account to sign out of
  const isDemo = useIsDemo();

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
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-medium text-primary-600 dark:text-primary-300">
              {(user.name?.[0] || user.email?.[0] || "?").toUpperCase()}
            </div>
          )}
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm leading-tight font-medium">
              {user.name || user.username}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      )}
      <SidebarSeparator />
      <SidebarMenu>
        {/* Collapsing only applies to the desktop rail, not the phone drawer */}
        {!isMobile && (
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setOpen(!open)}>
              {open ? (
                <PanelLeftCloseIcon className="size-4" />
              ) : (
                <PanelLeftIcon className="size-4" />
              )}
              <span>{open ? "Collapse sidebar" : "Expand sidebar"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        <SidebarMenuItem>
          <SidebarMenuButton onClick={toggleTheme}>
            {theme === "dark" ? (
              <MoonIcon className="size-4" />
            ) : (
              <SunIcon className="size-4" />
            )}
            <span>{theme === "dark" ? "Light theme" : "Dark theme"}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {!isDemo && (
          <>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(`/@${workspaceSlug}/settings`)}
              >
                <Link
                  to="/@{$workspaceSlug}/settings"
                  params={{ workspaceSlug }}
                >
                  <SettingsIcon className="size-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton onClick={signOut}>
                <LogOutIcon className="size-4" />
                <span>Sign out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </>
        )}
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
