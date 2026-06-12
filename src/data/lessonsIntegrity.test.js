// Curriculum ↔ lesson-content integrity. This is the safety net that catches
// structural damage from content edits (e.g. a language-simplification pass
// accidentally touching ids, checks, or exercise shapes).
import { describe, expect, it } from 'vitest';
import { LANGUAGES, STAGES_PER_TOPIC } from './curriculum';
import { getLesson } from './lessons';

const SOURCE = ['sourceIncludes', 'sourceMatches'];
const CHECK_TYPES_BY_KIND = {
  dom: new Set([
    'selectorExists',
    'selectorCount',
    'attrEquals',
    'textIncludes',
    'styleIncludes',
  ]),
  js: new Set(['logIncludes', 'exprTruthy', 'selectorExists', 'textIncludes', ...SOURCE]),
  ts: new Set(['logIncludes', 'exprTruthy', ...SOURCE]),
  node: new Set(['logIncludes', 'exprTruthy', ...SOURCE]),
  react: new Set(['selectorExists', 'textIncludes', 'logIncludes', ...SOURCE]),
  sql: new Set([
    'queryRowCount',
    'queryHasColumns',
    'queryReturns',
    'queryCellIncludes',
    'verifyRowCount',
    ...SOURCE,
  ]),
  python: new Set(['logIncludes', ...SOURCE]),
  terminal: new Set([
    'output',
    'fileExists',
    'dirExists',
    'fileContains',
    'gitInited',
    'gitStaged',
    'gitCommits',
    'gitBranch',
    'gitRemote',
    ...SOURCE,
  ]),
  quiz: new Set([]),
};
const VALID_KINDS = new Set(Object.keys(CHECK_TYPES_BY_KIND));

const allTopics = LANGUAGES.flatMap((lang) =>
  lang.topics.map((t) => ({ language: lang, lang: lang.id, topic: t }))
);

describe('curriculum structure', () => {
  it('every topic has exactly STAGES_PER_TOPIC lessons', () => {
    for (const { topic } of allTopics) {
      expect(topic.lessons, topic.id).toHaveLength(STAGES_PER_TOPIC);
    }
  });

  it('lesson ids are unique across the whole curriculum', () => {
    const ids = allTopics.flatMap(({ topic }) =>
      topic.lessons.map((l) => l.id)
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('authored lesson content', () => {
  it('the HTML/CSS/JS core tracks are fully authored', () => {
    // Newer tracks (TS/React/SQL/CLI/Python/Node) are authored incrementally
    // and shown as "Coming soon" until ready; the original three must stay
    // complete.
    const core = new Set(['html', 'css', 'js']);
    for (const { language, topic } of allTopics) {
      if (!core.has(language.id)) continue;
      for (const lesson of topic.lessons) {
        expect(getLesson(lesson.id), lesson.id).not.toBeNull();
      }
    }
  });

  it('every AUTHORED lesson has teaching blocks and a graded exercise', () => {
    for (const { topic } of allTopics) {
      for (const { id } of topic.lessons) {
        const lesson = getLesson(id);
        if (!lesson) continue; // not yet authored — fine
        expect(lesson.blocks.length, id).toBeGreaterThanOrEqual(2);
        for (const block of lesson.blocks) {
          expect(['p', 'code', 'tip', 'quiz'], `${id} block type`).toContain(
            block.type
          );
          if (block.type === 'quiz') {
            expect(typeof block.question, `${id} quiz question`).toBe('string');
            expect(Array.isArray(block.options), `${id} quiz options`).toBe(
              true
            );
            expect(
              block.options.length,
              `${id} quiz options count`
            ).toBeGreaterThanOrEqual(2);
            expect(
              Number.isInteger(block.answer) &&
                block.answer >= 0 &&
                block.answer < block.options.length,
              `${id} quiz answer index`
            ).toBe(true);
          } else {
            expect(typeof block.text, `${id} block text`).toBe('string');
            expect(block.text.length, `${id} empty block`).toBeGreaterThan(0);
          }
        }
        const ex = lesson.exercise;
        expect(typeof ex.instructions, id).toBe('string');
        expect(typeof ex.starter, `${id} starter`).toBe('string');
        expect(ex.checks.length, `${id} checks`).toBeGreaterThanOrEqual(2);

        // Stuck-help schema (optional, validated when present).
        if (ex.hints !== undefined) {
          expect(Array.isArray(ex.hints), `${id} hints`).toBe(true);
          expect(ex.hints.length, `${id} hints count`).toBeGreaterThanOrEqual(1);
          expect(ex.hints.length, `${id} hints count`).toBeLessThanOrEqual(3);
          for (const hint of ex.hints) {
            expect(typeof hint, `${id} hint`).toBe('string');
            expect(hint.length, `${id} empty hint`).toBeGreaterThan(0);
          }
        }
        if (ex.solution !== undefined) {
          expect(typeof ex.solution, `${id} solution`).toBe('string');
          expect(ex.solution.length, `${id} empty solution`).toBeGreaterThan(0);
        }

        // The exercise kind must be known, and its checks must use types
        // valid for that kind's runner.
        const kind = ex.kind ?? 'dom';
        expect(VALID_KINDS.has(kind), `${id} unknown kind ${kind}`).toBe(true);
        const validTypes = CHECK_TYPES_BY_KIND[kind];
        for (const check of ex.checks) {
          expect(
            validTypes.has(check.type),
            `${id} (${kind}) bad check ${check.type}`
          ).toBe(true);
          expect(typeof check.label, `${id} check label`).toBe('string');
          if (check.hint !== undefined) {
            expect(typeof check.hint, `${id} check hint`).toBe('string');
            expect(check.hint.length, `${id} empty check hint`).toBeGreaterThan(
              0
            );
          }
        }
      }
    }
  });
});
