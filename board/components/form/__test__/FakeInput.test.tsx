import { render, screen } from '@testing-library/react'
import { FakeInput } from '../FakeInput'; // Ajusta la ruta según tu estructura

describe('FakeInput', () => {
  test('renders with value and without icon', () => {
    render(<FakeInput value="Test value" />);

    const inputValue = screen.getByText('Test value');
    expect(inputValue).toBeInTheDocument();
  });

  test('renders with icon', () => {
    render(
      <FakeInput value="Test value" icon={<span data-testid="icon">🔍</span>} />
    );

    const inputValue = screen.getByText('Test value');
    const icon = screen.getByTestId('icon');

    expect(inputValue).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  test('renders with custom className', () => {
    render(<FakeInput value="Test value" className="custom-class" />);

    const inputContainer = screen.getByTestId('main'); // Obtiene el contenedor del texto
    expect(inputContainer).toHaveClass('custom-class');
  });
});
