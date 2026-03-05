import { Outlet, createFileRoute } from "@tanstack/react-router";

const QuoteLayout = () => <Outlet />;

export const Route = createFileRoute("/_app/quotes/$quoteId")({
  component: QuoteLayout,
});
