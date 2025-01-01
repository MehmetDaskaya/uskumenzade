// app/api/address/addressApi.ts

import API_BASE_URL from "../../../util/config";

export interface Address {
  id?: string;
  address: string;
  zip_code: string;
  city: string;
  country: string;
  address_title: string;
  contact_name: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

// Fetch all addresses
export const fetchAddresses = async (token: string): Promise<Address[]> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/addresses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch addresses");
  }

  return response.json();
};

// Fetch an address by ID
export const fetchAddressById = async (
  addressId: string,
  token: string
): Promise<Address> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/addresses/${addressId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch the address");
  }

  return response.json();
};

// Create a new address
export const createAddress = async (
  addressData: Omit<Address, "id" | "created_at" | "updated_at" | "user_id">,
  token: string
): Promise<Address> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/addresses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...addressData,
      contact_name: addressData.contact_name || "",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create the address");
  }

  return response.json();
};

// Update an existing address
export const updateAddress = async (
  addressId: string,
  addressData: Omit<Address, "id" | "created_at" | "updated_at" | "user_id">,
  token: string
): Promise<Address> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/addresses/${addressId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...addressData,
        contact_name: addressData.contact_name || "",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update the address");
  }

  return response.json();
};

// Delete an address
export const deleteAddress = async (
  addressId: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/addresses/${addressId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete the address");
  }
};
