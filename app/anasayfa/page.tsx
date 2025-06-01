import TestHomeContent from "./TestHomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Üskümenzade | Doğal Bitkisel Ürünler",
  description:
    "Üskümenzade ile doğanın şifasını keşfedin. Bitkisel çaylar, doğal yağlar ve sağlıklı yaşam için blog yazıları burada.",
  keywords: [
    "doğal ürünler",
    "bitkisel çay",
    "bitkisel krem",
    "fitoterapi",
    "sağlıklı yaşam",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Üskümenzade | Doğal Bitkisel Ürünler",
    description:
      "Bitkisel çaylar, doğal ürünler ve sağlıklı yaşam tüyoları Üskümenzade'de sizi bekliyor.",
    url: "https://uskumenzade.com",
    images: [
      {
        url: "/images/hero1.webp",
        width: 1200,
        height: 630,
        alt: "Üskümenzade Hero Görseli",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Üskümenzade | Doğal Bitkisel Ürünler",
    description:
      "Üskümenzade ile doğanın şifasını keşfedin. Bitkisel çaylar, doğal yağlar ve sağlıklı yaşam için blog yazıları burada.",
    images: ["/images/hero1.webp"],
  },
};

export default function HomePage() {
  return <TestHomeContent />;
}
