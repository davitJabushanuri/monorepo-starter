import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/features/auth";

export const Route = createFileRoute("/auth/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignInForm />;
}
