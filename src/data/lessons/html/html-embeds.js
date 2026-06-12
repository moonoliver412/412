// Topic: Iframes & Embeds (html-embeds) — 5 lessons.

const lessons = [
  {
    id: 'html-embeds-1',
    blocks: [
      {
        type: 'p',
        text: 'An <iframe> is a window in your page with another page inside it. The browser loads a second, completely separate document into the frame — its own HTML, its own styles. The two pages mostly cannot interact with each other.',
      },
      {
        type: 'p',
        text: 'You already use iframes without noticing: every embedded video player, map, and payment form is one. The src attribute tells the browser which page to load. width and height size the window. title — required, not optional — tells screen-reader users what is inside before they step into it.',
      },
      {
        type: 'code',
        text: '<iframe\n  src="https://example.com"\n  width="400" height="250"\n  title="Example.com preview">\n</iframe>',
      },
      {
        type: 'p',
        text: 'Unlike <img>, an iframe needs its closing tag. Text between the tags is shown only by very old browsers that cannot display frames at all — leave that space empty.',
      },
      {
        type: 'tip',
        text: 'In this editor\'s sandboxed preview, embedded sites may appear as empty frames. Your HTML is still correct. The checks read your markup, not the network.',
      },
    ],
    exercise: {
      instructions:
        'Cut a window into the page: add an <iframe> with src="https://example.com", width="400", height="250", and a title describing what is inside.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>My reading nook</h1>\n    <p>A little window to another site:</p>\n    <!-- iframe goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'iframe[src]',
          label: 'An <iframe> loads a page via src',
        },
        {
          type: 'selectorExists',
          selector: 'iframe[title]',
          label: 'The frame introduces itself with a title',
        },
      ],
    },
  },
  {
    id: 'html-embeds-2',
    blocks: [
      {
        type: 'p',
        text: 'Video sites do not give you a video file. They give you an iframe. The page inside the frame contains the full player — controls, captions, quality switching. That is why one copied snippet gives you a complete video player.',
      },
      {
        type: 'p',
        text: 'Two attributes matter beyond src. allowfullscreen lets the player expand to fill the screen when someone clicks the fullscreen button. Leave it off and that button silently does nothing. title earns its keep again: "Video: how to repot a fern" beats a screen reader saying just "frame".',
      },
      {
        type: 'code',
        text: '<iframe\n  src="https://example.com/embed/repotting"\n  width="560" height="315"\n  title="Video: how to repot a fern"\n  allowfullscreen>\n</iframe>',
      },
      {
        type: 'tip',
        text: 'Real embed codes from video sites are exactly this pattern with a longer src. Place them next to the content they go with, not dumped at the bottom of the page.',
      },
    ],
    exercise: {
      instructions:
        'This player embed is rude and cramped: give the <iframe> a descriptive title attribute, and add allowfullscreen so the fullscreen button actually works.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Repotting 101</h1>\n    <iframe\n      src="https://example.com/embed/repotting"\n      width="560" height="315">\n    </iframe>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'iframe[title]',
          label: 'The player has a descriptive title',
        },
        {
          type: 'selectorExists',
          selector: 'iframe[allowfullscreen]',
          label: 'Fullscreen is allowed on the player',
        },
      ],
    },
  },
  {
    id: 'html-embeds-3',
    blocks: [
      {
        type: 'p',
        text: 'Maps, calendars, weather panels, booking forms — anything a service offers under "embed this" arrives as an iframe. The tag never changes; only the src does. What changes between embeds is how you size and load each one.',
      },
      {
        type: 'p',
        text: 'Set width and height so the page reserves space before the frame loads — otherwise content jumps around as embeds pop in. Iframes also accept loading="lazy", just like images. A map at the bottom of a page should not load until the visitor scrolls toward it.',
      },
      {
        type: 'code',
        text: '<iframe\n  src="https://example.com/map?place=sprout-cafe"\n  width="400" height="300"\n  loading="lazy"\n  title="Map to Sprout Café">\n</iframe>',
      },
      {
        type: 'tip',
        text: 'Every embedded widget is someone else\'s code running inside your page. Embed services you trust — and next lesson you will learn how to limit what they can do.',
      },
    ],
    exercise: {
      instructions:
        'The café page needs directions: add an <iframe> with src="https://example.com/map?place=sprout-cafe", width="400" and height="300", and loading="lazy" so it only loads when scrolled into view.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Sprout Café</h1>\n    <p>Find us behind the old greenhouse.</p>\n    <!-- map embed goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'iframe[src]',
          label: 'A map <iframe> points at the map page',
        },
        {
          type: 'selectorExists',
          selector: 'iframe[width][height]',
          label: 'The frame reserves space with width and height',
        },
        {
          type: 'attrEquals',
          selector: 'iframe',
          attr: 'loading',
          value: 'lazy',
          label: 'The map loads lazily',
        },
      ],
    },
  },
  {
    id: 'html-embeds-4',
    blocks: [
      {
        type: 'p',
        text: 'An iframe runs someone else\'s page inside yours, so HTML gives you a way to limit its power. The sandbox attribute — short for sandboxing, locking a page into a safe container — strips the embedded page of almost everything: no scripts, no forms, no popups, no navigation. An empty sandbox="" is maximum lockdown.',
      },
      {
        type: 'p',
        text: 'From there you grant back only what the embed needs. Use space-separated tokens: sandbox="allow-scripts" lets it run JavaScript but nothing else. Add allow-forms only if it has a form to submit. One extra habit: referrerpolicy="no-referrer" stops the frame from learning which page embedded it.',
      },
      {
        type: 'code',
        text: '<iframe\n  src="https://example.com/widget/weather"\n  width="300" height="180"\n  title="Weather widget"\n  sandbox="allow-scripts"\n  referrerpolicy="no-referrer">\n</iframe>',
      },
      {
        type: 'tip',
        text: 'Never grant allow-scripts and allow-same-origin together to an untrusted page. That combination lets the embed unlock its own sandbox.',
      },
    ],
    exercise: {
      instructions:
        'Put this third-party widget on a leash: add sandbox="allow-scripts" so it can run but do nothing else, and referrerpolicy="no-referrer" so it is not told who embedded it.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Allotment dashboard</h1>\n    <iframe\n      src="https://example.com/widget/weather"\n      width="300" height="180"\n      title="Weather widget">\n    </iframe>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'iframe',
          attr: 'sandbox',
          value: 'allow-scripts',
          label: 'The widget is sandboxed, allowing only scripts',
        },
        {
          type: 'attrEquals',
          selector: 'iframe',
          attr: 'referrerpolicy',
          value: 'no-referrer',
          label: 'No referrer information leaks to the widget',
        },
      ],
    },
  },
  {
    id: 'html-embeds-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put it all together. Your showcase page holds three embeds — a video, a map, and a widget — each used the way this topic taught: titled for screen readers, lazy where it helps, sandboxed where trust is low.',
      },
      {
        type: 'p',
        text: 'Give each embed a heading so visitors know what they are looking at. All three iframes get a title. The map, which is far down the page, gets loading="lazy". The third-party widget gets sandbox="allow-scripts". Notice how attributes — not the tag — carry all the differences.',
      },
      {
        type: 'code',
        text: '<h2>Watch</h2>\n<iframe src="https://example.com/embed/tour"\n  width="560" height="315"\n  title="Video: garden tour" allowfullscreen>\n</iframe>',
      },
      {
        type: 'p',
        text: 'Placeholder example.com addresses are fine here — nothing loads in the sandboxed preview anyway. The structure and safety habits are the lesson. Both apply directly to real embed codes.',
      },
      {
        type: 'tip',
        text: 'Three frames, three jobs. Video wants allowfullscreen. Below-the-fold embeds want loading="lazy". Untrusted widgets want sandbox.',
      },
    ],
    exercise: {
      instructions:
        'Build the showcase: exactly three <iframe> embeds (video, map, widget — example.com srcs are fine), every one with a title. Give the map loading="lazy" and give the widget sandbox="allow-scripts".',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Embed showcase</h1>\n    <h2>Watch</h2>\n    <!-- video embed -->\n\n    <h2>Visit</h2>\n    <!-- map embed -->\n\n    <h2>Weather</h2>\n    <!-- widget embed -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorCount',
          selector: 'iframe',
          count: 3,
          label: 'Exactly three embeds on the page',
        },
        {
          type: 'selectorCount',
          selector: 'iframe[title]',
          count: 3,
          label: 'Every frame has a title',
        },
        {
          type: 'attrEquals',
          selector: 'iframe',
          attr: 'loading',
          value: 'lazy',
          label: 'The map embed loads lazily',
        },
        {
          type: 'selectorExists',
          selector: 'iframe[sandbox]',
          label: 'The widget is sandboxed',
        },
      ],
    },
  },
];

export default lessons;
