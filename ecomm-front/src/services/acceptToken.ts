import axios from "axios";
import type { AcceptanceTokenResponse } from "../types";
import env from "../config/env";

// Create axios instance with base URL from environment variables
const wompiApi = axios.create({
  baseURL: `${env.ACCEPT_TOKENS_URL}/${env.WOMPI_PUB_KEY}`,
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
