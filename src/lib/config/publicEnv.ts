/** Key names that look like credentials, never sent to the browser */
const SECRET_LIKE = /secret|token|password|\bkey\b|_key/i;

/**
 * Public runtime configuration for the browser: the `VITE_`-prefixed entries
 * of an environment. A key that looks like a credential is dropped even with
 * the prefix, so a mis-prefixed secret can never leak to the client
 */
export const collectPublicEnv = (
  source: Record<string, string | undefined>,
): Record<string, string> => {
  const out: Record<string, string> = {};

  for (const [key, value] of Object.entries(source)) {
    if (!key.startsWith("VITE_")) continue;
    if (SECRET_LIKE.test(key)) continue;
    if (typeof value === "string" && value.length) out[key] = value;
  }

  return out;
};

/**
 * Inline script body that publishes the public config as `window.__ENV__`.
 * `<` is escaped so a value can never close the script tag early
 */
export const publicEnvScript = (publicEnv: Record<string, string>): string =>
  `window.__ENV__=${JSON.stringify(publicEnv).replace(/</g, "\\u003c")}`;
