import { Outlet, createFileRoute } from "@tanstack/react-router";

const ProductLayout = () => <Outlet />;

export const Route = createFileRoute("/_app/inventory/$productId")({
  component: ProductLayout,
});
