// OrderStatus.test.tsx
import { render, screen } from "@testing-library/react";
import { OrderStatus } from "../OrderStatus";
import { expect, test } from "vitest";

test("renders the correct status", () => {
  const status = "Pending";

  render(<OrderStatus status={status} />);

  expect(screen.getByText(status)).toBeInTheDocument();
});

test("has a style attribute", () => {
  const status = "Completed";
  render(<OrderStatus status={status} />);

  const orderStatusElement = screen.getByText(status);

  expect(orderStatusElement).toBeInTheDocument();
  expect(orderStatusElement).toHaveAttribute("style");
});
