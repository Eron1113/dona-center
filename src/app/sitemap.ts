import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/data"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://donacenter.com"

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/women`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/men`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/new-arrivals`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/best-sellers`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/track-order`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/shipping-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/return-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ]

  let products: Awaited<ReturnType<typeof getProducts>> = []
  try {
    products = await getProducts()
  } catch {
    // sitemap still works with static routes if DB is not reachable
  }

  const productRoutes = products.map(product => ({
    url: `${baseUrl}/product/${product.slug}`,
    lastModified: new Date(product.createdAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...productRoutes]
}
