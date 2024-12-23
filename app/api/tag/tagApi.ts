import API_BASE_URL from "../../../util/config";
import axios from "axios";
import store from "@/redux/store";

// Helper function to get Authorization headers
const getAuthHeaders = () => {
  const state = store.getState();
  const token = state.auth.accessToken; // Assuming the token is stored in auth.accessToken
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all tags
export const fetchTags = async (offset: number = 0, limit: number = 1000) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/uskumenzade/api/tags?offset=${offset}&limit=${limit}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

// Fetch a single tag by ID
export const fetchTagById = async (tagId: string) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/uskumenzade/api/tags/${tagId}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching tag by ID:", error);
    throw error;
  }
};

// Create a new tag
export const createTag = async (name: string) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/uskumenzade/api/tags`,
      { name },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating tag:", error);
    throw error;
  }
};

// Update a tag
export const updateTag = async (tagId: string, name: string) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/uskumenzade/api/tags/${tagId}`,
      { name },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating tag:", error);
    throw error;
  }
};

// Delete a tag
export const deleteTag = async (tagId: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/uskumenzade/api/tags/${tagId}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error("Error deleting tag:", error);
    throw error;
  }
};
