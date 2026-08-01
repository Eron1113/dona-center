"use client"

import { Send } from "lucide-react"

export function ContactForm() {
  // Opens the visitor's email client with a pre-filled message (no backend
  // needed). The form resets so it can be used again for another message.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const subject = encodeURIComponent(String(fd.get("subject") || "Pyetje"))
    const body = encodeURIComponent(
      `Emri: ${fd.get("name")}\nEmail: ${fd.get("email")}\n\n${fd.get("message")}`
    )
    window.location.href = `mailto:info@donacenter.com?subject=${subject}&body=${body}`
    e.currentTarget.reset()
  }

  return (
    <form className="space-y-4 p-6 rounded-2xl border border-gray-100" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-gray-900">Na shkruani</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          name="name"
          required
          placeholder="Emri juaj"
          className="flex h-11 w-full rounded-xl border-2 border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email-i juaj"
          className="flex h-11 w-full rounded-xl border-2 border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
      </div>
      <input
        name="subject"
        placeholder="Subjekti"
        className="flex h-11 w-full rounded-xl border-2 border-gray-200 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="Mesazhi juaj..."
        className="flex w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
      />
      <button
        type="submit"
        className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all active:scale-[0.97] inline-flex items-center justify-center gap-2"
      >
        <Send size={18} />
        Dërgo Mesazhin
      </button>
    </form>
  )
}
