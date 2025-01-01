import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = url.searchParams.get("status");
  const orderId = url.searchParams.get("order_id");

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
