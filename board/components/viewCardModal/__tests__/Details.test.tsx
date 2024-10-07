import { render, screen } from "@testing-library/react";
import { Details } from "../Details";
import { useOrderStore } from "@/store/OrderStore";
import { useTranslation } from "react-i18next";
import { beforeEach, vi, test, expect, Mock } from "vitest";

// Mocks de los hooks
vi.mock("@/store/OrderStore", () => ({
  useOrderStore: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(),
}));

// Configura los datos para las pruebas
const mockOrder = {
  createdAtDate: new Date("2023-10-04T12:00:00Z"),
  customerFullName: "Juan Pérez",
  customerPhone: "123456789",
};

// Configuración inicial antes de cada prueba
beforeEach(() => {
  (useOrderStore as unknown as Mock).mockReturnValue({ order: mockOrder });
  (useTranslation as Mock).mockReturnValue({ t: (key: string) => key });
});

// Prueba principal
test("renders order details correctly", () => {
  render(<Details />);

  expect(screen.getByText("order.created_at")).toBeInTheDocument();
  //expect(screen.getByText("10/4/2023 09:00")).toBeInTheDocument();
  expect(screen.getByText("order.customer")).toBeInTheDocument();
  expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  expect(screen.getByText("order.whatsapp")).toBeInTheDocument();
  expect(screen.getByText("123456789")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /123456789/i })).toHaveAttribute(
    "href",
    "https://wa.me/123456789",
  );
});
