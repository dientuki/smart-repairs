import { render, screen } from "@testing-library/react";
import { OrderUsers } from "../OrderUsers";
import { useOrderStore, useUserStore } from "@/store";
import { useTranslation } from "react-i18next";
import { beforeEach, vi, test, expect, Mock } from "vitest";
import { PackageType } from "@/types/enums";

// Mock de los hooks y dependencias
vi.mock("@/store", () => ({
  useOrderStore: vi.fn(),
  useUserStore: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: vi.fn(),
}));

vi.mock("@/helper/componentsHelpers", () => ({
  dynamicStyles: vi.fn(),
}));

// Datos simulados
const mockOrder = {
  assignee: "John Doe",
};

const mockUser = {
  package: PackageType.Full,
};

const mockTranslation = (key: string) => key;

// Configuración antes de cada prueba
beforeEach(() => {
  (useOrderStore as unknown as Mock).mockReturnValue({ order: mockOrder });
  (useUserStore as unknown as Mock).mockReturnValue({ user: mockUser });
  (useTranslation as Mock).mockReturnValue({ t: mockTranslation });
});

test("renders assigned user correctly", () => {
  render(<OrderUsers />);

  // Verificar que los textos están presentes
  expect(screen.getByText("order.assigned_to")).toBeInTheDocument();
  expect(screen.getByText("John Doe")).toBeInTheDocument();
});

test("renders unassigned state when no assignee", () => {
  // Actualizar el mock para simular que no hay asignado
  (useOrderStore as unknown as Mock).mockReturnValue({ order: { ...mockOrder, assignee: null } });

  render(<OrderUsers />);

  // Verificar el estado no asignado
  expect(screen.getByText("order.unassigned")).toBeInTheDocument();
});

test("does not render when user package is basic", () => {
  // Simular que el user tiene un paquete Basic
  (useUserStore as unknown as Mock).mockReturnValue({ user: { package: PackageType.Basic } });

  render(<OrderUsers />);

  // Verificar que no se renderiza nada
  expect(screen.queryByText("order.assigned_to")).not.toBeInTheDocument();
});
