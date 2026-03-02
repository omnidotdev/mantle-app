import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: ({ context: { session } }) => {
    if (!session?.user) throw redirect({ to: "/" });
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
