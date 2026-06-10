// checkExercise — pure, DOM-only exercise grading for lesson labs.
//
// `checkExercise(html, checks)` parses the learner's HTML once (DOMParser
// never throws on bad markup) and evaluates each declarative check against
// the resulting document. Invalid selectors or unknown check types simply
// fail their check — this module never throws.

/** Case-insensitive, whitespace-normalized text for forgiving comparisons. */
function normText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** querySelectorAll that returns null (instead of throwing) on bad selectors. */
function safeQueryAll(doc, selector) {
  try {
    return [...doc.querySelectorAll(selector)];
  } catch {
    return null;
  }
}

function runCheck(doc, check) {
  switch (check.type) {
    case 'selectorExists': {
      const matches = safeQueryAll(doc, check.selector);
      if (!matches) return false;
      return check.count != null
        ? matches.length === check.count
        : matches.length >= 1;
    }
    case 'selectorCount': {
      const matches = safeQueryAll(doc, check.selector);
      return matches != null && matches.length === check.count;
    }
    case 'attrEquals': {
      const matches = safeQueryAll(doc, check.selector);
      if (!matches) return false;
      const want = String(check.value ?? '').trim().toLowerCase();
      return matches.some((el) => {
        const got = el.getAttribute(check.attr);
        return got != null && got.trim().toLowerCase() === want;
      });
    }
    case 'textIncludes': {
      const want = normText(check.text);
      if (check.selector) {
        const matches = safeQueryAll(doc, check.selector);
        return (
          matches != null &&
          matches.some((el) => normText(el.textContent).includes(want))
        );
      }
      return normText(doc.body?.textContent).includes(want);
    }
    default:
      return false;
  }
}

/**
 * Run declarative `checks` against learner-authored `html`.
 * Returns one `{ label, pass }` per check, in input order.
 */
export function checkExercise(html, checks) {
  const doc = new DOMParser().parseFromString(html ?? '', 'text/html');
  return (checks ?? []).map((check) => ({
    label: check?.label ?? check?.type ?? 'check',
    pass: check != null && runCheck(doc, check),
  }));
}

/** True when every result passed. */
export function allPass(results) {
  return (results ?? []).every((r) => r.pass);
}
