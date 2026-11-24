import {
  DEMO_ORGANIZATION_ID,
  DEMO_WORKSPACE_SLUG,
} from "@/features/demo/config";

import type { GetAuthSession } from "@omnidotdev/providers/auth";

/**
 * Sample session for the demo: signed in as Orin, the owner of the Basalt
 * Studio workspace. It carries no access token, so nothing built from it can
 * authenticate against the API
 */
export const demoSession: GetAuthSession = {
  organizations: [
    {
      id: DEMO_ORGANIZATION_ID,
      name: "Basalt Studio",
      slug: DEMO_WORKSPACE_SLUG,
      logo: null,
      type: "team",
      roles: ["owner"],
      teams: [],
    },
  ],
  user: {
    id: "demo-user",
    name: "Orin",
    email: "orin@basaltstudio.co",
    emailVerified: true,
    image: null,
    identityProviderId: "demo",
  },
  session: {
    token: "demo",
    expiresAt: "2099-01-01T00:00:00.000Z",
  },
};
