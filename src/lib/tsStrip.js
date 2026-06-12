// Minimal TypeScript → JavaScript stripper for the lesson lab. It removes the
// type syntax teens learn (annotations, interfaces, type aliases, enums,
// generics, `as`, access modifiers) so the resulting JS runs in the same
// sandbox the JS track uses. NOT a full compiler — it covers the teaching
// subset, and only strips an annotation when its right-hand side actually
// looks like a TYPE (so object literals like `{ name: "Ada" }` and
// `{ count: 5 }` are left untouched). Type-syntax intent is verified
// separately by sourceIncludes checks against the ORIGINAL source.

// A type expression: a primitive keyword, a Capitalized name, or an array/
// generic/union built from those. Deliberately conservative.
const PRIMITIVE = 'string|number|boolean|any|unknown|never|void|null|undefined|object|bigint|symbol';
const TYPE_ATOM = `(?:(?:${PRIMITIVE})|[A-Z][A-Za-z0-9_]*)(?:<[^<>]*>)?(?:\\[\\])*`;
const TYPE_EXPR = `${TYPE_ATOM}(?:\\s*\\|\\s*${TYPE_ATOM})*`;

export function stripTypes(src) {
  let s = String(src ?? '');

  // Whole `interface X { ... }` blocks.
  s = s.replace(/\binterface\s+[A-Za-z0-9_]+(\s+extends\s+[^{]+)?\s*\{[^]*?\n\}/g, '');

  // `type X = ...;` aliases.
  s = s.replace(/\btype\s+[A-Za-z0-9_<>, ]+\s*=\s*[^;\n]+;?/g, '');

  // enum X { A, B } → const X = { A: 'A', B: 'B' }.
  s = s.replace(/\benum\s+([A-Za-z0-9_]+)\s*\{([^]*?)\}/g, (_, name, body) => {
    const members = body
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean)
      .map((m) => {
        const [k, v] = m.split('=').map((x) => x.trim());
        return `${k}: ${v ?? `'${k}'`}`;
      });
    return `const ${name} = { ${members.join(', ')} }`;
  });

  // `as Type` casts.
  s = s.replace(new RegExp(`\\s+as\\s+${TYPE_EXPR}`, 'g'), '');

  // Return-type annotations: `)` then `: Type` before a `{` or `=>`.
  s = s.replace(
    new RegExp(`\\)\\s*:\\s*${TYPE_EXPR}(?=\\s*(\\{|=>))`, 'g'),
    ')'
  );

  // Variable / parameter annotations: `name: Type` (optionally `name?:`),
  // ONLY when the RHS is a type expression (leaves object-literal values be).
  s = s.replace(
    new RegExp(`([A-Za-z0-9_)\\]])\\??\\s*:\\s*${TYPE_EXPR}`, 'g'),
    '$1'
  );

  // Generic type-args in calls/decls: foo<number>(), function box<T>() — drop
  // <...> when it contains no operators (so it's not a comparison).
  s = s.replace(/<[A-Za-z0-9_<>,[\] |&.]+>/g, (m) =>
    /[=+\-*/]/.test(m) ? m : ''
  );

  // Access modifiers / readonly in class bodies.
  s = s.replace(/\b(public|private|protected|readonly)\s+/g, '');

  return s;
}
