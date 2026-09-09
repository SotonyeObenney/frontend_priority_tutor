const BASE_URL = "https://localhost:5000";

// headers methods and all those kind of things are included in our ...rest

export async function apiFetch(path, options = {}) {
  const { body, ...rest } = options;
  const isFormData = body instanceof FormData;

  const headers = isFormData
    ? { ...rest.headers }
    : { "Content-Type": "application/json" };
  const response = await fetch(`${BASE_URL}/${path}`, {
    ...rest,
    credentials: "include",
    headers,
    body: isFormData ? body : JSON.stringify(body),
  });

  if (!response.ok) {
    //if trying to parse the error failed then the body wasn't a valid json
    const errorData = await response.json().catch(() => null);
    const error = new Error(errorData?.error || "Request failed");
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.status === 204 ? null : await response.json();
}
