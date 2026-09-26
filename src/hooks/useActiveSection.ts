import { useState } from 'react';
import { ScrollTrigger, useGSAP } from '@/animations/gsap';

/** Tracks which of the given section ids is crossing the middle of the viewport. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '');

  useGSAP(() => {
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) setActive(id);
        },
      });
    });
  }, []);

  return active;
}
