import { rootRouteId, useMatch, useRouter } from "@tanstack/react-router";
import { TriangleAlertIcon } from "lucide-react";
import { useEffect } from "react";

import EmptyState from "@/components/core/EmptyState";
import { Button, buttonVariants } from "@/components/ui/button";

import type { ErrorComponentProps } from "@tanstack/react-router";

/**
 * Default error boundary for caught route errors. The error is logged for
 * debugging but never shown, so users only see friendly copy and a way forward
 */
const DefaultCatchBoundary = ({ error }: ErrorComponentProps) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  });

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-1 items-center justify-center px-4 py-16">
      <EmptyState
        icon={TriangleAlertIcon}
        title="Something went wrong"
        description="This page could not be loaded. Try again, and if it keeps happening, come back in a few minutes."
        action={
          <>
            <Button variant="outline" onClick={() => router.invalidate()}>
              Try again
            </Button>
            {isRoot ? (
              <a href="/" className={buttonVariants({ variant: "solid" })}>
                Go home
              </a>
            ) : (
              <Button onClick={() => window.history.back()}>Go back</Button>
            )}
          </>
        }
      />
    </main>
  );
};

export default DefaultCatchBoundary;
