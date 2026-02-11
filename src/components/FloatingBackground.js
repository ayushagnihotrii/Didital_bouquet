'use client';

import { useState, useEffect } from 'react';
import FlowerSVG from './FlowerSVG';

const backgroundFlowers = [
  // Top-left cluster
  { id: 'rose', x: 2, y: 3, size: 160, rotate: -20, delay: 0, duration: 5 },
  { id: 'lavender', x: -1, y: 28, size: 140, rotate: 15, delay: 1.2, duration: 6.5 },
  { id: 'daisy', x: 5, y: 52, size: 130, rotate: -35, delay: 0.6, duration: 5.5 },

  // Top-right cluster
  { id: 'orchid', x: 84, y: 2, size: 150, rotate: 25, delay: 0.8, duration: 6 },
  { id: 'tulip', x: 88, y: 30, size: 135, rotate: -10, delay: 1.5, duration: 5.8 },

  // Bottom-left
  { id: 'peony', x: 0, y: 70, size: 145, rotate: 30, delay: 0.3, duration: 6.2 },
  { id: 'anemone', x: 4, y: 88, size: 125, rotate: -45, delay: 1.8, duration: 5.2 },

  // Bottom-right
  { id: 'sunflower', x: 85, y: 58, size: 155, rotate: 10, delay: 0.5, duration: 5.5 },
  { id: 'chrysanthemum', x: 82, y: 82, size: 130, rotate: -20, delay: 1.0, duration: 6.8 },

  // Scattered mid-edges
  { id: 'iris', x: 1, y: 44, size: 120, rotate: 40, delay: 2.0, duration: 7 },
  { id: 'carnation', x: 89, y: 48, size: 125, rotate: -30, delay: 1.4, duration: 6 },
  { id: 'lily', x: 9, y: 12, size: 115, rotate: 55, delay: 2.2, duration: 5.3 },
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
            opacity: 0.32,
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
