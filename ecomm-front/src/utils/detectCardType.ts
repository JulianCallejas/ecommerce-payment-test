// Credit card type detection regex patterns
export const VISA_PATTERN = /^4[0-9]{12}(?:[0-9]{3})?$/;
export const MASTERCARD_PATTERN = /^5[1-5][0-9]{14}$/;

// Helper function to validate and detect card type
export const detectCardType = (cardNumber: string): 'visa' | 'mastercard' | null => {
  const sanitized = cardNumber.replace(/\s+/g, '');
  
  if (VISA_PATTERN.test(sanitized)) {
    return 'visa';
  }
  
  if (MASTERCARD_PATTERN.test(sanitized)) {
    return 'mastercard';
  }
  
  return null;
};
