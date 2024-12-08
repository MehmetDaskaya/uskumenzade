// app/api/image/imageApi.ts
import API_BASE_URL from "../../../util/config";

export const uploadImage = async (
  file: File,
  altText: string,
  type: string,
  token: string // Add token parameter
) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/images/?alt_text=${encodeURIComponent(
      altText
    )}&image_type=${encodeURIComponent(type)}`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`, // Include token in headers
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  return response.json();
};

export const deleteImageApi = async (imageId: string, token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/images/${imageId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Add the Authorization header
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete image");
  }
};

export const updateImageApi = async (
  imageId: string,
  altText: string,
  imageType: string,
  token: string // Add token as a parameter
) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/images/${imageId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the header
      },
      body: JSON.stringify({ alt_text: altText, image_type: imageType }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update image");
  }

  return response.json();
};

export const fetchImages = async (type: string) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/images?type=${type}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }

  const data = await response.json();
  console.log("Fetched images:", data); // Debugging log
  return data;
};
