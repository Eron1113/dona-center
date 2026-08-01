import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { getProfile, saveProduct, deleteProduct, getProductById, getProductBySlug } from "@/lib/data"
import { isAdminEmail } from "@/lib/supabase/admin"
import { errorMessage } from "@/lib/utils"
import { deleteImage, publicIdFromUrl } from "@/lib/cloudinary"

export const runtime = "nodejs"

async function isAdminUser(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  if (await isAdminEmail(user.email)) return true
  const profile = await getProfile(user.id)
  return profile?.isAdmin === true
}

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().default(""),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  basePrice: z.number().nonnegative(),
  discountPercent: z.number().min(0).max(90).default(0),
  colors: z.array(
    z.object({
      name: z.string().min(1),
      hex: z.string().min(1),
      images: z.array(z.string().min(1)).min(1),
    })
  ).min(1),
  sizes: z.array(z.string()).default([]),
  stock: z.record(z.string(), z.record(z.string(), z.number().nonnegative())).default({}),
  featured: z.boolean().default(false),
  rating: z.number().min(0).max(5).default(4.5),
  soldCount: z.number().nonnegative().default(0),
})

export async function POST(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "I paautorizuar" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = productSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Të dhëna të pavlefshme: " + parsed.error.issues.map(i => i.message).join(", ") },
        { status: 400 }
      )
    }

    const data = parsed.data
    const existing = data.id ? await getProductById(data.id) : undefined

    // Slug is UNIQUE in the products table — check before upserting so a
    // duplicate returns a clean 409 instead of a Postgres violation 500.
    // Runs for creates (data.id is undefined) AND renames (self excluded
    // by id), so editing a product's slug to one another product owns
    // can't slip through to the DB.
    const slugOwner = await getProductBySlug(data.slug)
    if (slugOwner && slugOwner.id !== data.id) {
      return NextResponse.json(
        { error: "Ekziston tashmë një produkt me këtë slug. Ndrysho slug-in." },
        { status: 409 }
      )
    }

    const product = {
      id: data.id || crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
      description: data.description,
      category: data.category,
      tags: data.tags,
      basePrice: data.basePrice,
      discountPercent: data.discountPercent,
      colors: data.colors,
      sizes: data.sizes,
      stock: data.stock,
      featured: data.featured,
      rating: data.rating,
      soldCount: data.soldCount,
      createdAt: existing?.createdAt || new Date().toISOString(),
    }

    await saveProduct(product)
    return NextResponse.json({ ok: true, id: product.id }, { status: 200 })
  } catch (err: unknown) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "I paautorizuar" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) {
    return NextResponse.json({ error: "Mungon ID-ja" }, { status: 400 })
  }

  try {
    // Delete the product's Cloudinary photos too, so they don't waste storage quota
    const existing = await getProductById(id)
    if (existing) {
      const urls = existing.colors.flatMap(c => c.images)
      await Promise.allSettled(
        urls.map(url => {
          const publicId = publicIdFromUrl(url)
          return publicId ? deleteImage(publicId) : Promise.resolve()
        })
      )
    }

    await deleteProduct(id)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: unknown) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}
