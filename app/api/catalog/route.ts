import { listPublishedCatalog } from "@/lib/catalog-store";

export async function GET() {
  try {
    const items = await listPublishedCatalog();
    return Response.json({ items: items ?? [], connected: items !== null }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Catalog database is unavailable", error);
    return Response.json({ items: [], connected: false }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }
}
