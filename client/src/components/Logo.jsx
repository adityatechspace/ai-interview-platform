export default function Logo({
  className = "",
  showWordmark = true,
  dark = false,
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/favicon.png" // or /logo.png if you prefer
        alt="Moccus"
        className="h-8 w-8 object-contain"
        draggable={false}
      />

      {showWordmark && (
        <span
          className={`text-[17px] font-bold tracking-tight ${
            dark ? "text-white" : "text-zinc-900"
          }`}
        >
          Moccus
        </span>
      )}
    </div>
  );
}