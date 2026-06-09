// CodeSprout curriculum: 3 languages, each with 6 topics × 5 lessons.
// EVERY topic is one tree — plots and groves must scale to topics.length.
// Each language offers its own palette of tree species (`species`); a topic's
// `treeKind` is only the DEFAULT — the user may pick any species from the
// language palette before the tree starts growing (see useProgress.setTreeKind).

export const STAGES_PER_TOPIC = 5;

export const LANGUAGES = [
  {
    id: 'html',
    name: 'HTML',
    color: '#e5b95e',
    species: ['oak', 'birch', 'maple'],
    topics: [
      {
        id: 'html-structure',
        name: 'Document Structure',
        treeKind: 'oak',
        lessons: [
          { id: 'html-structure-1', name: 'Anatomy of an HTML page' },
          { id: 'html-structure-2', name: 'Head, body & metadata' },
          { id: 'html-structure-3', name: 'Headings & paragraphs' },
          { id: 'html-structure-4', name: 'Semantic sections' },
          { id: 'html-structure-5', name: 'Building a page skeleton' },
        ],
      },
      {
        id: 'html-text-links',
        name: 'Text & Links',
        treeKind: 'birch',
        lessons: [
          { id: 'html-text-links-1', name: 'Text formatting tags' },
          { id: 'html-text-links-2', name: 'Inline vs block elements' },
          { id: 'html-text-links-3', name: 'Anchors & navigation' },
          { id: 'html-text-links-4', name: 'Images & figures' },
          { id: 'html-text-links-5', name: 'Putting content together' },
        ],
      },
      {
        id: 'html-tables-lists',
        name: 'Tables & Lists',
        treeKind: 'maple',
        lessons: [
          { id: 'html-tables-lists-1', name: 'Ordered & unordered lists' },
          { id: 'html-tables-lists-2', name: 'Definition lists' },
          { id: 'html-tables-lists-3', name: 'Table rows & cells' },
          { id: 'html-tables-lists-4', name: 'Headers, captions & spans' },
          { id: 'html-tables-lists-5', name: 'A pricing table' },
        ],
      },
      {
        id: 'html-forms-media',
        name: 'Forms & Media',
        treeKind: 'oak',
        lessons: [
          { id: 'html-forms-media-1', name: 'Form basics & inputs' },
          { id: 'html-forms-media-2', name: 'Labels, selects & buttons' },
          { id: 'html-forms-media-3', name: 'Validation attributes' },
          { id: 'html-forms-media-4', name: 'Audio & video' },
          { id: 'html-forms-media-5', name: 'A complete contact form' },
        ],
      },
      {
        id: 'html-semantic',
        name: 'Semantic HTML',
        treeKind: 'birch',
        lessons: [
          { id: 'html-semantic-1', name: 'Why semantics matter' },
          { id: 'html-semantic-2', name: 'Header, nav, main & footer' },
          { id: 'html-semantic-3', name: 'Articles & sections' },
          { id: 'html-semantic-4', name: 'Aside, figure & details' },
          { id: 'html-semantic-5', name: 'Refactoring div soup' },
        ],
      },
      {
        id: 'html-a11y',
        name: 'Accessibility Basics',
        treeKind: 'maple',
        lessons: [
          { id: 'html-a11y-1', name: 'Alt text & headings order' },
          { id: 'html-a11y-2', name: 'Labels & form accessibility' },
          { id: 'html-a11y-3', name: 'ARIA roles — when & why' },
          { id: 'html-a11y-4', name: 'Keyboard navigation' },
          { id: 'html-a11y-5', name: 'Auditing a page' },
        ],
      },
    ],
  },
  {
    id: 'css',
    name: 'CSS',
    color: '#7fa3c8',
    species: ['willow', 'birch', 'pine'],
    topics: [
      {
        id: 'css-selectors',
        name: 'Selectors & Colors',
        treeKind: 'willow',
        lessons: [
          { id: 'css-selectors-1', name: 'Connecting CSS to HTML' },
          { id: 'css-selectors-2', name: 'Class & id selectors' },
          { id: 'css-selectors-3', name: 'Colors & units' },
          { id: 'css-selectors-4', name: 'Typography basics' },
          { id: 'css-selectors-5', name: 'Styling a page' },
        ],
      },
      {
        id: 'css-box-layout',
        name: 'Box Model & Layout',
        treeKind: 'birch',
        lessons: [
          { id: 'css-box-layout-1', name: 'The box model' },
          { id: 'css-box-layout-2', name: 'Margin, padding & borders' },
          { id: 'css-box-layout-3', name: 'Display & position' },
          { id: 'css-box-layout-4', name: 'Building card layouts' },
          { id: 'css-box-layout-5', name: 'Stacking & z-index' },
        ],
      },
      {
        id: 'css-flex-anim',
        name: 'Flexbox',
        treeKind: 'pine',
        lessons: [
          { id: 'css-flex-anim-1', name: 'Flex containers' },
          { id: 'css-flex-anim-2', name: 'Aligning & justifying' },
          { id: 'css-flex-anim-3', name: 'Wrapping & gaps' },
          { id: 'css-flex-anim-4', name: 'Flexible sizing' },
          { id: 'css-flex-anim-5', name: 'A flexbox nav bar' },
        ],
      },
      {
        id: 'css-grid',
        name: 'Grid Layout',
        treeKind: 'willow',
        lessons: [
          { id: 'css-grid-1', name: 'Grid containers & tracks' },
          { id: 'css-grid-2', name: 'Placing items' },
          { id: 'css-grid-3', name: 'Template areas' },
          { id: 'css-grid-4', name: 'Auto-fit & minmax' },
          { id: 'css-grid-5', name: 'A magazine layout' },
        ],
      },
      {
        id: 'css-effects',
        name: 'Transitions & Animations',
        treeKind: 'pine',
        lessons: [
          { id: 'css-effects-1', name: 'Transitions' },
          { id: 'css-effects-2', name: 'Transforms' },
          { id: 'css-effects-3', name: 'Keyframe animations' },
          { id: 'css-effects-4', name: 'Easing & performance' },
          { id: 'css-effects-5', name: 'An animated hero section' },
        ],
      },
      {
        id: 'css-responsive',
        name: 'Responsive Design',
        treeKind: 'birch',
        lessons: [
          { id: 'css-responsive-1', name: 'Media queries' },
          { id: 'css-responsive-2', name: 'Fluid units & clamp()' },
          { id: 'css-responsive-3', name: 'Mobile-first workflow' },
          { id: 'css-responsive-4', name: 'Responsive images' },
          { id: 'css-responsive-5', name: 'Making a page adapt' },
        ],
      },
    ],
  },
  {
    id: 'js',
    name: 'JS',
    color: '#d98a5e',
    species: ['pine', 'maple', 'oak'],
    topics: [
      {
        id: 'js-variables',
        name: 'Variables & Types',
        treeKind: 'pine',
        lessons: [
          { id: 'js-variables-1', name: 'let, const & values' },
          { id: 'js-variables-2', name: 'Numbers & strings' },
          { id: 'js-variables-3', name: 'Booleans & comparisons' },
          { id: 'js-variables-4', name: 'Type conversion' },
          { id: 'js-variables-5', name: 'A tiny calculator' },
        ],
      },
      {
        id: 'js-functions',
        name: 'Functions & Logic',
        treeKind: 'maple',
        lessons: [
          { id: 'js-functions-1', name: 'Writing functions' },
          { id: 'js-functions-2', name: 'Conditionals' },
          { id: 'js-functions-3', name: 'Loops' },
          { id: 'js-functions-4', name: 'Scope & closures' },
          { id: 'js-functions-5', name: 'A number-guessing game' },
        ],
      },
      {
        id: 'js-arrays-objects',
        name: 'Arrays & Objects',
        treeKind: 'oak',
        lessons: [
          { id: 'js-arrays-objects-1', name: 'Array basics' },
          { id: 'js-arrays-objects-2', name: 'map, filter & reduce' },
          { id: 'js-arrays-objects-3', name: 'Object shapes' },
          { id: 'js-arrays-objects-4', name: 'Destructuring & spread' },
          { id: 'js-arrays-objects-5', name: 'A tiny data model' },
        ],
      },
      {
        id: 'js-dom',
        name: 'DOM & Events',
        treeKind: 'pine',
        lessons: [
          { id: 'js-dom-1', name: 'Selecting elements' },
          { id: 'js-dom-2', name: 'Changing the page' },
          { id: 'js-dom-3', name: 'Click & input events' },
          { id: 'js-dom-4', name: 'Forms & state' },
          { id: 'js-dom-5', name: 'An interactive to-do list' },
        ],
      },
      {
        id: 'js-async',
        name: 'Async & Fetch',
        treeKind: 'maple',
        lessons: [
          { id: 'js-async-1', name: 'Callbacks & timers' },
          { id: 'js-async-2', name: 'Promises' },
          { id: 'js-async-3', name: 'async / await' },
          { id: 'js-async-4', name: 'fetch & JSON' },
          { id: 'js-async-5', name: 'A weather widget' },
        ],
      },
      {
        id: 'js-project',
        name: 'Projects & Practice',
        treeKind: 'oak',
        lessons: [
          { id: 'js-project-1', name: 'Planning a small app' },
          { id: 'js-project-2', name: 'Structuring your code' },
          { id: 'js-project-3', name: 'Handling errors' },
          { id: 'js-project-4', name: 'Polishing the UI' },
          { id: 'js-project-5', name: 'Ship it!' },
        ],
      },
    ],
  },
];

export function findTopic(topicId) {
  for (const lang of LANGUAGES) {
    const topic = lang.topics.find((t) => t.id === topicId);
    if (topic) return { language: lang, topic };
  }
  return null;
}

export function allTopics() {
  return LANGUAGES.flatMap((lang) =>
    lang.topics.map((topic) => ({ language: lang, topic }))
  );
}
