// Topic: Debugging HTML (html-debugging) — 5 lessons.
// Starters in this topic are intentionally broken; checks pass only on the
// repaired page (and fail on the buggy starter as written).

const lessons = [
  {
    id: 'html-debugging-1',
    blocks: [
      {
        type: 'p',
        text: 'The most important fact in HTML debugging: the browser never shows your file directly. It reads your file, quietly repairs what it can, and renders the result. The inspector (right-click → Inspect) shows that repaired tree. When a page misbehaves, compare what you wrote with what the inspector says you wrote.',
      },
      {
        type: 'p',
        text: 'Two classic bugs to know. Forget a closing tag and later elements get pulled inside the unclosed one. Write <h1>Shop without </h1> and the inspector shows your paragraphs nested inside the heading — everything below it turns giant. Misspell an attribute — scr instead of src — and the inspector shows the element carrying a useless scr while the image shows nothing.',
      },
      {
        type: 'code',
        text: '<!-- you wrote -->\n<h1>Sprout Shop\n<p>Open daily.</p>\n\n<!-- the inspector shows -->\n<h1>Sprout Shop <p>Open daily.</p></h1>',
      },
      {
        type: 'tip',
        text: 'The inspector shows the truth. When markup misbehaves, read the tree in the inspector before going back to your source.',
      },
    ],
    exercise: {
      instructions:
        'This page renders as one giant heading and the logo never appears. Two bugs: close the <h1> after "Sprout Shop", and fix the misspelled scr attribute on the image so it reads src.',
      hints: [
        'Open your inspector and look at the tree. The <p> is probably sitting inside the <h1>. That means the h1 was never closed. Also check the image tag — the attribute name is wrong.',
        'Add </h1> after "Sprout Shop" on that line. Then change scr="logo.png" to src="logo.png".',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Sprout Shop</h1>\n    <p>Open daily, nine to five.</p>\n    <img src="logo.png" alt="Sprout Shop logo">\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Sprout Shop\n    <p>Open daily, nine to five.</p>\n    <img scr="logo.png" alt="Sprout Shop logo">\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'h1 p',
          count: 0,
          label: 'The paragraph is no longer trapped inside the <h1>',
          hint: 'Close the <h1> tag with </h1> right after "Sprout Shop".',
        },
        {
          type: 'selectorExists',
          selector: 'img[src]',
          label: 'The logo image has a real src attribute',
          hint: 'Change scr="logo.png" to src="logo.png" on the img tag.',
        },
      ],
    },
  },
  {
    id: 'html-debugging-2',
    blocks: [
      {
        type: 'p',
        text: 'Every element has rules about what it may contain. The browser does not always enforce them — it just renders something, often something subtly wrong. The most common case: lists. A <ul> may only contain <li> elements directly. Links, text, images — all of that belongs inside the <li>s, never loose inside the list.',
      },
      {
        type: 'p',
        text: 'Other common mistakes: a block element like <div> inside a <p> (the browser closes the paragraph early); interactive elements nested inside each other like a link inside a button; and overlapping tags like <em><strong></em></strong>. The fix is always the same: close inner elements before outer ones, and check what each parent is allowed to hold.',
      },
      {
        type: 'code',
        text: '<!-- wrong: links loose in the list -->\n<ul>\n  <a href="/seeds">Seeds</a>\n</ul>\n<!-- right: each link inside an <li> -->\n<ul>\n  <li><a href="/seeds">Seeds</a></li>\n</ul>',
      },
      {
        type: 'tip',
        text: 'Nesting problems show up in the inspector as elements that appear in unexpected places. When the tree surprises you, suspect a nesting rule was broken.',
      },
    ],
    exercise: {
      instructions:
        'The shop menu renders oddly because three links sit directly inside the <ul>, which is illegal. Wrap each link in its own <li> so the list is valid again.',
      hints: [
        'A <ul> can only hold <li> items as direct children. The links need to move inside <li> elements.',
        'Wrap each <a> tag: change <a href="...">Seeds</a> to <li><a href="...">Seeds</a></li>, and do the same for the other two.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h2>Shop sections</h2>\n    <ul>\n      <li><a href="/seeds">Seeds</a></li>\n      <li><a href="/tools">Tools</a></li>\n      <li><a href="/advice">Advice</a></li>\n    </ul>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h2>Shop sections</h2>\n    <ul>\n      <a href="/seeds">Seeds</a>\n      <a href="/tools">Tools</a>\n      <a href="/advice">Advice</a>\n    </ul>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'ul li',
          count: 3,
          label: 'The list has three proper <li> items',
          hint: 'Each link needs its own <li>...</li> wrapper inside the <ul>.',
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
        text: 'The inspector shows what the browser built. A validator reads what you wrote and lists everything invalid in it. The W3C markup validator at validator.w3.org is the standard one: paste your HTML in, get back a numbered list of errors with line numbers. It catches the mistakes browsers quietly fix without telling you.',
      },
      {
        type: 'p',
        text: 'Two errors it catches often. Duplicate ids: an id must be unique on the page because labels, links, and scripts use ids to find elements — duplicates send them to the wrong one. Obsolete elements like <center> or <font>: they still render, but they are styling disguised as structure, retired long ago in favor of CSS.',
      },
      {
        type: 'code',
        text: '<!-- the validator flags both: -->\n<p id="intro">Saturday at ten.</p>\n<center>Free seedlings!</center>\n<p id="intro">Bring gloves.</p>',
      },
      {
        type: 'tip',
        text: 'Validate whenever something is wrong but the inspector looks fine. Always validate before blaming the browser. It is nearly always the markup.',
      },
    ],
    exercise: {
      instructions:
        'A validator just flagged this page twice. Fix everything: rename the second id="intro" to id="outro", and replace the obsolete <center> element with an ordinary <p>.',
      hints: [
        'Two problems: an id is used twice (ids must be unique), and <center> is an old tag that was retired years ago. Each needs its own fix.',
        'On the last <p>, change id="intro" to id="outro". Then change <center>...</center> to <p>...</p>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Open day</h1>\n    <p id="intro">Gates open Saturday at ten.</p>\n    <p>Free seedlings for the first twenty visitors!</p>\n    <p id="outro">Bring gloves and a thermos.</p>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Open day</h1>\n    <p id="intro">Gates open Saturday at ten.</p>\n    <center>Free seedlings for the first twenty visitors!</center>\n    <p id="intro">Bring gloves and a thermos.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: '#intro',
          count: 1,
          label: 'Only one element carries id="intro"',
          hint: 'Change the second id="intro" to id="outro" on the last paragraph.',
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
          hint: 'Replace <center>...</center> with <p>...</p>.',
        },
      ],
    },
  },
  {
    id: 'html-debugging-4',
    blocks: [
      {
        type: 'p',
        text: 'Some bugs show up across the whole page: everything below a point is bold, or italic, or one giant link. That pattern — fine above, wrong everywhere after — is the sign of an unclosed formatting tag. The browser keeps trying to honor your <strong>, so it reopens it inside every element that follows.',
      },
      {
        type: 'p',
        text: 'To find the culprit: locate the last healthy element and the first broken one. The unclosed tag was opened between them. The inspector makes it clear — you will see <strong> cloned inside every paragraph below, copies you never wrote. Close the original tag and the problem stops immediately.',
      },
      {
        type: 'code',
        text: '<p><strong>Frost tonight.</p>   <!-- never closed -->\n<p>Sunny tomorrow.</p>\n\n<!-- the inspector reveals the spread -->\n<p><strong>Frost tonight.</strong></p>\n<p><strong>Sunny tomorrow.</strong></p>',
      },
      {
        type: 'tip',
        text: 'One bug, many symptoms — that is normal in HTML. A single unclosed tag can restyle the whole rest of the page. Fix the first wrong thing, then look again before touching anything else.',
      },
    ],
    exercise: {
      instructions:
        'Below the first alert, the whole page renders bold — and the last two lines have become a link. Close the runaway <strong> in the first paragraph and the unclosed <a> in the third.',
      hints: [
        'When everything after a point looks bold or linked, there is a tag that was opened but never closed. Look for the first paragraph that goes wrong and find the missing closing tag there.',
        'In the first <p>, add </strong> before </p> to close the bold. In the third <p>, add </a> before </p> to close the link.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden alerts</h1>\n    <p><strong>Frost tonight — cover your seedlings.</strong></p>\n    <p>Tomorrow looks sunny and calm.</p>\n    <p><a href="/alerts">All alerts</a></p>\n    <p>Updated hourly by the garden team.</p>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden alerts</h1>\n    <p><strong>Frost tonight — cover your seedlings.</p>\n    <p>Tomorrow looks sunny and calm.</p>\n    <p><a href="/alerts">All alerts</p>\n    <p>Updated hourly by the garden team.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'strong',
          count: 1,
          label: 'Exactly one <strong> — the bold stops spreading',
          hint: 'Close the <strong> tag inside the first paragraph with </strong>.',
        },
        {
          type: 'selectorCount',
          selector: 'a',
          count: 1,
          label: 'Exactly one link — the <a> is closed',
          hint: 'Close the link in the third paragraph with </a>.',
        },
      ],
    },
  },
  {
    id: 'html-debugging-5',
    blocks: [
      {
        type: 'p',
        text: 'Final challenge: a fair flyer where "something went wrong somewhere". Your whole toolkit applies. Read the symptoms, picture the inspector\'s repaired tree, and work top to bottom like an auditor.',
      },
      {
        type: 'p',
        text: 'The symptoms: everything below the opening line is bold; the afternoon schedule card has a problem a validator would flag; and the packing list at the bottom has lost its bullets. Three types of bug you have already fixed one at a time — now they just happen to share a page.',
      },
      {
        type: 'code',
        text: '<!-- the repaired shapes to aim for -->\n<section id="card">…morning…</section>\n<section id="card-2">…afternoon…</section>\n<ul>\n  <li>Gloves</li>\n</ul>',
      },
      {
        type: 'p',
        text: 'Order matters less than calm. Fix one bug, check the result, then move to the next. Three small repairs and the flyer is clean — and you will have debugged a page exactly the way working developers do.',
      },
      {
        type: 'tip',
        text: 'Never fix two bugs at the same time. You will not know which change did what. One repair, one look, repeat.',
      },
    ],
    exercise: {
      instructions:
        'Repair all three bugs: close the unclosed <strong> in the intro paragraph, rename the second duplicate id="card" to id="card-2", and wrap the three loose <li> items in a <ul>.',
      hints: [
        'Fix one bug at a time. First: the bold spreading means a <strong> was never closed. Second: two elements share the same id — find the second one. Third: the <li> items need a parent <ul>.',
        'Add </strong> before </p> in the first paragraph. Change the second section\'s id="card" to id="card-2". Wrap the three <li> items in <ul>...</ul>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Sprout Fair</h1>\n    </header>\n    <main>\n      <p><strong>One day only — this Saturday.</strong></p>\n      <p>Stalls, talks, and a seedling swap.</p>\n      <section id="card">\n        <h2>Morning</h2>\n        <p>Pruning workshop at ten.</p>\n      </section>\n      <section id="card-2">\n        <h2>Afternoon</h2>\n        <p>Tomato tasting at two.</p>\n      </section>\n      <h2>What to bring</h2>\n      <ul>\n        <li>Gloves</li>\n        <li>A hat</li>\n        <li>Your questions</li>\n      </ul>\n    </main>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <header>\n      <h1>Sprout Fair</h1>\n    </header>\n    <main>\n      <p><strong>One day only — this Saturday.</p>\n      <p>Stalls, talks, and a seedling swap.</p>\n      <section id="card">\n        <h2>Morning</h2>\n        <p>Pruning workshop at ten.</p>\n      </section>\n      <section id="card">\n        <h2>Afternoon</h2>\n        <p>Tomato tasting at two.</p>\n      </section>\n      <h2>What to bring</h2>\n      <li>Gloves</li>\n      <li>A hat</li>\n      <li>Your questions</li>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'strong',
          count: 1,
          label: 'One <strong>, properly closed — the bold stays put',
          hint: 'Add </strong> before </p> in the first paragraph to close the bold tag.',
        },
        {
          type: 'selectorCount',
          selector: '#card',
          count: 1,
          label: 'Ids are unique — only one #card remains',
          hint: 'Find the second section with id="card" and change it to id="card-2".',
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
