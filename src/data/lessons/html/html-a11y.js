// Topic: Accessibility Basics (html-a11y) — 5 lessons.

const lessons = [
  {
    id: 'html-a11y-1',
    blocks: [
      {
        type: 'p',
        text: 'Accessibility — a11y for short, because eleven letters sit between the a and the y — means building pages that work for everyone: people using screen readers, people navigating by keyboard, people zoomed in to 400%. Here is the encouraging secret: most of it is not extra work. It is the HTML you already know, used honestly.',
      },
      {
        type: 'p',
        text: 'Start with images. The alt attribute is what a screen reader speaks in place of the picture, so describe what matters: alt="A robin perched on a snowy branch", not alt="photo". If an image is purely decorative, give it an empty alt="" and screen readers skip it in silence. Leave alt off entirely and many will read the filename aloud instead — riveting stuff like IMG-4032.jpg.',
      },
      {
        type: 'p',
        text: 'Headings come next, because screen-reader users often pull up a list of a page’s headings and navigate from it like a table of contents. That only works when levels descend without gaps: <h1>, then <h2>, then <h3>. Jumping straight from <h1> to <h4> tears holes in the outline.',
      },
      {
        type: 'code',
        text: '<h1>Backyard bird guide</h1>\n<h2>Garden birds</h2>\n<h3>Robins</h3>\n<img src="robin.png" alt="A robin on a snowy branch">',
      },
      {
        type: 'tip',
        text: 'Stuck on alt text? Imagine reading the page to a friend over the phone — whatever you would say when you reach the picture is the alt text.',
      },
    ],
    exercise: {
      instructions:
        'Two barriers to fix: the section heading jumps from <h1> straight to <h4>, and the photo says nothing. Change the <h4> into an <h2>, and give the <img> an alt attribute describing the robin.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Backyard bird guide</h1>\n    <h4>Robins</h4>\n    <p>Friendly, round, and always first to the feeder.</p>\n    <img src="robin.png">\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h2',
          label: 'The section heading is now an <h2>',
        },
        {
          type: 'selectorCount',
          selector: 'h4',
          count: 0,
          label: 'No more skipped levels — the <h4> is gone',
        },
        {
          type: 'selectorExists',
          selector: 'img[alt]',
          label: 'The robin photo has alt text',
        },
      ],
    },
  },
  {
    id: 'html-a11y-2',
    blocks: [
      {
        type: 'p',
        text: 'You wired <label> to inputs with for and id back in Forms & Media. Now, the why. A screen reader landing on an unlabelled input announces only "edit text" — a question with the question missing. Connect a label and it announces "Your name, edit text" instead. The difference between guessing and knowing, in one attribute pair.',
      },
      {
        type: 'p',
        text: 'Tempted to let placeholder do the job? It cannot. Placeholder text vanishes the instant someone types, is often too faint to read, and some assistive software ignores it entirely. It is a hint, never a name. Labels also help people with unsteady hands: clicking a label focuses its control, doubling the size of the target. Every <input>, <select>, and <textarea> deserves exactly one.',
      },
      {
        type: 'code',
        text: '<label for="name">Your name</label>\n<input id="name" type="text">\n\n<label for="notes">Delivery notes</label>\n<textarea id="notes"></textarea>',
      },
      {
        type: 'tip',
        text: 'Test like a user: click every label on your page. If the matching box does not light up with focus, the for/id pair is broken.',
      },
    ],
    exercise: {
      instructions:
        'These fields only have placeholders, which many users never hear. Above each input, add a <label>: one with for="name" that says "Name", and one with for="email" that says "Email".',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <input id="name" type="text" placeholder="Name">\n      <input id="email" type="email" placeholder="Email">\n      <button>Join the club</button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'label',
          attr: 'for',
          value: 'name',
          label: 'The name field has a connected <label>',
        },
        {
          type: 'attrEquals',
          selector: 'label',
          attr: 'for',
          value: 'email',
          label: 'The email field has a connected <label>',
        },
      ],
    },
  },
  {
    id: 'html-a11y-3',
    blocks: [
      {
        type: 'p',
        text: 'Occasionally HTML has no element that says what you mean. ARIA — Accessible Rich Internet Applications — is a set of attributes for exactly those gaps. The two you will use first: role, which declares what something is, and aria-label, which gives an element a spoken name when it shows no visible text.',
      },
      {
        type: 'p',
        text: 'Now the famous first rule of ARIA: do not use ARIA when a real element exists. A <div role="button"> claims to be a button but brings none of the keyboard behavior; a real <button> brings everything. Where ARIA earns its keep is the icon-only button — sighted visitors see a magnifying glass, but a screen reader finds an empty, nameless button unless you hand it aria-label="Search". And role="search" turns a form into a landmark, jumpable like <nav> and <main>.',
      },
      {
        type: 'code',
        text: '<form role="search">\n  <label for="q">Find a plant</label>\n  <input id="q" type="text">\n  <button aria-label="Search">\n    <img src="magnifier.png" alt="">\n  </button>\n</form>',
      },
      {
        type: 'tip',
        text: 'No ARIA beats bad ARIA. A wrong role tells a confident lie; a plain element at least tells the truth.',
      },
    ],
    exercise: {
      instructions:
        'Make the search form speak up: add role="search" to the <form>, and give the icon-only button an aria-label of "Search" so screen readers know what it does.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="q">Find a bird</label>\n      <input id="q" type="text">\n      <button>\n        <img src="magnifier.png" alt="">\n      </button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'form',
          attr: 'role',
          value: 'search',
          label: 'The form is a search landmark (role="search")',
        },
        {
          type: 'selectorExists',
          selector: 'button[aria-label]',
          label: 'The icon button has a spoken name',
        },
      ],
    },
  },
  {
    id: 'html-a11y-4',
    blocks: [
      {
        type: 'p',
        text: 'Plenty of people browse without a mouse — a broken wrist, a tremor, a screen reader, or sheer speed. Their world is the Tab key: each press moves focus to the next interactive element, Shift+Tab steps back, and Enter activates. Links, buttons, and form fields join this chain automatically. A clickable <div> does not — Tab sails straight past it, so for keyboard users it may as well not exist.',
      },
      {
        type: 'p',
        text: 'Two habits cover most of it. First: anything clickable must be a real <a> (goes somewhere) or <button> (does something) — never a styled <div>. Second: offer a skip link, the kindest trick in web development. It is simply the first link on the page, pointing at <main id="main">, so a keyboard user’s very first Tab can leap over the entire menu instead of stepping through every link in it.',
      },
      {
        type: 'code',
        text: '<body>\n  <a href="#main">Skip to content</a>\n  <header>…the whole menu…</header>\n  <main id="main">\n    <button>Adopt this tree</button>\n  </main>\n</body>',
      },
      {
        type: 'tip',
        text: 'Try it now: put the mouse down and Tab through a site you love. You will feel immediately where the focus order is kind — and where it is chaos.',
      },
    ],
    exercise: {
      instructions:
        'Two keyboard fixes: add a skip link as the first thing inside <body> — an <a> with href="#main" saying "Skip to content" — and turn the fake <div> button into a real <button>.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Adopt-a-Tree</h1>\n      <a href="/trees">All trees</a>\n    </header>\n    <main id="main">\n      <p>Every sapling needs a sponsor.</p>\n      <div>Adopt this tree</div>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'a',
          attr: 'href',
          value: '#main',
          label: 'A skip link jumps straight to #main',
        },
        {
          type: 'selectorExists',
          selector: 'main button',
          label: 'Adopting happens with a real <button>',
        },
        {
          type: 'selectorCount',
          selector: 'div',
          count: 0,
          label: 'The fake <div> button is gone',
        },
      ],
    },
  },
  {
    id: 'html-a11y-5',
    blocks: [
      {
        type: 'p',
        text: 'Final lesson: you become the auditor. A teammate shipped the page below and complaints are arriving — and you, pleasingly, now know how to find every problem. An accessibility audit is nothing mystical; it is a calm pass through the page with a checklist, top to bottom, fixing as you go.',
      },
      {
        type: 'p',
        text: 'Your checklist from this topic: every <img> carries honest alt text (or an empty alt="" if decorative); heading levels descend without skipping; every form field has a connected <label>; and everything clickable is a real link or button. Four questions that catch a remarkable share of real-world barriers.',
      },
      {
        type: 'code',
        text: '<!-- found in the audit -->\n<h3>Meet the trees</h3>\n<img src="elm.png">\n\n<!-- fixed -->\n<h2>Meet the trees</h2>\n<img src="elm.png" alt="A young elm in a sunny meadow">',
      },
      {
        type: 'p',
        text: 'This is a genuine professional skill: teams run exactly this loop before every release, and the developer who can do it calmly — find, fix, re-check — is the one everybody wants around. Read the starter like an auditor, not an author: slowly, suspiciously, one element at a time.',
      },
      {
        type: 'tip',
        text: 'Audit in document order, top to bottom. Jumping around to whatever catches your eye is how barriers survive audits.',
      },
    ],
    exercise: {
      instructions:
        'Audit the page and fix all three barriers: give the elm photo an alt description, change the skipped <h3> into an <h2>, and add a <label> with for="email" above the email input.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Adopt-a-Tree</h1>\n    </header>\n    <main>\n      <h3>Meet the trees</h3>\n      <img src="elm.png">\n      <p>Elm, rowan, and one very dramatic willow.</p>\n      <form>\n        <input id="email" type="email" placeholder="Email">\n        <button>Get updates</button>\n      </form>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'img[alt]',
          label: 'The elm photo has alt text',
        },
        {
          type: 'selectorExists',
          selector: 'h2',
          label: 'The section heading is an <h2>',
        },
        {
          type: 'selectorCount',
          selector: 'h3',
          count: 0,
          label: 'No heading level is skipped',
        },
        {
          type: 'attrEquals',
          selector: 'label',
          attr: 'for',
          value: 'email',
          label: 'The email field has a connected <label>',
        },
      ],
    },
  },
];

export default lessons;
