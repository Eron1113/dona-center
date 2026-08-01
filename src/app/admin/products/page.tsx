import Link from "next/link"
import { getProducts, getCategories } from "@/lib/data"
import { Plus, Pencil, Star } from "lucide-react"
import { DeleteProductButton } from "./DeleteProductButton"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const products = await getProducts()
  const categories = await getCategories()
  const categoryName = (id: string) =>
    categories.find(c => c.id === id)?.name || id

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Produktet</h1>
          <p className="text-gray-500">{products.length} produkte në dyqan</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.97]"
        >
          <Plus size={18} /> Shto Produkt
        </Link>
      </div>

      <div className="p-6 rounded-2xl border border-gray-100 bg-white overflow-x-auto">
        {products.length === 0 ? (
          <p className="text-gray-400 text-center py-10">
            Nuk ka produkte. Shtoni produktin tuaj të parë!
          </p>
        ) : (
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Produkti</th>
                <th className="pb-3 font-medium">Kategoria</th>
                <th className="pb-3 font-medium">Çmimi</th>
                <th className="pb-3 font-medium">Stoku</th>
                <th className="pb-3 font-medium">Shitjet</th>
                <th className="pb-3 font-medium text-right">Veprimet</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => {
                const totalStock = Object.values(product.stock).reduce(
                  (sum: number, sizes: Record<string, number>) =>
                    sum + Object.values(sizes || {}).reduce((a: number, b: number) => a + (Number(b) || 0), 0),
                  0
                )
                return (
                  <tr key={product.id} className="border-b border-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                          {product.colors[0]?.images[0] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.colors[0].images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            {product.featured && (
                              <span className="flex items-center gap-0.5 text-yellow-500">
                                <Star size={10} fill="currentColor" /> Veçuar
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{categoryName(product.category)}</td>
                    <td className="py-3 font-semibold text-gray-900">
                      €{product.basePrice.toFixed(2)}
                      {product.discountPercent > 0 && (
                        <span className="text-xs text-red-500 ml-1">
                          -{product.discountPercent}%
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-gray-600">{totalStock}</td>
                    <td className="py-3 text-gray-600">{product.soldCount}</td>
                    <td className="py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                          aria-label="Ndrysho"
                        >
                          <Pencil size={16} />
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
