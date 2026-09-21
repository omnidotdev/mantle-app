import { useParams } from "@tanstack/react-router";

/**
 * The active workspace handle from the URL (`@{$workspaceSlug}`). Available to
 * any component rendered under the workspace layout; use it to supply the
 * `workspaceSlug` param when building links within the current workspace.
 */
export const useWorkspaceSlug = (): string =>
  useParams({
    strict: false,
    select: (params) => params.workspaceSlug as string,
  });
