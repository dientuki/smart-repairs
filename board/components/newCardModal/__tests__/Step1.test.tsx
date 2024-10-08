import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, Mock } from "vitest";
import { Step1 } from "../Step1";
import { useCustomerStore, useOrderStore } from "@/store";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const mockUpsertCustomer = vi.fn();
const mockSetCreateOrderSelectedData = vi.fn();
const mockClearCreateOrderSelectedData = vi.fn();

// Mock de dependencias
vi.mock("@/store", () => ({
  useCustomerStore: vi.fn(),
  useOrderStore: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

beforeEach(() => {
  // Reset mocks
  (useCustomerStore as unknown as Mock).mockReturnValue({
    upsertCustomer: mockUpsertCustomer,
  });
  (useOrderStore as unknown as Mock).mockReturnValue({
    setCreateOrderSelectedData: mockSetCreateOrderSelectedData,
    clearCreateOrderSelectedData: mockClearCreateOrderSelectedData,
  });
  mockUpsertCustomer.mockReset();
  mockSetCreateOrderSelectedData.mockReset();
  mockClearCreateOrderSelectedData.mockReset();
});

test("should render the form with correct fields", () => {
  render(<Step1 nextStep={vi.fn()} customers={[]} onNext={vi.fn()} />);

  expect(screen.getByLabelText("field.firstname")).toBeInTheDocument();
  expect(screen.getByLabelText("field.lastname")).toBeInTheDocument();
  expect(screen.getByLabelText("field.email")).toBeInTheDocument();
  expect(screen.getByLabelText("field.phone")).toBeInTheDocument();
});