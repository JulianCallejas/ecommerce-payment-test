export const mockCloseTransactionModal = jest.fn();
export const mockOpenCheckoutModal = jest.fn();
export const mockCancelProcess = jest.fn();
export const mockStartSummary = jest.fn();
export const mockCloseCheckoutModal = jest.fn();
export const mockStartCheckout = jest.fn();

export const usePurchaseProcess = jest.fn(() => ({
  closeTransactionModal: mockCloseTransactionModal,
  openCheckoutModal: mockOpenCheckoutModal,
  cancelProcess: mockCancelProcess,
  startSummary: mockStartSummary,
  closeCheckoutModal: mockCloseCheckoutModal,
  startCheckout: mockStartCheckout
}));