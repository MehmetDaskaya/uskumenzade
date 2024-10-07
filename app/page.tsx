"use client"; // Mark the component as a Client Component

import "../app/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for app directory

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home"); // Redirect to /home
  }, [router]);

  return null; // No content as it redirects
}
