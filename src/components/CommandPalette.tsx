import { CommandPalette as CommandPaletteShell } from "@omnidotdev/thornberry/command-palette";
import { ShortcutsDialog } from "@omnidotdev/thornberry/shortcuts-dialog";
import {
  GLOBAL_HOTKEYS,
  hotkeyLabel,
  useHotkeys,
} from "@omnidotdev/thornberry/use-hotkeys";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Boxes,
  FileText,
  HomeIcon,
  Keyboard,
  LayoutDashboard,
  MoonStar,
  Receipt,
  Settings,
  TagIcon,
  Users,
} from "lucide-react";
import { useState } from "react";

import useIsDemo from "@/features/demo/useIsDemo";
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
  // Mounted at the root, so the workspace handle is only present while the user
  // is inside a workspace. Its presence gates (and supplies the param for) the
  // workspace navigation commands
  const { workspaceSlug } = useParams({ strict: false });
  // The demo workspace has no settings page
  const isDemo = useIsDemo();

  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  // App-wide theme shortcut. react-hotkeys-hook ignores form fields by default,
  // so this never fires while typing in the palette input or any other field
  useHotkeys(GLOBAL_HOTKEYS.toggleTheme, toggleTheme);

  const commands: CommandAction[] = [
    {
      id: "home",
      label: "Home",
      group: "Navigation",
      icon: HomeIcon,
      onSelect: () => navigate({ to: "/" }),
    },
    ...(workspaceSlug
      ? ([
          {
            id: "dashboard",
            label: "Dashboard",
            group: "Navigation",
            icon: LayoutDashboard,
            onSelect: () =>
              navigate({ to: "/@{$workspaceSlug}", params: { workspaceSlug } }),
          },
          {
            id: "people",
            label: "People",
            group: "Navigation",
            icon: Users,
            keywords: ["contacts", "companies"],
            onSelect: () =>
              navigate({
                to: "/@{$workspaceSlug}/people",
                params: { workspaceSlug },
              }),
          },
          {
            id: "inventory",
            label: "Inventory",
            group: "Navigation",
            icon: Boxes,
            keywords: ["products"],
            onSelect: () =>
              navigate({
                to: "/@{$workspaceSlug}/inventory",
                params: { workspaceSlug },
              }),
          },
          {
            id: "invoices",
            label: "Invoices",
            group: "Navigation",
            icon: Receipt,
            onSelect: () =>
              navigate({
                to: "/@{$workspaceSlug}/invoices",
                params: { workspaceSlug },
              }),
          },
          {
            id: "quotes",
            label: "Quotes",
            group: "Navigation",
            icon: FileText,
            onSelect: () =>
              navigate({
                to: "/@{$workspaceSlug}/quotes",
                params: { workspaceSlug },
              }),
          },
          ...(isDemo
            ? []
            : [
                {
                  id: "settings",
                  label: "Settings",
                  group: "Navigation",
                  icon: Settings,
                  onSelect: () =>
                    navigate({
                      to: "/@{$workspaceSlug}/settings",
                      params: { workspaceSlug },
                    }),
                },
              ]),
        ] satisfies CommandAction[])
      : []),
    {
      id: "pricing",
      label: "Pricing",
      group: "Navigation",
      icon: TagIcon,
      keywords: ["plans", "upgrade", "billing", "price"],
      onSelect: () => {
        window.location.href = "/pricing";
      },
    },
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
    {
      id: "keyboard-shortcuts",
      label: "Keyboard shortcuts",
      group: "Preferences",
      icon: Keyboard,
      keywords: ["hotkeys", "keys", "help"],
      shortcut: hotkeyLabel(GLOBAL_HOTKEYS.showShortcuts),
      onSelect: () => setShortcutsOpen(true),
    },
  ];

  return (
    <>
      <CommandPaletteShell
        commands={commands}
        placeholder="Search actions..."
      />
      {/* `?` opens it anywhere; the palette entry opens it too. The sidebar
          binds `b` to collapse it */}
      <ShortcutsDialog
        globals={[
          "commandPalette",
          "showShortcuts",
          "toggleSidebar",
          "toggleTheme",
        ]}
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </>
  );
};

export default CommandPalette;
