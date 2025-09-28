import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  beforeLoad: async () => {
    throw redirect({
      to: "/auth/signin",
    });
  },
});

function RouteComponent() {
  return (
    <div>
      Hello "/_app"!
      <Outlet />
    </div>
  );
}
