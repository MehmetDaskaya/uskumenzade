import API_BASE_URL from "../../../util/config";

export interface Setting {
  key: string;
  value: string;
}

// Fetch all settings
export const fetchSettings = async (token: string): Promise<Setting[]> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/settings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch settings");
  }
  return response.json();
};

// Fetch shipment cost specifically
export const fetchShipmentCost = async (): Promise<number> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/settings/shipment_cost`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment cost");
  }

  const setting = await response.json();
  return parseFloat(setting.value) || 0;
};

// Update shipment cost (Admin only)
export const updateShipmentCost = async (
  value: string,
  token: string
): Promise<Setting> => {
  try {
    // Try to update the setting
    const response = await fetch(
      `${API_BASE_URL}/uskumenzade/api/settings/shipment_cost`,
      {
        method: "PATCH",
        body: JSON.stringify({ value }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // If the setting doesn't exist, create it
    if (response.status === 404) {
      console.warn("Kargo ücreti ayarı bulunamadı, yeni ayar oluşturuluyor...");
      return await createSetting({ key: "shipment_cost", value }, token);
    }

    if (!response.ok) {
      throw new Error("Failed to update shipment cost");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating shipment cost:", error);
    throw error;
  }
};

// Fetch a specific setting by key
export const fetchSettingByKey = async (
  key: string
): Promise<Setting | null> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/settings/${key}`
  );

  if (!response.ok) {
    if (response.status === 404) return null; // Return null if setting is not found
    throw new Error("Failed to fetch setting");
  }

  return response.json();
};

// Create a new setting (Admin only)
export const createSetting = async (
  settingData: Setting,
  token: string
): Promise<Setting> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/settings`, {
    method: "POST",
    body: JSON.stringify(settingData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create setting");
  }
  return response.json();
};

// Update an existing setting (Admin only)
export const updateSetting = async (
  key: string,
  value: string,
  token: string
): Promise<Setting> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/settings/${key}`,
    {
      method: "PATCH",
      body: JSON.stringify({ value }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update setting");
  }
  return response.json();
};

// Delete a setting (Admin only)
export const deleteSetting = async (
  key: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/settings/${key}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete setting");
  }
};
