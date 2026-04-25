import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";

/**
 * Manual wallet connection — user pastes their own Stellar public key.
 * Address is validated (G... format, 56 chars) and persisted to localStorage.
 */

type WalletCtx = {
  address: string | null;
  network: string | null;
  connecting: boolean;
  connect: (address: string) => Promise<boolean>;
  disconnect: () => void;
};

const Ctx = createContext<WalletCtx | null>(null);

const STORAGE_KEY = "skillseal.wallet.address";

// Stellar public keys: start with "G", 56 chars, base32 (A–Z, 2–7)
const STELLAR_ADDR_RE = /^G[A-Z2-7]{55}$/;

export const isValidStellarAddress = (a: string) => STELLAR_ADDR_RE.test(a.trim());

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [network] = useState<string | null>("TESTNET");
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && isValidStellarAddress(saved)) setAddress(saved);
  }, []);

  const connect = async (input: string): Promise<boolean> => {
    setConnecting(true);
    try {
      const addr = input.trim().toUpperCase();
      if (!addr) {
        toast.error("Please enter a wallet address");
        return false;
      }
      if (!isValidStellarAddress(addr)) {
        toast.error("Invalid Stellar address", {
          description: "Must start with 'G' and be 56 characters (A–Z, 2–7).",
        });
        return false;
      }
      localStorage.setItem(STORAGE_KEY, addr);
      setAddress(addr);
      toast.success("Wallet connected");
      return true;
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAddress(null);
    toast.success("Wallet disconnected");
  };

  return (
    <Ctx.Provider value={{ address, network, connecting, connect, disconnect }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWallet = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};

export const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-6)}`;
