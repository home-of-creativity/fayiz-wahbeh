import SplitType from 'split-type';
import { isRTL } from './motion';

export interface SplitResult {
  targets: HTMLElement[];
  /** Word index for each target — used to stagger characters word by word. */
  wordIndex: number[];
  revert: () => void;
}

/**
 * Splits a heading for a masked reveal.
 * Characters are only used for Latin text: splitting Arabic into characters
 * breaks letter joining, so Arabic always animates word by word.
 */
export function splitForReveal(el: HTMLElement, preferChars = false): SplitResult {
  const useChars = preferChars && !isRTL();
  const split = new SplitType(el, { types: useChars ? 'words,chars' : 'words', tagName: 'span' });
  el.classList.add('split-mask');

  const words = split.words ?? [];
  const targets: HTMLElement[] = [];
  const wordIndex: number[] = [];

  words.forEach((word, index) => {
    if (useChars) {
      word.querySelectorAll<HTMLElement>('.char').forEach((char) => {
        targets.push(char);
        wordIndex.push(index);
      });
      return;
    }
    const inner = document.createElement('span');
    inner.className = 'word-inner';
    while (word.firstChild) inner.appendChild(word.firstChild);
    word.appendChild(inner);
    targets.push(inner);
    wordIndex.push(index);
  });

  return {
    targets,
    wordIndex,
    revert: () => {
      split.revert();
      el.classList.remove('split-mask');
    },
  };
}
