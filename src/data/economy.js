// Sprout economy price tables (see docs/MASTERPLAN.md "Mechanics spec").
// Species are the primary coin sink: each language's default species is
// free, the rest escalate. Ownership is global by species name (buying
// cherry once owns cherry everywhere it appears in a palette).

const SPECIES_PRICES = [0, 60, 120, 200];

/** Price of `species` within `language` (curriculum language object). */
export function speciesPrice(language, species) {
  const i = language.species.indexOf(species);
  if (i < 0) return Infinity;
  return SPECIES_PRICES[i] ?? SPECIES_PRICES[SPECIES_PRICES.length - 1];
}

/** True when `species` costs nothing or has been bought. */
export function ownsSpecies(game, language, species) {
  return (
    speciesPrice(language, species) === 0 ||
    game.owned.species.includes(species)
  );
}
