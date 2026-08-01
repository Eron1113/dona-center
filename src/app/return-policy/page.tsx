export const metadata = {
  title: "Politika e Kthimit | DonaCenter",
  description: "Rregullat e kthimit dhe shkëmbimit në DonaCenter.",
}

export default function ReturnPolicyPage() {
  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Politika e Kthimit dhe Shkëmbimit</h1>

      <div className="space-y-6 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Shkëmbimi i Madhësisë</h2>
          <p>
            Nëse madhësia nuk ju përshtatet, keni të drejtë ta shkëmbeni produktin brenda{" "}
            <strong>48 orëve</strong> nga marrja e porosisë, pa pagesë shtesë për transport
            (për porositë në Kosovë).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Kushtet për Kthim</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Produkti duhet të jetë i papërdorur, me etiketa dhe paketim origjinal.</li>
            <li>Kthimet pranohen brenda 7 ditëve nga data e marrjes.</li>
            <li>Produktet në shitje finale (me zbritje të madhe) mund të mos pranohen për kthim.</li>
            <li>Kontaktoni në info@donacenter.com përpara se të ktheni një produkt.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Rimbursimet</h2>
          <p>
            Meqenëse pagesa bëhet në dorëzim (Cash on Delivery), rimbursimet për produktet e
            kthyera bëhen përmes transferit bankar ose duke u kompensuar me një porosi tjetër,
            sipas preferencës së klientit. Pasi produkti të kthehet dhe të verifikohet,
            rimbursimi përpunohet brenda 5-7 ditëve pune.
          </p>
        </section>
      </div>
    </div>
  )
}
