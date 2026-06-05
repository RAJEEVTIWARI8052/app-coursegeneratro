"use client";
import React, { useEffect, useState, useMemo } from 'react';

// Detect if user prefers reduced motion
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

export default function BubbleEffect() {
  const [bubbles, setBubbles] = useState([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setBubbles([]);
      return;
    }

    // Fewer bubbles on mobile (narrow viewport) for better performance
    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 8 : 12;

    const newBubbles = Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 55 + 15;          // 15px – 70px
      const left = Math.random() * 100;               // 0% – 100%
      const animationDuration = Math.random() * 10 + 12; // 12s – 22s
      const animationDelay = Math.random() * 12;      // 0s – 12s
      const swayDuration = Math.random() * 4 + 4;    // 4s – 8s
      const colorType = Math.floor(Math.random() * 3);

      return { id: i, size, left, animationDuration, animationDelay, swayDuration, colorType };
    });

    setBubbles(newBubbles);
  }, [prefersReduced]);

  // Color palettes — no backdropFilter to avoid 12+ GPU compositing layers
  const getBackground = (type) => {
    if (type === 0) return 'radial-gradient(circle at 30% 30%, rgba(168,85,247,0.35), rgba(168,85,247,0.08))';
    if (type === 1) return 'radial-gradient(circle at 30% 30%, rgba(236,72,153,0.35), rgba(236,72,153,0.08))';
    return            'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.35), rgba(99,102,241,0.08))';
  };

  const getBoxShadow = (type) => {
    if (type === 0) return '0 0 18px rgba(168,85,247,0.18), inset 0 0 8px rgba(255,255,255,0.15)';
    if (type === 1) return '0 0 18px rgba(236,72,153,0.18), inset 0 0 8px rgba(255,255,255,0.15)';
    return            '0 0 18px rgba(99,102,241,0.18), inset 0 0 8px rgba(255,255,255,0.15)';
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full opacity-0"
          style={{
            left: `${bubble.left}%`,
            bottom: '-100px',
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            // ✅ Two separate animations composited entirely on GPU (transform + opacity only)
            animation: `floatUp ${bubble.animationDuration}s linear ${bubble.animationDelay}s infinite, sway ${bubble.swayDuration}s ease-in-out infinite alternate`,
            background: getBackground(bubble.colorType),
            boxShadow: getBoxShadow(bubble.colorType),
            // ✅ will-change pre-allocates GPU layer — no per-frame layer promotion
            willChange: 'transform, opacity',
          }}
        />
      ))}
    </div>
  );
}
