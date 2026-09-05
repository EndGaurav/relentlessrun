export function BrandText({ className = "" }: { className?: string }) {
  return (
    <span className={className}>
      Relentless{" "}
      <span className="bg-gradient-to-r from-[#38bdf8] via-[#2563eb] to-[#00d2ff] bg-clip-text font-extrabold text-transparent">
        Run
      </span>
    </span>
  );
}

