import API_BASE_URL from "../../../util/config";

export const initializePayment = async (orderId: string, token: string) => {
  const callbackUrl = `${window.location.origin}/payment-result`;

  // ✅ Send the updated request with `basket`
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/payments/initialize-checkout?order_id=${orderId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        callbackUrl,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to initialize payment.");
  }

  return response.json();
};

export interface PaymentCallbackResponse {
  status: string;
  message: string;
  orderId?: string;
  paymentId?: string;
}

export const handlePaymentCallback = async (
  token: string
): Promise<PaymentCallbackResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/payments/callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }), // Ensure the token is sent in the request body
      redirect: "follow", // Follow redirect
    }
  );

  if (!response.ok) {
    console.error("Callback API response error:", await response.text());
    throw new Error("Failed to handle payment callback");
  }

  const responseData = await response.json();
  console.log("Callback API response data:", responseData);

  return responseData as PaymentCallbackResponse;
};
