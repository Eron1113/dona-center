/**
 * DonaCenter — seed script
 * Loads the demo products & categories from src/data/*.json into Supabase.
 *
 * Usage (from project root, after setting keys in .env.local):
 *   node supabase/seed.js
 *
 * Safe to run multiple times — uses upsert (id conflict = overwrite).
 */
const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load .env.local manually (node doesn't read it natively)
require("dotenv").config({ path: path.join(__dirname, "..", ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const sb = createClient(supabaseUrl, serviceKey);

const DATA_DIR = path.join(__dirname, "..", "src", "data");

function rowToProductRow(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    category: p.category,
    tags: p.tags,
    base_price: p.basePrice,
    discount_percent: p.discountPercent,
    colors: p.colors,
    sizes: p.sizes,
    stock: p.stock,
    featured: p.featured,
    created_at: p.createdAt,
    rating: p.rating,
    sold_count: p.soldCount,
  };
}

function rowToCategoryRow(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    image: c.image,
    product_count: c.productCount,
  };
}

(async () => {
  // --- Products ---
  const products = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, "products.json"), "utf-8")
  );
  console.log(`Seeding ${products.length} products...`);
  const { error: prodErr } = await sb
    .from("products")
    .upsert(products.map(rowToProductRow));
  if (prodErr) {
    console.error("Products seed FAILED:", prodErr.message);
  } else {
    console.log("Products seeded OK");
  }

  // --- Categories ---
  const categories = JSON.parse(
    fs.readFileSync(path.join(DATA_DIR, "categories.json"), "utf-8")
  );
  console.log(`Seeding ${categories.length} categories...`);
  const { error: catErr } = await sb
    .from("categories")
    .upsert(categories.map(rowToCategoryRow));
  if (catErr) {
    console.error("Categories seed FAILED:", catErr.message);
  } else {
    console.log("Categories seeded OK");
  }

  // --- Verify ---
  const { count: prodCount } = await sb
    .from("products")
    .select("*", { count: "exact", head: true });
  const { count: catCount } = await sb
    .from("categories")
    .select("*", { count: "exact", head: true });
  console.log(`Verify -> products: ${prodCount}, categories: ${catCount}`);

  process.exit(prodErr || catErr ? 1 : 0);
})();
