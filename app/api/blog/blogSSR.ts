import axios from "axios";
import { cookies } from "next/headers"; // For Next.js 13+
import store from "@/redux/store";
import API_BASE_URL from "../../../util/config";

// Helper function to get Authorization headers
const getAuthHeaders = (token?: string) => {
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  const state = store.getState();
  const clientToken = state.auth.accessToken;
  return clientToken ? { Authorization: `Bearer ${clientToken}` } : {};
};

export const fetchBlogs = async (token?: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/uskumenzade/api/blogs/`, {
      headers: getAuthHeaders(token),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return []; // Return an empty array as a fallback
  }
};

export async function fetchBlogsWithSSR() {
  try {
    const token = cookies().get("authToken")?.value; // Replace "authToken" with your cookie name
    const blogs = await fetchBlogs(token);
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs in SSR:", error);
    throw new Error("Blog verileri alınırken bir hata oluştu."); // Explicitly rethrow error
  }
}
