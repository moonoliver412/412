import { describe, expect, it } from 'vitest';
import { stripTypes } from './tsStrip.js';

// The stripper only needs to make the teaching subset runnable; these guard
// the common shapes lesson authors will use.
describe('stripTypes', () => {
  it('removes variable annotations but keeps the value', () => {
    const js = stripTypes('let n: number = 5;');
    expect(js).toContain('5');
    expect(js).not.toContain(': number');
  });

  it('removes function parameter and return annotations', () => {
    const js = stripTypes('function add(a: number, b: number): number { return a + b; }');
    expect(js).toContain('return a + b');
    expect(js).not.toContain('number');
  });

  it('drops interface declarations entirely', () => {
    const js = stripTypes('interface User {\n  name: string;\n}\nconst u = { name: "Ada" };');
    expect(js).not.toContain('interface');
    expect(js).toContain('name: "Ada"');
  });

  it('drops type aliases', () => {
    const js = stripTypes('type ID = string | number;\nconst x = 1;');
    expect(js).not.toContain('type ID');
    expect(js).toContain('const x = 1');
  });

  it('produces runnable JS for a simple typed function', () => {
    const js = stripTypes('function greet(name: string): string { return "hi " + name; }\nconsole.log(greet("Ada"));');
    let logged = '';
    // eslint-disable-next-line no-new-func -- test-only evaluation of stripped output
    new Function('console', js)({ log: (s) => (logged = s) });
    expect(logged).toBe('hi Ada');
  });

  it('strips an as-cast', () => {
    const js = stripTypes('const x = value as string;');
    expect(js).not.toContain(' as ');
  });
});
