"use client";

import { useState } from "react";
import Link from "next/link";
import { verifyPass } from "@/lib/api";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setResult("");
    setLoading(true);
    try {
      const { status } = await verifyPass(code.trim());
      if (status === 200 || status === 201)
        setResult("✅ Verified — pass marked USED");
      else if (status === 409) setResult("⚠️ Already used");
      else if (status === 410) setResult("⌛ Expired");
      else if (status === 404) setResult("❌ Invalid code");
      else setResult("Something went wrong");
    } catch {
      setResult("Could not reach the API. Is it running?");
    } finally {
      setLoading(false);
    }
  };

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
          Verify Pass
        </h1>

        <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
          Pass code
          <input
            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
            placeholder="Enter or scan the code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>

        <button
          onClick={submit}
          disabled={loading || !code.trim()}
          className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {loading ? "Verifying…" : "Verify"}
        </button>

        {result && (
          <p className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-center text-base text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50">
            {result}
          </p>
        )}
      </main>
    </div>
  );
}
