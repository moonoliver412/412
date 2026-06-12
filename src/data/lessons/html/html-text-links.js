// Topic: Text & Links (html-text-links) — 5 lessons.

const lessons = [
  {
    id: 'html-text-links-1',
    blocks: [
      {
        type: 'p',
        text: 'Plain paragraphs are fine, but real writing has emphasis. HTML gives you tags that add meaning to words inside a sentence. The two you will use most are <strong> for something important and <em> for something stressed. Say the sentence out loud — <em> is the word your voice naturally emphasizes.',
      },
      {
        type: 'code',
        text: '<p>\n  <strong>Warning:</strong> the kettle is\n  <em>extremely</em> hot.\n</p>',
      },
      {
        type: 'p',
        text: 'Browsers show <strong> as bold and <em> as italic, but the meaning is the point. Screen readers can change tone for them, and search engines pay attention. There are more — <mark> highlights text like a highlighter pen, and <small> is for fine print.',
      },
      {
        type: 'tip',
        text: 'You may meet <b> and <i> in old code. They only change looks. When the words really matter, reach for <strong> and <em> instead.',
      },
    ],
    exercise: {
      instructions:
        'Add emphasis to the sentence: wrap the words "every single day" in <strong>, and wrap the word "thirsty" in <em>.',
      hints: [
        '<strong> and <em> are inline elements — they wrap words inside a sentence without breaking the line.',
        'Change the sentence so it reads: …are <em>thirsty</em> and need water <strong>every single day</strong>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <p>Seedlings are <em>thirsty</em> and need water <strong>every single day</strong>.</p>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <p>Seedlings are thirsty and need water every single day.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'p strong',
          label: 'The important words are wrapped in <strong>',
          hint: 'Wrap the words "every single day" in a <strong> element inside the <p>.',
        },
        {
          type: 'selectorExists',
          selector: 'p em',
          label: 'One word gets stress with <em>',
          hint: 'Wrap the word "thirsty" in an <em> element inside the <p>.',
        },
      ],
    },
  },
  {
    id: 'html-text-links-2',
    blocks: [
      {
        type: 'p',
        text: 'Every element belongs to one of two groups. Block elements — like <h1>, <p>, and <ul> — take up a full line and stack on top of each other. Inline elements — like <strong>, <em>, and <a> — flow inside the text without breaking the line.',
      },
      {
        type: 'code',
        text: '<p>Blocks stack.</p>\n<p>This <span>flows</span> inline.</p>',
      },
      {
        type: 'p',
        text: 'Each group has a plain, meaning-free member. <div> is a block box and <span> is an inline wrapper. Neither says anything about its contents. They exist so you can group things, usually to style them later with CSS. Use them only when no meaningful tag fits.',
      },
      {
        type: 'tip',
        text: 'A quick gut-check: would you want a line break before and after it? Then it is block. Should it sit inside a sentence? Inline.',
      },
    ],
    exercise: {
      instructions:
        'The body holds two bare sentences. Wrap each sentence in its own <p> so they become two stacked blocks, then wrap the single word "canopy" in a <span> so you have an inline wrapper to style later.',
      hints: [
        'Block elements like <p> stack on top of each other. Inline elements like <span> sit inside a sentence without breaking it.',
        'Wrap each sentence in <p>…</p>, so you have exactly two. Then inside the first <p>, wrap just the word "canopy" in <span>canopy</span>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <p>The <span>canopy</span> filters sunlight into soft shade.</p>\n    <p>Beneath it, seedlings wait their turn.</p>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    The canopy filters sunlight into soft shade.\n    Beneath it, seedlings wait their turn.\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'p',
          count: 2,
          label: 'Each sentence lives in its own <p> (two in total)',
          hint: 'The page needs exactly two <p> elements — one per sentence.',
        },
        {
          type: 'selectorExists',
          selector: 'p span',
          label: 'The word "canopy" is wrapped in a <span>',
          hint: 'Add a <span> inside one of the <p> elements, wrapping the word "canopy".',
        },
      ],
    },
  },
  {
    id: 'html-text-links-3',
    blocks: [
      {
        type: 'p',
        text: 'Links are the “hyper” in HyperText Markup Language. The anchor element, <a>, turns anything into a clickable link. Its href attribute — short for “hypertext reference” — says where clicking leads. Everything between the opening and closing tag becomes the clickable part.',
      },
      {
        type: 'code',
        text: '<a href="https://example.com">Visit Example</a>\n<a href="about.html">About us</a>\n<a href="#top">Back to top</a>',
      },
      {
        type: 'p',
        text: 'An href starting with https:// is an absolute link — it can point anywhere on the web. A plain filename like about.html is a relative link — it points to a page next to yours. And #something jumps to a spot on the same page. Make the link text describe the destination: "Visit Example" is much better than "click here".',
      },
      {
        type: 'tip',
        text: 'Forget the href and the anchor stops acting like a link at all — no pointer cursor, no click. The attribute is what brings it to life.',
      },
    ],
    exercise: {
      instructions:
        'Under the paragraph, add a link: an <a> element whose href is https://example.com and whose text reads "Visit Example".',
      hints: [
        'The <a> element creates links. The href attribute says where the link goes — it is what brings the link to life.',
        'Add <a href="https://example.com">Visit Example</a> below the paragraph.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <p>My favorite practice website:</p>\n    <a href="https://example.com">Visit Example</a>\n\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <p>My favorite practice website:</p>\n    <!-- your link goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'a',
          label: 'Your page has a link',
          hint: 'Add an <a> element to the page.',
        },
        {
          type: 'attrEquals',
          selector: 'a',
          attr: 'href',
          value: 'https://example.com',
          label: 'The link points to https://example.com',
          hint: 'Set the href attribute to exactly https://example.com (include the https://).',
        },
      ],
    },
  },
  {
    id: 'html-text-links-4',
    blocks: [
      {
        type: 'p',
        text: 'Images use the <img> element. It is a void element — meaning no closing tag. It needs two attributes every time. src is the path to the picture. alt is a short text description — what screen readers speak aloud, and what shows if the image fails to load. Write what the picture actually shows.',
      },
      {
        type: 'code',
        text: '<figure>\n  <img src="oak.png" alt="A young oak in a clay pot">\n  <figcaption>Day 40: first real branch.</figcaption>\n</figure>',
      },
      {
        type: 'p',
        text: 'When an image deserves a visible caption, wrap the pair in a <figure>. The <figcaption> inside it is the caption shown on the page. That is a different job from alt — alt is the description for when the image cannot be seen. A good figure often has both.',
      },
      {
        type: 'tip',
        text: 'Do not panic if your editor shows a broken-image icon — with a placeholder src like oak.png that is expected. The HTML is still correct.',
      },
    ],
    exercise: {
      instructions:
        'Add a captioned photo: a <figure> containing an <img> with src="oak.png" and a short alt description, followed by a <figcaption> with your caption.',
      hints: [
        'A <figure> is a container for an image and its caption. Put the <img> and the <figcaption> inside it.',
        'Write <figure><img src="oak.png" alt="your description here"><figcaption>Your caption</figcaption></figure>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Growth log</h1>\n    <figure>\n      <img src="oak.png" alt="A young oak sapling in a clay pot">\n      <figcaption>Day 40: first real branch.</figcaption>\n    </figure>\n\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Growth log</h1>\n    <!-- your figure goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'figure img',
          label: 'A <figure> holds your image',
          hint: 'Wrap your <img> inside a <figure> element.',
        },
        {
          type: 'selectorExists',
          selector: 'img[alt]',
          label: 'The image has alt text',
          hint: 'Add an alt attribute to your <img> with a description of the photo.',
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
        text: 'You now know enough to write a real piece of web content: paragraphs with emphasis, links that lead somewhere, and captioned images. Time to combine them into one page — a short set of field notes about a tree you have been watching.',
      },
      {
        type: 'p',
        text: 'Think like a writer. Say something in a paragraph and bold the key phrase. Point readers somewhere useful with a descriptive link. Show your subject with a captioned figure. Each element should earn its place.',
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
      hints: [
        'You need three things inside <main>: a paragraph with a <strong> phrase, an <a> link, and a <figure> with an image and caption.',
        'Add <p>The oak grew <strong>two feet</strong> this season.</p>, then <a href="https://example.com">Tree society</a>, then a <figure> with an <img src="oak.png" alt="…"> and a <figcaption>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Field Notes: The Old Oak</h1>\n    </header>\n    <main>\n      <p>The oak grew <strong>two feet</strong> this season.</p>\n      <a href="https://example.com">Tree society</a>\n      <figure>\n        <img src="oak.png" alt="The old oak in full leaf">\n        <figcaption>The old oak, summer 2026.</figcaption>\n      </figure>\n\n    </main>\n    <footer>Spring 2026</footer>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Field Notes: The Old Oak</h1>\n    </header>\n    <main>\n      <!-- paragraph, link, then figure -->\n\n    </main>\n    <footer>Spring 2026</footer>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'p strong',
          label: 'A paragraph bolds its key phrase with <strong>',
          hint: 'Add a <p> containing a <strong> element around one phrase.',
        },
        {
          type: 'selectorExists',
          selector: 'a[href]',
          label: 'A link leads somewhere (href is set)',
          hint: 'Add an <a> element with an href attribute.',
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
