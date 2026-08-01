import Link from "next/link"
import { getProducts, getOrders, getCategories } from "@/lib/data"
import { Package, ShoppingCart, FolderTree, Euro, ArrowRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const [products, orders, categories] = await Promise.all([
    getProducts(),
    getOrders(),
    getCategories(),
  ])

  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0)

  const pendingOrders = orders.filter(o => o.status === "pending").length

  const stats = [
    { label: "Produkte", value: products.length, icon: Package, href: "/admin/products" },
    { label: "Porosi", value: orders.length, icon: ShoppingCart, href: "/admin/orders" },
    { label: "Kategoritë", value: categories.length, icon: FolderTree, href: "/admin/categories" },
    { label: "Të ardhurat", value: `€${totalRevenue.toFixed(0)}`, icon: Euro, href: "/admin/orders" },
  ]

  const recentOrders = orders.slice(0, 8)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Paneli i Adminit</h1>
        <p className="text-gray-500">Menaxho dyqanin tënd DonaCenter</p>
        {pendingOrders > 0 && (
          <p className="mt-3 inline-flex items-center gap-2 text-sm bg-yellow-100 text-yellow-800 rounded-full px-4 py-1.5 font-medium">
            🔔 {pendingOrders} porosi në pritje për konfirmim
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <Link
            key={stat.label}
            href={stat.href}
            className="p-6 rounded-2xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <stat.icon className="text-primary mb-3" size={24} />
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="p-6 rounded-2xl border border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Porositë e fundit</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Shiko të gjitha <ArrowRight size={14} />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            Nuk ka porosi ende. Kur dikush porosit, do ta shihni këtu.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Porosia</th>
                  <th className="pb-3 font-medium">Klienti</th>
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium">Totali</th>
                  <th className="pb-3 font-medium">Statusi</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="py-3 text-gray-600">
                      {order.customerName} {order.customerLastName}
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="py-3 font-semibold">€{order.total.toFixed(2)}</td>
                    <td className="py-3">
                      <span className="text-xs font-semibold bg-gray-100 text-gray-700 rounded-full px-3 py-1 capitalize">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
