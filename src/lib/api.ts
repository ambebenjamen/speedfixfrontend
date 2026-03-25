const envApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
export const API_URL = envApiUrl ? envApiUrl.replace(/\/+$/, "") : "";

let wakePromise: Promise<void> | null = null;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const doFetch = async (path: string, options: RequestInit = {}) => {
  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Configure it in your frontend host environment variables."
    );
  }

  const headers = new Headers(options.headers ?? {});
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
};

export const awaitRenderWake = async (
  options: {
    timeoutMs?: number;
    intervalMs?: number;
  } = {}
) => {
  const { timeoutMs = 600000, intervalMs = 2000 } = options;

  if (!API_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not set. Configure it in your frontend host environment variables."
    );
  }

  if (wakePromise) {
    return wakePromise;
  }

  wakePromise = (async () => {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      try {
        const res = await doFetch("/health");
        if (res.ok) {
          const data = await res.json().catch(() => null);
          if (data?.ok) {
            return;
          }
        }
      } catch {
        // Ignore and keep polling while Render wakes the backend.
      }
      await sleep(intervalMs);
    }

    throw new Error(
      "Backend did not wake up within timeout (Render free tier cold starts up to 7-10min). Try refreshing."
    );
  })();

  try {
    await wakePromise;
  } finally {
    wakePromise = null;
  }
};

export const apiFetch = async (path: string, options: RequestInit = {}) => {
  try {
    const response = await doFetch(path, options);
    if ([502, 503, 504].includes(response.status)) {
      await awaitRenderWake({ timeoutMs: 180000, intervalMs: 2500 });
      return doFetch(path, options);
    }
    return response;
  } catch {
    await awaitRenderWake({ timeoutMs: 180000, intervalMs: 2500 });
    return doFetch(path, options);
  }
};
