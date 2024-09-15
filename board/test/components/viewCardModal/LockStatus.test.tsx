// LockStatus.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LockStatus } from "@/components/viewCardModal";

// Mock del hook useTranslation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Simula la función de traducción
  }),
}));

describe('LockStatus', () => {
  test('debería mostrar el icono y el texto correcto cuando el estado es verdadero', () => {
    render(<LockStatus toggleVisibility={() => {}} status={true} />);

    expect(screen.getByText('private')).toBeInTheDocument();
    expect(screen.getByTestId('lock-open-icon')).toBeInTheDocument();
  });

  test('debería mostrar el icono y el texto correcto cuando el estado es falso', () => {
    render(<LockStatus toggleVisibility={() => {}} status={false} />);

    expect(screen.getByText('public')).toBeInTheDocument();
    expect(screen.getByTestId('lock-closed-icon')).toBeInTheDocument();
  });

  test('debería llamar a toggleVisibility cuando se hace clic en el componente', () => {
    const mockToggleVisibility = jest.fn();
    render(<LockStatus toggleVisibility={mockToggleVisibility} status={true} />);

    fireEvent.click(screen.getByRole('button'));
    expect(mockToggleVisibility).toHaveBeenCalledTimes(1);
  });
});