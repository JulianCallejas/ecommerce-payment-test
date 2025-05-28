import axios from "axios";
import type { AcceptanceTokenResponse } from "../types";

// Create axios instance with base URL from environment variables
const wompiApi = axios.create({
  baseURL: `${import.meta.env.VITE_ACCEPT_TOKENS_URL}/${import.meta.env.VITE_WOMPI_PUB_KEY}`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// API service for the e-commerce application
export const wompiService = {
  getAcceptTokens: async (): Promise<string[]> => {
    const response = await wompiApi.get<AcceptanceTokenResponse>("");
    return [
      response.data.data.presigned_acceptance.acceptance_token,
      response.data.data.presigned_personal_data_auth.acceptance_token
    ];
  },
   
};

export default wompiService;
