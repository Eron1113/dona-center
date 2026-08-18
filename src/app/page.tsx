import Link from "next/link"
import Image from "next/image"
import { getFeaturedProducts, getCategories, getProducts } from "@/lib/data"
import { HomeClient } from "./HomeClient"
import { NewsletterForm } from "@/components/newsletter/NewsletterForm"
import { Reveal } from "@/components/ui/Reveal"
import { WaveDivider } from "@/components/ui/WaveDivider"
import { HeroSlideshow } from "@/components/home/HeroSlideshow"
import { Counter } from "@/components/ui/Counter"
import {
  ArrowRight,
  Truck,
  Shield,
  RefreshCw,
  CreditCard,
  ShoppingBag,
  ClipboardList,
  PackageCheck,
  Quote,
  Star,
} from "lucide-react"

// Fresh data on every request so products added in the admin panel show up
// immediately on the storefront (no stale static cache).
export const dynamic = "force-dynamic"

export default async function HomePage() {
  const [featuredProducts, categories, allProducts] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getProducts(),
  ])
  const productCount = allProducts.length

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-primary/[0.03] overflow-hidden">
        {/* Background Pattern — drifting blobs */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-blob-delayed" />
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh]">
            {/* Text Content */}
            <div className="space-y-8 pt-20 lg:pt-0 lg:pl-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full text-sm text-primary font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Koleksioni Verës 2026
              </div>

              <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <span className="text-primary">Moda</span>
                <br />
                <span className="text-gray-900">që flet</span>
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">për ty</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-500 max-w-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                Zbuloni stilin tuaj me koleksionin më të ri të DonaCenter. 
                Cilësi premium, dizajn ekskluziv dhe transport i shpejtë.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <Link
                  href="/women"
                  className="group btn-shine inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.97] shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                  Shiko Koleksionin
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/new-arrivals"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-all active:scale-[0.97]"
                >
                  Të Rejat
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100 animate-in fade-in duration-700 delay-500">
                {[
                  { to: productCount, suffix: "+", label: "Produkte" },
                  { to: 3, suffix: "", label: "Vende Transporti" },
                  { to: 98, suffix: "%", label: "Kënaqësi" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl sm:text-3xl font-bold text-primary">
                      <Counter to={stat.to} suffix={stat.suffix} />
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative lg:h-[80vh] animate-in fade-in duration-1000 delay-300">
              <div className="relative aspect-[3/4] sm:aspect-[4/3] lg:aspect-auto lg:h-full rounded-3xl overflow-hidden shadow-2xl shadow-black/10">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                <HeroSlideshow />
              </div>
              {/* Floating Cards */}
              <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Truck className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Transport i Shpejtë</p>
                    <p className="text-xs text-gray-400">48 orë në Kosovë</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-10 right-6 z-20 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl animate-float-delayed">
                <div className="flex items-center gap-2 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b" aria-hidden="true">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                    </svg>
                  ))}
                </div>
                <p className="font-semibold text-sm">4.9/5 vlerësim</p>
                <p className="text-xs text-gray-400">nga 1,200+ klientë</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave into the marquee */}
      <WaveDivider className="text-primary bg-gradient-to-br from-gray-50 via-white to-gray-100" />

      {/* Marquee Strip */}
      <div className="bg-primary text-primary-foreground py-3 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {[
                "KOLEKSIONI VERËS 2026",
                "TRANSPORT I SHPEJTË 48 ORË",
                "PAGESË NË DORËZIM",
                "SHKËMBIM VETËM NË BUTIK",
                "CILËSI 100% ORIGJINALE",
                "POROSITI TANI",
              ].map((item, i) => (
                <span key={i} className="flex items-center text-xs sm:text-sm font-semibold tracking-[0.2em]">
                  <span className="px-6">{item}</span>
                  <span className="text-white/40">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Features Bar */}
      <section className="border-y border-gray-100 bg-white">
        <div className="container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: "Transport i Shpejtë", desc: "48 orë në Kosovë" },
              { icon: Shield, title: "Cilësi Premium", desc: "Produkte 100% origjinale" },
              { icon: RefreshCw, title: "Shkëmbim Madhësie", desc: "Vetëm në butik" },
              { icon: CreditCard, title: "Pagesë në Dorëzim", desc: "Para në dorëzim" },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary/[0.07] rounded-xl flex items-center justify-center shrink-0">
                  <feature.icon className="text-primary" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{feature.title}</p>
                  <p className="text-xs text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
              Proces i thjeshtë
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Si të Porosisësh
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Tre hapa të thjeshtë dhe moda juaj e re është në derën tuaj
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShoppingBag,
                step: "01",
                title: "Zgjidh Produktet",
                desc: "Shfleto kategoritë dhe zgjidh artikujt që të pëlqejnë. Shtoji në shportë me ngjyrën dhe madhësinë që dëshiron.",
              },
              {
                icon: ClipboardList,
                step: "02",
                title: "Plotëso të Dhënat",
                desc: "Vendos adresën dhe telefonin në hapin e pagesës. Nuk ke nevojë për llogari — porosit si mysafir.",
              },
              {
                icon: PackageCheck,
                step: "03",
                title: "Paguaj në Dorëzim",
                desc: "Porosia ju dërgohet shpejt dhe paguani vetëm kur e merrni në dorë. Asnjë parapagim!",
              },
            ].map((item, index) => (
              <Reveal
                key={item.step}
                delay={index * 120}
                className="h-full"
              >
              <div
                className="group relative p-8 rounded-2xl border border-gray-100/80 bg-white hover:border-primary/20 hover:shadow-xl hover:shadow-primary/[0.06] transition-all duration-300 h-full"
              >
                <span className="absolute top-6 right-8 text-5xl font-heading font-bold text-gray-100/80 group-hover:text-primary/[0.08] transition-colors">
                  {item.step}
                </span>
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <item.icon className="text-primary group-hover:text-primary-foreground" size={26} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Eksploroni</p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">Kategoritë</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Eksploroni koleksionet tona të kuratuara për çdo stil dhe rast
            </p>
          </div>
          {/* Horizontal swipe on mobile, grid on desktop */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-0 sm:snap-none">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="group relative w-[72vw] max-w-[280px] shrink-0 snap-start aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-2xl hover:shadow-black/10 transition-shadow duration-500 sm:w-auto sm:max-w-none"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                  <p className="text-white/70 text-sm">{category.productCount} produkte</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 md:opacity-0 md:group-hover:opacity-100 transition-all md:translate-x-2 md:group-hover:translate-x-0">
                  <ArrowRight size={16} className="text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Wave into the featured section */}
      <WaveDivider className="text-gray-50 bg-white" />

      {/* Featured Products */}
      <section className="py-24 md:py-32 bg-gray-50/50">
        <div className="container">
          <Reveal className="flex items-end justify-between mb-14">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">Produktet e Veçuara</h2>
              <p className="text-gray-500">Zbuloni pjesët më të dashura të koleksionit tonë</p>
            </div>
            <Link
              href="/best-sellers"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Shiko të gjitha
              <ArrowRight size={16} />
            </Link>
          </Reveal>

          <HomeClient products={featuredProducts} />
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
              <div className="absolute bottom-10 right-20 w-60 h-60 border-2 border-white rounded-full" />
            </div>
            <div className="relative z-10 px-8 py-20 md:py-24 md:px-16 text-center text-primary-foreground">
              <h2 className="font-heading text-3xl md:text-5xl font-bold mb-5">
                Koleksioni Verës 2026
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-8">
                Stili i ri ka mbërritur. Zbuloni pjesët më të reja të koleksionit tonë ekskluziv të verës.
              </p>
              <Link
                href="/new-arrivals"
                className="btn-shine inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-all active:scale-[0.97] shadow-xl"
              >
                Shiko Të Rejat
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
              Fjalët e klientëve
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Çfarë Thonë Klientët
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Besimi i mijëra klientëve në Kosovë, Shqipëri dhe Maqedoninë e Veriut
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Ardiana K.",
                city: "Prishtinë",
                text: "Cilësi e jashtëzakonshme! Fustani që porosita ishte edhe më i bukur në realitet. Transporti arriti brenda 2 ditësh.",
              },
              {
                name: "Blerim S.",
                city: "Tiranë",
                text: "Më pëlqen që paguash vetëm kur e merr në dorë. Porositja ishte super e lehtë dhe mbështetja më ndihmoi me madhësinë.",
              },
              {
                name: "Elira M.",
                city: "Shkup",
                text: "Xhaketa që bleva është perfekte. DonaCenter ka stilin më të mirë në rajon — do të porosis sërish patjetër.",
              },
            ].map((t, index) => (
              <Reveal key={t.name} delay={index * 120} className="h-full">
              <div
                className="relative p-8 rounded-2xl bg-gray-50 hover:bg-primary/[0.03] border border-transparent hover:border-primary/[0.08] transition-all duration-300 h-full"
              >
                <Quote className="text-primary/20 mb-4" size={36} />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Wave into the newsletter section */}
      <WaveDivider className="text-gray-50 bg-white" />

      {/* Newsletter */}
      <section className="py-24 bg-gray-50/50">
        <div className="container">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Qëndro të Informuar
            </h2>
            <p className="text-gray-500 mb-8">
              Abonohu në buletinin tonë dhe merr oferta ekskluzive, 
              njoftime për produkte të reja dhe këshilla stili.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}
