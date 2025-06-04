import './src/setupTests';
import '@testing-library/jest-dom';

jest.mock('@toolpad/core/useNotifications', () => ({
  useNotifications: jest.fn(() => ({
    show: jest.fn()
  }))
}));

jest.mock('../../hooks/usePurchaseProcess', () => ({
  usePurchaseProcess: jest.fn(() => ({
    openCheckoutModal: jest.fn(),
    closeTransactionModal: jest.fn(),
    cancelProcess: jest.fn()
  }))
}));

// TextEncoder / TextDecoder polyfill
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class {
    encode(input = '') {
      const buffer = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        buffer[i] = input.charCodeAt(i);
      }
      return buffer;
    }
  } as unknown as typeof global.TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class {
    decode(input?: BufferSource): string {
      if (!input) return '';
      let buffer: Uint8Array;
      if (input instanceof ArrayBuffer) {
        buffer = new Uint8Array(input);
      } else if ('buffer' in input) {
        buffer = new Uint8Array(input.buffer);
      } else {
        buffer = new Uint8Array(input);
      }
      return String.fromCharCode(...buffer);
    }
  } as unknown as typeof global.TextDecoder;
}

// Mock localStorage
const localStorageMock = (() => {
  const store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    key: (index: number) => Object.keys(store)[index] || null,
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  configurable: true,
  enumerable: true,
  writable: true
});

// Mock crypto.getRandomValues
const mockCrypto: Crypto = {
  subtle: {
    digest: jest.fn(),
    importKey: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
    deriveBits: jest.fn(),
    deriveKey: jest.fn(),
    exportKey: jest.fn(),
    generateKey: jest.fn(),
    sign: jest.fn(),
    unwrapKey: jest.fn(),
    verify: jest.fn(),
    wrapKey: jest.fn()
  } as unknown as SubtleCrypto,

  getRandomValues: <T extends ArrayBufferView | null>(array: T): T => {
    if (array && array.buffer instanceof ArrayBuffer) {
      const buffer = new Uint8Array(array.buffer);
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = Math.floor(Math.random() * 256);
      }
    }
    return array;
  },

  randomUUID: jest.fn(() => 'mock-uuid-1234-5678-9012-3456')
} as Crypto;

global.crypto = mockCrypto;

// Limpieza antes de cada prueba
beforeEach(() => {
  localStorageMock.clear();
  jest.clearAllMocks();
});