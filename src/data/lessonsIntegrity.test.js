// Curriculum ↔ lesson-content integrity. This is the safety net that catches
// structural damage from content edits (e.g. a language-simplification pass
// accidentally touching ids, checks, or exercise shapes).
import { describe, expect, it } from 'vitest';
import { LANGUAGES, STAGES_PER_TOPIC } from './curriculum';
import { getLesson } from './lessons';

const JS_CHECK_TYPES = new Set([
  'logIncludes',
  'exprTruthy',
  'selectorExists',
  'textIncludes',
]);
const DOM_CHECK_TYPES = new Set([
  'selectorExists',
  'selectorCount',
  'attrEquals',
  'textIncludes',
  'styleIncludes',
]);

const allTopics = LANGUAGES.flatMap((lang) =>
  lang.topics.map((t) => ({ lang: lang.id, topic: t }))
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
  it('every curriculum lesson has authored content', () => {
    for (const { topic } of allTopics) {
      for (const lesson of topic.lessons) {
        expect(getLesson(lesson.id), lesson.id).not.toBeNull();
      }
    }
  });

  it('every lesson has teaching blocks and a graded exercise', () => {
    for (const { lang, topic } of allTopics) {
      for (const { id } of topic.lessons) {
        const lesson = getLesson(id);
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
          expect(ex.hints.length, `${id} hints count`).toBeLessThanOrEqual(2);
          for (const hint of ex.hints) {
            expect(typeof hint, `${id} hint`).toBe('string');
            expect(hint.length, `${id} empty hint`).toBeGreaterThan(0);
          }
        }
        if (ex.solution !== undefined) {
          expect(typeof ex.solution, `${id} solution`).toBe('string');
          expect(ex.solution.length, `${id} empty solution`).toBeGreaterThan(0);
        }

        const validTypes = lang === 'js' ? JS_CHECK_TYPES : DOM_CHECK_TYPES;
        for (const check of ex.checks) {
          expect(validTypes.has(check.type), `${id} check ${check.type}`).toBe(
            true
          );
          expect(typeof check.label, `${id} check label`).toBe('string');
          if (check.hint !== undefined) {
            expect(typeof check.hint, `${id} check hint`).toBe('string');
            expect(check.hint.length, `${id} empty check hint`).toBeGreaterThan(
              0
            );
          }
        }

        if (lang === 'js') {
          expect(ex.kind, `${id} must be kind:'js'`).toBe('js');
        } else {
          expect(ex.kind, `${id} must not be kind:'js'`).toBeUndefined();
        }
      }
    }
  });
});
