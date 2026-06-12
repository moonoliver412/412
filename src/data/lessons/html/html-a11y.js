// Topic: Accessibility Basics (html-a11y) — 5 lessons.

const lessons = [
  {
    id: 'html-a11y-1',
    blocks: [
      {
        type: 'p',
        text: 'Accessibility — a11y for short, because eleven letters sit between the a and the y — means building pages that work for everyone. That includes people using screen readers, people navigating by keyboard, and people zoomed in to 400%. The good news: most of it is not extra work. It is the HTML you already know, used correctly.',
      },
      {
        type: 'p',
        text: 'Start with images. The alt attribute is what a screen reader speaks instead of showing the picture. Describe what matters: alt="A robin perched on a snowy branch", not alt="photo". If an image is purely decorative, write alt="" and screen readers skip it quietly. Leave alt off entirely and many readers will say the filename out loud — thrilling things like IMG-4032.jpg.',
      },
      {
        type: 'p',
        text: 'Headings come next. Screen-reader users often pull up a list of a page\'s headings and jump through them like a table of contents. That only works when levels go down without gaps: <h1>, then <h2>, then <h3>. Jumping from <h1> straight to <h4> breaks the outline.',
      },
      {
        type: 'code',
        text: '<h1>Backyard bird guide</h1>\n<h2>Garden birds</h2>\n<h3>Robins</h3>\n<img src="robin.png" alt="A robin on a snowy branch">',
      },
      {
        type: 'tip',
        text: 'Stuck on alt text? Imagine reading the page out loud to a friend. Whatever you would say when you reach the picture is the alt text.',
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
        text: 'You wired <label> to inputs with for and id back in Forms & Media. Now for the why. A screen reader landing on an unlabelled input says only "edit text" — no clue what to type. Connect a label and it says "Your name, edit text" instead. One attribute pair makes the difference between guessing and knowing.',
      },
      {
        type: 'p',
        text: 'Tempted to use placeholder instead of a label? Do not. Placeholder text vanishes the moment someone types, is often too faint to read, and some assistive software ignores it. It is a hint, never a label. Labels also help people with unsteady hands: clicking a label focuses its control, making the target much easier to hit. Every <input>, <select>, and <textarea> deserves exactly one label.',
      },
      {
        type: 'code',
        text: '<label for="name">Your name</label>\n<input id="name" type="text">\n\n<label for="notes">Delivery notes</label>\n<textarea id="notes"></textarea>',
      },
      {
        type: 'tip',
        text: 'Test it yourself: click every label on your page. If the matching box does not get focus, the for/id pair is broken.',
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
        text: 'Sometimes HTML has no element that says what you mean. ARIA — Accessible Rich Internet Applications — is a set of attributes for exactly those gaps. The two you will use first: role, which declares what something is, and aria-label, which gives an element a spoken name when it shows no visible text.',
      },
      {
        type: 'p',
        text: 'The first rule of ARIA: do not use ARIA when a real element already exists. A <div role="button"> says it is a button but brings none of the keyboard behavior. A real <button> brings everything. Where ARIA is genuinely useful is the icon-only button. Sighted visitors see a magnifying glass, but a screen reader finds an empty nameless button — unless you add aria-label="Search". And role="search" turns a form into a landmark, jumpable like <nav> and <main>.',
      },
      {
        type: 'code',
        text: '<form role="search">\n  <label for="q">Find a plant</label>\n  <input id="q" type="text">\n  <button aria-label="Search">\n    <img src="magnifier.png" alt="">\n  </button>\n</form>',
      },
      {
        type: 'tip',
        text: 'No ARIA is better than wrong ARIA. A bad role tells a confident lie. A plain element at least tells the truth.',
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
        text: 'Many people browse without a mouse — a broken wrist, a tremor, a screen reader, or just speed. Their world is the Tab key. Each press moves focus to the next interactive element. Shift+Tab steps back. Enter activates. Links, buttons, and form fields are in this chain automatically. A clickable <div> is not — Tab skips straight past it, so keyboard users cannot reach it at all.',
      },
      {
        type: 'p',
        text: 'Two habits cover most of the problem. First: anything clickable must be a real <a> (goes somewhere) or <button> (does something) — never a styled <div>. Second: add a skip link. It is the first link on the page and points at <main id="main">. A keyboard user\'s first Tab press can jump over the whole menu instead of stepping through every link one by one.',
      },
      {
        type: 'code',
        text: '<body>\n  <a href="#main">Skip to content</a>\n  <header>…the whole menu…</header>\n  <main id="main">\n    <button>Adopt this tree</button>\n  </main>\n</body>',
      },
      {
        type: 'tip',
        text: 'Try it now: put the mouse down and Tab through a site you like. You will feel right away where focus order is easy — and where it is a mess.',
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
        text: 'Final lesson: you become the auditor. Someone shipped the page below and problems are showing up. You now know how to find every one of them. An accessibility audit is not mysterious — it is a calm walk through the page with a checklist, top to bottom, fixing as you go.',
      },
      {
        type: 'p',
        text: 'Your checklist from this topic: every <img> has real alt text (or alt="" if decorative); heading levels go down without skipping; every form field has a connected <label>; and everything clickable is a real link or button. Four questions that catch most real-world barriers.',
      },
      {
        type: 'code',
        text: '<!-- found in the audit -->\n<h3>Meet the trees</h3>\n<img src="elm.png">\n\n<!-- fixed -->\n<h2>Meet the trees</h2>\n<img src="elm.png" alt="A young elm in a sunny meadow">',
      },
      {
        type: 'p',
        text: 'This is a real professional skill. Teams run this exact checklist before every release. Read the starter like an auditor, not a writer: slowly, carefully, one element at a time.',
      },
      {
        type: 'tip',
        text: 'Audit in document order, top to bottom. Jumping around is how problems survive audits.',
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
