import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getProfile } from "@/lib/data"
import { isAdminEmail } from "@/lib/supabase/admin"
import { LayoutDashboard, Package, ShoppingCart, FolderTree, ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Admin | DonaCenter",
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const profile = await getProfile(user.id)
  const isAdmin = profile?.isAdmin === true || (await isAdminEmail(user.email))

  if (!isAdmin) {
    redirect("/profile?tab=account")
  }

  const NAV = [
    { href: "/admin", label: "Paneli", icon: LayoutDashboard },
    { href: "/admin/products", label: "Produktet", icon: Package },
    { href: "/admin/orders", label: "Porositë", icon: ShoppingCart },
    { href: "/admin/categories", label: "Kategoritë", icon: FolderTree },
  ]

  return (
    <div className="min-h-[70vh] container py-8 md:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft size={16} /> Kthehu në dyqan
      </Link>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <nav className="space-y-1 md:sticky md:top-24">
            {NAV.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary transition-all"
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
