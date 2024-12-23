import API_BASE_URL from "../../../util/config";
import axios from "axios";
import store from "@/redux/store";

// Helper function to get Authorization headers
const getAuthHeaders = () => {
  const state = store.getState();
  const token = state.auth.accessToken; // Assuming the token is stored in auth.accessToken
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all health benefits
export const getHealthBenefits = async (offset = 0, limit = 1000) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/uskumenzade/api/health-benefits/`,
      {
        params: { offset, limit },
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching health benefits:", error);
    throw error;
  }
};

// Fetch a single health benefit by ID
export const getHealthBenefitById = async (id: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/uskumenzade/api/health-benefits/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching health benefit by ID:", error);
    throw error;
  }
};

// Create a new health benefit
export const createHealthBenefit = async (benefitData: {
  item_id: string;
  benefit: string;
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/uskumenzade/api/health-benefits/`,
      benefitData,
      {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating health benefit:", error);
    throw error;
  }
};

// Update an existing health benefit
export const updateHealthBenefit = async (
  id: string,
  benefitData: { item_id: string; benefit: string }
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/uskumenzade/api/health-benefits/${id}`,
      benefitData,
      {
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating health benefit:", error);
    throw error;
  }
};

// Delete a health benefit
export const deleteHealthBenefit = async (id: string) => {
  try {
    await axios.delete(
      `${API_BASE_URL}/uskumenzade/api/health-benefits/${id}`,
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    console.error("Error deleting health benefit:", error);
    throw error;
  }
};
