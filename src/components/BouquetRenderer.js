'use client';

import FlowerSVG from './FlowerSVG';
import VaseSVG from './VaseSVG';

function getBouquetPositions(count) {
  if (count === 0) return [];

  const positions = [];

  if (count === 1) {
    return [{ x: 50, y: 30, scale: 1.1, rotate: 0, z: 1 }];
  }
  if (count === 2) {
    return [
      { x: 38, y: 30, scale: 1, rotate: -10, z: 2 },
      { x: 62, y: 28, scale: 1, rotate: 8, z: 1 },
    ];
  }
  if (count === 3) {
    return [
      { x: 50, y: 22, scale: 1.05, rotate: 0, z: 3 },
      { x: 32, y: 38, scale: 0.9, rotate: -15, z: 2 },
      { x: 68, y: 36, scale: 0.9, rotate: 12, z: 1 },
    ];
  }

  // Center flower
  positions.push({ x: 50, y: 25, scale: 1.05, rotate: 0, z: count });

  // First ring
  const firstRingCount = Math.min(count - 1, 5);
  for (let i = 0; i < firstRingCount; i++) {
    const angle = (i * 360) / firstRingCount - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = 20;
    positions.push({
      x: 50 + Math.cos(rad) * radius,
      y: 32 + Math.sin(rad) * radius * 0.65,
      scale: 0.85,
      rotate: (Math.cos(rad) * 15),
      z: count - 1 - i,
    });
  }

  // Second ring for more flowers
  const remaining = count - 1 - firstRingCount;
  for (let i = 0; i < remaining; i++) {
    const angle = (i * 360) / remaining - 60;
    const rad = (angle * Math.PI) / 180;
    const radius = 32;
    positions.push({
      x: 50 + Math.cos(rad) * radius,
      y: 35 + Math.sin(rad) * radius * 0.55,
      scale: 0.75,
      rotate: (Math.cos(rad) * 20),
      z: remaining - i,
    });
  }

  return positions;
}

export default function BouquetRenderer({
  selectedFlowerIds = [],
  vaseId = 'modern',
  animated = false,
  size = 340,
  className = '',
}) {
  const positions = getBouquetPositions(selectedFlowerIds.length);
  const flowerSize = size * 0.28;
  const vaseSize = size * 0.55;
  const height = size * 1.3;

  return (
    <div
      className={`bouquet-wrapper relative mx-auto ${className}`}
      style={{ width: size, height }}
    >
      {/* Leaves behind flowers */}
      <svg
        viewBox="0 0 100 130"
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      >
        {/* Decorative leaves */}
        <ellipse cx="25" cy="55" rx="12" ry="5" fill="#4a7c59" opacity="0.4" transform="rotate(-40, 25, 55)" />
        <ellipse cx="75" cy="52" rx="12" ry="5" fill="#4a7c59" opacity="0.4" transform="rotate(35, 75, 52)" />
        <ellipse cx="20" cy="45" rx="10" ry="4" fill="#6a9b6a" opacity="0.3" transform="rotate(-55, 20, 45)" />
        <ellipse cx="80" cy="42" rx="10" ry="4" fill="#6a9b6a" opacity="0.3" transform="rotate(50, 80, 42)" />
        <ellipse cx="30" cy="65" rx="11" ry="4" fill="#5a8a5a" opacity="0.35" transform="rotate(-25, 30, 65)" />
        <ellipse cx="70" cy="63" rx="11" ry="4" fill="#5a8a5a" opacity="0.35" transform="rotate(20, 70, 63)" />
        {/* Small filler leaves */}
        <ellipse cx="15" cy="50" rx="8" ry="3" fill="#7aaa7a" opacity="0.25" transform="rotate(-60, 15, 50)" />
        <ellipse cx="85" cy="48" rx="8" ry="3" fill="#7aaa7a" opacity="0.25" transform="rotate(55, 85, 48)" />
        {/* Stems */}
        <line x1="50" y1="58" x2="50" y2="80" stroke="#4a7c59" strokeWidth="1.5" opacity="0.6" />
        <line x1="45" y1="55" x2="42" y2="78" stroke="#4a7c59" strokeWidth="1" opacity="0.4" />
        <line x1="55" y1="55" x2="58" y2="78" stroke="#4a7c59" strokeWidth="1" opacity="0.4" />
      </svg>

      {/* Flowers */}
      {selectedFlowerIds.map((flowerId, index) => {
        const pos = positions[index];
        if (!pos) return null;
        const delay = animated ? index * 0.15 : 0;
        return (
          <div
            key={`${flowerId}-${index}`}
            className={`absolute ${animated ? 'bloom-container' : ''}`}
            style={{
              left: `${pos.x}%`,
              top: `${(pos.y / 130) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${pos.rotate}deg) scale(${pos.scale})`,
              zIndex: pos.z + 1,
              animationDelay: animated ? `${delay}s` : undefined,
              animationFillMode: 'forwards',
              ...(animated ? {} : { opacity: 1 }),
            }}
          >
            <FlowerSVG flowerId={flowerId} size={flowerSize} />
          </div>
        );
      })}

      {/* Vase */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: 0,
          zIndex: selectedFlowerIds.length + 2,
        }}
      >
        <VaseSVG vaseId={vaseId} size={vaseSize} />
      </div>
    </div>
  );
}
