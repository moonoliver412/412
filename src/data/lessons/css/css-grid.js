// Topic: Grid Layout (css-grid) — 5 lessons.

const lessons = [
  {
    id: 'css-grid-1',
    blocks: [
      {
        type: 'p',
        text: 'CSS Grid is a two-dimensional layout system. You define columns and rows at the same time and place items anywhere on that grid. It is the right tool when you need to control both directions at once — think magazine spreads, dashboards, and photo galleries.',
      },
      {
        type: 'code',
        text: '.grove {\n  display: grid;\n  grid-template-columns: 200px 200px 200px; /* three fixed columns */\n  grid-template-rows: auto auto;            /* two rows, height fits content */\n  gap: 16px;\n}',
      },
      {
        type: 'p',
        text: 'grid-template-columns accepts a list of sizes separated by spaces. Each value defines one column\'s width. The fr unit means fraction — it is specific to Grid. 1fr means "one share of the leftover space." Three columns of 1fr each split the container into equal thirds automatically.',
      },
      {
        type: 'tip',
        text: 'repeat(3, 1fr) is shorthand for "1fr 1fr 1fr". repeat(12, 1fr) gives you a 12-column grid. Much less typing.',
      },
    ],
    exercise: {
      instructions:
        'Turn the .grove into a 3-column grid using repeat(3, 1fr) for grid-template-columns, and set a gap of "16px".',
      hints: [
        'Grid starts with display: grid on the container, just like Flexbox starts with display: flex.',
        'Add display: grid, grid-template-columns: repeat(3, 1fr), and gap: 16px to .grove.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .grove {\n        /* your css here */\n      }\n      .tree {\n        background: #c8e6c9;\n        padding: 16px;\n        border-radius: 8px;\n        text-align: center;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="grove">\n      <div class="tree">Willow</div>\n      <div class="tree">Birch</div>\n      <div class="tree">Pine</div>\n      <div class="tree">Bamboo</div>\n      <div class="tree">Cherry</div>\n      <div class="tree">Oak</div>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .grove {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: 16px;\n      }\n      .tree {\n        background: #c8e6c9;\n        padding: 16px;\n        border-radius: 8px;\n        text-align: center;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="grove">\n      <div class="tree">Willow</div>\n      <div class="tree">Birch</div>\n      <div class="tree">Pine</div>\n      <div class="tree">Bamboo</div>\n      <div class="tree">Cherry</div>\n      <div class="tree">Oak</div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'display:grid',
          label: 'The grove is a grid container',
          hint: 'Add display: grid to .grove.',
        },
        {
          type: 'styleIncludes',
          text: 'grid-template-columns:repeat(3,1fr)',
          label: 'Three equal columns are defined',
          hint: 'Set grid-template-columns: repeat(3, 1fr) on .grove.',
        },
        {
          type: 'styleIncludes',
          text: 'gap:16px',
          label: 'Items have a 16px gap',
        },
      ],
    },
  },
  {
    id: 'css-grid-2',
    blocks: [
      {
        type: 'p',
        text: 'Grid items can span multiple columns or rows. grid-column: 1 / 3 places an item from column line 1 to column line 3 — so it fills columns 1 and 2. You can also use the span keyword: grid-column: span 2 means "take up 2 columns from wherever I start."',
      },
      {
        type: 'code',
        text: '.feature {\n  grid-column: 1 / 3;   /* spans 2 columns */\n  grid-row: 1 / 2;      /* sits in row 1 only */\n}\n\n.tall-card {\n  grid-row: span 2;     /* spans 2 rows */\n}',
      },
      {
        type: 'p',
        text: 'Grid lines are numbered from 1. A four-column grid has five column lines: 1, 2, 3, 4, and 5. Negative numbers count from the end. -1 is always the last line. So grid-column: 1 / -1 stretches from the first to the last column, no matter how many columns there are.',
      },
      {
        type: 'tip',
        text: 'Browser dev tools show the grid lines when you click the grid icon in the inspector. Use it to see exactly where your items land.',
      },
    ],
    exercise: {
      instructions:
        'Make the .featured card span 2 columns by setting grid-column to "span 2". The grid already has 3 columns defined.',
      hints: [
        'Use the grid-column property on a grid item (not the container) to control how many columns it takes up.',
        'Add grid-column: span 2 to .featured.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .grove {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: 12px;\n      }\n      .tree {\n        background: #c8e6c9;\n        padding: 16px;\n        border-radius: 8px;\n        text-align: center;\n      }\n      .featured {\n        background: #388e3c;\n        color: white;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="grove">\n      <div class="tree featured">Ancient Willow</div>\n      <div class="tree">Birch</div>\n      <div class="tree">Pine</div>\n      <div class="tree">Bamboo</div>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .grove {\n        display: grid;\n        grid-template-columns: repeat(3, 1fr);\n        gap: 12px;\n      }\n      .tree {\n        background: #c8e6c9;\n        padding: 16px;\n        border-radius: 8px;\n        text-align: center;\n      }\n      .featured {\n        background: #388e3c;\n        color: white;\n        grid-column: span 2;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="grove">\n      <div class="tree featured">Ancient Willow</div>\n      <div class="tree">Birch</div>\n      <div class="tree">Pine</div>\n      <div class="tree">Bamboo</div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'grid-column:',
          label: 'You set the grid-column property',
          hint: 'Add grid-column: span 2 to .featured.',
        },
        {
          type: 'styleIncludes',
          text: 'grid-column:span2',
          label: 'The featured card spans 2 columns',
          hint: 'The value must be span 2 — two words.',
        },
      ],
    },
  },
  {
    id: 'css-grid-3',
    blocks: [
      {
        type: 'p',
        text: 'Named template areas make complex layouts easy to read. Instead of counting column and row numbers, you draw a text map of your layout and give each zone a name. Then each item says grid-area: header and lands exactly where the map says.',
      },
      {
        type: 'code',
        text: '.page {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "sidebar main"\n    "footer footer";\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: auto 1fr auto;\n}\n\n.page-header { grid-area: header; }\n.page-sidebar { grid-area: sidebar; }\n.page-main   { grid-area: main; }\n.page-footer { grid-area: footer; }',
      },
      {
        type: 'p',
        text: 'Each string in grid-template-areas is one row. Repeating a name across columns makes that item span those columns. A period (.) marks an empty cell. You can name areas anything, but naming them after their role makes the code easy to understand.',
      },
      {
        type: 'tip',
        text: 'Template areas must form a rectangle. You cannot make an L-shaped named area. If your layout needs that shape, use line-based placement instead.',
      },
    ],
    exercise: {
      instructions:
        'Assign each element its grid-area name: give .site-header grid-area "header", .site-nav grid-area "sidebar", .site-main grid-area "main", and .site-footer grid-area "footer". The container\'s template areas are already defined.',
      hints: [
        'Each element needs a grid-area property whose value matches a name from the grid-template-areas map.',
        'Add grid-area: header to .site-header, grid-area: sidebar to .site-nav, grid-area: main to .site-main, and grid-area: footer to .site-footer.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .page {\n        display: grid;\n        grid-template-areas:\n          "header header"\n          "sidebar main"\n          "footer footer";\n        grid-template-columns: 160px 1fr;\n        grid-template-rows: auto 1fr auto;\n        gap: 8px;\n        height: 300px;\n      }\n      .site-header { background:#a5d6a7; padding:8px; /* your css here */ }\n      .site-nav    { background:#c8e6c9; padding:8px; /* your css here */ }\n      .site-main   { background:#f1f8f1; padding:8px; /* your css here */ }\n      .site-footer { background:#a5d6a7; padding:8px; /* your css here */ }\n    </style>\n  </head>\n  <body>\n    <div class="page">\n      <header class="site-header">Sprout Garden</header>\n      <nav class="site-nav">Trees | Shrubs</nav>\n      <main class="site-main">Select a plant to begin.</main>\n      <footer class="site-footer">© 2026</footer>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .page {\n        display: grid;\n        grid-template-areas:\n          "header header"\n          "sidebar main"\n          "footer footer";\n        grid-template-columns: 160px 1fr;\n        grid-template-rows: auto 1fr auto;\n        gap: 8px;\n        height: 300px;\n      }\n      .site-header { background:#a5d6a7; padding:8px; grid-area: header; }\n      .site-nav    { background:#c8e6c9; padding:8px; grid-area: sidebar; }\n      .site-main   { background:#f1f8f1; padding:8px; grid-area: main; }\n      .site-footer { background:#a5d6a7; padding:8px; grid-area: footer; }\n    </style>\n  </head>\n  <body>\n    <div class="page">\n      <header class="site-header">Sprout Garden</header>\n      <nav class="site-nav">Trees | Shrubs</nav>\n      <main class="site-main">Select a plant to begin.</main>\n      <footer class="site-footer">© 2026</footer>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'grid-area:header',
          label: 'Header is placed in the header area',
          hint: 'Add grid-area: header to .site-header.',
        },
        {
          type: 'styleIncludes',
          text: 'grid-area:sidebar',
          label: 'Nav is placed in the sidebar area',
        },
        {
          type: 'styleIncludes',
          text: 'grid-area:main',
          label: 'Main content is placed in the main area',
          hint: 'Add grid-area: main to .site-main.',
        },
        {
          type: 'styleIncludes',
          text: 'grid-area:footer',
          label: 'Footer is placed in the footer area',
        },
      ],
    },
  },
  {
    id: 'css-grid-4',
    blocks: [
      {
        type: 'p',
        text: 'The superpower of CSS Grid is auto-fit combined with minmax(). These two features let the grid decide how many columns to make based on available space. You get a responsive layout with zero media queries.',
      },
      {
        type: 'code',
        text: '.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}',
      },
      {
        type: 'p',
        text: 'Read it as: "make as many columns as fit, where each is at least 200px wide but grows to fill its share." On a wide screen you get five or six columns. On a phone you get one. The grid adapts without a single media query.',
      },
      {
        type: 'tip',
        text: 'auto-fill is similar to auto-fit but keeps empty track slots. auto-fit collapses them. For most galleries, auto-fit is what you want.',
      },
    ],
    exercise: {
      instructions:
        'Give the .plant-gallery a grid-template-columns of "repeat(auto-fit, minmax(160px, 1fr))" and a gap of "16px".',
      hints: [
        'auto-fit inside repeat() lets the grid decide how many columns fit — you just set the minimum width with minmax().',
        'Set grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) and gap: 16px on .plant-gallery.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .plant-gallery {\n        display: grid;\n        /* your css here */\n      }\n      .plant {\n        background: #c8e6c9;\n        padding: 20px;\n        border-radius: 10px;\n        text-align: center;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="plant-gallery">\n      <div class="plant">Fern</div>\n      <div class="plant">Willow</div>\n      <div class="plant">Pine</div>\n      <div class="plant">Cherry</div>\n      <div class="plant">Bamboo</div>\n      <div class="plant">Oak</div>\n      <div class="plant">Birch</div>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .plant-gallery {\n        display: grid;\n        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n        gap: 16px;\n      }\n      .plant {\n        background: #c8e6c9;\n        padding: 20px;\n        border-radius: 10px;\n        text-align: center;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="plant-gallery">\n      <div class="plant">Fern</div>\n      <div class="plant">Willow</div>\n      <div class="plant">Pine</div>\n      <div class="plant">Cherry</div>\n      <div class="plant">Bamboo</div>\n      <div class="plant">Oak</div>\n      <div class="plant">Birch</div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'repeat(auto-fit,minmax(160px,1fr))',
          label: 'The gallery uses auto-fit with minmax',
          hint: 'Set grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)) on .plant-gallery.',
        },
        {
          type: 'styleIncludes',
          text: 'gap:16px',
          label: 'There is a 16px gap between plants',
          hint: 'Add gap: 16px to .plant-gallery.',
        },
      ],
    },
  },
  {
    id: 'css-grid-5',
    blocks: [
      {
        type: 'p',
        text: 'Magazine layouts used to be only for print. CSS Grid brings them to the web. You can have a wide headline spanning all columns, a quote in a specific cell, and an image stretching across two rows — all with a few grid rules.',
      },
      {
        type: 'p',
        text: 'The recipe: define columns and rows with named areas. Place each element with grid-area. Let a featured item span multiple tracks with grid-column or grid-row. The capstone below is a real four-region editorial layout.',
      },
      {
        type: 'tip',
        text: 'Start by sketching the zones on paper. Which areas span multiple columns? Which row is the tallest? Then translate that sketch directly into grid-template-areas.',
      },
    ],
    exercise: {
      instructions:
        'Complete the magazine layout: give the .page grid-template-areas of "title title" / "image story" / "footer footer". Assign .mag-title grid-area "title", .mag-image grid-area "image", .mag-story grid-area "story", and .mag-footer grid-area "footer".',
      hints: [
        'Add grid-template-areas to .page with three quoted strings — one per row — then assign a grid-area to each child element.',
        'Set grid-template-areas: "title title" "image story" "footer footer" on .page, then give each element its matching grid-area name.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .page {\n        display: grid;\n        grid-template-columns: 1fr 2fr;\n        grid-template-rows: auto 1fr auto;\n        gap: 12px;\n        height: 400px;\n        /* add grid-template-areas here */\n      }\n      .mag-title  { background:#388e3c; color:white; padding:12px; /* your css here */ }\n      .mag-image  { background:#a5d6a7; padding:12px; /* your css here */ }\n      .mag-story  { background:#f1f8f1; padding:12px; /* your css here */ }\n      .mag-footer { background:#c8e6c9; padding:8px;  /* your css here */ }\n    </style>\n  </head>\n  <body>\n    <div class="page">\n      <div class="mag-title">Grove Weekly</div>\n      <div class="mag-image">[ photo ]</div>\n      <div class="mag-story">This week in the grove: the ancient willow flowered for the first time in a decade.</div>\n      <div class="mag-footer">Issue 42 · Spring 2026</div>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .page {\n        display: grid;\n        grid-template-columns: 1fr 2fr;\n        grid-template-rows: auto 1fr auto;\n        gap: 12px;\n        height: 400px;\n        grid-template-areas:\n          "title title"\n          "image story"\n          "footer footer";\n      }\n      .mag-title  { background:#388e3c; color:white; padding:12px; grid-area: title; }\n      .mag-image  { background:#a5d6a7; padding:12px; grid-area: image; }\n      .mag-story  { background:#f1f8f1; padding:12px; grid-area: story; }\n      .mag-footer { background:#c8e6c9; padding:8px;  grid-area: footer; }\n    </style>\n  </head>\n  <body>\n    <div class="page">\n      <div class="mag-title">Grove Weekly</div>\n      <div class="mag-image">[ photo ]</div>\n      <div class="mag-story">This week in the grove: the ancient willow flowered for the first time in a decade.</div>\n      <div class="mag-footer">Issue 42 · Spring 2026</div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'grid-template-areas:',
          label: 'The layout uses named template areas',
          hint: 'Add grid-template-areas: "title title" "image story" "footer footer" to .page.',
        },
        {
          type: 'styleIncludes',
          text: 'grid-area:title',
          label: 'The title is assigned its area',
          hint: 'Add grid-area: title to .mag-title.',
        },
        {
          type: 'styleIncludes',
          text: 'grid-area:story',
          label: 'The story is assigned its area',
        },
      ],
    },
  },
];

export default lessons;
