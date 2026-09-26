import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap, useGSAP } from '@/animations/gsap';
import { MOTION_OK } from '@/animations/motion';
import { locations } from '@/data/content';
import type { Location } from '@/types';
import { cn } from '@/utils/cn';

interface LocationMapProps {
  active: Location['id'];
  onSelect: (id: Location['id']) => void;
}

/** Roads and ring roads, drawn in a 400 × 300 space. Illustrative, not to scale. */
const ROADS = [
  'M0,150 C80,146 140,138 184,132 S300,96 400,40',
  'M184,132 C176,190 160,240 146,300',
  'M184,132 C230,150 280,152 400,170',
  'M60,0 C110,60 150,100 184,132',
  'M184,132 C200,90 220,50 236,0',
];

export function LocationMap({ active, onSelect }: LocationMapProps) {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scrollTrigger = { trigger: root.current, start: 'top 80%', toggleActions: 'play none none none' };
        gsap.fromTo('[data-road]', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, stagger: 0.15, ease: 'power2.inOut', scrollTrigger });
        gsap.from('[data-ring]', { scale: 0.6, autoAlpha: 0, transformOrigin: '50% 50%', duration: 1.4, stagger: 0.12, ease: 'power3.out', scrollTrigger });
        gsap.from('[data-pin]', { y: -24, autoAlpha: 0, duration: 0.8, stagger: 0.12, delay: 0.6, ease: 'back.out(2)', scrollTrigger });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      dir="ltr"
      role="group"
      aria-label={t('locations.mapLabel')}
      className="relative aspect-[4/3] overflow-hidden border border-charcoal/10 bg-sand"
    >
      <svg aria-hidden viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <pattern id="map-grid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M25 0H0V25" fill="none" stroke="#3F3F3F" strokeOpacity="0.07" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#map-grid)" />
        <circle data-ring cx="184" cy="132" r="34" fill="#C04A2C" fillOpacity="0.06" stroke="#C04A2C" strokeOpacity="0.25" strokeWidth="0.8" />
        <circle data-ring cx="184" cy="132" r="70" fill="none" stroke="#3F3F3F" strokeOpacity="0.12" strokeDasharray="3 4" strokeWidth="0.8" />
        <circle data-ring cx="184" cy="132" r="118" fill="none" stroke="#3F3F3F" strokeOpacity="0.08" strokeDasharray="2 5" strokeWidth="0.8" />
        {ROADS.map((d) => (
          <path
            key={d}
            data-road
            d={d}
            pathLength={1}
            fill="none"
            stroke="#462715"
            strokeOpacity="0.28"
            strokeWidth="1.4"
            strokeDasharray="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <span className="text-eyebrow absolute text-charcoal/45" style={{ left: '27%', top: '50%' }}>
        {t('locations.center')}
      </span>
      <span aria-hidden className="absolute end-5 top-5 grid size-10 place-items-center rounded-full border border-charcoal/20 text-xs font-bold text-charcoal/60">
        N
      </span>

      {locations.map((location) => {
        const isActive = location.id === active;
        return (
          <button
            key={location.id}
            type="button"
            data-pin
            onClick={() => onSelect(location.id)}
            onMouseEnter={() => onSelect(location.id)}
            aria-pressed={isActive}
            className="group absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${location.x}%`, top: `${location.y}%` }}
          >
            <span
              className={cn(
                'mb-2 block whitespace-nowrap px-2.5 py-1 text-xs font-bold shadow-sm transition-colors duration-300',
                isActive ? 'bg-terracotta text-white' : 'bg-cream text-charcoal group-hover:bg-charcoal group-hover:text-cream',
              )}
            >
              {t(`locations.items.${location.id}.name`)}
            </span>
            <span className="relative mx-auto block size-3">
              {isActive && <span className="absolute inset-0 animate-ping rounded-full bg-terracotta/50" />}
              <span className={cn('absolute inset-0 rounded-full border-2 border-cream', isActive ? 'bg-terracotta' : 'bg-brown')} />
            </span>
          </button>
        );
      })}
    </div>
  );
}
