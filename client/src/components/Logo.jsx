export default function Logo({ className = '', showWordmark = true, dark = false }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="26" height="26" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="8" fill={dark ? '#FFFFFF' : '#0A0A0B'} />
        <path
          d="M9 21L16 9L23 21"
          stroke="#3E63DD"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        <circle cx="16" cy="16.5" r="2" fill="#3E63DD" />
      </svg>
      {showWordmark && (
        <span className={`text-[15px] font-semibold tracking-tight ${dark ? 'text-white' : 'text-ink-950'}`}>
          Prepwise
        </span>
      )}
    </div>
  );
}
