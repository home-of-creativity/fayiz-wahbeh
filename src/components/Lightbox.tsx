import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { gsap, useGSAP } from '@/animations/gsap';
import { prefersReducedMotion } from '@/animations/motion';
import { lockScroll } from '@/utils/scroll';

interface LightboxItem {
  src: string;
  srcSet: string;
  alt: string;
}

const ZONES = '[data-cursor="view"], [data-cursor="explore"]';
/** Vertical swipe distance (px) that closes the lightbox on touch screens. */
const SWIPE_CLOSE = 90;

/** The image a zone is currently showing (the sticky Applications frame stacks several). */
function visibleImage(zone: HTMLElement): HTMLImageElement | null {
  const images = Array.from(zone.querySelectorAll('img'));
  const shown = images.find((img) => {
    for (let el: HTMLElement | null = img; el && el !== zone; el = el.parentElement) {
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.opacity === '0') return false;
    }
    return true;
  });
  return shown ?? images[0] ?? null;
}

/** The srcset in the same format the browser already chose, so the large view reuses the cache. */
function srcSetFor(img: HTMLImageElement): string {
  const format = img.currentSrc.split('?')[0].split('.').pop();
  const source = img.closest('picture')?.querySelector<HTMLSourceElement>(`source[type="image/${format}"]`);
  return source?.srcset ?? '';
}

/** Full-screen view for any `[data-cursor="view|explore"]` image. Opens from, and closes back into, the image. */
export function Lightbox() {
  const { t } = useTranslation();
  const [item, setItem] = useState<LightboxItem | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const closing = useRef(false);
  const swipe = useRef<{ startY: number; dy: number } | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    const open = (zone: HTMLElement) => {
      const img = visibleImage(zone);
      if (!img) return;
      opener.current = zone;
      setItem({ src: img.currentSrc || img.src, srcSet: srcSetFor(img), alt: img.alt });
    };
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const zone = (event.target as Element | null)?.closest<HTMLElement>(ZONES);
      if (zone) open(zone);
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      const target = event.target;
      if ((event.key === 'Enter' || event.key === ' ') && target instanceof HTMLElement && target.matches(ZONES)) {
        event.preventDefault();
        open(target);
      }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  /** Offsets that place the large image exactly over the frame it came from. */
  const fromFrame = (img: HTMLElement): gsap.TweenVars => {
    const from = opener.current?.getBoundingClientRect();
    const to = img.getBoundingClientRect();
    if (!from || !to.width) return { autoAlpha: 0 };
    // Measure the image's resting layout, ignoring any swipe offset or scale already applied.
    const x = Number(gsap.getProperty(img, 'x')) || 0;
    const y = Number(gsap.getProperty(img, 'y')) || 0;
    const scale = Number(gsap.getProperty(img, 'scale')) || 1;
    const width = to.width / scale;
    const height = to.height / scale;
    return {
      x: from.left + from.width / 2 - (to.left + to.width / 2 - x),
      y: from.top + from.height / 2 - (to.top + to.height / 2 - y),
      scale: Math.max(from.width / width, from.height / height) * 0.98,
    };
  };

  useGSAP(
    () => {
      const img = image.current;
      if (!item || !img) return;
      lockScroll(true);
      closeButton.current?.focus({ preventScroll: true });
      const reduce = prefersReducedMotion();
      gsap.fromTo('[data-lb-bg]', { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.5, ease: 'power2.out' });

      const reveal = () => {
        gsap.set(img, { visibility: 'visible' });
        if (!reduce) {
          gsap.fromTo(img, fromFrame(img), { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: 'power4.inOut' });
        }
        gsap.fromTo('[data-lb-ui]', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, delay: reduce ? 0 : 0.55 });
      };
      if (img.complete && img.naturalWidth) reveal();
      else img.addEventListener('load', reveal, { once: true });
    },
    { scope: root, dependencies: [item] },
  );

  const close = useCallback(() => {
    const img = image.current;
    if (!img || closing.current) return;
    closing.current = true;
    const done = () => {
      closing.current = false;
      setItem(null);
      lockScroll(false);
      opener.current?.focus({ preventScroll: true });
    };
    if (prefersReducedMotion()) {
      done();
      return;
    }
    gsap
      .timeline({ onComplete: done })
      .to('[data-lb-ui]', { opacity: 0, duration: 0.2 }, 0)
      .to(img, { ...fromFrame(img), duration: 0.7, ease: 'power3.inOut' }, 0)
      .to('[data-lb-bg]', { autoAlpha: 0, duration: 0.55, ease: 'power2.in' }, 0.15)
      .to(img, { autoAlpha: 0, duration: 0.2 }, 0.55);
  }, []);

  useEffect(() => {
    if (!item) return;
    const onEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [item, close]);

  if (!item) return null;

  // Touch: drag the image up or down; far enough closes, otherwise it springs back.
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' || closing.current) return;
    swipe.current = { startY: event.clientY, dy: 0 };
    swiped.current = false;
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = swipe.current;
    if (!drag || !image.current) return;
    drag.dy = event.clientY - drag.startY;
    if (Math.abs(drag.dy) > 8) swiped.current = true;
    gsap.set(image.current, { y: drag.dy, scale: 1 - Math.min(Math.abs(drag.dy) / 1600, 0.12) });
    gsap.set(root.current?.querySelector('[data-lb-bg]') ?? {}, { opacity: 1 - Math.min(Math.abs(drag.dy) / 380, 0.65) });
  };
  const onPointerUp = () => {
    const drag = swipe.current;
    swipe.current = null;
    if (!drag || !image.current) return;
    if (Math.abs(drag.dy) > SWIPE_CLOSE) {
      close();
    } else if (swiped.current) {
      gsap.to(image.current, { y: 0, scale: 1, duration: 0.45, ease: 'power3.out' });
      gsap.to(root.current?.querySelector('[data-lb-bg]') ?? {}, { opacity: 1, duration: 0.45 });
    }
  };
  const onBackdropClick = () => {
    // A swipe that springs back still ends in a click; it should not close the view.
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    close();
  };

  // Only the close button is focusable, so Tab stays on it.
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      closeButton.current?.focus();
    }
  };

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={item.alt}
      data-cursor="close"
      data-cursor-theme="dark"
      data-lenis-prevent
      onClick={onBackdropClick}
      onKeyDown={trapFocus}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="fixed inset-0 z-[95] grid touch-none select-none place-items-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] sm:p-10"
    >
      <div data-lb-bg className="absolute inset-0 bg-brown-800/95" />
      <figure className="relative flex max-h-full flex-col items-center">
        <img
          ref={image}
          src={item.src}
          srcSet={item.srcSet || undefined}
          sizes="90vw"
          alt={item.alt}
          draggable={false}
          className="invisible max-h-[72svh] w-auto max-w-[min(92vw,1440px)] object-contain shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] sm:max-h-[80vh] sm:max-w-[min(90vw,1440px)]"
        />
        <figcaption data-lb-ui className="mt-4 max-w-2xl px-2 text-center text-[0.82rem] leading-relaxed text-cream/75 sm:mt-5 sm:text-sm">
          {item.alt}
        </figcaption>
      </figure>
      <button
        ref={closeButton}
        type="button"
        data-lb-ui
        onClick={(event) => {
          event.stopPropagation();
          close();
        }}
        aria-label={t('common.close')}
        className="absolute end-4 top-[max(1rem,env(safe-area-inset-top))] grid size-12 place-items-center rounded-full border border-cream/25 bg-brown-800/40 text-cream transition-colors hover:bg-cream hover:text-brown sm:end-8 sm:top-8"
      >
        <X aria-hidden className="size-5" />
      </button>
    </div>
  );
}
