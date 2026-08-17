export const metadata = {
  title: "Politika e Privatësisë | DonaCenter",
  description: "Politika e privatësisë së DonaCenter — si i mbledhim, përdorim dhe mbrojmë të dhënat tuaja personale.",
}

const LAST_UPDATED = "17 gusht 2026"

export default function PrivacyPolicyPage() {
  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Politika e Privatësisë</h1>
      <p className="text-sm text-gray-400 mb-8">Përditësuar: {LAST_UPDATED}</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Hyrje</h2>
          <p>
            Kjo Politikë e Privatësisë shpjegon se si DonaCenter (&ldquo;ne&rdquo;, &ldquo;ju&rdquo;)
            mbledh, përdor dhe mbron të dhënat tuaja personale kur vizitoni faqen tonë
            <strong> donacenter.com </strong> ose bëni porosi nga ne. Ne e respektojmë privatësinë
            tuaj dhe i përpunojmë të dhënat tuaja në përputhje me Ligjin për Mbrojtjen e të Dhënave
            Personale të Republikës së Kosovës (Ligji Nr. 06/L-082) dhe Rregulloren Evropiane
            (GDPR) 2016/679.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Kontrolluesi i të dhënave</h2>
          <p>Kontrollues i të dhënave tuaja personale është:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>DonaCenter</strong> — butik veshjesh me dyqane në Shtime dhe Ferizaj</li>
            <li>Email: <a href="mailto:donacenter16@gmail.com" className="text-primary hover:underline">donacenter16@gmail.com</a></li>
            <li>Telefon: <a href="tel:+38348881400" className="text-primary hover:underline">048 881 400</a></li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Çfarë të dhënash mbledhim</h2>
          <p>Mbledhim vetëm të dhënat e nevojshme për të përpunuar porositë tuaja:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Të dhënat e identifikimit:</strong> emrin, mbiemrin</li>
            <li><strong>Të dhënat e kontaktit:</strong> numrin e telefonit dhe email-in</li>
            <li><strong>Të dhënat e dorëzimit:</strong> adresën, qytetin dhe shtetin</li>
            <li><strong>Të dhënat e porosisë:</strong> artikujt, madhësitë, ngjyrat dhe shumat</li>
            <li><strong>Nëse keni llogari:</strong> email-in dhe fjalëkalimin e enkriptuar</li>
          </ul>
          <p className="mt-3">
            <strong>Nuk mbledhim:</strong> të dhëna pagese me kartë (nuk pranojmë pagesa online),
            të dhëna të vendndodhjes në kohë reale, as të dhëna nga rrjetet sociale pa pëlqimin tuaj.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Si i përdorim të dhënat</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Për të përpunuar, konfirmuar dhe dorëzuar porositë tuaja (baza ligjore: kontrata).</li>
            <li>Për t&apos;ju kontaktuar në lidhje me statusin e porosisë (baza ligjore: kontrata).</li>
            <li>Për të përmirësuar faqen dhe shërbimet tona (interes legjitim).</li>
            <li>Për të dërguar oferta dhe buletin — <strong>vetëm</strong> nëse jeni abonuar, me mundësi çabonimi në çdo kohë (baza ligjore: pëlqimi).</li>
          </ul>
          <p className="mt-3">
            <strong>Nuk i shesim dhe nuk i shkëmbejmë të dhënat tuaja personale me palë të treta</strong>,
            përveçse kur kjo është e nevojshme për dorëzimin e porosisë (p.sh. shoqëria e transportit,
            së cilës i jepet vetëm adresa dhe telefoni) ose kur kërkohet me ligj.
          </p>
        </section>

        <section id="cookies">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies</h2>
          <p>
            Përdorim <strong>cookies funksionale</strong>, të cilat janë të nevojshme për funksionimin
            e faqes — p.sh. mbajtja e përmbajtjes së shportës, artikujve të shikuar së fundmi dhe
            sesionit të hyrjes në llogari. Këto ruhen në shfletuesin tuaj (localStorage) dhe
            <strong> nuk dërgohen te ne derisa të bëni një porosi</strong>.
          </p>
          <p className="mt-3">
            <strong>Nuk përdorim cookies reklamuese (third-party) dhe nuk gjurmojmë shfletimin tuaj
            për qëllime marketingu.</strong> Mund t&apos;i fshini cookies në çdo kohë nga cilësimet e
            shfletuesit tuaj; kjo mund të ndikojë në disa funksione si shporta e ruajtur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Analitika</h2>
          <p>
            Përdorim <strong>Vercel Web Analytics</strong> për të kuptuar në mënyrë anonime se si
            vizitorët përdorin faqen (faqet e vizituara, burimi i trafikut, pajisja). Ky shërbim është
            <strong> pa cookies</strong> dhe <strong>nuk identifikon vizitorë individualë</strong> —
            asnjë të dhënë personale nuk mblidhet apo ruhet për qëllime analitike.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Ruajtja e të dhënave</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Të dhënat e porosive mbahen për aq kohë sa kërkohet nga ligji i Kosovës për kontabilitet dhe tatime (zakonisht 5-10 vjet).</li>
            <li>Email-i i buletinit mbahet derisa të çabonoheni.</li>
            <li>Llogaritë e përdoruesve mbahen derisa ato të fshihen.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Siguria</h2>
          <p>
            Të dhënat tuaja mbrohen me masa teknike dhe organizative: faqja përdor enkriptim
            SSL/TLS (HTTPS), fjalëkalimet ruhen të enkriptuara (hash) dhe asnjëherë në tekst të
            hapur, dhe qasja në të dhënat e klientëve është e kufizuar vetëm për personelin e
            autorizuar. Porositë tuaja paguhen në dorëzim, prandaj <strong>nuk ruajmë asnjë të dhënë
            të kartës bankare</strong>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Të drejtat tuaja (GDPR / Ligji 06/L-082)</h2>
          <p>Ju keni të drejtë:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Të kërkoni <strong>një kopje</strong> të të dhënave tuaja personale (të drejta e qasjes).</li>
            <li>Të kërkoni <strong>korrigjimin</strong> e të dhënave të pasakta.</li>
            <li>Të kërkoni <strong>fshirjen</strong> e të dhënave tuaja (e drejta për t&apos;u harruar), ku aplikohet.</li>
            <li>Të <strong>tërhiqni pëlqimin</strong> për buletinin në çdo kohë.</li>
            <li>Të kundërshtoni përpunimin për interesa legjitime.</li>
            <li>Të <strong>ankoheni</strong> te Agjencia për Informim dhe Privatësi e Kosovës (AIP) ose autoriteti përkatës.</li>
          </ul>
          <p className="mt-3">
            Për të ushtruar këto të drejta, na kontaktoni në{" "}
            <a href="mailto:donacenter16@gmail.com" className="text-primary hover:underline">donacenter16@gmail.com</a>.
            Përgjigjemi brenda 30 ditëve, siç kërkohet me ligj.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Ndryshimet e politikës</h2>
          <p>
            Këtë politikë mund ta përditësojmë herë pas here për të reflektuar ndryshime ligjore ose
            në shërbimet tona. Data e përditësimit të fundit tregohet në krye të kësaj faqeje.
            Ndryshime të rëndësishme do t&apos;ju njoftohen në faqe.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Kontakt</h2>
          <p>
            Për çdo pyetje në lidhje me këtë politikë ose me të dhënat tuaja, na kontaktoni në{" "}
            <a href="mailto:donacenter16@gmail.com" className="text-primary hover:underline">donacenter16@gmail.com</a>{" "}
            ose në telefon{" "}
            <a href="tel:+38348881400" className="text-primary hover:underline">048 881 400</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
