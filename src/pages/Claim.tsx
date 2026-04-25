import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { claimBadge, Badge } from "@/lib/badges";
import { toast } from "sonner";
import { BadgeCard } from "@/components/BadgeCard";
import { Link } from "react-router-dom";
import { ConnectWalletDialog } from "@/components/ConnectWalletDialog";

export default function Claim() {
  const { address } = useWallet();
  const [code, setCode] = useState("");
  const [claimed, setClaimed] = useState<Badge | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error("Connect your wallet first");
    if (!code.trim()) return toast.error("Enter a claim code");
    const b = claimBadge(code.trim(), address);
    if (!b) return toast.error("Invalid or already-claimed code");
    setClaimed(b);
    toast.success("Badge bound to your wallet");
    setCode("");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <header className="text-center">
        <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep">Claim</div>
        <h1 className="font-serif text-5xl mt-2">Bind a badge to your wallet</h1>
        <p className="text-muted-foreground mt-3">
          Enter the one-time code you received from the issuer.
        </p>
      </header>

      {!address ? (
        <div className="bg-card border border-border paper-grain p-10 text-center">
          <p className="text-muted-foreground mb-5">Connect your wallet to claim.</p>
          <ConnectWalletDialog
            trigger={
              <Button className="bg-gold-gradient text-primary-foreground rounded-sm">
                Connect Wallet
              </Button>
            }
          />
        </div>
      ) : (
        <form onSubmit={submit} className="bg-card border border-border paper-grain p-8 space-y-5 shadow-credential">
          <div>
            <Label htmlFor="code">Claim code</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="ABC12XYZ" className="mt-2 bg-background font-mono text-lg tracking-widest text-center" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground rounded-sm">
            Claim Badge
          </Button>
        </form>
      )}

      {claimed && (
        <div className="space-y-4">
          <div className="ornament-divider text-xs">Sealed</div>
          <BadgeCard badge={claimed} />
          <div className="text-center">
            <Link to={`/profile/${address}`} className="text-sm underline underline-offset-4">
              View on your profile →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
