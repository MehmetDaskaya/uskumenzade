import API_BASE_URL from "../../../util/config";
import axios from "axios";
import store from "@/redux/store";

// Helper function to get Authorization headers
const getAuthHeaders = () => {
  const state = store.getState();
  const token = state.auth.accessToken; // Assuming the token is stored in auth.accessToken
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProducts = async (offset = 0, limit = 1000) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/uskumenzade/api/items/`, {
      params: { offset, limit },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/uskumenzade/api/items/${id}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

export const createProduct = async (productData: {
  name: string;
  description: string;
  price: number;
  discounted_price: number;
  stock: number;
  how_to_use: string;
  category_id: string;
  image_ids: string[];
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/uskumenzade/api/items/`,
      productData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productData: {
    name: string;
    description: string;
    price: number;
    discounted_price: number;
    stock: number;
    how_to_use: string;
    category_id: string;
    image_ids: string[];
  }
) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/uskumenzade/api/items/${id}`,
      productData,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/uskumenzade/api/items/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
