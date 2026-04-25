import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Seal } from "@/components/Seal";
import { BadgeCard } from "@/components/BadgeCard";
import { listAll, seedIfEmpty } from "@/lib/badges";
import { useEffect, useState } from "react";
import { onBadgesChange } from "@/lib/badges";

const Index = () => {
  const [count, setCount] = useState(0);
  const [recent, setRecent] = useState(listAll().slice(0, 2));

  useEffect(() => {
    seedIfEmpty();
    const refresh = () => {
      const all = listAll();
      setCount(all.length);
      setRecent(all.slice(0, 2));
    };
    refresh();
    return onBadgesChange(refresh);
  }, []);

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="grid md:grid-cols-12 gap-10 items-center">
        <div className="md:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-gold-deep">
            <span className="h-px w-8 bg-gold/60" />
            Verifiable. Permanent. Yours.
          </div>
          <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-foreground">
            Credentials, sealed in <em className="text-gold not-italic">stellar dust.</em>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            SkillSeal turns your achievements into tamper-proof micro-certificates on the
            Stellar Soroban network. Issue, claim, and showcase skills — no paper, no platform lock-in.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-sm">
              <Link to="/issue">Issue a Badge</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-sm border-gold/60 hover:bg-gold/10">
              <Link to="/claim">Claim with a Code</Link>
            </Button>
          </div>
          <div className="flex items-center gap-6 pt-6 text-xs text-muted-foreground">
            <div><span className="font-serif text-2xl text-foreground">{count}</span> credentials in registry</div>
            <div className="h-8 w-px bg-border" />
            <div><span className="font-serif text-2xl text-foreground">∞</span> on-chain forever</div>
          </div>
        </div>

        <div className="md:col-span-5 relative">
          <div className="absolute -inset-6 bg-gold/10 blur-2xl rounded-full" />
          <div className="relative bg-card border border-border shadow-credential paper-grain p-10 text-center">
            <div className="absolute inset-3 border border-gold/40 pointer-events-none" />
            <div className="relative">
              <div className="text-[9px] uppercase tracking-[0.3em] text-gold-deep">Specimen</div>
              <h3 className="font-serif text-3xl mt-2">Soroban Artisan</h3>
              <div className="ornament-divider my-5 text-xs">✦</div>
              <p className="text-xs text-muted-foreground italic mb-6">
                Awarded for exceptional craft in smart contract design.
              </p>
              <Seal className="h-20 w-20 mx-auto" label="✦" />
              <div className="mt-5 font-mono text-[10px] text-muted-foreground">#SPECIMEN · Stellar Testnet</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section>
        <header className="text-center max-w-2xl mx-auto mb-12">
          <div className="ornament-divider text-xs mb-4">✦</div>
          <h2 className="font-serif text-4xl">A credential, in three movements</h2>
        </header>
        <ol className="grid md:grid-cols-3 gap-6">
          {[
            { n: "I", t: "Issue", d: "An institution or mentor mints a badge with a unique claim code." },
            { n: "II", t: "Claim", d: "The learner connects Freighter and binds the badge to their wallet." },
            { n: "III", t: "Display", d: "A public profile page renders every credential as a verifiable artifact." },
          ].map((s) => (
            <li key={s.n} className="bg-card border border-border p-8 paper-grain shadow-credential">
              <div className="font-serif text-5xl text-gold/70">{s.n}</div>
              <h3 className="font-serif text-2xl mt-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Recent registry */}
      {recent.length > 0 && (
        <section>
          <header className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep mb-2">Latest</div>
              <h2 className="font-serif text-4xl">From the Registry</h2>
            </div>
            <Link to="/registry" className="text-sm text-foreground underline-offset-4 hover:underline">
              Browse all →
            </Link>
          </header>
          <div className="grid md:grid-cols-2 gap-6">
            {recent.map((b) => <BadgeCard key={b.id} badge={b} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;
