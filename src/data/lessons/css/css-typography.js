// Topic: Typography & Fonts (css-typography) — 5 lessons.

const lessons = [
  {
    id: 'css-typography-1',
    blocks: [
      {
        type: 'p',
        text: 'Every browser ships with a handful of built-in fonts — Times New Roman, Arial, Georgia — but they were chosen for safety, not beauty. Web fonts let you load any typeface you like; the browser downloads it the first time a visitor arrives and caches it for next time.',
      },
      {
        type: 'p',
        text: 'The font-family property accepts a comma-separated list. The browser tries each name in order and uses the first one it can find. The last entry should always be a generic keyword — serif, sans-serif, or monospace — so there is always a sensible fallback if every named font fails to load.',
      },
      {
        type: 'code',
        text: 'body {\n  font-family: "Lato", "Helvetica Neue", Arial, sans-serif;\n}\n\ncode {\n  font-family: "Fira Code", "Courier New", monospace;\n}',
      },
      {
        type: 'tip',
        text: 'Font names with spaces must be wrapped in quotes. Single-word names like Arial do not need them, but quoting them is harmless and consistent.',
      },
    ],
    exercise: {
      instructions:
        'Set the body font stack to Georgia, "Times New Roman", and the serif fallback — in that order. Then give the code element a monospace stack.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      body {\n        /* your font-family here */\n      }\n      code {\n        /* your monospace stack here */\n      }\n    </style>\n  </head>\n  <body>\n    <p>Plant <code>seeds.js</code> in good soil.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'font-family:',
          label: 'font-family is declared',
        },
        {
          type: 'styleIncludes',
          text: 'serif',
          label: 'A serif fallback appears in the stack',
        },
        {
          type: 'styleIncludes',
          text: 'monospace',
          label: 'The code element gets a monospace stack',
        },
      ],
    },
  },
  {
    id: 'css-typography-2',
    blocks: [
      {
        type: 'p',
        text: 'Once you have a font family, you shape it with three properties that do most of the heavy lifting: font-size, font-weight, and line-height. Get these three right and even a default system font starts to look intentional.',
      },
      {
        type: 'code',
        text: 'p {\n  font-size: 1rem;      /* 1× the root font size, usually 16px */\n  font-weight: 400;     /* normal; 700 = bold; 300 = light */\n  line-height: 1.6;     /* unitless: 1.6× the font-size */\n}',
      },
      {
        type: 'p',
        text: 'Line-height is the secret of readable text. Below 1.4 lines feel cramped; above 2.0 they feel scattered. For body text, 1.5–1.7 is the comfortable sweet spot. Notice that line-height here has no unit — a unitless value is relative to the element\'s own font-size, which is exactly what you want when nesting.',
      },
      {
        type: 'tip',
        text: 'Avoid pixel font sizes for body text. Rem-based sizes respect the reader\'s browser preferences — someone who bumped their base size to 20px for readability deserves that choice.',
      },
    ],
    exercise: {
      instructions:
        'Style the paragraph: set font-size to 1rem, font-weight to 400, and line-height to 1.6.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      p {\n        /* your three properties here */\n      }\n    </style>\n  </head>\n  <body>\n    <p>Roots grow slowly underground before anything appears above the soil.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'font-size:1rem',
          label: 'font-size is 1rem',
        },
        {
          type: 'styleIncludes',
          text: 'font-weight:400',
          label: 'font-weight is 400',
        },
        {
          type: 'styleIncludes',
          text: 'line-height:1.6',
          label: 'line-height is 1.6',
        },
      ],
    },
  },
  {
    id: 'css-typography-3',
    blocks: [
      {
        type: 'p',
        text: 'Letter-spacing and word-spacing are the fine-tuning knobs of type. A small positive letter-spacing — sometimes called tracking — opens up tight all-caps labels and makes them feel deliberate rather than shouted. Too much tracking on body text, though, and the words break apart into a scattered mess.',
      },
      {
        type: 'code',
        text: '.label {\n  text-transform: uppercase;\n  letter-spacing: 0.08em; /* relative to the font-size */\n  font-size: 0.75rem;\n}\n\n.byline {\n  word-spacing: 0.15em;\n  font-style: italic;\n}',
      },
      {
        type: 'tip',
        text: 'Use em units for letter-spacing so the spacing scales with the font-size. A fixed pixel value that looks right at 12px will look cramped at 24px.',
      },
    ],
    exercise: {
      instructions:
        'Style the label so it appears uppercase with a letter-spacing of 0.1em and font-size of 0.75rem.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .label {\n        /* your styles here */\n      }\n    </style>\n  </head>\n  <body>\n    <span class="label">growth stage</span>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'text-transform:uppercase',
          label: 'The label is uppercase',
        },
        {
          type: 'styleIncludes',
          text: 'letter-spacing:0.1em',
          label: 'Letter-spacing is 0.1em',
        },
        {
          type: 'styleIncludes',
          text: 'font-size:0.75rem',
          label: 'Font-size is 0.75rem',
        },
      ],
    },
  },
  {
    id: 'css-typography-4',
    blocks: [
      {
        type: 'p',
        text: 'Fixed pixel headings make a designer cry: a 48px h1 that looks perfect on a wide monitor dominates a phone screen and forces horizontal scrolling. Fluid type fixes this by letting the font size glide smoothly between a minimum and maximum as the viewport changes.',
      },
      {
        type: 'p',
        text: 'clamp() is the key. Supply a minimum size for small screens, a viewport-relative preferred size in the middle, and a maximum for large screens. The browser handles every viewport in between with no media query needed.',
      },
      {
        type: 'code',
        text: 'h1 {\n  font-size: clamp(1.75rem, 5vw, 3.5rem);\n}\n\nh2 {\n  font-size: clamp(1.25rem, 3.5vw, 2.25rem);\n}\n\np {\n  font-size: clamp(1rem, 1.5vw, 1.125rem);\n}',
      },
      {
        type: 'tip',
        text: 'A fluid type scale keeps the hierarchy intact at every width — the h1 is always visually louder than h2, and h2 always louder than p, no matter the screen size.',
      },
    ],
    exercise: {
      instructions:
        'Make the heading fluid: use clamp() to give h1 a minimum of 1.5rem, a preferred size of 4vw, and a maximum of 3rem.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      h1 {\n        /* your clamp() here */\n      }\n    </style>\n  </head>\n  <body>\n    <h1>The Canopy Chronicle</h1>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'font-size:clamp(',
          label: 'font-size uses clamp()',
        },
        {
          type: 'styleIncludes',
          text: '4vw',
          label: 'The preferred size is a viewport unit',
        },
        {
          type: 'styleIncludes',
          text: '3rem',
          label: 'A maximum rem size is set',
        },
      ],
    },
  },
  {
    id: 'css-typography-5',
    blocks: [
      {
        type: 'p',
        text: 'Good typography is invisible — readers absorb the words without noticing the type decisions behind them. Your capstone is a type-driven article page: one font family, a clear size hierarchy, generous line-height on body text, and a small-caps label to introduce the category.',
      },
      {
        type: 'code',
        text: '/* A simple type-driven article recipe */\nbody   { font-family: Georgia, serif; font-size: 1rem; }\nh1     { font-size: clamp(1.75rem, 5vw, 3rem); line-height: 1.2; }\np      { line-height: 1.7; max-width: 65ch; }\n.label { font-size: 0.75rem; letter-spacing: 0.1em;\n         text-transform: uppercase; }',
      },
      {
        type: 'p',
        text: 'The max-width: 65ch on paragraphs is a typographic classic — it keeps line length in the sweet spot of 60–75 characters where reading is most comfortable. ch is the width of the "0" character in the current font, so it scales with font-size automatically.',
      },
    ],
    exercise: {
      instructions:
        'Build a type-driven article: set body font-family to Georgia and serif fallback, give h1 a clamp() font-size, set p line-height to 1.7, and give the .label class an uppercase text-transform.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your typography rules here */\n    </style>\n  </head>\n  <body>\n    <span class="label">Forest Notes</span>\n    <h1>Why Old Trees Matter</h1>\n    <p>Ancient trees store carbon, support biodiversity, and anchor whole ecosystems.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'font-family:georgia',
          label: 'Body uses Georgia as the first font',
        },
        {
          type: 'styleIncludes',
          text: 'font-size:clamp(',
          label: 'h1 has a fluid clamp() size',
        },
        {
          type: 'styleIncludes',
          text: 'text-transform:uppercase',
          label: 'The label is uppercase',
        },
      ],
    },
  },
];

export default lessons;
