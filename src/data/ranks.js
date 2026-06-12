// XP rank ladder — gardener-themed titles with escalating thresholds.
// XP is never spendable; the rank is the long-term identity readout.

export const RANKS = [
  { name: 'Seed', at: 0, icon: '🌰' },
  { name: 'Sprout', at: 100, icon: '🌱' },
  { name: 'Sapling', at: 300, icon: '🌿' },
  { name: 'Gardener', at: 700, icon: '🧑‍🌾' },
  { name: 'Arborist', at: 1400, icon: '🌳' },
  { name: 'Ranger', at: 2500, icon: '🏕️' },
  { name: 'Grove Keeper', at: 4500, icon: '🌲' },
  { name: 'Forest Warden', at: 8000, icon: '✨' },
];

/** The rank earned at `xp`. */
export function rankFor(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.at) rank = r;
    else break;
  }
  return rank;
}

/** The next rank above `xp`, or null at the top. */
export function nextRank(xp) {
  return RANKS.find((r) => r.at > xp) ?? null;
}
