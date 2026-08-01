export const metadata = {
  title: "Kushtet dhe Rregullat | DonaCenter",
  description: "Kushtet dhe rregullat e përdorimit të DonaCenter.",
}

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Kushtet dhe Rregullat</h1>

      <div className="space-y-6 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Përdorimi i faqes</h2>
          <p>
            Duke përdorur këtë faqe, ju pranoni kushtet e mëposhtme. Të gjitha çmimet janë
            në Euro (€) dhe përfshijnë TVSH-në aty ku aplikohet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Porositë</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Porositë konfirmohen pas verifikimit nga ana jonë.</li>
            <li>Rezervojmë të drejtën të anulojmë porosi në rast mungese stoku.</li>
            <li>Çmimet mund të ndryshojnë pa njoftim paraprak.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Pagesa</h2>
          <p>
            Mënyra e vetme e pagesës është <strong>pagesa në dorëzim (Cash on Delivery)</strong>.
            Nuk kërkohet asnjë parapagim — paguani vetëm kur porosia ju arrin në derë.
            Shuma e saktë e pagesës konfirmohet para dorëzimit dhe përfshin çmimin e
            produkteve dhe tarifën e transportit sipas vendit të dorëzimit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Përgjegjësia</h2>
          <p>
            Bëjmë çdo përpjekje që fotografitë e produkteve të jenë sa më të sakta,
            megjithatë mund të ketë ndryshime të lehta në ngjyra për shkak të ekraneve.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Ligji i zbatueshëm</h2>
          <p>
            Këto kushte rregullohen nga ligjet e Republikës së Kosovës.
          </p>
        </section>
      </div>
    </div>
  )
}
