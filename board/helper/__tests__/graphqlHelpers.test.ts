import { describe, test, expect, vi, beforeEach } from "vitest";
import {
  graphqlRequest,
  handleGraphQLErrors,
  handlePayloadErrors,
  escapeGraphQLString,
} from "../graphqlHelpers"; // Ajusta la ruta según tu proyecto
import { AbortControllerManager } from "../AbortControllerManager"; // Ajusta la ruta según tu proyecto
import { ApiLayerErrorEnum } from "@/types/enums";
import { ApiLayerError } from "../ApiLayerError"; // Ajusta la ruta según tu proyecto

describe("graphqlRequest", () => {
  // Mockeamos el AbortControllerManager
  const mockController = {
    signal: {} as AbortSignal,
    abort: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock de AbortControllerManager
    vi.spyOn(AbortControllerManager, "getController").mockReturnValue(
      mockController,
    );
  });

  test("should return the correct response when the request is successful", async () => {
    const mockResponse = { data: { someField: "someValue" } };

    // Mockeamos fetch para simular una respuesta exitosa
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockResponse),
      } as Response),
    );

    const query = "{ someField }";
    const result = await graphqlRequest(query);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "/graphql",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: mockController.signal,
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  test("should throw an ApiLayerError in case of a network error that is not AbortError", async () => {
    // Mockeamos fetch para simular un error de red
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    const query = "{ someField }";

    await expect(graphqlRequest(query)).rejects.toThrow(
      new ApiLayerError("toast.error.network", ApiLayerErrorEnum.Network),
    );
  });

  test("should not throw an error when the request is aborted", async () => {
    const abortError = new Error("Aborted");
    abortError.name = "AbortError";

    // Mockeamos fetch para simular un error de tipo AbortError
    global.fetch = vi.fn(() => Promise.reject(abortError));

    const query = "{ someField }";

    // No esperamos que se lance ningún error aquí
    await expect(graphqlRequest(query)).resolves.toBeUndefined();
  });
});

describe("handleGraphQLErrors", () => {
  test("should throw an ApiLayerError for validation errors", () => {
    const errors: GraphQLErrors = [
      {
        message: "Validation error",
        extensions: {
          validation: { field: "name", message: "Name is required" },
        },
      },
    ];

    expect(() => handleGraphQLErrors(errors)).toThrow(ApiLayerError);

    if (errors && errors.length > 0) {
      if (errors[0].extensions && errors[0].extensions.validation) {
        expect(() => handleGraphQLErrors(errors)).toThrow(
          new ApiLayerError(
            "toast.error.validation",
            ApiLayerErrorEnum.Validation,
            errors[0].extensions.validation,
          ),
        );
      }
    }
  });

  test("should throw an ApiLayerError for other GraphQL errors", () => {
    const errors: GraphQLErrors = [
      {
        message: "Some other error",
      },
    ];

    expect(() => handleGraphQLErrors(errors)).toThrow(ApiLayerError);
    expect(() => handleGraphQLErrors(errors)).toThrow(
      new ApiLayerError("toast.error.graphql", ApiLayerErrorEnum.GraphQL),
    );
  });

  test("should not throw an error if there are no errors", () => {
    expect(() => handleGraphQLErrors(undefined)).not.toThrow();
  });

  test("should not throw an error if errors array is empty", () => {
    expect(() => handleGraphQLErrors([])).not.toThrow();
  });
});

describe("handlePayloadErrors", () => {
  test("should throw an ApiLayerError when status is false", () => {
    const errors: PayloadErrors = {
      status: false,
      i18nKey: "toast.error.business",
      code: 400,
      message: "Bad Request",
    };

    expect(() => handlePayloadErrors(errors)).toThrow(
      new ApiLayerError("toast.error.business", ApiLayerErrorEnum.Business),
    );
  });

  test("should not throw an error when status is true", () => {
    const errors: PayloadErrors = {
      status: true,
      i18nKey: "toast.error.business",
      code: 400,
      message: "Bad Request",
    };

    expect(() => handlePayloadErrors(errors)).not.toThrow();
  });
});

describe("escapeGraphQLString", () => {
  test("should escape backslashes", () => {
    const input = "This is a backslash: \\";
    const expected = "This is a backslash: \\\\";
    expect(escapeGraphQLString(input)).toBe(expected);
  });

  test("should escape double quotes", () => {
    const input = 'This is a quote: "';
    const expected = 'This is a quote: \\"';
    expect(escapeGraphQLString(input)).toBe(expected);
  });

  test("should escape new lines", () => {
    const input = "This is a line.\nThis is another line.";
    const expected = "This is a line.\\nThis is another line.";
    expect(escapeGraphQLString(input)).toBe(expected);
  });

  test("should escape multiple special characters", () => {
    const input =
      'This string contains a backslash: \\, a quote: ", and a newline:\n';
    const expected =
      'This string contains a backslash: \\\\, a quote: \\", and a newline:\\n';
    expect(escapeGraphQLString(input)).toBe(expected);
  });

  test("should return an empty string when input is empty", () => {
    expect(escapeGraphQLString("")).toBe("");
  });
});
