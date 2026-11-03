/** Marco de celular reutilizable (hero y demo). */
export function PhoneFrame({
  children,
  className = "",
  screenClassName = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  screenClassName?: string;
  label?: string;
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={`relative mx-auto w-full max-w-[300px] rounded-[48px] bg-gradient-to-b from-[#3a332d] via-[#1b1714] to-[#2a241f] p-[10px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6),0_0_0_1px_rgb(255_255_255/0.06)_inset] ${className}`}
    >
      {/* botones laterales */}
      <span aria-hidden className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-[#2a241f]" />
      <span aria-hidden className="absolute -left-[3px] top-36 h-14 w-[3px] rounded-l bg-[#2a241f]" />
      <span aria-hidden className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-[#2a241f]" />
      <div className={`relative aspect-[9/19] overflow-hidden rounded-[38px] bg-black ${screenClassName}`}>
        {/* isla */}
        <span aria-hidden className="absolute left-1/2 top-2.5 z-50 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}
