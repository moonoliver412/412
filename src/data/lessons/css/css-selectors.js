// Topic: Selectors & Colors (css-selectors) — 5 lessons.

const lessons = [
  {
    id: 'css-selectors-1',
    blocks: [
      {
        type: 'p',
        text: 'HTML builds the skeleton; CSS paints it. CSS is a stylesheet language — a list of rules that say "find these elements and apply these styles to them." Every rule has two halves: a selector that targets elements and a declaration block that describes how they should look.',
      },
      {
        type: 'p',
        text: 'The most direct way to connect CSS to an HTML page is a <link> tag in the <head>, pointing to a .css file. For quick experiments a <style> block inside <head> works too — that is what you will use in these exercises, so you can see everything in one place.',
      },
      {
        type: 'code',
        text: '<head>\n  <style>\n    h1 {\n      color: forestgreen;\n      font-size: 2rem;\n    }\n  </style>\n</head>',
      },
      {
        type: 'p',
        text: 'Read that rule aloud: "For every h1, set the color to forestgreen and the font-size to 2rem." The selector is h1. The declarations are the lines between the braces. Each declaration ends with a semicolon — forgetting it is the most common beginner slip.',
      },
      {
        type: 'tip',
        text: 'One selector, many declarations. You can stack as many property: value pairs as you like inside a single rule block.',
      },
    ],
    exercise: {
      instructions:
        'Inside the <style> block, write a CSS rule that targets h1 elements and sets their color to "steelblue".',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your css here */\n    </style>\n  </head>\n  <body>\n    <h1>My Garden</h1>\n    <p>Where everything grows.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'h1',
          label: 'Your stylesheet targets h1',
        },
        {
          type: 'styleIncludes',
          text: 'color:steelblue',
          label: 'The heading color is steelblue',
        },
      ],
    },
  },
  {
    id: 'css-selectors-2',
    blocks: [
      {
        type: 'p',
        text: 'Type selectors like h1 or p grab every element of that kind — useful, but sometimes too broad. When you need to style one particular element, you reach for an id selector, written with a #. When you want to style a group of related elements, you use a class selector, written with a dot.',
      },
      {
        type: 'code',
        text: '/* targets the single element with id="banner" */\n#banner { background: gold; }\n\n/* targets every element with class="highlight" */\n.highlight { font-weight: bold; color: darkorange; }',
      },
      {
        type: 'p',
        text: 'An id must be unique on the page — one element owns it. A class is reusable: you can put class="highlight" on a dozen different elements and the style applies to all of them at once. In day-to-day CSS, classes do the heavy lifting; ids are for JavaScript hooks and anchor links.',
      },
      {
        type: 'tip',
        text: 'A single element can carry multiple classes: class="card highlight featured". Each class in the list applies its styles independently.',
      },
    ],
    exercise: {
      instructions:
        'Style the page below: give the element with id="sprout" a color of "seagreen", and give all elements with class="note" an italic font style.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your css here */\n    </style>\n  </head>\n  <body>\n    <h2 id="sprout">Little Sprout</h2>\n    <p class="note">Planted on Monday.</p>\n    <p class="note">First leaf by Friday.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '#sprout',
          label: 'The #sprout id is targeted',
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
        },
      ],
    },
  },
  {
    id: 'css-selectors-3',
    blocks: [
      {
        type: 'p',
        text: 'Color is one of the first things learners reach for, and CSS gives you several ways to name it. Keywords like "tomato" or "cornflowerblue" are easy to remember. Hex codes like #3a7d44 pack precise red, green, and blue values into six digits. The rgb() and hsl() functions let you describe color more intuitively.',
      },
      {
        type: 'code',
        text: '/* all four say "a gentle sage green" */\ncolor: mediumseagreen;\ncolor: #3cb371;\ncolor: rgb(60, 179, 113);\ncolor: hsl(146, 50%, 47%);',
      },
      {
        type: 'p',
        text: 'HSL — hue, saturation, lightness — is the friendliest for tweaking. Hue is the color wheel position (0–360), saturation is how vivid (0% is grey), and lightness is how bright (0% is black, 100% is white). Nudge just the lightness to make a darker or lighter version of the same hue.',
      },
      {
        type: 'tip',
        text: 'Browser dev tools have a color picker built right into the CSS inspector — click any color swatch to open it and experiment live.',
      },
    ],
    exercise: {
      instructions:
        'Make the leaf card stand out: set the background-color to a hex color of your choice (any valid 6-digit hex like #4a9e6b) and set the text color to white.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .leaf-card {\n        padding: 1rem;\n        /* your css here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="leaf-card">\n      <h2>Fern Leaf</h2>\n      <p>Found near the willow.</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'background-color:#',
          label: 'A hex background-color is set on the card',
        },
        {
          type: 'styleIncludes',
          text: 'color:white',
          label: 'The text color is white',
        },
      ],
    },
  },
  {
    id: 'css-selectors-4',
    blocks: [
      {
        type: 'p',
        text: 'Typography is the art of making text readable and beautiful. Three properties cover most of the ground: font-size controls how big the text is, font-weight controls thickness (bold vs normal), and line-height sets the breathing room between lines.',
      },
      {
        type: 'code',
        text: 'body {\n  font-family: Georgia, serif;\n  font-size: 1rem;     /* 1rem = the browser default (16px) */\n  line-height: 1.6;    /* unitless: 1.6 × the font-size */\n}\n\nh1 {\n  font-size: 2.5rem;\n  font-weight: 700;\n  letter-spacing: -0.02em;\n}',
      },
      {
        type: 'p',
        text: 'Prefer rem and em over px for font sizes — they scale with the user\'s browser preference. A line-height without a unit is a multiplier of the current font size, which is almost always what you want. Anything between 1.4 and 1.8 keeps long paragraphs comfortable to read.',
      },
      {
        type: 'tip',
        text: 'Set font-family on body and it cascades down to every element automatically. Only override it where you genuinely want a different face.',
      },
    ],
    exercise: {
      instructions:
        'Style the journal page below: give the body a font-size of 1rem and a line-height of 1.6, and give the h1 a font-size of 2rem.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your css here */\n    </style>\n  </head>\n  <body>\n    <h1>Garden Journal</h1>\n    <p>Today I spotted the first bud on the cherry tree. It is small and pale pink, no bigger than a fingernail.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'line-height:1.6',
          label: 'Body line-height is 1.6',
        },
        {
          type: 'styleIncludes',
          text: 'font-size:2rem',
          label: 'The h1 has a 2rem font size',
        },
      ],
    },
  },
  {
    id: 'css-selectors-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put selectors and colors together on a real page. You know element selectors, class and id selectors, color values, and the core typography properties. A handful of those rules is enough to transform a plain HTML page into something that feels designed.',
      },
      {
        type: 'p',
        text: 'Work top to bottom through your HTML: start with body defaults (font, line-height, background), then style each section heading, then fine-tune specific classes. Cascade is your friend — base rules inherit down, and more specific rules override only what they need to.',
      },
      {
        type: 'tip',
        text: 'Pick two colors that work together (a background and an accent), keep your font choices to one or two, and you will be surprised how polished the result looks.',
      },
    ],
    exercise: {
      instructions:
        'Style the seed shop page: give the body a background-color of "#f5f0e8" and a font-size of 1rem; give elements with class "product" a color of "#2d5a27" and a font-weight of bold; give the footer a color of "#888".',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your css here */\n    </style>\n  </head>\n  <body>\n    <h1>Sprout Seed Shop</h1>\n    <p class="product">Lavender seeds — £2.50</p>\n    <p class="product">Fern spores — £3.00</p>\n    <footer>\n      <p>© 2026 Sprout Shop</p>\n    </footer>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'background-color:#f5f0e8',
          label: 'The page has the warm cream background',
        },
        {
          type: 'styleIncludes',
          text: 'color:#2d5a27',
          label: 'Product text is forest green',
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
