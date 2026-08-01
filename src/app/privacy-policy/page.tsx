export const metadata = {
  title: "Politika e Privatësisë | DonaCenter",
  description: "Politika e privatësisë së DonaCenter — si i mbledhim, përdorim dhe mbrojmë të dhënat tuaja.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Politika e Privatësisë</h1>

      <div className="space-y-6 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Çfarë të dhënash mbledhim</h2>
          <p>
            Mbledhim vetëm të dhënat e nevojshme për të përpunuar porositë tuaja: emrin,
            mbiemrin, email-in, numrin e telefonit dhe adresën e dorëzimit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Si i përdorim të dhënat</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Për të përpunuar dhe dorëzuar porositë tuaja.</li>
            <li>Për t&apos;ju kontaktuar në lidhje me statusin e porosisë.</li>
            <li>Për të përmirësuar shërbimet dhe përvojën tuaj të blerjes.</li>
            <li>Nëse abonoheni në buletin, për t&apos;ju dërguar oferta dhe njoftime (mund të çabonoheni në çdo kohë).</li>
          </ul>
          <p className="mt-3">
            Nuk i shesim dhe nuk i ndajmë të dhënat tuaja personale me palë të treta,
            përveçse kur kërkohet ligjërisht.
          </p>
        </section>

        <section id="cookies">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h2>
          <p>
            Përdorim cookies funksionale të nevojshme për funksionimin e faqes, si mbajtja e
            sesionit të hyrjes në llogarinë tuaj dhe e përmbajtjes së shportës. Këto cookies
            nuk mbledhin të dhëna personale për qëllime marketingu.
          </p>
          <p className="mt-3">
            Shporta dhe artikujt e shikuar së fundmi ruhen në shfletuesin tuaj (localStorage)
            dhe nuk dërgohen te ne derisa të bëni një porosi.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Analitika</h2>
          <p>
            Përdorim Vercel Web Analytics për të kuptuar se si vizitorët përdorin faqen
            (faqet e vizituara, burimi i trafikut). Ky shërbim është <strong>pa cookies</strong>{" "}
            dhe nuk identifikon vizitorë individualë — asnjë të dhënë personale nuk mblidhet
            apo ruhet për qëllime analitike.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Siguria</h2>
          <p>
            Të dhënat tuaja mbrohen me teknologji të sigurisë. Fjalëkalimet ruhen të
            enkriptuara dhe asnjëherë në tekst të hapur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Të drejtat tuaja (GDPR)</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Të kërkoni një kopje të të dhënave tuaja personale.</li>
            <li>Të kërkoni korrigjimin ose fshirjen e të dhënave tuaja.</li>
            <li>Të tërhiqni pëlqimin për buletinin në çdo kohë.</li>
            <li>Të ankoheni te autoriteti përkatës për mbrojtjen e të dhënave.</li>
          </ul>
          <p className="mt-3">
            Për të ushtruar këto të drejta, na kontaktoni në donacenter16@gmail.com.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Kontakt</h2>
          <p>
            Për çdo pyetje në lidhje me privatësinë, na kontaktoni në donacenter16@gmail.com.
          </p>
        </section>
      </div>
    </div>
  )
}
