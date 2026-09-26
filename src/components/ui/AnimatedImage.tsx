import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { MOTION_DESKTOP, MOTION_OK } from '@/animations/motion';
import { imageReveal, type RevealDirection } from '@/animations/presets';
import { usePointerDrift } from '@/hooks/usePointerDrift';
import type { ResponsiveImage } from '@/types';
import { cn } from '@/utils/cn';
import { Picture } from './Picture';
import { TapHint } from './TapHint';

interface AnimatedImageProps {
  image: ResponsiveImage;
  alt: string;
  /** Frame classes — must give the frame a size (aspect ratio or height). */
  className?: string;
  imgClassName?: string;
  /** Hover classes for the zoom layer (kept apart from GSAP-driven transforms). */
  hoverClassName?: string;
  sizes?: string;
  priority?: boolean;
  /** Clip-path reveal direction, or false for none. */
  reveal?: RevealDirection | false;
  delay?: number;
  /** Scrubbed vertical drift in percent of the frame height (desktop only). */
  parallax?: number;
  /** Scrubbed scale-down while the frame crosses the viewport (desktop only). */
  scrubScale?: boolean;
  /** Subtle pointer-follow movement (fine pointers only). */
  drift?: boolean;
  /** Custom cursor label; also makes the image open in the lightbox. */
  cursor?: 'view' | 'explore';
}

export function AnimatedImage({
  image,
  alt,
  className,
  imgClassName,
  hoverClassName,
  sizes,
  priority,
  reveal = 'up',
  delay = 0,
  parallax = 0,
  scrubScale = false,
  drift = false,
  cursor,
}: AnimatedImageProps) {
  const { t } = useTranslation();
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const driftLayer = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        if (reveal && frame.current) {
          imageReveal(frame.current, img.current, reveal, { trigger: frame.current, delay, start: 'top 88%' });
        }
      });

      mm.add(MOTION_DESKTOP, () => {
        const el = frame.current;
        const moving = layer.current;
        if (!el || !moving) return;
        const scroll = { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true };

        if (parallax) {
          gsap.fromTo(
            moving,
            { y: () => -el.offsetHeight * (parallax / 100) },
            { y: () => el.offsetHeight * (parallax / 100), ease: 'none', scrollTrigger: scroll, immediateRender: true },
          );
        }
        if (scrubScale) {
          gsap.fromTo(moving, { scale: 1.14 }, { scale: 1, ease: 'none', scrollTrigger: scroll });
        }
      });
    },
    { scope: frame },
  );

  usePointerDrift(frame, driftLayer, 8, drift);

  // Extra bleed keeps edges hidden while the image drifts.
  const bleed = parallax ? `${parallax + 2}%` : drift ? '2%' : '0%';

  return (
    <div
      ref={frame}
      className={cn(
        'group/frame relative overflow-hidden bg-stone/40',
        cursor && 'transition-transform duration-300 ease-premium active:scale-[0.985]',
        className,
      )}
      data-cursor={cursor}
      {...(cursor ? { role: 'button', tabIndex: 0, 'aria-label': `${t('a11y.viewImage')}: ${alt}` } : {})}
    >
      <div ref={layer} className={cn('absolute inset-x-0', (parallax || scrubScale) && 'will-change-transform')} style={{ top: `-${bleed}`, bottom: `-${bleed}` }}>
        <div ref={driftLayer} className={cn('absolute inset-0', drift && 'scale-[1.04]')}>
          <div
            className={cn(
              'absolute inset-0 transition-transform duration-[1.4s] ease-premium',
              hoverClassName ?? (cursor && 'group-hover/frame:scale-[1.04]'),
            )}
          >
            <Picture
              image={image}
              alt={alt}
              sizes={sizes}
              priority={priority}
              imgRef={img}
              className={cn('h-full w-full object-cover', imgClassName)}
            />
          </div>
        </div>
      </div>
      {cursor && <TapHint kind={cursor} />}
    </div>
  );
}
