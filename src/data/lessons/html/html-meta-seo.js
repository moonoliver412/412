// Topic: Meta & SEO Basics (html-meta-seo) — 5 lessons.

const lessons = [
  {
    id: 'html-meta-seo-1',
    blocks: [
      {
        type: 'p',
        text: 'Search engines see your page through its <head>. The <title> becomes the clickable link in search results and the label on the browser tab. The meta description — a <meta> tag that carries a short description of the page — becomes the gray sentence underneath. Together they are your page\'s first impression.',
      },
      {
        type: 'p',
        text: 'A good title is specific and leads with the most important words — "Sourdough starter guide — Sprout Bakery", never just "Home". Keep it under about 60 characters so it is not cut off. The description is one honest, inviting sentence of up to about 155 characters. Search engines sometimes rewrite it, but a good one usually survives.',
      },
      {
        type: 'code',
        text: '<head>\n  <meta charset="utf-8">\n  <title>Sourdough starter guide — Sprout Bakery</title>\n  <meta name="description"\n        content="Feed, fold, and bake: a beginner\'s path to a lively starter.">\n</head>',
      },
      {
        type: 'p',
        text: 'Notice the shape of that <meta>: a name attribute says which setting it is, and a content attribute holds the value. You will see this name/content pair in every lesson of this topic.',
      },
      {
        type: 'tip',
        text: 'One page, one title, one description. Make each page\'s pair unique — or all your search results look identical.',
      },
    ],
    exercise: {
      instructions:
        'Dress the shop window: inside <head>, add a <title> for the bakery page and a <meta name="description"> whose content describes the page in one inviting sentence.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <!-- title and description go here -->\n\n  </head>\n  <body>\n    <h1>Sprout Bakery</h1>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'head title',
          label: 'The head has a <title>',
        },
        {
          type: 'selectorExists',
          selector: 'meta[name="description"][content]',
          label: 'A meta description carries content',
        },
      ],
    },
  },
  {
    id: 'html-meta-seo-2',
    blocks: [
      {
        type: 'p',
        text: 'Paste a link into a chat app and a preview card appears — picture, headline, short blurb. That card is built from Open Graph tags: <meta> elements that use a property attribute (instead of name) with values like og:title, og:description, and og:image.',
      },
      {
        type: 'p',
        text: 'The big three: og:title is the card\'s headline, og:image is the picture (a full https:// address works best), and og:description is the supporting line. Without them, apps guess — and they tend to pick your nav logo and the first random sentence they find.',
      },
      {
        type: 'code',
        text: '<meta property="og:title" content="Sourdough starter guide">\n<meta property="og:description"\n      content="From flour and water to first loaf.">\n<meta property="og:image" content="https://example.com/loaf.jpg">',
      },
      {
        type: 'tip',
        text: 'Card not updating after an edit? Chat apps store previews and do not always refresh them. Most offer a "sharing debugger" page that forces a fresh fetch.',
      },
    ],
    exercise: {
      instructions:
        'Make the bakery link unfurl nicely: add two Open Graph metas — one with property="og:title" (content: the guide\'s name) and one with property="og:image" pointing at https://example.com/loaf.jpg.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Sourdough starter guide — Sprout Bakery</title>\n    <meta name="description" content="From flour and water to first loaf.">\n    <!-- Open Graph tags go here -->\n\n  </head>\n  <body>\n    <h1>Sourdough starter guide</h1>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'meta',
          attr: 'property',
          value: 'og:title',
          label: 'The card has an og:title headline',
        },
        {
          type: 'attrEquals',
          selector: 'meta',
          attr: 'property',
          value: 'og:image',
          label: 'The card has an og:image picture',
        },
      ],
    },
  },
  {
    id: 'html-meta-seo-3',
    blocks: [
      {
        type: 'p',
        text: 'The favicon is the tiny icon shown on every tab, bookmark, and history entry. You declare it with a <link> in the head: rel="icon" names the relationship, href points at the image. Modern browsers accept PNG and even SVG favicons.',
      },
      {
        type: 'p',
        text: 'Two companions complete the set. Apple devices look for rel="apple-touch-icon" — the picture shown when someone saves your page to their home screen. rel="manifest" points at a small JSON file that describes your site as an installable app: its name, theme colors, and a full set of icons.',
      },
      {
        type: 'code',
        text: '<link rel="icon" href="favicon.png">\n<link rel="apple-touch-icon" href="touch-icon.png">\n<link rel="manifest" href="site.webmanifest">',
      },
      {
        type: 'p',
        text: 'Like <meta>, the <link> element is a void tag that lives in the head and carries everything in its attributes. You have seen it pointing at stylesheets. The rel attribute is what changes its job.',
      },
      {
        type: 'tip',
        text: 'Declare no favicon and browsers quietly request /favicon.ico anyway. That mystery request you see in server logs is the browser making its best guess.',
      },
    ],
    exercise: {
      instructions:
        'Give the bakery an identity in the tab bar: add a <link rel="icon"> pointing at favicon.png, and a <link rel="manifest"> pointing at site.webmanifest.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Sprout Bakery</title>\n    <!-- icon and manifest links go here -->\n\n  </head>\n  <body>\n    <h1>Sprout Bakery</h1>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'link',
          attr: 'rel',
          value: 'icon',
          label: 'A <link rel="icon"> declares the favicon',
        },
        {
          type: 'attrEquals',
          selector: 'link',
          attr: 'rel',
          value: 'manifest',
          label: 'A <link rel="manifest"> points at the app manifest',
        },
      ],
    },
  },
  {
    id: 'html-meta-seo-4',
    blocks: [
      {
        type: 'p',
        text: 'Some search results show rich cards: recipe cards with star ratings, events with dates, products with prices. Pages earn those by using structured data — a <script type="application/ld+json"> block in the head holding a JSON description of what the page is about. JSON is a text format for data, like a series of labelled values.',
      },
      {
        type: 'p',
        text: 'The JSON follows a shared vocabulary from schema.org. You declare the @context (which vocabulary), an @type (Recipe, Event, Person…), and then properties for that type. Browsers ignore the block entirely. Search engines read it like a form you filled in for them.',
      },
      {
        type: 'code',
        text: '<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Recipe",\n  "name": "Honest sourdough"\n}\n</script>',
      },
      {
        type: 'tip',
        text: 'JSON is strict where HTML is forgiving. Use double quotes only, and no comma after the last property. One typo and the whole block is silently ignored.',
      },
    ],
    exercise: {
      instructions:
        'Tell search engines this page is a recipe: inside <head>, add a <script type="application/ld+json"> block declaring "@context": "https://schema.org", "@type": "Recipe", and a "name" for your bread.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Honest sourdough — Sprout Bakery</title>\n    <!-- structured data goes here -->\n\n  </head>\n  <body>\n    <h1>Honest sourdough</h1>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'script',
          attr: 'type',
          value: 'application/ld+json',
          label: 'A script block declares the JSON-LD type',
        },
        {
          type: 'textIncludes',
          text: 'recipe',
          selector: 'script',
          label: 'The structured data describes a Recipe',
        },
      ],
    },
  },
  {
    id: 'html-meta-seo-5',
    blocks: [
      {
        type: 'p',
        text: 'Auditor\'s hat back on — this time for the <head>. The bakery\'s newest page went live with almost nothing: a placeholder title, no description, no social card, no favicon. Search results read "Untitled page" and shared links show a blank preview.',
      },
      {
        type: 'p',
        text: 'Work through the checklist: a real title that includes the site name; a meta description with one inviting sentence; at least an og:title so shared links have a headline; and a favicon link so the tab has an icon.',
      },
      {
        type: 'code',
        text: '<!-- after the audit, a head has at least: -->\n<title>… — Sprout Bakery</title>\n<meta name="description" content="…">\n<meta property="og:title" content="…">\n<link rel="icon" href="favicon.png">',
      },
      {
        type: 'p',
        text: 'This four-line checklist is a real professional habit. Teams run it before every launch. Head mistakes are invisible in the browser window — the page looks fine while quietly disappearing from search results and social feeds.',
      },
      {
        type: 'tip',
        text: 'The head never shows on screen, so audit it by reading the code — not the preview. Eyes on the markup, top to bottom.',
      },
    ],
    exercise: {
      instructions:
        'Audit and fix the head: rewrite the <title> so it includes "Sprout Bakery", add a <meta name="description">, add a <meta property="og:title">, and add a favicon with <link rel="icon">.',
      starter:
        '<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>Untitled page</title>\n  </head>\n  <body>\n    <h1>Cinnamon week at Sprout Bakery</h1>\n    <p>Seven days, seven swirls.</p>\n  </body>\n</html>',
      checks: [
        {
          type: 'textIncludes',
          text: 'sprout bakery',
          selector: 'head title',
          label: 'The title names the bakery',
        },
        {
          type: 'selectorExists',
          selector: 'meta[name="description"]',
          label: 'The page has a meta description',
        },
        {
          type: 'attrEquals',
          selector: 'meta',
          attr: 'property',
          value: 'og:title',
          label: 'Shared links get an og:title headline',
        },
        {
          type: 'attrEquals',
          selector: 'link',
          attr: 'rel',
          value: 'icon',
          label: 'The tab gets a favicon',
        },
      ],
    },
  },
];

export default lessons;
