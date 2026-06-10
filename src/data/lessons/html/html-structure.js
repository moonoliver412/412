// Topic: Document Structure (html-structure) — 5 lessons.

const lessons = [
  {
    id: 'html-structure-1',
    blocks: [
      {
        type: 'p',
        text: 'Every web page you have ever visited — every shop, game, and meme — is an HTML document underneath. HTML is not a programming language; it is a labelling system. You wrap pieces of content in tags, and each tag tells the browser what that piece is.',
      },
      {
        type: 'p',
        text: 'A tag is a name in angle brackets. Most come in pairs: an opening tag like <h1> and a closing tag like </h1>, with content between them. The whole sandwich — opening tag, content, closing tag — is called an element.',
      },
      {
        type: 'code',
        text: '<!doctype html>\n<html>\n  <head>\n    <!-- info about the page -->\n  </head>\n  <body>\n    <!-- what people actually see -->\n  </body>\n</html>',
      },
      {
        type: 'p',
        text: 'This skeleton is the anatomy of every page: <!doctype html> tells the browser this is modern HTML, <html> wraps everything, <head> holds behind-the-scenes information, and <body> holds everything visible. Anything you want people to see goes inside <body>.',
      },
      {
        type: 'tip',
        text: 'The closing tag is the same name with a slash: </h1>. If you forget it, the browser guesses where the element ends — and it often guesses wrong.',
      },
    ],
    exercise: {
      instructions:
        'Inside the <body>, add an <h1> element containing the text "Hello, world!" — the traditional first words of every new coder.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <!-- your heading goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h1',
          label: 'Your page has an <h1> heading',
        },
        {
          type: 'textIncludes',
          text: 'hello',
          selector: 'h1',
          label: 'The heading says hello',
        },
      ],
    },
  },
  {
    id: 'html-structure-2',
    blocks: [
      {
        type: 'p',
        text: 'A page has two halves with very different jobs. The <body> is the stage: everything inside it gets drawn on screen. The <head> is backstage: settings and information about the page that the browser reads but never displays in the page itself.',
      },
      {
        type: 'p',
        text: 'The two most important residents of <head> are <title> and <meta>. The title is the text you see in the browser tab and in search results. Meta tags carry metadata — data about the page — like which character set it uses.',
      },
      {
        type: 'code',
        text: '<head>\n  <meta charset="utf-8">\n  <title>My Tree House</title>\n</head>',
      },
      {
        type: 'p',
        text: 'charset="utf-8" tells the browser how to decode text so that accents, emoji, and symbols display correctly. Notice that <meta> has no closing tag — it carries all its information in attributes, the name="value" pairs inside the opening tag.',
      },
      {
        type: 'tip',
        text: 'If a page ever shows garbled characters like â€™ instead of an apostrophe, a missing charset is usually the culprit.',
      },
    ],
    exercise: {
      instructions:
        'Give this page a working backstage: inside <head>, add a <title> that says "My Tree House" and a <meta> tag with charset="utf-8".',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <!-- title and meta go here -->\n\n  </head>\n  <body>\n    <p>Welcome up the ladder.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'title',
          label: 'Your page has a <title>',
        },
        {
          type: 'selectorExists',
          selector: 'meta[charset]',
          label: 'A <meta> tag declares the character set',
        },
      ],
    },
  },
  {
    id: 'html-structure-3',
    blocks: [
      {
        type: 'p',
        text: 'Headings give a page its outline, exactly like chapters and sub-chapters in a book. HTML gives you six levels, <h1> down to <h6>. The <h1> is the title of the whole page — use it once. <h2>s are the main sections, <h3>s are subsections inside them, and so on.',
      },
      {
        type: 'p',
        text: 'Everything that is not a heading usually lives in a <p>, a paragraph. Browsers add a little breathing room around each one. Line breaks you type inside your code do not matter: the browser collapses them, and only the tags decide where paragraphs start and end.',
      },
      {
        type: 'code',
        text: '<h1>My Garden Journal</h1>\n<h2>Week one</h2>\n<p>Planted three seeds.</p>\n<p>Watered them. Stared at dirt.</p>',
      },
      {
        type: 'tip',
        text: 'Pick heading levels by meaning, never by size. If an <h2> looks too big, that is a job for CSS later — not a reason to grab an <h4>.',
      },
    ],
    exercise: {
      instructions:
        'The journal has a title but no entries. Below the <h1>, add an <h2> for the first section (try "Week one") and a <p> describing what happened.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>My Garden Journal</h1>\n    <!-- add a section heading and a paragraph -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h2',
          label: 'There is an <h2> section heading',
        },
        {
          type: 'selectorExists',
          selector: 'p',
          label: 'There is a <p> with your journal entry',
        },
      ],
    },
  },
  {
    id: 'html-structure-4',
    blocks: [
      {
        type: 'p',
        text: 'Look at almost any website and you will spot the same zones: a banner across the top, the main content in the middle, and the fine print at the bottom. HTML has elements named after exactly these zones: <header>, <main>, and <footer>.',
      },
      {
        type: 'code',
        text: '<body>\n  <header>\n    <h1>Sprout City News</h1>\n  </header>\n  <main>\n    <p>All the headlines fit to grow.</p>\n  </main>\n  <footer>\n    <p>© 2026 Sprout City</p>\n  </footer>\n</body>',
      },
      {
        type: 'p',
        text: 'These section elements do not change how anything looks — they describe what each region is. That description is gold for screen readers (which can jump straight to <main>), for search engines, and for you, six months from now, trying to find your way around your own code. One rule to remember: a page gets exactly one <main>.',
      },
      {
        type: 'tip',
        text: 'Think of a newspaper: the masthead is your <header>, the news is your <main>, and the fine print is your <footer>.',
      },
    ],
    exercise: {
      instructions:
        'Give this page its zones: wrap the <h1> in a <header>, wrap the welcome paragraph in a <main>, and wrap the copyright line in a <footer>.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Maple & Co.</h1>\n    <p>Fine syrup since 1902.</p>\n    <p>© 2026 Maple & Co.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'header h1',
          label: 'The <h1> sits inside a <header>',
        },
        {
          type: 'selectorExists',
          selector: 'main p',
          label: 'The welcome paragraph sits inside <main>',
        },
        {
          type: 'selectorExists',
          selector: 'footer',
          label: 'The copyright line has a <footer> home',
        },
      ],
    },
  },
  {
    id: 'html-structure-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put the whole topic together. Every page you will ever build — portfolio, shop, blog — starts from the same skeleton: a head with a title, then a body organized into header, main, and footer. Build it once from scratch and it becomes muscle memory.',
      },
      {
        type: 'code',
        text: '<head>\n  <title>…</title>\n</head>\n<body>\n  <header> … </header>\n  <main> … </main>\n  <footer> … </footer>\n</body>',
      },
      {
        type: 'p',
        text: 'Work top to bottom: title first, then the visible zones. Put an <h1> inside the header so the page introduces itself, give the main at least one paragraph of real content, and sign off in the footer. Small page, professional bones.',
      },
      {
        type: 'tip',
        text: 'Type the skeleton out by hand instead of copy-pasting. Three or four repetitions and your fingers will know it forever.',
      },
    ],
    exercise: {
      instructions:
        'Build a page skeleton for a tree-care guide: a <title> saying "Tree Care 101" in the head, a <header> containing an <h1>, a <main> containing at least one <p> of advice, and a <footer> at the bottom.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n\n  </head>\n  <body>\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'title',
          label: 'Your page has a <title>',
        },
        {
          type: 'selectorExists',
          selector: 'header h1',
          label: 'A <header> introduces the page with an <h1>',
        },
        {
          type: 'selectorExists',
          selector: 'main p',
          label: '<main> holds at least one paragraph',
        },
        {
          type: 'selectorExists',
          selector: 'footer',
          label: 'The page signs off with a <footer>',
        },
      ],
    },
  },
];

export default lessons;
