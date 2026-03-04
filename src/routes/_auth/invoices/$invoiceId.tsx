import { Outlet, createFileRoute } from "@tanstack/react-router";

const InvoiceLayout = () => <Outlet />;

export const Route = createFileRoute("/_auth/invoices/$invoiceId")({
  component: InvoiceLayout,
});
