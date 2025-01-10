import API_BASE_URL from "../../../util/config";
import axios, { AxiosResponse } from "axios";
import store from "@/redux/store";

// Axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/uskumenzade/api/health-benefits/`,
});

// Helper function to get Authorization headers
const getAuthHeaders = () => {
  const state = store.getState();
  const token = state.auth.accessToken; // Assuming the token is stored in auth.accessToken
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Set headers dynamically before each request
apiClient.interceptors.request.use((config) => {
  const authHeaders = getAuthHeaders();

  if (authHeaders.Authorization && config.headers) {
    config.headers.Authorization = authHeaders.Authorization;
  }

  return config;
});

// Fetch all health benefits
export const getHealthBenefits = async (offset = 0, limit = 1000) => {
  try {
    const response: AxiosResponse = await apiClient.get("/", {
      params: { offset, limit },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error fetching health benefits:", error.response.data);
    } else {
      console.error("Unknown error fetching health benefits:", error);
    }
    throw new Error("Failed to fetch health benefits. Please try again.");
  }
};

// Fetch a single health benefit by ID
export const getHealthBenefitById = async (id: string) => {
  try {
    const response: AxiosResponse = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("The health benefit you are looking for was not found.");
    }
    console.error("Error fetching health benefit:", error);
    throw new Error("Failed to fetch health benefit. Please try again.");
  }
};

// Create a new health benefit
export const createHealthBenefit = async (benefitData: {
  item_id: string;
  benefit: string;
}) => {
  try {
    const response: AxiosResponse = await apiClient.post("/", benefitData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      throw new Error("Invalid data provided while creating health benefit.");
    }
    console.error("Error creating health benefit:", error);
    throw new Error("Failed to create health benefit. Please try again.");
  }
};

// Update an existing health benefit
export const updateHealthBenefit = async (
  id: string,
  benefitData: { item_id: string; benefit: string }
) => {
  try {
    const response: AxiosResponse = await apiClient.patch(
      `/${id}`,
      benefitData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("The health benefit to update was not found.");
    }
    console.error("Error updating health benefit:", error);
    throw new Error("Failed to update health benefit. Please try again.");
  }
};

// Delete a health benefit
export const deleteHealthBenefit = async (id: string) => {
  try {
    await apiClient.delete(`/${id}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("The health benefit to delete was not found.");
    }
    console.error("Error deleting health benefit:", error);
    throw new Error("Failed to delete health benefit. Please try again.");
  }
};
