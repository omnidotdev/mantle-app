import { TriangleAlertIcon } from "lucide-react";
import { Component } from "react";

import EmptyState from "@/components/core/EmptyState";
import { Button } from "@/components/ui/button";

import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render errors inside the workspace shell. The error is logged for
 * debugging but never shown, so users only see friendly copy and a retry
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
          <EmptyState
            icon={TriangleAlertIcon}
            title="Something went wrong"
            description="This part of the page ran into a problem. Try again, or reload the page if it keeps happening."
            action={
              <>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Reload page
                </Button>
                <Button onClick={() => this.setState({ hasError: false })}>
                  Try again
                </Button>
              </>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
