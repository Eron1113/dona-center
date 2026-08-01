import { NextResponse } from "next/server"
import { z } from "zod"
import { saveProfile } from "@/lib/data"
import { createClient } from "@/lib/supabase/server"
import { errorMessage } from "@/lib/utils"

const profileSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().max(100).optional().nullable(),
  lastName: z.string().max(100).optional().nullable(),
  phone: z.string().max(30).optional().nullable(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Të dhëna të pavlefshme" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Only allow saving your own profile
    if (!user || user.id !== parsed.data.id) {
      return NextResponse.json({ error: "I paautorizuar" }, { status: 401 })
    }

    await saveProfile({
      id: parsed.data.id,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      phone: parsed.data.phone,
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: unknown) {
    return NextResponse.json({ error: errorMessage(err) }, { status: 500 })
  }
}
