"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { fetchCurrentUser } from "@/app/api/auth/authApi";
import { User } from "../api/auth/authApi";

export const useAuthRedirect = () => {
  const router = useRouter();

  const getAuthenticatedUser = useCallback(async (): Promise<User | null> => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/giris");
      return null;
    }

    try {
      const user = await fetchCurrentUser(token);
      return user;
    } catch (err) {
      console.error("Unauthorized. Redirecting to login...");
      router.push("/giris");
      return null;
    }
  }, [router]);

  return { getAuthenticatedUser };
};
