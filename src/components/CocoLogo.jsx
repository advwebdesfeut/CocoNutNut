// CocoFiber PH – Brand Logo SVG Component
export default function CocoLogo({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CocoNutNutPH logo"
      className={className}
      role="img"
    >
      {/* Outer circle */}
      <circle cx="20" cy="20" r="19" fill="#BF8020" />
      <circle cx="20" cy="20" r="16" fill="#8B5E3C" />

      {/* Coconut shape */}
      <ellipse cx="20" cy="22" rx="9" ry="8" fill="#5C3118" />
      <ellipse cx="20" cy="22" rx="7"  ry="6"  fill="#7A4325" />

      {/* Fiber lines */}
      <line x1="13" y1="22" x2="27" y2="22" stroke="#BF8020" strokeWidth="0.8" strokeDasharray="2,2" />
      <line x1="14" y1="19" x2="26" y2="25" stroke="#BF8020" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6" />
      <line x1="14" y1="25" x2="26" y2="19" stroke="#BF8020" strokeWidth="0.6" strokeDasharray="2,2" opacity="0.6" />

      {/* Palm leaf left */}
      <path d="M12 14 Q8 8 14 6 Q10 12 16 14 Z" fill="#4E7A28" />
      {/* Palm leaf right */}
      <path d="M28 14 Q32 8 26 6 Q30 12 24 14 Z" fill="#4E7A28" />
      {/* Palm leaf top */}
      <path d="M20 14 Q18 7 20 5 Q22 7 20 14 Z" fill="#629933" />
      {/* Stem */}
      <line x1="20" y1="14" x2="20" y2="18" stroke="#5C3118" strokeWidth="2" strokeLinecap="round" />

      {/* Shine dot */}
      <circle cx="17" cy="20" r="1.5" fill="rgba(255,255,255,0.25)" />
    </svg>
  );
}
