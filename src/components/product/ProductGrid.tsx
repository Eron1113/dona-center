"use client"

import { useState, useMemo } from "react"
import { SlidersHorizontal, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./ProductCard"
import type { Product } from "@/lib/data"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  products: Product[]
  title?: string
  subtitle?: string
  showFilters?: boolean
}

export function ProductGrid({ products, title, subtitle, showFilters = true }: ProductGridProps) {
  const [sortBy, setSortBy] = useState("popular")
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const allColors = useMemo(() => {
    const colors = new Set<string>()
    products.forEach(p => p.colors.forEach(c => colors.add(c.name)))
    return Array.from(colors)
  }, [products])

  const filteredAndSorted = useMemo(() => {
    let filtered = [...products]

    // Price filter
    filtered = filtered.filter(p => {
      const price = p.discountPercent > 0
        ? p.basePrice * (1 - p.discountPercent / 100)
        : p.basePrice
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p =>
        p.colors.some(c => selectedColors.includes(c.name))
      )
    }

    // Sort
    const effectivePrice = (p: Product) =>
      p.discountPercent > 0
        ? p.basePrice * (1 - p.discountPercent / 100)
        : p.basePrice
    switch (sortBy) {
      case "price-asc":
        return filtered.sort((a, b) => effectivePrice(a) - effectivePrice(b))
      case "price-desc":
        return filtered.sort((a, b) => effectivePrice(b) - effectivePrice(a))
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "popular":
      default:
        return filtered.sort((a, b) => b.soldCount - a.soldCount)
    }
  }, [products, sortBy, priceRange, selectedColors])

  return (
    <div>
      {/* Header */}
      {title && (
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-500">{subtitle}</p>}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="lg:hidden"
          >
            <SlidersHorizontal size={16} />
            Filtro
          </Button>
          <p className="text-sm text-gray-500">
            {filteredAndSorted.length} produkte
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 hidden sm:block">Rendit:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border-2 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="popular">Më të Shitura</option>
            <option value="newest">Më të Rejat</option>
            <option value="price-asc">Çmimi: Ulët në Lartë</option>
            <option value="price-desc">Çmimi: Lartë në Ulët</option>
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar - Desktop */}
        {showFilters && (
          <div className={cn(
            "lg:block w-64 shrink-0",
            isFiltersOpen ? "fixed inset-0 z-40 bg-white p-6 overflow-y-auto lg:relative lg:inset-auto lg:z-auto lg:bg-transparent lg:p-0" : "hidden"
          )}>
            {/* Mobile close */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              <h3 className="font-semibold text-lg">Filtro</h3>
              <button onClick={() => setIsFiltersOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <h4 className="font-medium text-sm mb-3">Çmimi</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                      className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    step={5}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full accent-primary"
                  />
                </div>
              </div>

              {/* Colors */}
              <div>
                <h4 className="font-medium text-sm mb-3">Ngjyra</h4>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColors(prev =>
                          prev.includes(color)
                            ? prev.filter(c => c !== color)
                            : [...prev, color]
                        )
                      }}
                      className={cn(
                        "px-3 py-1.5 text-xs rounded-full border-2 transition-all",
                        selectedColors.includes(color)
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 hover:border-gray-400 text-gray-600"
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedColors.length > 0 || priceRange[0] > 0 || priceRange[1] < 200) && (
                <div className="pt-4 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedColors([])
                      setPriceRange([0, 200])
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    Pastro filtrat
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        <div className="flex-1">
          {filteredAndSorted.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredAndSorted.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-2">Nuk u gjetën produkte</p>
              <p className="text-gray-400 text-sm">Provo të ndryshosh filtrat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
