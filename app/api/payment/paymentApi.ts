import API_BASE_URL from "../../../util/config";

export const initializePayment = async (orderId: string, token: string) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/payments/initialize-checkout?order_id=${orderId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to initialize payment.");
  }

  return response.json(); // The response should include a `checkout_url`
};

export interface PaymentCallbackResponse {
  status: string;
  message: string;
  orderId?: string;
  paymentId?: string;
}

export const handlePaymentCallback =
  async (): Promise<PaymentCallbackResponse> => {
    const response = await fetch(
      `${API_BASE_URL}/uskumenzade/api/payments/callback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to handle payment callback");
    }

    return response.json() as Promise<PaymentCallbackResponse>;
  };
