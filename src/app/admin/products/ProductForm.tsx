"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Trash2, Upload, X, Star, Minus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn, errorMessage } from "@/lib/utils"
import type { Product, ProductColor } from "@/lib/data"

// Quick-add presets for the sizes field. Every size is a free text name, so
// shoe sizes (36–45), clothing (S–XXL) or "One Size" all work.
const SIZE_PRESETS = [
  { label: "Klasike", values: "S, M, L, XL" },
  { label: "XS–XXL", values: "XS, S, M, L, XL, XXL" },
  { label: "Këpucë 36–45", values: "36, 37, 38, 39, 40, 41, 42, 43, 44, 45" },
  { label: "One Size", values: "One Size" },
  { label: "Pastro", values: "" },
]

interface ProductFormProps {
  product?: Product
  categories: { id: string; name: string }[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    category: product?.category || categories[0]?.id || "",
    basePrice: product?.basePrice?.toString() || "",
    discountPercent: product?.discountPercent?.toString() || "0",
    tags: (product?.tags || []).join(", "),
    // Preserve size-less products (bags, accessories) exactly
    sizes: product ? (product.sizes || []).join(", ") : "S, M, L, XL",
    featured: product?.featured || false,
    rating: product?.rating?.toString() || "4.5",
    soldCount: product?.soldCount?.toString() || "0",
  })

  // Whether this product has sizes at all. Off = size-less product
  // (bags, accessories, "One Size" items) with a single stock quantity.
  const [hasSizes, setHasSizes] = useState<boolean>(
    product ? (product.sizes?.length ?? 0) > 0 : true
  )

  const [colors, setColors] = useState<ProductColor[]>(
    product?.colors?.length
      ? product.colors
      : [{ name: "", hex: "#000000", images: [] }]
  )

  // Stock matrix keyed by COLOR INDEX (not name) so renaming a color keeps
  // its stock. stock[colorIndex][size] = quantity. Saved values from an
  // existing product are preserved; new colors start empty.
  const [stock, setStock] = useState<Record<number, Record<string, number>>>(() => {
    const initial: Record<number, Record<string, number>> = {}
    ;(product?.colors || []).forEach((c, i) => {
      initial[i] = { ...(product?.stock?.[c.name] || {}) }
    })
    return initial
  })

  // Empty when the "has sizes" toggle is off
  const sizes = hasSizes
    ? form.sizes.split(",").map(s => s.trim()).filter(Boolean)
    : []

  const toggleHasSizes = (on: boolean) => {
    setHasSizes(on)
    if (!on) update("sizes", "")
  }

  // Live slug preview (what the product URL will be)
  const slugPreview =
    form.slug ||
    form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const setStockQty = (colorIndex: number, size: string, qty: number) => {
    const clamped = Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0
    setStock(prev => ({
      ...prev,
      [colorIndex]: { ...(prev[colorIndex] || {}), [size]: clamped },
    }))
  }

  const addColor = () => {
    setColors(prev => [...prev, { name: "", hex: "#000000", images: [] }])
  }

  const removeColor = (index: number) => {
    setColors(prev => prev.filter((_, i) => i !== index))
    // Drop the removed color's stock and shift the remaining keys down
    setStock(prev => {
      const shifted: Record<number, Record<string, number>> = {}
      Object.entries(prev).forEach(([k, v]) => {
        const key = Number(k)
        if (key === index) return // drop the removed color's stock
        shifted[key > index ? key - 1 : key] = v
      })
      return shifted
    })
  }

  // Total pieces across all sizes for one color
  const colorTotal = (colorIndex: number) =>
    Object.values(stock[colorIndex] || {}).reduce((a, b) => a + b, 0)

  // Set every size of a color to the same quantity (quick stock fill)
  const fillAllSizes = (colorIndex: number, qty: number) => {
    const clamped = Number.isFinite(qty) ? Math.max(0, Math.floor(qty)) : 0
    if (sizes.length === 0) {
      setStockQty(colorIndex, "", clamped)
      return
    }
    setStock(prev => {
      const row: Record<string, number> = {}
      sizes.forEach(s => {
        row[s] = clamped
      })
      return { ...prev, [colorIndex]: row }
    })
  }

  // Compress images client-side so big phone photos (3-6MB) fit the 4MB
  // upload limit and upload much faster. Resizes to max 1600px, JPEG q0.82.
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const MAX = 1600
          const scale = Math.min(1, MAX / Math.max(img.width, img.height))
          const canvas = document.createElement("canvas")
          canvas.width = Math.round(img.width * scale)
          canvas.height = Math.round(img.height * scale)
          const ctx = canvas.getContext("2d")
          if (!ctx) return reject(new Error("Kompresimi dështoi"))
          // Fill white first so transparent PNGs don't turn black as JPEG
          ctx.fillStyle = "#fff"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL("image/jpeg", 0.82))
        }
        img.onerror = () => reject(new Error("Imazhi nuk mund të lexohet"))
        img.src = reader.result as string
      }
      reader.onerror = () => reject(new Error("Imazhi nuk mund të lexohet"))
      reader.readAsDataURL(file)
    })
  }

  // Remove a photo from a color locally, and clean it up on Cloudinary if it
  // was a cloud-hosted upload.
  const removeImage = async (colorIndex: number, imgIndex: number) => {
    const img = colors[colorIndex].images[imgIndex]
    setColors(prev =>
      prev.map((c, i) =>
        i === colorIndex
          ? { ...c, images: c.images.filter((_, j) => j !== imgIndex) }
          : c
      )
    )
    // Best-effort cleanup — never blocks the UI
    try {
      if (img.includes("res.cloudinary.com")) {
        await fetch(`/api/upload?url=${encodeURIComponent(img)}`, { method: "DELETE" })
      }
    } catch {}
  }

  const handleImageUpload = async (colorIndex: number, file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await compressImage(file)

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Ngarkimi dështoi")

      setColors(prev =>
        prev.map((c, i) =>
          i === colorIndex ? { ...c, images: [...c.images, data.url] } : c
        )
      )
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ngarkimi i imazhit dështoi")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // ---- Client-side validation before hitting the API ----
    if (!form.name.trim()) {
      setError("Emri i produktit është i detyrueshëm")
      return
    }
    const price = Number(form.basePrice)
    if (!Number.isFinite(price) || price <= 0) {
      setError("Çmimi duhet të jetë më i madh se 0")
      return
    }
    const validColors = colors.filter(c => c.name.trim() && c.images.length > 0)
    if (validColors.length === 0) {
      setError("Shtoni të paktën një ngjyrë me të paktën një foto")
      return
    }
    const colorNames = validColors.map(c => c.name.trim().toLowerCase())
    if (new Set(colorNames).size !== colorNames.length) {
      setError("Emrat e ngjyrave duhet të jenë unikë (p.sh. dy herë 'Zi' nuk lejohet)")
      return
    }
    // At least one color must have stock (a product with zero pieces everywhere
    // can't be sold). Sold-out individual colors are fine — the storefront
    // already shows them as "Mbaruar nga stoku".
    // NOTE: iterate the ORIGINAL colors array so colorTotal(i) indexes match.
    const anyStock = colors.some(
      (c, i) => c.name.trim() && c.images.length > 0 && colorTotal(i) > 0
    )
    if (!anyStock) {
      setError("Të paktën një ngjyrë duhet të ketë 1 copë në stok")
      return
    }

    setSaving(true)

    // Auto-generate slug if empty
    const slug = slugPreview

    const payload = {
      id: product?.id,
      name: form.name.trim(),
      slug,
      description: form.description,
      category: form.category,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      basePrice: price,
      discountPercent: Number(form.discountPercent) || 0,
      colors: validColors.map(c => ({ ...c, name: c.name.trim() })),
      sizes: hasSizes ? sizes : [],
      stock: buildStock(),
      featured: form.featured,
      rating: Math.min(5, Math.max(0, Number(form.rating) || 4.5)),
      soldCount: Math.max(0, Number(form.soldCount) || 0),
    }

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Ruajtja dështoi")
      router.push("/admin/products")
      router.refresh()
    } catch (err: unknown) {
      setError(errorMessage(err))
      setSaving(false)
    }
  }

  // Build the stock map from the matrix state, mapping color index -> name.
  // Size-less products (bags) use the "" key so one total quantity is stored.
  const buildStock = () => {
    const result: Record<string, Record<string, number>> = {}
    colors.forEach((color, colorIndex) => {
      if (!color.name) return
      if (sizes.length === 0) {
        const row = stock[colorIndex] || {}
        result[color.name] = { "": row[""] ?? 0 }
      } else {
        const row: Record<string, number> = {}
        sizes.forEach(size => {
          row[size] = stock[colorIndex]?.[size] ?? 0
        })
        result[color.name] = row
      }
    })
    return result
  }

  const qtyInputClass =
    "w-full h-10 rounded-lg border border-gray-200 bg-white px-2 text-center text-sm font-semibold text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">{error}</p>}

      {/* Basic info */}
      <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Të dhënat bazë</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Emri i produktit *</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={e => update("name", e.target.value)}
              placeholder="Fustan Elegant"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (lëre bosh për automatik)</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={e => update("slug", e.target.value)}
              placeholder="fustan-elegant"
            />
            <p className="text-xs text-gray-400">
              URL: /product/<span className="text-primary font-medium">{slugPreview || "..."}</span>
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Kategoria *</Label>
            <select
              id="category"
              required
              value={form.category}
              onChange={e => update("category", e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {categories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Çmimi (€) *</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                min="0"
                required
                value={form.basePrice}
                onChange={e => update("basePrice", e.target.value)}
                placeholder="49.99"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountPercent">Zbritja (%)</Label>
              <Input
                id="discountPercent"
                type="number"
                min="0"
                max="90"
                value={form.discountPercent}
                onChange={e => update("discountPercent", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Përshkrimi</Label>
          <textarea
            id="description"
            rows={3}
            value={form.description}
            onChange={e => update("description", e.target.value)}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            placeholder="Përshkruani produktin..."
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tags">Etiketat (të ndara me presje)</Label>
            <Input
              id="tags"
              value={form.tags}
              onChange={e => update("tags", e.target.value)}
              placeholder="new-arrivals, best-sellers"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sizes">Madhësitë</Label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={hasSizes}
                onChange={e => toggleHasSizes(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium text-gray-700">
                Produkti ka madhësi
              </span>
            </label>
            {hasSizes ? (
              <>
                <Input
                  id="sizes"
                  value={form.sizes}
                  onChange={e => update("sizes", e.target.value)}
                  placeholder="S, M, L, XL"
                />
                <p className="text-xs text-gray-400">
                  Emrat janë të lirë — p.sh. për këpucë: <span className="font-medium">36, 38, 40</span> ose një madhësi e vetme: <span className="font-medium">One Size</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZE_PRESETS.map(preset => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => update("sizes", preset.values)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                        preset.label === "Pastro"
                          ? "border-red-200 text-red-500 hover:bg-red-50"
                          : "border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary"
                      )}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2.5">
                Pa madhësi = produkt standard (çantë, aksesor, &ldquo;One Size&rdquo;) —
                një sasi e vetme për çdo ngjyrë.
              </p>
            )}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rating">Vlerësimi (1-5)</Label>
            <Input
              id="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={e => update("rating", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="soldCount">Të shitura</Label>
            <Input
              id="soldCount"
              type="number"
              min="0"
              value={form.soldCount}
              onChange={e => update("soldCount", e.target.value)}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={e => setForm(prev => ({ ...prev, featured: e.target.checked }))}
            className="w-4 h-4 accent-primary"
          />
          <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <Star size={14} className="text-yellow-500" /> Produkt i veçuar në faqen kryesore
          </span>
        </label>
      </div>

      {/* Colors & images */}
      <div className="p-6 rounded-2xl border border-gray-100 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Ngjyrat & Foto</h2>
          <Button type="button" variant="outline" size="sm" onClick={addColor}>
            <Plus size={16} /> Shto ngjyrë
          </Button>
        </div>

        {colors.map((color, colorIndex) => (
          <div key={colorIndex} className="p-4 rounded-xl bg-gray-50 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color.hex}
                onChange={e =>
                  setColors(prev =>
                    prev.map((c, i) => (i === colorIndex ? { ...c, hex: e.target.value } : c))
                  )
                }
                className="w-10 h-10 rounded-lg cursor-pointer border border-gray-200 bg-white"
                aria-label="Ngjyra"
              />
              <Input
                value={color.name}
                onChange={e =>
                  setColors(prev =>
                    prev.map((c, i) => (i === colorIndex ? { ...c, name: e.target.value } : c))
                  )
                }
                placeholder="Emri i ngjyrës (p.sh. Zi)"
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeColor(colorIndex)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Hiq ngjyrën"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {color.images.map((img, imgIndex) => (
                <div key={imgIndex} className="relative w-16 h-20 rounded-lg overflow-hidden bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${color.name} ${imgIndex + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(colorIndex, imgIndex)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    aria-label="Hiq foton"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="w-16 h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-all">
                {uploading ? (
                  <Loader2 size={18} className="animate-spin text-primary" />
                ) : (
                  <>
                    <Upload size={18} className="text-gray-400" />
                    <span className="text-[10px] text-gray-400 mt-1">Ngarko</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(colorIndex, file)
                    e.target.value = ""
                  }}
                />
              </label>
            </div>

            {/* Per-color stock for this color */}
            {color.name && (
              <div className="pt-2 border-t border-gray-200">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  <Package size={13} /> Stoqet për {color.name}
                  <span className="ml-auto normal-case font-medium text-gray-400">
                    Totali: {colorTotal(colorIndex)} copë
                  </span>
                </p>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="text-xs text-gray-400">Mbush të gjitha madhësitë:</span>
                  {[0, 3, 5, 10].map(qty => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => fillAllSizes(colorIndex, qty)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:border-primary hover:text-primary transition-colors"
                    >
                      {qty === 0 ? "Zero" : qty}
                    </button>
                  ))}
                </div>
                {sizes.length === 0 ? (
                  // Size-less product (bag, accessory) — one total quantity
                  <div className="flex items-center gap-2 max-w-[200px]">
                    <button
                      type="button"
                      onClick={() => setStockQty(colorIndex, "", (stock[colorIndex]?.[""] ?? 0) - 1)}
                      className="w-9 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
                      aria-label="Zvogëlo"
                    >
                      <Minus size={15} />
                    </button>
                    <Input
                      type="number"
                      min={0}
                      value={stock[colorIndex]?.[""] ?? 0}
                      onChange={e => setStockQty(colorIndex, "", Number(e.target.value))}
                      className="text-center font-semibold"
                      aria-label={`Sasia për ${color.name}`}
                    />
                    <button
                      type="button"
                      onClick={() => setStockQty(colorIndex, "", (stock[colorIndex]?.[""] ?? 0) + 1)}
                      className="w-9 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
                      aria-label="Rrite"
                    >
                      <Plus size={15} />
                    </button>
                  </div>
                ) : (
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(sizes.length, 6)}, minmax(0, 1fr))` }}>
                    {sizes.map(size => (
                      <div key={size} className="space-y-1">
                        <span className="block text-center text-xs font-bold text-gray-600">{size}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setStockQty(colorIndex, size, (stock[colorIndex]?.[size] ?? 0) - 1)}
                            className="w-7 h-10 shrink-0 rounded-l-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
                            aria-label={`Zvogëlo ${size}`}
                          >
                            <Minus size={13} />
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={stock[colorIndex]?.[size] ?? 0}
                            onChange={e => setStockQty(colorIndex, size, Number(e.target.value))}
                            className={qtyInputClass}
                            aria-label={`Stoqe për ${color.name} ${size}`}
                          />
                          <button
                            type="button"
                            onClick={() => setStockQty(colorIndex, size, (stock[colorIndex]?.[size] ?? 0) + 1)}
                            className="w-7 h-10 shrink-0 rounded-r-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition-colors"
                            aria-label={`Rrite ${size}`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || uploading} className="h-12 rounded-xl px-8">
          {saving ? <Loader2 size={18} className="animate-spin" /> : "Ruaj Produktin"}
        </Button>
        <Button type="button" variant="outline" className="h-12 rounded-xl px-8" onClick={() => router.back()}>
          Anulo
        </Button>
      </div>
    </form>
  )
}
