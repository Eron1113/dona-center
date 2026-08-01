import { NextResponse } from "next/server"
import { getOrders } from "@/lib/data"

// Public order-tracking endpoint. Clients enter the short code shown on the
// checkout success screen (e.g. #0A25CDD9). We only ever return a safe subset
// (status, items, totals) — never the customer's address or phone.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = (searchParams.get("code") || "").trim().replace(/^#/, "").toLowerCase()

  if (code.length < 6) {
    return NextResponse.json(
      { error: "Jepni kodin e plotë të porosisë (p.sh. #0A25CDD9)" },
      { status: 400 }
    )
  }

  const orders = await getOrders()
  const order = orders.find(o => o.id.toLowerCase().startsWith(code))

  if (!order) {
    return NextResponse.json({ error: "Porosia nuk u gjet. Verifikoni kodin." }, { status: 404 })
  }

  return NextResponse.json({
    ok: true,
    order: {
      id: order.id.slice(0, 8).toUpperCase(),
      status: order.status,
      createdAt: order.createdAt,
      subtotal: order.subtotal,
      shipping: order.shipping,
      total: order.total,
      deliveryEstimate: order.deliveryEstimate,
      paymentMethod: order.paymentMethod,
      items: order.items.map(i => ({
        productName: i.productName,
        quantity: i.quantity,
        size: i.size,
        color: i.color,
      })),
    },
  })
}
