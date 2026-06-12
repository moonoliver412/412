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
import cssSelectors from './css/css-selectors';
import cssBoxLayout from './css/css-box-layout';
import cssFlexAnim from './css/css-flex-anim';
import cssGrid from './css/css-grid';
import cssEffects from './css/css-effects';
import cssResponsive from './css/css-responsive';
import cssTypography from './css/css-typography';
import cssBackgrounds from './css/css-backgrounds';
import cssVariables from './css/css-variables';
import jsVariables from './js/js-variables';
import jsFunctions from './js/js-functions';
import jsArraysObjects from './js/js-arrays-objects';
import jsDom from './js/js-dom';
import jsAsync from './js/js-async';
import jsProject from './js/js-project';
import jsClasses from './js/js-classes';
import jsDebugging from './js/js-debugging';

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
  cssSelectors,
  cssBoxLayout,
  cssFlexAnim,
  cssGrid,
  cssEffects,
  cssResponsive,
  cssTypography,
  cssBackgrounds,
  cssVariables,
  jsVariables,
  jsFunctions,
  jsArraysObjects,
  jsDom,
  jsAsync,
  jsProject,
  jsClasses,
  jsDebugging,
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
