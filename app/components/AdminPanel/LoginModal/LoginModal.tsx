"use client";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "jwt-decode";

import { useState, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/redux/slices/authSlice";
import { signup, signin } from "../../../api/auth/authApi";

interface LoginModalProps {
  onClose: () => void;
}

export const LoginModal = ({ onClose }: LoginModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;

    setLoading(true);
    try {
      const data = await signin(email, password);
      if (data.access_token) {
        // Decode token to inspect claims
        const decodedToken = jwtDecode<JwtPayload>(data.access_token);
        console.log("Decoded token:", decodedToken);

        // Validate token expiration if "exp" claim exists
        if (decodedToken.exp && Date.now() >= decodedToken.exp * 1000) {
          alert("Session has expired. Please log in again.");
          return;
        }

        dispatch(setAccessToken({ accessToken: data.access_token }));
        onClose();
      } else {
        alert("Invalid login credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;
    const fname = (e.target as HTMLFormElement).fname.value;
    const lname = (e.target as HTMLFormElement).lname.value;

    setLoading(true);
    try {
      const data = await signup(
        email,
        password,
        fname,
        lname,
        "admin",
        true,
        true
      );
      if (data.access_token) {
        dispatch(setAccessToken({ accessToken: data.access_token }));
        onClose();
      } else {
        alert(data.detail || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isLoginMode ? "Admin Login" : "Admin Registration"}
        </h2>
        <form onSubmit={isLoginMode ? handleLogin : handleRegister}>
          {!isLoginMode && (
            <>
              <div className="mb-4">
                <label
                  htmlFor="fname"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="lname"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 text-white font-bold rounded-lg transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Processing..." : isLoginMode ? "Login" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          {isLoginMode ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={toggleMode}
                className="text-blue-500 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={toggleMode}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};
