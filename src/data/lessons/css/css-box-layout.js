// Topic: Box Model & Layout (css-box-layout) — 5 lessons.

const lessons = [
  {
    id: 'css-box-layout-1',
    blocks: [
      {
        type: 'p',
        text: 'Every element on a web page is a rectangle — even text, even circles. The box model describes how big that box is. It has four layers: content in the middle, padding (space inside the border) around it, the border itself, then margin (space outside the border) pushing other boxes away.',
      },
      {
        type: 'code',
        text: '.card {\n  width: 300px;        /* content width */\n  padding: 20px;       /* space inside the border */\n  border: 2px solid #ccc;\n  margin: 16px;        /* space outside the border */\n}',
      },
      {
        type: 'p',
        text: 'By default, width only counts the content. So a 300px element with 20px padding ends up 340px wide on screen. That surprises a lot of people. The fix: box-sizing: border-box makes width include the padding and border. Now 300px always means 300px total.',
      },
      {
        type: 'tip',
        text: 'Add "*, *::before, *::after { box-sizing: border-box; }" to the top of every stylesheet. It\'s the most useful one-liner in CSS.',
      },
    ],
    exercise: {
      instructions:
        'Give the .card a width of 280px, a padding of 24px, and a border of "2px solid #aaa". Add box-sizing: border-box so the card stays 280px wide.',
      hints: [
        'You need four properties on .card: width, padding, border, and box-sizing.',
        'Set width: 280px, padding: 24px, border: 2px solid #aaa, and box-sizing: border-box on .card.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <h2>Seed Packet</h2>\n      <p>Sow in spring, harvest in summer.</p>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        width: 280px;\n        padding: 24px;\n        border: 2px solid #aaa;\n        box-sizing: border-box;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <h2>Seed Packet</h2>\n      <p>Sow in spring, harvest in summer.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'width:280px',
          label: 'The card has a 280px width',
          hint: 'Add width: 280px to .card.',
        },
        {
          type: 'styleIncludes',
          text: 'padding:24px',
          label: 'The card has 24px padding',
        },
        {
          type: 'styleIncludes',
          text: 'box-sizing:border-box',
          label: 'box-sizing keeps the width predictable',
          hint: 'Add box-sizing: border-box so padding does not add to the width.',
        },
      ],
    },
  },
  {
    id: 'css-box-layout-2',
    blocks: [
      {
        type: 'p',
        text: 'Margin, padding, and border each accept one to four values. One value sets all four sides. Two values set top/bottom then left/right. Four values go clockwise: top, right, bottom, left. This shorthand cuts down on repetition.',
      },
      {
        type: 'code',
        text: '/* all four sides */\nmargin: 16px;\n\n/* top+bottom | left+right */\npadding: 12px 24px;\n\n/* top | right | bottom | left */\nborder-width: 1px 2px 1px 0;',
      },
      {
        type: 'p',
        text: 'Borders have individual style, width, and color properties. The shorthand border: 2px dashed coral sets all three at once. You can mix them: border-bottom: 3px solid seagreen gives one accent line under an element. That\'s a classic look for section headings.',
      },
      {
        type: 'tip',
        text: 'Margin collapse: when two vertical margins meet (like a paragraph\'s bottom and the next paragraph\'s top), they merge into the larger one instead of adding together. Padding and borders never collapse.',
      },
    ],
    exercise: {
      instructions:
        'Give the .section a padding of "16px 32px" (top/bottom then left/right), a border-bottom of "3px solid seagreen", and a margin-bottom of 24px.',
      hints: [
        'Padding shorthand with two values sets top/bottom first, then left/right.',
        'Set padding: 16px 32px, border-bottom: 3px solid seagreen, and margin-bottom: 24px on .section.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .section {\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="section">\n      <h2>Watering Guide</h2>\n      <p>Water deeply and infrequently.</p>\n    </div>\n    <div class="section">\n      <h2>Pruning Guide</h2>\n      <p>Cut just above a leaf node.</p>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .section {\n        padding: 16px 32px;\n        border-bottom: 3px solid seagreen;\n        margin-bottom: 24px;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="section">\n      <h2>Watering Guide</h2>\n      <p>Water deeply and infrequently.</p>\n    </div>\n    <div class="section">\n      <h2>Pruning Guide</h2>\n      <p>Cut just above a leaf node.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'padding:16px32px',
          label: 'Padding is 16px vertical, 32px horizontal',
          hint: 'Use padding: 16px 32px — two values separated by a space.',
        },
        {
          type: 'styleIncludes',
          text: 'border-bottom:3pxsolidseagreen',
          label: 'The section has a seagreen bottom border',
          hint: 'Set border-bottom: 3px solid seagreen on .section.',
        },
        {
          type: 'styleIncludes',
          text: 'margin-bottom:24px',
          label: 'Sections have space below them',
        },
      ],
    },
  },
  {
    id: 'css-box-layout-3',
    blocks: [
      {
        type: 'p',
        text: 'The display property controls how an element fits into the page. Block elements (div, p, h1) take the full width and stack vertically. Inline elements (span, a, strong) flow with the text and take only the space they need. inline-block sits between: it flows with text but still accepts width and height.',
      },
      {
        type: 'code',
        text: '.tag {\n  display: inline-block;\n  padding: 4px 10px;\n  background: sage;\n  border-radius: 4px;\n}',
      },
      {
        type: 'p',
        text: 'The position property lets you move elements out of the normal flow. position: relative nudges an element from where it would normally sit, without moving its neighbors. position: absolute pulls it out of the flow and places it inside the nearest positioned ancestor. position: fixed pins it to the screen so it stays put when you scroll.',
      },
      {
        type: 'tip',
        text: 'An absolutely positioned element anchors to the nearest ancestor that has a position set. If none exists, it anchors to the page itself. Add position: relative to the parent to keep it contained.',
      },
    ],
    exercise: {
      instructions:
        'Give the .badge a display of "inline-block", a background-color of "seagreen", and a color of "white". Give the .container position: relative so it can hold positioned children.',
      hints: [
        'You need two selectors: .container gets position, and .badge gets display, background-color, and color.',
        'Set position: relative on .container, then display: inline-block, background-color: seagreen, and color: white on .badge.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .container {\n        /* your css here */\n      }\n      .badge {\n        padding: 4px 12px;\n        border-radius: 4px;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="container">\n      <h2>Cherry Tree <span class="badge">New</span></h2>\n      <p>Just added to the grove.</p>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .container {\n        position: relative;\n      }\n      .badge {\n        padding: 4px 12px;\n        border-radius: 4px;\n        display: inline-block;\n        background-color: seagreen;\n        color: white;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="container">\n      <h2>Cherry Tree <span class="badge">New</span></h2>\n      <p>Just added to the grove.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'display:inline-block',
          label: 'The badge is inline-block',
          hint: 'Add display: inline-block to .badge.',
        },
        {
          type: 'styleIncludes',
          text: 'background-color:seagreen',
          label: 'The badge has a seagreen background',
        },
        {
          type: 'styleIncludes',
          text: 'position:relative',
          label: 'The container is relatively positioned',
          hint: 'Add position: relative to .container.',
        },
      ],
    },
  },
  {
    id: 'css-box-layout-4',
    blocks: [
      {
        type: 'p',
        text: 'A card is a self-contained box with a title, some text, and maybe an image. It\'s one of the most common patterns on the web. Building one uses everything from this topic: sizing, padding, borders, and border-radius to round the corners.',
      },
      {
        type: 'code',
        text: '.card {\n  width: 280px;\n  padding: 20px;\n  border: 1px solid #ddd;\n  border-radius: 12px;\n  background: white;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n}',
      },
      {
        type: 'p',
        text: 'box-shadow takes horizontal offset, vertical offset, blur radius, and a color. Keep offsets small and blur generous for a soft look. rgba() lets you use a semi-transparent black. That adapts to any background color instead of clashing with it.',
      },
      {
        type: 'tip',
        text: 'Use border-radius: 50% with equal width and height to make a perfect circle. That\'s how avatar images get their round shape.',
      },
    ],
    exercise: {
      instructions:
        'Style the .plant-card: give it a border-radius of 12px, a background-color of "white", and a box-shadow of "0 2px 8px rgba(0,0,0,0.1)".',
      hints: [
        'Add three properties to .plant-card: border-radius, background-color, and box-shadow.',
        'Set border-radius: 12px, background-color: white, and box-shadow: 0 2px 8px rgba(0,0,0,0.1) on .plant-card.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .plant-card {\n        width: 240px;\n        padding: 20px;\n        border: 1px solid #ddd;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="plant-card">\n      <h3>Willow</h3>\n      <p>Loves damp soil and dappled shade.</p>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .plant-card {\n        width: 240px;\n        padding: 20px;\n        border: 1px solid #ddd;\n        border-radius: 12px;\n        background-color: white;\n        box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n      }\n    </style>\n  </head>\n  <body>\n    <div class="plant-card">\n      <h3>Willow</h3>\n      <p>Loves damp soil and dappled shade.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'border-radius:12px',
          label: 'The card has rounded corners',
          hint: 'Add border-radius: 12px to .plant-card.',
        },
        {
          type: 'styleIncludes',
          text: 'background-color:white',
          label: 'The card has a white background',
        },
        {
          type: 'styleIncludes',
          text: 'box-shadow:',
          label: 'The card has a shadow',
          hint: 'Add box-shadow: 0 2px 8px rgba(0,0,0,0.1) to .plant-card.',
        },
      ],
    },
  },
  {
    id: 'css-box-layout-5',
    blocks: [
      {
        type: 'p',
        text: 'When boxes overlap, something has to be on top. z-index (a number you set) controls that order. Higher numbers sit in front, lower numbers sit behind. z-index only works on positioned elements — anything with position set to relative, absolute, or fixed.',
      },
      {
        type: 'code',
        text: '.overlay {\n  position: absolute;\n  top: 0; left: 0;\n  width: 100%; height: 100%;\n  background: rgba(0,0,0,0.5);\n  z-index: 10;\n}\n\n.badge {\n  position: absolute;\n  top: 8px; right: 8px;\n  z-index: 20; /* sits above the overlay */\n}',
      },
      {
        type: 'p',
        text: 'You\'ll build a plant card with a layered label. The card is the positioned container. A semi-transparent overlay covers the bottom. A "New" badge sits in the top corner. Box model, positioning, and z-index — all working together.',
      },
      {
        type: 'tip',
        text: 'z-index only works on positioned elements — anything other than position: static (the default). If your z-index does nothing, check that the element has a position set.',
      },
    ],
    exercise: {
      instructions:
        'Complete the layered card: give .card position "relative" and border-radius "12px". Give .overlay a z-index of 2. Give .corner-badge position "absolute", top "8px", right "8px", and z-index of 3 so it sits above the overlay.',
      hints: [
        'z-index only works on elements that have a position set — make sure .card, .overlay, and .corner-badge each have one.',
        'Add position: relative and border-radius: 12px to .card; z-index: 2 to .overlay; and position: absolute, top: 8px, right: 8px, z-index: 3 to .corner-badge.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        width: 260px;\n        height: 160px;\n        overflow: hidden;\n        background: #c8e6c9;\n        /* your css here */\n      }\n      .overlay {\n        position: absolute;\n        bottom: 0; left: 0;\n        width: 100%;\n        padding: 8px 12px;\n        background: rgba(0,0,0,0.45);\n        color: white;\n        /* your css here */\n      }\n      .corner-badge {\n        background: gold;\n        padding: 4px 8px;\n        border-radius: 4px;\n        font-size: 0.75rem;\n        font-weight: bold;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <span class="corner-badge">New</span>\n      <div class="overlay">Birch tree — zone 4</div>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        width: 260px;\n        height: 160px;\n        overflow: hidden;\n        background: #c8e6c9;\n        position: relative;\n        border-radius: 12px;\n      }\n      .overlay {\n        position: absolute;\n        bottom: 0; left: 0;\n        width: 100%;\n        padding: 8px 12px;\n        background: rgba(0,0,0,0.45);\n        color: white;\n        z-index: 2;\n      }\n      .corner-badge {\n        background: gold;\n        padding: 4px 8px;\n        border-radius: 4px;\n        font-size: 0.75rem;\n        font-weight: bold;\n        position: absolute;\n        top: 8px;\n        right: 8px;\n        z-index: 3;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <span class="corner-badge">New</span>\n      <div class="overlay">Birch tree — zone 4</div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'position:relative',
          label: 'The card is the positioning context',
          hint: 'Add position: relative to .card so child elements can anchor to it.',
        },
        {
          type: 'styleIncludes',
          text: 'z-index:2',
          label: 'The overlay has z-index 2',
        },
        {
          type: 'styleIncludes',
          text: 'position:absolute',
          label: 'The badge is absolutely positioned',
          hint: 'Set position: absolute on .corner-badge, then use top and right to place it.',
        },
      ],
    },
  },
];

export default lessons;
