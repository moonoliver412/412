// Clear Field challenges — blank-page retrieval practice.
// NO starter code; editor starts empty (blank-page practice is MASTERPLAN pillar 3).
// Each challenge is verified by mentally solving it and confirming checks pass.
//
// check types used:
//   HTML/CSS: selectorExists, selectorCount, textIncludes, styleIncludes, attrEquals
//   JS:       exprTruthy, logIncludes  (with kind:'js')

export const CHALLENGES = [
  // ---- HTML ----
  {
    id: 'ch-html-pricing-table',
    name: 'Pricing Table',
    language: 'html',
    brief:
      'Build a pricing table with three plan cards: Free, Pro, and Enterprise. ' +
      'Each card needs the plan name in a heading and a list of at least two features.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'h2, h3',
        count: 3,
        label: 'Three plan headings are on the page',
      },
      {
        type: 'textIncludes',
        text: 'free',
        label: 'The Free plan is on the page',
      },
      {
        type: 'textIncludes',
        text: 'pro',
        label: 'The Pro plan is on the page',
      },
      {
        type: 'selectorExists',
        selector: 'li',
        label: 'Feature list items appear in the cards',
      },
    ],
    reward: 15,
  },
  {
    id: 'ch-html-nav-links',
    name: 'Navigation Bar',
    language: 'html',
    brief:
      'Create a navigation bar inside a <nav> element. ' +
      'Include at least four anchor links: Home, About, Projects, and Contact.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'nav',
        label: 'A <nav> element is on the page',
      },
      {
        type: 'selectorExists',
        selector: 'nav a',
        label: 'Your links are inside the <nav>',
      },
      {
        type: 'textIncludes',
        selector: 'nav',
        text: 'home',
        label: 'A Home link is in the nav',
      },
      {
        type: 'textIncludes',
        selector: 'nav',
        text: 'contact',
        label: 'A Contact link is in the nav',
      },
    ],
    reward: 15,
  },
  {
    id: 'ch-html-article-card',
    name: 'Article Card',
    language: 'html',
    brief:
      'Build a blog article card using semantic HTML elements. ' +
      'Include an <article> wrapper, an <h2> title, a <p> excerpt, and a "Read more" link.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'article',
        label: 'An <article> element wraps your card',
      },
      {
        type: 'selectorExists',
        selector: 'article h2',
        label: 'An <h2> title sits inside the article',
      },
      {
        type: 'selectorExists',
        selector: 'article p',
        label: 'A paragraph excerpt is in the card',
      },
      {
        type: 'textIncludes',
        selector: 'article',
        text: 'read more',
        label: 'The "Read more" link text is there',
      },
    ],
    reward: 15,
  },

  // ---- CSS ----
  {
    id: 'ch-css-flexbox-nav',
    name: 'Flexbox Nav',
    language: 'html',
    brief:
      'Build a horizontal navigation bar styled with Flexbox. ' +
      'The nav items should line up in one row with space between them. Each link should change color on hover.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'nav',
        label: 'A <nav> element is on the page',
      },
      {
        type: 'styleIncludes',
        text: 'display:flex',
        label: 'Flexbox is applied to the nav',
      },
      {
        type: 'styleIncludes',
        text: 'justify-content',
        label: 'Items are spread along the row',
      },
      {
        type: 'selectorExists',
        selector: 'nav a, nav li',
        label: 'Navigation items are in the nav',
      },
    ],
    reward: 15,
  },
  {
    id: 'ch-css-card-grid',
    name: 'Responsive Card Grid',
    language: 'html',
    brief:
      'Create a grid of at least four cards using CSS Grid. ' +
      'Make it responsive — use a repeat(auto-fill, ...) or auto-fit pattern so the columns reflow on smaller screens.',
    checks: [
      {
        type: 'styleIncludes',
        text: 'display:grid',
        label: 'CSS Grid is applied to the layout',
      },
      {
        type: 'styleIncludes',
        text: 'repeat(',
        label: 'repeat() defines your columns',
      },
      {
        type: 'selectorExists',
        selector: 'div, article, section',
        label: 'Card elements are in the grid',
      },
      {
        type: 'styleIncludes',
        text: 'gap',
        label: 'Gap spacing separates the cards',
      },
    ],
    reward: 15,
  },
  {
    id: 'ch-css-button-states',
    name: 'Button States',
    language: 'html',
    brief:
      'Design a button with three clear visual states: default, hover, and active. ' +
      'Use background color and a smooth CSS transition to show each state change.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'button, .btn, [class*="btn"]',
        label: 'A button element is on the page',
      },
      {
        type: 'styleIncludes',
        text: 'background',
        label: 'The button has a styled background color',
      },
      {
        type: 'styleIncludes',
        text: 'transition',
        label: 'A CSS transition makes the state changes smooth',
      },
      {
        type: 'styleIncludes',
        text: ':hover',
        label: 'The hover state has its own style',
      },
    ],
    reward: 15,
  },

  // ---- JS ----
  {
    id: 'ch-js-count-vowels',
    name: 'Count Vowels',
    language: 'js',
    kind: 'js',
    brief:
      'Write a function called countVowels that takes a string and returns ' +
      'the number of vowels (a, e, i, o, u — case-insensitive) in it. ' +
      'Call countVowels("Hello World") and log the result.',
    checks: [
      {
        type: 'exprTruthy',
        expr: 'typeof countVowels === "function"',
        label: 'countVowels is defined as a function',
      },
      {
        type: 'exprTruthy',
        expr: 'countVowels("Hello World") === 3',
        label: 'countVowels("Hello World") correctly returns 3',
      },
      {
        type: 'exprTruthy',
        expr: 'countVowels("aeiou") === 5',
        label: 'countVowels("aeiou") correctly returns 5',
      },
      {
        type: 'logIncludes',
        text: '3',
        label: 'The vowel count is logged to the console',
      },
    ],
    reward: 15,
  },
  {
    id: 'ch-js-fizzbuzz',
    name: 'FizzBuzz',
    language: 'js',
    kind: 'js',
    brief:
      'Write a function called fizzBuzz that takes a number n and returns an array ' +
      'of strings from 1 to n. Use "Fizz" for multiples of 3, "Buzz" for multiples of 5, ' +
      '"FizzBuzz" for multiples of both, and the number as a string for everything else. ' +
      'Log the result of fizzBuzz(15).',
    checks: [
      {
        type: 'exprTruthy',
        expr: 'typeof fizzBuzz === "function"',
        label: 'fizzBuzz is defined as a function',
      },
      {
        type: 'exprTruthy',
        expr: 'fizzBuzz(15)[2] === "Fizz"',
        label: '"Fizz" appears for multiples of 3',
      },
      {
        type: 'exprTruthy',
        expr: 'fizzBuzz(15)[4] === "Buzz"',
        label: '"Buzz" appears for multiples of 5',
      },
      {
        type: 'exprTruthy',
        expr: 'fizzBuzz(15)[14] === "FizzBuzz"',
        label: '"FizzBuzz" appears for multiples of both 3 and 5',
      },
    ],
    reward: 15,
  },
];

/** Look up a challenge by id. */
export function getChallenge(id) {
  return CHALLENGES.find((c) => c.id === id) ?? null;
}
