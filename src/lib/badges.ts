/**
 * Local badge store — mirrors the Soroban contract API surface
 * (issue / claim / list_by_owner). Swap with a Stellar SDK contract
 * client when wiring to a deployed contract.
 */

export type Badge = {
  id: string;
  skill: string;
  description: string;
  issuer: string;
  recipient: string;
  issuedAt: number;
  // claim flow
  claimCode?: string;
  claimed: boolean;
  claimedAt?: number;
};

const KEY = "skillseal.badges";

const read = (): Badge[] => {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const write = (rows: Badge[]) => localStorage.setItem(KEY, JSON.stringify(rows));

const emit = () => window.dispatchEvent(new Event("skillseal:badges"));

export const listAll = (): Badge[] => read();

export const listByOwner = (addr: string): Badge[] =>
  read().filter((b) => b.recipient.toLowerCase() === addr.toLowerCase() && b.claimed);

export const listPendingFor = (addr: string): Badge[] =>
  read().filter((b) => b.recipient.toLowerCase() === addr.toLowerCase() && !b.claimed);

export const listIssuedBy = (addr: string): Badge[] =>
  read().filter((b) => b.issuer.toLowerCase() === addr.toLowerCase());

export const findByCode = (code: string): Badge | undefined =>
  read().find((b) => b.claimCode?.toUpperCase() === code.toUpperCase() && !b.claimed);

const rid = () => Math.random().toString(36).slice(2, 10).toUpperCase();

export const issueBadge = (input: {
  skill: string;
  description: string;
  issuer: string;
  recipient: string;
  requireCode?: boolean;
}): Badge => {
  const badge: Badge = {
    id: rid(),
    skill: input.skill,
    description: input.description,
    issuer: input.issuer,
    recipient: input.recipient,
    issuedAt: Date.now(),
    claimCode: input.requireCode ? rid() : undefined,
    claimed: !input.requireCode, // direct mint when no code required
    claimedAt: input.requireCode ? undefined : Date.now(),
  };
  const rows = read();
  rows.unshift(badge);
  write(rows);
  emit();
  return badge;
};

export const claimBadge = (code: string, claimer: string): Badge | null => {
  const rows = read();
  const idx = rows.findIndex(
    (b) => b.claimCode?.toUpperCase() === code.toUpperCase() && !b.claimed
  );
  if (idx === -1) return null;
  rows[idx] = {
    ...rows[idx],
    recipient: claimer, // bind to the claimer's wallet
    claimed: true,
    claimedAt: Date.now(),
  };
  write(rows);
  emit();
  return rows[idx];
};

export const onBadgesChange = (cb: () => void) => {
  window.addEventListener("skillseal:badges", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("skillseal:badges", cb);
    window.removeEventListener("storage", cb);
  };
};

// Seed a couple of sample badges so the empty state isn't lonely
export const seedIfEmpty = () => {
  if (read().length) return;
  write([
    {
      id: "DEMO0001",
      skill: "Soroban Fundamentals",
      description: "Completed the Stellar Soroban onboarding curriculum.",
      issuer: "GISSUERSTELLARACADEMYDEMOXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      recipient: "GLEARNERDEMORECIPIENTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      issuedAt: Date.now() - 86400000 * 12,
      claimed: true,
      claimedAt: Date.now() - 86400000 * 11,
    },
    {
      id: "DEMO0002",
      skill: "Smart Contract Security",
      description: "Demonstrated proficiency in auditing Rust contract storage patterns.",
      issuer: "GISSUERSTELLARACADEMYDEMOXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      recipient: "GLEARNERDEMORECIPIENTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      issuedAt: Date.now() - 86400000 * 4,
      claimed: true,
      claimedAt: Date.now() - 86400000 * 3,
    },
  ]);
};
