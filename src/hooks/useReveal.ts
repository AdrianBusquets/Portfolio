import { useEffect, useRef, useState } from 'react';

export default function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const opts: IntersectionObserverInit = options || { threshold: 0.12, rootMargin: '0px 0px -10% 0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if ((import.meta as any).env?.MODE !== 'production') {
            // debug info to help diagnose reveal issues
            // eslint-disable-next-line no-console
            console.debug('[useReveal] element intersecting:', el, { intersectionRatio: entry.intersectionRatio });
          }
          setVisible(true);
          try { observer.unobserve(el); } catch (e) { /* ignore */ }
        }
      });
    }, opts);

    observer.observe(el);
    return () => observer.disconnect();
    // only re-run if options change
  }, [options]);

  return { ref, visible } as const;
}
