const CATALOG_PATH = "/catalog";

const RESPONSE_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Accept, Content-Type",
  "Access-Control-Max-Age": "86400",
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  "Pragma": "no-cache",
  "Expires": "0",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: RESPONSE_HEADERS,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname !== CATALOG_PATH) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: RESPONSE_HEADERS,
      });
    }

    if (request.method !== "GET") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    try {
      const catalogUrl = new URL("/rest/v1/kombat_catalog", env.SUPABASE_URL);
      catalogUrl.searchParams.set(
        "select",
        "id,price_old,price_new,description",
      );
      catalogUrl.searchParams.set("order", "id.asc");

      const upstream = await fetch(catalogUrl, {
        cache: "no-store",
        headers: {
          "apikey": env.SUPABASE_PUBLISHABLE_KEY,
          "Authorization": `Bearer ${env.SUPABASE_PUBLISHABLE_KEY}`,
          "Accept": "application/json",
        },
      });

      if (!upstream.ok) {
        console.error("Catalog upstream status:", upstream.status);
        return jsonResponse({ error: "Catalog is temporarily unavailable" }, 502);
      }

      const rows = await upstream.json();
      if (!Array.isArray(rows)) {
        console.error("Catalog upstream returned an invalid payload");
        return jsonResponse({ error: "Catalog is temporarily unavailable" }, 502);
      }

      const catalog = rows.map((row) => ({
        id: row.id,
        price_old: row.price_old ?? null,
        price_new: row.price_new ?? null,
        description: row.description ?? null,
      }));

      return jsonResponse(catalog);
    } catch (error) {
      console.error("Catalog proxy:", error);
      return jsonResponse({ error: "Catalog is temporarily unavailable" }, 502);
    }
  },
};
