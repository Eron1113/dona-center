"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Cookie, Check, X } from "lucide-react"

const STORAGE_KEY = "dona-center-cookie-consent"

export function CookieNotice() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show the notice unless the visitor already made a choice.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of localStorage consent on mount
    setVisible(localStorage.getItem(STORAGE_KEY) === null)
  }, [])

  const choose = (choice: "accepted" | "declined") => {
    localStorage.setItem(STORAGE_KEY, choice)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 inset-x-4 z-50 flex justify-center pointer-events-none">
      <div
        role="dialog"
        aria-live="polite"
        aria-label="Njoftim për privatësinë"
        className="pointer-events-auto w-full max-w-2xl rounded-2xl border border-gray-100 bg-white/95 backdrop-blur-md shadow-2xl shadow-black/10 p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
            <Cookie size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
              Privatësia juaj ka rëndësi për ne
            </p>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Përdorim cookies funksionale (p.sh. për të mbajtur shportën dhe hyrjen në
              llogari) dhe analitikë anonime pa cookies (Vercel Web Analytics) për të
              përmirësuar faqen. Nuk përdorim cookies reklamuese dhe nuk i shesim të
              dhënat tuaja. Ju mund të pranoni të gjitha ose të vazhdoni vetëm me ato
              funksionale.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <button
                onClick={() => choose("accepted")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-all active:scale-[0.97]"
              >
                <Check size={15} /> I pranoj të gjitha
              </button>
              <button
                onClick={() => choose("declined")}
                className="inline-flex items-center gap-1.5 px-4 py-2 border-2 border-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:border-gray-400 transition-all active:scale-[0.97]"
              >
                <X size={15} /> Vetëm funksionale
              </button>
              <Link
                href="/privacy-policy"
                className="text-sm text-primary font-medium hover:underline"
              >
                Politika e Privatësisë
              </Link>
            </div>
          </div>
          <button
            onClick={() => choose("declined")}
            className="p-2 -m-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
            aria-label="Mbyll njoftimin"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
