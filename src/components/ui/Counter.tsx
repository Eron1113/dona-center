"use client"

import { useEffect, useRef, useState } from "react"

interface CounterProps {
  to: number
  suffix?: string
  duration?: number
  className?: string
}

/**
 * Animated counter — counts from 0 up to `to` when it scrolls into view.
 * Falls back to showing the final value immediately if IntersectionObserver
 * isn't available or the element is already in view without JS.
 */
export function Counter({ to, suffix = "", duration = 1600, className }: CounterProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      typeof IntersectionObserver === "undefined" ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      setValue(to)
      return
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            // easeOutCubic — fast start, gentle landing
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(to * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  )
}
