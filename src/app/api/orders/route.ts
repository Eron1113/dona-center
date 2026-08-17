import { NextResponse } from "next/server"
import { z } from "zod"
import { saveOrder, getShippingInfo, getProducts, decrementStockForOrder, type Order } from "@/lib/data"
import { notifyNewOrder } from "@/lib/notify"
import { errorMessage } from "@/lib/utils"

const cartItemSchema = z.object({
  productId: z.string().min(1),
  productName: z.string().min(1),
  productSlug: z.string().min(1),
  productImage: z.string().min(1),
  color: z.string(),
  size: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
})

const orderSchema = z.object({
  id: z.string().min(1),
  userId: z.string().nullable().optional(),
  items: z.array(cartItemSchema).min(1),
  customerName: z.string().min(2),
  customerLastName: z.string().min(2),
  phone: z.string().min(5),
  country: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(5),
  notes: z.string().optional(),
  subtotal: z.number().nonnegative(),
  shipping: z.number().nonnegative(),
  total: z.number().nonnegative(),
  deliveryEstimate: z.string(),
  paymentMethod: z.string(),
  status: z.string().optional(),
  createdAt: z.string(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = orderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Të dhëna të pavlefshme: " + parsed.error.issues.map(i => i.message).join(", ") },
        { status: 400 }
      )
    }

    const order = parsed.data

    // Server-side price verification — use AUTHORITATIVE prices from the DB,
    // never trust the prices sent by the client.
    const products = await getProducts()
    const productMap = new Map(products.map(p => [p.id, p]))
    const priceMap = new Map(
      products.map(p => [
        p.id,
        p.discountPercent > 0
          ? p.basePrice * (1 - p.discountPercent / 100)
          : p.basePrice,
      ])
    )

    let computedSubtotal = 0
    for (const item of order.items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Produkti ${item.productName} nuk ekziston më` },
          { status: 400 }
        )
      }
      const expectedPrice = priceMap.get(item.productId)!
      if (Math.abs(expectedPrice - item.price) > 0.01) {
        return NextResponse.json(
          { error: `Çmimi i produktit ${item.productName} nuk përputhet me të dhënat tona` },
          { status: 400 }
        )
      }

      // Stock check — only enforce if the product actually tracks stock.
      // A product with empty stock ({} — no tracking) can always be ordered;
      // otherwise the missing key would read as 0 and block every order.
      const tracksStock = product.stock && Object.keys(product.stock).length > 0
      if (tracksStock) {
        const colorStock = product.stock?.[item.color] || {}
        const sizeKey = item.size || ""
        const available = colorStock[sizeKey] ?? 0
        if (available < item.quantity) {
          return NextResponse.json(
            { error: `Stoku i pamjaftueshëm për ${item.productName} (${item.color}${sizeKey ? " / " + sizeKey : ""})` },
            { status: 400 }
          )
        }
      }

      computedSubtotal += expectedPrice * item.quantity
    }

    const shippingInfo = getShippingInfo(order.country)
    const expectedShipping = shippingInfo?.cost ?? 0
    const expectedTotal = computedSubtotal + expectedShipping

    if (Math.abs(expectedShipping - order.shipping) > 0.01) {
      return NextResponse.json({ error: "Transporti nuk përputhet me rregullat tona" }, { status: 400 })
    }
    if (Math.abs(expectedTotal - order.total) > 0.01) {
      return NextResponse.json({ error: "Totali nuk përputhet me rregullat e transportit" }, { status: 400 })
    }

    const orderToSave: Order = {
      id: order.id,
      userId: order.userId || null,
      items: order.items,
      customerName: order.customerName,
      customerLastName: order.customerLastName,
      phone: order.phone,
      country: order.country,
      city: order.city,
      address: order.address,
      notes: order.notes || "",
      subtotal: computedSubtotal,
      shipping: expectedShipping,
      total: expectedTotal,
      deliveryEstimate: shippingInfo?.deliveryTime || "",
      paymentMethod: order.paymentMethod,
      status: "pending",
      createdAt: order.createdAt,
    }

    await saveOrder(orderToSave)

    // Decrement stock only AFTER the order is confirmed saved, so a failed
    // order never eats stock. If decrement fails, the order is still real.
    try {
      await decrementStockForOrder(order.items)
    } catch (err: unknown) {
      console.warn("Stock decrement failed for order", order.id, err instanceof Error ? err.message : err)
    }

    // Notify the store owner (Telegram). Never blocks or fails the order.
    await notifyNewOrder(orderToSave)

    return NextResponse.json({ ok: true, id: order.id }, { status: 201 })
  } catch (err: unknown) {
    return NextResponse.json(
      { error: errorMessage(err) },
      { status: 500 }
    )
  }
}
