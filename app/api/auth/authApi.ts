import API_BASE_URL from "../../../util/config";

interface ExtendedError extends Error {
  detail?: string;
}

// Helper function to handle fetch requests
const fetchFromAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    const errorData = await response.json();

    const error: ExtendedError = new Error(
      errorData?.detail || `Error: ${response.statusText}`
    );
    error.detail = errorData?.detail;
    throw error;
  }
  return response.json();
};

// Signup function
export const signup = async (
  email: string,
  password: string,
  fname: string,
  lname: string,
  role: string = "admin", // Ensure admin role
  is_active: boolean = true,
  is_superuser: boolean = true, // Ensure superuser permissions
  is_verified: boolean = true // Ensure verification
) => {
  const response = await fetchFromAPI("/uskumenzade/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      fname,
      lname,
      role,
      is_active,
      is_superuser,
      is_verified,
    }),
  });

  console.log("Signup response:", response); // Log response to debug
  return response;
};

// Signin function
export const signin = async (email: string, password: string) => {
  const body = new URLSearchParams();
  body.append("grant_type", "password");
  body.append("username", email); // email is used as the username
  body.append("password", password);

  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/auth/jwt/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }
  );

  if (!response.ok) {
    const errorData = await response.json(); // Parse the response to extract error details
    throw new Error(errorData?.detail || "Unknown error occurred");
  }

  return response.json();
};

// Authentication verification function
export const authenticate = async (email: string) => {
  return fetchFromAPI("/uskumenzade/api/auth/request-verify-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
};

// Fetch current user information
export const fetchCurrentUser = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/uskumenzade/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const userData = await response.json();
  console.log("Fetched user data:", userData); // Log user data for debugging
  return userData;
};

// Forgot password function
export const requestPasswordReset = async (email: string) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }
  );

  if (response.status === 202) {
    return "Password reset link sent successfully.";
  } else if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.detail || `Error: ${response.statusText}`);
  }
};

// Reset Password function
export const resetPassword = async (token: string, password: string) => {
  const response = await fetch(
    `${API_BASE_URL}/uskumenzade/api/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to reset password. Please check your token.");
  }

  return response.json();
};
