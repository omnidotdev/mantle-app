import { describe, expect, test } from "bun:test";

import { collectPublicEnv, publicEnvScript } from "@/lib/config/publicEnv";

describe("public runtime env", () => {
  test("keeps only non-empty VITE_ values", () => {
    expect(
      collectPublicEnv({
        VITE_API_URL: "http://localhost:4000",
        VITE_BASE_URL: "http://localhost:3000",
        VITE_EMPTY: "",
        VITE_UNSET: undefined,
        AUTH_BASE_URL: "http://localhost:8080/default",
        DATABASE_URL: "postgres://user:pass@db/mantle",
      }),
    ).toEqual({
      VITE_API_URL: "http://localhost:4000",
      VITE_BASE_URL: "http://localhost:3000",
    });
  });

  test("drops credential-like keys even with the VITE_ prefix", () => {
    expect(
      collectPublicEnv({
        VITE_AUTH_CLIENT_SECRET: "s",
        VITE_SERVICE_KEY: "k",
        VITE_API_TOKEN: "t",
        VITE_DB_PASSWORD: "p",
        VITE_ACCOUNT_URL: "https://account.omni.dev",
      }),
    ).toEqual({ VITE_ACCOUNT_URL: "https://account.omni.dev" });
  });

  test("the inline script cannot be closed early by a value", () => {
    const script = publicEnvScript({ VITE_X: "</script><script>alert(1)" });

    expect(script).not.toContain("</script>");
    expect(script.startsWith("window.__ENV__=")).toBe(true);
  });
});
