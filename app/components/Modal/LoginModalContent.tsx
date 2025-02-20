// src/components/LoginModalContent.tsx

import Link from "next/link";

export default function LoginModalContent() {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Welcome Back
      </h2>
      <p className="text-sm text-center text-gray-600 mt-2">
        Sign in to access your account
      </p>

      <form className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="text-sm text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-tertiary"
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
            className="w-full p-3 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-tertiary"
            placeholder="Enter your password"
          />
        </div>
        <div className="text-right">
          <Link
            href="/sifremi-unuttum"
            className="text-sm text-tertiary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="w-full p-3 text-white bg-secondary rounded-md hover:bg-tertiary focus:outline-none focus:ring-2 focus:ring-tertiary"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
