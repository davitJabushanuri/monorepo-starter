import { page } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Input } from "../input";

describe("Input", () => {
  it("renders input with default props", async () => {
    render(<Input />);

    const input = page.getByRole("textbox");
    await expect.element(input).toBeInTheDocument();
    await expect.element(input).toHaveAttribute("data-slot", "input");
  });

  it("renders input with custom type", async () => {
    render(<Input type="email" />);

    const input = page.getByRole("textbox");
    await expect.element(input).toHaveAttribute("type", "email");
  });

  it("renders input with placeholder", async () => {
    render(<Input placeholder="Enter text" />);

    const input = page.getByPlaceholder("Enter text");
    await expect.element(input).toBeInTheDocument();
  });

  it("renders input with custom className", async () => {
    render(<Input className="custom-input" />);

    const input = page.getByRole("textbox");
    await expect.element(input).toHaveClass(/custom-input/);
  });

  it("handles user input", async () => {
    render(<Input />);

    const input = page.getByRole("textbox");
    await input.fill("Hello World");

    await expect.element(input).toHaveValue("Hello World");
  });

  it("renders disabled input", async () => {
    render(<Input disabled />);

    const input = page.getByRole("textbox");
    await expect.element(input).toBeDisabled();
    await expect.element(input).toHaveClass(/disabled:opacity-50/);
  });

  it("renders input with aria-invalid styling", async () => {
    render(<Input aria-invalid />);

    const input = page.getByRole("textbox");
    await expect.element(input).toHaveAttribute("aria-invalid", "true");
    await expect.element(input).toHaveClass(/aria-invalid:border-destructive/);
  });

  it("passes through additional props", async () => {
    render(<Input data-testid="custom-input" id="input-id" />);

    const input = page.getByTestId("custom-input");
    await expect.element(input).toHaveAttribute("id", "input-id");
  });

  it("renders input with focus styling", async () => {
    render(<Input />);

    const input = page.getByRole("textbox");
    await input.click();

    await expect.element(input).toHaveClass(/focus-visible:border-ring/);
  });
});
