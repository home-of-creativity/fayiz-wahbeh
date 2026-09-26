/** +963944265817 → +963 944 265 817 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, '')}`;
}

export function whatsappHref(phone: string, text?: string): string {
  const base = `https://wa.me/${phone.replace(/\D/g, '')}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function mapsHref(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
