import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/client"
import { redirect } from "next/navigation"
import { LoginForm } from "./LoginForm"

export const metadata = {
  title: "Hyr | DonaCenter",
  description: "Hyni në llogarinë tuaj DonaCenter.",
}

export default async function LoginPage() {
  // Demo mode (no Supabase keys yet) — skip the auth check so the page renders
  if (isSupabaseConfigured()) {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) redirect("/profile")
  }

  return (
    <div className="container py-12 md:py-20 max-w-md">
      <LoginForm />
    </div>
  )
}
