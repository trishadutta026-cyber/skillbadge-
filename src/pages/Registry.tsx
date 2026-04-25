import { useEffect, useState } from "react";
import { listAll, onBadgesChange, Badge } from "@/lib/badges";
import { BadgeCard } from "@/components/BadgeCard";
import { Input } from "@/components/ui/input";

export default function Registry() {
  const [rows, setRows] = useState<Badge[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const refresh = () => setRows(listAll().filter((b) => b.claimed));
    refresh();
    return onBadgesChange(refresh);
  }, []);

  const filtered = rows.filter((b) =>
    [b.skill, b.recipient, b.issuer, b.id].join(" ").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep">Registry</div>
          <h1 className="font-serif text-5xl mt-1">The public ledger</h1>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Every claimed credential lives here. Search by skill, address, or credential ID.
          </p>
        </div>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search…"
          className="md:w-72 bg-card"
        />
      </header>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground italic text-center py-20">
          The registry is quiet. Be the first to issue a credential.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((b) => <BadgeCard key={b.id} badge={b} />)}
        </div>
      )}
    </div>
  );
}
