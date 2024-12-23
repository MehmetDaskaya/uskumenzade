import API_BASE_URL from "../../../util/config";

interface User {
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
}

interface Address {
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

interface BasketItem {
  item?: {
    id: string;
    name: string;
    description: string;
    price: number;
    discounted_price: number;
    stock: number;
    how_to_use: string;
    created_at: string;
    updated_at: string;
    images: {
      id: string;
      alt_text: string;
      image_type: string;
      path: string;
      url: string;
      created_at: string;
      updated_at: string;
    }[];
    category: {
      id: string;
      name: string;
      created_at: string;
      updated_at: string;
    };
  };
  quantity: number;
  item_id: string;
}

export interface Order {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  amount: number;
  user: User;
  shipping_address: Address;
  billing_address: Address;
  basket: BasketItem[];
}

// Fetch all orders
export const fetchOrders = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

// Fetch an order by ID
export const fetchOrderById = async (orderId: string): Promise<Order> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/orders/${orderId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }
  return response.json();
};

// Create a new order
export interface CreateOrderRequest {
  shipping_address_id: string; // Use address ID for shipping
  billing_address_id: string; // Use address ID for billing
  basket: BasketItem[];
}

// Update the createOrder function to use CreateOrderRequest
export const createOrder = async (
  orderData: CreateOrderRequest,
  token: string
): Promise<Order> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/orders`, {
    method: "POST",
    body: JSON.stringify(orderData),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to create order");
  }
  return response.json();
};

// Update an order
export const updateOrder = async (
  orderId: string,
  orderData: Partial<Order>,
  token: string
): Promise<Order> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/orders/${orderId}`,
    {
      method: "PATCH",
      body: JSON.stringify(orderData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update order");
  }
  return response.json();
};

// Delete an order
export const deleteOrder = async (
  orderId: string,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/orders/${orderId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete order");
  }
};
