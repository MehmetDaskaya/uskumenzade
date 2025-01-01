import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  try {
    // Use `req.nextUrl` to safely work with the URL
    const url = req.nextUrl.clone();

    // Extract pathname and search parameters
    const { pathname, searchParams } = url;

    // Check if we're accessing the /payment-result page
    if (pathname === "/payment-result") {
      const status = searchParams.get("status");
      const orderId = searchParams.get("order_id");

      // Validate the required query parameters
      if (!status || !orderId) {
        console.log("Invalid parameters detected:", { status, orderId });

        // Redirect to the error page if parameters are missing
        return NextResponse.redirect(new URL("/error", req.nextUrl.origin));
      }

      // Check for invalid status values
      if (status !== "success" && status !== "failure") {
        console.log("Invalid payment status detected:", { status });

        // Redirect to the error page if the status is invalid
        return NextResponse.redirect(new URL("/error", req.nextUrl.origin));
      }

      // If parameters are valid, allow the request to proceed
      return NextResponse.next();
    }

    // Allow other requests to pass through
    return NextResponse.next();
  } catch (error) {
    // Explicitly cast `error` to `Error` type or handle unknown errors
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Error in middleware:", errorMessage);

    // Redirect to a generic error page on failure
    return NextResponse.redirect(new URL("/error", req.nextUrl.origin));
  }
}

// Middleware configuration (apply only to specific routes)
export const config = {
  matcher: ["/payment-result"],
};
