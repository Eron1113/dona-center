import { getProducts } from "./data";
import type { Product } from "./data";

export type OutfitSlot = "top" | "bottom" | "accessory";

// Classify a product into an outfit slot based on its name.
// Order matters — check specific pieces (xhup = denim jacket) before
// generic keywords that could collide (e.g. "xhinse" in jeans vs xhup).
export function classifyProduct(product: Product): OutfitSlot {
  const name = product.name.toLowerCase();

  if (name.includes("xhup")) return "top"; // denim jacket / hoodie
  if (name.includes("xhaket")) return "top"; // jacket / coat
  if (name.includes("pantallona")) return "bottom"; // trousers / jeans
  if (name.includes("fund")) return "bottom"; // skirt
  if (name.includes("çant")) return "accessory"; // handbag
  if (name.includes("këpuc")) return "accessory"; // shoes
  if (name.includes("fustan")) return "top"; // dress
  if (name.includes("bluz")) return "top"; // blouse / top
  if (name.includes("këmish")) return "top"; // shirt
  if (name.includes("trikotazh")) return "top"; // knitwear
  if (name.includes("pulover")) return "top"; // sweater
  if (name.includes("tshirt") || name.includes("t-shirt")) return "top"; // t-shirt

  return "top";
}

/**
 * Find complementary "outfit" items for a product from the same
 * category (women/men): tops pair with bottoms + accessories, etc.
 */
export async function getStyleMatches(
  product: Product,
  limit: number = 3
): Promise<Product[]> {
  const slot = classifyProduct(product);
  const products = await getProducts();
  const sameCategory = products.filter(
    p => p.category === product.category && p.id !== product.id
  );

  // Which slots complement the current one (in priority order)
  const complementary: OutfitSlot[] =
    slot === "top"
      ? ["bottom", "accessory", "top"]
      : slot === "bottom"
        ? ["top", "accessory", "bottom"]
        : ["top", "bottom", "accessory"];

  const matches: Product[] = [];
  for (const targetSlot of complementary) {
    const candidates = sameCategory
      .filter(p => classifyProduct(p) === targetSlot && !matches.includes(p))
      .sort((a, b) => b.soldCount - a.soldCount); // show popular picks first

    for (const candidate of candidates) {
      if (matches.length >= limit) break;
      matches.push(candidate);
    }
    if (matches.length >= limit) break;
  }

  // Fallback: fill with anything in-stock from the same category
  for (const p of sameCategory) {
    if (matches.length >= limit) break;
    if (matches.includes(p)) continue;
    const hasStock = Object.values(p.stock || {}).some(sizes =>
      Object.values(sizes || {}).some((n: number) => n > 0)
    )
    if (hasStock) matches.push(p)
  }

  return matches.slice(0, limit);
}
