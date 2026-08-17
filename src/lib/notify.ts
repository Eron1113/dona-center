import nodemailer from "nodemailer"
import type { Order } from "./data"

/**
 * Send a notification to the store owner when a new order is placed.
 *
 * Supports two channels (both optional, both env-gated). If neither is
 * configured the notification is silently skipped — the order flow is
 * never affected.
 *
 * Channel 1 — Telegram (free):
 *   TELEGRAM_BOT_TOKEN — token from @BotFather
 *   TELEGRAM_CHAT_ID   — the chat id where the bot should send messages
 *
 * Channel 2 — Email via SMTP (e.g. Gmail "App password"):
 *   SMTP_HOST          — e.g. smtp.gmail.com
 *   SMTP_PORT          — e.g. 465
 *   SMTP_USER          — the sending email address
 *   SMTP_PASS          — an App password (NOT the normal account password)
 *   NOTIFY_EMAIL       — where the order notification should be delivered
 */
export async function notifyNewOrder(order: Order): Promise<void> {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID

  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const notifyEmail = process.env.NOTIFY_EMAIL

  const hasTelegram = Boolean(telegramToken && telegramChatId)
  const hasEmail = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && notifyEmail)

  if (!hasTelegram && !hasEmail) {
    // No channel configured — the order still saved, nothing to do.
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

  const orderText = [
    `POROSI E RE!`,
    ``,
    `ID: ${order.id.slice(0, 8).toUpperCase()}`,
    ``,
    `Emri: ${order.customerName} ${order.customerLastName}`,
    `Telefoni: ${order.phone}`,
    `Adresa: ${order.address}, ${order.city}, ${order.country}`,
    order.notes ? `Shënime: ${order.notes}` : "",
    ``,
    `Artikujt:`,
    itemsText,
    ``,
    `Subtotali: €${order.subtotal.toFixed(2)}`,
    `Transporti: €${order.shipping.toFixed(2)}`,
    `TOTALI: €${order.total.toFixed(2)}`,
    `Pagesa: ${order.paymentMethod}`,
    `Dorëzimi: ${order.deliveryEstimate}`,
  ].join("\n")

  // Channel 1 — Telegram. Never break the order flow on failure.
  if (hasTelegram) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramChatId,
          text: `🛍️ *POROSI E RE!*\n\n${orderText}`,
          parse_mode: "Markdown",
        }),
      })
      if (!res.ok) {
        console.warn("Order notification failed (Telegram)", res.status, (await res.text()).slice(0, 200))
      }
    } catch (err: unknown) {
      console.warn("Order notification failed (Telegram):", err instanceof Error ? err.message : err)
    }
  }

  // Channel 2 — Email. Never break the order flow on failure.
  if (hasEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort),
        secure: Number(smtpPort) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      })

      await transporter.sendMail({
        from: `"DonaCenter" <${smtpUser}>`,
        to: notifyEmail,
        subject: `🛍️ POROSI E RE #${order.id.slice(0, 8).toUpperCase()} — €${order.total.toFixed(2)}`,
        text: orderText,
      })
    } catch (err: unknown) {
      console.warn("Order notification failed (email):", err instanceof Error ? err.message : err)
    }
  }
}
