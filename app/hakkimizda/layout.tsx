import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda - Uskumenzade",
  description:
    "Uskumenzade'nin yolculuğunu, misyonunu ve vizyonunu keşfedin. Doğadan gelen en iyileri çay, merhem ve kremlerle size nasıl sunduğumuzu öğrenin.",
  keywords: [
    "Uskumenzade",
    "Hakkımızda",
    "Çay",
    "Merhem",
    "Krem",
    "Doğal Ürünler",
    "Organik",
    "E-Ticaret",
  ],
};

export default function HakkimizdaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
