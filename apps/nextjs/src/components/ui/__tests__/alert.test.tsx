import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Alert, AlertDescription, AlertTitle } from "../alert";

describe("Alert", () => {
  it("renders default alert correctly", () => {
    render(
      <Alert>
        <AlertTitle>Alert Title</AlertTitle>
        <AlertDescription>Alert description text</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeTruthy();
    expect(alert.classList.contains("bg-card")).toBe(true);
    expect(alert.classList.contains("text-card-foreground")).toBe(true);

    expect(screen.getByText("Alert Title")).toBeTruthy();
    expect(screen.getByText("Alert description text")).toBeTruthy();
  });

  it("renders destructive alert correctly", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Error Title</AlertTitle>
        <AlertDescription>Error description text</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeTruthy();
    expect(alert.classList.contains("bg-card")).toBe(true);
    expect(alert.classList.contains("text-destructive")).toBe(true);

    expect(screen.getByText("Error Title")).toBeTruthy();
    expect(screen.getByText("Error description text")).toBeTruthy();
  });

  it("renders alert with custom className", () => {
    render(
      <Alert className="custom-alert">
        <AlertDescription>Custom alert content</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert.classList.contains("custom-alert")).toBe(true);
  });

  it("renders alert without title", () => {
    render(
      <Alert>
        <AlertDescription>Alert without title</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeTruthy();
    expect(screen.getByText("Alert without title")).toBeTruthy();
  });

  it("renders alert without description", () => {
    render(
      <Alert>
        <AlertTitle>Title Only</AlertTitle>
      </Alert>,
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeTruthy();
    expect(screen.getByText("Title Only")).toBeTruthy();
  });

  it("passes through additional props", () => {
    render(
      <Alert data-testid="custom-alert" aria-label="Custom alert">
        <AlertDescription>Content</AlertDescription>
      </Alert>,
    );

    const alert = screen.getByTestId("custom-alert");
    expect(alert.getAttribute("aria-label")).toBe("Custom alert");
  });
});
