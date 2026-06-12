// Growth Chests — variable-ratio rewards done honestly (docs/research/
// competitors.md #3): the TRIGGER is always earned (mastering a topic, every
// 7th streak day, sweeping all daily quests), only the CONTENTS are random,
// and the rarity is visible before opening (legible variance).

export const RARITIES = [
  { id: 'common', label: 'Common', weight: 60, color: '#8aa86f' },
  { id: 'rare', label: 'Rare', weight: 30, color: '#e5b95e' },
  { id: 'legendary', label: 'Legendary', weight: 10, color: '#ff4500' },
];

const CONTENTS = {
  common: () => ({ sprouts: 15 + Math.floor(Math.random() * 11), freezes: 0 }),
  rare: () =>
    Math.random() < 0.5
      ? { sprouts: 30 + Math.floor(Math.random() * 16), freezes: 0 }
      : { sprouts: 20, freezes: 1 },
  legendary: () => ({ sprouts: 60, freezes: 1 }),
};

/** Roll a new (unopened) chest. `boost` shifts odds toward higher rarities
 *  for bigger achievements (0 = normal, 1 = mastery-grade). */
export function rollChest(reason, boost = 0) {
  const roll = Math.random() * 100 - boost * 20;
  let rarity;
  if (roll < RARITIES[2].weight) rarity = 'legendary';
  else if (roll < RARITIES[2].weight + RARITIES[1].weight) rarity = 'rare';
  else rarity = 'common';
  return {
    id: `chest-${Date.now()}-${Math.floor(Math.random() * 1e6)}`,
    rarity,
    ...CONTENTS[rarity](),
    reason,
    earnedAt: Date.now(),
    openedAt: null,
  };
}

export function rarityOf(chest) {
  return RARITIES.find((r) => r.id === chest.rarity) ?? RARITIES[0];
}
