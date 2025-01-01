"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div>
      <h1>Payment Successful</h1>
      <p>Order ID: {orderId}</p>
    </div>
  );
}
