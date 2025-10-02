import { page } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Alert, AlertDescription, AlertTitle } from "../alert";

describe("Alert", () => {
  it("renders default alert correctly", async () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>,
    );

    const alert = page.getByRole("alert");
    await expect.element(alert).toBeInTheDocument();
    await expect.element(alert).toHaveClass("bg-card");
    await expect.element(alert).toHaveClass("text-card-foreground");

    await expect.element(page.getByText("Alert Title")).toBeInTheDocument();
    await expect
      .element(page.getByText("Alert description text"))
      .toBeInTheDocument();
  });

  it("renders destructive alert correctly", async () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error Title</AlertTitle>
        <AlertDescription>Error description text</AlertDescription>
      </Alert>,
    );

    const alert = page.getByRole("alert");
    await expect.element(alert).toBeInTheDocument();
    await expect.element(alert).toHaveClass("bg-card");
    await expect.element(alert).toHaveClass("text-destructive");

    await expect.element(page.getByText("Error Title")).toBeInTheDocument();
    await expect
      .element(page.getByText("Error description text"))
      .toBeInTheDocument();
  });

  it("renders alert with custom className", async () => {
    render(
      <Alert className="custom-alert">
        <AlertDescription>Custom alert content</AlertDescription>
      </Alert>,
    );

    const alert = page.getByRole("alert");
    await expect.element(alert).toHaveClass("custom-alert");
  });

  it("renders alert without title", async () => {
    render(
      <Alert>
        <AlertDescription>Alert without title</AlertDescription>
      </Alert>,
    );

    const alert = page.getByRole("alert");
    await expect.element(alert).toBeInTheDocument();
    await expect
      .element(page.getByText("Alert without title"))
      .toBeInTheDocument();
  });

  it("renders alert without description", async () => {
    render(
      <Alert>
        <AlertTitle>Title Only</AlertTitle>
      </Alert>,
    );

    const alert = page.getByRole("alert");
    await expect.element(alert).toBeInTheDocument();
    await expect.element(page.getByText("Title Only")).toBeInTheDocument();
  });

  it("passes through additional props", async () => {
    render(
      <Alert data-testid="custom-alert" aria-label="Custom alert">
        <AlertDescription>Content</AlertDescription>
      </Alert>,
    );

    const alert = page.getByTestId("custom-alert");
    await expect.element(alert).toHaveAttribute("aria-label", "Custom alert");
  });
});
