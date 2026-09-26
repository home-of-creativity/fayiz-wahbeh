import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Info, Mail } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { people, projectTypes } from '@/data/content';
import { Button } from '@/components/ui/Button';
import { emptyQuote, quoteBody, quoteMailto, type QuoteRequest } from '@/utils/contact';
import { whatsappHref } from '@/utils/format';
import { cn } from '@/utils/cn';

const INPUT =
  'w-full border-0 border-b border-charcoal/25 bg-transparent px-0 py-3 text-base text-charcoal outline-none transition-colors placeholder:text-charcoal/35 focus:border-terracotta focus-visible:outline-none';

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  requiredLabel: string;
  className?: string;
  children: ReactNode;
}

function Field({ id, label, required, requiredLabel, className, children }: FieldProps) {
  return (
    <div className={cn('group relative', className)}>
      <label htmlFor={id} className="text-eyebrow text-charcoal/60 transition-colors group-focus-within:text-terracotta-600">
        {label}
        {required && (
          <span className="text-terracotta" title={requiredLabel}>
            {' '}*
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export function ContactForm() {
  const { t } = useTranslation();
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<QuoteRequest>(emptyQuote);
  const [error, setError] = useState('');
  const [opened, setOpened] = useState(false);
  const id = (name: keyof QuoteRequest) => `${uid}-${name}`;

  const update = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    setError('');
    setOpened(false);
  };

  /** Native validation plus "email or phone" so the team can always reply. */
  const validate = (): boolean => {
    if (!form.current?.reportValidity()) return false;
    if (!values.email.trim() && !values.phone.trim()) {
      setError(t('contact.form.contactRequired'));
      document.getElementById(id('email'))?.focus();
      return false;
    }
    return true;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    window.location.href = quoteMailto(values);
    setOpened(true);
  };

  const onWhatsapp = () => {
    if (!validate()) return;
    const text = `${t('contact.form.subject')}\n\n${quoteBody(values)}`;
    window.open(whatsappHref(people[0].phone, text), '_blank', 'noopener,noreferrer');
  };

  return (
    <form
      id="quote-form"
      data-cursor-theme="light"
      ref={form}
      onSubmit={onSubmit}
      aria-labelledby={`${uid}-title`}
      className="relative bg-cream p-7 text-charcoal shadow-[0_50px_100px_-50px_rgba(0,0,0,0.6)] sm:p-10 lg:p-12"
    >
      <span aria-hidden className="shape-bar absolute start-10 top-0 h-2 w-16 bg-terracotta" />
      <h3 id={`${uid}-title`} className="text-h3">
        {t('contact.form.title')}
      </h3>

      <div className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field id={id('name')} label={t('contact.form.name')} required requiredLabel={t('contact.form.required')}>
          <input id={id('name')} name="name" autoComplete="name" required value={values.name} onChange={update} className={INPUT} />
        </Field>
        <Field id={id('company')} label={t('contact.form.company')} requiredLabel={t('contact.form.required')}>
          <input id={id('company')} name="company" autoComplete="organization" value={values.company} onChange={update} className={INPUT} />
        </Field>
        <Field id={id('email')} label={t('contact.form.email')} requiredLabel={t('contact.form.required')}>
          <input
            id={id('email')}
            name="email"
            type="email"
            dir="ltr"
            autoComplete="email"
            value={values.email}
            onChange={update}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${uid}-error` : undefined}
            className={cn(INPUT, 'rtl:text-right')}
          />
        </Field>
        <Field id={id('phone')} label={t('contact.form.phone')} requiredLabel={t('contact.form.required')}>
          <input
            id={id('phone')}
            name="phone"
            type="tel"
            dir="ltr"
            autoComplete="tel"
            value={values.phone}
            onChange={update}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? `${uid}-error` : undefined}
            className={cn(INPUT, 'rtl:text-right')}
          />
        </Field>
        <Field id={id('projectType')} label={t('contact.form.projectType')} requiredLabel={t('contact.form.required')} className="sm:col-span-2">
          <div className="relative">
            <select
              id={id('projectType')}
              name="projectType"
              value={values.projectType}
              onChange={update}
              className={cn(INPUT, 'cursor-pointer appearance-none pe-8', !values.projectType && 'text-charcoal/45')}
            >
              <option value="">{t('contact.form.select')}</option>
              {projectTypes.map((type) => (
                <option key={type} value={type} className="text-charcoal">
                  {t(`contact.form.types.${type}`)}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute end-0 top-1/2 size-4 -translate-y-1/2 text-charcoal/50" />
          </div>
        </Field>
        <Field id={id('message')} label={t('contact.form.message')} required requiredLabel={t('contact.form.required')} className="sm:col-span-2">
          <textarea
            id={id('message')}
            name="message"
            required
            rows={4}
            value={values.message}
            onChange={update}
            placeholder={t('contact.form.messagePlaceholder')}
            className={cn(INPUT, 'resize-none')}
          />
        </Field>
      </div>

      <div aria-live="polite" className="min-h-[1.5rem]">
        {error && (
          <p id={`${uid}-error`} className="mt-5 text-sm font-semibold text-terracotta-600">
            {error}
          </p>
        )}
        {opened && <p className="mt-5 text-sm font-semibold text-[#1f7a4a]">{t('contact.form.opened')}</p>}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" size="lg" icon={<Mail aria-hidden className="size-4" />}>
          {t('contact.form.submitEmail')}
        </Button>
        <Button variant="secondary" size="lg" onClick={onWhatsapp} icon={<FaWhatsapp aria-hidden className="size-4" />}>
          {t('contact.form.submitWhatsapp')}
        </Button>
      </div>

      <p className="mt-6 flex items-start gap-2.5 text-xs leading-relaxed text-charcoal/60">
        <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
        {t('contact.form.note')}
      </p>
    </form>
  );
}
