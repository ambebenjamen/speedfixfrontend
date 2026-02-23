const envApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
export const API_URL = envApiUrl || "";

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Configure it in your frontend host environment variables."
    );
  }

  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  return response;
};
