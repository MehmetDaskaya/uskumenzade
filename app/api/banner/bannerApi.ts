import API_BASE_URL from "../../../util/config";

export interface Banner {
  id: string;
  title: string;
  description: string;
  href: string;
  image_id: string;
  created_at: string;
  updated_at: string;
  image: {
    id: string;
    alt_text: string;
    image_type: string;
    path: string;
    url: string;
    created_at: string;
    updated_at: string;
  };
}

// Fetch all banners
export const fetchBanners = async (token: string): Promise<Banner[]> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/banners`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch banners");
  }

  return response.json();
};

export const createBanner = async (
  bannerData: Partial<Banner>,
  token: string
): Promise<Banner> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/banners`, {
    method: "POST",
    body: JSON.stringify(bannerData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Banner create error:", errorData); // 🔍 LOG THIS
    throw new Error("Failed to create banner");
  }

  return response.json();
};

// Update banner
export const updateBanner = async (
  bannerId: string,
  bannerData: Partial<Banner>,
  token: string
): Promise<Banner> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/banners/${bannerId}`,
    {
      method: "PATCH",
      body: JSON.stringify(bannerData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update banner");
  }

  return response.json();
};

// Delete banner
export const deleteBanner = async (
  bannerId: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/banners/${bannerId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete banner");
  }
};
