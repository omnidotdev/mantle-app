import { CommandPalette as CommandPaletteShell } from "@omnidotdev/thornberry/command-palette";
import {
  GLOBAL_HOTKEYS,
  hotkeyLabel,
  useHotkeys,
} from "@omnidotdev/thornberry/use-hotkeys";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import {
  Boxes,
  FileText,
  HomeIcon,
  LayoutDashboard,
  MoonStar,
  Receipt,
  Settings,
  Users,
} from "lucide-react";

import { useTheme } from "@/providers/ThemeProvider";

import type { CommandAction } from "@omnidotdev/thornberry/command-palette";

/**
 * Global command palette (⌘/Ctrl+K). Mounted once at the app root so it works on
 * every route. Exposes top-level navigation and the theme toggle. Built on the
 * shared Thornberry palette so every Omni app shares the same behavior; this
 * wrapper only supplies Mantle's own actions. The shell owns the open state and
 * the mod+k hotkey, so no local open state is needed here.
 */
const CommandPalette = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { session } = useRouteContext({ from: "__root__" });

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // App-wide theme shortcut. react-hotkeys-hook ignores form fields by default,
  // so this never fires while typing in the palette input or any other field
  useHotkeys(GLOBAL_HOTKEYS.toggleTheme, toggleTheme);

  // Authenticated app routes redirect to home when signed out, so only surface
  // them once there is a session
  const isAuthed = Boolean(session?.user);

  const commands: CommandAction[] = [
    {
      id: "home",
      label: "Home",
      group: "Navigation",
      icon: HomeIcon,
      onSelect: () => navigate({ to: "/" }),
    },
    ...(isAuthed
      ? ([
          {
            id: "dashboard",
            label: "Dashboard",
            group: "Navigation",
            icon: LayoutDashboard,
            onSelect: () => navigate({ to: "/dashboard" }),
          },
          {
            id: "people",
            label: "People",
            group: "Navigation",
            icon: Users,
            keywords: ["contacts", "companies"],
            onSelect: () => navigate({ to: "/people" }),
          },
          {
            id: "inventory",
            label: "Inventory",
            group: "Navigation",
            icon: Boxes,
            keywords: ["products"],
            onSelect: () => navigate({ to: "/inventory" }),
          },
          {
            id: "invoices",
            label: "Invoices",
            group: "Navigation",
            icon: Receipt,
            onSelect: () => navigate({ to: "/invoices" }),
          },
          {
            id: "quotes",
            label: "Quotes",
            group: "Navigation",
            icon: FileText,
            onSelect: () => navigate({ to: "/quotes" }),
          },
          {
            id: "settings",
            label: "Settings",
            group: "Navigation",
            icon: Settings,
            onSelect: () => navigate({ to: "/settings" }),
          },
        ] satisfies CommandAction[])
      : []),
    {
      id: "toggle-theme",
      label:
        theme === "light" ? "Switch to dark theme" : "Switch to light theme",
      group: "Preferences",
      icon: MoonStar,
      keywords: ["theme", "dark", "light", "appearance"],
      shortcut: hotkeyLabel(GLOBAL_HOTKEYS.toggleTheme),
      onSelect: toggleTheme,
    },
  ];

  return (
    <CommandPaletteShell commands={commands} placeholder="Search actions..." />
  );
};

export default CommandPalette;
