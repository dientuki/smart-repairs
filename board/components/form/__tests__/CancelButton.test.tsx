import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { CancelButton } from "../CancelButton";
import { ButtonType } from "@/types/enums";

test("renders CancelButton with default props", () => {
  render(<CancelButton>Cancel</CancelButton>);

  const button = screen.getByRole("button", { name: "Cancel" });

  expect(button).toBeInTheDocument();
  expect(button).toHaveClass("w-1/4");
  expect(button).toBeDisabled(); // should be disabled by default if no onClick is passed
});

test("renders CancelButton with custom class and type", () => {
  render(
    <CancelButton className='custom-class' type={ButtonType.Submit}>
      Submit
    </CancelButton>,
  );

  const button = screen.getByRole("button", { name: "Submit" });

  expect(button).toBeInTheDocument();
  expect(button).toHaveClass("custom-class");
  expect(button).toHaveAttribute("type", "submit");
});

test("calls onClick handler when clicked", () => {
  const onClick = vi.fn();
  render(<CancelButton onClick={onClick}>Click me</CancelButton>);

  const button = screen.getByRole("button", { name: "Click me" });
  fireEvent.click(button);

  expect(onClick).toHaveBeenCalledTimes(1);
});

test("button is disabled when onClick is not provided", () => {
  render(<CancelButton>Disabled</CancelButton>);

  const button = screen.getByRole("button", { name: "Disabled" });

  expect(button).toBeDisabled();
});
