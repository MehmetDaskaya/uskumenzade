"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/**
 * This page matches:
 * GET or POST /uskumenzade/api/payments/[callbackId]/payment-result?status=...&order_id=...&token=...
 */
export default function PaymentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract the query string values
  const status = searchParams.get("status");
  const orderId = searchParams.get("order_id");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!status) {
      // We can't decide where to go if there's no status
      return;
    }

    if (status === "success") {
      // Append order_id, token, etc. if you want
      router.replace(`/odeme-basarili?order_id=${orderId}&token=${token}`);
    } else {
      router.replace("/odeme-basarisiz");
    }
  }, [status, orderId, token, router]);

  return (
    <div className="p-6">
      <h2 className="text-xl">Ödeme işlemi işleniyor...</h2>
      <p>Lütfen bekleyin.</p>
    </div>
  );
}
