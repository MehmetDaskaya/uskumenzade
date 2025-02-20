// app/api/image/imageApi.ts
import API_BASE_URL from "../../../util/config";

const convertImageToRGB = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Fill background with white (since JPEG does not support transparency)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the image without transparency
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, { type: "image/jpeg" });
            resolve(newFile);
          } else {
            reject(new Error("Image conversion failed"));
          }
        },
        "image/jpeg",
        0.85
      ); // Convert to JPEG with 85% quality
    };

    img.onerror = (error) => reject(error);

    // Read the uploaded file as a Data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        img.src = event.target.result.toString();
      }
    };
    reader.readAsDataURL(file);
  });
};

export const uploadImage = async (
  file: File,
  altText: string,
  type: string,
  token: string
) => {
  const processedFile = await convertImageToRGB(file);

  const formData = new FormData();
  formData.append("file", processedFile); // Send the processed file

  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/images/?alt_text=${encodeURIComponent(
      altText
    )}&image_type=${encodeURIComponent(type)}`,
    {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorResponse = await response.text();
    console.error("Upload error response:", errorResponse);
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
