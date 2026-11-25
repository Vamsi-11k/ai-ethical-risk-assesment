function BrandLogo({ size = "md" }) {
  const dims = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-10 w-10" : "h-9 w-9";
  const gradId = `aiGrad-${size}`;
  const coreId = `coreGrad-${size}`;

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-neutral-950 p-1 shadow-sm ring-1 ring-indigo-500/30 ${dims}`}
    >
      <svg viewBox="0 0 48 48" fill="none" className="h-full w-full">
        <defs>
          <linearGradient id={gradId} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id={coreId} x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
        <path
          d="M24 6L10 12V22.5C10 31.8 16 40.1 24 42.5C32 40.1 38 31.8 38 22.5V12L24 6Z"
          stroke={`url(#${gradId})`}
          strokeWidth="2.4"
          strokeLinejoin="round"
          fill="#09090b"
        />
        <circle cx="24" cy="20" r="2.6" fill="#ffffff" />
        <circle cx="17.5" cy="28.5" r="2.2" fill={`url(#${coreId})`} />
        <circle cx="30.5" cy="28.5" r="2.2" fill={`url(#${coreId})`} />
        <path
          d="M24 20L17.5 28.5M24 20L30.5 28.5M17.5 28.5H30.5"
          stroke={`url(#${coreId})`}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default BrandLogo;
