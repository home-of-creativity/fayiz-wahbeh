import { useEffect, useRef, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, X } from 'lucide-react';
import { gsap, useGSAP } from '@/animations/gsap';
import { prefersReducedMotion } from '@/animations/motion';
import { EMAIL, navItems, people } from '@/data/content';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { BrandLockup, LogoMark } from '@/components/ui/LogoMark';
import { formatPhone, telHref } from '@/utils/format';
import { lockScroll } from '@/utils/scroll';

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const FOCUSABLE = 'a[href], button:not([disabled])';

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useTranslation();
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const el = panel.current;
      if (!el) return;
      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          gsap.set(el, { visibility: 'hidden' });
        },
      });
      tl.fromTo(el, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'power4.inOut' })
        .from('[data-menu-item]', { yPercent: 120, duration: 0.7, stagger: 0.05, ease: 'power3.out' }, '-=0.3')
        .from('[data-menu-fade]', { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.06 }, '-=0.45');
      timeline.current = tl;
    },
    { scope: panel },
  );

  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;
    if (!open) {
      if (tl.progress() > 0) {
        lockScroll(false);
        // Closing runs faster than opening.
        tl.timeScale(prefersReducedMotion() ? 10 : 1.8).reverse();
      }
      return;
    }
    // Visible before focusing, otherwise focus cannot move into the dialog.
    if (panel.current) gsap.set(panel.current, { visibility: 'visible' });
    lockScroll(true);
    tl.timeScale(prefersReducedMotion() ? 10 : 1).play();
    closeButton.current?.focus();

    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [open, onClose]);

  /** Keeps Tab focus cycling inside the open dialog. */
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !panel.current) return;
    const focusables = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  return (
    <div
      id="mobile-menu"
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={t('a11y.menuTitle')}
      onKeyDown={onKeyDown}
      className="invisible fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-brown text-cream xl:hidden"
      data-lenis-prevent
    >
      <LogoMark
        tone="onDark"
        className="pointer-events-none absolute -bottom-10 w-[140%] max-w-none opacity-[0.05] ltr:-right-1/3 rtl:-left-1/3"
      />

      <div className="container-x flex h-[76px] shrink-0 items-center justify-between">
        <BrandLockup tone="onDark" compact />
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label={t('a11y.menuClose')}
          className="grid size-11 place-items-center border border-cream/20 transition-colors hover:bg-cream hover:text-brown"
        >
          <X aria-hidden className="size-5" />
        </button>
      </div>

      <nav aria-label={t('a11y.mainNav')} className="container-x relative flex-1 py-8">
        <ol className="flex flex-col gap-1">
          {navItems.map((item, index) => (
            <li key={item.id} className="overflow-hidden">
              <a
                href={`#${item.id}`}
                onClick={onClose}
                data-menu-item
                className="group flex items-baseline gap-4 py-1.5 text-[clamp(2rem,8.5vw,3.25rem)] font-bold leading-tight transition-colors hover:text-terracotta-300"
              >
                <span className="ltr-nums text-xs font-semibold tracking-[0.2em] text-terracotta-300">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {t(item.key)}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="container-x relative flex flex-col gap-6 border-t border-cream/15 py-8">
        <div data-menu-fade className="flex flex-wrap items-center justify-between gap-4">
          <LanguageSwitcher tone="light" />
          <Button href="#contact" onClick={onClose} variant="light" size="md">
            {t('nav.quote')}
          </Button>
        </div>
        <ul data-menu-fade className="grid gap-3 text-sm text-cream/75 sm:grid-cols-3">
          {people.map((person) => (
            <li key={person.id}>
              <a href={telHref(person.phone)} className="flex flex-col hover:text-cream">
                <span>{t(`people.${person.id}`)}</span>
                <span className="ltr-nums self-start font-semibold text-cream">{formatPhone(person.phone)}</span>
              </a>
            </li>
          ))}
          <li>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-2 font-semibold text-cream hover:text-terracotta-300">
              <Mail aria-hidden className="size-4" />
              {EMAIL}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
