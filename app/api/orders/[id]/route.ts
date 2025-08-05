import { NextRequest, NextResponse } from "next/server";
import API_BASE_URL from "../../../../util/config";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Call your backend API to get order details
    const response = await fetch(
      `${API_BASE_URL}/uskumenzade/api/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Failed to fetch order" },
        { status: response.status }
      );
    }

    const orderData = await response.json();
    return NextResponse.json(orderData);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
