import { NextResponse, NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // Match the backend callback URL
  if (pathname === "/uskumenzade/api/payments/None/payment-result") {
    const status = searchParams.get("status");
    const orderId = searchParams.get("order_id");

    // Redirect to the appropriate frontend page
    if (status === "success") {
      return NextResponse.redirect(
        `http://localhost:3000/odeme-basarili?order_id=${orderId}`
      );
    } else {
      return NextResponse.redirect(
        `http://localhost:3000/odeme-basarisiz?order_id=${orderId}`
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "../uskumenzade/api/payments/None/payment-result",
};
