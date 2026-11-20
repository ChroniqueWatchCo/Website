/** Price formatting and small display helpers (Section 19). */

/** Format a price like `Rs. 132,850` using the label from Site Settings. */
export function formatPrice(price: number, currencyLabel = 'Rs.'): string {
  const n = Math.round(price).toLocaleString('en-PK');
  return `${currencyLabel} ${n}`;
}

/** Discount percent computed at build time (Section 19). Returns null if no discount. */
export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round((1 - price / oldPrice) * 100);
}

/** "Original" / "Replica" display label. */
export function typeLabel(type: 'original' | 'replica'): string {
  return type === 'original' ? 'Original' : 'Replica';
}

/** Capitalize first letter for filter labels etc. */
export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
