import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Button } from "../button";

describe("Button", () => {
  it("renders with default props", async () => {
    const screen = render(<Button>Click me</Button>);

    await expect
      .element(screen.getByRole("button", { name: /click me/i }))
      .toBeInTheDocument();
  });

  it("renders with custom type", async () => {
    const screen = render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole("button", { name: /submit/i });
    await expect.element(button).toHaveAttribute("type", "submit");
  });

  it("applies custom className", async () => {
    const screen = render(<Button className="custom-class">Custom</Button>);

    await expect
      .element(screen.getByRole("button", { name: /custom/i }))
      .toHaveClass("custom-class");
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const screen = render(<Button onClick={handleClick}>Click me</Button>);

    await screen.getByRole("button", { name: /click me/i }).click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", async () => {
    const screen = render(<Button disabled>Disabled</Button>);

    await expect
      .element(screen.getByRole("button", { name: /disabled/i }))
      .toBeDisabled();
  });

  it("renders as child component when asChild is true", async () => {
    const screen = render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: /link button/i });
    await expect.element(link).toBeInTheDocument();
    await expect.element(link).toHaveAttribute("href", "/test");
  });
});
