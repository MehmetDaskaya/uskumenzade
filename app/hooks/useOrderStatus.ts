// // app/hooks/useOrderStatus.ts
// import { useState, useEffect } from "react";
// import API_BASE_URL from "@/util/config";

// export const useOrderStatus = (orderId: string, token: string | null) => {
//   const [status, setStatus] = useState<string | null>(null);

//   useEffect(() => {
//     if (!orderId || !token) return; // Eğer token veya orderId yoksa işlemi durdur
//     const intervalId = setInterval(async () => {
//       try {
//         const res = await fetch(
//           `${API_BASE_URL}/uskumenzade/api/orders/${orderId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (res.ok) {
//           const data = await res.json();
//           setStatus(data.status);
//           if (data.status !== "pending") {
//             clearInterval(intervalId);
//           }
//         }
//       } catch (error) {
//         console.error("Sipariş durumu alınamadı:", error);
//       }
//     }, 5000);

//     return () => clearInterval(intervalId);
//   }, [orderId, token]);

//   return status;
// };
