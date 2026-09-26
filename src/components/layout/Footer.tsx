import { useRef, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { BrandLockup } from '@/components/ui/LogoMark';
import { EMAIL, locations, navItems, people } from '@/data/content';
import { products } from '@/data/products';
import { services } from '@/data/services';
import { useReveal } from '@/hooks/useReveal';
import { formatPhone, mapsHref, telHref } from '@/utils/format';

const LINK = 'transition-colors duration-300 hover:text-terracotta-300';

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="text-eyebrow text-cream/45">{title}</h2>
      <ul className="mt-6 flex flex-col gap-3 text-[0.92rem]">{children}</ul>
    </div>
  );
}

export function Footer() {
  const { t } = useTranslation();
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <footer ref={root} data-cursor-theme="dark" className="grain relative overflow-hidden bg-brown-800 text-cream/75">
      <div className="container-x pb-10 pt-24">
        <div data-stagger className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-4">
            <a href="#home" aria-label={t('a11y.home')} className="inline-block">
              <BrandLockup tone="onDark" />
            </a>
            <p className="mt-7 max-w-sm leading-relaxed">{t('footer.description')}</p>
            <div className="mt-8">
              <p className="text-eyebrow mb-3 text-cream/45">{t('footer.language')}</p>
              <LanguageSwitcher tone="light" />
            </div>
          </div>

          <nav aria-label={t('a11y.footerNav')} className="lg:col-span-2">
            <Column title={t('footer.navTitle')}>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={LINK}>
                    {t(item.key)}
                  </a>
                </li>
              ))}
            </Column>
          </nav>

          <div className="lg:col-span-2">
            <Column title={t('footer.productsTitle')}>
              {products.map((product) => (
                <li key={product.id}>
                  <a href="#products" className={LINK}>
                    {t(`products.items.${product.id}.name`)}
                  </a>
                </li>
              ))}
            </Column>
          </div>

          <div className="lg:col-span-2">
            <Column title={t('footer.servicesTitle')}>
              {services.map((service) => (
                <li key={service.id}>
                  <a href="#services" className={LINK}>
                    {t(`services.items.${service.id}.name`)}
                  </a>
                </li>
              ))}
            </Column>
          </div>

          <div className="lg:col-span-2">
            <Column title={t('footer.contactTitle')}>
              {people.map((person) => (
                <li key={person.id}>
                  <a href={telHref(person.phone)} className={`${LINK} flex flex-col`}>
                    <span className="text-cream">{t(`people.${person.id}`)}</span>
                    <span className="ltr-nums inline-flex items-center gap-2 self-start">
                      <Phone aria-hidden className="size-3.5 text-terracotta-300" />
                      {formatPhone(person.phone)}
                    </span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${EMAIL}`} className={`${LINK} inline-flex items-center gap-2`}>
                  <Mail aria-hidden className="size-3.5 text-terracotta-300" />
                  <span className="ltr-nums">{EMAIL}</span>
                </a>
              </li>
            </Column>
          </div>
        </div>

        {/* Locations band */}
        <div className="mt-16 border-t border-cream/10 pt-10">
          <h2 className="text-eyebrow text-cream/45">{t('footer.locationsTitle')}</h2>
          <ul className="mt-6 grid gap-6 text-[0.92rem] sm:grid-cols-2 lg:grid-cols-4">
            {locations.map((location) => {
              const detail = t(`locations.items.${location.id}.detail`);
              return (
                <li key={location.id}>
                  <a href={mapsHref(location.query)} target="_blank" rel="noopener noreferrer" className={`${LINK} flex gap-3`}>
                    <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-terracotta-300" />
                    <span>
                      <span className="block font-semibold text-cream">
                        {t(`locations.items.${location.id}.name`)}
                        {detail && ` — ${detail}`}
                      </span>
                      <span className="block text-cream/55">{t(`locations.items.${location.id}.region`)}</span>
                      <span className="sr-only">({t('a11y.opensNewTab')})</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <p
          aria-hidden
          className="mt-20 select-none whitespace-nowrap text-center text-[clamp(3rem,13vw,13rem)] font-extrabold uppercase leading-none tracking-[-0.04em] text-cream/[0.06] rtl:tracking-normal"
        >
          {t('brand.name')}
        </p>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-6 border-t border-cream/10 pt-8 text-sm sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
          </p>
          <a href="#home" className="group inline-flex items-center gap-3 font-bold text-cream">
            {t('a11y.backToTop')}
            <span className="grid size-10 place-items-center rounded-full border border-cream/20 transition-colors group-hover:border-terracotta group-hover:bg-terracotta">
              <ArrowUp aria-hidden className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
