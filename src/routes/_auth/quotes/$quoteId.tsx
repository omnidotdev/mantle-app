import { Outlet, createFileRoute } from "@tanstack/react-router";

const QuoteLayout = () => <Outlet />;

export const Route = createFileRoute("/_auth/quotes/$quoteId")({
  component: QuoteLayout,
});
