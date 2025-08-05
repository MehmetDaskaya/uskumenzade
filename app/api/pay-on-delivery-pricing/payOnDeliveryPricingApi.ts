import API_BASE_URL from "../../../util/config";

export interface PayOnDeliveryPricing {
  id: string;
  min_cost: number;
  max_cost: number;
  price: number;
  created_at: string;
  updated_at: string;
}

// Fetch all pay-on-delivery pricings
export const fetchPayOnDeliveryPricings = async (
  token: string
): Promise<PayOnDeliveryPricing[]> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/pay-on-delivery-pricings`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pay-on-delivery pricings");
  }

  return response.json();
};

// Fetch a specific pay-on-delivery pricing by ID
export const fetchPayOnDeliveryPricingById = async (
  pricingId: string,
  token: string
): Promise<PayOnDeliveryPricing> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/pay-on-delivery-pricings/${pricingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch pay-on-delivery pricing");
  }
  return response.json();
};

// Create a new pay-on-delivery pricing (Admin only)
export const createPayOnDeliveryPricing = async (
  pricingData: Partial<PayOnDeliveryPricing>,
  token: string
): Promise<PayOnDeliveryPricing> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/pay-on-delivery-pricings`,
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
    throw new Error("Failed to create pay-on-delivery pricing");
  }
  return response.json();
};

// Update a pay-on-delivery pricing (Admin only)
export const updatePayOnDeliveryPricing = async (
  pricingId: string,
  pricingData: Partial<PayOnDeliveryPricing>,
  token: string
): Promise<PayOnDeliveryPricing> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/pay-on-delivery-pricings/${pricingId}`,
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
    throw new Error("Failed to update pay-on-delivery pricing");
  }
  return response.json();
};

// Delete a pay-on-delivery pricing (Admin only)
export const deletePayOnDeliveryPricing = async (
  pricingId: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/pay-on-delivery-pricings/${pricingId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete pay-on-delivery pricing");
  }
};
