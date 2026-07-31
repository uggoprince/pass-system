"use client";

import { useState } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { createPass } from "@/lib/api";

const inputClass =
  "h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50";

export default function CreatePage() {
  const [form, setForm] = useState({ name: "", host: "", validDate: "" });
  const [code, setCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    setCode(null);
    setLoading(true);
    try {
      const res = await createPass(form);
      setCode(res.code);
    } catch {
      setError("Could not create pass. Is the API running?");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !form.name || !form.validDate;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col gap-6 px-6 py-16">
        <Link
          href="/"
          className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
        >
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Create Pass
        </h1>

        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Name
            <input
              className={inputClass}
              placeholder="Guest name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Host / reference
            <input
              className={inputClass}
              placeholder="Who they're visiting"
              value={form.host}
              onChange={(e) => setForm({ ...form, host: e.target.value })}
            />
          </label>

          <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
            Valid date
            <input
              type="date"
              className={inputClass}
              value={form.validDate}
              onChange={(e) =>
                setForm({ ...form, validDate: e.target.value })
              }
            />
          </label>
        </div>

        <button
          onClick={submit}
          disabled={disabled}
          className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {loading ? "Generating…" : "Generate Pass"}
        </button>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {code && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Pass code:{" "}
              <strong className="font-mono text-zinc-950 dark:text-zinc-50">
                {code}
              </strong>
            </p>
            <QRCodeSVG value={code} size={160} />
            <p className="text-center text-xs text-zinc-500 dark:text-zinc-500">
              Take this code to the Verify screen to redeem it.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
