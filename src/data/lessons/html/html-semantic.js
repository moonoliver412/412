// Topic: Semantic HTML (html-semantic) — 5 lessons.

const lessons = [
  {
    id: 'html-semantic-1',
    blocks: [
      {
        type: 'p',
        text: 'Here is a strange fact: you could build a whole website with nothing but <div>s, style it with CSS, and it would look fine. So why does HTML offer dozens of named elements? Because looks are only part of the story. Your code is also read by screen readers, search engines, and other developers — and none of them can see the screen.',
      },
      {
        type: 'p',
        text: 'Semantic means "about meaning". A semantic element names what its content is. <h2> says "section title". <li> says "item in a list". <button> says "press me". A <div> says nothing at all. To a screen reader, a page of <div>s is one long unlabelled corridor. The same page with real tags is a building with a sign on every door.',
      },
      {
        type: 'code',
        text: '<!-- says nothing -->\n<div>Tuesday: water the ferns</div>\n\n<!-- says: this is a section heading -->\n<h2>Tuesday: water the ferns</h2>',
      },
      {
        type: 'p',
        text: 'Good news: you have been writing semantic HTML all along. Headings, paragraphs, lists, tables, and forms all carry meaning. This topic adds one habit: before reaching for a <div>, ask whether a tag already exists that says what this content is. Surprisingly often, one does.',
      },
      {
        type: 'tip',
        text: 'Read the tag name out loud. If it describes the content — "heading", "list item", "form" — it is semantic. If it just means "box", keep looking.',
      },
    ],
    exercise: {
      instructions:
        'This page renders fine but means nothing. Give it meaning: turn the first <div> into an <h1> and the second into a <p>, so that no <div>s remain.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <div>Sprout City Gazette</div>\n    <div>All the news from the garden, every morning.</div>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h1',
          label: 'The page title is a real <h1>',
        },
        {
          type: 'selectorExists',
          selector: 'p',
          label: 'The intro line is a <p>',
        },
        {
          type: 'selectorCount',
          selector: 'div',
          count: 0,
          label: 'No meaning-free <div>s remain',
        },
      ],
    },
  },
  {
    id: 'html-semantic-2',
    blocks: [
      {
        type: 'p',
        text: 'You met <header>, <main>, and <footer> in Document Structure. Now meet the fourth: <nav>, the wrapper for a block of major navigation links — the main menu, a table of contents. Together these four are called landmarks. Landmarks are page regions that assistive software — like screen readers — can jump between directly.',
      },
      {
        type: 'p',
        text: 'That jumping matters a lot. Imagine listening to a page through a screen reader. Without landmarks, every visit starts with the site name and every menu link before any content arrives. With them, one keystroke skips straight from <nav> to <main>. The usual layout is simple: <nav> lives inside the <header>, the unique content fills the one-per-page <main>, and the <footer> closes with the fine print.',
      },
      {
        type: 'code',
        text: '<header>\n  <h1>Fern & Frond</h1>\n  <nav>\n    <a href="/">Home</a>\n    <a href="/shop">Shop</a>\n  </nav>\n</header>',
      },
      {
        type: 'tip',
        text: 'Not every link needs a <nav> — reserve it for major blocks of navigation. A lone link inside a sentence is happy on its own.',
      },
    ],
    exercise: {
      instructions:
        'Complete the landmarks: wrap the two menu links in a <nav> (keep it inside the <header>), wrap the welcome paragraph in <main>, and give the copyright line a <footer>.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Fern & Frond</h1>\n      <a href="/">Home</a>\n      <a href="/shop">Shop</a>\n    </header>\n    <p>Hand-raised houseplants, posted to your door.</p>\n    <p>© 2026 Fern & Frond</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'header nav a',
          label: 'The menu links live in a <nav> inside the header',
        },
        {
          type: 'selectorExists',
          selector: 'main p',
          label: 'The welcome paragraph sits inside <main>',
        },
        {
          type: 'selectorExists',
          selector: 'footer',
          label: 'The fine print closes in a <footer>',
        },
      ],
    },
  },
  {
    id: 'html-semantic-3',
    blocks: [
      {
        type: 'p',
        text: 'Two containers remain — and they are the pair developers mix up most. An <article> is a self-contained piece that still makes sense on its own: a blog post, a news story, a product card, a comment. A <section> is a themed part of a larger whole, like one chapter of a guide. Quick test: could you hand it to someone on its own and it still makes sense? Use <article>. Only meaningful in context? Use <section>.',
      },
      {
        type: 'p',
        text: 'Both work best when they open with a heading. They can nest either way: a <section> grouping three related <article>s, or one long <article> divided into <section>s. When no meaning fits at all — you just need a box to style — that is the right moment for a <div>.',
      },
      {
        type: 'code',
        text: '<section>\n  <h2>This week in the greenhouse</h2>\n  <article>\n    <h3>The basil bolted</h3>\n    <p>It happens to the best of us.</p>\n  </article>\n</section>',
      },
      {
        type: 'tip',
        text: 'If you cannot think of a natural heading for it, it is probably not a <section> — it is just a box.',
      },
    ],
    exercise: {
      instructions:
        'Each diary entry should stand on its own. Wrap each heading-plus-paragraph pair in its own <article>, so the page ends up with two articles inside <main>.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <main>\n      <h1>Greenhouse Diary</h1>\n      <h2>The basil bolted</h2>\n      <p>Tall, proud, and suddenly bitter.</p>\n      <h2>Three new tomatoes</h2>\n      <p>Sun Gold, Tiny Tim, and a mystery seedling.</p>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'article',
          count: 2,
          label: 'Each entry is its own <article> (two in total)',
        },
        {
          type: 'selectorExists',
          selector: 'article h2',
          label: 'Every article opens with its heading',
        },
        {
          type: 'selectorExists',
          selector: 'article p',
          label: 'The entry text moved in too',
        },
      ],
    },
  },
  {
    id: 'html-semantic-4',
    blocks: [
      {
        type: 'p',
        text: 'Some content is a sidekick rather than the main event. <aside> is the tag for it: a fun fact, a "related links" box, anything the page would survive without. Screen readers announce an aside as complementary content, so listeners know they can skip it without missing anything important.',
      },
      {
        type: 'p',
        text: 'Two more elements complete your set. You already know <figure> from Text & Links — that was semantics too, marking an image-and-caption. New today: <details>, a built-in collapsible section. Its first child is a <summary> — the line that stays visible. Everything after it hides until the visitor clicks to expand. An accordion with zero JavaScript.',
      },
      {
        type: 'code',
        text: '<aside>\n  <p>Maples can live for 300 years.</p>\n</aside>\n<details>\n  <summary>How do I plant one?</summary>\n  <p>Dig, drop, water, wait.</p>\n</details>',
      },
      {
        type: 'p',
        text: 'Use each where it fits. <aside> holds facts that enrich the page but do not belong to its main flow. <figure> holds images your text refers to. <details> holds the long answer most readers will not need — FAQs, spoilers, advanced options. The page stays short, and the extra detail is one click away.',
      },
      {
        type: 'tip',
        text: 'Keep <summary> first inside <details>. Put it anywhere else and the browser falls back to a generic "Details" label.',
      },
    ],
    exercise: {
      instructions:
        'Add the sidekicks below the intro: an <aside> containing a <p> with a maple fun fact, then a <details> element with a <summary> saying "Show planting steps" and a <p> of steps hidden inside.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <main>\n      <h1>Growing maples</h1>\n      <p>Maples ask for little: sun, water, and patience.</p>\n      <!-- aside, then details -->\n\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'aside p',
          label: 'An <aside> shares the fun fact',
        },
        {
          type: 'selectorExists',
          selector: 'details summary',
          label: '<details> opens with a visible <summary>',
        },
        {
          type: 'selectorExists',
          selector: 'details p',
          label: 'The planting steps hide inside <details>',
        },
      ],
    },
  },
  {
    id: 'html-semantic-5',
    blocks: [
      {
        type: 'p',
        text: 'Every developer eventually works on a page made of nothing but <div>s — this is called div soup. It looks fine on screen, which is exactly the trap: nothing forces anyone to fix it, so it spreads. The fix is a refactor — changing what each box is called without changing what it contains.',
      },
      {
        type: 'p',
        text: 'Work through the soup one <div> at a time and ask what job it does. The banner across the top is a <header>; the clump of links inside it is a <nav>; the region holding the unique content is the page’s one <main>; a story that could stand alone is an <article>; the fine print is a <footer>. Rename the opening tag, rename its closing tag, re-read, repeat.',
      },
      {
        type: 'code',
        text: '<!-- before -->\n<div>\n  <div><a href="#">Home</a></div>\n</div>\n<!-- after -->\n<header>\n  <nav><a href="#">Home</a></nav>\n</header>',
      },
      {
        type: 'p',
        text: 'When you finish, the page will look pixel-for-pixel identical — and completely different to everyone who reads code instead of pixels. That is the quiet satisfaction of refactoring: nothing changed, everything improved.',
      },
      {
        type: 'tip',
        text: 'Change one <div> at a time, and always rename the closing tag in the same breath — a <header> closed by a </div> is how the soup fights back.',
      },
    ],
    exercise: {
      instructions:
        'De-soup the news page: the banner <div> becomes a <header>, the links <div> a <nav>, the content <div> the <main>, the story <div> an <article>, and the fine print a <footer> — until not a single <div> remains.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <div>\n      <h1>The Daily Acorn</h1>\n      <div>\n        <a href="#">Home</a>\n        <a href="#">Archive</a>\n      </div>\n    </div>\n    <div>\n      <div>\n        <h2>Squirrel hides 10,000th nut</h2>\n        <p>Local legend Hazel reached the milestone on Tuesday.</p>\n      </div>\n    </div>\n    <div>\n      <p>© 2026 The Daily Acorn</p>\n    </div>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'header nav a',
          label: 'The banner is a <header> with its menu in a <nav>',
        },
        {
          type: 'selectorExists',
          selector: 'main article h2',
          label: 'The story is an <article> inside <main>',
        },
        {
          type: 'selectorExists',
          selector: 'footer p',
          label: 'The fine print settles into a <footer>',
        },
        {
          type: 'selectorCount',
          selector: 'div',
          count: 0,
          label: 'Not a single <div> survives',
        },
      ],
    },
  },
];

export default lessons;
