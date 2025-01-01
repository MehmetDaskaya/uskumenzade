import API_BASE_URL from "../../../util/config";
import axios from "axios";
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
    (config.headers as any).set("Authorization", authHeaders.Authorization);
  }

  return config;
});

// Fetch all health benefits
export const getHealthBenefits = async (offset = 0, limit = 1000) => {
  try {
    const response = await apiClient.get("/", {
      params: { offset, limit },
    });
    return response.data;
  } catch (error) {
    console.error("Sağlık yararlarını çekerken hata oluştu:", error);
    throw new Error(
      "Sağlık yararlarını çekerken bir sorun oluştu. Lütfen tekrar deneyin."
    );
  }
};

// Fetch a single health benefit by ID
export const getHealthBenefitById = async (id: string) => {
  try {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Aradığınız sağlık yararı bulunamadı.");
    }
    console.error("Sağlık yararını çekerken hata oluştu:", error);
    throw new Error(
      "Sağlık yararını çekerken bir sorun oluştu. Lütfen tekrar deneyin."
    );
  }
};

// Create a new health benefit
export const createHealthBenefit = async (benefitData: {
  item_id: string;
  benefit: string;
}) => {
  try {
    const response = await apiClient.post("/", benefitData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(
        "Yeni sağlık yararı oluşturulurken geçersiz veri gönderildi."
      );
    }
    console.error("Sağlık yararı oluşturulurken hata oluştu:", error);
    throw new Error(
      "Sağlık yararı oluşturulurken bir sorun oluştu. Lütfen tekrar deneyin."
    );
  }
};

// Update an existing health benefit
export const updateHealthBenefit = async (
  id: string,
  benefitData: { item_id: string; benefit: string }
) => {
  try {
    const response = await apiClient.patch(`/${id}`, benefitData, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Güncellenmek istenen sağlık yararı bulunamadı.");
    }
    console.error("Sağlık yararını güncellerken hata oluştu:", error);
    throw new Error(
      "Sağlık yararını güncellerken bir sorun oluştu. Lütfen tekrar deneyin."
    );
  }
};

// Delete a health benefit
export const deleteHealthBenefit = async (id: string) => {
  try {
    await apiClient.delete(`/${id}`);
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error("Silinmek istenen sağlık yararı bulunamadı.");
    }
    console.error("Sağlık yararını silerken hata oluştu:", error);
    throw new Error(
      "Sağlık yararını silerken bir sorun oluştu. Lütfen tekrar deneyin."
    );
  }
};
