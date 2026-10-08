export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key?.startsWith("sb_publishable_")) {
    return Response.json({ error: "Auth unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  return Response.json({ url, key }, { headers: { "Cache-Control": "no-store" } });
}
