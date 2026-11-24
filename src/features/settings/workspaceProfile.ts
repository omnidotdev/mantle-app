import type { OrganizationProfile } from "@/features/settings/types";
import type { WorkspaceProfileFieldsFragment } from "@/generated/graphql";

/** The editable profile fields */
export type ProfileFields = Omit<
  OrganizationProfile,
  "id" | "organizationId" | "createdAt" | "updatedAt"
>;

/**
 * Pure helpers behind useWorkspaceProfile: mapping the API's workspace
 * settings to the profile the document previews use, and deciding what to do
 * with a profile this browser kept before the profile moved to the API
 */

export const toProfile = (
  node: WorkspaceProfileFieldsFragment,
): OrganizationProfile => ({
  id: node.rowId,
  organizationId: node.organizationId,
  companyName: node.companyName ?? "",
  contactName: node.contactName ?? "",
  contactTitle: node.contactTitle,
  email: node.email ?? "",
  phone: node.phone,
  website: node.website,
  addressLine1: node.addressLine1,
  addressLine2: node.addressLine2,
  city: node.city,
  state: node.state,
  postalCode: node.postalCode,
  country: node.country,
  logoUrl: node.logoUrl,
  registrationState: node.registrationState,
  accentColor: node.accentColor,
  createdAt: node.createdAt ?? "",
  updatedAt: node.updatedAt ?? "",
});

/** The editable fields of a locally stored (pre-server) profile */
export const fieldsOf = (profile: OrganizationProfile): ProfileFields => {
  const {
    id: _id,
    organizationId: _organizationId,
    createdAt: _createdAt,
    updatedAt: _updatedAt,
    ...fields
  } = profile;

  return fields;
};

/**
 * What to do with a profile this browser still holds from before the profile
 * moved to the API:
 *  - `push`: the server has none yet, so upload it once
 *  - `drop`: the server already has the profile, which wins
 *  - `none`: nothing to do (no local copy, or already pushed this session)
 */
export const legacyProfileAction = ({
  serverHasProfile,
  hasLocalProfile,
  alreadyPushed,
}: {
  serverHasProfile: boolean;
  hasLocalProfile: boolean;
  alreadyPushed: boolean;
}): "push" | "drop" | "none" => {
  if (!hasLocalProfile) return "none";
  if (serverHasProfile) return "drop";

  return alreadyPushed ? "none" : "push";
};
