import { capitalizeFirstLetter } from '../../helper/stringHelpers';

describe('capitalizeFirstLetter', () => {
  test('debería capitalizar la primera letra de una palabra', () => {
    const result = capitalizeFirstLetter('juan');
    expect(result).toBe('Juan');
  });

  test('debería devolver una cadena vacía si se pasa una cadena vacía', () => {
    const result = capitalizeFirstLetter('');
    expect(result).toBe('');
  });

  test('debería devolver el valor original si no es una cadena', () => {
    const result = capitalizeFirstLetter(null); // Prueba con null directamente
    expect(result).toBe(null); // Verifica que el resultado sea null
  });

  test('debería capitalizar la primera letra de una palabra cadena aunque tenga mayúsculas y minúsculas', () => {
    const result = capitalizeFirstLetter('JUAN');
    expect(result).toBe('JUAN');
  });

  test('debería devolver la palabra igual si tiene mayúsculas intermedias', () => {
    const result = capitalizeFirstLetter('jUaN');
    expect(result).toBe('JUaN');
  });
});
