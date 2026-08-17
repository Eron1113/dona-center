export const metadata = {
  title: "Kushtet dhe Rregullat | DonaCenter",
  description: "Kushtet dhe rregullat e përdorimit të faqes dhe shërbimeve të DonaCenter.",
}

const LAST_UPDATED = "17 gusht 2026"

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Kushtet dhe Rregullat</h1>
      <p className="text-sm text-gray-400 mb-8">Përditësuar: {LAST_UPDATED}</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Pranimi i kushteve</h2>
          <p>
            Duke vizituar <strong>donacenter.com</strong> dhe duke bërë porosi, ju pranoni këto
            kushte në tërësi. Nëse nuk jeni dakord me ndonjë pikë, ju lutem mos e përdorni faqen.
            Këto kushte rregullojnë marrëdhënien midis jush dhe DonaCenter (&ldquo;ne&rdquo;),
            butik veshjesh me dyqane në Shtime dhe Ferizaj.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Përdorimi i faqes</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Ju duhet të jeni të paktën 16 vjeç për të bërë porosi në këtë faqe.</li>
            <li>Jeni përgjegjës për saktësinë e të dhënave që jepni gjatë porosisë.</li>
            <li>Informacionet e produkteve (përshkrimet, çmimet, fotografitë) mund të ndryshojnë pa njoftim paraprak.</li>
            <li>Nuk lejohet kopjimi, shpërndarja ose përdorimi komercial i përmbajtjes së faqes pa lejen tonë me shkrim.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Porositë</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Porosia konsiderohet e pranuar pas konfirmimit nga ana jonë (zakonisht me telefon ose mesazh).</li>
            <li>Rezervojmë të drejtën të anulojmë çdo porosi në rast mungese stoku; në këtë rast nuk ngarkoheni për asgjë.</li>
            <li>Çmimet e shfaqura janë në Euro (€) dhe përfshijnë TVSH-në.</li>
            <li>Në rast gabimi çmimi në faqe, ne do t&apos;ju njoftojmë përpara konfirmimit përfundimtar.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Pagesa</h2>
          <p>
            Mënyra e vetme e pagesës është <strong>pagesa në dorëzim (Cash on Delivery)</strong>.
            <strong>Nuk kërkohet asnjë parapagim</strong> — paguani vetëm kur porosia ju arrin në
            dorë. Shuma e saktë konfirmohet para dorëzimit dhe përfshin çmimin e produkteve plus
            tarifën e transportit sipas vendit (Kosovë €2, Shqipëri €6, Maqedonia e Veriut €6).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Transporti dhe dorëzimi</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Porositë e konfirmuara para orës 17:00 dërgohen të njëjtën ditë (për Kosovë).</li>
            <li>Kohëzgjatja e transportit: Kosovë 48 orë, Shqipëri ~5 ditë, Maqedonia e Veriut ~6 ditë.</li>
            <li>Rreziku i humbjes ose dëmtimit kalon te ju në momentin e dorëzimit.</li>
            <li>Nëse nuk e merrni porosinë, rezervojmë të drejtën të ngarkojmë kostot e dërgesës në porositë e ardhshme.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Shkëmbimi dhe kthimi</h2>
          <p>
            Shkëmbimi i madhësisë bëhet <strong>vetëm personalisht në butik</strong> (Shtime ose
            Ferizaj), brenda <strong>48 orëve</strong> nga marrja e porosisë, me faturën dhe
            produktin të papërdorur me etiketa origjinale. Nuk kryejmë shkëmbime apo kthime me
            postë ose transport. Detajet i gjeni në faqen{" "}
            <a href="/return-policy" className="text-primary hover:underline">Politika e Shkëmbimit</a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Pronësia intelektuale</h2>
          <p>
            Logoja, emri &ldquo;DonaCenter&rdquo;, tekstet, fotografitë dhe dizajni i faqes janë
            pronë e DonaCenter ose të licencuesve të saj. Përdorimi i tyre pa leje është i ndaluar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Kufizimi i përgjegjësisë</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Bëjmë çdo përpjekje që fotografitë të jenë të sakta, por ngjyrat mund të ndryshojnë lehtë për shkak të ekraneve.</li>
            <li>Përgjegjësia jonë për çdo porosi kufizohet në shumën e paguar për atë porosi.</li>
            <li>Nuk jemi përgjegjës për vonesa të shkaktuara nga forca madhore (fatkeqësi natyrore, greva, bllokime transporti, etj.).</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Privatësia</h2>
          <p>
            Të dhënat tuaja personale përpunohen sipas{" "}
            <a href="/privacy-policy" className="text-primary hover:underline">Politikës së Privatësisë</a>{" "}
            dhe Ligjit për Mbrojtjen e të Dhënave Personale të Kosovës (06/L-082).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Ligji i zbatueshëm</h2>
          <p>
            Këto kushte rregullohen nga <strong>ligjet e Republikës së Kosovës</strong>. Çdo mosmarrëveshje
            do të zgjidhet nga gjykatat kompetente të Kosovës.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Kontakt</h2>
          <p>
            Për çdo pyetje lidhur me këto kushte, na kontaktoni në{" "}
            <a href="mailto:donacenter16@gmail.com" className="text-primary hover:underline">donacenter16@gmail.com</a>{" "}
            ose në telefon{" "}
            <a href="tel:+38348881400" className="text-primary hover:underline">048 881 400</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
