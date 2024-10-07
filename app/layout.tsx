import type { Metadata } from "next";
import { headers } from "next/headers"; // Import headers to get request info
import "./globals.css";

import { Navbar, Footer, GoToTopButton } from "./components/index";

export const metadata: Metadata = {
  title: "Üskümenzade",
  description: "Bitkisel çaylar, bitkisel kremler, bitkisel yağlar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers(); // Get headers from the request
  const referer = headersList.get("referer"); // Get the referer (may include the path)
  const isAdmin = referer?.includes("/admin"); // Check if the referer contains "/admin"

  return (
    <html lang="en">
      <body>
        {/* Conditionally render Navbar and Footer */}
        {!isAdmin && <Navbar viewable={true} />}
        {children}
        {!isAdmin && <Footer viewable={true} />}
        <GoToTopButton />
      </body>
    </html>
  );
}
