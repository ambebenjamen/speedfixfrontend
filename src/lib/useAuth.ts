"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
};

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/auth/me");
      if (!res.ok) {
        setUser(null);
      } else {
        const data = await res.json();
        setUser(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    setUser(null);
  };

  useEffect(() => {
    refresh();
  }, []);

  return { user, loading, refresh, logout };
};
