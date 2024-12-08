// app/signin/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux"; // Import useDispatch
import { useRouter } from "next/navigation"; // Import useRouter
import { setAccessToken } from "../../redux/slices/authSlice"; // Import the setAccessToken action
import { setUser } from "../../redux/slices/userSlice";
import { signin, fetchCurrentUser } from "../api/auth/authApi"; // Adjust the path if necessary
import { FcGoogle } from "react-icons/fc"; // Add this import at the top

export default function SignInPage() {
  const router = useRouter(); // Initialize router
  const dispatch = useDispatch(); // Initialize dispatch
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Sign in and retrieve token
      const response = await signin(email, password);
      const token = response.access_token;

      // Save token to Redux and localStorage
      dispatch(setAccessToken({ accessToken: token }));
      localStorage.setItem("authToken", token);

      // Fetch user data
      const userData = await fetchCurrentUser(token);

      // Dispatch user data to Redux
      dispatch(
        setUser({
          id: userData.id,
          fname: userData.fname,
          lname: userData.lname,
          email: userData.email,
          role: userData.role,
        })
      );

      // Console log the user data for debugging
      console.log("User data response:", userData);

      setSuccessMessage("Login successful!");

      // Redirect to a protected route
      router.push("/anasayfa");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Welcome Back
        </h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          Sign in to access your account
        </p>

        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="text-right">
            <Link
              href="/sifremi-unuttum"
              className="text-sm text-yellow-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Sign In
          </button>
        </form>

        <div className="relative flex items-center my-6">
          <span className="flex-1 h-px bg-gray-200"></span>
          <p className="px-4 text-sm text-gray-500">Or sign in with</p>
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        <button className="w-full flex items-center justify-center p-3 bg-white border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
          <FcGoogle className="w-5 h-5 mr-2" />
          <span>Sign in with Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
