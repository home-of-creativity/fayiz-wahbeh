import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Plus, X } from 'lucide-react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isRTL, POINTER_FINE } from '@/animations/motion';
import { cn } from '@/utils/cn';

type BadgeMode = 'view' | 'explore' | 'close';
type Mode = 'default' | 'link' | 'text' | BadgeMode;

const BADGE_MODES: Mode[] = ['view', 'explore', 'close'];
const ICONS = { view: Plus, explore: ArrowUpRight, close: X };
/** Circumference of the text ring in the badge's 100×100 viewBox (r = 38). */
const RING_LENGTH = 2 * Math.PI * 38;

function modeFor(target: Element | null): Mode {
  if (!target) return 'default';
  const zone = target.closest<HTMLElement>('[data-cursor]');
  if (zone) {
    const value = zone.dataset.cursor;
    return value === 'explore' || value === 'close' ? value : 'view';
  }
  if (target.closest('input, textarea, select')) return 'text';
  if (target.closest('a, button, [role="button"], label')) return 'link';
  return 'default';
}

function isDarkAt(target: Element | null): boolean {
  return target?.closest('[data-cursor-theme]')?.getAttribute('data-cursor-theme') === 'dark';
}

/**
 * Desktop cursor: a dot with a trailing ring that grows over links, and a rotating
 * "View / Explore / Close" badge over images. Touch devices keep their native behaviour.
 */
export function Cursor() {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);
  const [badge, setBadge] = useState<BadgeMode>('view');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(POINTER_FINE, () => {
        const el = root.current;
        if (!el) return;
        const q = gsap.utils.selector(el);
        const [dot] = q('[data-c-dot]');
        const [ring] = q('[data-c-ring]');
        const [pill] = q('[data-c-badge]');
        const [dotInner] = q('[data-c-dot-inner]');
        const [ringInner] = q('[data-c-ring-inner]');
        const [badgeInner] = q('[data-c-badge-inner]');
        const [icon] = q('[data-c-icon]');
        const html = document.documentElement;
        html.classList.add('has-cursor');

        gsap.set([dot, ring, pill], { xPercent: -50, yPercent: -50, autoAlpha: 0 });
        gsap.set(badgeInner, { scale: 0 });

        const follow = (target: Element, duration: number) => ({
          x: gsap.quickTo(target, 'x', { duration, ease: 'power3.out' }),
          y: gsap.quickTo(target, 'y', { duration, ease: 'power3.out' }),
        });
        const dotTo = follow(dot, 0.08);
        const ringTo = follow(ring, 0.38);
        const badgeTo = follow(pill, 0.55);
        const spin = gsap.to(q('[data-c-spin]'), { rotation: 360, duration: 12, ease: 'none', repeat: -1, paused: true, transformOrigin: '50% 50%' });

        let mode: Mode = 'default';
        let visible = false;
        let last = { x: -100, y: -100 };

        const setMode = (next: Mode) => {
          if (next === mode) return;
          const wasBadge = BADGE_MODES.includes(mode);
          const isBadge = BADGE_MODES.includes(next);
          mode = next;

          if (isBadge) {
            setBadge(next as BadgeMode);
            spin.play();
            gsap.fromTo(icon, { rotation: -90, scale: 0.3 }, { rotation: 0, scale: 1, duration: 0.6, ease: 'back.out(2)', overwrite: true });
          } else {
            spin.pause();
          }
          if (isBadge !== wasBadge) {
            gsap.to(badgeInner, {
              scale: isBadge ? 1 : 0,
              duration: isBadge ? 0.55 : 0.3,
              ease: isBadge ? 'back.out(1.7)' : 'power2.in',
              overwrite: true,
            });
          }
          gsap.to(ringInner, {
            scale: next === 'link' ? 1.6 : next === 'default' ? 1 : 0,
            backgroundColor: next === 'link' ? 'rgba(192,74,44,0.14)' : 'rgba(192,74,44,0)',
            duration: 0.45,
            ease: 'power3.out',
            overwrite: true,
          });
          gsap.to(dotInner, { scale: next === 'default' ? 1 : next === 'link' ? 0.6 : 0, duration: 0.3, overwrite: true });
        };

        const update = (target: Element | null) => {
          setMode(modeFor(target));
          el.classList.toggle('is-dark', isDarkAt(target));
        };

        const show = (on: boolean) => {
          if (on === visible) return;
          visible = on;
          gsap.to([dot, ring, pill], { autoAlpha: on ? 1 : 0, duration: 0.3, overwrite: 'auto' });
        };

        const onMove = (event: PointerEvent) => {
          if (event.pointerType !== 'mouse') return;
          last = { x: event.clientX, y: event.clientY };
          if (!visible) gsap.set([dot, ring, pill], { x: last.x, y: last.y });
          show(true);
          [dotTo, ringTo, badgeTo].forEach((to) => {
            to.x(last.x);
            to.y(last.y);
          });
        };
        const onOver = (event: PointerEvent) => update(event.target as Element | null);
        // Content scrolls under a still pointer without firing pointerover, so re-check after scrolling.
        let frame = 0;
        const onScroll = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => update(document.elementFromPoint(last.x, last.y)));
        };
        const onDown = () => gsap.to([ring, pill], { scale: 0.85, duration: 0.2, ease: 'power2.out', overwrite: 'auto' });
        const onUp = () => gsap.to([ring, pill], { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
        const onLeave = () => show(false);

        window.addEventListener('pointermove', onMove);
        window.addEventListener('scroll', onScroll, { passive: true });
        document.addEventListener('pointerover', onOver);
        document.addEventListener('pointerdown', onDown);
        document.addEventListener('pointerup', onUp);
        html.addEventListener('mouseleave', onLeave);

        return () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('scroll', onScroll);
          document.removeEventListener('pointerover', onOver);
          document.removeEventListener('pointerdown', onDown);
          document.removeEventListener('pointerup', onUp);
          html.removeEventListener('mouseleave', onLeave);
          cancelAnimationFrame(frame);
          html.classList.remove('has-cursor');
        };
      });
    },
    { scope: root },
  );

  const Icon = ICONS[badge];
  const word = t(`common.${badge}`);
  // Arabic letters cannot join along a curved path, so Arabic shows the word inside the badge instead.
  const rtl = isRTL();
  const ringText = `${word.toUpperCase()} • `.repeat(Math.max(3, Math.round(24 / (word.length + 3))));

  return (
    <div ref={root} aria-hidden className="group/cursor pointer-events-none fixed inset-0 z-[120] hidden [@media(hover:hover)_and_(pointer:fine)]:block">
      {/* Trailing ring */}
      <div data-c-ring className="invisible absolute left-0 top-0">
        <span
          data-c-ring-inner
          className="block size-7 rounded-full border border-charcoal/45 transition-colors duration-300 group-[.is-dark]/cursor:border-cream/60"
        />
      </div>

      {/* Precise dot */}
      <div data-c-dot className="invisible absolute left-0 top-0">
        <span data-c-dot-inner className="block size-[5px] rounded-full bg-terracotta group-[.is-dark]/cursor:bg-cream" />
      </div>

      {/* View / Explore / Close badge */}
      <div data-c-badge className="invisible absolute left-0 top-0">
        <div
          data-c-badge-inner
          className="relative grid size-[5.25rem] place-items-center rounded-full bg-terracotta text-cream shadow-[0_18px_44px_-18px_rgba(70,39,21,0.75)]"
        >
          <svg data-c-spin viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
            {rtl ? (
              <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.2" strokeDasharray="2 5" />
            ) : (
              <>
                <defs>
                  <path id="cursor-ring-path" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fill="currentColor" fontSize={8.6} fontWeight={700} letterSpacing={1.2}>
                  <textPath href="#cursor-ring-path" textLength={RING_LENGTH} lengthAdjust="spacing">
                    {ringText}
                  </textPath>
                </text>
              </>
            )}
          </svg>
          {!rtl && <span className="absolute inset-[29%] rounded-full border border-cream/35" />}
          <span data-c-icon className="relative flex flex-col items-center gap-0.5">
            <Icon className={cn(rtl ? 'size-4' : 'size-[1.1rem]', badge === 'explore' && 'rtl:-scale-x-100')} strokeWidth={1.7} />
            {rtl && <span className="text-[0.72rem] font-bold leading-none">{word}</span>}
          </span>
        </div>
      </div>
    </div>
  );
}
