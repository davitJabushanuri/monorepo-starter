import { beforeEach, describe, expect, it, mock } from "bun:test";

// Create test auth client that doesn't use better-auth
const mockSignInEmail = mock(() => Promise.resolve({}));
const mockSignInSocial = mock(() => Promise.resolve({}));

const testAuthClient = {
  signIn: {
    email: mockSignInEmail,
    social: mockSignInSocial,
  },
  signUp: {},
  signOut: {},
  useSession: {},
  getSession: {},
};

// Mock the auth-client module completely
mock.module("@/features/auth/lib/auth-client", () => testAuthClient);

// Mock Next.js Link component
mock.module("next/link", () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInForm } from "../signin-form";

describe("SignInForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockSignInEmail.mockClear();
    mockSignInSocial.mockClear();
  });

  it("renders the sign in form correctly", () => {
    render(<SignInForm />);

    // Check for the title (should be unique)
    expect(
      screen.getByText("Sign In", { selector: '[data-slot="card-title"]' }),
    ).toBeTruthy();
    expect(screen.getByLabelText(/email/i)).toBeTruthy();
    expect(screen.getByLabelText(/password/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /^sign in$/i })).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /sign in with google/i }),
    ).toBeTruthy();
    expect(screen.getByText(/don't have an account\?/i)).toBeTruthy();
  });

  it("shows validation errors for empty fields", async () => {
    render(<SignInForm />);

    const submitButton = screen.getByRole("button", { name: /^sign in$/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeTruthy();
      expect(
        screen.getByText(/password must be at least 6 characters/i),
      ).toBeTruthy();
    });
  });

  it("shows validation error for short password", async () => {
    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /^sign in$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i),
      ).toBeTruthy();
    });
  });

  it("submits form successfully with valid data", async () => {
    mockSignInEmail.mockResolvedValue({ error: null });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /^sign in$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignInEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        callbackURL: expect.stringContaining("/"),
      });
    });

    expect(screen.queryByRole("alert")).toBe(null);
  });

  it("shows server error on sign in failure", async () => {
    mockSignInEmail.mockResolvedValue({
      error: { message: "Invalid credentials" },
    });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /^sign in$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeTruthy();
    });
  });

  it("shows generic error on unexpected failure", async () => {
    mockSignInEmail.mockRejectedValue(new Error("Network error"));

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /^sign in$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/an unexpected error occurred/i)).toBeTruthy();
    });
  });

  it("handles Google sign in", async () => {
    mockSignInSocial.mockResolvedValue({});

    render(<SignInForm />);

    const googleButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });
    await user.click(googleButton);

    await waitFor(() => {
      expect(mockSignInSocial).toHaveBeenCalledWith({
        provider: "google",
        callbackURL: expect.any(String),
      });
    });
  });

  it("shows error on Google sign in failure", async () => {
    mockSignInSocial.mockRejectedValue(new Error("Google auth failed"));

    render(<SignInForm />);

    const googleButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });
    await user.click(googleButton);

    await waitFor(() => {
      expect(screen.getByText(/google sign in failed/i)).toBeTruthy();
    });
  });

  it("disables buttons during loading states", async () => {
    mockSignInEmail.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /^sign in$/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect((submitButton as HTMLButtonElement).disabled).toBe(true);
      expect(screen.getByText(/signing in/i)).toBeTruthy();
    });
  });

  it("disables Google button during loading", async () => {
    mockSignInSocial.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SignInForm />);

    const googleButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });
    await user.click(googleButton);

    await waitFor(() => {
      expect((googleButton as HTMLButtonElement).disabled).toBe(true);
      expect(screen.getByText(/connecting/i)).toBeTruthy();
    });
  });
});
