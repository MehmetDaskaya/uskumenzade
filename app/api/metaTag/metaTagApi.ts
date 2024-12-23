import API_BASE_URL from "../../../util/config";
import axios from "axios";
import store from "@/redux/store";

// Helper function to get Authorization headers
const getAuthHeaders = () => {
  const state = store.getState();
  const token = state.auth.accessToken; // Assuming the token is stored in auth.accessToken
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all meta-tags
export const fetchMetaTags = async (
  offset: number = 0,
  limit: number = 1000
) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/uskumenzade/api/meta-tags?offset=${offset}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching meta-tags:", error);
    throw error;
  }
};

// Fetch a single meta-tag by ID
export const fetchMetaTagById = async (metaTagId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/uskumenzade/api/meta-tags/${metaTagId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching meta-tag by ID:", error);
    throw error;
  }
};

// Create a new meta-tag
export const createMetaTag = async (name: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/uskumenzade/api/meta-tags`,
      { name },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating meta-tag:", error);
    throw error;
  }
};

// Update a meta-tag
export const updateMetaTag = async (metaTagId: string, name: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/uskumenzade/api/meta-tags/${metaTagId}`,
      { name },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating meta-tag:", error);
    throw error;
  }
};

// Delete a meta-tag
export const deleteMetaTag = async (metaTagId: string) => {
  try {
    await axios.delete(
      `${API_BASE_URL}/uskumenzade/api/meta-tags/${metaTagId}`,
      {
        headers: getAuthHeaders(),
      }
    );
  } catch (error) {
    console.error("Error deleting meta-tag:", error);
    throw error;
  }
};
