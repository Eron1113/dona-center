"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200",
    alt: "Moda DonaCenter",
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
    alt: "Koleksioni i ri",
  },
  {
    src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200",
    alt: "Stil elegant",
  },
]

/**
 * Auto-rotating hero slideshow with crossfade + Ken Burns zoom.
 * Pauses while the pointer is over it; dots let visitors jump to a slide.
 */
export function HeroSlideshow() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Respect reduced-motion preference — never auto-advance for those users
    // (dots still work for manual navigation).
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }
    if (paused) return
    timer.current = setInterval(() => {
      setActive(a => (a + 1) % SLIDES.length)
    }, 5000)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [paused])

  return (
    <div
      className="relative w-full h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out",
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={cn(
              "object-cover",
              i === active && "animate-kenburns"
            )}
          />
        </div>
      ))}

      {/* Slide dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              active === i
                ? "w-8 bg-white shadow-md"
                : "w-1.5 bg-white/60 hover:bg-white/90"
            )}
          />
        ))}
      </div>
    </div>
  )
}
