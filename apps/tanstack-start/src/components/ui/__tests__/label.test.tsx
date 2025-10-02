import { page } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Label } from "../label";

describe("Label", () => {
  it("renders label correctly", async () => {
    render(<Label>Label text</Label>);

    const label = page.getByText("Label text");
    await expect.element(label).toBeInTheDocument();
    await expect.element(label).toHaveAttribute("data-slot", "label");
    await expect.element(label).toHaveClass(/font-medium/);
    await expect.element(label).toHaveClass(/text-sm/);
  });

  it("renders label with custom className", async () => {
    render(<Label className="custom-label">Label text</Label>);

    const label = page.getByText("Label text");
    await expect.element(label).toHaveClass(/custom-label/);
  });

  it("renders label with htmlFor attribute", async () => {
    render(<Label htmlFor="input-id">Label text</Label>);

    const label = page.getByText("Label text");
    await expect.element(label).toHaveAttribute("for", "input-id");
  });

  it("passes through additional props", async () => {
    render(
      <Label data-testid="custom-label" id="label-id">
        Label text
      </Label>,
    );

    const label = page.getByTestId("custom-label");
    await expect.element(label).toHaveAttribute("id", "label-id");
  });

  it("renders label with peer-disabled styling", async () => {
    render(<Label className="peer-disabled:opacity-50">Label text</Label>);

    const label = page.getByText("Label text");
    await expect.element(label).toHaveClass(/peer-disabled:opacity-50/);
  });

  it("renders label with group disabled styling", async () => {
    render(
      <Label className="group-data-[disabled=true]:opacity-50">
        Label text
      </Label>,
    );

    const label = page.getByText("Label text");
    await expect
      .element(label)
      .toHaveClass(/group-data-\[disabled=true\]:opacity-50/);
  });
});
