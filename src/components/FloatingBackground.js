'use client';

import { useState, useEffect } from 'react';
import FlowerSVG from './FlowerSVG';

const backgroundFlowers = [
  // Top-left cluster
  { id: 'rose', x: 4, y: 5, size: 110, rotate: -20, delay: 0, duration: 5 },
  { id: 'lavender', x: 1, y: 30, size: 90, rotate: 15, delay: 1.2, duration: 6.5 },
  { id: 'daisy', x: 8, y: 55, size: 85, rotate: -35, delay: 0.6, duration: 5.5 },

  // Top-right cluster
  { id: 'orchid', x: 86, y: 3, size: 100, rotate: 25, delay: 0.8, duration: 6 },
  { id: 'tulip', x: 90, y: 32, size: 88, rotate: -10, delay: 1.5, duration: 5.8 },

  // Bottom-left
  { id: 'peony', x: 2, y: 72, size: 95, rotate: 30, delay: 0.3, duration: 6.2 },
  { id: 'anemone', x: 7, y: 90, size: 80, rotate: -45, delay: 1.8, duration: 5.2 },

  // Bottom-right
  { id: 'sunflower', x: 88, y: 62, size: 105, rotate: 10, delay: 0.5, duration: 5.5 },
  { id: 'chrysanthemum', x: 84, y: 85, size: 85, rotate: -20, delay: 1.0, duration: 6.8 },

  // Scattered mid-edges
  { id: 'iris', x: 3, y: 45, size: 78, rotate: 40, delay: 2.0, duration: 7 },
  { id: 'carnation', x: 92, y: 50, size: 82, rotate: -30, delay: 1.4, duration: 6 },
  { id: 'lily', x: 12, y: 14, size: 72, rotate: 55, delay: 2.2, duration: 5.3 },
];

export default function FloatingBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {backgroundFlowers.map((flower, i) => (
        <div
          key={`bg-${flower.id}-${i}`}
          className="absolute"
          style={{
            left: `${flower.x}%`,
            top: `${flower.y}%`,
            opacity: 0.18,
            transform: `rotate(${flower.rotate}deg)`,
            animation: `bgFloat ${flower.duration}s ease-in-out ${flower.delay}s infinite`,
          }}
        >
          <FlowerSVG flowerId={flower.id} size={flower.size} />
        </div>
      ))}
    </div>
  );
}
