import API_BASE_URL from "../../../util/config";

export interface ShipmentPricing {
  id: string;
  min_volume: number;
  max_volume: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// Fetch all shipment pricings
export const fetchShipmentPricings = async (
  token: string
): Promise<ShipmentPricing[]> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/shipment-pricings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment pricings");
  }

  return response.json();
};

// Fetch a specific shipment pricing by ID
export const fetchShipmentPricingById = async (
  pricingId: string,
  token: string
): Promise<ShipmentPricing> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/shipment-pricings/${pricingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment pricing");
  }
  return response.json();
};

// Create a new shipment pricing (Admin only)
export const createShipmentPricing = async (
  pricingData: Partial<ShipmentPricing>,
  token: string
): Promise<ShipmentPricing> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/shipment-pricings`,
    {
      method: "POST",
      body: JSON.stringify(pricingData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create shipment pricing");
  }
  return response.json();
};

// Update a shipment pricing (Admin only)
export const updateShipmentPricing = async (
  pricingId: string,
  pricingData: Partial<ShipmentPricing>,
  token: string
): Promise<ShipmentPricing> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/shipment-pricings/${pricingId}`,
    {
      method: "PATCH",
      body: JSON.stringify(pricingData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update shipment pricing");
  }
  return response.json();
};

// Delete a shipment pricing (Admin only)
export const deleteShipmentPricing = async (
  pricingId: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/shipment-pricings/${pricingId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete shipment pricing");
  }
};
