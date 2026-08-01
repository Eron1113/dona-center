import { SHIPPING_RULES } from "@/lib/shipping"

export const metadata = {
  title: "Politika e Transportit | DonaCenter",
  description: "Rregullat e transportit dhe dorëzimit në DonaCenter.",
}

export default function ShippingPolicyPage() {
  return (
    <div className="container py-12 md:py-20 max-w-3xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Politika e Transportit</h1>

      <div className="space-y-6 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Tarifat e Transportit</h2>
          <p>
            Transporti llogaritet sipas vendit të dorëzimit. Tarifat e plota i gjeni në tabelën më poshtë.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Kohëzgjatja dhe Tarifat</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-100 rounded-xl">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500">
                  <th className="p-3 font-medium">Vendi</th>
                  <th className="p-3 font-medium">Tarifa</th>
                  <th className="p-3 font-medium">Kohëzgjatja</th>
                </tr>
              </thead>
              <tbody>
                {SHIPPING_RULES.map(rule => (
                  <tr key={rule.country} className="border-t border-gray-100">
                    <td className="p-3 font-medium text-gray-900">{rule.country}</td>
                    <td className="p-3">
                      {rule.cost === 0 ? "Falas" : `€${rule.cost}`}
                    </td>
                    <td className="p-3">{rule.deliveryTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Procesi i Dorëzimit</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Porositë e konfirmuara përpara orës 17:00 dërgohen të njëjtën ditë (për Kosovë).</li>
            <li>Pas dërgimit, do të njoftoheni në telefon për statusin e porosisë.</li>
            <li>Pagesa bëhet vetëm në dorëzim (Cash on Delivery) — pa asnjë parapagim.</li>
            <li>Ju lutem sigurohuni që numri i telefonit të jetë i saktë për të shmangur vonesa.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
