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
      pointer-events: none;
      z-index: 0;
      transition: transform 0.15s ease-out;
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(glow);

    const handleMouseMove = (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (glow.parentNode) glow.parentNode.removeChild(glow);
    };
  }, []);

  return null;
}
