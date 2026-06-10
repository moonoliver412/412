// Topic: Form Validation (html-form-validation) — 5 lessons.

const lessons = [
  {
    id: 'html-form-validation-1',
    blocks: [
      {
        type: 'p',
        text: 'Forms collect answers; validation makes sure the answers make sense before they travel anywhere. You met required back in Forms & Media — the attribute that blocks submission while a field sits empty. This topic turns that one trick into a toolkit, starting with rules you write yourself.',
      },
      {
        type: 'p',
        text: 'pattern holds a regular expression — a compact rule the value must match in full. pattern="[a-z]+" means "one or more lowercase letters, nothing else". Add minlength and maxlength to bound the size. The browser enforces all of it at submit time, free of charge, before any code of yours would ever run.',
      },
      {
        type: 'code',
        text: '<label for="user">Username</label>\n<input id="user" type="text" required\n       pattern="[a-z]+" minlength="3">',
      },
      {
        type: 'p',
        text: 'Validation only fires when the form tries to submit, so always test by clicking the button. Until that moment, an invalid field just sits there looking innocent.',
      },
      {
        type: 'tip',
        text: 'Regular expressions go deep, but three symbols cover most form patterns: [a-z] is a letter range, + means "one or more", and {3} means "exactly three".',
      },
    ],
    exercise: {
      instructions:
        'Tighten the username field: add required so it cannot be left empty, and pattern="[a-z]+" so only lowercase letters get through.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="user">Username</label>\n      <input id="user" type="text">\n      <button>Create account</button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'input[required]',
          label: 'The username is required',
        },
        {
          type: 'selectorExists',
          selector: 'input[pattern]',
          label: 'A pattern restricts what counts as valid',
        },
      ],
    },
  },
  {
    id: 'html-form-validation-2',
    blocks: [
      {
        type: 'p',
        text: 'The laziest validation is picking the right type. type="email" rejects anything without an @-shape, type="url" insists on a web address, and type="number" accepts only digits — with min and max to fence in the range. No patterns to write; the browser already knows these rules by heart.',
      },
      {
        type: 'p',
        text: 'Types are also a kindness to phone users: email summons a keyboard with @ front and center, number brings up digits. The wrong type does not just skip validation — it actively makes typing harder.',
      },
      {
        type: 'code',
        text: '<input id="email" type="email" required>\n<input id="site" type="url">\n<input id="guests" type="number" min="1" max="8">',
      },
      {
        type: 'tip',
        text: 'type="number" is for amounts, not numerals: phone numbers and postcodes belong in type="text" or type="tel" — nobody wants a spinner on a phone number.',
      },
    ],
    exercise: {
      instructions:
        'This RSVP form accepts anything. Fix the types: make the email field type="email", the website field type="url", and the guests field type="number" with min="1".',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="email">Email</label>\n      <input id="email" type="text">\n      <label for="site">Your website</label>\n      <input id="site" type="text">\n      <label for="guests">Guests</label>\n      <input id="guests" type="text">\n      <button>RSVP</button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'input[type="email"]',
          label: 'The email field validates as an email',
        },
        {
          type: 'selectorExists',
          selector: 'input[type="url"]',
          label: 'The website field validates as a URL',
        },
        {
          type: 'selectorExists',
          selector: 'input[type="number"][min]',
          label: 'Guests is a number with a minimum',
        },
      ],
    },
  },
  {
    id: 'html-form-validation-3',
    blocks: [
      {
        type: 'p',
        text: 'When a pattern fails, browsers show a shrug of a message: "Please match the requested format." Requested by whom? Matching what? You can do better. On a field with a pattern, the title attribute gets appended to that error bubble — your chance to state the rule in human words.',
      },
      {
        type: 'p',
        text: 'Write titles that say what to do, not what went wrong: "Three capital letters, like KEW" beats "invalid input" every time. Pair the rule with a maxlength so visitors cannot wander past the limit, and consider repeating the rule in visible text nearby — the bubble only appears after a failed submit. (JavaScript can replace messages entirely with setCustomValidity, a treat for a later track.)',
      },
      {
        type: 'code',
        text: '<label for="code">Garden plot code</label>\n<input id="code" type="text"\n       pattern="[A-Z]{3}" maxlength="3"\n       title="Three capital letters, like KEW">',
      },
      {
        type: 'tip',
        text: 'Test your message: type "abc" and submit. The bubble should now explain the rule — your title — instead of mumbling about formats.',
      },
    ],
    exercise: {
      instructions:
        'Make the error helpful: give the plot-code input a title that explains the rule (something like "Three capital letters, like KEW") and a maxlength of 3.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="code">Garden plot code</label>\n      <input id="code" type="text" pattern="[A-Z]{3}">\n      <button>Claim plot</button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'input[pattern][title]',
          label: 'The pattern comes with a human explanation in title',
        },
        {
          type: 'selectorExists',
          selector: 'input[maxlength]',
          label: 'A maxlength stops runaway typing',
        },
      ],
    },
  },
  {
    id: 'html-form-validation-4',
    blocks: [
      {
        type: 'p',
        text: 'Validation rules are half the job; making sure everyone can perceive them is the other half. A sighted visitor sees the password rules printed under the field. A screen-reader user hears the field name and… nothing — unless you wire the hint to the input.',
      },
      {
        type: 'p',
        text: 'The wire is aria-describedby: give the hint element an id, point the input’s aria-describedby at that id, and screen readers append the hint when announcing the field — "Password, edit text, at least eight characters, one number." The same wiring later carries live error messages, so the habit pays twice.',
      },
      {
        type: 'code',
        text: '<label for="pw">Password</label>\n<input id="pw" type="password"\n       minlength="8" required\n       aria-describedby="pw-hint">\n<p id="pw-hint">At least eight characters, one number.</p>',
      },
      {
        type: 'tip',
        text: 'aria-describedby accepts several ids separated by spaces — hint and error message both, when the time comes.',
      },
    ],
    exercise: {
      instructions:
        'Connect the hint: give the rules paragraph an id="pw-hint", then point the password input at it with aria-describedby="pw-hint".',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="pw">Password</label>\n      <input id="pw" type="password" minlength="8" required>\n      <p>At least eight characters, one number.</p>\n      <button>Save</button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: '#pw-hint',
          label: 'The hint paragraph has the id "pw-hint"',
        },
        {
          type: 'attrEquals',
          selector: 'input',
          attr: 'aria-describedby',
          value: 'pw-hint',
          label: 'The input announces its hint via aria-describedby',
        },
      ],
    },
  },
  {
    id: 'html-form-validation-5',
    blocks: [
      {
        type: 'p',
        text: 'The graduation piece: a signup form that politely refuses bad data. Every technique from this topic reports for duty — required fields, validating types, patterns with human titles, and labels on everything, because accessibility is non-negotiable even in a validation lesson.',
      },
      {
        type: 'p',
        text: 'Three fields and a button: a username with a pattern (lowercase letters, say) plus a title explaining the rule; an email with type="email" and required; a password with type="password" and minlength="8". Each field gets its own <label> wired by for and id.',
      },
      {
        type: 'code',
        text: '<form>\n  <label for="user">Username</label>\n  <input id="user" type="text"\n         pattern="[a-z]+" title="Lowercase letters only"\n         required>\n  <!-- …email and password fields… -->\n  <button>Sign up</button>\n</form>',
      },
      {
        type: 'p',
        text: 'When you finish, try to break it: submit empty, type an email without an @, a six-character password. Every rejection should come with a message a human can act on. That is what bulletproof means — not that mistakes cannot happen, but that none slip through quietly.',
      },
      {
        type: 'tip',
        text: 'Browser validation is the first line of defense, never the only one — real sites repeat every check on the server, because not every visitor is a browser.',
      },
    ],
    exercise: {
      instructions:
        'Build the signup form: three labelled fields — a username with a pattern, an email with type="email" and required, and a password with type="password" and minlength="8" — above the submit button.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Join Sprout Club</h1>\n    <form>\n      <!-- username, email, and password — labelled and validated -->\n\n      <button>Sign up</button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'input[pattern]',
          label: 'The username enforces a pattern',
        },
        {
          type: 'selectorExists',
          selector: 'input[type="email"][required]',
          label: 'A required email field validates itself',
        },
        {
          type: 'selectorExists',
          selector: 'input[type="password"][minlength]',
          label: 'The password demands a minimum length',
        },
        {
          type: 'selectorCount',
          selector: 'label[for]',
          count: 3,
          label: 'All three fields have connected labels',
        },
      ],
    },
  },
];

export default lessons;
