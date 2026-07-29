export async function getDashboardSummary() {
  const res = await fetch("/api/dashboard/summary");

  if (!res.ok) {
    throw new Error("Failed to load dashboard");
  }

  return res.json();
}