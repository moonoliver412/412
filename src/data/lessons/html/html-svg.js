// Topic: SVG & Graphics (html-svg) — 5 lessons.

const lessons = [
  {
    id: 'html-svg-1',
    blocks: [
      {
        type: 'p',
        text: 'SVG — Scalable Vector Graphics — describes pictures as shapes and coordinates, not pixels. That is why an SVG logo stays sharp at any size. You can keep SVGs in separate files, but the real fun starts when you write one inline: an <svg> element right in your HTML, with shapes as child elements you can read and edit like any other tag.',
      },
      {
        type: 'p',
        text: 'The <svg> tag opens a drawing area. width and height set its size. Inside, <circle> is the easiest first shape: cx and cy place its center, r sets the radius, and fill sets the color.',
      },
      {
        type: 'code',
        text: '<svg width="120" height="120">\n  <circle cx="60" cy="60" r="50" fill="seagreen" />\n</svg>',
      },
      {
        type: 'p',
        text: 'Coordinates start at the top-left corner and grow right and down — y increases as you go down, the opposite of math class. Every shape lands on that grid, so a quick pencil sketch before coding never hurts.',
      },
      {
        type: 'tip',
        text: 'Inline SVG is real markup. The inspector shows every shape. Later, CSS and JavaScript can style and animate each shape individually.',
      },
    ],
    exercise: {
      instructions:
        'Draw your first vector: add an <svg> with width="120" and height="120", containing a <circle> centered at cx="60" cy="60" with r="50" and any fill color you like.',
      hints: [
        'The <svg> tag opens a drawing area. Put it where the comment says. Then add a <circle> element inside it.',
        'Write <svg width="120" height="120"> and inside it put <circle cx="60" cy="60" r="50" fill="seagreen" />. Close the svg with </svg>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>My first drawing</h1>\n    <svg width="120" height="120">\n      <circle cx="60" cy="60" r="50" fill="seagreen" />\n    </svg>\n\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>My first drawing</h1>\n    <!-- svg goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'svg',
          label: 'The page has an <svg> drawing area',
          hint: 'Add an <svg width="120" height="120"> element to the page.',
        },
        {
          type: 'selectorExists',
          selector: 'svg circle',
          label: 'A <circle> sits inside the svg',
          hint: 'Put a <circle cx="60" cy="60" r="50" fill="..."> inside your <svg>.',
        },
      ],
    },
  },
  {
    id: 'html-svg-2',
    blocks: [
      {
        type: 'p',
        text: 'Circles have siblings. <rect> draws rectangles from a top-left corner: x and y place it, width and height set its size, and rx optionally rounds the corners. <line> connects two points — x1,y1 to x2,y2. Because a line has no inside, you color it with stroke and thicken it with stroke-width, not fill.',
      },
      {
        type: 'p',
        text: 'When the basic shapes are not enough, <path> draws anything. Its d attribute is a mini language of move, line, and curve commands, like "M10 80 L50 20 L90 80". In practice you will paste paths from design tools much more often than you write them. Recognizing one is enough for now.',
      },
      {
        type: 'code',
        text: '<svg width="120" height="120">\n  <rect x="35" y="60" width="50" height="40" fill="peru" />\n  <line x1="60" y1="60" x2="60" y2="20"\n        stroke="forestgreen" stroke-width="6" />\n</svg>',
      },
      {
        type: 'tip',
        text: 'fill paints the inside. stroke paints the outline. Most shapes accept both. Lines have no inside, so they only respond to stroke.',
      },
    ],
    exercise: {
      instructions:
        'Grow the scene: inside the <svg>, add a <rect> flower pot (try x="35" y="60" width="50" height="40" with a fill) and a <line> stem from 60,60 up to 60,20 with a stroke color and stroke-width.',
      hints: [
        'You need two new shapes inside the svg. <rect> draws a rectangle using x, y, width, height, and fill. <line> draws a line using x1, y1, x2, y2, stroke, and stroke-width.',
        'Add <rect x="35" y="60" width="50" height="40" fill="peru" /> for the pot and <line x1="60" y1="60" x2="60" y2="20" stroke="forestgreen" stroke-width="4" /> for the stem.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <svg width="120" height="120">\n      <circle cx="60" cy="18" r="10" fill="hotpink" />\n      <rect x="35" y="60" width="50" height="40" fill="peru" />\n      <line x1="60" y1="60" x2="60" y2="20" stroke="forestgreen" stroke-width="4" />\n    </svg>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <svg width="120" height="120">\n      <circle cx="60" cy="18" r="10" fill="hotpink" />\n      <!-- pot and stem go here -->\n    </svg>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'svg rect',
          label: 'A <rect> pot anchors the drawing',
          hint: 'Add <rect x="35" y="60" width="50" height="40" fill="peru" /> inside the svg.',
        },
        {
          type: 'selectorExists',
          selector: 'svg line',
          label: 'A <line> stem connects pot and bloom',
          hint: 'Add <line x1="60" y1="60" x2="60" y2="20" stroke="green" stroke-width="4" /> inside the svg.',
        },
      ],
    },
  },
  {
    id: 'html-svg-3',
    blocks: [
      {
        type: 'p',
        text: 'So far width and height did two jobs at once: sizing the drawing on screen and defining your coordinate space. viewBox splits those two jobs. viewBox="0 0 100 100" declares "my coordinates run from 0,0 to 100,100". After that, width and height only decide how large the canvas appears on screen.',
      },
      {
        type: 'p',
        text: 'That split is the Scalable in SVG. Design once in viewBox coordinates and display at any size. width="300" shows the same drawing three times larger, every shape scaling together. Leave width and height off and the svg stretches to fit whatever space it is given.',
      },
      {
        type: 'code',
        text: '<svg viewBox="0 0 100 100" width="300">\n  <circle cx="50" cy="50" r="40" fill="goldenrod" />\n</svg>',
      },
      {
        type: 'tip',
        text: 'The four viewBox numbers are min-x, min-y, width, height. "0 0 100 100" is the most common choice and a solid default.',
      },
    ],
    exercise: {
      instructions:
        'Make the badge scalable: give the <svg> a viewBox="0 0 100 100", then change its width to 300 so the same drawing displays three times larger. (The height attribute can go — viewBox keeps the proportions.)',
      hints: [
        'viewBox is an attribute on the <svg> tag itself. It tells the browser what coordinate space your drawing uses. Once you add viewBox, changing width scales everything together.',
        'Add viewBox="0 0 100 100" to the <svg> tag, then change width="100" to width="300". You can remove the height attribute.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <svg viewBox="0 0 100 100" width="300">\n      <circle cx="50" cy="50" r="40" fill="goldenrod" />\n      <circle cx="50" cy="50" r="18" fill="white" />\n    </svg>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <svg width="100" height="100">\n      <circle cx="50" cy="50" r="40" fill="goldenrod" />\n      <circle cx="50" cy="50" r="18" fill="white" />\n    </svg>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'svg[viewBox]',
          label: 'The svg declares a viewBox',
          hint: 'Add viewBox="0 0 100 100" as an attribute on the <svg> tag.',
        },
        {
          type: 'attrEquals',
          selector: 'svg',
          attr: 'width',
          value: '300',
          label: 'The badge displays at width 300',
          hint: 'Change width="100" to width="300" on the <svg> tag.',
        },
      ],
    },
  },
  {
    id: 'html-svg-4',
    blocks: [
      {
        type: 'p',
        text: 'Sites repeat the same icons everywhere. SVG has a built-in answer: define a shape once inside a <symbol> with an id, then stamp copies wherever you want with <use href="#that-id">. The symbol itself shows nothing — it is a stencil waiting to be used.',
      },
      {
        type: 'p',
        text: 'An SVG full of symbols is called a sprite sheet. Each <use> takes x, width, and height to place and size its stamp. Because symbols carry their own viewBox, every stamp scales cleanly. Edit the symbol once and every copy updates — that is the whole point.',
      },
      {
        type: 'code',
        text: '<svg width="160" height="40">\n  <symbol id="leaf" viewBox="0 0 24 24">\n    <circle cx="12" cy="12" r="10" fill="olivedrab" />\n  </symbol>\n  <use href="#leaf" x="0" width="40" height="40" />\n  <use href="#leaf" x="60" width="40" height="40" />\n</svg>',
      },
      {
        type: 'tip',
        text: 'Older tutorials write xlink:href on <use>. That is the old spelling. Plain href is the modern one — use that.',
      },
    ],
    exercise: {
      instructions:
        'The leaf stencil is defined but never used. Stamp it twice: add two <use href="#leaf"> elements inside the svg — the first with x="0", the second with x="60", both with width="40" and height="40".',
      hints: [
        'The <symbol> is just a stencil. To show it on screen, you need <use> elements that point to it. The href attribute links to the symbol by its id.',
        'Add two <use> tags after the symbol: <use href="#leaf" x="0" width="40" height="40" /> and <use href="#leaf" x="60" width="40" height="40" />.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <svg width="160" height="40">\n      <symbol id="leaf" viewBox="0 0 24 24">\n        <circle cx="12" cy="12" r="10" fill="olivedrab" />\n      </symbol>\n      <use href="#leaf" x="0" width="40" height="40" />\n      <use href="#leaf" x="60" width="40" height="40" />\n    </svg>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <svg width="160" height="40">\n      <symbol id="leaf" viewBox="0 0 24 24">\n        <circle cx="12" cy="12" r="10" fill="olivedrab" />\n      </symbol>\n      <!-- stamp the leaf here, twice -->\n    </svg>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'svg use',
          count: 2,
          label: 'The leaf is stamped exactly twice with <use>',
          hint: 'Add two <use> elements inside the svg, one after the other.',
        },
        {
          type: 'attrEquals',
          selector: 'use',
          attr: 'href',
          value: '#leaf',
          label: 'The stamps reference the #leaf symbol',
          hint: 'Each <use> needs href="#leaf" to point at the symbol.',
        },
      ],
    },
  },
  {
    id: 'html-svg-5',
    blocks: [
      {
        type: 'p',
        text: 'Closing project: a logo drawn entirely in markup. SVG is perfect for logos — bold shapes, a wordmark, scales to any size. Yours will be a simple plant badge: a bloom, a pot, and the company name.',
      },
      {
        type: 'p',
        text: 'Plan it on the 0–100 grid. Put a <circle> up top for the bloom. Add a <rect> below for the pot. Set the name in <text> — SVG\'s type tool, placed by x and y like any shape (y marks the text baseline). Give the svg a viewBox so the logo scales anywhere, from hero banner to favicon.',
      },
      {
        type: 'code',
        text: '<svg viewBox="0 0 100 100" width="200">\n  <circle cx="50" cy="30" r="16" fill="tomato" />\n  <rect x="34" y="56" width="32" height="24" fill="peru" />\n  <text x="50" y="96" font-size="12"\n        text-anchor="middle">Sprout Co.</text>\n</svg>',
      },
      {
        type: 'p',
        text: 'One design tip: fewer shapes, bolder shapes. A logo has to work at tab-icon size. viewBox makes sure yours can.',
      },
      {
        type: 'tip',
        text: 'text-anchor="middle" centers text on its x coordinate. It is the easy way to center a wordmark at x="50".',
      },
    ],
    exercise: {
      instructions:
        'Draw the badge: give the <svg> a viewBox (try "0 0 100 100"), then add a <circle> bloom, a <rect> pot, and a <text> wordmark with your company name.',
      hints: [
        'You need four things on the <svg>: a viewBox attribute, a <circle>, a <rect>, and a <text> element. Plan your layout on the 0–100 grid: bloom at the top, pot in the middle, name at the bottom.',
        'Add viewBox="0 0 100 100" to the svg. Then add <circle cx="50" cy="30" r="16" fill="tomato" />, <rect x="34" y="56" width="32" height="24" fill="peru" />, and <text x="50" y="96" font-size="12" text-anchor="middle">Sprout Co.</text>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Brand studio</h1>\n    <svg viewBox="0 0 100 100" width="200" height="200">\n      <circle cx="50" cy="30" r="16" fill="tomato" />\n      <rect x="34" y="56" width="32" height="24" fill="peru" />\n      <text x="50" y="96" font-size="12" text-anchor="middle">Sprout Co.</text>\n    </svg>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Brand studio</h1>\n    <svg width="200" height="200">\n      <!-- bloom, pot, and wordmark -->\n\n    </svg>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'svg[viewBox]',
          label: 'The logo scales via a viewBox',
          hint: 'Add viewBox="0 0 100 100" as an attribute on the <svg> tag.',
        },
        {
          type: 'selectorExists',
          selector: 'svg circle',
          label: 'A <circle> bloom tops the badge',
        },
        {
          type: 'selectorExists',
          selector: 'svg rect',
          label: 'A <rect> pot grounds the badge',
        },
        {
          type: 'selectorExists',
          selector: 'svg text',
          label: 'A <text> wordmark names the company',
          hint: 'Add a <text> element inside the svg with your company name as its content.',
        },
      ],
    },
  },
];

export default lessons;
