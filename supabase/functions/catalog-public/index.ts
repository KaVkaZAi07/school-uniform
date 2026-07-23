const allowedOrigin = "https://kavkazai07.github.io";

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin") ?? "";
  if (origin !== allowedOrigin) {
    return new Response(
      JSON.stringify({ error: "Origin is not allowed" }),
      { status: 403, headers: { "Content-Type": "application/json" } },
    );
  }

  const cors = corsHeaders(origin);
  const responseHeaders = {
    ...cors,
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Expires": "0",
    "X-Content-Type-Options": "nosniff",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }

  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: responseHeaders },
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !anonKey) {
      throw new Error("Required Supabase environment variables are missing");
    }

    const catalogUrl =
      `${supabaseUrl}/rest/v1/kombat_catalog?select=id,price_old,price_new,description&order=id.asc`;
    const upstream = await fetch(catalogUrl, {
      cache: "no-store",
      headers: {
        "apikey": anonKey,
        "Authorization": `Bearer ${anonKey}`,
        "Accept": "application/json",
      },
    });

    if (!upstream.ok) {
      throw new Error(`Catalog query failed with status ${upstream.status}`);
    }

    const catalog = await upstream.json();
    if (!Array.isArray(catalog)) {
      throw new Error("Catalog response is not an array");
    }

    return new Response(JSON.stringify(catalog), {
      status: 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("catalog-public:", error);
    return new Response(
      JSON.stringify({ error: "Catalog is temporarily unavailable" }),
      { status: 500, headers: responseHeaders },
    );
  }
});
