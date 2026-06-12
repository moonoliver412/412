// TypeScript transpile — Babel's TypeScript preset (bundled, lazy) correctly
// removes ALL type syntax (annotations, interfaces, generics, tuples, enums,
// `as`), unlike a regex stripper. The resulting JS runs in the same sandbox
// the JS track uses. Source-syntax intent is still graded against the
// ORIGINAL TS via sourceIncludes/sourceMatches.

let babelPromise = null;
function getBabel() {
  if (!babelPromise) babelPromise = import('@babel/standalone');
  return babelPromise;
}

/** Transpile TS → JS. On a syntax error, returns code that surfaces the
 *  message in the lab console (so the learner sees what's wrong). */
export async function transpileTs(code) {
  try {
    const Babel = await getBabel();
    return Babel.transform(String(code ?? ''), {
      filename: 'lesson.ts',
      presets: [['typescript', { allExtensions: true, isTSX: false }]],
    }).code;
  } catch (e) {
    const msg = String(e?.message ?? e).replace(/`/g, "'");
    return `window.__csError = ${JSON.stringify(msg)};`;
  }
}
