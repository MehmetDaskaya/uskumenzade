// app/layout.tsx

import "./globals.css";
import RootLayoutWrapper from "./RootLayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayoutWrapper>{children}</RootLayoutWrapper>;
}
