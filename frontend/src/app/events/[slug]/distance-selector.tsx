import Link from "next/link";
import { ArrowRight, Route } from "lucide-react";

export function DistanceSelector({
  slug,
  distances,
}: {
  slug: string;
  distances: string[];
}) {
  if (!distances || distances.length === 0) return null;

  return (
    <div className="rounded-2xl border border-(--line) bg-(--panel) p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-[0.55rem] font-bold uppercase tracking-widest text-(--muted-soft)">
        <Route className="h-3.5 w-3.5 text-(--sage)" />
        Pick a distance
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {distances.map((distance) => (
          <Link
            key={distance}
            className="group inline-flex items-center gap-1.5 rounded-xl border border-(--line) bg-(--panel-soft) px-3.5 py-2 text-sm font-semibold text-(--foreground) transition-all duration-200 hover:-translate-y-0.5 hover:border-(--sage)/40 hover:bg-(--sage-soft) hover:text-(--sage) hover:shadow-sm"
            href={`/register?event=${encodeURIComponent(slug)}&distance=${encodeURIComponent(distance)}`}
          >
            {distance}
            <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </div>
  );
}
