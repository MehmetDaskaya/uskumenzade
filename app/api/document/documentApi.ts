// app/api/document/documentApi.ts
import API_BASE_URL from "../../../util/config";

// Upload Document
export const uploadDocument = async (
  file: File,
  name: string,
  token: string
) => {
  const formData = new FormData();
  formData.append("file", file); // File to upload
  formData.append("name", name); // Document name in form-data

  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/documents/?name=${encodeURIComponent(
      name
    )}`, // Ensure name is included in the query parameters
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`, // Include authorization token
      },
    }
  );

  if (!response.ok) {
    const errorResponse = await response.text(); // Debugging purposes
    console.error("Upload document error:", errorResponse);
    throw new Error("Failed to upload document");
  }

  return response.json();
};

// Fetch All Documents
export const fetchDocuments = async (
  offset = 0,
  limit = 1000,
  token: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/documents/?offset=${offset}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Include authorization token
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
};

// Update Document
export const updateDocument = async (
  documentId: string,
  name: string,
  token: string
) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/documents/${documentId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include authorization token
      },
      body: JSON.stringify({ name }), // Only updating name
    }
  );

  if (!response.ok) {
    const errorResponse = await response.text(); // Debugging purposes
    console.error("Update document error:", errorResponse);
    throw new Error("Failed to update document");
  }

  return response.json();
};

// Delete Document
export const deleteDocument = async (documentId: string, token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/documents/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Include authorization token
      },
    }
  );

  if (!response.ok) {
    const errorResponse = await response.text(); // Debugging purposes
    console.error("Delete document error:", errorResponse);
    throw new Error("Failed to delete document");
  }

  return response.ok; // Return true if successful
};
