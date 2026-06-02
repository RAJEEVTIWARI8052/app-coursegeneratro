"use client";
import React, { useEffect, useState } from 'react';

export default function BubbleEffect() {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate static random values for bubbles only on the client side
    // to avoid React hydration mismatches.
    const newBubbles = Array.from({ length: 15 }).map((_, i) => {
      const size = Math.random() * 60 + 20; // 20px to 80px
      const left = Math.random() * 100; // 0% to 100%
      const animationDuration = Math.random() * 10 + 10; // 10s to 20s
      const animationDelay = Math.random() * 10; // 0s to 10s
      const swayDuration = Math.random() * 4 + 3; // 3s to 7s
      const colorType = Math.floor(Math.random() * 3); // 0, 1, or 2

      return {
        id: i,
        size,
        left,
        animationDuration,
        animationDelay,
        swayDuration,
        colorType
      };
    });

    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full opacity-0"
          style={{
            left: `${bubble.left}%`,
            bottom: `-100px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animation: `floatUp ${bubble.animationDuration}s linear ${bubble.animationDelay}s infinite, sway ${bubble.swayDuration}s ease-in-out infinite alternate`,
            background: bubble.colorType === 0 
              ? 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.4), rgba(168, 85, 247, 0.1))' 
              : bubble.colorType === 1
              ? 'radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.4), rgba(236, 72, 153, 0.1))'
              : 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.4), rgba(99, 102, 241, 0.1))',
            boxShadow: bubble.colorType === 0 
              ? '0 0 20px rgba(168, 85, 247, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.2)' 
              : bubble.colorType === 1
              ? '0 0 20px rgba(236, 72, 153, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.2)'
              : '0 0 20px rgba(99, 102, 241, 0.2), inset 0 0 10px rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(2px)',
          }}
        />
      ))}
    </div>
  );
}
