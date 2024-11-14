// redux/provider.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { setAccessToken } from "../redux/slices/authSlice";
import store from "./store";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      store.dispatch(setAccessToken(token));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
