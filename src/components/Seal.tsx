import { cn } from "@/lib/utils";

/** Wax/gold seal ornament used on credentials and the brand mark. */
export const Seal = ({ className, label = "S" }: { className?: string; label?: string }) => (
  <div
    className={cn(
      "relative inline-flex items-center justify-center rounded-full bg-gold-gradient shadow-seal",
      "border border-gold-deep/30",
      className
    )}
  >
    <div className="absolute inset-1 rounded-full border border-primary-foreground/40" />
    <span className="relative font-serif text-primary-foreground font-semibold tracking-wider">
      {label}
    </span>
  </div>
);
