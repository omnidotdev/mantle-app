import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { OrganizationProfile } from "../types";

interface SettingsStore {
  profiles: OrganizationProfile[];

  createProfile: (
    profile: Omit<OrganizationProfile, "id" | "createdAt" | "updatedAt">,
  ) => OrganizationProfile;
  updateProfile: (id: string, updates: Partial<OrganizationProfile>) => void;
  deleteProfile: (id: string) => void;
  getProfile: (id: string) => OrganizationProfile | undefined;
  getProfileForOrg: (orgId: string) => OrganizationProfile | undefined;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      profiles: [],

      createProfile: (profile) => {
        const now = new Date().toISOString();
        const newProfile: OrganizationProfile = {
          ...profile,
          id: crypto.randomUUID(),
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          profiles: [...state.profiles, newProfile],
        }));

        return newProfile;
      },

      updateProfile: (id, updates) => {
        set((state) => ({
          profiles: state.profiles.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p,
          ),
        }));
      },

      deleteProfile: (id) => {
        set((state) => ({
          profiles: state.profiles.filter((p) => p.id !== id),
        }));
      },

      getProfile: (id) => {
        return get().profiles.find((p) => p.id === id);
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
