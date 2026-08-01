import { getOrders } from "@/lib/data"
import { OrderStatusSelect } from "./OrderStatusSelect"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Porositë</h1>
        <p className="text-gray-500">{orders.length} porosi gjithsej</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-16 text-center rounded-2xl border border-gray-100 bg-white">
          <p className="text-gray-400 text-lg mb-2">Nuk ka porosi ende</p>
          <p className="text-gray-400 text-sm">Kur një klient konfirmon një porosi, do ta shihni këtu.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="p-6 rounded-2xl border border-gray-100 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleString("sq-AL")}
                  </p>
                </div>
                <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Customer */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                    Klienti
                  </h3>
                  <p className="text-sm font-medium text-gray-900">
                    {order.customerName} {order.customerLastName}
                  </p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                  <p className="text-sm text-gray-500">
                    {order.address}, {order.city}, {order.country}
                  </p>
                  {order.notes && (
                    <p className="text-sm text-gray-400 mt-1 italic">&ldquo;{order.notes}&rdquo;</p>
                  )}
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                    Produktet
                  </h3>
                  <ul className="space-y-1">
                    {order.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 flex justify-between">
                        <span>
                          {item.productName} ({item.color}
                          {item.size ? `, ${item.size}` : ""}) × {item.quantity}
                        </span>
                        <span className="font-medium">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Payment */}
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-2">
                    Pagesa
                  </h3>
                  <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                  <p className="text-sm text-gray-600">
                    Transporti: {order.deliveryEstimate}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between">
                    <span className="font-semibold text-gray-900">Totali</span>
                    <span className="font-bold text-primary">€{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
