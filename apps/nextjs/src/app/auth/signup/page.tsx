import { SignUpForm } from "@/features/auth/components";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <SignUpForm />
      </div>
    </div>
  );
}
