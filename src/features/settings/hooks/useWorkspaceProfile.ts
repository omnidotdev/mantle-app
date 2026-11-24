import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useSettingsStore } from "@/features/settings/store/settingsStore";
import {
  fieldsOf,
  legacyProfileAction,
  toProfile,
} from "@/features/settings/workspaceProfile";
import {
  useCreateWorkspaceProfileMutation,
  useUpdateWorkspaceProfileMutation,
  useWorkspaceProfileQuery,
} from "@/generated/graphql";

import type { ProfileFields } from "@/features/settings/workspaceProfile";
import type {
  WorkspaceProfileFieldsFragment,
  WorkspaceProfileQuery,
} from "@/generated/graphql";

/** Fields to save; null clears a field */
type ProfilePatch = { [K in keyof ProfileFields]?: string | null };

/** How long inline edits wait for more keystrokes before saving */
const SAVE_DEBOUNCE_MS = 600;

/** Workspaces whose browser-only profile has been pushed this session */
const migrated = new Set<string>();

/**
 * The workspace profile (company details shown on invoices, quotes and
 * contracts), stored by the API on the workspace's settings.
 *
 * The profile used to live only in this browser. The first time a workspace
 * with no server profile is opened, a profile this browser still holds is
 * pushed up once; from then on the server is the source of truth and the local
 * copy is dropped. Until that push lands (or if it is refused, e.g. for a
 * member who cannot edit settings), the local copy is shown read-only
 */
export const useWorkspaceProfile = (
  organizationId: string | null | undefined,
) => {
  const queryClient = useQueryClient();
  const variables = { organizationId: organizationId ?? "" };
  const queryKey = useWorkspaceProfileQuery.getKey(variables);

  const query = useWorkspaceProfileQuery(variables, {
    enabled: !!organizationId,
    staleTime: 60_000,
  });

  const { mutateAsync: createProfile } = useCreateWorkspaceProfileMutation();
  const { mutateAsync: updateProfile } = useUpdateWorkspaceProfileMutation();

  const localProfile = useSettingsStore((state) =>
    organizationId ? state.getProfileForOrg(organizationId) : undefined,
  );

  const { refetch } = query;
  const node = query.data?.organizationSettings?.nodes[0];
  const serverProfile = useMemo(
    () => (node ? toProfile(node) : undefined),
    [node],
  );

  const readNode = useCallback(
    () =>
      queryClient.getQueryData<WorkspaceProfileQuery>(queryKey)
        ?.organizationSettings?.nodes[0],
    [queryClient, queryKey],
  );

  const writeNode = useCallback(
    (next: WorkspaceProfileFieldsFragment) =>
      queryClient.setQueryData<WorkspaceProfileQuery>(queryKey, {
        organizationSettings: { nodes: [next] },
      }),
    [queryClient, queryKey],
  );

  /**
   * Save fields to the server: update the workspace's settings, or create them
   * on first save. Resolves with the saved profile; rejects when the server
   * refuses (e.g. the caller is not an owner or admin)
   */
  const save = useCallback(
    async (patch: ProfilePatch) => {
      if (!organizationId) return undefined;

      const update = async (rowId: string) =>
        (await updateProfile({ input: { rowId, patch } }))
          .updateOrganizationSetting?.organizationSetting;

      const current = readNode();
      let saved: WorkspaceProfileFieldsFragment | null | undefined;

      if (current?.rowId) {
        saved = await update(current.rowId);
      } else {
        try {
          saved = (
            await createProfile({
              input: { organizationSetting: { organizationId, ...patch } },
            })
          ).createOrganizationSetting?.organizationSetting;
        } catch (err) {
          // Another tab or device created the settings first: update those
          const refreshed = await refetch();
          const rowId = refreshed.data?.organizationSettings?.nodes[0]?.rowId;
          if (!rowId) throw err;
          saved = await update(rowId);
        }
      }

      if (saved) writeNode(saved);

      return saved ? toProfile(saved) : undefined;
    },
    [
      organizationId,
      readNode,
      writeNode,
      createProfile,
      updateProfile,
      refetch,
    ],
  );

  // Inline edits (document forms) apply at once and save after a pause
  const pending = useRef<ProfilePatch>({});
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSaveError = useRef<((err: unknown) => void) | null>(null);

  const flush = useCallback(() => {
    timer.current = null;
    const patch = pending.current;
    pending.current = {};
    if (Object.keys(patch).length === 0) return;
    save(patch).catch((err) => {
      void refetch();
      onSaveError.current?.(err);
    });
  }, [save, refetch]);

  const updateField = useCallback(
    (
      field: keyof ProfileFields,
      value: string | null,
      onError?: (err: unknown) => void,
    ) => {
      if (!organizationId) return;

      writeNode({
        ...(readNode() ?? {
          rowId: "",
          organizationId,
          accentColor: null,
          companyName: null,
          contactName: null,
          contactTitle: null,
          email: null,
          phone: null,
          website: null,
          addressLine1: null,
          addressLine2: null,
          city: null,
          state: null,
          postalCode: null,
          country: null,
          logoUrl: null,
          registrationState: null,
          createdAt: null,
          updatedAt: null,
        }),
        [field]: value,
      });

      pending.current = { ...pending.current, [field]: value };
      onSaveError.current = onError ?? null;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(flush, SAVE_DEBOUNCE_MS);
    },
    [organizationId, readNode, writeNode, flush],
  );

  // Save anything still pending when the form unmounts
  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
        flush();
      }
    },
    [flush],
  );

  // One-time push of a browser-only profile, then the server owns it
  useEffect(() => {
    if (!organizationId || !query.isSuccess || !localProfile) return;
    const { deleteProfile } = useSettingsStore.getState();
    const action = legacyProfileAction({
      serverHasProfile: !!node?.rowId,
      hasLocalProfile: true,
      alreadyPushed: migrated.has(organizationId),
    });

    if (action === "drop") {
      deleteProfile(localProfile.id);
      return;
    }
    if (action !== "push") return;
    migrated.add(organizationId);

    save(fieldsOf(localProfile))
      .then(() => deleteProfile(localProfile.id))
      .catch(() => {
        // Refused (e.g. a member who cannot edit settings): keep the local
        // copy so nothing is lost; an owner or admin can save it later
      });
  }, [organizationId, query.isSuccess, node?.rowId, localProfile, save]);

  return {
    /** The workspace profile: the server's, else this browser's legacy copy */
    profile: serverProfile ?? localProfile,
    isLoading: query.isLoading,
    save,
    updateField,
  };
};
