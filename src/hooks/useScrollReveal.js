'use client';
import { useEffect } from 'react';

/**
 * Replicates initScrollReveal() from main.js.
 * Observes all elements with class "reveal" on the page and adds "revealed"
 * when they enter the viewport.
 */
export function useScrollReveal(dependencies = []) {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    reveals.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, dependencies);
}
