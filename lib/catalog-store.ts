import "server-only";
import { categories, type Category } from "@/app/catalog-taxonomy";
import type { City, Payment, Provider } from "@/app/catalog-data";

type Row = {
  id: number; name: string; kind: string; category: string; service: string;
  description: string | null; city: string; address: string; lat: number; lng: number;
  locations: unknown; offerings: unknown; brands: string[]; supported_models: unknown;
  price_byn: number; price_label: string; payment_methods: string[]; phone: string;
  open_now: boolean; available_today: boolean; around_clock: boolean;
  mobile: boolean; urgent: boolean; promoted: boolean; is_demo: boolean;
  created_at: string;
};

const kinds = new Set(["Автосервис","Частный мастер","Выездной специалист"]);

function mapRow(row: Row): Provider | null {
  if (!Number.isSafeInteger(row.id) || !row.city?.trim() || !categories.includes(row.category as Category)) return null;
  const locations = Array.isArray(row.locations) ? row.locations.filter((item): item is {address:string;lat:number;lng:number} =>
    !!item && typeof item === "object" && typeof item.address === "string" && typeof item.lat === "number" && typeof item.lng === "number") : [];
  const offerings = Array.isArray(row.offerings) ? row.offerings.filter((item): item is {name:string;price:string} =>
    !!item && typeof item === "object" && typeof item.name === "string" && typeof item.price === "string") : [];
  const supportedModels: Record<string,string[]> = {};
  if (row.supported_models && typeof row.supported_models === "object" && !Array.isArray(row.supported_models)) {
    for (const [brand, values] of Object.entries(row.supported_models)) {
      if (Array.isArray(values)) supportedModels[brand] = values.filter((value): value is string => typeof value === "string");
    }
  }
  return {
    id: row.id, name: row.name, kind: kinds.has(row.kind) ? row.kind as Provider["kind"] : "Автосервис",
    category: row.category as Category, service: row.service, description: row.description ?? undefined,
    city: row.city as City, address: row.address, lat: row.lat, lng: row.lng,
    locations: locations.length ? locations : undefined, offerings: offerings.length ? offerings : undefined,
    brands: Array.isArray(row.brands) && row.brands.length ? row.brands : ["Все марки"],
    supportedModels, price: row.price_byn, priceLabel: row.price_label,
    payment: (Array.isArray(row.payment_methods) ? row.payment_methods : []).filter((value): value is Payment => value === "card" || value === "cash"),
    phone: row.phone, openNow: row.open_now, availableToday: row.available_today,
    aroundClock: row.around_clock, mobile: row.mobile, urgent: row.urgent,
    promoted: row.promoted, isDemo: row.is_demo, createdAt: Date.parse(row.created_at) || 0,
  };
}

function connection() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function query(path: string): Promise<Provider[] | null> {
  const config = connection();
  if (!config) return null;
  const response = await fetch(`${config.url}/rest/v1/catalog_entries?${path}`, {
    headers: {
      apikey: config.key,
      ...(config.key.startsWith("eyJ") ? { Authorization: `Bearer ${config.key}` } : {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Catalog database returned ${response.status}`);
  const rows = await response.json() as Row[];
  if (!Array.isArray(rows)) throw new Error("Catalog database returned an invalid response");
  return rows.map(mapRow).filter((item): item is Provider => item !== null);
}

export async function listPublishedCatalog(): Promise<Provider[] | null> {
  return query("select=*&status=eq.published&order=id.asc&limit=500");
}

export async function getPublishedCatalogEntry(id: number): Promise<Provider | null> {
  if (!Number.isSafeInteger(id) || id < 1000) return null;
  const items = await query(`select=*&status=eq.published&id=eq.${id}&limit=1`);
  return items?.[0] ?? null;
}
