import i18n from '@/i18n';
import { EMAIL } from '@/data/content';

export interface QuoteRequest {
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  message: string;
}

export const emptyQuote: QuoteRequest = {
  name: '',
  company: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
};

function projectTypeLabel(value: string): string {
  return value ? i18n.t(`contact.form.types.${value}`) : '';
}

/** Plain-text summary of the request, in the visitor's current language. */
export function quoteBody(request: QuoteRequest): string {
  const label = (key: keyof QuoteRequest) => i18n.t(`contact.form.labels.${key}`);
  const lines: Array<[keyof QuoteRequest, string]> = [
    ['name', request.name],
    ['company', request.company],
    ['email', request.email],
    ['phone', request.phone],
    ['projectType', projectTypeLabel(request.projectType)],
  ];
  const details = lines.filter(([, value]) => value.trim()).map(([key, value]) => `${label(key)}: ${value.trim()}`);
  return [...details, '', `${label('message')}:`, request.message.trim()].join('\n');
}

export function quoteMailto(request: QuoteRequest): string {
  const subject = `${i18n.t('contact.form.subject')} — ${request.name.trim()}`;
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(quoteBody(request))}`;
}
