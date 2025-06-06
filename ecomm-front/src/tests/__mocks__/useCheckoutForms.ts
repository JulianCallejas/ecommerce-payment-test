// src/tests/__mocks__/useCheckoutForms.ts
export const mockCheckFormErrors = jest.fn(() => Promise.resolve(true));
export const mockUpdateFormSection = jest.fn();

export const useCheckoutForms = jest.fn(() => ({
  checkFormErrors: mockCheckFormErrors,
  updateFormSection: mockUpdateFormSection,
  formContextMap: {
    customer: { isValid: true },
    paymentData: { isValid: true },
    address: { isValid: true }
  },
  termsFormContext: { isValid: true },
  areTermsAccepted: true,
  customerFormContext: {},
  paymentFormContext: {},
  shippingFormContext: {}
}));