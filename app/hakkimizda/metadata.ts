// app/hakkimizda/metadata.ts
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda | Üskümenzade",
  description:
    "Pamukdede Ailesi olarak 1953'ten bugüne doğal ürünlerle sağlığınızı destekliyoruz. Misyonumuz, vizyonumuz ve değerlerimiz hakkında bilgi edinin.",
  openGraph: {
    title: "Hakkımızda | Üskümenzade",
    description:
      "1953'ten bugüne doğal sağlık çözümleri sunan Pamukdede Ailesi'nin yolculuğu.",
    url: "https://uskumenzade.com/hakkimizda",
    siteName: "Üskümenzade",
    images: [
      {
        url: "https://uskumenzade.com/images/about-us-banner.webp",
        width: 1200,
        height: 630,
        alt: "Hakkımızda Üskümenzade",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hakkımızda | Üskümenzade",
    description:
      "Pamukdede Ailesi'nin doğadan gelen sağlık yolculuğunu keşfedin.",
    images: ["https://uskumenzade.com/images/about-us-banner.webp"],
  },
  alternates: {
    canonical: "https://uskumenzade.com/hakkimizda",
  },
};
