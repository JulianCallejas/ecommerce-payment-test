import type { JestConfigWithTsJest } from 'ts-jest'
import { createDefaultEsmPreset } from 'ts-jest'

const { transform, extensionsToTreatAsEsm } = createDefaultEsmPreset()

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json',
      // Aseguramos que se use ESM en ts-jest
      useESM: true,
    },
  },
  extensionsToTreatAsEsm, // ['.ts', '.tsx']
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^../../services/api$': '<rootDir>/src/tests/__mocks__/api.ts',
    '^../services/api$': '<rootDir>/src/tests/__mocks__/api.ts',
    '^../../hooks/usePurchaseProcess$': '<rootDir>/src/tests/__mocks__/usePurchaseProcess.ts', // Asegura esta línea
    '^./usePurchaseProcess$': '<rootDir>/src/tests/__mocks__/usePurchaseProcess.ts', // Asegura esta línea
    '^./hooks/useCheckoutForms$': '<rootDir>/src/tests/__mocks__/useCheckoutForms.ts',
    '^./useCheckoutForms$': '<rootDir>/src/tests/__mocks__/useCheckoutForms.ts',
    '@toolpad/core/useNotifications': '<rootDir>/src/tests/__mocks__/useNotifications.ts'
  },
  setupFiles: ['<rootDir>/jest.env.js',],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

export default config