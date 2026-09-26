import { createContext, useContext } from 'react';

/** True once the preloader has started revealing the page (or was skipped). */
export const IntroContext = createContext(true);

export function useIntroReady(): boolean {
  return useContext(IntroContext);
}
