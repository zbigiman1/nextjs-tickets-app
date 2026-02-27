"use client";

import type { Status } from "@/types/Ticket";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  id: string;
  initial: Status;
};

export default function UpdateStatus({ id, initial }: Props) {
  const [status, setStatus] = useState<Status>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tickets/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.error || "Failed to update status");
      }
      router.refresh();
    } catch (err: unknown) {
      function extractMessage(e: unknown) {
        if (typeof e === 'string') return e;
        if (e && typeof e === 'object' && 'message' in e) {
          const m = (e as { message?: unknown }).message;
          if (typeof m === 'string') return m;
        }
        return String(e);
      }
      setError(extractMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-700">{t("updateStatus")}</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
        className="border rounded px-2 py-1"
      >
        {(["new", "in_progress", "closed"] as Status[]).map((k) => (
          <option key={k} value={k}>
            {t(k)}
          </option>
        ))}
      </select>
      <button
        onClick={submit}
        disabled={loading}
        className="bg-sky-600 text-white px-3 py-1 rounded cursor-pointer disabled:opacity-50 hover:bg-sky-700 disabled:hover:bg-sky-600"
      >
        {loading ? "..." : t("update")}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
    </div>
  );
}
