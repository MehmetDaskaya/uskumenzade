import { NextRequest, NextResponse } from "next/server";

interface CartItem {
  id: string;
  name: string;
  price: number;
  discounted_price?: number;
  quantity: number;
  length?: number;
  width?: number;
  height?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items } = body;

    // Get authorization header for validation
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // TODO: Replace with actual backend endpoint when available
    // For now, return mock data for testing
    const mockResponse = {
      items: items,
      pricing: {
        item_total: items.reduce((sum: number, item: CartItem) => {
          const price =
            item.discounted_price && item.discounted_price > 0
              ? item.discounted_price
              : item.price;
          return sum + price * item.quantity;
        }, 0),
        shipment_cost: 25.0, // Mock shipment cost
        pay_on_delivery_cost: 0, // Mock POD cost
        vat_amount: 0, // Mock VAT
        final_total: 0, // Will be calculated
        total_volume: items.reduce((sum: number, item: CartItem) => {
          const itemLength = item.length || 1;
          const itemWidth = item.width || 1;
          const itemHeight = item.height || 1;
          const itemVolume =
            (itemLength * itemWidth * itemHeight * item.quantity) / 3000;
          return sum + itemVolume;
        }, 0),
      },
      min_order_value: 50.0,
      free_shipment_threshold: 200.0,
    };

    // Calculate final total
    mockResponse.pricing.final_total =
      mockResponse.pricing.item_total +
      mockResponse.pricing.shipment_cost +
      mockResponse.pricing.pay_on_delivery_cost +
      mockResponse.pricing.vat_amount;

    return NextResponse.json(mockResponse);

    /* 
    // Uncomment when backend endpoint is ready:
    const response = await fetch(
      `${API_BASE_URL}/uskumenzade/api/cart/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items,
          user_email: user_email,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "Failed to confirm cart" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    */
  } catch (error) {
    console.error("Cart confirmation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
