import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { OrganizationProfile } from "../types";

/**
 * Workspace profiles this browser saved before the profile moved to the API.
 * Read once per workspace to push a profile the server does not have yet (see
 * useWorkspaceProfile), then dropped; nothing writes new profiles here
 */
interface LegacyProfileStore {
  profiles: OrganizationProfile[];
  deleteProfile: (id: string) => void;
  getProfileForOrg: (orgId: string) => OrganizationProfile | undefined;
}

const useSettingsStore = create<LegacyProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],

      deleteProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
        }));
      },

      getProfileForOrg: (orgId) => {
        return get().profiles.find((p) => p.organizationId === orgId);
      },
    }),
    {
      name: "mantle-settings",
    },
  ),
);

export { useSettingsStore };
