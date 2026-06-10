// Topic: Text & Links (html-text-links) — 5 lessons.

const lessons = [
  {
    id: 'html-text-links-1',
    blocks: [
      {
        type: 'p',
        text: 'Plain paragraphs are fine, but real writing has emphasis. HTML gives you tags that add meaning to words right inside a sentence. The two you will use constantly are <strong> for something important and <em> for something stressed — say the sentence out loud and <em> is the word your voice leans on.',
      },
      {
        type: 'code',
        text: '<p>\n  <strong>Warning:</strong> the kettle is\n  <em>extremely</em> hot.\n</p>',
      },
      {
        type: 'p',
        text: 'Browsers show <strong> as bold and <em> as italics, but the meaning is the point: screen readers can change tone for them, and search engines treat them as signals. There are more in the family — <mark> highlights text like a marker pen, and <small> is for fine print.',
      },
      {
        type: 'tip',
        text: 'You may meet <b> and <i> in old code. They only change looks. When the words really matter, reach for <strong> and <em> instead.',
      },
    ],
    exercise: {
      instructions:
        'Add emphasis to the sentence: wrap the words "every single day" in <strong>, and wrap the word "thirsty" in <em>.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <p>Seedlings are thirsty and need water every single day.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'p strong',
          label: 'The important words are wrapped in <strong>',
        },
        {
          type: 'selectorExists',
          selector: 'p em',
          label: 'One word gets stress with <em>',
        },
      ],
    },
  },
  {
    id: 'html-text-links-2',
    blocks: [
      {
        type: 'p',
        text: 'Every element belongs to one of two big families. Block elements — like <h1>, <p>, and <ul> — claim a whole line for themselves and stack vertically, like boxes on shelves. Inline elements — like <strong>, <em>, and <a> — flow along inside the text without breaking the line, like beads on a string.',
      },
      {
        type: 'code',
        text: '<p>Blocks stack.</p>\n<p>This <span>flows</span> inline.</p>',
      },
      {
        type: 'p',
        text: 'Each family has a generic, meaning-free member: <div> is a plain block box and <span> is a plain inline wrapper. They say nothing about their contents — they exist so you can group things, usually to style them later with CSS. Use them when no meaningful tag fits.',
      },
      {
        type: 'tip',
        text: 'A quick gut-check: would you want a line break before and after it? Then it is block. Should it sit inside a sentence? Inline.',
      },
    ],
    exercise: {
      instructions:
        'The body holds two bare sentences. Wrap each sentence in its own <p> so they become two stacked blocks, then wrap the single word "canopy" in a <span> so you have an inline wrapper to style later.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    The canopy filters sunlight into soft shade.\n    Beneath it, seedlings wait their turn.\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'p',
          count: 2,
          label: 'Each sentence lives in its own <p> (two in total)',
        },
        {
          type: 'selectorExists',
          selector: 'p span',
          label: 'The word "canopy" is wrapped in a <span>',
        },
      ],
    },
  },
  {
    id: 'html-text-links-3',
    blocks: [
      {
        type: 'p',
        text: 'Links are the “hyper” in HyperText. The anchor element, <a>, turns anything into something clickable, and its href attribute says where clicking leads. Everything between the opening and closing tag becomes the clickable part.',
      },
      {
        type: 'code',
        text: '<a href="https://example.com">Visit Example</a>\n<a href="about.html">About us</a>\n<a href="#top">Back to top</a>',
      },
      {
        type: 'p',
        text: 'An href starting with https:// is absolute — it can point anywhere on the web. A plain filename like about.html is relative — it points to a page sitting next to yours. And #something jumps to a spot on the same page. Make the link text describe the destination: "Visit Example" beats "click here" every time.',
      },
      {
        type: 'tip',
        text: 'Forget the href and the anchor stops acting like a link at all — no pointer cursor, no click. The attribute is what brings it to life.',
      },
    ],
    exercise: {
      instructions:
        'Under the paragraph, add a link: an <a> element whose href is https://example.com and whose text reads "Visit Example".',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <p>My favorite practice website:</p>\n    <!-- your link goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'a',
          label: 'Your page has a link',
        },
        {
          type: 'attrEquals',
          selector: 'a',
          attr: 'href',
          value: 'https://example.com',
          label: 'The link points to https://example.com',
        },
      ],
    },
  },
  {
    id: 'html-text-links-4',
    blocks: [
      {
        type: 'p',
        text: 'Images arrive with the <img> element. It is a void element — no closing tag — and it needs two attributes: src, the path to the picture, and alt, a short text description. The alt text appears if the image fails to load, and it is what screen readers speak aloud, so write what the picture shows.',
      },
      {
        type: 'code',
        text: '<figure>\n  <img src="oak.png" alt="A young oak in a clay pot">\n  <figcaption>Day 40: first real branch.</figcaption>\n</figure>',
      },
      {
        type: 'p',
        text: 'When an image deserves a visible caption, wrap the pair in a <figure>. The <figcaption> inside it is the caption the browser shows on the page — different job from alt, which is the description for when the image cannot be seen. A good figure often has both.',
      },
      {
        type: 'tip',
        text: 'Do not panic if your editor shows a broken-image icon — with a placeholder src like oak.png that is expected. The HTML is still correct.',
      },
    ],
    exercise: {
      instructions:
        'Add a captioned photo: a <figure> containing an <img> with src="oak.png" and a short alt description, followed by a <figcaption> with your caption.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Growth log</h1>\n    <!-- your figure goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'figure img',
          label: 'A <figure> holds your image',
        },
        {
          type: 'selectorExists',
          selector: 'img[alt]',
          label: 'The image has alt text',
        },
        {
          type: 'selectorExists',
          selector: 'figcaption',
          label: 'A <figcaption> captions it',
        },
      ],
    },
  },
  {
    id: 'html-text-links-5',
    blocks: [
      {
        type: 'p',
        text: 'You now know enough to write a real piece of web content: paragraphs with emphasis, links that lead somewhere, and captioned images. Time to combine them into one page — a short set of field notes about a tree you (let us pretend) have been watching all spring.',
      },
      {
        type: 'p',
        text: 'Approach it like a writer, not a robot. Say something in a paragraph and bold the key phrase. Point readers somewhere useful with a descriptive link. Show, not just tell, with a captioned figure. Each element earns its place.',
      },
      {
        type: 'code',
        text: '<p>The oak grew <strong>two feet</strong>.</p>\n<a href="https://example.com">Tree society</a>\n<figure>\n  <img src="oak.png" alt="…">\n  <figcaption>…</figcaption>\n</figure>',
      },
      {
        type: 'tip',
        text: 'Order matters for readers: introduce first, then show the picture, then link out. Pages read top to bottom, just like prose.',
      },
    ],
    exercise: {
      instructions:
        'Finish the field notes inside <main>: write a <p> with one phrase wrapped in <strong>, add an <a> linking to https://example.com, and add a <figure> with an <img> (src="oak.png", with alt text) plus a <figcaption>.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Field Notes: The Old Oak</h1>\n    </header>\n    <main>\n      <!-- paragraph, link, then figure -->\n\n    </main>\n    <footer>Spring 2026</footer>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'p strong',
          label: 'A paragraph bolds its key phrase with <strong>',
        },
        {
          type: 'selectorExists',
          selector: 'a[href]',
          label: 'A link leads somewhere (href is set)',
        },
        {
          type: 'selectorExists',
          selector: 'img[alt]',
          label: 'Your image has alt text',
        },
        {
          type: 'selectorExists',
          selector: 'figure figcaption',
          label: 'The figure includes a <figcaption>',
        },
      ],
    },
  },
];

export default lessons;
