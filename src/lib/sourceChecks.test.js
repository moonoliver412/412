import { describe, expect, it } from 'vitest';
import { runSourceCheck } from './sourceChecks.js';

describe('sourceChecks', () => {
  it('sourceIncludes is case-insensitive and whitespace-collapsing', () => {
    expect(
      runSourceCheck({ type: 'sourceIncludes', text: 'interface User' }, 'interface   User {}')
    ).toBe(true);
    expect(
      runSourceCheck({ type: 'sourceIncludes', text: 'INTERFACE' }, 'interface User')
    ).toBe(true);
  });

  it('flex mode ignores all inner whitespace', () => {
    expect(
      runSourceCheck(
        { type: 'sourceIncludes', text: 'function add(', flex: true },
        'function add (a, b)'
      )
    ).toBe(true);
  });

  it('sourceMatches runs a regex', () => {
    expect(
      runSourceCheck({ type: 'sourceMatches', pattern: ':\\s*number' }, 'let n: number = 1')
    ).toBe(true);
    expect(
      runSourceCheck({ type: 'sourceMatches', pattern: 'useState\\(' }, 'const [x] = useState(0)')
    ).toBe(true);
  });

  it('returns false (not throw) on a bad regex', () => {
    expect(runSourceCheck({ type: 'sourceMatches', pattern: '(' }, 'x')).toBe(false);
  });

  it('returns null for non-source checks', () => {
    expect(runSourceCheck({ type: 'logIncludes', text: 'x' }, 'x')).toBe(null);
  });
});
