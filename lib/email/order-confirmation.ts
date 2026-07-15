import { Resend } from "resend";
import type { CheckoutFormData, PaymentMethod } from "@/lib/orders/types";
import { createGmailTransporter, getFromAddress } from "@/lib/email/transporter";
import { formatPrice } from "@/lib/utils/format";

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  cod: "Cash on Delivery",
  bank_transfer: "Bank Transfer",
  card: "Credit / Debit Card",
};

export interface OrderEmailItem {
  name: string;
  slug: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  includedProducts?: { name: string; quantity: number }[];
}

export interface OrderEmailData {
  orderNumber: string;
  orderId: string;
  customer: CheckoutFormData;
  items: OrderEmailItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string | null;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getPublicSiteUrl(): string {
  const configured = (process.env.ORDER_SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "")
    .trim()
    .replace(/\/$/, "");

  if (configured && !/localhost|127\.0\.0\.1/i.test(configured)) {
    return configured;
  }

  return "https://hunarwoods.com";
}

function buildOrderConfirmationHtml(data: OrderEmailData): string {
  const orderDate = new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemRows = data.items
    .map((item) => {
      // Product thumbnails in email often get blocked; keep text-first for deliverability
      const includedList =
        item.includedProducts && item.includedProducts.length > 0
          ? `<p style="margin:6px 0 0;font-size:12px;color:#6b6560;font-family:Arial,sans-serif;">Includes: ${escapeHtml(
              item.includedProducts
                .map(
                  (product) =>
                    `${product.name}${product.quantity > 1 ? ` × ${product.quantity}` : ""}`
                )
                .join(", ")
            )}</p>`
          : "";

      return `
        <tr>
          <td style="padding:16px 0;border-bottom:1px solid #e0dbd2;vertical-align:top;">
            <p style="margin:0;font-size:15px;font-weight:600;color:#1e3a2f;font-family:Georgia,serif;">${escapeHtml(item.name)}</p>
            <p style="margin:6px 0 0;font-size:12px;color:#6b6560;font-family:Arial,sans-serif;">Quantity: ${item.quantity}</p>
            ${includedList}
            <p style="margin:4px 0 0;font-size:12px;color:#6b6560;font-family:Arial,sans-serif;">Unit price: ${formatPrice(item.unitPrice)}</p>
          </td>
          <td style="padding:16px 0;border-bottom:1px solid #e0dbd2;text-align:right;vertical-align:top;white-space:nowrap;">
            <p style="margin:0;font-size:15px;font-weight:700;color:#1e3a2f;font-family:Arial,sans-serif;">${formatPrice(item.lineTotal)}</p>
          </td>
        </tr>`;
    })
    .join("");

  const discountRow =
    data.discount > 0
      ? `<tr>
          <td style="padding:10px 0;color:#6b6560;font-size:14px;font-family:Arial,sans-serif;">Discount${data.couponCode ? ` (${escapeHtml(data.couponCode)})` : ""}</td>
          <td style="padding:10px 0;text-align:right;color:#1e3a2f;font-size:14px;font-family:Arial,sans-serif;">−${formatPrice(data.discount)}</td>
        </tr>`
      : "";

  const siteUrl = getPublicSiteUrl();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your order ${escapeHtml(data.orderNumber)} is confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f5f1e8;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1e8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
          <!-- Header -->
          <tr>
            <td style="background:#1e3a2f;border-radius:16px 16px 0 0;padding:32px;text-align:center;">
              <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#c4a574;font-family:Arial,sans-serif;">Hunar Woods</p>
              <h1 style="margin:0;font-size:26px;font-weight:600;color:#ffffff;font-family:Georgia,serif;">Your Order Has Been Placed!</h1>
              <p style="margin:12px 0 0;font-size:14px;color:rgba(255,255,255,0.75);font-family:Arial,sans-serif;">Thank you for shopping with us</p>
            </td>
          </tr>

          <!-- Body card -->
          <tr>
            <td style="background:#ffffff;border-left:1px solid #e0dbd2;border-right:1px solid #e0dbd2;padding:32px;">
              <p style="margin:0 0 8px;font-size:15px;color:#1a1a1a;font-family:Arial,sans-serif;">
                Hi <strong>${escapeHtml(data.customer.customerName)}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:14px;line-height:1.7;color:#6b6560;font-family:Arial,sans-serif;">
                We've received your order and it's being processed. Your order details are below. Our team will contact you soon to confirm delivery.
              </p>

              <!-- Order ID box -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1e8;border-radius:12px;border:1px solid #e0dbd2;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-family:Arial,sans-serif;">
                          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#6b6560;">Order Number</p>
                          <p style="margin:0;font-size:22px;font-weight:700;color:#1e3a2f;font-family:Georgia,serif;">${escapeHtml(data.orderNumber)}</p>
                        </td>
                        <td style="text-align:right;font-family:Arial,sans-serif;">
                          <span style="display:inline-block;padding:6px 12px;background:#1e3a2f;color:#ffffff;font-size:11px;font-weight:600;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;">Confirmed</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:14px;font-family:Arial,sans-serif;">
                          <p style="margin:0 0 4px;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:#6b6560;">Order ID</p>
                          <p style="margin:0;font-size:12px;color:#6b6560;word-break:break-all;">${escapeHtml(data.orderId)}</p>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top:10px;font-family:Arial,sans-serif;">
                          <p style="margin:0;font-size:12px;color:#6b6560;">Ordered on ${orderDate}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Products -->
              <h2 style="margin:0 0 16px;font-size:18px;color:#1e3a2f;font-family:Georgia,serif;">Your Products</h2>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                ${itemRows}
              </table>

              <!-- Totals -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#faf8f4;border-radius:12px;padding:4px 20px;margin-bottom:28px;">
                <tr>
                  <td style="padding:10px 0;color:#6b6560;font-size:14px;font-family:Arial,sans-serif;">Subtotal</td>
                  <td style="padding:10px 0;text-align:right;font-size:14px;font-family:Arial,sans-serif;">${formatPrice(data.subtotal)}</td>
                </tr>
                ${discountRow}
                <tr>
                  <td style="padding:10px 0;color:#6b6560;font-size:14px;font-family:Arial,sans-serif;">Shipping</td>
                  <td style="padding:10px 0;text-align:right;font-size:14px;font-family:Arial,sans-serif;">${data.shipping === 0 ? '<span style="color:#1e3a2f;font-weight:600;">Free</span>' : formatPrice(data.shipping)}</td>
                </tr>
                <tr>
                  <td style="padding:16px 0 12px;border-top:2px solid #1e3a2f;font-size:17px;font-weight:700;color:#1e3a2f;font-family:Georgia,serif;">Order Total</td>
                  <td style="padding:16px 0 12px;border-top:2px solid #1e3a2f;text-align:right;font-size:20px;font-weight:700;color:#1e3a2f;font-family:Georgia,serif;">${formatPrice(data.total)}</td>
                </tr>
              </table>

              <!-- Shipping & payment -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="48%" valign="top" style="padding-right:12px;">
                    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#c4a574;font-family:Arial,sans-serif;">Deliver To</p>
                    <p style="margin:0;font-size:13px;line-height:1.7;color:#1a1a1a;font-family:Arial,sans-serif;">
                      ${escapeHtml(data.customer.customerName)}<br />
                      ${escapeHtml(data.customer.shippingAddress)}<br />
                      ${escapeHtml(data.customer.shippingCity)}, Pakistan<br />
                      Phone: ${escapeHtml(data.customer.customerPhone)}
                    </p>
                  </td>
                  <td width="48%" valign="top" style="padding-left:12px;">
                    <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#c4a574;font-family:Arial,sans-serif;">Payment</p>
                    <p style="margin:0;font-size:13px;line-height:1.7;color:#1a1a1a;font-family:Arial,sans-serif;">
                      ${PAYMENT_LABELS[data.customer.paymentMethod]}<br />
                      Email: ${escapeHtml(data.customer.customerEmail)}
                    </p>
                  </td>
                </tr>
              </table>
              ${
                data.customer.shippingNotes
                  ? `<p style="margin:20px 0 0;padding:12px 16px;background:#f5f1e8;border-radius:8px;font-size:13px;color:#6b6560;font-family:Arial,sans-serif;"><strong style="color:#1e3a2f;">Delivery notes:</strong> ${escapeHtml(data.customer.shippingNotes)}</p>`
                  : ""
              }

              <!-- CTA -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;">
                <tr>
                  <td align="center">
                    <a href="${siteUrl}/products" style="display:inline-block;padding:14px 32px;background:#c4a574;color:#1e3a2f;font-size:14px;font-weight:700;text-decoration:none;border-radius:8px;font-family:Arial,sans-serif;">Continue Shopping</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#2d3c2a;border-radius:0 0 16px 16px;padding:20px 32px;text-align:center;border:1px solid #2d3c2a;">
              <p style="margin:0 0 6px;font-size:12px;color:rgba(255,255,255,0.7);font-family:Arial,sans-serif;">
                Questions? Reply to this email or contact
                <a href="mailto:hunarwoods@gmail.com" style="color:#c4a574;text-decoration:none;">hunarwoods@gmail.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.45);font-family:Arial,sans-serif;">
                © ${new Date().getFullYear()} Hunar Woods. Premium handmade solid wood furniture.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildPlainText(data: OrderEmailData): string {
  return [
    "HUNAR WOODS — YOUR ORDER HAS BEEN PLACED",
    "",
    `Hi ${data.customer.customerName},`,
    "",
    "Thank you for your order! We've received it and our team will contact you shortly.",
    "",
    `Order Number: ${data.orderNumber}`,
    `Order ID: ${data.orderId}`,
    "",
    "YOUR PRODUCTS",
    "─────────────",
    ...data.items.map(
      (item) =>
        `• ${item.name}\n  Qty: ${item.quantity} | ${formatPrice(item.unitPrice)} each | Total: ${formatPrice(item.lineTotal)}`
    ),
    "",
    `Subtotal:  ${formatPrice(data.subtotal)}`,
    ...(data.discount > 0 ? [`Discount:  −${formatPrice(data.discount)}`] : []),
    `Shipping:  ${data.shipping === 0 ? "Free" : formatPrice(data.shipping)}`,
    `TOTAL:     ${formatPrice(data.total)}`,
    "",
    "DELIVERY ADDRESS",
    "────────────────",
    data.customer.customerName,
    data.customer.shippingAddress,
    `${data.customer.shippingCity}, Pakistan`,
    data.customer.customerPhone,
    "",
    `Payment: ${PAYMENT_LABELS[data.customer.paymentMethod]}`,
    "",
    "— Hunar Woods",
  ].join("\n");
}

function getAdminRecipients(customerEmail: string): string[] {
  const recipients = new Set<string>();

  for (const value of [
    process.env.ORDER_STORE_EMAIL,
    process.env.GMAIL_USER,
  ]) {
    const email = value?.trim().toLowerCase();
    if (email && email.includes("@") && email !== customerEmail) {
      recipients.add(email);
    }
  }

  return [...recipients];
}

export async function sendOrderConfirmationEmail(
  data: OrderEmailData
): Promise<{ sent: boolean; error?: string }> {
  const customerEmail = data.customer.customerEmail.trim().toLowerCase();

  if (!customerEmail || !customerEmail.includes("@")) {
    console.error("[email] invalid customer email:", customerEmail);
    return { sent: false, error: "Invalid customer email" };
  }

  const emailPayload = {
    ...data,
    customer: { ...data.customer, customerEmail },
  };
  const html = buildOrderConfirmationHtml(emailPayload);
  const text = buildPlainText(emailPayload);
  const subject = `Order ${data.orderNumber} confirmed — Hunar Woods`;
  const adminSubject = `New store order ${data.orderNumber} (${formatPrice(data.total)})`;
  const from = getFromAddress();
  const replyTo = process.env.GMAIL_USER ?? process.env.ORDER_REPLY_TO;
  const adminEmails = getAdminRecipients(customerEmail);
  const mailHeaders = {
    "X-Entity-Ref-ID": data.orderId,
    "X-Auto-Response-Suppress": "OOF, AutoReply",
  };

  const gmail = createGmailTransporter();
  if (gmail) {
    try {
      await gmail.sendMail({
        from,
        to: customerEmail,
        replyTo: replyTo ?? undefined,
        subject,
        html,
        text,
        headers: mailHeaders,
        priority: "normal",
      });

      console.log("[email] Gmail confirmation sent to:", customerEmail);

      for (const adminEmail of adminEmails) {
        await gmail.sendMail({
          from,
          to: adminEmail,
          replyTo: customerEmail,
          subject: adminSubject,
          html,
          text,
          headers: mailHeaders,
          priority: "normal",
        });
        console.log("[email] Gmail admin copy sent to:", adminEmail);
      }

      return { sent: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gmail send failed";
      console.error("[email] Gmail send failed:", message);
      return { sent: false, error: message };
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[email] Set GMAIL_USER + GMAIL_APP_PASSWORD or RESEND_API_KEY to send order emails"
    );
    return { sent: false, error: "Email not configured" };
  }

  const resend = new Resend(apiKey);

  try {
    const { error } = await resend.emails.send({
      from,
      to: customerEmail,
      replyTo: replyTo ?? undefined,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("[email] Resend failed:", error.message);
      return { sent: false, error: error.message };
    }

    console.log("[email] Resend confirmation sent to:", customerEmail);

    for (const adminEmail of adminEmails) {
      const { error: adminError } = await resend.emails.send({
        from,
        to: adminEmail,
        subject: adminSubject,
        html,
        text,
      });

      if (adminError) {
        console.error("[email] Resend admin copy failed:", adminError.message);
      } else {
        console.log("[email] Resend admin copy sent to:", adminEmail);
      }
    }

    return { sent: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error("[email] send failed:", message);
    return { sent: false, error: message };
  }
}
