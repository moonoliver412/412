// Topic: CSS Variables (css-variables) — 5 lessons.

const lessons = [
  {
    id: 'css-variables-1',
    blocks: [
      {
        type: 'p',
        text: 'CSS custom properties — usually called CSS variables — let you name a value once and reuse it everywhere. Change the name, and every element that uses it updates automatically. No find-and-replace, no missed spots, no out-of-sync colors.',
      },
      {
        type: 'p',
        text: 'Custom property names always start with two dashes. You define them inside any rule block. The special :root selector means "the very top of the document" — so a variable defined there is available everywhere on the page. You read a variable back with the var() function.',
      },
      {
        type: 'code',
        text: ':root {\n  --color-leaf: #5a9e6f;\n  --color-bark: #6b4f3a;\n  --spacing-base: 1rem;\n}\n\nh1 {\n  color: var(--color-leaf);\n}\n\n.card {\n  padding: var(--spacing-base);\n  border-left: 4px solid var(--color-bark);\n}',
      },
      {
        type: 'tip',
        text: 'var() takes a fallback as a second argument: var(--color-leaf, green). If the variable is not defined, the browser uses the fallback instead of breaking.',
      },
    ],
    exercise: {
      instructions:
        'Define two custom properties on :root — --color-primary set to #3d8b5e and --spacing-md set to 1.5rem. Then apply them: give h1 the color and give .card the padding.',
      hints: [
        'Custom properties are defined with two dashes before the name: --my-name: value; inside a rule block.',
        'Add --color-primary: #3d8b5e and --spacing-md: 1.5rem inside :root, then set color: var(--color-primary) on h1 and padding: var(--spacing-md) on .card.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      :root {\n        /* define --color-primary and --spacing-md here */\n      }\n      h1 {\n        /* use var(--color-primary) */\n      }\n      .card {\n        /* use var(--spacing-md) */\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Garden Map</h1>\n    <div class="card">Plot A</div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      :root {\n        --color-primary: #3d8b5e;\n        --spacing-md: 1.5rem;\n      }\n      h1 {\n        color: var(--color-primary);\n      }\n      .card {\n        padding: var(--spacing-md);\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Garden Map</h1>\n    <div class="card">Plot A</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '--color-primary:#3d8b5e',
          label: '--color-primary is defined as #3d8b5e',
          hint: 'Inside :root, write --color-primary: #3d8b5e;',
        },
        {
          type: 'styleIncludes',
          text: 'color:var(--color-primary)',
          label: 'h1 uses var(--color-primary)',
          hint: 'Set color: var(--color-primary) on h1.',
        },
        {
          type: 'styleIncludes',
          text: 'padding:var(--spacing-md)',
          label: '.card uses var(--spacing-md) for padding',
        },
      ],
    },
  },
  {
    id: 'css-variables-2',
    blocks: [
      {
        type: 'p',
        text: 'Custom properties follow the CSS cascade. They inherit down the tree just like color or font-size. A variable defined on a parent is visible to all its descendants. A variable defined on a child is not visible to its parent or siblings. This lets you override a variable for one section of the page without changing anything else.',
      },
      {
        type: 'code',
        text: ':root {\n  --bg: #ffffff;\n  --text: #1a1a1a;\n}\n\n/* dark section overrides only inside itself */\n.dark-section {\n  --bg: #1a1a1a;\n  --text: #f5f5f5;\n\n  background: var(--bg);\n  color: var(--text);\n}\n\np {\n  /* inherits whichever --text is closest */\n  color: var(--text);\n}',
      },
      {
        type: 'p',
        text: 'The p inside .dark-section sees --text: #f5f5f5. The p outside sees --text: #1a1a1a. Same CSS rule — different inherited value. This is what makes section-level theming so clean.',
      },
      {
        type: 'tip',
        text: 'Unlike Sass variables (which disappear after compilation), CSS variables are live in the browser. JavaScript can read and write them using getComputedStyle and style.setProperty.',
      },
    ],
    exercise: {
      instructions:
        'Override --bg-color for the .dark element: define --bg-color as #ffffff on :root, then redefine it as #1a1a1a on .dark. Apply it as background on both selectors using var(--bg-color).',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      :root {\n        /* define --bg-color: #ffffff */\n      }\n      body {\n        background: var(--bg-color);\n      }\n      .dark {\n        /* override --bg-color and apply it */\n      }\n    </style>\n  </head>\n  <body>\n    <p>Light section</p>\n    <div class="dark"><p>Dark section</p></div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '--bg-color:#ffffff',
          label: '--bg-color is #ffffff on :root',
        },
        {
          type: 'styleIncludes',
          text: '--bg-color:#1a1a1a',
          label: '--bg-color is overridden to #1a1a1a on .dark',
        },
        {
          type: 'styleIncludes',
          text: 'background:var(--bg-color)',
          label: 'background uses var(--bg-color)',
        },
      ],
    },
  },
  {
    id: 'css-variables-3',
    blocks: [
      {
        type: 'p',
        text: 'A design token system is CSS variables used deliberately. One :root block names every color, spacing value, and font size in the design. Every other rule uses only var() references. Change one token and everything updates. This is how modern design systems work.',
      },
      {
        type: 'code',
        text: ':root {\n  /* colour tokens */\n  --clr-primary:   #3d8b5e;\n  --clr-secondary: #f4c048;\n  --clr-surface:   #f8faf7;\n  --clr-text:      #1c2b1e;\n\n  /* spacing tokens */\n  --space-sm: 0.5rem;\n  --space-md: 1rem;\n  --space-lg: 2rem;\n\n  /* type tokens */\n  --fs-body: 1rem;\n  --fs-heading: clamp(1.5rem, 4vw, 2.5rem);\n}',
      },
      {
        type: 'tip',
        text: 'Name tokens by their role, not their value. --clr-primary is a good token. --green-500 is not — a name that describes the value ties your hands when you want to change the shade later.',
      },
    ],
    exercise: {
      instructions:
        'Define a small token set on :root: --clr-primary as #3d8b5e, --clr-surface as #f8faf7, and --space-md as 1rem. Then apply them: body background uses --clr-surface, h1 color uses --clr-primary, and .card padding uses --space-md.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      :root {\n        /* your three tokens here */\n      }\n      body {\n        background: var(--clr-surface);\n      }\n      h1 {\n        /* color token */\n      }\n      .card {\n        /* spacing token */\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Grove Registry</h1>\n    <div class="card">Birch plot 4</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '--clr-primary:#3d8b5e',
          label: '--clr-primary token is defined',
        },
        {
          type: 'styleIncludes',
          text: '--clr-surface:#f8faf7',
          label: '--clr-surface token is defined',
        },
        {
          type: 'styleIncludes',
          text: 'var(--clr-primary)',
          label: '--clr-primary is used in a rule',
        },
      ],
    },
  },
  {
    id: 'css-variables-4',
    blocks: [
      {
        type: 'p',
        text: 'CSS variables work inside calc(), turning them into a simple math engine. Define one base spacing value and derive the rest — double it, halve it, multiply by any number. Your whole spacing scale stays in sync even when you change the base value.',
      },
      {
        type: 'code',
        text: ':root {\n  --space: 1rem;\n}\n\n.compact {\n  padding: calc(var(--space) * 0.5);  /* 0.5rem */\n}\n\n.roomy {\n  padding: calc(var(--space) * 2);    /* 2rem   */\n  gap:     calc(var(--space) * 1.5);  /* 1.5rem */\n}\n\n.divider {\n  /* 1px border derived from nothing else */\n  border-top: calc(var(--space) * 0.0625) solid currentColor;\n}',
      },
      {
        type: 'p',
        text: 'This pattern works beyond spacing too. A --base-font-size variable combined with calc() gives you a full type scale. Every heading and caption is mathematically tied to one root value.',
      },
      {
        type: 'tip',
        text: 'calc() requires a space on both sides of + and - operators: calc(var(--space) + 4px), not calc(var(--space)+4px). The * and / operators work without spaces.',
      },
    ],
    exercise: {
      instructions:
        'Define --base-space as 1rem on :root. Then give .small a padding of calc(var(--base-space) * 0.5) and .large a padding of calc(var(--base-space) * 2).',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      :root {\n        /* define --base-space: 1rem */\n      }\n      .small {\n        background: #e8f5e9;\n        /* calc padding */\n      }\n      .large {\n        background: #c8e6c9;\n        /* calc padding */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="small">Seedling</div>\n    <div class="large">Ancient oak</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '--base-space:1rem',
          label: '--base-space is defined as 1rem',
        },
        {
          type: 'styleIncludes',
          text: 'calc(var(--base-space)*0.5)',
          label: '.small uses calc() with --base-space',
        },
        {
          type: 'styleIncludes',
          text: 'calc(var(--base-space)*2)',
          label: '.large uses calc() with --base-space',
        },
      ],
    },
  },
  {
    id: 'css-variables-5',
    blocks: [
      {
        type: 'p',
        text: 'A theme switcher is the classic way to show CSS variables in action. You define light tokens on :root and dark overrides on a [data-theme="dark"] attribute. Toggle the attribute — with a button click or a prefers-color-scheme media query — and the whole page recolors instantly. No JavaScript needs to touch individual elements.',
      },
      {
        type: 'code',
        text: ':root {\n  --clr-bg:   #f8faf7;\n  --clr-text: #1c2b1e;\n  --clr-card: #ffffff;\n}\n\n[data-theme="dark"] {\n  --clr-bg:   #1c2b1e;\n  --clr-text: #e6f0e7;\n  --clr-card: #243326;\n}\n\n/* one set of component rules for both themes */\nbody  { background: var(--clr-bg);   color: var(--clr-text); }\n.card { background: var(--clr-card); border: 1px solid var(--clr-text); }',
      },
      {
        type: 'p',
        text: 'You can also let the OS decide with @media (prefers-color-scheme: dark). Same token override technique, no JavaScript at all. The treehouse stays comfortable in any light.',
      },
    ],
    exercise: {
      instructions:
        'Build a two-theme page: define --clr-bg (#f5f5f5) and --clr-text (#111111) on :root. Override both inside a [data-theme="dark"] selector (use #111111 for bg and #f5f5f5 for text). Apply them to body background and color. Add data-theme="dark" to the <html> element to test the dark theme.',
      starter:
        '<!doctype html>\n<html data-theme="dark">\n  <head>\n    <style>\n      :root {\n        /* light tokens */\n      }\n      [data-theme="dark"] {\n        /* dark overrides */\n      }\n      body {\n        /* apply the tokens */\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Night Garden</h1>\n    <p>The forest after dark.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '--clr-bg:#f5f5f5',
          label: '--clr-bg light token is defined',
        },
        {
          type: 'styleIncludes',
          text: '[data-theme="dark"]',
          label: 'A [data-theme="dark"] override block exists',
        },
        {
          type: 'styleIncludes',
          text: 'background:var(--clr-bg)',
          label: 'Body background uses var(--clr-bg)',
        },
        {
          type: 'styleIncludes',
          text: 'color:var(--clr-text)',
          label: 'Body color uses var(--clr-text)',
        },
      ],
    },
  },
];

export default lessons;
