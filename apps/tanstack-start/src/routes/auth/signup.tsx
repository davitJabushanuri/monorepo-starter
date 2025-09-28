import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/features/auth";

export const Route = createFileRoute("/auth/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return <SignUpForm />;
}
