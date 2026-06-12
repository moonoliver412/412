// Topic: Box Model & Layout (css-box-layout) — 5 lessons.

const lessons = [
  {
    id: 'css-box-layout-1',
    blocks: [
      {
        type: 'p',
        text: 'Every element on a web page is a rectangular box — even text, even circles. Understanding the box model means understanding exactly how big that box is and where it sits. The box has four layers: content at the centre, then padding around it, then a border around that, then margin pushing other boxes away.',
      },
      {
        type: 'code',
        text: '.card {\n  width: 300px;        /* content width */\n  padding: 20px;       /* space inside the border */\n  border: 2px solid #ccc;\n  margin: 16px;        /* space outside the border */\n}',
      },
      {
        type: 'p',
        text: 'By default, width and height measure only the content box. A 300px-wide element with 20px padding ends up 340px wide on screen — which surprises everyone. The fix is one line added to every project: box-sizing: border-box makes width include the padding and border, so 300px always means 300px total.',
      },
      {
        type: 'tip',
        text: 'Add "*, *::before, *::after { box-sizing: border-box; }" to the top of every stylesheet. It is the single most useful reset in CSS.',
      },
    ],
    exercise: {
      instructions:
        'Give the .card a width of 280px, padding of 24px, and a border of "2px solid #aaa". Add box-sizing: border-box so the card stays 280px wide.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <h2>Seed Packet</h2>\n      <p>Sow in spring, harvest in summer.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'width:280px',
          label: 'The card has a 280px width',
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
        },
      ],
    },
  },
  {
    id: 'css-box-layout-2',
    blocks: [
      {
        type: 'p',
        text: 'Margin, padding, and border each accept between one and four values. One value sets all four sides at once. Two values set vertical (top/bottom) then horizontal (left/right). Four values go clockwise: top, right, bottom, left. Knowing this shorthand cuts down on repetition.',
      },
      {
        type: 'code',
        text: '/* all four sides */\nmargin: 16px;\n\n/* top+bottom | left+right */\npadding: 12px 24px;\n\n/* top | right | bottom | left */\nborder-width: 1px 2px 1px 0;',
      },
      {
        type: 'p',
        text: 'Borders also have individual style, width, and color properties. The shorthand border: 2px dashed coral sets all three at once. You can mix-and-match: border-bottom: 3px solid seagreen gives a single accent line under an element — a classic design trick for section headings.',
      },
      {
        type: 'tip',
        text: 'Margin collapse: when two vertical margins meet (a paragraph\'s bottom margin and the next paragraph\'s top margin), they merge into the larger of the two rather than adding. Padding and borders never collapse.',
      },
    ],
    exercise: {
      instructions:
        'Give the .section a padding of "16px 32px" (vertical then horizontal) and a border-bottom of "3px solid seagreen". Add a margin-bottom of 24px to separate it from the next section.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .section {\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="section">\n      <h2>Watering Guide</h2>\n      <p>Water deeply and infrequently.</p>\n    </div>\n    <div class="section">\n      <h2>Pruning Guide</h2>\n      <p>Cut just above a leaf node.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'padding:16px32px',
          label: 'Padding is 16px vertical, 32px horizontal',
        },
        {
          type: 'styleIncludes',
          text: 'border-bottom:3pxsolidseagreen',
          label: 'The section has a seagreen bottom border',
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
        text: 'The display property decides how an element participates in the page flow. Block elements (div, p, h1) take up the full width and stack vertically. Inline elements (span, a, strong) flow with the text and only take the space they need. Inline-block sits between the two: it flows inline but accepts width and height.',
      },
      {
        type: 'code',
        text: '.tag {\n  display: inline-block;\n  padding: 4px 10px;\n  background: sage;\n  border-radius: 4px;\n}',
      },
      {
        type: 'p',
        text: 'Position gives you escape hatches from normal flow. position: relative nudges an element from where it would normally sit, without disturbing its neighbours. position: absolute removes it from flow entirely and places it relative to the nearest positioned ancestor. position: fixed pins it to the viewport so it stays put when the page scrolls.',
      },
      {
        type: 'tip',
        text: 'An absolutely positioned element needs a positioned ancestor to anchor to. If none exists it anchors to the page root. Add position: relative to the parent to contain it.',
      },
    ],
    exercise: {
      instructions:
        'Give the .badge a display of "inline-block", a background-color of "seagreen", and a color of "white". Position the .container as "relative" so it can contain positioned children.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .container {\n        /* your css here */\n      }\n      .badge {\n        padding: 4px 12px;\n        border-radius: 4px;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="container">\n      <h2>Cherry Tree <span class="badge">New</span></h2>\n      <p>Just added to the grove.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'display:inline-block',
          label: 'The badge is inline-block',
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
        },
      ],
    },
  },
  {
    id: 'css-box-layout-4',
    blocks: [
      {
        type: 'p',
        text: 'Cards are one of the most common UI patterns: a self-contained box with an image, a title, and some text. Building a card means combining everything from this topic — sizing, padding, borders, and a dash of border-radius to round off the corners.',
      },
      {
        type: 'code',
        text: '.card {\n  width: 280px;\n  padding: 20px;\n  border: 1px solid #ddd;\n  border-radius: 12px;\n  background: white;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n}',
      },
      {
        type: 'p',
        text: 'box-shadow takes horizontal offset, vertical offset, blur radius, and a color. Keep offsets small and blur generous for a soft, natural look. rgba() lets you use a transparent black, which adapts gracefully to any background color rather than fighting it.',
      },
      {
        type: 'tip',
        text: 'Combine border-radius: 50% with equal width and height to make a perfect circle — handy for avatar images.',
      },
    ],
    exercise: {
      instructions:
        'Style the .plant-card: give it a border-radius of 12px, a background-color of "white", and a box-shadow of "0 2px 8px rgba(0,0,0,0.1)".',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .plant-card {\n        width: 240px;\n        padding: 20px;\n        border: 1px solid #ddd;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="plant-card">\n      <h3>Willow</h3>\n      <p>Loves damp soil and dappled shade.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'border-radius:12px',
          label: 'The card has rounded corners',
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
        },
      ],
    },
  },
  {
    id: 'css-box-layout-5',
    blocks: [
      {
        type: 'p',
        text: 'Stacking context is what determines which element appears on top when boxes overlap. Every element has a z-index of "auto" by default. Set a numeric z-index on any positioned element and it joins the stacking order: higher numbers sit in front, lower numbers sit behind.',
      },
      {
        type: 'code',
        text: '.overlay {\n  position: absolute;\n  top: 0; left: 0;\n  width: 100%; height: 100%;\n  background: rgba(0,0,0,0.5);\n  z-index: 10;\n}\n\n.badge {\n  position: absolute;\n  top: 8px; right: 8px;\n  z-index: 20; /* sits above the overlay */\n}',
      },
      {
        type: 'p',
        text: 'For a capstone challenge, you will build a plant card with an overlaid label. The card is the positioned container, a semi-transparent overlay covers the bottom, and a "New" badge pokes out of the top corner. Box model + positioning + z-index all working together.',
      },
      {
        type: 'tip',
        text: 'z-index only works on positioned elements (anything other than position: static). If your z-index seems to do nothing, check the position property first.',
      },
    ],
    exercise: {
      instructions:
        'Complete the layered card: give .card position "relative" and border-radius "12px". Give .overlay a z-index of 2. Give .corner-badge position "absolute", top "8px", right "8px", and z-index of 3.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        width: 260px;\n        height: 160px;\n        overflow: hidden;\n        background: #c8e6c9;\n        /* your css here */\n      }\n      .overlay {\n        position: absolute;\n        bottom: 0; left: 0;\n        width: 100%;\n        padding: 8px 12px;\n        background: rgba(0,0,0,0.45);\n        color: white;\n        /* your css here */\n      }\n      .corner-badge {\n        background: gold;\n        padding: 4px 8px;\n        border-radius: 4px;\n        font-size: 0.75rem;\n        font-weight: bold;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">\n      <span class="corner-badge">New</span>\n      <div class="overlay">Birch tree — zone 4</div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'position:relative',
          label: 'The card is the positioning context',
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
        },
      ],
    },
  },
];

export default lessons;
