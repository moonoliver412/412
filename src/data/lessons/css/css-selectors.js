// Topic: Selectors & Colors (css-selectors) — 5 lessons.

const lessons = [
  {
    id: 'css-selectors-1',
    blocks: [
      {
        type: 'p',
        text: 'HTML builds the skeleton. CSS paints it. CSS is a stylesheet language — a list of rules that tell the browser which elements to style and how. Every rule has two halves: a selector that picks the elements, and a declaration block that says how they should look.',
      },
      {
        type: 'p',
        text: 'The most direct way to connect CSS to a page is a <link> tag in the <head>, pointing to a .css file. For quick experiments, a <style> block inside <head> works too. That is what you will use in these exercises, so you can see everything in one place.',
      },
      {
        type: 'code',
        text: '<head>\n  <style>\n    h1 {\n      color: forestgreen;\n      font-size: 2rem;\n    }\n  </style>\n</head>',
      },
      {
        type: 'p',
        text: 'Read that rule aloud: "For every h1, set the color to forestgreen and the font-size to 2rem." The selector is h1. The declarations — the property: value pairs — sit between the braces. Each declaration ends with a semicolon. Forgetting it is the most common mistake.',
      },
      {
        type: 'tip',
        text: 'One selector, many declarations. You can add as many property: value pairs as you like inside a single rule block.',
      },
    ],
    exercise: {
      instructions:
        'Inside the <style> block, write a CSS rule that targets h1 elements and sets their color to "steelblue".',
      hints: [
        'A CSS rule looks like: selector { property: value; } — start by writing h1 { }.',
        'Write h1 { color: steelblue; } inside the style block.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your css here */\n    </style>\n  </head>\n  <body>\n    <h1>My Garden</h1>\n    <p>Where everything grows.</p>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      h1 {\n        color: steelblue;\n      }\n    </style>\n  </head>\n  <body>\n    <h1>My Garden</h1>\n    <p>Where everything grows.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'h1',
          label: 'Your stylesheet targets h1',
          hint: 'Write a rule that starts with h1 { ... }.',
        },
        {
          type: 'styleIncludes',
          text: 'color:steelblue',
          label: 'The heading color is steelblue',
          hint: 'Inside the h1 rule, set color: steelblue.',
        },
      ],
    },
  },
  {
    id: 'css-selectors-2',
    blocks: [
      {
        type: 'p',
        text: 'Type selectors like h1 or p grab every element of that kind. That is useful, but sometimes too broad. When you need to style one specific element, use an id selector — write a # before the name. When you want to style a group of related elements, use a class selector — write a dot before the name.',
      },
      {
        type: 'code',
        text: '/* targets the single element with id="banner" */\n#banner { background: gold; }\n\n/* targets every element with class="highlight" */\n.highlight { font-weight: bold; color: darkorange; }',
      },
      {
        type: 'p',
        text: 'An id must be unique on the page — only one element can own it. A class is reusable. You can put class="highlight" on many elements and the style applies to all of them. In everyday CSS, classes do most of the work. Ids are mainly used for JavaScript and anchor links.',
      },
      {
        type: 'tip',
        text: 'One element can have multiple classes: class="card highlight featured". Each class in the list applies its styles on its own.',
      },
    ],
    exercise: {
      instructions:
        'Style the page below: give the element with id="sprout" a color of "seagreen", and give all elements with class="note" an italic font style.',
      hints: [
        'Use #sprout to target the element by id and .note to target elements by class.',
        'Write #sprout { color: seagreen; } and .note { font-style: italic; } in the style block.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your css here */\n    </style>\n  </head>\n  <body>\n    <h2 id="sprout">Little Sprout</h2>\n    <p class="note">Planted on Monday.</p>\n    <p class="note">First leaf by Friday.</p>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      #sprout {\n        color: seagreen;\n      }\n      .note {\n        font-style: italic;\n      }\n    </style>\n  </head>\n  <body>\n    <h2 id="sprout">Little Sprout</h2>\n    <p class="note">Planted on Monday.</p>\n    <p class="note">First leaf by Friday.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '#sprout',
          label: 'The #sprout id is targeted',
          hint: 'Target the element with #sprout { ... }.',
        },
        {
          type: 'styleIncludes',
          text: 'color:seagreen',
          label: 'The sprout heading is seagreen',
        },
        {
          type: 'styleIncludes',
          text: 'font-style:italic',
          label: 'The .note paragraphs are italic',
          hint: 'Add .note { font-style: italic; } to your stylesheet.',
        },
      ],
    },
  },
  {
    id: 'css-selectors-3',
    blocks: [
      {
        type: 'p',
        text: 'Color is one of the first things you will want to change. CSS gives you several ways to write a color. Keywords like "tomato" or "cornflowerblue" are easy to remember. Hex codes like #3a7d44 pack red, green, and blue values into six digits. The rgb() and hsl() functions give you more control.',
      },
      {
        type: 'code',
        text: '/* all four say "a gentle sage green" */\ncolor: mediumseagreen;\ncolor: #3cb371;\ncolor: rgb(60, 179, 113);\ncolor: hsl(146, 50%, 47%);',
      },
      {
        type: 'p',
        text: 'HSL stands for hue, saturation, lightness. It is the easiest format for tweaking. Hue is the position on the color wheel (0–360). Saturation is how vivid the color is (0% is grey). Lightness is how bright (0% is black, 100% is white). Change just the lightness to get a darker or lighter version of the same color.',
      },
      {
        type: 'tip',
        text: 'Your browser\'s dev tools have a color picker built into the CSS inspector. Click any color swatch to open it and try colors live.',
      },
    ],
    exercise: {
      instructions:
        'Make the leaf card stand out: set the background-color to a hex color of your choice (any valid 6-digit hex like #4a9e6b) and set the text color to white.',
      hints: [
        'A hex color starts with # and has six characters, like #4a9e6b — pick any you like.',
        'Add background-color: #4a9e6b (or another hex) and color: white to .leaf-card.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .leaf-card {\n        padding: 1rem;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="leaf-card">\n      <h2>Fern Leaf</h2>\n      <p>Found near the willow.</p>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .leaf-card {\n        padding: 1rem;\n        background-color: #4a9e6b;\n        color: white;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="leaf-card">\n      <h2>Fern Leaf</h2>\n      <p>Found near the willow.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'background-color:#',
          label: 'A hex background-color is set on the card',
          hint: 'Set background-color to any 6-digit hex color like #4a9e6b.',
        },
        {
          type: 'styleIncludes',
          text: 'color:white',
          label: 'The text color is white',
          hint: 'Add color: white to .leaf-card.',
        },
      ],
    },
  },
  {
    id: 'css-selectors-4',
    blocks: [
      {
        type: 'p',
        text: 'Typography means styling text so it is easy to read. Three properties do most of the work. font-size controls how big the text is. font-weight controls thickness (bold or normal). line-height sets the space between lines.',
      },
      {
        type: 'code',
        text: 'body {\n  font-family: Georgia, serif;\n  font-size: 1rem;     /* 1rem = the browser default (16px) */\n  line-height: 1.6;    /* unitless: 1.6 × the font-size */\n}\n\nh1 {\n  font-size: 2.5rem;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n}',
      },
      {
        type: 'p',
        text: 'Use rem or em instead of px for font sizes. They scale with the reader\'s browser settings. A line-height with no unit is a multiplier of the current font size — that is almost always what you want. Values between 1.4 and 1.8 keep long paragraphs comfortable to read.',
      },
      {
        type: 'tip',
        text: 'Set font-family on body and it flows down to every element automatically. Only change it where you truly want a different font.',
      },
    ],
    exercise: {
      instructions:
        'Style the journal page below: give the body a font-size of 1rem and a line-height of 1.6, and give the h1 a font-size of 2rem.',
      hints: [
        'You need two separate rules: one for body and one for h1.',
        'Write body { font-size: 1rem; line-height: 1.6; } and h1 { font-size: 2rem; } in the style block.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your css here */\n    </style>\n  </head>\n  <body>\n    <h1>Garden Journal</h1>\n    <p>Today I spotted the first bud on the cherry tree. It is small and pale pink, no bigger than a fingernail.</p>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      body {\n        font-size: 1rem;\n        line-height: 1.6;\n      }\n      h1 {\n        font-size: 2rem;\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Garden Journal</h1>\n    <p>Today I spotted the first bud on the cherry tree. It is small and pale pink, no bigger than a fingernail.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'line-height:1.6',
          label: 'Body line-height is 1.6',
          hint: 'Add line-height: 1.6 inside the body rule.',
        },
        {
          type: 'styleIncludes',
          text: 'font-size:2rem',
          label: 'The h1 has a 2rem font size',
          hint: 'Write h1 { font-size: 2rem; }.',
        },
      ],
    },
  },
  {
    id: 'css-selectors-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put selectors and colors together on a real page. You know element selectors, class and id selectors, color values, and the key typography properties. A few rules is enough to turn a plain HTML page into something that looks designed.',
      },
      {
        type: 'p',
        text: 'Work top to bottom through your HTML. Start with body defaults — font, line-height, background. Then style each heading. Then adjust specific classes. The cascade helps: base rules flow down to every element, and more specific rules only change what they need to.',
      },
      {
        type: 'tip',
        text: 'Pick two colors that work together — a background and an accent. Keep fonts to one or two. The result will look more polished than you expect.',
      },
    ],
    exercise: {
      instructions:
        'Style the seed shop page: give the body a background-color of "#f5f0e8" and a font-size of 1rem; give elements with class "product" a color of "#2d5a27" and a font-weight of bold; give the footer a color of "#888".',
      hints: [
        'Write three separate rules: one for body, one for .product, and one for footer.',
        'Set body { background-color: #f5f0e8; font-size: 1rem; }, .product { color: #2d5a27; font-weight: bold; }, footer { color: #888; }.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your css here */\n    </style>\n  </head>\n  <body>\n    <h1>Sprout Seed Shop</h1>\n    <p class="product">Lavender seeds — £2.50</p>\n    <p class="product">Fern spores — £3.00</p>\n    <footer>\n      <p>© 2026 Sprout Shop</p>\n    </footer>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      body {\n        background-color: #f5f0e8;\n        font-size: 1rem;\n      }\n      .product {\n        color: #2d5a27;\n        font-weight: bold;\n      }\n      footer {\n        color: #888;\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Sprout Seed Shop</h1>\n    <p class="product">Lavender seeds — £2.50</p>\n    <p class="product">Fern spores — £3.00</p>\n    <footer>\n      <p>© 2026 Sprout Shop</p>\n    </footer>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'background-color:#f5f0e8',
          label: 'The page has the warm cream background',
          hint: 'Add background-color: #f5f0e8 to the body rule.',
        },
        {
          type: 'styleIncludes',
          text: 'color:#2d5a27',
          label: 'Product text is forest green',
          hint: 'Add color: #2d5a27 to the .product rule.',
        },
        {
          type: 'styleIncludes',
          text: 'color:#888',
          label: 'The footer text is muted grey',
        },
      ],
    },
  },
];

export default lessons;
