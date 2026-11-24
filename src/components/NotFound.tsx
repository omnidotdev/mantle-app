import { Link, useParams } from "@tanstack/react-router";
import { CompassIcon } from "lucide-react";

import EmptyState from "@/components/core/EmptyState";
import { buttonVariants } from "@/components/ui/button";

/**
 * 404 not found. Renders inside the workspace shell or on its own, so it only
 * links to the workspace dashboard when a workspace is in the URL and falls
 * back to the app root otherwise
 */
const NotFound = () => {
  const { workspaceSlug } = useParams({ strict: false });

  return (
    <main className="flex min-h-[60vh] flex-1 items-center justify-center px-4 py-16">
      <EmptyState
        icon={CompassIcon}
        title="Page not found"
        description="This page does not exist or may have moved. Check the address and try again."
        action={
          workspaceSlug ? (
            <Link
              to="/@{$workspaceSlug}"
              params={{ workspaceSlug }}
              className={buttonVariants({ variant: "solid" })}
            >
              Go to dashboard
            </Link>
          ) : (
            <Link to="/" className={buttonVariants({ variant: "solid" })}>
              Go home
            </Link>
          )
        }
      />
    </main>
  );
};

export default NotFound;
