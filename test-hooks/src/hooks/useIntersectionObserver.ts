import useEffect from '@restart/hooks/useIsomorphicEffect';
import useStableMemo from '@restart/hooks/useStableMemo';
import { useState } from 'react';

/**
 * Setup an [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) on
 * a DOM Element.
 *
 * @param element The DOM element to observe
 * @param init IntersectionObserver options
 */
export default function useIntersectionObserver<TElement extends Element>(
  element: TElement | null | undefined,
  { threshold, root, rootMargin }: IntersectionObserverInit = {},
) {
  const [entries, setEntry] = useState<IntersectionObserverEntry[] | null>(
    null,
  );

  const observer = useStableMemo(
    () =>
      typeof IntersectionObserver !== 'undefined' &&
      new IntersectionObserver((nextEntries) => setEntry(nextEntries), {
        threshold,
        root,
        rootMargin,
      }),

    [root, rootMargin, threshold && JSON.stringify(threshold)],
  );

  useEffect(() => {
    if (!element || !observer) return undefined;

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [observer, element]);

  return entries || [];
}
