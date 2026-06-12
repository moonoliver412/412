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
      'Each card must show the plan name in a heading and a list of at least two features.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'h2, h3',
        count: 3,
        label: 'Three plan headings exist',
      },
      {
        type: 'textIncludes',
        text: 'free',
        label: 'Free plan is present',
      },
      {
        type: 'textIncludes',
        text: 'pro',
        label: 'Pro plan is present',
      },
      {
        type: 'selectorExists',
        selector: 'li',
        label: 'Feature list items are present',
      },
    ],
    reward: 15,
  },
  {
    id: 'ch-html-nav-links',
    name: 'Navigation Bar',
    language: 'html',
    brief:
      'Create an HTML navigation bar inside a <nav> element. ' +
      'It should contain at least four anchor links: Home, About, Projects, and Contact.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'nav',
        label: 'A <nav> element exists',
      },
      {
        type: 'selectorExists',
        selector: 'nav a',
        label: 'Navigation links are inside <nav>',
      },
      {
        type: 'textIncludes',
        selector: 'nav',
        text: 'home',
        label: 'Home link is present',
      },
      {
        type: 'textIncludes',
        selector: 'nav',
        text: 'contact',
        label: 'Contact link is present',
      },
    ],
    reward: 15,
  },
  {
    id: 'ch-html-article-card',
    name: 'Article Card',
    language: 'html',
    brief:
      'Build a blog article card using semantic HTML. ' +
      'It should include an <article> wrapper, an <h2> title, a <p> excerpt, and a "Read more" link.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'article',
        label: 'An <article> element wraps the card',
      },
      {
        type: 'selectorExists',
        selector: 'article h2',
        label: 'An <h2> title is inside the article',
      },
      {
        type: 'selectorExists',
        selector: 'article p',
        label: 'A paragraph excerpt is present',
      },
      {
        type: 'textIncludes',
        selector: 'article',
        text: 'read more',
        label: '"Read more" link text is present',
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
      'The nav items should sit on one row with space between them, and each link should change color on hover.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'nav',
        label: 'A <nav> element exists',
      },
      {
        type: 'styleIncludes',
        text: 'display:flex',
        label: 'Flexbox is applied',
      },
      {
        type: 'styleIncludes',
        text: 'justify-content',
        label: 'Items are distributed along the row',
      },
      {
        type: 'selectorExists',
        selector: 'nav a, nav li',
        label: 'Navigation items are present',
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
      'The grid must be responsive — use a repeat(auto-fill, ...) or auto-fit pattern so columns reflow on smaller screens.',
    checks: [
      {
        type: 'styleIncludes',
        text: 'display:grid',
        label: 'CSS Grid is applied',
      },
      {
        type: 'styleIncludes',
        text: 'repeat(',
        label: 'repeat() is used for the column definition',
      },
      {
        type: 'selectorExists',
        selector: 'div, article, section',
        label: 'Card elements are present',
      },
      {
        type: 'styleIncludes',
        text: 'gap',
        label: 'Gap spacing is set between cards',
      },
    ],
    reward: 15,
  },
  {
    id: 'ch-css-button-states',
    name: 'Button States',
    language: 'html',
    brief:
      'Design a styled button with three distinct visual states: default, hover, and active. ' +
      'Use background color and a smooth transition to show each state change.',
    checks: [
      {
        type: 'selectorExists',
        selector: 'button, .btn, [class*="btn"]',
        label: 'A button element is present',
      },
      {
        type: 'styleIncludes',
        text: 'background',
        label: 'Background color is styled',
      },
      {
        type: 'styleIncludes',
        text: 'transition',
        label: 'A transition is applied for smooth state changes',
      },
      {
        type: 'styleIncludes',
        text: ':hover',
        label: 'Hover state is styled',
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
      'the number of vowel characters (a, e, i, o, u, case-insensitive) in it. ' +
      'Call countVowels("Hello World") and log the result.',
    checks: [
      {
        type: 'exprTruthy',
        expr: 'typeof countVowels === "function"',
        label: 'countVowels is a function',
      },
      {
        type: 'exprTruthy',
        expr: 'countVowels("Hello World") === 3',
        label: 'countVowels("Hello World") returns 3',
      },
      {
        type: 'exprTruthy',
        expr: 'countVowels("aeiou") === 5',
        label: 'countVowels("aeiou") returns 5',
      },
      {
        type: 'logIncludes',
        text: '3',
        label: 'The result is logged to the console',
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
      'of strings from 1 to n: "Fizz" for multiples of 3, "Buzz" for multiples of 5, ' +
      '"FizzBuzz" for multiples of both, and the number as a string otherwise. ' +
      'Log the result of fizzBuzz(15).',
    checks: [
      {
        type: 'exprTruthy',
        expr: 'typeof fizzBuzz === "function"',
        label: 'fizzBuzz is a function',
      },
      {
        type: 'exprTruthy',
        expr: 'fizzBuzz(15)[2] === "Fizz"',
        label: 'Returns "Fizz" for multiples of 3',
      },
      {
        type: 'exprTruthy',
        expr: 'fizzBuzz(15)[4] === "Buzz"',
        label: 'Returns "Buzz" for multiples of 5',
      },
      {
        type: 'exprTruthy',
        expr: 'fizzBuzz(15)[14] === "FizzBuzz"',
        label: 'Returns "FizzBuzz" for multiples of 15',
      },
    ],
    reward: 15,
  },
];

/** Look up a challenge by id. */
export function getChallenge(id) {
  return CHALLENGES.find((c) => c.id === id) ?? null;
}
