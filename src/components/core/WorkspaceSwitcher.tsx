import { WorkspaceSwitcher as SharedWorkspaceSwitcher } from "@omnidotdev/thornberry/workspace-switcher";
import { useNavigate, useRouteContext } from "@tanstack/react-router";

import { useSidebar } from "@/components/ui/sidebar";
import { AUTH_BASE_URL, CONSOLE_URL } from "@/lib/config/env.config";
import { useWorkspace } from "@/providers/WorkspaceProvider";

import type { WorkspaceOption } from "@omnidotdev/thornberry/workspace-switcher";

interface SwitchableWorkspace extends WorkspaceOption {
  slug: string;
}

/**
 * Slug of the workspace to open for a switcher selection, or `null` when the
 * active workspace (or an unknown id) is chosen and nothing should happen.
 */
export const getWorkspaceSlugToOpen = (
  workspaces: SwitchableWorkspace[],
  currentWorkspaceId: string | undefined,
  selectedId: string,
): string | null => {
  if (selectedId === currentWorkspaceId) return null;

  return workspaces.find(({ id }) => id === selectedId)?.slug ?? null;
};

/**
 * Sidebar workspace switcher, built on the shared Thornberry switcher.
 * Switching workspace changes the URL rather than a global selector.
 */
const WorkspaceSwitcher = () => {
  const navigate = useNavigate();
  const { organizationId } = useRouteContext({
    from: "/_app/@{$workspaceSlug}",
  });
  const workspaceCtx = useWorkspace();
  const { closeMobileSidebar } = useSidebar();

  const workspaces: SwitchableWorkspace[] = (
    workspaceCtx?.workspaces ?? []
  ).map(({ id, name, slug, logo }) => ({ id, name, slug, logo }));

  const handleSelect = (id: string) => {
    const slug = getWorkspaceSlugToOpen(workspaces, organizationId, id);
    if (!slug) return;

    closeMobileSidebar();
    navigate({ to: "/@{$workspaceSlug}", params: { workspaceSlug: slug } });
  };

  return (
    <SharedWorkspaceSwitcher
      variant="sidebar"
      workspaces={workspaces}
      currentWorkspaceId={organizationId}
      onSelect={handleSelect}
      manageUrl={CONSOLE_URL || AUTH_BASE_URL}
    />
  );
};

export default WorkspaceSwitcher;
