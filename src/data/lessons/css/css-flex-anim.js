// Topic: Flexbox (css-flex-anim) — 5 lessons.

const lessons = [
  {
    id: 'css-flex-anim-1',
    blocks: [
      {
        type: 'p',
        text: 'Before Flexbox, centering something on a page was really hard. Flexbox changed that. Add display: flex to any element and it becomes a flex container. A flex container lines up its direct children in a row, shares the space between them, and lets you align them with a few simple properties.',
      },
      {
        type: 'code',
        text: '.toolbar {\n  display: flex;\n  flex-direction: row;   /* default: children flow left to right */\n  gap: 12px;             /* space between children, no hacks needed */\n}',
      },
      {
        type: 'p',
        text: 'flex-direction controls the main axis — the direction items flow. row (the default) runs left to right. column stacks children top to bottom. The gap property adds equal spacing between items without any margin math.',
      },
      {
        type: 'tip',
        text: 'Only direct children become flex items. Grandchildren are not affected — unless you add display: flex to them too.',
      },
    ],
    exercise: {
      instructions:
        'Turn the .toolbar into a flex container with a flex-direction of "row" and a gap of "16px".',
      hints: [
        'Flexbox starts with one property on the container: display: flex.',
        'Add display: flex, flex-direction: row, and gap: 16px to .toolbar.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .toolbar {\n        background: #eaf4ea;\n        padding: 12px;\n        /* your css here */\n      }\n      .toolbar button { padding: 8px 16px; }\n    </style>\n  </head>\n  <body>\n    <div class="toolbar">\n      <button>Plant</button>\n      <button>Water</button>\n      <button>Harvest</button>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .toolbar {\n        background: #eaf4ea;\n        padding: 12px;\n        display: flex;\n        flex-direction: row;\n        gap: 16px;\n      }\n      .toolbar button { padding: 8px 16px; }\n    </style>\n  </head>\n  <body>\n    <div class="toolbar">\n      <button>Plant</button>\n      <button>Water</button>\n      <button>Harvest</button>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'display:flex',
          label: 'The toolbar is a flex container',
          hint: 'Add display: flex to .toolbar.',
        },
        {
          type: 'styleIncludes',
          text: 'gap:16px',
          label: 'Items have a 16px gap between them',
          hint: 'Add gap: 16px to .toolbar.',
        },
      ],
    },
  },
  {
    id: 'css-flex-anim-2',
    blocks: [
      {
        type: 'p',
        text: 'Two properties do most of the alignment work. justify-content controls how items are spread along the main axis — the direction flex-direction points. align-items controls how they line up on the cross axis, which runs perpendicular to that.',
      },
      {
        type: 'code',
        text: '.card-row {\n  display: flex;\n  justify-content: space-between; /* spread items to the edges */\n  align-items: center;            /* vertically center in the row */\n}',
      },
      {
        type: 'p',
        text: 'The most useful combination is justify-content: center with align-items: center on a container that has a defined height. Anything inside floats to the exact middle. Centering used to take four CSS tricks. Now it takes two lines.',
      },
      {
        type: 'tip',
        text: 'space-between pushes items to opposite ends with equal gaps between them. space-around gives each item equal space on both sides. space-evenly is the same but the edges also get equal space.',
      },
    ],
    exercise: {
      instructions:
        'Make the .hero center its content both horizontally and vertically using justify-content and align-items. The height is already set for you.',
      hints: [
        'justify-content centers along the main axis (horizontal in a row); align-items centers on the cross axis (vertical).',
        'Add justify-content: center and align-items: center to .hero.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero {\n        display: flex;\n        height: 200px;\n        background: #dcedc8;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="hero">\n      <h1>Welcome to the Grove</h1>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero {\n        display: flex;\n        height: 200px;\n        background: #dcedc8;\n        justify-content: center;\n        align-items: center;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="hero">\n      <h1>Welcome to the Grove</h1>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'justify-content:center',
          label: 'Content is centered on the main axis',
          hint: 'Set justify-content: center on .hero.',
        },
        {
          type: 'styleIncludes',
          text: 'align-items:center',
          label: 'Content is centered on the cross axis',
          hint: 'Set align-items: center on .hero.',
        },
      ],
    },
  },
  {
    id: 'css-flex-anim-3',
    blocks: [
      {
        type: 'p',
        text: 'By default, flex items squeeze into one line no matter how many there are. flex-wrap: wrap changes that. When items run out of room, they move to the next line — just like words wrapping in a paragraph.',
      },
      {
        type: 'code',
        text: '.gallery {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.gallery-item {\n  width: 200px;   /* each item holds its size; extras wrap */\n}',
      },
      {
        type: 'p',
        text: 'gap works in both directions when items wrap. It adds space between rows and between columns at the same time. Before gap existed, you had to use tricky margin combinations that were easy to get wrong. Now it is one property.',
      },
      {
        type: 'tip',
        text: 'flex-wrap: wrap-reverse wraps items upward instead of downward. This is useful for chat interfaces where new messages appear at the bottom.',
      },
    ],
    exercise: {
      instructions:
        'Allow the .plant-grid to wrap its items and give it a gap of "12px". Set a width of "140px" on each .plant-item so they wrap naturally.',
      hints: [
        'Add flex-wrap: wrap to the container so items can move to the next line when there is not enough room.',
        'Set flex-wrap: wrap and gap: 12px on .plant-grid, and width: 140px on .plant-item.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .plant-grid {\n        display: flex;\n        /* your css here */\n      }\n      .plant-item {\n        background: #c8e6c9;\n        padding: 12px;\n        border-radius: 8px;\n        text-align: center;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="plant-grid">\n      <div class="plant-item">Fern</div>\n      <div class="plant-item">Willow</div>\n      <div class="plant-item">Bamboo</div>\n      <div class="plant-item">Cherry</div>\n      <div class="plant-item">Birch</div>\n      <div class="plant-item">Pine</div>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .plant-grid {\n        display: flex;\n        flex-wrap: wrap;\n        gap: 12px;\n      }\n      .plant-item {\n        background: #c8e6c9;\n        padding: 12px;\n        border-radius: 8px;\n        text-align: center;\n        width: 140px;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="plant-grid">\n      <div class="plant-item">Fern</div>\n      <div class="plant-item">Willow</div>\n      <div class="plant-item">Bamboo</div>\n      <div class="plant-item">Cherry</div>\n      <div class="plant-item">Birch</div>\n      <div class="plant-item">Pine</div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'flex-wrap:wrap',
          label: 'Items are allowed to wrap',
          hint: 'Add flex-wrap: wrap to .plant-grid.',
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
          hint: 'Add width: 140px to .plant-item.',
        },
      ],
    },
  },
  {
    id: 'css-flex-anim-4',
    blocks: [
      {
        type: 'p',
        text: 'The flex shorthand controls how items grow and shrink. It takes up to three values. flex-grow says how much extra space to claim. flex-shrink says how much to give up when space is tight. flex-basis is the starting size before any growing or shrinking happens.',
      },
      {
        type: 'code',
        text: '.sidebar  { flex: 0 0 240px; }  /* fixed: no grow, no shrink, 240px */\n.main     { flex: 1; }           /* flex: 1 0 0 — claims all leftover space */\n.badge    { flex: 0 0 auto; }    /* shrinks to content, never grows */\n',
      },
      {
        type: 'p',
        text: 'flex: 1 is the most useful value in everyday layouts. Put it on one item in a row and that item claims all the leftover space. Everything else stays its natural size. This is how sidebars fill the page while a fixed navigation bar stays stable beside them.',
      },
      {
        type: 'tip',
        text: 'align-self on a single item overrides the container\'s align-items for just that one child. Use it when one item needs to stretch while the others stay centered.',
      },
    ],
    exercise: {
      instructions:
        'In the two-column layout below, give .sidebar a flex value of "0 0 180px" (fixed width) and give .content a flex value of "1" (fill the rest).',
      hints: [
        'The flex shorthand takes grow, shrink, and basis in that order — "0 0 180px" means no grow, no shrink, start at 180px.',
        'Set flex: 0 0 180px on .sidebar and flex: 1 on .content.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .layout {\n        display: flex;\n        gap: 16px;\n        background: #f5f5f0;\n        padding: 16px;\n      }\n      .sidebar {\n        background: #c8e6c9;\n        padding: 12px;\n        /* your css here */\n      }\n      .content {\n        background: white;\n        padding: 12px;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="layout">\n      <aside class="sidebar">Tree types</aside>\n      <main class="content">Select a tree to learn more about it.</main>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .layout {\n        display: flex;\n        gap: 16px;\n        background: #f5f5f0;\n        padding: 16px;\n      }\n      .sidebar {\n        background: #c8e6c9;\n        padding: 12px;\n        flex: 0 0 180px;\n      }\n      .content {\n        background: white;\n        padding: 12px;\n        flex: 1;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="layout">\n      <aside class="sidebar">Tree types</aside>\n      <main class="content">Select a tree to learn more about it.</main>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'flex:00180px',
          label: 'The sidebar has a fixed 180px flex basis',
          hint: 'Add flex: 0 0 180px to .sidebar.',
        },
        {
          type: 'styleIncludes',
          text: 'flex:1',
          label: 'The content area grows to fill space',
          hint: 'Add flex: 1 to .content.',
        },
      ],
    },
  },
  {
    id: 'css-flex-anim-5',
    blocks: [
      {
        type: 'p',
        text: 'A navigation bar is one of the most common uses for Flexbox. The items need to sit in a row, align vertically, and space out cleanly. Many nav designs push a logo to the left and links to the right. space-between delivers exactly that.',
      },
      {
        type: 'p',
        text: 'For this capstone, build a full nav bar. Put the logo on the left and the navigation links on the right using space-between. Center the whole bar vertically. Highlight the active link with a different color. Everything you have learned about containers, alignment, and gaps applies here.',
      },
      {
        type: 'tip',
        text: 'Put the nav links in their own flex container with gap. That keeps the links grouped on the right while the logo stays on the left.',
      },
    ],
    exercise: {
      instructions:
        'Build the nav bar: give .navbar display flex, justify-content space-between, and align-items center. Give .nav-links display flex and a gap of "24px". Style the .active link with color "seagreen" and font-weight bold.',
      hints: [
        'Make .navbar a flex container first, then make .nav-links its own flex container so the links line up in a row.',
        'Set display: flex, justify-content: space-between, align-items: center on .navbar; display: flex, gap: 24px on .nav-links; and color: seagreen, font-weight: bold on .nav-links a.active.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .navbar {\n        background: #1a2e1a;\n        padding: 0 24px;\n        height: 56px;\n        /* your css here */\n      }\n      .logo { color: #a5d6a7; font-weight: bold; }\n      .nav-links {\n        list-style: none;\n        margin: 0; padding: 0;\n        /* your css here */\n      }\n      .nav-links a { color: #ccc; text-decoration: none; }\n      .nav-links a.active {\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <nav class="navbar">\n      <span class="logo">Sprout</span>\n      <ul class="nav-links">\n        <li><a href="#">Grove</a></li>\n        <li><a href="#" class="active">Learn</a></li>\n        <li><a href="#">Profile</a></li>\n      </ul>\n    </nav>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .navbar {\n        background: #1a2e1a;\n        padding: 0 24px;\n        height: 56px;\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n      }\n      .logo { color: #a5d6a7; font-weight: bold; }\n      .nav-links {\n        list-style: none;\n        margin: 0; padding: 0;\n        display: flex;\n        gap: 24px;\n      }\n      .nav-links a { color: #ccc; text-decoration: none; }\n      .nav-links a.active {\n        color: seagreen;\n        font-weight: bold;\n      }\n    </style>\n  </head>\n  <body>\n    <nav class="navbar">\n      <span class="logo">Sprout</span>\n      <ul class="nav-links">\n        <li><a href="#">Grove</a></li>\n        <li><a href="#" class="active">Learn</a></li>\n        <li><a href="#">Profile</a></li>\n      </ul>\n    </nav>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'justify-content:space-between',
          label: 'Logo and links are on opposite sides',
          hint: 'Add justify-content: space-between to .navbar.',
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
          hint: 'Set font-weight: bold on .nav-links a.active.',
        },
      ],
    },
  },
];

export default lessons;
