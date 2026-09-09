import { useLoaderData } from "react-router-dom";
import { apiFetch } from "../api";

// 1. Export the loader function
export async function loginLoader() {
  const response = await apiFetch("auth/register", {
    method: "GET",
    credentials: "none",
  });

  if (!response.ok) {
    throw new Error("Could not fetch login information");
  }

  return await response.json();
}

console.log(loginLoader());
