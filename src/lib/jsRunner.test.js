import { describe, expect, it } from 'vitest';
import { buildJsRunDoc, labelJsResults } from './jsRunner';

describe('buildJsRunDoc', () => {
  it('embeds the learner code, host html, and nonce', () => {
    const doc = buildJsRunDoc({
      code: 'console.log("hi")',
      html: '<p id="out"></p>',
      checks: [{ type: 'logIncludes', text: 'hi', label: 'says hi' }],
      nonce: 'run-123',
    });
    expect(doc).toContain('console.log("hi")');
    expect(doc).toContain('<p id="out"></p>');
    expect(doc).toContain('"run-123"');
  });

  it('neutralizes </script> inside learner code so the doc stays intact', () => {
    const doc = buildJsRunDoc({
      code: 'const s = "</script><script>alert(1)";',
      checks: [],
      nonce: 'n',
    });
    // The raw close tag must not survive inside the embedded code.
    expect(doc).not.toContain('"</script>');
    expect(doc).toContain('<\\/script');
  });

  it('handles missing optional fields', () => {
    const doc = buildJsRunDoc({ code: '', checks: undefined, nonce: 'n' });
    expect(doc).toContain('<!doctype html>');
  });
});

describe('labelJsResults', () => {
  const checks = [
    { type: 'exprTruthy', expr: 'true', label: 'first' },
    { type: 'logIncludes', text: 'x', label: 'second' },
  ];

  it('maps booleans onto labeled checks in order', () => {
    expect(labelJsResults(checks, [true, false])).toEqual([
      { label: 'first', pass: true },
      { label: 'second', pass: false },
    ]);
  });

  it('treats missing results as not passed (no run yet)', () => {
    expect(labelJsResults(checks, [])).toEqual([
      { label: 'first', pass: false },
      { label: 'second', pass: false },
    ]);
  });
});
