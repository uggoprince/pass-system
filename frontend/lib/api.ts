const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface CreatePassInput {
  name: string;
  host: string;
  validDate: string;
}

export interface CreatePassResult {
  id: string;
  code: string;
  status: string;
}

export async function createPass(
  data: CreatePassInput,
): Promise<CreatePassResult> {
  const res = await fetch(`${BASE}/passes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create pass");
  return res.json();
}

// Returns the HTTP status so the verify screen can branch:
// 200/201 -> verified, 409 -> already used, 410 -> expired, 404 -> invalid.
export async function verifyPass(code: string): Promise<{ status: number }> {
  const res = await fetch(`${BASE}/passes/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  return { status: res.status };
}
