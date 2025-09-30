import { describe, expect, it } from "bun:test";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";

describe("Card", () => {
  it("renders card with all components", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Card content</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText("Card Title")).toBeTruthy();
    expect(screen.getByText("Card description")).toBeTruthy();
    expect(screen.getByText("Action")).toBeTruthy();
    expect(screen.getByText("Card content")).toBeTruthy();
    expect(screen.getByText("Card footer")).toBeTruthy();
  });

  it("renders card with custom className", () => {
    render(
      <Card className="custom-card">
        <CardContent>Content</CardContent>
      </Card>,
    );

    const card = screen.getByText("Content").closest('[data-slot="card"]');
    expect(card?.classList.contains("custom-card")).toBe(true);
  });

  it("renders card header with proper styling", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>,
    );

    const header = screen
      .getByText("Title")
      .closest('[data-slot="card-header"]');
    expect(header?.classList.contains("px-6")).toBe(true);
  });

  it("renders card title with proper styling", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>,
    );

    const title = screen.getByText("Title");
    expect(title.classList.contains("font-semibold")).toBe(true);
  });

  it("renders card description with proper styling", () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>,
    );

    const description = screen.getByText("Description");
    expect(description.classList.contains("text-muted-foreground")).toBe(true);
    expect(description.classList.contains("text-sm")).toBe(true);
  });

  it("renders card action with proper styling", () => {
    render(
      <Card>
        <CardHeader>
          <CardAction>Action</CardAction>
        </CardHeader>
      </Card>,
    );

    const action = screen.getByText("Action");
    expect(action.classList.contains("col-start-2")).toBe(true);
    expect(action.classList.contains("row-span-2")).toBe(true);
  });

  it("renders card content with proper styling", () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>,
    );

    const content = screen.getByText("Content");
    expect(content.classList.contains("px-6")).toBe(true);
  });

  it("renders card footer with proper styling", () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    const footer = screen.getByText("Footer");
    expect(footer.classList.contains("px-6")).toBe(true);
  });

  it("passes through additional props", () => {
    render(
      <Card data-testid="custom-card">
        <CardContent>Content</CardContent>
      </Card>,
    );

    const card = screen.getByTestId("custom-card");
    expect(card).toBeTruthy();
  });
});
