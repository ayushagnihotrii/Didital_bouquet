'use client';

import { useId } from 'react';

const TAU = Math.PI * 2;
const INK = '#1f1b1a';
const JITTER = [0, 0.9, -0.7, 1.2, -0.45, 0.65, -1.1, 0.5, -0.25, 0.75, -0.85, 0.35];

const PALETTE = {
  reds: ['#f16a58', '#ed5b4f', '#e44e49', '#d94241'],
  roseRed: ['#f45d5a', '#ea4d4d', '#df3e45', '#c9353c'],
  pinks: ['#f8bfd1', '#f6a9c4', '#f195b8', '#e986ad'],
  blush: ['#fbd1d7', '#f7becb', '#f0aab9', '#e89aaa'],
  violets: ['#b8abef', '#a798e6', '#9688db', '#8277cc'],
  blues: ['#d2e7f8', '#bdd9f0', '#a8cae7', '#94bcdd'],
  deepBlues: ['#879fda', '#738ecd', '#657ec2', '#546db2'],
  yellows: ['#fce88a', '#f9df6b', '#f5d44f', '#efc73a'],
  golds: ['#f0c67a', '#e8b765', '#dca352', '#c8893e'],
  browns: ['#8b5d38', '#7a4d2f', '#6d4328', '#5d3722'],
  greens: ['#8eb58a', '#78a775', '#699767', '#58875a'],
};

function polar(cx, cy, r, angle) {
  return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r];
}

function f(n) {
  return Number(n.toFixed(2));
}

function petalPath({ cx, cy, innerR, outerR, angle, spread, wobble = 0 }) {
  const a1 = angle - spread / 2;
  const a2 = angle + spread / 2;

  const [sx, sy] = polar(cx, cy, innerR, a1);
  const [ex, ey] = polar(cx, cy, innerR, a2);
  const [tx, ty] = polar(cx, cy, outerR + wobble, angle);

  const [c1x, c1y] = polar(cx, cy, innerR + (outerR - innerR) * 0.62, angle - spread * 0.22);
  const [c2x, c2y] = polar(cx, cy, innerR + (outerR - innerR) * 0.62, angle + spread * 0.22);
  const [mx, my] = polar(cx, cy, innerR * 0.56, angle);

  return `M${f(sx)} ${f(sy)} Q${f(c1x)} ${f(c1y)} ${f(tx)} ${f(ty)} Q${f(c2x)} ${f(c2y)} ${f(ex)} ${f(ey)} Q${f(mx)} ${f(my)} ${f(sx)} ${f(sy)} Z`;
}

function rufflePath(cx, cy, radius, ruffles, amp, phase = 0) {
  let d = '';
  for (let i = 0; i <= ruffles; i += 1) {
    const t = i / ruffles;
    const angle = phase + t * TAU;
    const wobble = Math.sin(i * 1.83) * amp + Math.cos(i * 2.31) * (amp * 0.45);
    const [x, y] = polar(cx, cy, radius + wobble, angle);
    if (i === 0) d += `M${f(x)} ${f(y)}`;
    else d += ` L${f(x)} ${f(y)}`;
  }
  return `${d} Z`;
}

function WatercolorDefs({ id }) {
  return (
    <defs>
      <filter id={`ink-${id}`} x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="4" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" result="warped" />
        <feGaussianBlur in="warped" stdDeviation="0.18" />
      </filter>

      <filter id={`wash-${id}`} x="-45%" y="-45%" width="190%" height="190%">
        <feGaussianBlur stdDeviation="5" />
      </filter>

      <filter id={`wash-sm-${id}`} x="-35%" y="-35%" width="170%" height="170%">
        <feGaussianBlur stdDeviation="2.4" />
      </filter>
    </defs>
  );
}

function PetalRing({
  cx = 60,
  cy = 50,
  count = 12,
  innerR = 10,
  outerR = 30,
  spread = 0.6,
  palette,
  opacity = 0.62,
  strokeWidth = 1.8,
  rotate = 0,
  detail = true,
  detailOpacity = 0.32,
}) {
  const colors = palette && palette.length ? palette : ['#f5f5f5'];

  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const angle = rotate + (i / count) * TAU;
        const d = petalPath({
          cx,
          cy,
          innerR,
          outerR,
          angle,
          spread,
          wobble: JITTER[i % JITTER.length],
        });
        const fill = colors[i % colors.length];
        return (
          <path
            key={`petal-${i}`}
            d={d}
            fill={fill}
            fillOpacity={opacity}
            stroke={INK}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}

      {detail &&
        Array.from({ length: count }).map((_, i) => {
          const angle = rotate + (i / count) * TAU;
          const [sx, sy] = polar(cx, cy, innerR + 1, angle);
          const [ex, ey] = polar(cx, cy, outerR * 0.86, angle + Math.sin(i * 1.37) * 0.03);
          const [mx, my] = polar(cx, cy, (innerR + outerR) / 2, angle + Math.sin(i * 0.61) * 0.04);
          return (
            <path
              key={`detail-${i}`}
              d={`M${f(sx)} ${f(sy)} Q${f(mx)} ${f(my)} ${f(ex)} ${f(ey)}`}
              fill="none"
              stroke={INK}
              strokeWidth="0.78"
              opacity={detailOpacity}
              strokeLinecap="round"
            />
          );
        })}
    </g>
  );
}

function NeedleRing({
  cx = 60,
  cy = 50,
  count = 24,
  innerR = 10,
  outerR = 34,
  spread = 0.24,
  palette,
  opacity = 0.58,
  strokeWidth = 1.6,
  rotate = 0,
}) {
  return (
    <PetalRing
      cx={cx}
      cy={cy}
      count={count}
      innerR={innerR}
      outerR={outerR}
      spread={spread}
      palette={palette}
      opacity={opacity}
      strokeWidth={strokeWidth}
      rotate={rotate}
      detail={false}
    />
  );
}

function StemAndLeaves({
  stemPath = 'M60 78 C58 92, 60 106, 60 118',
  leafLeft = 'M57 94 C44 88, 32 92, 34 102 C42 100, 50 98, 57 100 Z',
  leafRight = 'M63 102 C75 96, 86 98, 84 109 C77 107, 70 105, 63 107 Z',
  stemColor = '#6f9a66',
  leafA = '#8eb58a',
  leafB = '#6c9465',
}) {
  return (
    <g>
      <path d={stemPath} stroke={stemColor} strokeWidth="3.6" fill="none" strokeLinecap="round" />
      <path d={leafLeft} fill={leafA} fillOpacity="0.62" stroke={INK} strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
      <path d={leafRight} fill={leafB} fillOpacity="0.58" stroke={INK} strokeWidth="1.05" strokeLinecap="round" strokeLinejoin="round" />
      <path d={leafLeft.replace(' C', ' C').replace(' Z', '')} fill="none" stroke={INK} strokeWidth="0.55" opacity="0.26" />
      <path d={leafRight.replace(' C', ' C').replace(' Z', '')} fill="none" stroke={INK} strokeWidth="0.55" opacity="0.26" />
    </g>
  );
}

export default function FlowerSVG({ flowerId, size = 100, className = '' }) {
  const reactId = useId();
  const uid = `${flowerId}-${reactId.replace(/:/g, '')}`;

  const flowerMap = {
    rose: <RoseSVG id={uid} size={size} />,
    sunflower: <SunflowerSVG id={uid} size={size} />,
    tulip: <TulipSVG id={uid} size={size} />,
    daisy: <DaisySVG id={uid} size={size} />,
    lily: <LilySVG id={uid} size={size} />,
    peony: <PeonySVG id={uid} size={size} />,
    lavender: <LavenderSVG id={uid} size={size} />,
    orchid: <OrchidSVG id={uid} size={size} />,
    carnation: <CarnationSVG id={uid} size={size} />,
    iris: <IrisSVG id={uid} size={size} />,
    chrysanthemum: <ChrysanthemumSVG id={uid} size={size} />,
    anemone: <AnemoneSVG id={uid} size={size} />,
  };

  return (
    <div className={className} style={{ width: size, height: size }}>
      {flowerMap[flowerId] || null}
    </div>
  );
}

function RoseSVG({ id, size }) {
  const core = `rose-core-${id}`;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      <defs>
        <radialGradient id={core} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#7a1f2d" />
          <stop offset="60%" stopColor="#b3313f" />
          <stop offset="100%" stopColor="#d74a4a" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="47" rx="40" ry="34" fill="#ef6a62" opacity="0.22" filter={`url(#wash-${id})`} />
      <ellipse cx="52" cy="53" rx="25" ry="22" fill="#d94d52" opacity="0.16" filter={`url(#wash-sm-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <PetalRing cx={60} cy={47} count={13} innerR={14} outerR={36} spread={0.68} palette={PALETTE.roseRed} opacity={0.6} strokeWidth={2.05} rotate={0.04} />
        <PetalRing cx={60} cy={47} count={9} innerR={10} outerR={26} spread={0.76} palette={PALETTE.reds} opacity={0.62} strokeWidth={1.85} rotate={0.22} />
        <PetalRing cx={60} cy={47} count={6} innerR={6} outerR={18} spread={0.86} palette={['#f79e9a', '#f28384', '#ea646e']} opacity={0.68} strokeWidth={1.6} rotate={0.51} detail={false} />

        <circle cx="60" cy="47" r="6.2" fill={`url(#${core})`} stroke={INK} strokeWidth="1.45" />
        <path d="M57 45 C58 42, 63 42, 64 45 C65 47, 64 50, 61 51 C58 52, 55 50, 56 47 C57 46, 59 46, 60 48"
          fill="none" stroke={INK} strokeWidth="1.05" opacity="0.8" strokeLinecap="round" />
      </g>

      <StemAndLeaves
        stemPath="M60 79 C58 92, 60 105, 60 118"
        leafLeft="M56 95 C43 89, 31 93, 34 104 C42 101, 49 99, 56 101 Z"
        leafRight="M64 101 C77 95, 87 98, 84 110 C77 108, 70 106, 64 108 Z"
        stemColor={PALETTE.greens[2]}
        leafA={PALETTE.greens[0]}
        leafB={PALETTE.greens[2]}
      />
    </svg>
  );
}

function SunflowerSVG({ id, size }) {
  const core = `sun-core-${id}`;
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      <defs>
        <radialGradient id={core} cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#9f5b31" />
          <stop offset="55%" stopColor="#824a2d" />
          <stop offset="100%" stopColor="#6a3d24" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="49" rx="41" ry="34" fill="#f6d66b" opacity="0.25" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <PetalRing cx={60} cy={49} count={18} innerR={14} outerR={38} spread={0.5} palette={PALETTE.yellows} opacity={0.62} strokeWidth={1.95} rotate={0.08} />
        <PetalRing cx={60} cy={49} count={16} innerR={12} outerR={31} spread={0.54} palette={['#f8df72', '#f4d258', '#ecc445']} opacity={0.64} strokeWidth={1.75} rotate={0.24} />

        <circle cx="60" cy="49" r="16.8" fill={`url(#${core})`} stroke={INK} strokeWidth="1.9" />
        <circle cx="60" cy="49" r="11.3" fill="#8d512f" fillOpacity="0.58" stroke={INK} strokeWidth="1.2" />

        {Array.from({ length: 8 }).map((_, i) => {
          const y = 40 + i * 2.6;
          return <line key={`h-${i}`} x1="47" y1={y} x2="73" y2={y} stroke={INK} strokeWidth="0.58" opacity="0.34" />;
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const x = 48 + i * 3.1;
          return <line key={`v-${i}`} x1={x} y1="37" x2={x} y2="61" stroke={INK} strokeWidth="0.58" opacity="0.3" />;
        })}
      </g>

      <StemAndLeaves
        stemPath="M60 82 C58 95, 60 108, 60 118"
        leafLeft="M56 95 C39 88, 29 92, 32 103 C40 100, 49 98, 56 99 Z"
        leafRight="M64 90 C80 84, 90 88, 87 99 C79 96, 72 93, 64 95 Z"
        stemColor="#5f8a48"
        leafA="#86ad70"
        leafB="#6f9b5f"
      />
    </svg>
  );
}

function TulipSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="43" rx="28" ry="31" fill="#f8b3c5" opacity="0.22" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <path
          d="M60 17 C45 22, 33 36, 35 56 C36 66, 45 72, 53 67 C56 63, 58 50, 60 33 C62 50, 64 63, 67 67 C75 72, 84 66, 85 56 C87 36, 75 22, 60 17 Z"
          fill="#f39bb6"
          fillOpacity="0.64"
          stroke={INK}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M60 16 C51 22, 46 35, 48 55 C49 61, 55 64, 60 60 C65 64, 71 61, 72 55 C74 35, 69 22, 60 16 Z"
          fill="#ee88ab"
          fillOpacity="0.66"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M52 27 C50 40, 50 52, 52 60" fill="none" stroke={INK} strokeWidth="0.85" opacity="0.34" strokeLinecap="round" />
        <path d="M68 27 C70 40, 70 52, 68 60" fill="none" stroke={INK} strokeWidth="0.85" opacity="0.34" strokeLinecap="round" />
        <path d="M60 24 C60 38, 60 52, 60 60" fill="none" stroke={INK} strokeWidth="0.75" opacity="0.3" strokeLinecap="round" />
      </g>

      <StemAndLeaves
        stemPath="M60 66 C58 82, 60 101, 60 118"
        leafLeft="M56 86 C40 76, 26 82, 30 95 C40 91, 49 89, 56 90 Z"
        leafRight="M64 79 C80 70, 94 76, 90 90 C80 85, 72 81, 64 82 Z"
        stemColor="#67945f"
        leafA="#88b37d"
        leafB="#73a16d"
      />
    </svg>
  );
}

function DaisySVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="50" rx="35" ry="31" fill="#f3f3f3" opacity="0.2" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <NeedleRing cx={60} cy={50} count={22} innerR={10} outerR={35} spread={0.2} palette={['#ffffff', '#f8f8f8', '#f1f1f1']} opacity={0.75} strokeWidth={1.65} rotate={0.04} />
        <NeedleRing cx={60} cy={50} count={18} innerR={8} outerR={29} spread={0.22} palette={['#fdfdfd', '#f7f7f7']} opacity={0.68} strokeWidth={1.45} rotate={0.18} />

        <circle cx="60" cy="50" r="9" fill="#f2c763" stroke={INK} strokeWidth="1.55" />
        <circle cx="60" cy="50" r="5.2" fill="#efb944" fillOpacity="0.65" stroke={INK} strokeWidth="0.95" />
      </g>

      <StemAndLeaves
        stemPath="M60 74 C58 88, 60 103, 60 118"
        leafLeft="M56 92 C45 86, 34 90, 36 99 C43 97, 50 95, 56 97 Z"
        leafRight="M64 101 C75 96, 85 99, 83 108 C76 106, 70 104, 64 106 Z"
        stemColor="#6a9465"
        leafA="#8fb286"
        leafB="#739c6d"
      />
    </svg>
  );
}

function LilySVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="45" rx="34" ry="31" fill="#b4a7f0" opacity="0.23" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <PetalRing cx={60} cy={45} count={6} innerR={11} outerR={34} spread={0.92} palette={PALETTE.violets} opacity={0.62} strokeWidth={1.95} rotate={-0.02} />
        <PetalRing cx={60} cy={45} count={3} innerR={8} outerR={24} spread={1.1} palette={['#bdaef2', '#a596e5', '#8f83d6']} opacity={0.55} strokeWidth={1.55} rotate={0.5} detail={false} />

        {[-0.4, -0.1, 0.2, 0.45, 0.7].map((offset, i) => {
          const a = -Math.PI / 2 + offset;
          const [x1, y1] = polar(60, 47, 3, a);
          const [x2, y2] = polar(60, 47, 10 + i * 0.7, a + 0.03 * i);
          return <line key={`st-${i}`} x1={f(x1)} y1={f(y1)} x2={f(x2)} y2={f(y2)} stroke={INK} strokeWidth="1" opacity="0.7" strokeLinecap="round" />;
        })}
        {[-4, -1, 2, 5, 8].map((x, i) => (
          <ellipse key={`an-${i}`} cx={60 + x} cy={43 + (i % 2)} rx="1.2" ry="1.8" fill="#f2d78a" stroke={INK} strokeWidth="0.6" />
        ))}

        <circle cx="60" cy="47" r="4.8" fill="#8a7ac7" fillOpacity="0.7" stroke={INK} strokeWidth="1.1" />
      </g>

      <StemAndLeaves
        stemPath="M60 76 C59 90, 60 105, 60 118"
        leafLeft="M57 92 C43 85, 32 90, 35 101 C44 98, 51 96, 57 98 Z"
        leafRight="M63 97 C76 91, 87 94, 84 106 C77 103, 70 101, 63 103 Z"
        stemColor="#668d62"
        leafA="#84ab7e"
        leafB="#6e9868"
      />
    </svg>
  );
}

function PeonySVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="48" rx="39" ry="35" fill="#f6c0cb" opacity="0.25" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <PetalRing cx={60} cy={48} count={14} innerR={15} outerR={35} spread={0.74} palette={PALETTE.blush} opacity={0.62} strokeWidth={1.9} rotate={0.06} />
        <PetalRing cx={60} cy={48} count={10} innerR={10} outerR={27} spread={0.8} palette={PALETTE.pinks} opacity={0.64} strokeWidth={1.75} rotate={0.24} />
        <PetalRing cx={60} cy={48} count={7} innerR={6} outerR={18} spread={0.92} palette={['#f7c4cf', '#f0aeba', '#e89bab']} opacity={0.68} strokeWidth={1.5} rotate={0.48} detail={false} />

        <path d={rufflePath(60, 48, 8, 18, 1.9, 0.3)} fill="#f8d4de" fillOpacity="0.6" stroke={INK} strokeWidth="1.25" />
      </g>

      <StemAndLeaves
        stemPath="M60 80 C58 93, 60 106, 60 118"
        leafLeft="M56 94 C43 88, 32 92, 35 103 C43 100, 50 98, 56 100 Z"
        leafRight="M64 102 C76 97, 86 99, 84 110 C77 108, 70 106, 64 108 Z"
        stemColor="#6d9668"
        leafA="#8ab080"
        leafB="#749f6f"
      />
    </svg>
  );
}

function LavenderSVG({ id, size }) {
  const florets = [
    { x: 58, y: 23, s: 4.8, c: '#bfaeea' },
    { x: 63, y: 27, s: 5, c: '#b39fe2' },
    { x: 56, y: 30, s: 5.3, c: '#ad99dc' },
    { x: 62, y: 33, s: 5.4, c: '#a792d8' },
    { x: 55, y: 36, s: 5.2, c: '#a18bd3' },
    { x: 61, y: 39, s: 5.1, c: '#9d84cc' },
    { x: 57, y: 42, s: 5, c: '#a38fd4' },
    { x: 64, y: 45, s: 4.8, c: '#b09ce0' },
  ];

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="35" rx="22" ry="26" fill="#b39ddb" opacity="0.22" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <path d="M60 22 C59 40, 60 58, 60 118" stroke="#6a8f63" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        <path d="M60 36 C53 40, 49 46, 46 56" stroke="#6a8f63" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M60 42 C66 47, 70 54, 73 64" stroke="#6a8f63" strokeWidth="1.6" fill="none" strokeLinecap="round" />

        {florets.map((fl, i) => (
          <g key={`fl-${i}`} transform={`translate(${fl.x} ${fl.y})`}>
            <path d="M0 -4 C2 -4, 3 -2, 3 0 C3 2, 2 4, 0 4 C-2 4, -3 2, -3 0 C-3 -2, -2 -4, 0 -4 Z"
              fill={fl.c} fillOpacity="0.66" stroke={INK} strokeWidth="1.05" />
            <path d="M-1.5 -1 C0 -2, 1.3 -1, 1.2 0.8" fill="none" stroke={INK} strokeWidth="0.5" opacity="0.32" />
          </g>
        ))}
      </g>

      <g>
        <path d="M56 84 C40 76, 28 82, 31 94 C40 90, 48 88, 56 89 Z" fill="#88ad7d" fillOpacity="0.62" stroke={INK} strokeWidth="1" />
        <path d="M64 91 C79 84, 91 88, 88 99 C80 96, 72 93, 64 95 Z" fill="#739d6d" fillOpacity="0.6" stroke={INK} strokeWidth="1" />
      </g>
    </svg>
  );
}

function OrchidSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="46" rx="34" ry="30" fill="#e8b8d9" opacity="0.24" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <path d="M60 24 C48 28, 43 40, 47 52 C50 57, 57 56, 60 50 C63 56, 70 57, 73 52 C77 40, 72 28, 60 24 Z"
          fill="#e8afd4" fillOpacity="0.64" stroke={INK} strokeWidth="1.85" strokeLinejoin="round" />
        <path d="M42 40 C30 43, 25 54, 31 63 C36 67, 45 64, 48 56 C49 49, 47 44, 42 40 Z"
          fill="#dc9ec9" fillOpacity="0.62" stroke={INK} strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M78 40 C90 43, 95 54, 89 63 C84 67, 75 64, 72 56 C71 49, 73 44, 78 40 Z"
          fill="#d698c2" fillOpacity="0.62" stroke={INK} strokeWidth="1.75" strokeLinejoin="round" />
        <path d="M52 54 C42 61, 40 73, 49 79 C56 81, 61 75, 60 68 C59 75, 64 81, 71 79 C80 73, 78 61, 68 54 Z"
          fill="#f1bfdc" fillOpacity="0.68" stroke={INK} strokeWidth="1.65" strokeLinejoin="round" />
        <path d="M60 55 C55 57, 52 62, 54 67 C56 70, 59 70, 60 67 C61 70, 64 70, 66 67 C68 62, 65 57, 60 55 Z"
          fill="#f4dd9a" fillOpacity="0.8" stroke={INK} strokeWidth="1.1" />
        <path d="M56 61 C58 59, 62 59, 64 61" fill="none" stroke={INK} strokeWidth="0.85" opacity="0.44" strokeLinecap="round" />
      </g>

      <StemAndLeaves
        stemPath="M60 80 C58 94, 60 107, 60 118"
        leafLeft="M56 93 C44 87, 33 91, 35 101 C43 99, 50 97, 56 99 Z"
        leafRight="M64 101 C76 95, 86 98, 84 109 C77 107, 70 105, 64 107 Z"
        stemColor="#699164"
        leafA="#86ab7f"
        leafB="#719a6d"
      />
    </svg>
  );
}

function CarnationSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="47" rx="35" ry="31" fill="#f5afc6" opacity="0.25" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <path d={rufflePath(60, 47, 33, 40, 3.1, 0.18)} fill="#f3adc2" fillOpacity="0.62" stroke={INK} strokeWidth="1.85" />
        <path d={rufflePath(60, 47, 25, 34, 2.8, 0.64)} fill="#ef9fba" fillOpacity="0.64" stroke={INK} strokeWidth="1.55" />
        <path d={rufflePath(60, 47, 17, 28, 2.2, 1.12)} fill="#e88ead" fillOpacity="0.66" stroke={INK} strokeWidth="1.35" />
        <path d={rufflePath(60, 47, 9, 22, 1.6, 1.6)} fill="#f5c2d4" fillOpacity="0.7" stroke={INK} strokeWidth="1.1" />
      </g>

      <StemAndLeaves
        stemPath="M60 78 C58 92, 60 106, 60 118"
        leafLeft="M56 92 C41 85, 30 91, 33 102 C41 99, 49 97, 56 98 Z"
        leafRight="M64 99 C78 93, 88 96, 86 108 C78 106, 71 104, 64 106 Z"
        stemColor="#6d9367"
        leafA="#8bad82"
        leafB="#759d70"
      />
    </svg>
  );
}

function IrisSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="48" rx="36" ry="32" fill="#bdd6ef" opacity="0.25" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <PetalRing cx={60} cy={48} count={6} innerR={12} outerR={34} spread={0.88} palette={PALETTE.deepBlues} opacity={0.58} strokeWidth={1.9} rotate={0.09} />
        <PetalRing cx={60} cy={48} count={4} innerR={9} outerR={24} spread={0.94} palette={PALETTE.blues} opacity={0.64} strokeWidth={1.55} rotate={0.42} detail={false} />

        <path d="M60 50 C57 56, 52 60, 47 62" fill="none" stroke="#f3cf75" strokeWidth="2.1" opacity="0.72" strokeLinecap="round" />
        <path d="M60 50 C63 56, 68 60, 73 62" fill="none" stroke="#f3cf75" strokeWidth="2.1" opacity="0.72" strokeLinecap="round" />

        <circle cx="60" cy="48" r="7.2" fill="#4e5d9f" fillOpacity="0.75" stroke={INK} strokeWidth="1.3" />
      </g>

      <StemAndLeaves
        stemPath="M60 79 C58 93, 60 106, 60 118"
        leafLeft="M56 92 C41 86, 30 91, 33 102 C41 99, 49 97, 56 99 Z"
        leafRight="M64 101 C78 95, 89 98, 86 110 C78 108, 71 106, 64 108 Z"
        stemColor="#678d63"
        leafA="#86ac7e"
        leafB="#719a6d"
      />
    </svg>
  );
}

function ChrysanthemumSVG({ id, size }) {
  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />

      <ellipse cx="60" cy="49" rx="38" ry="34" fill="#f7d6cc" opacity="0.24" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <NeedleRing cx={60} cy={49} count={34} innerR={10} outerR={36} spread={0.2} palette={['#f7dccf', '#f4cfbf', '#f0c2b1']} opacity={0.65} strokeWidth={1.55} rotate={0.02} />
        <NeedleRing cx={60} cy={49} count={28} innerR={9} outerR={30} spread={0.19} palette={['#f6d7c2', '#f2c9ae', '#ecba98']} opacity={0.62} strokeWidth={1.35} rotate={0.18} />
        <NeedleRing cx={60} cy={49} count={20} innerR={7} outerR={23} spread={0.24} palette={['#f5db9c', '#f2cf83', '#eec36a']} opacity={0.66} strokeWidth={1.15} rotate={0.34} />

        <circle cx="60" cy="49" r="6.2" fill="#e9c064" fillOpacity="0.72" stroke={INK} strokeWidth="1" />
      </g>

      <StemAndLeaves
        stemPath="M60 80 C58 93, 60 106, 60 118"
        leafLeft="M56 94 C42 87, 31 92, 34 103 C42 100, 49 98, 56 100 Z"
        leafRight="M64 101 C76 96, 87 99, 85 110 C78 108, 71 106, 64 108 Z"
        stemColor="#6d9569"
        leafA="#8bb081"
        leafB="#749e70"
      />
    </svg>
  );
}

function AnemoneSVG({ id, size }) {
  const core = `ane-core-${id}`;

  return (
    <svg viewBox="0 0 120 120" width={size} height={size}>
      <WatercolorDefs id={id} />
      <defs>
        <radialGradient id={core} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1d264a" />
          <stop offset="60%" stopColor="#334476" />
          <stop offset="100%" stopColor="#4f669a" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="49" rx="35" ry="31" fill="#cfe4f4" opacity="0.24" filter={`url(#wash-${id})`} />

      <g filter={`url(#ink-${id})`}>
        <PetalRing cx={60} cy={49} count={7} innerR={11} outerR={33} spread={0.98} palette={PALETTE.blues} opacity={0.66} strokeWidth={1.85} rotate={0.1} />
        <PetalRing cx={60} cy={49} count={7} innerR={9} outerR={25} spread={0.82} palette={['#d8ebf8', '#c6dff2', '#b1d2eb']} opacity={0.58} strokeWidth={1.45} rotate={0.33} detail={false} />

        <circle cx="60" cy="49" r="10.8" fill={`url(#${core})`} stroke={INK} strokeWidth="1.7" />
        <circle cx="60" cy="49" r="6.3" fill="#28355f" fillOpacity="0.9" stroke={INK} strokeWidth="1.05" />

        {Array.from({ length: 14 }).map((_, i) => {
          const a = (i / 14) * TAU;
          const [x, y] = polar(60, 49, 8.7, a);
          return <circle key={`dot-${i}`} cx={f(x)} cy={f(y)} r="0.95" fill="#f2d577" opacity="0.9" />;
        })}
      </g>

      <StemAndLeaves
        stemPath="M60 79 C58 93, 60 106, 60 118"
        leafLeft="M56 94 C43 88, 32 92, 35 103 C42 100, 50 98, 56 100 Z"
        leafRight="M64 102 C76 97, 86 99, 84 110 C77 108, 70 106, 64 108 Z"
        stemColor="#698f64"
        leafA="#88ad80"
        leafB="#729a6d"
      />
    </svg>
  );
}
