import Image from "next/image"
import { Heart, Shield, Truck } from "lucide-react"

export const metadata = {
  title: "Rreth Nesh | DonaCenter",
  description: "Njihuni me DonaCenter - butiku juaj premium i modës në Kosovë.",
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Rreth DonaCenter</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          DonaCenter është butiku juaj premium për veshje moderne dhe elegante.
          Cilësi e lartë, stil i përjetshëm dhe shërbim i shkëlqyer për klientët.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200"
            alt="Dyqani DonaCenter"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Misioni ynë</h2>
          <p className="text-gray-600 leading-relaxed">
            Në DonaCenter besojmë se të gjithë meritojnë të ndihen të veçantë me atë që veshin.
            Prandaj zgjedhim me kujdes çdo produkt në koleksionin tonë, duke u fokusuar në
            cilësinë, komoditetin dhe stilin.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Me transport në Kosovë, Shqipëri dhe Maqedoninë e Veriut, synojmë t&apos;ju sjellim
            modën më të mirë në derën tuaj - shpejt dhe me siguri.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { icon: Shield, title: "Cilësi Premium", desc: "Produkte 100% origjinale me materiale cilësore." },
          { icon: Truck, title: "Transport i Shpejtë", desc: "Dorëzim në 48 orë në Kosovë, 5-6 ditë rajon." },
          { icon: Heart, title: "Shërbim i Dëgjueshëm", desc: "Mbështetje e shpejtë dhe kthime të lehta." },
        ].map(item => (
          <div key={item.title} className="p-6 rounded-2xl bg-gray-50 text-center">
            <item.icon className="mx-auto text-primary mb-3" size={28} />
            <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
