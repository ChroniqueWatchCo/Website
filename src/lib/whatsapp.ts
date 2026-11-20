/**
 * WhatsApp link builder (Section 9.3).
 * Links are built AT BUILD TIME and rendered as plain <a href> —
 * they work with JavaScript disabled.
 */

export interface WhatsAppLinkOptions {
  phone: string;          // digits only, international format, from Site Settings
  storeName: string;
  productName: string;
  type: 'original' | 'replica';
  price: number;
  currencyLabel: string;  // e.g. "Rs."
  url: string;            // absolute product URL using SITE_URL
}

/** Validate a WhatsApp number: 10–15 digits after stripping non-digits. */
export function isValidWhatsAppNumber(phone: string | undefined | null): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

export function buildWhatsAppLink(opts: WhatsAppLinkOptions): string {
  const digits = opts.phone.replace(/\D/g, '');
  const t = opts.type === 'original' ? 'Original' : 'Replica';
  const msg =
`Hi ${opts.storeName}, I want to order this watch:
• ${opts.productName}
• Type: ${t}
• Price: ${opts.currencyLabel} ${opts.price.toLocaleString('en-PK')}
• Link: ${opts.url}
Please confirm availability.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}

/** Generic chat link (header/footer/contact/sold-out fallback). No product text. */
export function buildGenericWhatsAppLink(
  phone: string,
  storeName: string,
  message?: string
): string {
  const digits = phone.replace(/\D/g, '');
  const msg = message ?? `Hi ${storeName}, I have a question about your watches.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg)}`;
}
