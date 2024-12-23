import API_BASE_URL from "../../../util/config";

export interface Address {
  id: string;
  address: string;
  zip_code: string;
  state: string;
  city: string;
  country: string;
  address_title: string;
  contact_name: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface BasketItem {
  quantity: number;
  item_id: string;
}

export interface Order {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  amount: number;
  shipping_address: Address;
  billing_address: Address;
  basket: BasketItem[];
}

export interface User {
  id: string;
  fname: string;
  lname: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  role: string;
  national_id: string;
  gsm_number: string;
  created_at: string;
  updated_at: string;
  addresses: Address[]; // Correct type for addresses
  orders: Order[]; // Correct type for orders
}

interface UpdateUserPayload {
  fname?: string;
  lname?: string;
  email?: string;
  password?: string;
  national_id?: string;
  gsm_number?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
  role?: string;
}

// Fetch the current user
export const fetchCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }
  return response.json();
};

// Fetch a user by ID
export const fetchUserById = async (
  id: string,
  token: string
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user by ID");
  }
  return response.json();
};

// Update the current user
export const updateUser = async (
  payload: UpdateUserPayload,
  token: string
): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to update user");
  }
  return response.json();
};

// Delete a user by ID (for superusers)
export const deleteUser = async (id: string, token: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete user");
  }
};

// Fetch all users (requires superuser access)
export const fetchAllUsers = async (
  token: string,
  offset = 0,
  limit = 1000
): Promise<User[]> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/users?offset=${offset}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};
