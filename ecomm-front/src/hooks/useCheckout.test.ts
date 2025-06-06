import { renderHook, act, waitFor } from "@testing-library/react";
import { createWrapper } from "../tests/reduxTestingUtils";
import {
  mockCheckoutState,
  mockCheckoutStateIncomplete,
  mockOrderConfirmRequest,
} from "../tests/__mocks__/checkoutMockData";
import {
  mockCloseTransactionModal,
  mockStartSummary,
  usePurchaseProcess,
} from "../tests/__mocks__/usePurchaseProcess";
import { useNotifications } from "../tests/__mocks__/useNotifications";
import { useCheckout } from "./useCheckout";
import api from "../tests/__mocks__/api";
import {
  mockCheckFormErrors,
  mockUpdateFormSection,
  useCheckoutForms,
} from "../tests/__mocks__/useCheckoutForms";

// Mockea el módulo real usando la ruta correcta

// Importa los mocks DESPUÉS de configurar jest.mock

// Configuración de mocks globales
jest.mock("../services/api");
jest.mock("./usePurchaseProcess");
jest.mock("./useCheckoutForms");
jest.mock("@toolpad/core/useNotifications");

describe("useCheckout", () => {
  const baseState = {
    checkout: mockCheckoutState,
    product: {
      data: { id: "prod_123", name: "Test Product", unitPrice: 100 },
    },
  };

  const mockCloseCheckoutModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Configuración base de mocks

    (usePurchaseProcess as jest.Mock).mockImplementation(() => ({
      closeTransactionModal: mockCloseTransactionModal,
      startSummary: mockStartSummary,
      closeCheckoutModal: mockCloseCheckoutModal,
    }));

    (useCheckoutForms as jest.Mock).mockImplementation(() => ({
      checkFormErrors: mockCheckFormErrors,
      updateFormSection: mockUpdateFormSection,
      formContextMap: {
        customer: { isValid: true },
        paymentData: { isValid: true },
        address: { isValid: true },
      },
      termsFormContext: { isValid: true },
      areTermsAccepted: true,
      customerFormContext: {},
      paymentFormContext: {},
      shippingFormContext: {},
    }));

    (useNotifications as jest.Mock).mockReturnValue({
      show: jest.fn(),
    });

    api.__mock.reset();
  });
  it("debe inicializar con el estado correcto", () => {
    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(result.current.activeStep).toBe(0);
    expect(result.current.isProcessingSummary).toBe(false);
    expect(result.current.steps.length).toBe(4);
  });

  it("debe avanzar al siguiente paso cuando no hay errores", async () => {
    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useCheckout(), { wrapper });

    await act(async () => {
      await result.current.handleNext();
    });

    await waitFor(() => {
      expect(result.current.activeStep).toBe(1);
      expect(useCheckoutForms).toHaveBeenCalled();
      expect(
        useCheckoutForms.mockImplementation(mockUpdateFormSection)
      ).toHaveBeenCalled();
    });
  });

  it("no debe avanzar si hay errores en el formulario", async () => {
    mockCheckFormErrors.mockResolvedValueOnce(false);
    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useCheckout(), { wrapper });

    await act(async () => {
      await result.current.handleNext();
    });

    expect(result.current.activeStep).toBe(0);
  });

  it("debe retroceder al paso anterior", async () => {
    mockCheckFormErrors.mockResolvedValueOnce(true);
    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useCheckout(), { wrapper });

    await act(async () => {
      await result.current.handleNext(); // Avanzar primero
      result.current.handleBack();
    });

    expect(result.current.activeStep).toBe(0);
  });

  it("debe ejecutar handleCheckout al llegar al último paso", async () => {
    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useCheckout(), { wrapper });

    (api.confirmOrder as jest.Mock).mockResolvedValue(mockOrderConfirmRequest);

    // Avanzar hasta el último paso
    await nextLastStep(result);

    await waitFor(() => {
      expect(result.current.activeStep).toBe(3);
      expect(api.confirmOrder).toHaveBeenCalledWith(mockOrderConfirmRequest);
    });
  });

  it("debe manejar el cálculo de resumen exitoso", async () => {
    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useCheckout(), { wrapper });

    // Avanzar hasta el último paso
    await nextLastStep(result);

    await waitFor(() => {
      expect(api.confirmOrder).toHaveBeenCalled();
      expect(usePurchaseProcess).toHaveBeenCalled();
      expect(
        usePurchaseProcess.mockImplementation(mockCloseCheckoutModal)
      ).toHaveBeenCalled();
      expect(
        usePurchaseProcess.mockImplementation(mockStartSummary)
      ).toHaveBeenCalled();
      expect(result.current.isProcessingSummary).toBe(false);
    });
  });

  it("debe manejar errores en calculateSummary", async () => {
    api.__mock.setConfirmOrderError(new Error("API Error"));

    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useCheckout(), { wrapper });

    await nextLastStep(result);

    expect(useNotifications().show).toHaveBeenCalledWith(
      "Verifique los datos ingresados e intente nuevamente",
      { severity: "error" }
    );
    expect(result.current.isProcessingSummary).toBe(false);
  });

  it("debe mostrar notificación cuando faltan datos en handleCheckout", async () => {
    const wrapper = createWrapper({
      ...baseState,
      checkout: mockCheckoutStateIncomplete,
    });
    const { result } = renderHook(() => useCheckout(), { wrapper });

    await nextLastStep(result);

    expect(useNotifications().show).toHaveBeenCalledWith(
      "Verifique los datos e intente nuevamente",
      { severity: "warning", autoHideDuration: 6000 }
    );
  });

  it("debe cerrar el modal correctamente", () => {
    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useCheckout(), { wrapper });

    act(() => {
      result.current.handleCloseModal();
    });

    expect(result.current.activeStep).toBe(0);
    expect(usePurchaseProcess).toHaveBeenCalled();
    expect(mockCloseCheckoutModal).toHaveBeenCalled();
  });

  it("debe validar términos y condiciones", () => {
    const wrapper = createWrapper({
      ...baseState,
      checkout: {
        ...baseState.checkout,
        termsAccepted: "token_terms",
        privacyAccepted: "",
      },
    });
    const { result } = renderHook(() => useCheckout(), { wrapper });

    expect(result.current.areTermsAccepted).toBe(true);
    expect(result.current.hasAcceptTokens).toBe(false);
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nextLastStep = async (result: any) => {
  await act(async () => {
    await result.current.handleNext();
    await result.current.handleNext();
    await result.current.handleNext();
  });

  await act(async () => {
    await result.current.handleNext();
  });
};
