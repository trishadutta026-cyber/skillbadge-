import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWallet, shortAddr } from "@/lib/wallet";
import { Seal } from "@/components/Seal";
import { cn } from "@/lib/utils";
import { Wallet, LogOut } from "lucide-react";
import { ConnectWalletDialog } from "@/components/ConnectWalletDialog";

const nav = [
  { to: "/", label: "Home" },
  { to: "/issue", label: "Issue" },
  { to: "/claim", label: "Claim" },
  { to: "/registry", label: "Registry" },
];

export default function Layout() {
  const { address, network, disconnect, connecting } = useWallet();
  const loc = useLocation();

  return (
    <div className="min-h-screen bg-parchment paper-grain">
      <header className="border-b border-border/70 bg-background/70 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3">
            <Seal className="h-10 w-10" label="S" />
            <div className="leading-tight">
              <div className="font-serif text-xl">SkillSeal</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                On-chain Credentials · Stellar
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 text-sm rounded-sm transition-colors",
                    isActive
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            {address && (
              <NavLink
                to={`/profile/${address}`}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-2 text-sm rounded-sm transition-colors",
                    isActive ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground"
                  )
                }
              >
                My Profile
              </NavLink>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {address ? (
              <>
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="font-mono text-xs text-muted-foreground">
                    {shortAddr(address)}
                  </span>
                  {network && (
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gold-deep">
                      {network}
                    </span>
                  )}
                </div>
                <Button variant="outline" size="sm" onClick={disconnect}>
                  <LogOut className="h-3.5 w-3.5" />
                  Disconnect
                </Button>
              </>
            ) : (
              <ConnectWalletDialog
                trigger={
                  <Button size="sm" disabled={connecting} className="bg-gold-gradient text-primary-foreground hover:opacity-90">
                    <Wallet className="h-3.5 w-3.5" />
                    {connecting ? "Connecting…" : "Connect Wallet"}
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </header>

      <main key={loc.pathname} className="container py-10 md:py-14">
        <Outlet />
      </main>

      <footer className="border-t border-border/70 mt-20">
        <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} SkillSeal · Issued on Stellar Soroban (Testnet demo)</div>
          <div className="font-mono">v0.1.0 · freighter · soroban</div>
        </div>
      </footer>
    </div>
  );
}
