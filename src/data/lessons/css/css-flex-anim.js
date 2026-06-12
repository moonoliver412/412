// Topic: Flexbox (css-flex-anim) — 5 lessons.

const lessons = [
  {
    id: 'css-flex-anim-1',
    blocks: [
      {
        type: 'p',
        text: 'Before Flexbox, centering something on a page was genuinely hard. Flexbox changed that. Add display: flex to any element and it becomes a flex container: its direct children line up in a row, share the available space, and can be aligned with a handful of easy-to-read properties.',
      },
      {
        type: 'code',
        text: '.toolbar {\n  display: flex;\n  flex-direction: row;   /* default: children flow left to right */\n  gap: 12px;             /* space between children, no hacks needed */\n}',
      },
      {
        type: 'p',
        text: 'flex-direction controls the main axis. row (default) runs left to right; column stacks children top to bottom, like the normal block flow but with all the flexbox powers. The gap property adds equal spacing between items without any margin arithmetic.',
      },
      {
        type: 'tip',
        text: 'Only direct children are flex items. Grandchildren are unaffected — unless you put display: flex on them too.',
      },
    ],
    exercise: {
      instructions:
        'Turn the .toolbar into a flex container with a flex-direction of "row" and a gap of "16px".',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .toolbar {\n        background: #eaf4ea;\n        padding: 12px;\n        /* your css here */\n      }\n      .toolbar button { padding: 8px 16px; }\n    </style>\n  </head>\n  <body>\n    <div class="toolbar">\n      <button>Plant</button>\n      <button>Water</button>\n      <button>Harvest</button>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'display:flex',
          label: 'The toolbar is a flex container',
        },
        {
          type: 'styleIncludes',
          text: 'gap:16px',
          label: 'Items have a 16px gap between them',
        },
      ],
    },
  },
  {
    id: 'css-flex-anim-2',
    blocks: [
      {
        type: 'p',
        text: 'Two properties do most of the alignment work in Flexbox. justify-content controls how items are distributed along the main axis (the direction flex-direction points). align-items controls how they line up on the cross axis (perpendicular to that).',
      },
      {
        type: 'code',
        text: '.card-row {\n  display: flex;\n  justify-content: space-between; /* spread items to the edges */\n  align-items: center;            /* vertically center in the row */\n}',
      },
      {
        type: 'p',
        text: 'The most magical combination is justify-content: center paired with align-items: center on a container that has a defined height. Anything you put inside will float to the exact middle — the centering technique that used to take four CSS tricks now takes two lines.',
      },
      {
        type: 'tip',
        text: 'Space-between pushes items to opposite ends with equal gaps between them. Space-around gives each item equal space on both sides. Space-evenly is the same but the edges also get equal space.',
      },
    ],
    exercise: {
      instructions:
        'Make the .hero center its content both horizontally and vertically using justify-content and align-items. The height is already set for you.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero {\n        display: flex;\n        height: 200px;\n        background: #dcedc8;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="hero">\n      <h1>Welcome to the Grove</h1>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'justify-content:center',
          label: 'Content is centered on the main axis',
        },
        {
          type: 'styleIncludes',
          text: 'align-items:center',
          label: 'Content is centered on the cross axis',
        },
      ],
    },
  },
  {
    id: 'css-flex-anim-3',
    blocks: [
      {
        type: 'p',
        text: 'By default, flex items refuse to wrap — they squash themselves to fit in one line no matter how many there are. flex-wrap: wrap changes that: when items run out of room they spill onto the next line, just like text wrapping in a paragraph.',
      },
      {
        type: 'code',
        text: '.gallery {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.gallery-item {\n  width: 200px;   /* each item holds its size; extras wrap */\n}',
      },
      {
        type: 'p',
        text: 'gap works in both directions when items wrap — it adds space between rows and between columns simultaneously. Before gap existed, developers used negative margins and padding combinations that were easy to get wrong. Now it is one property.',
      },
      {
        type: 'tip',
        text: 'flex-wrap: wrap-reverse wraps items upward instead of downward — handy for chat interfaces where new messages appear at the bottom.',
      },
    ],
    exercise: {
      instructions:
        'Allow the .plant-grid to wrap its items and give it a gap of "12px". Set a width of "140px" on each .plant-item so they wrap naturally.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .plant-grid {\n        display: flex;\n        /* your css here */\n      }\n      .plant-item {\n        background: #c8e6c9;\n        padding: 12px;\n        border-radius: 8px;\n        text-align: center;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="plant-grid">\n      <div class="plant-item">Fern</div>\n      <div class="plant-item">Willow</div>\n      <div class="plant-item">Bamboo</div>\n      <div class="plant-item">Cherry</div>\n      <div class="plant-item">Birch</div>\n      <div class="plant-item">Pine</div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'flex-wrap:wrap',
          label: 'Items are allowed to wrap',
        },
        {
          type: 'styleIncludes',
          text: 'gap:12px',
          label: 'There is a 12px gap between items',
        },
        {
          type: 'styleIncludes',
          text: 'width:140px',
          label: 'Each plant item has a defined width',
        },
      ],
    },
  },
  {
    id: 'css-flex-anim-4',
    blocks: [
      {
        type: 'p',
        text: 'The flex shorthand controls how items grow and shrink to fill available space. It takes up to three values: flex-grow (how much extra space to claim), flex-shrink (how much to give up when space is tight), and flex-basis (the starting size before growing or shrinking).',
      },
      {
        type: 'code',
        text: '.sidebar  { flex: 0 0 240px; }  /* fixed: no grow, no shrink, 240px */\n.main     { flex: 1; }           /* flex: 1 0 0 — claims all leftover space */\n.badge    { flex: 0 0 auto; }    /* shrinks to content, never grows */\n',
      },
      {
        type: 'p',
        text: 'flex: 1 is the most useful value day-to-day. Put it on one item in a row and that item swallows all the remaining space, pushing everything else to its natural size. It is the secret behind sidebars that fill the page while a fixed-width navigation stays stable beside them.',
      },
      {
        type: 'tip',
        text: 'align-self on an individual item overrides the container\'s align-items for just that one child — handy when one item needs to stretch while the others stay centered.',
      },
    ],
    exercise: {
      instructions:
        'In the two-column layout below, give .sidebar a flex value of "0 0 180px" (fixed width) and give .content a flex value of "1" (fill the rest).',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .layout {\n        display: flex;\n        gap: 16px;\n        background: #f5f5f0;\n        padding: 16px;\n      }\n      .sidebar {\n        background: #c8e6c9;\n        padding: 12px;\n        /* your css here */\n      }\n      .content {\n        background: white;\n        padding: 12px;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="layout">\n      <aside class="sidebar">Tree types</aside>\n      <main class="content">Select a tree to learn more about it.</main>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'flex:00180px',
          label: 'The sidebar has a fixed 180px flex basis',
        },
        {
          type: 'styleIncludes',
          text: 'flex:1',
          label: 'The content area grows to fill space',
        },
      ],
    },
  },
  {
    id: 'css-flex-anim-5',
    blocks: [
      {
        type: 'p',
        text: 'A navigation bar is one of the most common uses for Flexbox. The items in a nav need to sit in a row, align vertically, and space themselves out cleanly. Some nav designs push a logo to the left and all the links to the right — exactly what space-between delivers.',
      },
      {
        type: 'p',
        text: 'For the capstone, build a full nav bar: a logo on the left, navigation links spread with space-between, and the whole bar vertically centered. Add a highlight class on the active link using a different color. Everything you have learned about containers, alignment, and gaps applies here.',
      },
      {
        type: 'tip',
        text: 'Wrap the nav links in their own flex container with gap so the links stay grouped on the right while the logo stays on the left.',
      },
    ],
    exercise: {
      instructions:
        'Build the nav bar: give .navbar display flex, justify-content space-between, and align-items center. Give .nav-links display flex and a gap of "24px". Style the .active link with color "seagreen" and font-weight bold.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .navbar {\n        background: #1a2e1a;\n        padding: 0 24px;\n        height: 56px;\n        /* your css here */\n      }\n      .logo { color: #a5d6a7; font-weight: bold; }\n      .nav-links {\n        list-style: none;\n        margin: 0; padding: 0;\n        /* your css here */\n      }\n      .nav-links a { color: #ccc; text-decoration: none; }\n      .nav-links a.active {\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <nav class="navbar">\n      <span class="logo">Sprout</span>\n      <ul class="nav-links">\n        <li><a href="#">Grove</a></li>\n        <li><a href="#" class="active">Learn</a></li>\n        <li><a href="#">Profile</a></li>\n      </ul>\n    </nav>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'justify-content:space-between',
          label: 'Logo and links are on opposite sides',
        },
        {
          type: 'styleIncludes',
          text: 'align-items:center',
          label: 'Nav content is vertically centered',
        },
        {
          type: 'styleIncludes',
          text: 'font-weight:bold',
          label: 'The active link is bold',
        },
      ],
    },
  },
];

export default lessons;
