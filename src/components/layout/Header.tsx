import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, ScrollTrigger, useGSAP } from '@/animations/gsap';
import { prefersReducedMotion } from '@/animations/motion';
import { navItems } from '@/data/content';
import { useActiveSection } from '@/hooks/useActiveSection';
import { Button } from '@/components/ui/Button';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { BrandLockup } from '@/components/ui/LogoMark';
import { cn } from '@/utils/cn';
import { MobileMenu } from './MobileMenu';
import { TopStrip } from './TopStrip';

const SECTION_IDS = navItems.map((item) => item.id);

export function Header() {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  const header = useRef<HTMLElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  // Transparent over the hero → compact solid bar once the page scrolls.
  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true, defaults: { duration: 0.55, ease: 'power3.inOut' } });
      tl.to(strip.current, { height: 0, autoAlpha: 0 }, 0)
        .fromTo(
          bar.current,
          { backgroundColor: 'rgba(247,243,237,0)', boxShadow: '0 18px 40px -30px rgba(70,39,21,0)' },
          { backgroundColor: 'rgba(247,243,237,0.98)', boxShadow: '0 18px 40px -30px rgba(70,39,21,0.45)' },
          0,
        )
        .fromTo(inner.current, { height: 88 }, { height: 68 }, 0);

      if (prefersReducedMotion()) tl.timeScale(20);

      const trigger = ScrollTrigger.create({
        start: 80,
        end: 'max',
        onToggle: (self) => (self.isActive ? tl.play() : tl.reverse()),
      });
      if (trigger.isActive) tl.progress(1);
    },
    { scope: header },
  );

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    menuButton.current?.focus({ preventScroll: true });
  }, []);

  return (
    <>
      <header ref={header} className="fixed inset-x-0 top-0 z-50">
        <TopStrip ref={strip} />
        <div ref={bar}>
          <div ref={inner} className="container-x flex h-[88px] items-center justify-between gap-6">
            <a href="#home" aria-label={t('a11y.home')} className="shrink-0">
              <BrandLockup />
            </a>

            <nav aria-label={t('a11y.mainNav')} className="hidden xl:block">
              <ul
                className="flex items-center gap-0.5 rounded-full border border-charcoal/10 bg-cream/95 px-2 py-1.5"
              >
                {navItems.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        aria-current={isActive ? 'true' : undefined}
                        className={cn(
                          'relative block rounded-full px-3.5 py-2 text-[0.82rem] font-semibold transition-colors duration-300 hover:text-terracotta',
                          isActive ? 'text-terracotta' : 'text-charcoal',
                        )}
                      >
                        {t(item.key)}
                        <span
                          aria-hidden
                          className={cn(
                            'shape-bar absolute bottom-0.5 left-1/2 h-[3px] w-4 -translate-x-1/2 bg-terracotta transition-transform duration-500 ease-premium',
                            isActive ? 'scale-x-100' : 'scale-x-0',
                          )}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-3">
              <LanguageSwitcher tone="glass" className="hidden sm:inline-flex" />
              <Button href="#contact" size="sm" className="hidden md:inline-flex">
                {t('nav.quote')}
              </Button>
              <button
                ref={menuButton}
                type="button"
                aria-label={t('a11y.menuOpen')}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen(true)}
                className="group grid size-11 place-items-center border border-charcoal/10 bg-cream/95 transition-colors hover:bg-charcoal xl:hidden"
              >
                <span aria-hidden className="flex w-5 flex-col items-end gap-[5px]">
                  <span className="h-[2px] w-5 bg-charcoal transition-colors group-hover:bg-cream" />
                  <span className="h-[2px] w-3.5 bg-terracotta transition-all group-hover:w-5 group-hover:bg-cream" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
