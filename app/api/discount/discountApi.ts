import API_BASE_URL from "../../../util/config";

export interface Discount {
  id: string;
  code: string;
  percentage_discount: number;
  all_items: boolean;
  all_users: boolean;
  max_uses: number;
  max_uses_per_user: number;
  uses: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  eligible_items: string[];
  eligible_users: string[];
}

// Fetch all discounts
export const fetchDiscounts = async (token: string): Promise<Discount[]> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/discounts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch discounts");
  }

  const data: Discount[] = await response.json();

  // Ensure missing properties exist
  return data.map((discount) => ({
    ...discount,
    eligible_items: discount.eligible_items || [], // Ensure array exists
    eligible_users: discount.eligible_users || [], // Ensure array exists
  }));
};

// Fetch a specific discount by ID
export const fetchDiscountById = async (
  discountId: string
): Promise<Discount> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/discounts/${discountId}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch discount");
  }
  return response.json();
};

// Create a new discount (Admin only)
export const createDiscount = async (
  discountData: Partial<Discount>,
  token: string
): Promise<Discount> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/discounts`, {
    method: "POST",
    body: JSON.stringify(discountData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create discount");
  }
  return response.json();
};

// Update a discount (Admin only)
export const updateDiscount = async (
  discountId: string,
  discountData: Partial<Discount>,
  token: string
): Promise<Discount> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/discounts/${discountId}`,
    {
      method: "PATCH",
      body: JSON.stringify(discountData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update discount");
  }
  return response.json();
};

// Delete a discount (Admin only)
export const deleteDiscount = async (
  discountId: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/discounts/${discountId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete discount");
  }
};
