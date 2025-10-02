import { page } from "@vitest/browser/context";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
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
  it("renders card with all components", async () => {
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

    await expect.element(page.getByText("Card Title")).toBeInTheDocument();
    await expect
      .element(page.getByText("Card description"))
      .toBeInTheDocument();
    await expect.element(page.getByText("Action")).toBeInTheDocument();
    await expect.element(page.getByText("Card content")).toBeInTheDocument();
    await expect.element(page.getByText("Card footer")).toBeInTheDocument();
  });

  it("renders card with custom className", async () => {
    render(
      <Card className="custom-card" data-testid="test-card">
        <CardContent>Content</CardContent>
      </Card>,
    );

    const card = page.getByTestId("test-card");
    await expect.element(card).toHaveClass(/custom-card/);
  });

  it("renders card header with proper styling", async () => {
    render(
      <Card>
        <CardHeader data-testid="card-header">
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>,
    );

    const header = page.getByTestId("card-header");
    await expect.element(header).toHaveClass(/px-6/);
  });

  it("renders card title with proper styling", async () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>,
    );

    const title = page.getByText("Title");
    await expect.element(title).toHaveClass(/font-semibold/);
  });

  it("renders card description with proper styling", async () => {
    render(
      <Card>
        <CardHeader>
          <CardDescription>Description</CardDescription>
        </CardHeader>
      </Card>,
    );

    const description = page.getByText("Description");
    await expect.element(description).toHaveClass(/text-muted-foreground/);
    await expect.element(description).toHaveClass(/text-sm/);
  });

  it("renders card action with proper styling", async () => {
    render(
      <Card>
        <CardHeader>
          <CardAction>Action</CardAction>
        </CardHeader>
      </Card>,
    );

    const action = page.getByText("Action");
    await expect.element(action).toHaveClass(/col-start-2/);
    await expect.element(action).toHaveClass(/row-span-2/);
  });

  it("renders card content with proper styling", async () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>,
    );

    const content = page.getByText("Content");
    await expect.element(content).toHaveClass(/px-6/);
  });

  it("renders card footer with proper styling", async () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    const footer = page.getByText("Footer");
    await expect.element(footer).toHaveClass(/px-6/);
  });

  it("passes through additional props", async () => {
    render(
      <Card data-testid="custom-card">
        <CardContent>Content</CardContent>
      </Card>,
    );

    const card = page.getByTestId("custom-card");
    await expect.element(card).toBeInTheDocument();
  });
});
