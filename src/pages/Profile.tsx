import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { listByOwner, listIssuedBy, listPendingFor, onBadgesChange, Badge } from "@/lib/badges";
import { BadgeCard } from "@/components/BadgeCard";
import { Seal } from "@/components/Seal";
import { Button } from "@/components/ui/button";
import { shortAddr, useWallet } from "@/lib/wallet";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export default function Profile() {
  const { address: addr = "" } = useParams();
  const { address: me } = useWallet();
  const [owned, setOwned] = useState<Badge[]>([]);
  const [issued, setIssued] = useState<Badge[]>([]);
  const [pending, setPending] = useState<Badge[]>([]);

  useEffect(() => {
    const refresh = () => {
      setOwned(listByOwner(addr));
      setIssued(listIssuedBy(addr));
      setPending(listPendingFor(addr));
    };
    refresh();
    return onBadgesChange(refresh);
  }, [addr]);

  const isMe = me === addr;

  return (
    <div className="space-y-12">
      <header className="bg-card border border-border paper-grain p-8 md:p-12 shadow-credential relative">
        <div className="absolute inset-3 border border-gold/40 pointer-events-none" />
        <div className="relative flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          <Seal className="h-24 w-24" label={addr.slice(1, 2)} />
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep">Holder</div>
            <h1 className="font-serif text-3xl md:text-4xl mt-1 break-all">
              {isMe ? "Your Credentials" : "Credential Holder"}
            </h1>
            <div className="mt-2 flex items-center gap-2 justify-center md:justify-start">
              <code className="font-mono text-xs text-muted-foreground">{shortAddr(addr)}</code>
              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => {
                navigator.clipboard.writeText(addr);
                toast.success("Address copied");
              }}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex gap-6 mt-5 justify-center md:justify-start">
              <Stat label="Earned" value={owned.length} />
              <Stat label="Issued" value={issued.length} />
              <Stat label="Pending" value={pending.length} />
            </div>
          </div>
          {isMe && (
            <Button variant="outline" onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success("Profile link copied");
            }}>Share Profile</Button>
          )}
        </div>
      </header>

      <Section title="Earned Credentials" empty="No credentials claimed yet.">
        {owned.map((b) => <BadgeCard key={b.id} badge={b} />)}
      </Section>

      {issued.length > 0 && (
        <Section title="Issued by this Holder" empty="">
          {issued.map((b) => <BadgeCard key={b.id} badge={b} />)}
        </Section>
      )}

      {isMe && pending.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          You have {pending.length} pending claim(s). <Link to="/claim" className="underline">Claim now →</Link>
        </div>
      )}
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="font-serif text-3xl text-foreground">{value}</div>
    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
  </div>
);

const Section = ({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) => {
  const arr = Array.isArray(children) ? children : [children];
  return (
    <section>
      <h2 className="font-serif text-3xl mb-6">{title}</h2>
      {arr.length === 0 || (Array.isArray(children) && children.length === 0) ? (
        <p className="text-muted-foreground italic">{empty}</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">{children}</div>
      )}
    </section>
  );
};
