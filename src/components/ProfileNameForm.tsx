"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProfileNameForm({ initialName }: { initialName?: string | null }) {
  const [name, setName] = useState(initialName ?? "");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const response = await apiFetch("/auth/me", {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Unable to save name");
      }
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
        Welcome aboard! Your name has been saved.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-white/70">Set your name for a personalized welcome.</p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-white/40"
        />
        <button
          onClick={save}
          disabled={saving || name.trim().length < 2}
          className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-emerald-300"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
