import API_BASE_URL from "../../../util/config";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken"); // Retrieve the token from localStorage
  if (!token) throw new Error("No authorization token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // Add the token to the Authorization header
  };
};

export const fetchCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/categories/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch categories");
  return response.json();
};

export const createCategory = async (categoryName: string) => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/categories/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name: categoryName }),
  });

  if (!response.ok) throw new Error("Failed to add category");
  return response.json();
};

export const updateCategoryApi = async (
  categoryId: string,
  newName: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/categories/${categoryId}/`,
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: newName }),
    }
  );

  if (!response.ok) throw new Error("Failed to update category");
  return response.json();
};

export const deleteCategoryApi = async (categoryId: string) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/categories/${categoryId}/`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) throw new Error("Failed to delete category");
};
