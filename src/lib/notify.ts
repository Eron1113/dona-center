import type { Order } from "./data"

/**
 * Send a notification to the store owner when a new order is placed.
 *
 * Currently uses Telegram (free, no setup cost). It is fully optional:
 * if the env vars aren't configured, the notification is silently skipped
 * and the order flow is unaffected.
 *
 * Env vars (set them in Vercel → Settings → Environment Variables):
 *   TELEGRAM_BOT_TOKEN — token from @BotFather
 *   TELEGRAM_CHAT_ID   — the chat id where the bot should send messages
 */
export async function notifyNewOrder(order: Order): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    // Not configured — this is fine, the order still saved.
    return
  }

  const itemsText = order.items
    .map(
      (item) =>
        `• ${item.productName} (${item.color}${item.size ? " / " + item.size : ""}) × ${item.quantity} — €${(
          item.price * item.quantity
        ).toFixed(2)}`
    )
    .join("\n")

  const message = [
    `🛍️ *POROSI E RE!*`,
    ``,
    `🔖 ID: ${order.id.slice(0, 8).toUpperCase()}`,
    ``,
    `👤 ${order.customerName} ${order.customerLastName}`,
    `📞 ${order.phone}`,
    `📍 ${order.address}, ${order.city}, ${order.country}`,
    order.notes ? `📝 ${order.notes}` : "",
    ``,
    `📦 *Artikujt:*`,
    itemsText,
    ``,
    `Subtotali: €${order.subtotal.toFixed(2)}`,
    `Transporti: €${order.shipping.toFixed(2)}`,
    `💰 *Totali: €${order.total.toFixed(2)}*`,
    `💳 ${order.paymentMethod}`,
    `⏱ ${order.deliveryEstimate}`,
  ].join("\n")

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "Markdown",
      }),
    })
    if (!res.ok) {
      console.warn("Order notification failed (Telegram)", res.status, (await res.text()).slice(0, 200))
    }
  } catch (err: unknown) {
    // Never break the order flow because of a notification failure.
    console.warn("Order notification failed:", err instanceof Error ? err.message : err)
  }
}
