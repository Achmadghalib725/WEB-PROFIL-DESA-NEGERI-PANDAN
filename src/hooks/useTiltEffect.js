'use client';
import { useEffect } from 'react';

/**
 * Replicates initTiltEffect() from main.js.
 * Adds 3D perspective tilt on mousemove and resets on mouseleave.
 * Only active on desktop (>= 768px).
 */
export function useTiltEffect() {
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll(
      '.feature-card, .glass-card, .news-card, .potensi-image'
    );

    const handleMouseMove = (e) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    };

    const handleMouseLeave = (e) => {
      const card = e.currentTarget;
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
      setTimeout(() => {
        card.style.transition = '';
      }, 500);
    };

    cards.forEach((card) => {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);
}
