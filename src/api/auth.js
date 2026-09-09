import { apiFetch } from "../api";

export async function login(credentials) {
  return await apiFetch("auth/login", credentials);
}
export async function register(data) {
  return await apiFetch("auth/register", data);
}

export async function getCurrentUser() {
  return;
}
