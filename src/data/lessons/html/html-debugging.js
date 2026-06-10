// Topic: Debugging HTML (html-debugging) — 5 lessons.
// Starters in this topic are intentionally broken; checks pass only on the
// repaired page (and fail on the buggy starter as written).

const lessons = [
  {
    id: 'html-debugging-1',
    blocks: [
      {
        type: 'p',
        text: 'Here is the most important fact in HTML debugging: the browser never shows your file. It parses your file, silently repairs what it can, and renders the result. The inspector (right-click → Inspect) shows that repaired tree — so when a page misbehaves, compare what you wrote with what the inspector says you wrote.',
      },
      {
        type: 'p',
        text: 'Two classics to recognize. Forget a closing tag and later elements get swallowed: write <h1>Shop without </h1> and the inspector shows your paragraphs nested inside the heading — which is why everything below it is suddenly enormous. Misspell an attribute — scr instead of src — and the inspector shows the element dutifully carrying a useless scr while the image displays nothing.',
      },
      {
        type: 'code',
        text: '<!-- you wrote -->\n<h1>Sprout Shop\n<p>Open daily.</p>\n\n<!-- the inspector shows -->\n<h1>Sprout Shop <p>Open daily.</p></h1>',
      },
      {
        type: 'tip',
        text: 'The inspector is honest; your memory is not. When markup misbehaves, read the tree in the inspector before re-reading your source.',
      },
    ],
    exercise: {
      instructions:
        'This page renders as one giant heading and the logo never appears. Two bugs: close the <h1> after "Sprout Shop", and fix the misspelled scr attribute on the image so it reads src.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Sprout Shop\n    <p>Open daily, nine to five.</p>\n    <img scr="logo.png" alt="Sprout Shop logo">\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'h1 p',
          count: 0,
          label: 'The paragraph is no longer trapped inside the <h1>',
        },
        {
          type: 'selectorExists',
          selector: 'img[src]',
          label: 'The logo image has a real src attribute',
        },
      ],
    },
  },
  {
    id: 'html-debugging-2',
    blocks: [
      {
        type: 'p',
        text: 'Every element has rules about what it may contain, and the browser does not always enforce them — it just renders something, often something subtly wrong. The most common offender: lists. A <ul> may contain only <li> elements. Links, text, images — all of it belongs inside the <li>s, never directly inside the list.',
      },
      {
        type: 'p',
        text: 'Other repeat offenders: block elements like <div> inside a <p> (the browser snaps the paragraph shut early), interactive elements inside each other (a link inside a button), and overlapping pairs like <em><strong></em></strong>. The fix is always the same: close inner elements before outer ones, and check each parent’s guest list.',
      },
      {
        type: 'code',
        text: '<!-- wrong: links loose in the list -->\n<ul>\n  <a href="/seeds">Seeds</a>\n</ul>\n<!-- right: each link inside an <li> -->\n<ul>\n  <li><a href="/seeds">Seeds</a></li>\n</ul>',
      },
      {
        type: 'tip',
        text: 'Nesting trouble shows up in the inspector as elements that "moved" — children sitting where you never put them. When the tree surprises you, suspect a nesting rule.',
      },
    ],
    exercise: {
      instructions:
        'The shop menu renders oddly because three links sit directly inside the <ul>, which is illegal. Wrap each link in its own <li> so the list is valid again.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h2>Shop sections</h2>\n    <ul>\n      <a href="/seeds">Seeds</a>\n      <a href="/tools">Tools</a>\n      <a href="/advice">Advice</a>\n    </ul>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'ul li',
          count: 3,
          label: 'The list has three proper <li> items',
        },
        {
          type: 'selectorCount',
          selector: 'li a',
          count: 3,
          label: 'Each link lives inside its own <li>',
        },
      ],
    },
  },
  {
    id: 'html-debugging-3',
    blocks: [
      {
        type: 'p',
        text: 'The inspector shows what the browser built; a validator reads what you wrote and lists everything illegal in it. The W3C markup validator (validator.w3.org) is the classic: paste in your HTML, get back a numbered list of errors with line numbers. It catches the mistakes browsers paper over without a word.',
      },
      {
        type: 'p',
        text: 'Two favorites from its catalogue. Duplicate ids: an id must be unique on the page, because ids are how labels, links, and scripts find elements — duplicates make them find the wrong one. And obsolete elements like <center> or <font>: they still render, but they are styling pretending to be structure, long since retired in favor of CSS.',
      },
      {
        type: 'code',
        text: '<!-- the validator flags both: -->\n<p id="intro">Saturday at ten.</p>\n<center>Free seedlings!</center>\n<p id="intro">Bring gloves.</p>',
      },
      {
        type: 'tip',
        text: 'Validate whenever something is weird but the inspector looks fine — and always before blaming the browser. It is nearly always our markup.',
      },
    ],
    exercise: {
      instructions:
        'A validator just flagged this page twice. Fix everything: rename the second id="intro" to id="outro", and replace the obsolete <center> element with an ordinary <p>.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Open day</h1>\n    <p id="intro">Gates open Saturday at ten.</p>\n    <center>Free seedlings for the first twenty visitors!</center>\n    <p id="intro">Bring gloves and a thermos.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: '#intro',
          count: 1,
          label: 'Only one element carries id="intro"',
        },
        {
          type: 'selectorExists',
          selector: '#outro',
          label: 'The closing paragraph is now #outro',
        },
        {
          type: 'selectorCount',
          selector: 'center',
          count: 0,
          label: 'The obsolete <center> is gone',
        },
      ],
    },
  },
  {
    id: 'html-debugging-4',
    blocks: [
      {
        type: 'p',
        text: 'Some bugs announce themselves across the whole page: everything below a certain point is bold, or italic, or one giant link. That signature — fine up here, wrong everywhere after — is the fingerprint of an unclosed formatting tag. The browser, trying to honor your <strong> forever, re-opens it inside every element that follows.',
      },
      {
        type: 'p',
        text: 'The forensic method: find the last healthy element and the first wrong one; the culprit was opened between them. The inspector makes it vivid — you will see <strong> cloned inside every later paragraph, copies you never wrote. Close the original tag and the epidemic ends instantly.',
      },
      {
        type: 'code',
        text: '<p><strong>Frost tonight.</p>   <!-- never closed -->\n<p>Sunny tomorrow.</p>\n\n<!-- the inspector reveals the spread -->\n<p><strong>Frost tonight.</strong></p>\n<p><strong>Sunny tomorrow.</strong></p>',
      },
      {
        type: 'tip',
        text: 'One bug, many symptoms is normal in HTML: a single unclosed tag can restyle the rest of the page. Fix the first wrong thing, then look again before touching anything else.',
      },
    ],
    exercise: {
      instructions:
        'Below the first alert, the whole page renders bold — and the last two lines have become a link. Close the runaway <strong> in the first paragraph and the unclosed <a> in the third.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden alerts</h1>\n    <p><strong>Frost tonight — cover your seedlings.</p>\n    <p>Tomorrow looks sunny and calm.</p>\n    <p><a href="/alerts">All alerts</p>\n    <p>Updated hourly by the garden team.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'strong',
          count: 1,
          label: 'Exactly one <strong> — the bold stops spreading',
        },
        {
          type: 'selectorCount',
          selector: 'a',
          count: 1,
          label: 'Exactly one link — the <a> is closed',
        },
      ],
    },
  },
  {
    id: 'html-debugging-5',
    blocks: [
      {
        type: 'p',
        text: 'Final challenge: a fair flyer whose author reports that "something went wrong somewhere". Your whole toolkit applies — read the rendered symptoms, picture the inspector’s repaired tree, and work top to bottom like an auditor.',
      },
      {
        type: 'p',
        text: 'The symptoms, as filed: everything below the opening line renders bold; the afternoon schedule card misbehaves (a validator would mutter about ids); and the packing list at the bottom has lost its bullets. Three families of bug you have already beaten one at a time — now they are merely sharing a page.',
      },
      {
        type: 'code',
        text: '<!-- the repaired shapes to aim for -->\n<section id="card">…morning…</section>\n<section id="card-2">…afternoon…</section>\n<ul>\n  <li>Gloves</li>\n</ul>',
      },
      {
        type: 'p',
        text: 'Order matters less than calm: fix one bug, glance at the result, then move to the next. Three small repairs and the flyer stands straight — and you will have debugged a page exactly the way working developers do it.',
      },
      {
        type: 'tip',
        text: 'Never fix two bugs at once — you will not know which change did what. One repair, one look, repeat.',
      },
    ],
    exercise: {
      instructions:
        'Repair all three bugs: close the unclosed <strong> in the intro paragraph, rename the second duplicate id="card" to id="card-2", and wrap the three loose <li> items in a <ul>.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Sprout Fair</h1>\n    </header>\n    <main>\n      <p><strong>One day only — this Saturday.</p>\n      <p>Stalls, talks, and a seedling swap.</p>\n      <section id="card">\n        <h2>Morning</h2>\n        <p>Pruning workshop at ten.</p>\n      </section>\n      <section id="card">\n        <h2>Afternoon</h2>\n        <p>Tomato tasting at two.</p>\n      </section>\n      <h2>What to bring</h2>\n      <li>Gloves</li>\n      <li>A hat</li>\n      <li>Your questions</li>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'strong',
          count: 1,
          label: 'One <strong>, properly closed — the bold stays put',
        },
        {
          type: 'selectorCount',
          selector: '#card',
          count: 1,
          label: 'Ids are unique — only one #card remains',
        },
        {
          type: 'selectorExists',
          selector: '#card-2',
          label: 'The afternoon card is now #card-2',
        },
        {
          type: 'selectorCount',
          selector: 'ul li',
          count: 3,
          label: 'The packing list is a real <ul> with three items',
        },
      ],
    },
  },
];

export default lessons;
