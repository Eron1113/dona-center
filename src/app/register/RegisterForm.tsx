"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { errorMessage } from "@/lib/utils"

export function RegisterForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const update = (key: string, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (form.password.length < 6) {
      setError("Fjalëkalimi duhet të ketë të paktën 6 karaktere")
      return
    }
    if (form.password !== form.confirmPassword) {
      setError("Fjalëkalimet nuk përputhen")
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error, data } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            first_name: form.firstName,
            last_name: form.lastName,
          },
        },
      })
      if (error) throw error

      // Save extra profile fields
      if (data.user) {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: data.user.id,
            firstName: form.firstName,
            lastName: form.lastName,
          }),
        })
      }

      router.push("/profile")
      router.refresh()
    } catch (err: unknown) {
      setError(errorMessage(err, "Diçka shkoi keq. Provo përsëri."))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Krijo llogari</h1>
        <p className="text-gray-500">Bëhuni anëtar i DonaCenter falas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-6 rounded-2xl border border-gray-100">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Emri</Label>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={e => update("firstName", e.target.value)}
              placeholder="Ardian"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Mbiemri</Label>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={e => update("lastName", e.target.value)}
              placeholder="Krasniqi"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={e => update("email", e.target.value)}
            placeholder="email@juaj.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Fjalëkalimi</Label>
          <Input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={e => update("password", e.target.value)}
            placeholder="Të paktën 6 karaktere"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Konfirmo fjalëkalimin</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            value={form.confirmPassword}
            onChange={e => update("confirmPassword", e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl">
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <UserPlus size={18} /> Regjistrohu
            </>
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Keni llogari?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Hyr
        </Link>
      </p>
    </div>
  )
}
