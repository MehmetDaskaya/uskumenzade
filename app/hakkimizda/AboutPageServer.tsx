// app/hakkimizda/AboutPageServer.tsx
import dynamic from "next/dynamic";

const AboutPageContent = dynamic(() => import("./AboutPageClient"), {
  ssr: false,
});

export default function AboutPage() {
  return <AboutPageContent />;
}
