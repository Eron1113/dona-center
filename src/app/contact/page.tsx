import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { ContactForm } from "./ContactForm"

export const metadata = {
  title: "Kontakt | DonaCenter",
  description: "Kontaktoni DonaCenter për çdo pyetje, ndihmë me porositë ose informata.",
}

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Kontakti</h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Na shkruani për çdo pyetje, ndihmë me porositë ose sugjerime. Përgjigjemi zakonisht brenda 24 orëve.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Contact info */}
        <div className="space-y-4">
          {[
            { icon: Phone, title: "Telefoni", value: "+383 44 000 000", href: "tel:+38344000000" },
            { icon: Mail, title: "Email", value: "info@donacenter.com", href: "mailto:info@donacenter.com" },
            { icon: MapPin, title: "Adresa", value: "Prishtinë, Kosovë" },
            { icon: Clock, title: "Orari", value: "E hënë - E shtunë: 9:00 - 20:00" },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100">
              <div className="w-11 h-11 bg-primary/5 rounded-xl flex items-center justify-center shrink-0">
                <item.icon className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{item.title}</p>
                {item.href ? (
                  <a href={item.href} className="text-gray-500 hover:text-primary transition-colors">
                    {item.value}
                  </a>
                ) : (
                  <p className="text-gray-500">{item.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <ContactForm />
      </div>
    </div>
  )
}
