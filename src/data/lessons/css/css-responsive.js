// Topic: Responsive Design (css-responsive) — 5 lessons.

const lessons = [
  {
    id: 'css-responsive-1',
    blocks: [
      {
        type: 'p',
        text: 'A page that looks great at 1400px but breaks at 390px is only half built. Responsive design is the craft of making one set of HTML speak fluently to every screen — the phone in a pocket, the tablet on a kitchen counter, the monitor in an office.',
      },
      {
        type: 'p',
        text: 'The main tool is the media query. It is a conditional block in your CSS: "apply these rules only when the screen is at least this wide." Everything outside the block is the default; everything inside the block is the exception.',
      },
      {
        type: 'code',
        text: '/* default: one column on narrow screens */\n.garden-grid {\n  display: block;\n}\n\n/* exception: two columns on wide screens */\n@media (min-width: 640px) {\n  .garden-grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n  }\n}',
      },
      {
        type: 'tip',
        text: 'A media query does not override anything by itself — it just opens a door. The CSS inside still follows the normal cascade, so specificity still matters.',
      },
    ],
    exercise: {
      instructions:
        'The tree-card is a simple block by default. Add a media query so that on screens wider than 600px, the card gets a max-width of 480px and a background color of #e8f5e9.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        padding: 1rem;\n        background: #fff;\n      }\n      /* your media query here */\n    </style>\n  </head>\n  <body>\n    <div class="card">Seedling stats</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '@media',
          label: 'A media query is present',
        },
        {
          type: 'styleIncludes',
          text: 'min-width:600px',
          label: 'The query targets screens at least 600px wide',
        },
        {
          type: 'styleIncludes',
          text: 'max-width:480px',
          label: 'The card gets a max-width inside the query',
        },
      ],
    },
  },
  {
    id: 'css-responsive-2',
    blocks: [
      {
        type: 'p',
        text: 'Fixed pixel values are brittle. A 320px sidebar that seemed fine on your monitor is a disaster on a small phone. Fluid units like percentages, em, rem, vw, and vh let elements breathe — they grow and shrink with their container or the viewport.',
      },
      {
        type: 'p',
        text: 'The modern sweet spot is clamp(). It takes three arguments: a minimum value, a preferred value (usually a viewport-relative expression), and a maximum value. The browser picks the preferred, but never goes below the minimum or above the maximum.',
      },
      {
        type: 'code',
        text: 'h1 {\n  /* min 1.5rem, ideal 4vw, max 3rem */\n  font-size: clamp(1.5rem, 4vw, 3rem);\n}\n\n.container {\n  /* never narrower than 280px, never wider than 900px */\n  width: clamp(280px, 90%, 900px);\n  margin-inline: auto;\n}',
      },
      {
        type: 'tip',
        text: 'clamp() is a replacement for the classic pattern of setting a width in percent and then capping it with min-width / max-width. One declaration, cleaner intent.',
      },
    ],
    exercise: {
      instructions:
        'Make the heading fluid: use clamp() to set its font-size with a minimum of 1.2rem, a preferred size of 5vw, and a maximum of 2.5rem.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      h1 {\n        /* your clamp() here */\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Growing Season</h1>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'clamp(',
          label: 'The heading uses clamp()',
        },
        {
          type: 'styleIncludes',
          text: 'font-size:clamp(',
          label: 'clamp() sets the font-size',
        },
        {
          type: 'styleIncludes',
          text: '5vw',
          label: 'The preferred size uses a viewport unit',
        },
      ],
    },
  },
  {
    id: 'css-responsive-3',
    blocks: [
      {
        type: 'p',
        text: 'Mobile-first is a workflow philosophy: write your base styles for the smallest screen, then use min-width media queries to layer on complexity as the viewport grows. It is the opposite of the old habit of designing for desktop and then shrinking down — which always felt like pruning a tree that had already grown the wrong shape.',
      },
      {
        type: 'p',
        text: 'The practical payoff is leaner CSS. A narrow phone never downloads rules for a three-column layout it will never use — those rules live inside a media query that never fires. Styles cascade outward, not inward.',
      },
      {
        type: 'code',
        text: '/* mobile base — always loaded */\nnav {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n\n/* tablet and up */\n@media (min-width: 768px) {\n  nav {\n    flex-direction: row;\n    gap: 2rem;\n  }\n}',
      },
      {
        type: 'tip',
        text: 'If you reach for max-width in a media query, pause — you are likely writing desktop-first. Flip the model: default = mobile, media queries = upgrades.',
      },
    ],
    exercise: {
      instructions:
        'Write mobile-first CSS: by default the nav links stack vertically (flex-direction: column). Add a min-width: 700px media query that switches them to a row.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      nav {\n        display: flex;\n        gap: 1rem;\n        /* set the default direction here */\n      }\n      /* add your media query here */\n    </style>\n  </head>\n  <body>\n    <nav>\n      <a href="#">Home</a>\n      <a href="#">Garden</a>\n      <a href="#">About</a>\n    </nav>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'flex-direction:column',
          label: 'Links stack vertically by default',
        },
        {
          type: 'styleIncludes',
          text: 'min-width:700px',
          label: 'A min-width: 700px query is present',
        },
        {
          type: 'styleIncludes',
          text: 'flex-direction:row',
          label: 'The query switches links to a row',
        },
      ],
    },
  },
  {
    id: 'css-responsive-4',
    blocks: [
      {
        type: 'p',
        text: 'A fluid layout built with good units is already most of the battle — but images need their own attention. An <img> with no width rule will overflow its container on narrow screens, blowing the layout wide open. One line prevents it: max-width: 100%.',
      },
      {
        type: 'code',
        text: 'img {\n  max-width: 100%;\n  height: auto; /* preserve the natural aspect ratio */\n  display: block;\n}',
      },
      {
        type: 'p',
        text: 'For situations where you want an image to fill a container at a specific aspect ratio — a hero banner, a card thumbnail — combine object-fit with a fixed or fluid height. object-fit: cover crops to fill without distortion. Think of it as a window onto the image, not a stretching frame.',
      },
      {
        type: 'tip',
        text: 'Set these rules on img in a global reset and you will never need to think about overflowing images again.',
      },
    ],
    exercise: {
      instructions:
        'Fix the hero image: set max-width to 100% and height to auto so it scales with its container without distortion.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero-img {\n        /* your rules here */\n      }\n    </style>\n  </head>\n  <body>\n    <img class="hero-img" src="forest.jpg" alt="Dense forest canopy">\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'max-width:100%',
          label: 'The image is capped at 100% of its container',
        },
        {
          type: 'styleIncludes',
          text: 'height:auto',
          label: 'Height is set to auto to preserve ratio',
        },
      ],
    },
  },
  {
    id: 'css-responsive-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to bring it all together. A responsive page is not a collection of separate designs — it is one design with intelligently layered rules. Start with the mobile shell, let fluid units do the heavy lifting, and reach for media queries only when the layout genuinely needs to shift.',
      },
      {
        type: 'code',
        text: '/* 1. fluid foundation */\nbody {\n  font-size: clamp(1rem, 2vw, 1.125rem);\n}\n.container {\n  width: clamp(300px, 92%, 860px);\n  margin-inline: auto;\n}\n\n/* 2. mobile-first layout */\n.cards {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n}\n\n/* 3. upgrade at 640px */\n@media (min-width: 640px) {\n  .cards {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}',
      },
      {
        type: 'p',
        text: 'Build this capstone page: a centered container, a fluid heading, and a two-card grid that starts as one column on mobile and becomes two columns on wider screens. Every layout decision gets a reason.',
      },
    ],
    exercise: {
      instructions:
        'Build a responsive seed-shop page: a .container centered with clamp() width, an h1 with a clamp() font-size, and a .cards grid that is 1 column by default and 2 columns at min-width 600px.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your responsive styles here */\n    </style>\n  </head>\n  <body>\n    <div class="container">\n      <h1>Seed Shop</h1>\n      <div class="cards">\n        <div class="card">Oak seeds</div>\n        <div class="card">Willow seeds</div>\n      </div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'clamp(',
          label: 'clamp() is used for fluid sizing',
        },
        {
          type: 'styleIncludes',
          text: 'grid-template-columns:1fr',
          label: 'Cards start as a single column',
        },
        {
          type: 'styleIncludes',
          text: '@media',
          label: 'A media query upgrades the layout',
        },
      ],
    },
  },
];

export default lessons;
