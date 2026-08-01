"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { errorMessage } from "@/lib/utils"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push("/profile")
      router.refresh()
    } catch (err: unknown) {
      setError(errorMessage(err, "Email ose fjalëkalim i gabuar"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mirë se erdhe!</h1>
        <p className="text-gray-500">Hyni në llogarinë tuaj DonaCenter</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl border border-gray-100">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="email@juaj.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Fjalëkalimi</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl">
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <LogIn size={18} /> Hyr
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Nuk keni llogari?{" "}
        <Link href="/register" className="text-primary font-medium hover:underline">
          Regjistrohu
        </Link>
      </p>
    </div>
  )
}
