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
    species: ['oak', 'birch', 'maple', 'cherry'],
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
      {
        id: 'html-images',
        name: 'Images & Figures',
        treeKind: 'oak',
        lessons: [
          { id: 'html-images-1', name: 'Image formats & alt text' },
          { id: 'html-images-2', name: 'Responsive images & srcset' },
          { id: 'html-images-3', name: 'Figures & captions' },
          { id: 'html-images-4', name: 'Image maps & lazy loading' },
          { id: 'html-images-5', name: 'A photo gallery page' },
        ],
      },
      {
        id: 'html-embeds',
        name: 'Iframes & Embeds',
        treeKind: 'birch',
        lessons: [
          { id: 'html-embeds-1', name: 'What iframes are' },
          { id: 'html-embeds-2', name: 'Embedding video players' },
          { id: 'html-embeds-3', name: 'Embedding maps & widgets' },
          { id: 'html-embeds-4', name: 'Sandbox & security basics' },
          { id: 'html-embeds-5', name: 'An embed showcase page' },
        ],
      },
      {
        id: 'html-meta-seo',
        name: 'Meta & SEO Basics',
        treeKind: 'maple',
        lessons: [
          { id: 'html-meta-seo-1', name: 'Title & meta description' },
          { id: 'html-meta-seo-2', name: 'Open Graph & social cards' },
          { id: 'html-meta-seo-3', name: 'Favicons & manifests' },
          { id: 'html-meta-seo-4', name: 'Structured data intro' },
          { id: 'html-meta-seo-5', name: 'Auditing a page head' },
        ],
      },
      {
        id: 'html-svg',
        name: 'SVG & Graphics',
        treeKind: 'cherry',
        lessons: [
          { id: 'html-svg-1', name: 'Inline SVG basics' },
          { id: 'html-svg-2', name: 'Shapes & paths' },
          { id: 'html-svg-3', name: 'viewBox & scaling' },
          { id: 'html-svg-4', name: 'Icons & sprites' },
          { id: 'html-svg-5', name: 'Drawing a logo' },
        ],
      },
      {
        id: 'html-form-validation',
        name: 'Form Validation',
        treeKind: 'oak',
        lessons: [
          { id: 'html-form-validation-1', name: 'Required & patterns' },
          { id: 'html-form-validation-2', name: 'Input types that validate' },
          { id: 'html-form-validation-3', name: 'Custom messages' },
          { id: 'html-form-validation-4', name: 'Accessible error states' },
          { id: 'html-form-validation-5', name: 'A bulletproof signup form' },
        ],
      },
      {
        id: 'html-debugging',
        name: 'Debugging HTML',
        treeKind: 'birch',
        lessons: [
          { id: 'html-debugging-1', name: 'Reading the inspector' },
          { id: 'html-debugging-2', name: 'Common nesting mistakes' },
          { id: 'html-debugging-3', name: 'Validation tools' },
          { id: 'html-debugging-4', name: 'Broken layout forensics' },
          { id: 'html-debugging-5', name: 'Fix-the-page challenge' },
        ],
      },
    ],
  },
  {
    id: 'css',
    name: 'CSS',
    color: '#7fa3c8',
    species: ['willow', 'birch', 'pine', 'bamboo'],
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
      {
        id: 'css-typography',
        name: 'Typography & Fonts',
        treeKind: 'willow',
        lessons: [
          { id: 'css-typography-1', name: 'Web fonts & fallbacks' },
          { id: 'css-typography-2', name: 'Size, weight & line height' },
          { id: 'css-typography-3', name: 'Letter & word spacing' },
          { id: 'css-typography-4', name: 'Fluid type' },
          { id: 'css-typography-5', name: 'A type-driven page' },
        ],
      },
      {
        id: 'css-backgrounds',
        name: 'Backgrounds & Borders',
        treeKind: 'bamboo',
        lessons: [
          { id: 'css-backgrounds-1', name: 'Background colors & images' },
          { id: 'css-backgrounds-2', name: 'Gradients' },
          { id: 'css-backgrounds-3', name: 'Border styles & radius' },
          { id: 'css-backgrounds-4', name: 'Shadows' },
          { id: 'css-backgrounds-5', name: 'A hero banner' },
        ],
      },
      {
        id: 'css-variables',
        name: 'CSS Variables',
        treeKind: 'pine',
        lessons: [
          { id: 'css-variables-1', name: 'Defining custom properties' },
          { id: 'css-variables-2', name: 'Scope & inheritance' },
          { id: 'css-variables-3', name: 'Theming with variables' },
          { id: 'css-variables-4', name: 'Variables + calc()' },
          { id: 'css-variables-5', name: 'A theme switcher' },
        ],
      },
    ],
  },
  {
    id: 'js',
    name: 'JS',
    color: '#d98a5e',
    species: ['pine', 'maple', 'oak', 'sunflower'],
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
      {
        id: 'js-classes',
        name: 'Classes & Modules',
        treeKind: 'sunflower',
        lessons: [
          { id: 'js-classes-1', name: 'Class syntax' },
          { id: 'js-classes-2', name: 'Methods & getters' },
          { id: 'js-classes-3', name: 'Inheritance basics' },
          { id: 'js-classes-4', name: 'Import & export' },
          { id: 'js-classes-5', name: 'A modular widget' },
        ],
      },
      {
        id: 'js-debugging',
        name: 'Errors & Debugging',
        treeKind: 'pine',
        lessons: [
          { id: 'js-debugging-1', name: 'Reading error messages' },
          { id: 'js-debugging-2', name: 'console beyond log' },
          { id: 'js-debugging-3', name: 'Breakpoints & stepping' },
          { id: 'js-debugging-4', name: 'try/catch patterns' },
          { id: 'js-debugging-5', name: 'Debug-the-app challenge' },
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
