"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";


type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
  suspended: boolean;
  deleted: boolean;
  scanCount: number;
};

type ProUser = {
  id: string;
  email: string;
  name?: string | null;
  plan: string;
  status: string;
  currentPeriodEnd?: string | null;
  createdAt?: string | null;
};


export default function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [proUsers, setProUsers] = useState<ProUser[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersRes, proUsersRes] = await Promise.all([
        apiFetch("/admin/users", { method: "GET" }),
        apiFetch("/admin/pro-users", { method: "GET" }),
      ]);
      if (!usersRes.ok) {
        const data = await usersRes.json().catch(() => null);
        throw new Error(data?.error || "Unable to load users");
      }
      if (!proUsersRes.ok) {
        const data = await proUsersRes.json().catch(() => null);
        throw new Error(data?.error || "Unable to load pro users");
      }
      const usersData = await usersRes.json();
      const proUsersData = await proUsersRes.json();
      setUsers(usersData);
      setProUsers(proUsersData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (userId: string, action: "suspend" | "delete") => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`/admin/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => null);
      if (data?.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  [action === "suspend" ? "suspended" : "deleted"]: true,
                }
              : u
          )
        );
        return;
      }
      setError(data?.error || "Unable to update user.");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <SiteHeader />
      <div className="mx-auto min-h-[calc(100vh-160px)] max-w-6xl px-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-300">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Owner Dashboard</h1>
          </div>
          <button
            onClick={load}
            className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/80"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            Loading admin data...
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-rose-400/30 bg-rose-400/10 p-6 text-sm text-rose-200">
            <p>{error}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={load}
                className="rounded-full border border-white/20 px-4 py-2 text-xs text-white"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Pro Users Table */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-emerald-300 mb-2">Pro/Upgraded Users</h2>
              <div className="overflow-x-auto rounded-xl shadow-lg">
                <table className="min-w-full rounded-xl bg-slate-900">
                  <thead>
                    <tr className="bg-slate-800 text-emerald-300">
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Period End</th>
                      <th className="px-4 py-3 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-3 text-center text-white/60">
                          No pro/upgraded users found.
                        </td>
                      </tr>
                    ) : (
                      proUsers.map((user) => (
                        <tr key={user.id} className="border-b border-slate-800 transition hover:bg-slate-800">
                          <td className="px-4 py-2 font-mono text-sm">{user.email}</td>
                          <td className="px-4 py-2">{user.name || <span className="text-white/40">(none)</span>}</td>
                          <td className="px-4 py-2">{user.plan}</td>
                          <td className="px-4 py-2">{user.status}</td>
                          <td className="px-4 py-2">{user.currentPeriodEnd ? new Date(user.currentPeriodEnd).toLocaleDateString() : "-"}</td>
                          <td className="px-4 py-2">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Existing Users Table */}
            <div className="mt-8 flex flex-wrap gap-6">
              <div className="min-w-55 rounded-2xl bg-slate-900 p-6 shadow-lg">
                <div className="text-4xl font-bold text-emerald-300">
                  {users.length}
                </div>
                <div className="mt-2 text-white/70">Total Users</div>
              </div>
              <div className="min-w-55 rounded-2xl bg-slate-900 p-6 shadow-lg">
                <div className="text-4xl font-bold text-emerald-300">
                  {users.reduce((a, u) => a + (u.scanCount || 0), 0)}
                </div>
                <div className="mt-2 text-white/70">Total Scans</div>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto rounded-xl shadow-lg">
              <table className="min-w-full rounded-xl bg-slate-900">
                <thead>
                  <tr className="bg-slate-800 text-emerald-300">
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-center">Scans</th>
                    <th className="px-4 py-3 text-center">Suspended</th>
                    <th className="px-4 py-3 text-center">Deleted</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-slate-800 transition hover:bg-slate-800"
                    >
                      <td className="px-4 py-2 font-mono text-sm">
                        {user.email}
                      </td>
                      <td className="px-4 py-2">
                        {user.name || (
                          <span className="text-white/40">(none)</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center font-semibold">
                        {user.scanCount ?? 0}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {user.suspended ? (
                          <span className="font-bold text-yellow-400">Yes</span>
                        ) : (
                          "No"
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {user.deleted ? (
                          <span className="font-bold text-red-400">Yes</span>
                        ) : (
                          "No"
                        )}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {!user.suspended && (
                          <button
                            className="mr-2 rounded bg-yellow-500 px-3 py-1 font-semibold text-slate-900 hover:bg-yellow-400"
                            onClick={() => handleAction(user.id, "suspend")}
                          >
                            Suspend
                          </button>
                        )}
                        {!user.deleted && (
                          <button
                            className="rounded bg-red-500 px-3 py-1 font-semibold text-white hover:bg-red-400"
                            onClick={() => handleAction(user.id, "delete")}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
