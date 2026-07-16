'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Replicates animateCounter() + initCounters() from main.js.
 * Fires the count-up animation when the element enters the viewport.
 *
 * @param {number} target  - The final number to count up to
 * @param {string} suffix  - Optional suffix (e.g. '+')
 */
export default function AnimatedCounter({ target, suffix = '' }) {
  const [display, setDisplay] = useState('0');
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !animated.current) {
          animated.current = true;
          animate();
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [target]);

  function animate() {
    const duration = 2200;
    const startTime = performance.now();

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = Math.round(easedProgress * target);
      setDisplay(current.toLocaleString('id-ID') + suffix);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  return <span ref={ref}>{display}</span>;
}
