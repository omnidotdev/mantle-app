import authClient from "@/lib/auth/authClient";

interface Params {
  /** Redirect URL */
  redirectUrl: string;
  /** OAuth provider ID */
  providerId: string;
}

/**
 * Sign in with OAuth2 provider.
 */
const signIn = async ({ redirectUrl, providerId }: Params) => {
  // better-auth 1.7: generic providers sign in through the standard social flow
  const res = await authClient.signIn.social({
    provider: providerId,
    callbackURL: redirectUrl,
  });

  if (res?.error) {
    throw new Error(res.error.message || "OAuth sign-in failed");
  }
};

export default signIn;
