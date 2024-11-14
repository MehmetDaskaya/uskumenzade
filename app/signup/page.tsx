"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "../api/auth/authApi";

export default function SignUpPage() {
  // State for form fields
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Call signup API function without assigning to 'response'
      await signup(email, password, fname, lname);

      setSuccessMessage("Account created successfully! You can now log in.");
      setFname("");
      setLname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
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
          Create an Account
        </h2>
        <p className="text-sm text-center text-gray-600 mt-2">
          Join us and start your journey
        </p>

        {/* Display success or error messages */}
        {errorMessage && (
          <p className="text-red-500 text-center mt-4">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="text-sm text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="lname" className="text-sm text-gray-700">
              Last Name
            </label>
            <input
              id="lname"
              type="text"
              required
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
              placeholder="Enter your last name"
            />
          </div>
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
              placeholder="Create a password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="text-sm text-gray-700">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Sign Up
          </button>
        </form>

        <div className="relative flex items-center my-6">
          <span className="flex-1 h-px bg-gray-200"></span>
          <p className="px-4 text-sm text-gray-500">Or sign up with</p>
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        <button className="w-full flex items-center justify-center p-3 bg-white border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300">
          <img
            src="/images/google-logo.png"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          <span>Sign up with Google</span>
        </button>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="text-yellow-500 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
