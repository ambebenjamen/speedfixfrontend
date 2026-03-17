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

export const awaitRenderWake = async (options: { 
  timeoutMs?: number; 
  intervalMs?: number 
} = {}) => {
  const { timeoutMs = 600000, intervalMs = 2000 } = options; // 10min default, 2s poll
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await apiFetch('/health');
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          return; // Backend awake
        }
      }
    } catch (e) {
      // Ignore errors, keep polling
    }
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  throw new Error('Backend did not wake up within timeout (Render free tier cold starts up to 7-10min). Try refreshing.');
};

