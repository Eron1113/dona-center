import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/data"
import { uploadImage, deleteImage, publicIdFromUrl } from "@/lib/cloudinary"
import { isAdminEmail } from "@/lib/supabase/admin"
import { errorMessage } from "@/lib/utils"

export const runtime = "nodejs"

async function verifyAdmin(): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  if (await isAdminEmail(user.email)) return true
  const profile = await getProfile(user.id)
  return profile?.isAdmin === true
}

export async function POST(request: Request) {
  try {
    // Verify admin
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "I paautorizuar" }, { status: 403 })
    }

    const body = await request.json()
    const { image } = body as { image?: string }
    if (!image) {
      return NextResponse.json({ error: "Nuk u dërgua asnjë imazh" }, { status: 400 })
    }
    // Guard: only accept image data URLs under ~4MB (base64 is ~33% larger than raw)
    if (!/^data:image\/(jpeg|jpg|png|webp|gif);base64,/.test(image)) {
      return NextResponse.json(
        { error: "Formati i imazhit nuk është i vlefshëm (vetëm JPG, PNG, WebP ose GIF)" },
        { status: 400 }
      )
    }
    // Vercel's serverless function body limit is 4.5MB, and base64 is ~33%
    // larger than the raw bytes. Reject here BEFORE the request body could
    // approach that limit, so the client gets our friendly 400 instead of a
    // cryptic 413 from the platform. 4M base64 chars ≈ 3MB raw.
    if (image.length > 4_000_000) {
      return NextResponse.json({ error: "Imazhi është shumë i madh (max ~3MB)" }, { status: 400 })
    }

    const url = await uploadImage(image, "dona-center/products")
    return NextResponse.json({ url }, { status: 200 })
  } catch (err: unknown) {
    console.error("Upload error:", err)
    return NextResponse.json(
      { error: errorMessage(err, "Dështoi ngarkimi i imazhit") },
      { status: 500 }
    )
  }
}

// Remove a single photo from Cloudinary (called when the admin deletes a
// picture while editing a product).
export async function DELETE(request: Request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "I paautorizuar" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")
    if (!url) {
      return NextResponse.json({ error: "Mungon URL-ja e imazhit" }, { status: 400 })
    }

    const publicId = publicIdFromUrl(url)
    if (!publicId) {
      // Not a Cloudinary URL (e.g. Unsplash demo image) — nothing to delete
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    await deleteImage(publicId)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: unknown) {
    console.error("Delete image error:", err)
    return NextResponse.json(
      { error: errorMessage(err, "Dështoi fshirja e imazhit") },
      { status: 500 }
    )
  }
}
