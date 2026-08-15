export const metadata = {
  title: "Politika e Shkëmbimit | DonaCenter",
  description: "Rregullat e shkëmbimit të madhësisë në DonaCenter - vetëm në butik.",
}

export default function ReturnPolicyPage() {
  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Politika e Shkëmbimit</h1>

      <div className="space-y-6 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Shkëmbimi i Madhësisë</h2>
          <p>
            Shkëmbimi i madhësisë bëhet <strong>vetëm personalisht në butik</strong>, jo me
            postë apo transport. Nëse madhësia nuk ju përshtatet, keni të drejtë ta shkëmbeni
            produktin brenda <strong>48 orëve</strong> nga marrja e porosisë, duke ardhur në
            një nga butikët tanë në <strong>Shtime</strong> ose <strong>Ferizaj</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Kushtet për Shkëmbim</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Shkëmbimi pranohet vetëm brenda 48 orëve nga marrja e porosisë.</li>
            <li>Duhet të vini personalisht në butik me produktin dhe faturën e porosisë.</li>
            <li>Produkti duhet të jetë i papërdorur, me etiketa dhe paketim origjinal.</li>
            <li>Produktet në shitje finale (me zbritje të madhe) mund të mos pranohen për shkëmbim.</li>
            <li>Nuk kryejmë shkëmbime me postë apo nëpërmjet transportit.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Kthimet dhe Rimbursimet</h2>
          <p>
            Kthimet dhe rimbursimet bëhen <strong>vetëm personalisht në butik</strong>, brenda
            48 orëve nga marrja e porosisë dhe me faturën e porosisë. Nuk pranojmë kthime me
            postë apo nëpërmjet transportit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Ku të Na Gjeni</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Butiku në Shtime</strong> — Rruga Tahir Sinani
            </li>
            <li>
              <strong>Butiku në Ferizaj</strong> — Sheshi, Rruga Dëshmorët e Kombit
            </li>
            <li>
              Për çdo pyetje, na kontaktoni në <strong>donacenter16@gmail.com</strong> ose në
              telefon <strong>048 881 400</strong>.
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
