import {
  DEMO_ORGANIZATION_ID,
  DEMO_WORKSPACE_SLUG,
} from "@/features/demo/config";

import type { ClientSession } from "@/lib/auth/clientSession";

/**
 * Sample session for the demo: signed in as Orin, the owner of the Basalt
 * Studio workspace. It carries no access token, so nothing built from it can
 * authenticate against the API
 */
export const demoSession: ClientSession = {
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
    image: null,
    identityProviderId: "demo",
  },
};
