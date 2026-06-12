// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { allPass, checkExercise } from './checkExercise';

const run = (html, check) => checkExercise(html, [check])[0].pass;

describe('checkExercise', () => {
  it('selectorExists matches present elements and counts', () => {
    expect(run('<h1>Hi</h1>', { type: 'selectorExists', selector: 'h1' })).toBe(
      true
    );
    expect(run('<p>x</p>', { type: 'selectorExists', selector: 'h1' })).toBe(
      false
    );
    expect(
      run('<li>a</li><li>b</li>', {
        type: 'selectorExists',
        selector: 'li',
        count: 2,
      })
    ).toBe(true);
  });

  it('never throws on invalid selectors or broken markup', () => {
    expect(run('<h1>Hi', { type: 'selectorExists', selector: ':::' })).toBe(
      false
    );
    expect(allPass(checkExercise('<div', []))).toBe(true);
  });

  it('textIncludes is case- and whitespace-forgiving', () => {
    expect(
      run('<h1>  Hello,\n World! </h1>', {
        type: 'textIncludes',
        text: 'hello, world',
        selector: 'h1',
      })
    ).toBe(true);
  });

  it('attrEquals compares trimmed, case-insensitive values', () => {
    expect(
      run('<img alt=" A Tree ">', {
        type: 'attrEquals',
        selector: 'img',
        attr: 'alt',
        value: 'a tree',
      })
    ).toBe(true);
  });

  it('styleIncludes ignores all whitespace and case in <style> blocks', () => {
    const html = '<style>h1 { Color :  SteelBlue ; }</style><h1>x</h1>';
    expect(
      run(html, { type: 'styleIncludes', text: 'color:steelblue' })
    ).toBe(true);
  });

  it('styleIncludes also reads inline style attributes', () => {
    expect(
      run('<p style="display: flex">x</p>', {
        type: 'styleIncludes',
        text: 'display:flex',
      })
    ).toBe(true);
  });

  it('styleIncludes fails on an empty fragment', () => {
    expect(run('<style>a{}</style>', { type: 'styleIncludes', text: '' })).toBe(
      false
    );
  });
});
