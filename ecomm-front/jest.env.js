// Este archivo es solo JavaScript (no TypeScript), y se ejecuta antes de tus tests
const testEnv = {
  VITE_API_BASE_URL: process.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  VITE_ENCRYPTSTORAGE_KEY: process.env.VITE_ENCRYPTSTORAGE_KEY || "secretkey",
  VITE_WOMPI_PUB_KEY: process.env.VITE_WOMPI_PUB_KEY || "wompikey",
  VITE_ACCEPT_TOKENS_URL: process.env.VITE_ACCEPT_TOKENS_URL || "http://wompi.dev"
};

// Inyectamos como variable global compatible con ESM
global.__vitest_environment_globals__ = {
  __vite__isolate__() {
    return {
      importMeta: {
        url: `file://${__dirname}/`,
        env: testEnv
      }
    };
  }
};