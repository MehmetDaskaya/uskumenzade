// api/authApi.ts
import API_BASE_URL from "../../../util/config";

// Helper function to handle fetch requests
const fetchFromAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  return response.json();
};

// Signup function
export const signup = async (
  email: string,
  password: string,
  fname: string,
  lname: string,
  role: string = "user",
  is_active: boolean = true,
  is_superuser: boolean = false,
  is_verified: boolean = false
) => {
  return fetchFromAPI("/uskumenzade/api/auth/register", {
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
    throw new Error(`Error: ${response.statusText}`);
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
