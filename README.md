# DonaCenter — Butiku Juaj Premium i Modës

Dyqan online mode për Kosovë, Shqipëri dhe Maqedoninë e Veriut. Ndërtuar me
**Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**
dhe **Supabase** (baza e të dhënave + autentifikimi), me ngarkim imazhesh
përmes **Cloudinary**.

## ✨ Karakteristikat

- 🛍️ Dyqan i plotë: kategori (Gratë, Burrat, Të Rejat, Më të Shitura), kërkim,
  filtra, shikim i shpejtë, produkte të veçuara
- 🛒 Shportë & porosi: shto në shportë, pagesa në dorëzim (COD), gjurmim porosish
  me kod, transport për 3 vende me kosto reale
- 👤 Llogari: regjistrim/login me Supabase Auth, profile me porositë dhe të preferuarat
- 🛠️ Panel admin (i mbrojtur): menaxhimi i produkteve (me upload imazhesh në
  Cloudinary dhe kompresim automatik), porosive dhe kategorive
- 📦 Madhësi fleksibël: çdo produkt mund të ketë madhësi të emërtuara lirisht
  (`S, M, L`, `36–45` për këpucë, `One Size`) ose të mos ketë fare madhësi
  (çanta, aksesorë) — me stok për çdo ngjyrë × madhësi
- ✉️ Buletin (newsletter) i lidhur me Supabase

## 🚀 Fillimi

```bash
npm install
npm run dev
```

Hap [http://localhost:3000](http://localhost:3000).

Skriptet e tjera: `npm run build`, `npm run start`, `npm run lint`,
`npm run dev:lan` (dev i arritshëm në rrjetin lokal).

## ⚙️ Konfigurimi i Supabase

1. Krijo një projekt në [supabase.com](https://supabase.com).
2. Kopjo `.env.example` në `.env.local` dhe plotëso:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_ADMIN_EMAIL` (email-i i pronarit, që të ketë akses admin)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
3. Ekzekuto përmbajtjen e `supabase/schema.sql` në SQL Editor të Supabase
   (krijon tabelat `products`, `categories`, `profiles`, `orders`, `favorites`,
   `newsletter_subscribers`, politikat RLS dhe trigger-in e profilit).
4. Krijo llogarinë admin:
   ```bash
   node supabase/create-admin.js
   ```
5. (Opsionale) Mbjell produktet demo:
   ```bash
   node supabase/seed.js
   ```

> Pa `.env.local`, dyqani funksionon në modalitetin demo me të dhëna nga
> `src/data/*.json` — pa Supabase.

## 🗂️ Struktura kryesore

```
src/app/            Faqet (home, women, men, product, cart, checkout, admin, ...)
src/components/     Komponentët (Header, Footer, ProductCard, QuickViewModal, ...)
src/lib/data.ts     Shtresa e të dhënave (Supabase + fallback JSON)
src/lib/shipping.ts Rregullat e transportit
supabase/           schema.sql, seed.js, create-admin.js
```

## ☁️ Deploy në Vercel

Lidh depon me Vercel dhe shto të njëjtat variabla mjedisi si në `.env.local`.
Rikthe `supabase/schema.sql` te database-i i prodhimit para publikimit.
