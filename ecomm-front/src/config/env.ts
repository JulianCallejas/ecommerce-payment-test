// const env = {
//   API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
//   ENCRYPTSTORAGE_KEY: import.meta.env.VITE_ENCRYPTSTORAGE_KEY || "secretkey",
//   WOMPI_PUB_KEY: import.meta.env.VITE_WOMPI_PUB_KEY || "wompikey",
//   ACCEPT_TOKENS_URL: import.meta.env.VITE_ACCEPT_TOKENS_URL || "http://wompi.dev"
// };

// tests environment variables
const env = {
  API_BASE_URL: process.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1",
  ENCRYPTSTORAGE_KEY: process.env.VITE_ENCRYPTSTORAGE_KEY || "secretkey",
  WOMPI_PUB_KEY: process.env.VITE_WOMPI_PUB_KEY || "wompikey",
  ACCEPT_TOKENS_URL: process.env.VITE_ACCEPT_TOKENS_URL || "http://wompi.dev"
};



export default env;
