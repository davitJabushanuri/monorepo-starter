import { describe, expect, it, mock } from "bun:test";
import { render, screen, userEvent } from "@/tests";
import { Button } from "../button";

describe("Button", () => {
  it("renders with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeTruthy();
  });

  it("renders with custom type", () => {
    render(<Button type="submit">Submit</Button>);

    const button = screen.getByRole("button", { name: /submit/i });
    expect(button.getAttribute("type")).toBe("submit");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>);

    const button = screen.getByRole("button", { name: /custom/i });
    expect(button.classList.contains("custom-class")).toBe(true);
  });

  it("handles click events", async () => {
    const handleClick = mock();
    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await userEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);

    const button = screen.getByRole("button", { name: /disabled/i });
    expect((button as HTMLButtonElement).disabled).toBe(true);
  });

  it("renders as child component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeTruthy();
    expect(link.getAttribute("href")).toBe("/test");
  });
});
