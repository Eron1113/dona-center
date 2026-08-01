"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Abonimi dështoi")
      }
      setStatus("success")
      setEmail("")
      setTimeout(() => setStatus("idle"), 4000)
    } catch {
      setStatus("error")
      setTimeout(() => setStatus("idle"), 4000)
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium",
          dark ? "bg-white/10 text-white" : "bg-green-50 text-green-700"
        )}
      >
        <Check size={18} /> Faleminderit! U abonuat me sukses.
      </div>
    )
  }

  if (status === "error") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium",
          dark ? "bg-white/10 text-white" : "bg-red-50 text-red-600"
        )}
      >
        Diçka shkoi keq. Provo përsëri më vonë.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <input
        type="email"
        required
        placeholder="Email-i juaj"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className={cn(
          "flex-1 min-w-0 px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all",
          dark
            ? "bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:ring-white/30"
            : "border-2 border-gray-200 focus:ring-primary/20 focus:border-primary"
        )}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "px-6 py-3 font-semibold rounded-lg transition-all active:scale-[0.97] shrink-0",
          dark
            ? "bg-white text-primary hover:bg-white/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {status === "loading" ? <Loader2 size={18} className="animate-spin" /> : "Abonohu"}
      </button>
    </form>
  )
}
