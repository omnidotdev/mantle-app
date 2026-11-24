import { openCommandPalette } from "@omnidotdev/thornberry/command-palette";
import {
  GLOBAL_HOTKEYS,
  hotkeyLabel,
} from "@omnidotdev/thornberry/use-hotkeys";
import { useMatches } from "@tanstack/react-router";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useWorkspaceSlug } from "@/lib/hooks/util/useWorkspaceSlug";
import { useWorkspace } from "@/providers/WorkspaceProvider";

/**
 * Sticky bar above every workspace page. Desktop: "Workspace / Page" plus a
 * search pill that opens the command palette. Phones: the drawer trigger, the
 * page title, and a search button. The title comes from the deepest matched
 * route's `staticData.title`
 */
const AppTopBar = () => {
  const matches = useMatches();
  const workspaceSlug = useWorkspaceSlug();
  const workspaceCtx = useWorkspace();

  const workspaceName =
    workspaceCtx?.workspaces?.find((ws) => ws.slug === workspaceSlug)?.name ??
    `@${workspaceSlug}`;

  // Pages without a title (e.g. not found) show just the workspace
  const title = [...matches].reverse().find((match) => match.staticData?.title)
    ?.staticData.title;

  // The shortcut label depends on the platform, so resolve it after hydration
  const [shortcut, setShortcut] = useState<string | null>(null);
  useEffect(() => setShortcut(hotkeyLabel(GLOBAL_HOTKEYS.commandPalette)), []);

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 bg-canvas/85 pt-[env(safe-area-inset-top)] pr-3 pl-2 backdrop-blur-md md:px-8 print:hidden">
      <SidebarTrigger className="md:hidden" />

      <nav
        aria-label="Breadcrumb"
        className="flex min-w-0 items-center gap-1.5 text-sm"
      >
        {title && (
          <>
            <span className="hidden truncate text-muted-foreground md:inline">
              {workspaceName}
            </span>
            <span
              aria-hidden
              className="hidden text-muted-foreground/60 md:inline"
            >
              /
            </span>
          </>
        )}
        <span
          aria-current="page"
          className="truncate text-base font-semibold md:text-sm md:font-medium"
        >
          {title ?? workspaceName}
        </span>
      </nav>

      <button
        type="button"
        onClick={openCommandPalette}
        className="ml-auto hidden h-9 w-72 items-center gap-2 rounded-full bg-card px-3.5 text-sm text-muted-foreground shadow-card transition-colors hover:text-foreground md:flex dark:border dark:border-border dark:shadow-none"
      >
        <SearchIcon className="size-4" />
        <span>Search or jump to</span>
        {shortcut && (
          <kbd className="ml-auto rounded-md border border-border px-1.5 font-sans text-[0.6875rem]">
            {shortcut}
          </kbd>
        )}
      </button>

      <Button
        variant="ghost"
        size="icon"
        onClick={openCommandPalette}
        aria-label="Search or jump to"
        className="ml-auto md:hidden"
      >
        <SearchIcon />
      </Button>
    </header>
  );
};

export default AppTopBar;
