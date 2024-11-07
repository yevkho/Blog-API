import { jwtDecode } from "jwt-decode";

// Function to check if token exists and is still valid
export function tokenExistsAndStillValid() {
  // exists
  const token = localStorage.getItem("Authorization");
  console.log(token);
  if (!token) return false;

  // still valid
  const decodedToken = jwtDecode(token);
  console.log(`Decoded token ${decodedToken}`);
  const currentTime = Date.now() / 1000; // Convert to seconds
  const stillValid = decodedToken.exp > currentTime;
  return stillValid;
}

export function getToken() {
  return localStorage.getItem("Authorization");
}
