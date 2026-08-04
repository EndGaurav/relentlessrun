export function Medal3D({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 170" className={className} aria-hidden="true" role="img">
      <defs>
        <linearGradient id="gold-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5e6a9" />
          <stop offset="0.55" stopColor="#c9a227" />
          <stop offset="1" stopColor="#8f6f10" />
        </linearGradient>
        <radialGradient id="gold-face" cx="0.35" cy="0.28" r="1.1">
          <stop offset="0" stopColor="#fbeebc" />
          <stop offset="0.7" stopColor="#d9b137" />
          <stop offset="1" stopColor="#a07d14" />
        </radialGradient>
        <linearGradient id="ribbon-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#0d9488" />
          <stop offset="1" stopColor="#2dd4bf" />
        </linearGradient>
        <linearGradient id="peak-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>

      <path d="M60 34 L78 52 L72 72 L60 64 L48 72 L42 52 Z" fill="url(#ribbon-g)" />
      <path d="M60 34 L78 52 L72 72 L60 64 Z" fill="#ffffff" opacity="0.2" />
      <path d="M60 34 L42 52 L48 72 L60 64 Z" fill="#000000" opacity="0.14" />

      <rect x="52" y="58" width="16" height="14" rx="4" fill="#ffffff" opacity="0.95" />
      <rect x="56" y="61" width="8" height="9" rx="2" fill="#b8860b" />

      <circle cx="64" cy="114" r="46" fill="#7a5c08" opacity="0.35" />
      <circle cx="60" cy="108" r="46" fill="url(#gold-bg)" />
      <circle cx="60" cy="108" r="38" fill="url(#gold-face)" />
      <circle cx="60" cy="108" r="38" fill="none" stroke="#fff3c4" strokeWidth="2.5" opacity="0.9" />
      <circle cx="60" cy="108" r="44" fill="none" stroke="#f5e6a9" strokeWidth="3" opacity="0.7" />

      <path d="M60 88 L74 116 H64 L60 106 L56 116 H46 Z" fill="url(#peak-g)" />
      <path d="M60 92 L70 114 L60 114 Z" fill="#2dd4bf" opacity="0.55" />
      <path d="M60 88 L60 106 L56 116 L46 116 Z" fill="#0d9488" />

      <circle cx="60" cy="82" r="3" fill="#fff3c4" />
      <path d="M60 76 V70 M60 88 V94 M54 82 H48 M66 82 H72" stroke="#fff3c4" strokeWidth="1.5" strokeLinecap="round" />

      <path
        d="M60 124 l2.4 5.4 5.9 0.6 -4.3 4.1 1.1 5.9 -5.1 -3 -5.1 3 1.1 -5.9 -4.3 -4.1 5.9 -0.6 Z"
        fill="#fff3c4"
      />
    </svg>
  );
}
