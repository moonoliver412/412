// Lesson registry — every authored topic, indexed by lesson id.
//
// The curriculum (src/data/curriculum.js) lists more topics than have
// authored content yet; `getLesson` / `hasLesson` are how the app asks
// whether a given lesson is ready to open.

import htmlStructure from './html/html-structure';
import htmlTextLinks from './html/html-text-links';
import htmlTablesLists from './html/html-tables-lists';
import htmlFormsMedia from './html/html-forms-media';
import htmlSemantic from './html/html-semantic';
import htmlA11y from './html/html-a11y';
import htmlImages from './html/html-images';
import htmlEmbeds from './html/html-embeds';
import htmlMetaSeo from './html/html-meta-seo';
import htmlSvg from './html/html-svg';
import htmlFormValidation from './html/html-form-validation';
import htmlDebugging from './html/html-debugging';

const topics = [
  htmlStructure,
  htmlTextLinks,
  htmlTablesLists,
  htmlFormsMedia,
  htmlSemantic,
  htmlA11y,
  htmlImages,
  htmlEmbeds,
  htmlMetaSeo,
  htmlSvg,
  htmlFormValidation,
  htmlDebugging,
];

const lessonsById = new Map();
for (const topic of topics) {
  for (const lesson of topic) {
    lessonsById.set(lesson.id, lesson);
  }
}

/** The authored lesson for `lessonId`, or null when none exists yet. */
export function getLesson(lessonId) {
  return lessonsById.get(lessonId) ?? null;
}

/** True when `lessonId` has authored content. */
export function hasLesson(lessonId) {
  return lessonsById.has(lessonId);
}
