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
  national_id: string; // ✅ Added field
  contact_number: string; // ✅ Added field
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
    width: number; // ✅ Add this
    length: number; // ✅ Add this
    height: number; // ✅ Add this
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
  total_amount?: number; // ✅ Ensure this exists
  shipping_total?: number; // ✅ Add this
  items_total?: number; // ✅ Add this for clarity
  user: User;
  shipping_address: Address;
  billing_address: Address;
  shipping_address_id: string;
  billing_address_id: string;
  basket: BasketItem[];
  discount_code?: string;
  shipment_code?: string;
}

// Fetch orders
export const fetchOrders = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

// Fetch order by ID
export const fetchOrderById = async (
  orderId: string,
  token: string
): Promise<Order> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  const orderData = await response.json();

  // ✅ Ensure amount matches total_amount
  orderData.amount = orderData.total_amount;

  // ✅ Add shipping cost to basket if missing
  if (
    !orderData.basket.find(
      (item: BasketItem) => item.item_id === "SHIPPING_COST"
    )
  ) {
    orderData.basket.push({
      item_id: "SHIPPING_COST",
      quantity: 1,
      unit_price: orderData.shipping_total,
      total_price: orderData.shipping_total,
      item: {
        id: "SHIPPING_COST",
        name: "Kargo Ücreti",
        description: "Shipping Fee",
        price: orderData.shipping_total,
        discounted_price: orderData.shipping_total,
        stock: 1,
        how_to_use: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        width: 0,
        length: 0,
        height: 0,
        images: [],
        category: {
          id: "SHIPPING",
          name: "Shipping",
          created_at: "",
          updated_at: "",
        },
      },
    } as BasketItem);
  }

  console.log(
    "🚀 Updated Order Before Payment (With Shipping Item):",
    orderData
  );
  return orderData;
};

// Create a new order
export interface CreateOrderRequest {
  shipping_address_id: string; // Use address ID for shipping
  billing_address_id: string; // Use address ID for billing
  basket: BasketItem[];
  discount_code?: string;
}

// Update the createOrder function to use CreateOrderRequest
export const createOrder = async (
  orderData: CreateOrderRequest,
  token: string
): Promise<Order> => {
  try {
    const response = await fetch(`${API_BASE_URL}/uskumenzade/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...orderData,
        discount_code: orderData.discount_code || null, // Send discount code if applied
      }),
      mode: "cors",
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const newOrder = await response.json();

    console.log("✅ Order Created Response:", newOrder);

    return newOrder;
  } catch (error) {
    console.error("🚨 Error creating order:", error);
    throw error;
  }
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
