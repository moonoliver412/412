// Topic: Images & Figures (html-images) — 5 lessons.

const lessons = [
  {
    id: 'html-images-1',
    blocks: [
      {
        type: 'p',
        text: 'A web page without pictures is a wall of text, so images get a whole topic of their own. You have met <img> before: a void element — no closing tag — that needs two attributes every single time. src points at the image file, and alt describes it in words.',
      },
      {
        type: 'p',
        text: 'Which file you point src at matters. JPG compresses photographs beautifully but smudges sharp edges. PNG keeps edges crisp and supports transparency — perfect for screenshots and logos with see-through corners. SVG stores drawings as math, so icons stay sharp at any size. And WebP is the modern all-rounder: photo-friendly like JPG, transparent like PNG, usually smaller than both.',
      },
      {
        type: 'code',
        text: '<img src="harbor.jpg" alt="Fishing boats at sunrise">\n<img src="logo.png" alt="Sprout Studio logo">',
      },
      {
        type: 'p',
        text: 'The alt-text habits from Accessibility Basics apply here in full force: describe what matters, as you would to a friend on the phone, and use an empty alt="" only when an image is pure decoration. Search engines read alt text too, so honest descriptions also help your photos get found.',
      },
      {
        type: 'tip',
        text: 'A quick chooser: photograph → JPG or WebP, screenshot or transparent logo → PNG, icon or diagram → SVG.',
      },
    ],
    exercise: {
      instructions:
        'Add a photo to the page: an <img> with src="harbor.jpg" (a placeholder filename is fine here — nothing needs to download) and an alt attribute describing fishing boats at sunrise.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Harbor mornings</h1>\n    <!-- your photo goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'img[src]',
          label: 'An <img> points at a file with src',
        },
        {
          type: 'selectorExists',
          selector: 'img[alt]',
          label: 'The photo has alt text',
        },
      ],
    },
  },
  {
    id: 'html-images-2',
    blocks: [
      {
        type: 'p',
        text: 'Phones, laptops, and 4K monitors all download the same page — but they should not all download the same image. A 2000-pixel-wide photo is wasted bandwidth on a small phone screen. The srcset attribute fixes this: you list several sizes of the same image, and the browser picks the best fit.',
      },
      {
        type: 'p',
        text: 'Each entry in srcset is a filename plus its real pixel width, written with a w: meadow-small.jpg 480w. The companion sizes attribute tells the browser how wide the image will actually display, so it can do the math and fetch the smallest file that still looks sharp.',
      },
      {
        type: 'code',
        text: '<img\n  src="meadow-small.jpg"\n  srcset="meadow-small.jpg 480w,\n          meadow-large.jpg 1200w"\n  sizes="(max-width: 600px) 90vw, 1200px"\n  alt="A meadow in full bloom">',
      },
      {
        type: 'p',
        text: 'Keep the plain src as a fallback for older browsers. And remember the browser, not you, makes the final call — it may even reuse a bigger image it already has in cache. Your job is only to offer honest options.',
      },
      {
        type: 'tip',
        text: 'The w numbers must match each file’s true pixel width. If you fib, browsers compute the wrong density and pick badly.',
      },
    ],
    exercise: {
      instructions:
        'The hero image ships one giant file to everyone. Add a srcset offering meadow-small.jpg 480w and meadow-large.jpg 1200w, plus a sizes attribute — "(max-width: 600px) 90vw, 1200px" works nicely.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Meadow watch</h1>\n    <img src="meadow-large.jpg" alt="A meadow in full bloom">\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'img[srcset]',
          label: 'The image offers multiple sizes via srcset',
        },
        {
          type: 'selectorExists',
          selector: 'img[sizes]',
          label: 'A sizes attribute tells the browser the display width',
        },
      ],
    },
  },
  {
    id: 'html-images-3',
    blocks: [
      {
        type: 'p',
        text: 'Some images are content with a caption — a photo in a news story, a chart in a report. HTML packages those as a <figure>: the image plus everything that belongs with it, and a <figcaption> holding the visible caption text.',
      },
      {
        type: 'p',
        text: 'The figcaption may sit first or last inside the figure, and there can be only one. Captions and alt text do different jobs: everyone sees the caption, while alt text replaces the image when it cannot be seen. Writing the same sentence in both wastes one of them.',
      },
      {
        type: 'code',
        text: '<figure>\n  <img src="aurora.jpg" alt="Green aurora over a pine forest">\n  <figcaption>Northern lights, photographed in March.</figcaption>\n</figure>',
      },
      {
        type: 'p',
        text: 'A figure can also hold two images sharing one caption, a code listing, or a poem — anything that could move to an appendix without breaking the surrounding text. That is the real test of whether <figure> is the right element.',
      },
      {
        type: 'tip',
        text: 'If deleting the image would leave the caption pointless, the two belong together in a <figure>.',
      },
    ],
    exercise: {
      instructions:
        'Promote this photo: wrap the <img> in a <figure>, and turn the paragraph below it into a <figcaption> inside the same figure.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Field notes</h1>\n    <img src="aurora.jpg" alt="Green aurora over a pine forest">\n    <p>Northern lights, photographed in March.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'figure img',
          label: 'The photo lives inside a <figure>',
        },
        {
          type: 'selectorExists',
          selector: 'figure figcaption',
          label: 'The figure has a <figcaption>',
        },
      ],
    },
  },
  {
    id: 'html-images-4',
    blocks: [
      {
        type: 'p',
        text: 'Two finishing touches for image-heavy pages. The first is old-school but charming: an image map makes regions of one image clickable. Give the <img> a usemap attribute pointing at a named <map>, and each <area> inside the map defines a clickable shape with coords, its own href, and its own alt.',
      },
      {
        type: 'p',
        text: 'The second is loading="lazy", one of the best performance bargains in HTML. It tells the browser not to download an image until the visitor scrolls near it. Use it on images far down the page — never on the first thing visitors see, which should load immediately.',
      },
      {
        type: 'code',
        text: '<img src="trail-map.png" alt="Park trail map" usemap="#trail">\n<map name="trail">\n  <area shape="rect" coords="0,0,120,80"\n        href="#lake" alt="Lake loop">\n</map>\n\n<img src="falls.jpg" alt="Willow Falls" loading="lazy">',
      },
      {
        type: 'tip',
        text: 'loading="lazy" is free speed, but browsers ignore it on images near the top of the page — those are already loading by the time the attribute is read.',
      },
    ],
    exercise: {
      instructions:
        'Two upgrades: connect the trail map image to its <map> by adding usemap="#trail", and add loading="lazy" to the waterfall photo at the bottom of the page.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Park guide</h1>\n    <img src="trail-map.png" alt="Park trail map">\n    <map name="trail">\n      <area shape="rect" coords="0,0,120,80" href="#lake" alt="Lake loop">\n      <area shape="rect" coords="120,0,240,80" href="#falls" alt="Falls path">\n    </map>\n    <p>Scroll on for photos from the falls path.</p>\n    <img src="falls.jpg" alt="Willow Falls after spring rain">\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'img',
          attr: 'usemap',
          value: '#trail',
          label: 'The trail map is wired to its <map> with usemap="#trail"',
        },
        {
          type: 'attrEquals',
          selector: 'img',
          attr: 'loading',
          value: 'lazy',
          label: 'The waterfall photo loads lazily',
        },
      ],
    },
  },
  {
    id: 'html-images-5',
    blocks: [
      {
        type: 'p',
        text: 'Project time: a photo gallery, the classic finale for an images topic. Galleries are where everything you just learned meets — figures give each photo a home, captions give context, alt text keeps it accessible, and lazy loading keeps it fast.',
      },
      {
        type: 'p',
        text: 'Structure first: a heading introduces the collection, then one <figure> per photo, each holding an <img> and a <figcaption>. With CSS (a later track) this exact markup becomes a responsive grid without changing a single tag — good structure now pays off later.',
      },
      {
        type: 'code',
        text: '<h1>Shoreline, 2026</h1>\n<figure>\n  <img src="dunes.jpg" alt="Grass-topped dunes at dusk">\n  <figcaption>Dunes, ten minutes before rain.</figcaption>\n</figure>\n<!-- …more figures… -->',
      },
      {
        type: 'p',
        text: 'Placeholder filenames like dunes.jpg are perfect — in this sandbox nothing actually downloads, and that is fine, because the structure is what we are practicing. Write each alt as if describing the shot aloud, and keep captions short.',
      },
      {
        type: 'tip',
        text: 'Real galleries put loading="lazy" on every image below the first row — feel free to add it here too.',
      },
    ],
    exercise: {
      instructions:
        'Build the gallery: an <h1> naming your collection, then exactly three <figure> elements — each holding an <img> with honest alt text plus a <figcaption>.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <title>My gallery</title>\n  </head>\n  <body>\n    <!-- heading, then three captioned figures -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h1',
          label: 'The gallery has an <h1> title',
        },
        {
          type: 'selectorCount',
          selector: 'figure',
          count: 3,
          label: 'Exactly three <figure> cards',
        },
        {
          type: 'selectorCount',
          selector: 'figure img[alt]',
          count: 3,
          label: 'Every figure holds an image with alt text',
        },
        {
          type: 'selectorCount',
          selector: 'figure figcaption',
          count: 3,
          label: 'Every figure has a caption',
        },
      ],
    },
  },
];

export default lessons;
