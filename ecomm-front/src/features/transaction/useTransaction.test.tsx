import { renderHook, act, waitFor } from "@testing-library/react";
import {
  setupStore,
  createWrapper,
  type DeepPartial,
} from "../../tests/reduxTestingUtils";
import { type RootState } from "../../store";
import api from "../../tests/__mocks__/api";
import { useNotifications } from "../../tests/__mocks__/useNotifications";
// import { usePurchaseProcess } from "../../tests/__mocks__/usePurchaseProcess";
import { useTransaction } from "../../hooks";

// Tipos mockeados basados en tus interfaces
const mockProduct: RootState["product"]["data"] = {
  id: "prod_123",
  slug: "test-product",
  name: "Test Product",
  description: "Test description",
  stock: 10,
  unitPrice: 100,
  images: ["image1.jpg"],
};

const mockCustomer: RootState["checkout"]["customer"] = {
  fullname: "John Doe",
  email: "john@example.com",
  personalIdType: "CC",
  personalIdNumber: "123456789",
};

const mockPaymentData: RootState["checkout"]["paymentData"] = {
  cardNumber: "4111111111111111",
  cvc: "123",
  expMonth: "12",
  expYear: "25",
  installments: 3,
  cardHolder: "John Doe",
};

const mockSummary: RootState["summary"]["data"] = {
  baseAmount: 100,
  deliveryFee: 10,
  // ... otros campos según OrderConfirmationResponse
} as unknown as RootState["summary"]["data"];

const mockTransaction: RootState["transaction"]["data"] = {
  transactionId: "txn_123",
  orderId: "order_456",
  status: "PENDING",
  amount: 110,
  createdAt: "2023-10-01T12:00:00Z",
  updatedAt: "2023-10-01T12:05:00Z",
  customerName: "John Doe",
  productName: "Test Product",
};

describe("useTransaction", () => {
  jest.mock("../../tests/__mocks__/api.ts");
  jest.mock("@toolpad/core/useNotifications");
  jest.mock("../../hooks/usePurchaseProcess");

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // Estado base para la mayoría de las pruebas
  const baseState: DeepPartial<RootState> = {
    order: {
      data: {
        id: "order_123",
        status: "CREATED",
        totalAmount: 6000,
        createdAt: new Date().toISOString(),
        product: {
          id: "prod_123",
          name: "Test Product",
          images: ["image1.jpg"],
        },
        quantity: 1,
        customer: {
          fullname: "John Doe",
          email: "john@example.com",
          personalIdType: "CC",
          personalIdNumber: "123456789",
        },
        address: {
          country: "ES",
          addressLine1: "Test address",
          addressLine2: "Test address 2",
          region: "Test region",
          city: "Test city",
          postalCode: "12345",
          contactName: "Test contact name",
          phoneNumber: "123456789",
        },
        unitPrice: 5000,
        baseAmount: 5000,
        deliveryFee: 1000,
      },
      loaded: true,
      error: null,
    },
    summary: {
      data: mockSummary,
    },
    transaction: {
      data: null,
      loading: false,
      polling: false,
      error: null,
      loaded: false,
    },
    checkout: {
      paymentData: mockPaymentData,
      termsAccepted: "token_terms",
      privacyAccepted: "token_privacy",
      customer: mockCustomer,
      address: null,
      quantity: 1,
      productId: "prod_123",
      _persist: {
        version: 1,
        rehydrated: true,
      },
    },
    purchaseStageState: {
      stage: "",
      isCheckoutModalOpen: false,
      isSummaryOpen: false,
      transactionModalMessage: "creating-order",
    },
    product: {
      data: mockProduct,
      loading: false,
      error: null,
    },
  };

  it("no inicia transacción si ya está aprobada", async () => {
    const state = {
      ...baseState,
      transaction: {
        ...baseState.transaction,
        data: {
          ...mockTransaction,
          status: "APPROVED" as
            | "PENDING"
            | "APPROVED"
            | "REJECTED"
            | "DECLINED",
        },
        loaded: baseState.transaction?.loaded as boolean,
        error: baseState.transaction?.error as string,
        loading: baseState.transaction?.loading as boolean,
        polling: baseState.transaction?.polling as boolean,
      },
    };

    const wrapper = createWrapper(state);
    renderHook(() => useTransaction(), { wrapper });

    expect(api.createTransaction).not.toHaveBeenCalled();
  });

  it("inicia polling cuando la transacción está pendiente y ya fue cargada una transacción", async () => {
    const state = {
      ...baseState,
      transaction: {
        ...baseState.transaction,
        data: {
          ...mockTransaction,
          status: "PENDING" as "PENDING" | "APPROVED" | "REJECTED" | "DECLINED",
        },
        loaded: true,
        error: baseState.transaction?.error as string,
        loading: baseState.transaction?.loading as boolean,
        polling: baseState.transaction?.polling as boolean,
      },
    };

    const mockPollingResponse = {
      ...mockTransaction,
      status: "APPROVED",
    };

    (api.getTransaction as jest.Mock).mockResolvedValue(mockPollingResponse);

    const store = setupStore(state);

    console.log("Estado inicial:", store.getState().transaction);

    const wrapper = createWrapper(state);
    const { result } = renderHook(
      () => {
        const hook = useTransaction();
        return { ...hook, store };
      },
      { wrapper }
    );

    await waitFor(() => {
        expect(result.current.transactionModalMessage).toBe("transaction-approved");
        expect(api.getTransaction).toHaveBeenCalled();
    });
  });

  it("muestra notificación y abre checkout cuando faltan datos de pago", async () => {
  // Mockear los hooks necesarios
//   const mockShow = jest.fn();
  
  const state = {
    ...baseState,
    checkout: {
      ...baseState.checkout,
      paymentData: null,
    },
  };

//   const wrapper = createWrapper(state);
//   const { result } = renderHook(() => useTransaction(), { wrapper });

//   console.log({result});

  const mockShow = jest.fn();
  (useNotifications as jest.Mock).mockReturnValue({
    show: mockShow
  });
  
  
  const store = setupStore(state);

    console.log("Estado inicial:", store.getState().transaction);

    const wrapper = createWrapper(state);
    const { result } = renderHook(
      () => {
        const hook = useTransaction();
        return { ...hook, store };
      },
      { wrapper }
    );
    
    console.log(result.current.store.getState().purchaseStageState)

    await waitFor(() => {
        expect(mockShow).toHaveBeenCalledWith("Confirme los datos de pago para continuar", {
        severity: "warning",
        autoHideDuration: 6000,
      });
    });

  

});

  it("ejecuta reintento después de 5 segundos", async () => {
    const state = {
      ...baseState,
      checkout: {
        ...baseState.checkout,
        paymentData: null,
      },
      purchaseStageState: {
        ...baseState.purchaseStageState,
        transactionModalMessage: "creating-transaction" as
          | "creating-order"
          | "creating-transaction"
          | "transaction-pending"
          | "order-error"
          | "transaction-error"
          | "transaction-approved"
          | "transaction-rejected"
          | "",
      },
    };

    const wrapper = createWrapper(state);
    renderHook(() => useTransaction(), { wrapper });

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    await waitFor(() => {
      expect(api.createTransaction).toHaveBeenCalled();
    });
  });

  it("crea transacción correctamente con datos válidos", async () => {
    const wrapper = createWrapper(baseState);
    renderHook(() => useTransaction(), { wrapper });

    await waitFor(() => {
      expect(api.createTransaction).toHaveBeenCalledWith({
        orderId: "order_123",
        totalAmount: 110,
        payment: {
          ...mockPaymentData,
          acceptanceToken: "token_terms",
          acceptPersonalAuth: "token_privacy",
        },
      });
    });
  });

  it("maneja finish correctamente", async () => {
    const wrapper = createWrapper(baseState);
    const { result } = renderHook(() => useTransaction(), { wrapper });

    act(() => {
      result.current.handleFinish();
    });

    await waitFor(() => {
      expect(api.getProduct).toHaveBeenCalledWith("test-product");
    });
  });

  it("maneja retry correctamente", async () => {
    const state = {
      ...baseState,
      transaction: {
        ...baseState.transaction,
        error: "Error de transacción",
      },
    };

    const wrapper = createWrapper(state);
    const { result } = renderHook(() => useTransaction(), { wrapper });

    act(() => {
      result.current.handleRetry();
    });

    await waitFor(() => {
      expect(api.getProduct).toHaveBeenCalledWith("test-product");
    });
  });
});
