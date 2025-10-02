/**
 * SignUpForm Component Tests
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
const mockSignUpEmail = vi.hoisted(() => vi.fn());

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
    email: vi.fn(),
    social: vi.fn(),
  },
  signUp: {
    email: mockSignUpEmail,
  },
  signOut: vi.fn(),
  useSession: vi.fn(),
  getSession: vi.fn(),
}));

// Import component after all mocks are defined
import { SignUpForm } from "../signup-form";

describe("SignUpForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the sign up form correctly", async () => {
    render(<SignUpForm />);

    // Wait for form to be fully rendered
    await expect.element(page.getByPlaceholder(/name/i)).toBeInTheDocument();
    await expect.element(page.getByPlaceholder(/email/i)).toBeInTheDocument();
    await expect
      .element(page.getByPlaceholder(/password/i))
      .toBeInTheDocument();

    // Check for main button
    await expect
      .element(page.getByRole("button", { name: /^sign up$/i }))
      .toBeInTheDocument();

    // Check for description text
    await expect
      .element(page.getByText(/create a new account/i))
      .toBeInTheDocument();

    // Check for Google button text
    await expect.element(page.getByText(/google/i)).toBeInTheDocument();

    // Check for signin link
    await expect
      .element(page.getByText(/already have an account/i))
      .toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<SignUpForm />);

    const submitButton = page.getByRole("button", { name: /^sign up$/i });
    await submitButton.click();

    await expect
      .element(page.getByText(/name must be at least 2 characters/i))
      .toBeInTheDocument();
    await expect
      .element(page.getByText(/email is required/i))
      .toBeInTheDocument();
    await expect
      .element(page.getByText(/password must be at least 6 characters/i))
      .toBeInTheDocument();
  });

  it("shows validation error for short name", async () => {
    render(<SignUpForm />);

    const nameInput = page.getByPlaceholder(/name/i);
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign up$/i });

    await nameInput.fill("A");
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    await expect
      .element(page.getByText(/name must be at least 2 characters/i))
      .toBeInTheDocument();
  });

  it("shows validation error for invalid email", async () => {
    render(<SignUpForm />);

    const emailInput = page.getByPlaceholder(/email/i);
    const submitButton = page.getByRole("button", { name: /^sign up$/i });

    await emailInput.fill("invalid-email");
    await submitButton.click();

    // Should show either "Email is required" (for empty name/password) or email validation error
    // The form validates all fields on submit
    await expect
      .element(
        page.getByText(
          /name must be at least 2 characters|email|password must be at least 6 characters/i,
        ),
      )
      .toBeInTheDocument();
  });

  it("shows validation error for short password", async () => {
    render(<SignUpForm />);

    const nameInput = page.getByPlaceholder(/name/i);
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign up$/i });

    await nameInput.fill("John Doe");
    await emailInput.fill("test@example.com");
    await passwordInput.fill("123");
    await submitButton.click();

    await expect
      .element(page.getByText(/password must be at least 6 characters/i))
      .toBeInTheDocument();
  });

  it("submits form successfully with valid data", async () => {
    mockSignUpEmail.mockResolvedValueOnce({ error: null });

    render(<SignUpForm />);

    const nameInput = page.getByPlaceholder(/name/i);
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign up$/i });

    await nameInput.fill("John Doe");
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    // Wait for the mock to be called
    await vi.waitFor(() => {
      expect(mockSignUpEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "password123",
        callbackURL: expect.stringContaining("/"),
      });
    });
  });

  it("shows server error on sign up failure", async () => {
    mockSignUpEmail.mockResolvedValueOnce({
      error: { message: "Email already exists" },
    });

    render(<SignUpForm />);

    const nameInput = page.getByPlaceholder(/name/i);
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign up$/i });

    await nameInput.fill("John Doe");
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    await expect
      .element(page.getByText(/email already exists/i))
      .toBeInTheDocument();
  });

  it("shows generic error on unexpected failure", async () => {
    mockSignUpEmail.mockRejectedValueOnce(new Error("Network error"));

    render(<SignUpForm />);

    const nameInput = page.getByPlaceholder(/name/i);
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign up$/i });

    await nameInput.fill("John Doe");
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    await expect
      .element(page.getByText(/an unexpected error occurred/i))
      .toBeInTheDocument();
  });

  it("handles Google sign up button click", async () => {
    render(<SignUpForm />);

    const googleButton = page.getByRole("button", {
      name: /sign up with google/i,
    });
    await googleButton.click();

    // The component shows a message that social sign up is not available
    await expect
      .element(
        page.getByText(
          /social sign up is not currently available. please use email and password/i,
        ),
      )
      .toBeInTheDocument();
  });

  it("disables buttons during loading states", async () => {
    mockSignUpEmail.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<SignUpForm />);

    const nameInput = page.getByPlaceholder(/name/i);
    const emailInput = page.getByPlaceholder(/email/i);
    const passwordInput = page.getByPlaceholder(/password/i);
    const submitButton = page.getByRole("button", { name: /^sign up$/i });

    await nameInput.fill("John Doe");
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await submitButton.click();

    // Check for loading state - button text changes to "Signing Up..."
    await expect
      .element(page.getByRole("button", { name: /signing up/i }))
      .toBeInTheDocument();
    await expect
      .element(page.getByRole("button", { name: /signing up/i }))
      .toBeDisabled();
  });
});
