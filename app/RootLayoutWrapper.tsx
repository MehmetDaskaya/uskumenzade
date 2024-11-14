// app/RootLayoutWrapper.tsx
"use client";

import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation"; // Use `usePathname` instead of `headers` for client-side check
import ReduxProvider from "@/redux/provider";
import { Navbar, Footer, GoToTopButton } from "./components/index";

export default function RootLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname(); // Use pathname to check if it's an admin route
  const isAdmin = useMemo(() => pathname?.includes("/admin"), [pathname]);

  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          {!isAdmin && <Navbar viewable={true} />}
          {children}
          {!isAdmin && <Footer viewable={true} />}
          <GoToTopButton />
        </ReduxProvider>
      </body>
    </html>
  );
}
