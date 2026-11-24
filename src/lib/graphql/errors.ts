import { ClientError } from "graphql-request";

/** The first GraphQL error the API returned for a failed request, if any */
const firstGraphqlError = (err: unknown) =>
  err instanceof ClientError ? err.response.errors?.[0] : undefined;

/** The API's error code (e.g. FORBIDDEN, PLAN_LIMIT_REACHED), if any */
export const graphqlErrorCode = (err: unknown): string | undefined => {
  const code = firstGraphqlError(err)?.extensions?.code;

  return typeof code === "string" ? code : undefined;
};

/**
 * The user-facing explanation when a create was refused for the workspace's
 * plan limit (e.g. "Your plan includes up to 50 contacts..."), else null
 */
export const planLimitMessage = (err: unknown): string | null =>
  graphqlErrorCode(err) === "PLAN_LIMIT_REACHED"
    ? (firstGraphqlError(err)?.message ?? null)
    : null;

/**
 * The invoice a quote was already turned into, when a conversion was refused
 * because the quote has one (e.g. converted from another tab), else null
 */
export const alreadyConvertedInvoiceId = (err: unknown): string | null => {
  if (graphqlErrorCode(err) !== "QUOTE_ALREADY_CONVERTED") return null;
  const invoiceId = firstGraphqlError(err)?.extensions?.invoiceId;

  return typeof invoiceId === "string" ? invoiceId : null;
};

/** Toast-ready message for a workspace profile save the API refused */
export const profileSaveErrorMessage = (err: unknown): string =>
  graphqlErrorCode(err) === "FORBIDDEN"
    ? "Only workspace owners and admins can change the workspace profile"
    : "Could not save the workspace profile. Try again.";
