// Topic: Responsive Design (css-responsive) — 5 lessons.

const lessons = [
  {
    id: 'css-responsive-1',
    blocks: [
      {
        type: 'p',
        text: 'A page that looks great at 1400px but breaks at 390px is only half built. Responsive design means making one set of HTML work well on every screen — the phone in a pocket, the tablet on a desk, the monitor in an office.',
      },
      {
        type: 'p',
        text: 'The main tool is the media query — a conditional block in your CSS. It says "apply these rules only when the screen is at least this wide." Everything outside the block is the default. Everything inside the block is the exception.',
      },
      {
        type: 'code',
        text: '/* default: one column on narrow screens */\n.garden-grid {\n  display: block;\n}\n\n/* exception: two columns on wide screens */\n@media (min-width: 640px) {\n  .garden-grid {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n  }\n}',
      },
      {
        type: 'tip',
        text: 'A media query does not override anything on its own. It just opens a door. The CSS inside still follows the normal cascade, so specificity still matters.',
      },
    ],
    exercise: {
      instructions:
        'The tree-card is a simple block by default. Add a media query so that on screens wider than 600px, the card gets a max-width of 480px and a background color of #e8f5e9.',
      hints: [
        'A media query wraps CSS in a conditional block: @media (min-width: ...) { /* rules here */ }.',
        'Write @media (min-width: 600px) { .card { max-width: 480px; background-color: #e8f5e9; } } after the existing .card rule.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        padding: 1rem;\n        background: #fff;\n      }\n      /* your media query here */\n    </style>\n  </head>\n  <body>\n    <div class="card">Seedling stats</div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        padding: 1rem;\n        background: #fff;\n      }\n      @media (min-width: 600px) {\n        .card {\n          max-width: 480px;\n          background-color: #e8f5e9;\n        }\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">Seedling stats</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: '@media',
          label: 'A media query is present',
          hint: 'Start your media query with @media (min-width: 600px) { ... }.',
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
          hint: 'Put max-width: 480px on .card inside the media query block.',
        },
      ],
    },
  },
  {
    id: 'css-responsive-2',
    blocks: [
      {
        type: 'p',
        text: 'Fixed pixel values are fragile. A 320px sidebar that looks fine on your monitor can be a disaster on a small phone. Fluid units like percentages, em, rem, vw, and vh let elements grow and shrink with their container or the viewport.',
      },
      {
        type: 'p',
        text: 'The modern solution is clamp(). It takes three arguments: a minimum value, a preferred value (usually a viewport-relative expression), and a maximum value. The browser uses the preferred size, but never goes below the minimum or above the maximum.',
      },
      {
        type: 'code',
        text: 'h1 {\n  /* min 1.5rem, ideal 4vw, max 3rem */\n  font-size: clamp(1.5rem, 4vw, 3rem);\n}\n\n.container {\n  /* never narrower than 280px, never wider than 900px */\n  width: clamp(280px, 90%, 900px);\n  margin-inline: auto;\n}',
      },
      {
        type: 'tip',
        text: 'clamp() replaces the old pattern of setting a width in percent and then capping it with min-width / max-width. One declaration, clearer intent.',
      },
    ],
    exercise: {
      instructions:
        'Make the heading fluid: use clamp() to set its font-size with a minimum of 1.2rem, a preferred size of 5vw, and a maximum of 2.5rem.',
      hints: [
        'clamp() takes three comma-separated values: the smallest allowed, the preferred, and the largest allowed.',
        'Set font-size: clamp(1.2rem, 5vw, 2.5rem) on h1.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      h1 {\n        /* your clamp() here */\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Growing Season</h1>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      h1 {\n        font-size: clamp(1.2rem, 5vw, 2.5rem);\n      }\n    </style>\n  </head>\n  <body>\n    <h1>Growing Season</h1>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'clamp(',
          label: 'The heading uses clamp()',
          hint: 'Use clamp() as the value for font-size on h1.',
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
          hint: 'The middle argument of clamp() should be 5vw.',
        },
      ],
    },
  },
  {
    id: 'css-responsive-3',
    blocks: [
      {
        type: 'p',
        text: 'Mobile-first is a way of working: write your base styles for the smallest screen, then use min-width media queries to add more as the screen gets wider. It is the opposite of the old approach of designing for desktop first and then shrinking down. Shrinking down always left things feeling wrong.',
      },
      {
        type: 'p',
        text: 'The practical benefit is leaner CSS. A narrow phone never needs rules for a three-column layout — those rules live inside a media query that never fires. Styles layer outward, adding complexity only when there is space for it.',
      },
      {
        type: 'code',
        text: '/* mobile base — always loaded */\nnav {\n  display: flex;\n  flex-direction: column;\n  gap: 0.5rem;\n}\n\n/* tablet and up */\n@media (min-width: 768px) {\n  nav {\n    flex-direction: row;\n    gap: 2rem;\n  }\n}',
      },
      {
        type: 'tip',
        text: 'If you find yourself using max-width in a media query, pause. You are probably writing desktop-first. Flip the model: default = mobile, media queries = upgrades.',
      },
    ],
    exercise: {
      instructions:
        'Write mobile-first CSS: by default the nav links stack vertically (flex-direction: column). Add a min-width: 700px media query that switches them to a row.',
      hints: [
        'Set the default flex-direction on nav outside any media query, then put the row override inside @media (min-width: 700px).',
        'Add flex-direction: column to the base nav rule, then write @media (min-width: 700px) { nav { flex-direction: row; } }.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      nav {\n        display: flex;\n        gap: 1rem;\n        /* set the default direction here */\n      }\n      /* add your media query here */\n    </style>\n  </head>\n  <body>\n    <nav>\n      <a href="#">Home</a>\n      <a href="#">Garden</a>\n      <a href="#">About</a>\n    </nav>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      nav {\n        display: flex;\n        gap: 1rem;\n        flex-direction: column;\n      }\n      @media (min-width: 700px) {\n        nav {\n          flex-direction: row;\n        }\n      }\n    </style>\n  </head>\n  <body>\n    <nav>\n      <a href="#">Home</a>\n      <a href="#">Garden</a>\n      <a href="#">About</a>\n    </nav>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'flex-direction:column',
          label: 'Links stack vertically by default',
          hint: 'Add flex-direction: column to the base nav rule.',
        },
        {
          type: 'styleIncludes',
          text: 'min-width:700px',
          label: 'A min-width: 700px query is present',
          hint: 'Wrap the row rule in @media (min-width: 700px) { ... }.',
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
        text: 'A fluid layout built with good units handles most screens well. But images need their own attention. An <img> with no width rule will overflow its container on narrow screens and break the layout. One line prevents that: max-width: 100%.',
      },
      {
        type: 'code',
        text: 'img {\n  max-width: 100%;\n  height: auto; /* preserve the natural aspect ratio */\n  display: block;\n}',
      },
      {
        type: 'p',
        text: 'When you want an image to fill a container at a specific aspect ratio — like a hero banner or a card thumbnail — combine object-fit with a fixed or fluid height. object-fit: cover crops the image to fill without distortion. Think of it as a window onto the image, not a stretching frame.',
      },
      {
        type: 'tip',
        text: 'Add these rules to img in a global reset and you will never have to think about overflowing images again.',
      },
    ],
    exercise: {
      instructions:
        'Fix the hero image: set max-width to 100% and height to auto so it scales with its container without distortion.',
      hints: [
        'Two properties on .hero-img prevent overflow and distortion: max-width and height.',
        'Set max-width: 100% and height: auto on .hero-img.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero-img {\n        /* your rules here */\n      }\n    </style>\n  </head>\n  <body>\n    <img class="hero-img" src="forest.jpg" alt="Dense forest canopy">\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero-img {\n        max-width: 100%;\n        height: auto;\n      }\n    </style>\n  </head>\n  <body>\n    <img class="hero-img" src="forest.jpg" alt="Dense forest canopy">\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'max-width:100%',
          label: 'The image is capped at 100% of its container',
          hint: 'Add max-width: 100% to .hero-img.',
        },
        {
          type: 'styleIncludes',
          text: 'height:auto',
          label: 'Height is set to auto to preserve ratio',
          hint: 'Add height: auto to .hero-img so the image does not stretch.',
        },
      ],
    },
  },
  {
    id: 'css-responsive-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to bring it all together. A responsive page is not a collection of separate designs. It is one design with carefully layered rules. Start with the mobile layout. Let fluid units do most of the work. Use media queries only when the layout truly needs to shift.',
      },
      {
        type: 'code',
        text: '/* 1. fluid foundation */\nbody {\n  font-size: clamp(1rem, 2vw, 1.125rem);\n}\n.container {\n  width: clamp(300px, 92%, 860px);\n  margin-inline: auto;\n}\n\n/* 2. mobile-first layout */\n.cards {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 1rem;\n}\n\n/* 3. upgrade at 640px */\n@media (min-width: 640px) {\n  .cards {\n    grid-template-columns: repeat(2, 1fr);\n  }\n}',
      },
      {
        type: 'p',
        text: 'Build this capstone page: a centered container, a fluid heading, and a two-card grid that starts as one column on mobile and grows to two columns on wider screens.',
      },
    ],
    exercise: {
      instructions:
        'Build a responsive seed-shop page: a .container centered with clamp() width, an h1 with a clamp() font-size, and a .cards grid that is 1 column by default and 2 columns at min-width 600px.',
      hints: [
        'You need clamp() for sizing, a single-column grid as the default, and a media query that switches to two columns.',
        'Set width: clamp(300px, 90%, 860px) on .container, font-size: clamp(1.5rem, 4vw, 2.5rem) on h1, grid-template-columns: 1fr on .cards, and override it with repeat(2, 1fr) inside @media (min-width: 600px).',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      /* your responsive styles here */\n    </style>\n  </head>\n  <body>\n    <div class="container">\n      <h1>Seed Shop</h1>\n      <div class="cards">\n        <div class="card">Oak seeds</div>\n        <div class="card">Willow seeds</div>\n      </div>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .container {\n        width: clamp(300px, 90%, 860px);\n        margin-inline: auto;\n      }\n      h1 {\n        font-size: clamp(1.5rem, 4vw, 2.5rem);\n      }\n      .cards {\n        display: grid;\n        grid-template-columns: 1fr;\n        gap: 1rem;\n      }\n      @media (min-width: 600px) {\n        .cards {\n          grid-template-columns: repeat(2, 1fr);\n        }\n      }\n    </style>\n  </head>\n  <body>\n    <div class="container">\n      <h1>Seed Shop</h1>\n      <div class="cards">\n        <div class="card">Oak seeds</div>\n        <div class="card">Willow seeds</div>\n      </div>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'clamp(',
          label: 'clamp() is used for fluid sizing',
          hint: 'Use clamp() for either the container width or the h1 font-size.',
        },
        {
          type: 'styleIncludes',
          text: 'grid-template-columns:1fr',
          label: 'Cards start as a single column',
          hint: 'Set grid-template-columns: 1fr on .cards as the default.',
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
