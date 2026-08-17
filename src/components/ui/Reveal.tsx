"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: ReactNode
  className?: string
  /** Delay in ms before the element animates in (for stagger effects) */
  delay?: number
  /** Direction the element slides in from */
  direction?: "up" | "down" | "left" | "right" | "none"
}

/**
 * Fades + slides its children in when they scroll into view.
 * Lightweight (IntersectionObserver, no libraries) and only animates once.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // No-JS / older browsers: never trap content hidden — show it immediately.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const hiddenTransform =
    direction === "up"
      ? "translate-y-8"
      : direction === "down"
        ? "-translate-y-8"
        : direction === "left"
          ? "translate-x-8"
          : direction === "right"
            ? "-translate-x-8"
            : ""

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform",
        visible
          ? "opacity-100 translate-x-0 translate-y-0"
          : cn("opacity-0", hiddenTransform),
        className
      )}
    >
      {children}
    </div>
  )
}
