import { describe, expect, it } from 'vitest';
import { ownsSpecies, speciesPrice } from './economy';
import { LANGUAGES } from './curriculum';

const lang = { species: ['oak', 'birch', 'maple', 'cherry'] };

describe('speciesPrice', () => {
  it('first species is free, later ones escalate', () => {
    expect(speciesPrice(lang, 'oak')).toBe(0);
    expect(speciesPrice(lang, 'birch')).toBe(60);
    expect(speciesPrice(lang, 'maple')).toBe(120);
    expect(speciesPrice(lang, 'cherry')).toBe(200);
  });

  it('unknown species are unbuyable', () => {
    expect(speciesPrice(lang, 'cactus')).toBe(Infinity);
  });

  it('every real language has a free default species', () => {
    for (const l of LANGUAGES) {
      expect(speciesPrice(l, l.species[0]), l.id).toBe(0);
    }
  });
});

describe('ownsSpecies', () => {
  const game = { owned: { species: ['maple'] } };

  it('free defaults are always owned', () => {
    expect(ownsSpecies(game, lang, 'oak')).toBe(true);
  });

  it('bought species are owned, unbought are not', () => {
    expect(ownsSpecies(game, lang, 'maple')).toBe(true);
    expect(ownsSpecies(game, lang, 'birch')).toBe(false);
  });
});
