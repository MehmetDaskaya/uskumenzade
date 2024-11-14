// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import RootLayoutWrapper from "./RootLayoutWrapper"; // Import the new wrapper

export const metadata: Metadata = {
  title: "Üskümenzade",
  description: "Bitkisel çaylar, bitkisel kremler, bitkisel yağlar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutWrapper>{children}</RootLayoutWrapper>;
}
