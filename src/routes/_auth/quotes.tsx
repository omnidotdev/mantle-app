import { Outlet, createFileRoute } from "@tanstack/react-router";

const QuotesLayout = () => <Outlet />;

export const Route = createFileRoute("/_auth/quotes")({
  component: QuotesLayout,
});
