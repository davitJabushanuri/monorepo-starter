import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import { Label } from "../label";

describe("Label", () => {
  it("renders label correctly", () => {
    render(<Label>Label text</Label>);

    const label = screen.getByText("Label text");
    expect(label).toBeTruthy();
    expect(label.getAttribute("data-slot")).toBe("label");
    expect(label.classList.contains("font-medium")).toBe(true);
    expect(label.classList.contains("text-sm")).toBe(true);
  });

  it("renders label with custom className", () => {
    render(<Label className="custom-label">Label text</Label>);

    const label = screen.getByText("Label text");
    expect(label.classList.contains("custom-label")).toBe(true);
  });

  it("renders label with htmlFor attribute", () => {
    render(<Label htmlFor="input-id">Label text</Label>);

    const label = screen.getByText("Label text");
    expect(label.getAttribute("for")).toBe("input-id");
  });

  it("passes through additional props", () => {
    render(
      <Label data-testid="custom-label" id="label-id">
        Label text
      </Label>,
    );

    const label = screen.getByTestId("custom-label");
    expect(label.getAttribute("id")).toBe("label-id");
  });

  it("renders label with peer-disabled styling", () => {
    render(<Label className="peer-disabled:opacity-50">Label text</Label>);

    const label = screen.getByText("Label text");
    expect(label.classList.contains("peer-disabled:opacity-50")).toBe(true);
  });

  it("renders label with group disabled styling", () => {
    render(
      <Label className="group-data-[disabled=true]:opacity-50">
        Label text
      </Label>,
    );

    const label = screen.getByText("Label text");
    expect(
      label.classList.contains("group-data-[disabled=true]:opacity-50"),
    ).toBe(true);
  });
});
