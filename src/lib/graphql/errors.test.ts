import { describe, expect, test } from "bun:test";

import { ClientError } from "graphql-request";

import {
  graphqlErrorCode,
  planLimitMessage,
  profileSaveErrorMessage,
} from "./errors";

const apiError = (message: string, code?: string) =>
  new ClientError(
    {
      status: 200,
      errors: [{ message, extensions: code ? { code } : {} }],
    } as never,
    { query: "mutation { x }" },
  );

describe("API error helpers", () => {
  test("a refused create surfaces the plan limit explanation", () => {
    const err = apiError(
      "Your plan includes up to 50 contacts. Upgrade your plan to add more",
      "PLAN_LIMIT_REACHED",
    );
    expect(graphqlErrorCode(err)).toBe("PLAN_LIMIT_REACHED");
    expect(planLimitMessage(err)).toBe(
      "Your plan includes up to 50 contacts. Upgrade your plan to add more",
    );
  });

  test("other failures never surface the API's message", () => {
    expect(
      planLimitMessage(apiError("Unexpected error.", "INTERNAL_SERVER_ERROR")),
    ).toBeNull();
    expect(planLimitMessage(new Error("network down"))).toBeNull();
  });

  test("a refused profile save explains who can edit it", () => {
    expect(
      profileSaveErrorMessage(
        apiError("Only workspace owners and admins can do this", "FORBIDDEN"),
      ),
    ).toBe("Only workspace owners and admins can change the workspace profile");
    expect(profileSaveErrorMessage(new Error("offline"))).toBe(
      "Could not save the workspace profile. Try again.",
    );
  });
});
