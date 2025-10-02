/**
 * SignInForm Component Tests
 *
 * Following Vitest Browser Mode best practices:
 * - Mock only what's necessary (external APIs)
 * - Let UI components render naturally
 * - Use vi.hoisted() for functions that need to be accessed in tests
 */

import { page } from "@vitest/browser/context";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "@/tests/setup/setup-test-env";

// Hoisted mock functions for auth client
const mockSignInEmail = vi.hoisted(() => vi.fn());
const mockSignInSocial = vi.hoisted(() => vi.fn());

// Mock TanStack Router Link to avoid router context issues
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    children,
    className,
  }: {
    to: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

// Only mock the auth client - let everything else render naturally
vi.mock("@/features/auth/lib/auth-client", () => ({
  signIn: {
    email: mockSignInEmail,
    social: mockSignInSocial,
  },
  signUp: {
    email: vi.fn(),
  },
  signOut: vi.fn(),
  useSession: vi.fn(),
  getSession: vi.fn(),
}));

// Import component after all mocks are defined
import { SignInForm } from "../signin-form";

describe("SignInForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the sign in form correctly", async () => {
    render(<SignInForm />);

    // Wait for form to be fully rendered
    await expect.element(page.getByPlaceholder(/email/i)).toBeInTheDocument();
    await expect
      .element(page.getByPlaceholder(/password/i))
      .toBeInTheDocument();

    // Check for main button
    await expect
      .element(page.getByRole("button", { name: /^sign in$/i }))
      .toBeInTheDocument();

    // Check for description text
    await expect
      .element(page.getByText(/enter your credentials/i))
      .toBeInTheDocument();

    // Check for Google button text
    await expect.element(page.getByText(/google/i)).toBeInTheDocument();

    // Check for signup link
    await expect
      .element(page.getByText(/don't have an account/i))
      .toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<SignInForm />);

    const submitButton = page.getByRole("button", { name: /^sign in$/i });
    await submitButton.click();

    await expect
      .element(page.getByText(/email is required/i))
      .toBeInTheDocument();
    await expect
      .element(page.getByText(/password must be at least 6 characters/i))
      .toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    render(<SignInForm />);

    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign in$/i });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("123");
    await submitButton.click();

    await expect
      .element(page.getByText(/password must be at least 6 characters/i))
      .toBeInTheDocument();
  });

  it("submits form successfully with valid data", async () => {
    mockSignInEmail.mockResolvedValueOnce({ error: null });

    render(<SignInForm />);

    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign in$/i });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    // Wait for the mock to be called
    await vi.waitFor(() => {
      expect(mockSignInEmail).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
        callbackURL: expect.stringContaining("/"),
      });
    });
  });

  it("shows server error on sign in failure", async () => {
    mockSignInEmail.mockResolvedValueOnce({
      error: { message: "Invalid credentials" },
    });

    render(<SignInForm />);

    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign in$/i });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    await expect
      .element(page.getByText(/invalid credentials/i))
      .toBeInTheDocument();
  });

  it("shows generic error on unexpected failure", async () => {
    mockSignInEmail.mockRejectedValueOnce(new Error("Network error"));

    render(<SignInForm />);

    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign in$/i });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    await expect
      .element(page.getByText(/an unexpected error occurred/i))
      .toBeInTheDocument();
  });

  it("handles Google sign in", async () => {
    mockSignInSocial.mockResolvedValueOnce({});

    render(<SignInForm />);

    const googleButton = page.getByRole("button", {
      name: /sign in with google/i,
    });
    await googleButton.click();

    await vi.waitFor(() => {
      expect(mockSignInSocial).toHaveBeenCalledWith({
        provider: "google",
        callbackURL: expect.any(String),
      });
    });
  });

  it("shows error on Google sign in failure", async () => {
    mockSignInSocial.mockRejectedValueOnce(new Error("Google auth failed"));

    render(<SignInForm />);

    const googleButton = page.getByRole("button", {
      name: /sign in with google/i,
    });
    await googleButton.click();

    await expect
      .element(page.getByText(/google sign in failed/i))
      .toBeInTheDocument();
  });

  it("disables buttons during loading states", async () => {
    mockSignInEmail.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SignInForm />);

    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign in$/i });

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    // Check for loading state - button text changes to "Signing In..."
    await expect
      .element(page.getByRole("button", { name: /signing in/i }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: /signing in/i }))
      .toBeDisabled();
  });

  it("disables Google button during loading", async () => {
    mockSignInSocial.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SignInForm />);

    // Find and click Google button by text since it contains SVG
    const googleButton = page.getByText(/sign in with google/i);
    await googleButton.click();

    // Check for loading state - "Connecting..." text should appear
    await expect.element(page.getByText(/Connecting/i)).toBeInTheDocument();

    // Also verify the button is disabled
    await expect
      .element(page.getByRole("button", { name: /connecting/i }))
      .toBeDisabled();
  });
});
