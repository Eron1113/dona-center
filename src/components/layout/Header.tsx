"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search, ShoppingBag, Heart, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/lib/data"

const NAV_ITEMS = [
  { label: "Gratë", href: "/women" },
  { label: "Burrat", href: "/men" },
  { label: "Të Rejat", href: "/new-arrivals" },
  { label: "Më të Shitura", href: "/best-sellers" },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("dona-center-cart") || "[]") as CartItem[]
      setCartCount(cart.reduce((sum: number, item) => sum + item.quantity, 0))
    }
    updateCartCount()
    window.addEventListener("storage", updateCartCount)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("storage", updateCartCount)
    }
  }, [])

  useEffect(() => {
    // Close mobile menu / search when navigating
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI state on route change
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground text-[11px] sm:text-xs py-2 px-3 text-center tracking-wide">
        TRANSPORT I SHPEJTË 48 ORË NË KOSOVË • PAGESË NË DORËZIM
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b"
            : "bg-white border-b border-gray-100"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 -ml-2 text-gray-700 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-primary">
                Dona<span className="text-accent-foreground">Center</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-all duration-200 relative py-1 group",
                    pathname === item.href
                      ? "text-primary"
                      : "text-gray-600 hover:text-primary"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300",
                    pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                  )} />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-700 hover:text-primary transition-colors"
                aria-label="Kërko"
              >
                <Search size={20} />
              </button>

              {/* Favorites - Desktop */}
              <Link
                href="/profile?tab=favorites"
                className="hidden md:flex p-2 text-gray-700 hover:text-primary transition-colors"
                aria-label="Të preferuarat"
              >
                <Heart size={20} />
              </Link>

              {/* Account */}
              <Link
                href="/login"
                className="hidden md:flex p-2 text-gray-700 hover:text-primary transition-colors"
                aria-label="Profili"
              >
                <User size={20} />
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-primary transition-colors"
                aria-label="Shporta"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="border-t bg-white animate-in slide-in-from-top-2 duration-200">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Kërko produkte, kategori, ngjyra..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 text-base border-2 focus-visible:ring-primary"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute top-16 left-0 right-0 bg-white shadow-2xl border-t animate-in slide-in-from-top-2 duration-200">
            <nav className="px-4 py-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block px-4 py-3 text-base font-medium rounded-lg transition-all",
                    pathname === item.href
                      ? "bg-primary/5 text-primary"
                      : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-4 border-gray-100" />
              <Link
                href="/login"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
              >
                <User size={20} />
                Llogaria ime
              </Link>
              <Link
                href="/profile?tab=favorites"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
              >
                <Heart size={20} />
                Të preferuarat
              </Link>
              <Link
                href="/track-order"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
              >
                Gjurmo Porosinë
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
              >
                Kontakt
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
