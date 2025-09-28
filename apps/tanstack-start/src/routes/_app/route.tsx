import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { authMiddleware, signOut } from "@/features/auth";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
  server: {
    middleware: [authMiddleware],
  },

  errorComponent: () => <div>There was an error!</div>,
});

function RouteComponent() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/auth/signin" });
  };

  return (
    <div>
      Hello "/_app"!
      <Button onClick={handleSignOut}>sign out</Button>
      <Outlet />
    </div>
  );
}
