import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { getProfile, updateOrderStatus } from "@/lib/data"
import { isAdminEmail } from "@/lib/supabase/admin"
import { errorMessage } from "@/lib/utils"

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

const schema = z.object({
  id: z.string().min(1),
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
})

export async function PATCH(request: Request) {
  if (!(await isAdminUser())) {
    return NextResponse.json({ error: "I paautorizuar" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Të dhëna të pavlefshme" }, { status: 400 })
    }

    await updateOrderStatus(parsed.data.id, parsed.data.status)
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: unknown) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}
