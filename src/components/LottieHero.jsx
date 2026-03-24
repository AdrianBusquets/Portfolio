import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

// Default ambient Lottie animation (CDN). Replace with local JSON if preferred.
const DEFAULT_ANIMATION = 'https://assets3.lottiefiles.com/packages/lf20_5ngs2ksb.json';

export default function LottieHero({ animationPath = DEFAULT_ANIMATION, className = '' }) {
  const containerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = typeof window !== 'undefined' && ('ontouchstart' in window || window.innerWidth < 640);

    // Do not autoplay on reduced-motion or small/touch devices to save battery & avoid distraction
    if (prefersReduced || isMobile) return;

    instanceRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: animationPath,
      rendererSettings: { progressiveLoad: true }
    });

    return () => {
      if (instanceRef.current) {
        instanceRef.current.destroy();
        instanceRef.current = null;
      }
    };
  }, [animationPath]);

  return (
    <div className={`absolute inset-0 -z-10 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
