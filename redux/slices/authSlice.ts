// redux/slices/authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  role: string | null; // Optionally store role if needed, else can be removed
}

// Initialize accessToken from localStorage if it exists
const accessToken =
  typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

const initialState: AuthState = {
  accessToken,
  role: null, // Initialize role as null; you can update it with a separate API call or remove it if unnecessary
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(
      state,
      action: PayloadAction<{ accessToken: string; role?: string }>
    ) {
      const { accessToken, role } = action.payload;
      state.accessToken = accessToken;
      state.role = role || null; // Set role if provided, else leave it as null
      localStorage.setItem("authToken", accessToken);
    },
    clearAccessToken(state) {
      state.accessToken = null;
      state.role = null;
      localStorage.removeItem("authToken"); // Remove token from localStorage
    },
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;
