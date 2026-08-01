import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getOrdersByUser, getProfile } from "@/lib/data"
import { ProfileClient } from "./ProfileClient"

export const metadata = {
  title: "Profili im | DonaCenter",
  description: "Llogaria juaj DonaCenter.",
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [profile, orders] = await Promise.all([
    getProfile(user.id),
    getOrdersByUser(user.id),
  ])

  return (
    <div className="container py-8 md:py-12">
      <ProfileClient
        email={user.email || ""}
        firstName={profile?.firstName || (user.user_metadata?.first_name as string) || ""}
        lastName={profile?.lastName || (user.user_metadata?.last_name as string) || ""}
        phone={profile?.phone || ""}
        isAdmin={profile?.isAdmin || false}
        orders={orders}
        initialTab={tab === "orders" || tab === "favorites" ? tab : "account"}
      />
    </div>
  )
}
