// Topic: Backgrounds & Borders (css-backgrounds) — 5 lessons.

const lessons = [
  {
    id: 'css-backgrounds-1',
    blocks: [
      {
        type: 'p',
        text: 'Background fills the space behind an element\'s content. The simplest form is a solid color using background-color. For an image, use background-image with a url() pointing at your image file. The browser tiles it by default — repeating it like wallpaper.',
      },
      {
        type: 'p',
        text: 'Tiling is often not what you want. background-repeat: no-repeat stops it. background-size lets you scale the image. background-position tells the browser where to place it inside the element.',
      },
      {
        type: 'code',
        text: '.hero {\n  background-image: url("canopy.jpg");\n  background-repeat: no-repeat;\n  background-size: cover;     /* fill the box, crop if needed */\n  background-position: center;\n}',
      },
      {
        type: 'tip',
        text: 'background-size: cover fills the box and crops the image if needed. background-size: contain is the opposite — it shows the whole image, even if that leaves gaps at the edges.',
      },
    ],
    exercise: {
      instructions:
        'Style the .banner so it has a background-color of #2d5a27, set background-repeat to no-repeat, and set background-position to center.',
      hints: [
        'All three rules go inside the .banner { } block — they are background-color, background-repeat, and background-position.',
        'Set background-color: #2d5a27, background-repeat: no-repeat, and background-position: center on .banner.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .banner {\n        height: 200px;\n        /* your background rules here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="banner">Forest canopy</div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .banner {\n        height: 200px;\n        background-color: #2d5a27;\n        background-repeat: no-repeat;\n        background-position: center;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="banner">Forest canopy</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'background-color:#2d5a27',
          label: 'Background color is #2d5a27',
          hint: 'Use background-color: #2d5a27 inside .banner.',
        },
        {
          type: 'styleIncludes',
          text: 'background-repeat:no-repeat',
          label: 'Background repeat is disabled',
        },
        {
          type: 'styleIncludes',
          text: 'background-position:center',
          label: 'Background is centered',
          hint: 'Set background-position: center on .banner.',
        },
      ],
    },
  },
  {
    id: 'css-backgrounds-2',
    blocks: [
      {
        type: 'p',
        text: 'A gradient is a background the browser draws for you — no image file needed. CSS has two main types. linear-gradient() blends colors in a straight line. radial-gradient() spreads from a center point outward, like rings on a pond.',
      },
      {
        type: 'code',
        text: '.sunrise {\n  background: linear-gradient(\n    to bottom,       /* direction */\n    #fce4a8,         /* top: pale amber */\n    #7fb069          /* bottom: leaf green */\n  );\n}\n\n.spotlight {\n  background: radial-gradient(\n    circle at 30% 40%,\n    #d4edda,\n    #2d5a27\n  );\n}',
      },
      {
        type: 'p',
        text: 'You can stack multiple gradients and images. Just separate them with commas in the background property. The first one listed sits on top. This lets you layer textures without a photo editor.',
      },
      {
        type: 'tip',
        text: 'Color stops can include positions. In linear-gradient(to right, #fff 20%, #7fb069 80%), white holds until 20%, then fades into green.',
      },
    ],
    exercise: {
      instructions:
        'Give the .panel a linear-gradient background going from top to bottom, starting with #e8f5e9 and ending with #4caf50.',
      hints: [
        'Use the background property and the linear-gradient() function to define a color blend.',
        'Set background: linear-gradient(to bottom, #e8f5e9, #4caf50) on .panel.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .panel {\n        height: 180px;\n        /* your gradient here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="panel">Seedling panel</div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .panel {\n        height: 180px;\n        background: linear-gradient(to bottom, #e8f5e9, #4caf50);\n      }\n    </style>\n  </head>\n  <body>\n    <div class="panel">Seedling panel</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'linear-gradient(',
          label: 'A linear-gradient is used',
          hint: 'Use background: linear-gradient(...) on .panel.',
        },
        {
          type: 'styleIncludes',
          text: '#e8f5e9',
          label: 'The gradient starts with #e8f5e9',
        },
        {
          type: 'styleIncludes',
          text: '#4caf50',
          label: 'The gradient ends with #4caf50',
          hint: 'The second color stop in your gradient should be #4caf50.',
        },
      ],
    },
  },
  {
    id: 'css-backgrounds-3',
    blocks: [
      {
        type: 'p',
        text: 'A border sits on the outside edge of an element\'s padding. The shorthand border sets three values at once: width, style, and color. For individual sides, use border-top, border-right, border-bottom, or border-left.',
      },
      {
        type: 'code',
        text: '.card {\n  border: 2px solid #5a9e6f;   /* all four sides */\n  border-radius: 12px;          /* round the corners */\n}\n\n.highlight {\n  border: none;\n  border-left: 4px solid #f4c048; /* accent bar only */\n  padding-left: 1rem;\n}',
      },
      {
        type: 'p',
        text: 'border-radius rounds the corners of an element. A value of 50% on a square element makes a perfect circle. That\'s how profile picture bubbles and dot badges are made.',
      },
      {
        type: 'tip',
        text: 'border-style defaults to none. Writing border: 2px green does nothing visible. You must include a style keyword — solid, dashed, dotted, or double.',
      },
    ],
    exercise: {
      instructions:
        'Style the .card with a 2px solid border of color #5a9e6f and a border-radius of 8px.',
      hints: [
        'The border shorthand takes three values in order: width, style, then color.',
        'Set border: 2px solid #5a9e6f and border-radius: 8px on .card.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        padding: 1rem;\n        /* your border rules here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">Sprout card</div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        padding: 1rem;\n        border: 2px solid #5a9e6f;\n        border-radius: 8px;\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">Sprout card</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'border:2pxsolid#5a9e6f',
          label: 'A 2px solid green border is set',
          hint: 'Write border: 2px solid #5a9e6f — all three parts together.',
        },
        {
          type: 'styleIncludes',
          text: 'border-radius:8px',
          label: 'Corners are rounded to 8px',
          hint: 'Add border-radius: 8px to .card.',
        },
      ],
    },
  },
  {
    id: 'css-backgrounds-4',
    blocks: [
      {
        type: 'p',
        text: 'Shadows add depth without changing layout. box-shadow draws a shadow behind an element. You set the horizontal offset, vertical offset, blur radius, and color. An optional spread value makes the shadow grow larger than the element.',
      },
      {
        type: 'code',
        text: '.card {\n  /* x-offset  y-offset  blur  color */\n  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);\n}\n\n.card:hover {\n  /* lift the card on hover */\n  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2);\n  transform: translateY(-2px);\n}',
      },
      {
        type: 'p',
        text: 'text-shadow works the same way, but draws behind individual letters. It\'s great for making light text readable over a busy photo. A soft dark shadow behind pale letters grounds them on a forest image.',
      },
      {
        type: 'tip',
        text: 'You can stack multiple shadows by separating them with commas. A tight shadow layered with a wide soft one gives a rich look: box-shadow: 0 1px 3px rgba(0,0,0,.3), 0 8px 20px rgba(0,0,0,.1).',
      },
    ],
    exercise: {
      instructions:
        'Give the .card a box-shadow with 0px horizontal offset, 4px vertical offset, 12px blur, and the color rgba(0,0,0,0.15).',
      hints: [
        'box-shadow takes values in this order: horizontal offset, vertical offset, blur radius, color.',
        'Set box-shadow: 0px 4px 12px rgba(0,0,0,0.15) on .card.',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        padding: 1.5rem;\n        background: #fff;\n        border-radius: 8px;\n        /* your box-shadow here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">Root system overview</div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .card {\n        padding: 1.5rem;\n        background: #fff;\n        border-radius: 8px;\n        box-shadow: 0px 4px 12px rgba(0,0,0,0.15);\n      }\n    </style>\n  </head>\n  <body>\n    <div class="card">Root system overview</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'box-shadow:',
          label: 'box-shadow is declared',
          hint: 'Add box-shadow: ... to the .card rule.',
        },
        {
          type: 'styleIncludes',
          text: '12px',
          label: 'The blur radius is 12px',
        },
        {
          type: 'styleIncludes',
          text: 'rgba(',
          label: 'The shadow color uses rgba()',
          hint: 'Use rgba(0,0,0,0.15) as the color in your box-shadow.',
        },
      ],
    },
  },
  {
    id: 'css-backgrounds-5',
    blocks: [
      {
        type: 'p',
        text: 'All four tools — background, gradient, border, shadow — work together in a hero banner. A hero is the full-width block at the top of a page. It grabs attention right away. It usually has a rich background, big text, and enough depth to feel like a window.',
      },
      {
        type: 'code',
        text: '.hero {\n  padding: 4rem 2rem;\n  border-radius: 16px;\n  /* gradient over a colour */\n  background:\n    linear-gradient(\n      to bottom,\n      rgba(0,0,0,0.35),\n      rgba(0,0,0,0.05)\n    ),\n    #2d5a27;\n  box-shadow: 0 8px 32px rgba(0,0,0,0.25);\n  border: 1px solid rgba(255,255,255,0.12);\n}\n.hero h1 {\n  color: #fff;\n  text-shadow: 0 2px 8px rgba(0,0,0,0.4);\n}',
      },
      {
        type: 'p',
        text: 'Now you\'ll build one. Give .hero a linear-gradient background, a box-shadow for depth, a border-radius, and white heading text with a text-shadow to keep it readable.',
      },
    ],
    exercise: {
      instructions:
        'Build a hero banner: give .hero a linear-gradient background using any two green or earthy colors, a box-shadow, and a border-radius of at least 8px. Set the h1 inside it to white with a text-shadow.',
      hints: [
        'You need four things: a linear-gradient on .hero, a box-shadow on .hero, a border-radius on .hero, and color + text-shadow on .hero h1.',
        'Try background: linear-gradient(to bottom, #2d5a27, #4caf50) on .hero, then add box-shadow, border-radius: 8px, and on .hero h1 set color: white and text-shadow: 0 2px 8px rgba(0,0,0,0.4).',
      ],
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero {\n        padding: 3rem 2rem;\n        /* your background, shadow, radius here */\n      }\n      .hero h1 {\n        /* color and text-shadow here */\n      }\n    </style>\n  </head>\n  <body>\n    <div class="hero">\n      <h1>The Old-Growth Grove</h1>\n    </div>\n  </body>\n</html>',
      solution:
        '<!doctype html>\n<html>\n  <head>\n    <style>\n      .hero {\n        padding: 3rem 2rem;\n        background: linear-gradient(to bottom, #2d5a27, #4caf50);\n        box-shadow: 0 8px 32px rgba(0,0,0,0.25);\n        border-radius: 8px;\n      }\n      .hero h1 {\n        color: white;\n        text-shadow: 0 2px 8px rgba(0,0,0,0.4);\n      }\n    </style>\n  </head>\n  <body>\n    <div class="hero">\n      <h1>The Old-Growth Grove</h1>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'styleIncludes',
          text: 'linear-gradient(',
          label: 'The hero uses a linear-gradient background',
          hint: 'Set background: linear-gradient(...) on .hero.',
        },
        {
          type: 'styleIncludes',
          text: 'box-shadow:',
          label: 'A box-shadow adds depth',
        },
        {
          type: 'styleIncludes',
          text: 'border-radius:',
          label: 'Corners are rounded',
          hint: 'Add border-radius: 8px (or larger) to .hero.',
        },
        {
          type: 'styleIncludes',
          text: 'text-shadow:',
          label: 'The heading has a text-shadow for legibility',
        },
      ],
    },
  },
];

export default lessons;
