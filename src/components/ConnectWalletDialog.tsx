import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/lib/wallet";
import { Wallet } from "lucide-react";

type Props = {
  trigger: React.ReactNode;
};

export function ConnectWalletDialog({ trigger }: Props) {
  const { connect, connecting } = useWallet();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await connect(value);
    if (ok) {
      setOpen(false);
      setValue("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-card paper-grain border-border">
        <DialogHeader>
          <div className="flex items-center gap-2 text-gold-deep">
            <Wallet className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-[0.25em]">Connect</span>
          </div>
          <DialogTitle className="font-serif text-2xl">Enter your Stellar address</DialogTitle>
          <DialogDescription>
            Paste your public key (starts with <code className="font-mono">G</code>, 56 characters).
            Your address is stored locally — no extension needed.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="wallet-addr">Wallet address</Label>
            <Input
              id="wallet-addr"
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value.toUpperCase())}
              placeholder="GABCDEF…"
              maxLength={56}
              spellCheck={false}
              className="mt-2 bg-background font-mono text-xs"
            />
            <p className="text-[11px] text-muted-foreground mt-2">
              {value.length}/56 characters
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={connecting}
              className="bg-gold-gradient text-primary-foreground"
            >
              {connecting ? "Connecting…" : "Connect"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
