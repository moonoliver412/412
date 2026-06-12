// Source-pattern checks — grade the raw code text, language-agnostic. Used
// where running the code can't prove intent (e.g. "did you declare an
// interface", "did you use a generic") and as a supplement to real
// execution. Whitespace around the needle is collapsed so spacing never
// trips a learner up.
//
//   { type: 'sourceIncludes', text: 'interface', label: '…' }
//   { type: 'sourceIncludes', text: 'function add(', flex: true }   // ignore inner spaces
//   { type: 'sourceMatches', pattern: 'useState\\(', flags: 'i', label: '…' }

function normalize(s) {
  return String(s ?? '').replace(/\s+/g, ' ');
}

/** Evaluate a source-pattern check. Returns true/false; never throws. */
export function runSourceCheck(check, source) {
  try {
    if (check.type === 'sourceIncludes') {
      const hay = check.flex ? normalize(source).replace(/\s/g, '') : normalize(source);
      const needle = check.flex
        ? normalize(check.text).replace(/\s/g, '')
        : normalize(check.text);
      const a = check.caseSensitive ? hay : hay.toLowerCase();
      const b = check.caseSensitive ? needle : needle.toLowerCase();
      return needle.length > 0 && a.indexOf(b) !== -1;
    }
    if (check.type === 'sourceMatches') {
      const re = new RegExp(check.pattern, check.flags ?? '');
      return re.test(String(source ?? ''));
    }
    return null; // not a source check
  } catch {
    return false;
  }
}

export const SOURCE_CHECK_TYPES = new Set(['sourceIncludes', 'sourceMatches']);
