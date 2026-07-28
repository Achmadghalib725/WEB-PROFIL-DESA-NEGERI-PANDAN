'use client';
import { useEffect } from 'react';

/**
 * Replicates initCursorGlow() from main.js.
 * Renders a subtle radial gradient that follows the mouse cursor on desktop.
 */
export default function CursorGlow() {
  useEffect(() => {
    if (window.innerWidth < 768) return;

    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
      position: fixed;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, hsla(152, 70%, 40%, 0.04) 0%, transparent 70%);
      left: 0;
      top: 0;
      pointer-events: none;
      z-index: 0;
      transition: opacity 0.3s ease;
      transform: translate(-50%, -50%);
      will-change: transform;
    `;
    document.body.appendChild(glow);

    let rafId;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          glow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
          rafId = null;
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
      if (glow.parentNode) glow.parentNode.removeChild(glow);
    };
  }, []);

  return null;
}
