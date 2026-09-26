import { useRef, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileText, Mail, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { ContactForm } from '@/components/ContactForm';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { EMAIL, people } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';
import { formatPhone, telHref, whatsappHref } from '@/utils/format';
import { scrollToTarget } from '@/utils/scroll';

export function Contact() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  const focusForm = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const form = document.getElementById('quote-form');
    if (!form) return;
    scrollToTarget(form);
    form.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  };

  const actions = [
    { key: 'quote', href: '#quote-form', icon: FileText, onClick: focusForm },
    { key: 'call', href: telHref(people[0].phone), icon: Phone },
    { key: 'email', href: `mailto:${EMAIL}`, icon: Mail },
  ] as const;

  return (
    <section
      id="contact"
      data-cursor-theme="dark"
      ref={root}
      tabIndex={-1}
      aria-labelledby="contact-title"
      className="section-y grain relative isolate overflow-hidden bg-brown text-cream"
    >
      <div aria-hidden className="brick-pattern absolute inset-y-0 end-0 -z-10 w-1/2 text-cream opacity-[0.03]" />

      <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-title"
            tone="light"
            eyebrow={t('contact.eyebrow')}
            title={t('contact.title')}
            intro={t('contact.text')}
            size="display"
          />

          <ul data-stagger className="mt-10 border-t border-cream/15">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <li key={action.key}>
                  <a
                    href={action.href}
                    onClick={'onClick' in action ? action.onClick : undefined}
                    className="group flex items-center gap-5 border-b border-cream/15 py-5 text-lg font-bold transition-colors hover:text-terracotta-300"
                  >
                    <Icon aria-hidden className="size-5 text-terracotta-300" strokeWidth={1.7} />
                    <span className="flex-1">{t(`contact.actions.${action.key}`)}</span>
                    <ArrowRight
                      aria-hidden
                      className="size-5 transition-transform duration-500 ease-premium group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1"
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div data-reveal="fade-up" className="mt-12">
            <p className="text-eyebrow text-cream/50">{t('contact.direct')}</p>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {people.map((person) => {
                const name = t(`people.${person.id}`);
                return (
                  <li key={person.id}>
                    <p className="font-bold">{name}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <a href={telHref(person.phone)} className="ltr-nums text-cream/75 transition-colors hover:text-cream">
                        {formatPhone(person.phone)}
                      </a>
                      <a
                        href={whatsappHref(person.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t('common.whatsapp')} ${name} (${t('a11y.opensNewTab')})`}
                        className="grid size-8 place-items-center rounded-full border border-cream/20 text-cream/80 transition-colors hover:border-[#25D366] hover:text-[#25D366]"
                      >
                        <FaWhatsapp aria-hidden className="size-4" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
            <a href={`mailto:${EMAIL}`} className="mt-6 inline-flex items-center gap-2 font-bold text-cream transition-colors hover:text-terracotta-300">
              <Mail aria-hidden className="size-4" />
              <span className="ltr-nums">{EMAIL}</span>
            </a>
          </div>
        </div>

        <div data-reveal="slide-end" className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
