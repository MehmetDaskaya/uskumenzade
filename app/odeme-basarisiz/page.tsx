"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentFailure() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div>
      <h1>Payment Failed</h1>
      <p>Order ID: {orderId}</p>
      <p>Please try again.</p>
    </div>
  );
}
