// Extiende las declaraciones de Jest sin introducir errores de lint
import '@testing-library/jest-dom';
import { Crypto, SubtleCrypto } from 'crypto';

declare global {
  namespace jest {
    interface Mocked<T> extends Function {
      mockImplementation: (fn: (...args: any[]) => any) => this;
      mockReturnValue: (value: any) => this;
      // Agrega otros métodos que uses frecuentemente
    }
  }

  // Extensión segura de la interfaz Crypto
  interface Crypto {
    subtle: jest.Mocked<SubtleCrypto>;
  }

  // Declaración para variables de entorno globales
  var import_meta_env: {
    VITE_API_BASE_URL: string;
    VITE_ENCRYPTSTORAGE_KEY: string;
    VITE_WOMPI_PUB_KEY: string;
    VITE_ACCEPT_TOKENS_URL: string;
  };
}