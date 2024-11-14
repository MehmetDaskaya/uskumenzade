// app/page.tsx
"use client";

import "../app/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/anasayfa"); // Redirect to /anasayfa
  }, [router]);

  return null;
}
