import { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { POINTER_FINE } from '@/animations/motion';
import { Button, type ButtonProps } from './Button';

/** A Button that leans gently toward the pointer on desktop. */
export function MagneticButton(props: ButtonProps) {
  const wrapper = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(POINTER_FINE, () => {
        const el = wrapper.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
        const onMove = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          xTo((event.clientX - rect.left - rect.width / 2) * 0.22);
          yTo((event.clientY - rect.top - rect.height / 2) * 0.3);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
        return () => {
          el.removeEventListener('pointermove', onMove);
          el.removeEventListener('pointerleave', onLeave);
        };
      });
    },
    { scope: wrapper },
  );

  return (
    <span ref={wrapper} className="inline-flex">
      <Button {...props} />
    </span>
  );
}
