// authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
}

// Initialize accessToken from localStorage if it exists
const initialState: AuthState = {
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("authToken") : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      localStorage.setItem("authToken", action.payload); // Save token to localStorage
    },
    clearAccessToken(state) {
      state.accessToken = null;
      localStorage.removeItem("authToken"); // Remove token from localStorage
    },
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;
