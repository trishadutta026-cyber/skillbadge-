import { useState } from "react";
import { useWallet } from "@/lib/wallet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { issueBadge, Badge } from "@/lib/badges";
import { toast } from "sonner";
import { BadgeCard } from "@/components/BadgeCard";
import { Copy } from "lucide-react";
import { ConnectWalletDialog } from "@/components/ConnectWalletDialog";

export default function Issue() {
  const { address } = useWallet();
  const [skill, setSkill] = useState("");
  const [description, setDescription] = useState("");
  const [recipient, setRecipient] = useState("");
  const [requireCode, setRequireCode] = useState(true);
  const [issued, setIssued] = useState<Badge | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return toast.error("Connect your wallet first");
    if (!skill.trim()) return toast.error("Skill name is required");
    if (!requireCode && recipient.trim().length < 10) {
      return toast.error("Recipient address required for direct mint");
    }
    const b = issueBadge({
      skill: skill.trim(),
      description: description.trim(),
      issuer: address,
      recipient: requireCode ? "PENDING_CLAIM" : recipient.trim(),
      requireCode,
    });
    setIssued(b);
    toast.success("Badge minted on-chain");
    setSkill(""); setDescription(""); setRecipient("");
  };

  return (
    <div className="grid md:grid-cols-12 gap-10">
      <div className="md:col-span-5 space-y-3">
        <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep">Issuer Console</div>
        <h1 className="font-serif text-5xl">Mint a credential</h1>
        <p className="text-muted-foreground leading-relaxed">
          Compose a skill badge and dispatch it via Soroban. Generate a claim code so the
          learner can bind the badge to their own wallet, or mint it directly to an address.
        </p>
      </div>

      <div className="md:col-span-7">
        {!address ? (
          <div className="bg-card border border-border paper-grain p-10 text-center">
            <p className="text-muted-foreground mb-5">Connect your wallet to begin issuing.</p>
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
              <Label htmlFor="skill">Skill name</Label>
              <Input id="skill" value={skill} onChange={(e) => setSkill(e.target.value)}
                placeholder="e.g. Soroban Smart Contract Author" className="mt-2 bg-background" />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="What did the learner accomplish?" className="mt-2 bg-background min-h-24" />
            </div>

            <div className="flex items-center justify-between border-t border-b border-border/60 py-4">
              <div>
                <Label htmlFor="rc" className="text-base">Use claim code</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Recipient claims the badge themselves with a one-time code.
                </p>
              </div>
              <Switch id="rc" checked={requireCode} onCheckedChange={setRequireCode} />
            </div>

            {!requireCode && (
              <div>
                <Label htmlFor="rcp">Recipient G-address</Label>
                <Input id="rcp" value={recipient} onChange={(e) => setRecipient(e.target.value)}
                  placeholder="G…" className="mt-2 bg-background font-mono text-xs" />
              </div>
            )}

            <Button type="submit" className="w-full bg-primary text-primary-foreground rounded-sm">
              Sign & Issue
            </Button>
          </form>
        )}

        {issued && (
          <div className="mt-8 space-y-4">
            <div className="ornament-divider text-xs">Issued</div>
            {issued.claimCode && (
              <div className="bg-secondary border border-gold/40 p-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-gold-deep">Share this claim code</div>
                  <div className="font-mono text-2xl mt-1">{issued.claimCode}</div>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(issued.claimCode!);
                  toast.success("Copied");
                }}>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </Button>
              </div>
            )}
            <BadgeCard badge={issued} />
          </div>
        )}
      </div>
    </div>
  );
}
