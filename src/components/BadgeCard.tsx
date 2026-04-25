import { Badge } from "@/lib/badges";
import { Seal } from "@/components/Seal";
import { shortAddr } from "@/lib/wallet";

const fmtDate = (ts?: number) =>
  ts ? new Date(ts).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "—";

export function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <article className="relative bg-card shadow-credential border border-border/80 paper-grain">
      {/* Decorative double border */}
      <div className="absolute inset-2 border border-gold/40 pointer-events-none" />
      <div className="relative p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep/80">
              Certificate of Skill
            </div>
            <h3 className="font-serif text-2xl md:text-3xl mt-1 leading-tight">
              {badge.skill}
            </h3>
          </div>
          <Seal className="h-14 w-14 shrink-0" label="✦" />
        </div>

        <p className="mt-4 text-sm text-muted-foreground italic">
          {badge.description || "This credential certifies the bearer's demonstrated skill."}
        </p>

        <div className="ornament-divider my-6 text-xs">✦</div>

        <dl className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground mb-0.5">Issued To</dt>
            <dd className="font-mono text-foreground">{shortAddr(badge.recipient)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground mb-0.5">Issued By</dt>
            <dd className="font-mono text-foreground">{shortAddr(badge.issuer)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground mb-0.5">Date</dt>
            <dd>{fmtDate(badge.claimedAt ?? badge.issuedAt)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-wider text-muted-foreground mb-0.5">Credential ID</dt>
            <dd className="font-mono">#{badge.id}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
