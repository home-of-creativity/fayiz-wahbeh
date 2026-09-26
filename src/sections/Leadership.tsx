import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { people } from '@/data/content';
import { useReveal } from '@/hooks/useReveal';
import { formatPhone, telHref, whatsappHref } from '@/utils/format';

function initials(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join(' ');
}

export function Leadership() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section id="leadership" ref={root} tabIndex={-1} aria-labelledby="leadership-title" className="section-y bg-clay">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <SectionHeading
          id="leadership-title"
          eyebrow={t('leadership.eyebrow')}
          title={t('leadership.title')}
          intro={t('leadership.text')}
          className="lg:col-span-5"
        />

        <ul data-stagger className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          {people.map((person) => {
            const name = t(`people.${person.id}`);
            return (
              <li key={person.id} className="relative flex flex-col border border-brown/15 bg-cream/70 p-7 sm:p-9">
                <span aria-hidden className="shape-bar absolute end-7 top-0 h-2 w-10 bg-terracotta" />
                <span aria-hidden className="grid size-20 place-items-center rounded-full border border-terracotta text-xl font-extrabold text-terracotta">
                  {initials(name)}
                </span>
                <h3 className="text-h3 mt-8 text-charcoal">{name}</h3>
                <a
                  href={telHref(person.phone)}
                  className="ltr-nums mt-2 self-start text-lg font-semibold text-charcoal-soft transition-colors hover:text-terracotta"
                >
                  {formatPhone(person.phone)}
                </a>
                <div className="mt-8 flex gap-3 border-t border-charcoal/10 pt-6">
                  <a
                    href={telHref(person.phone)}
                    aria-label={`${t('leadership.call')} ${name}`}
                    className="inline-flex h-10 items-center gap-2 border border-charcoal/20 px-4 text-sm font-bold text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-cream"
                  >
                    <Phone aria-hidden className="size-4" />
                    {t('leadership.call')}
                  </a>
                  <a
                    href={whatsappHref(person.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t('leadership.whatsapp')} ${name} (${t('a11y.opensNewTab')})`}
                    className="inline-flex h-10 items-center gap-2 border border-charcoal/20 px-4 text-sm font-bold text-charcoal transition-colors hover:border-[#1f8f55] hover:bg-[#1f8f55] hover:text-white"
                  >
                    <FaWhatsapp aria-hidden className="size-4" />
                    {t('leadership.whatsapp')}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
