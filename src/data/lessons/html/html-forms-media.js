// Topic: Forms & Media (html-forms-media) — 5 lessons.

const lessons = [
  {
    id: 'html-forms-media-1',
    blocks: [
      {
        type: 'p',
        text: 'So far your pages talk at people. Forms let people talk back — search boxes, sign-ups, comment fields are all forms. The <form> element is the container, and inside it live controls, the most common being <input>.',
      },
      {
        type: 'code',
        text: '<form>\n  <input type="text" name="plant" placeholder="e.g. silver birch">\n</form>',
      },
      {
        type: 'p',
        text: '<input> is a void element that changes personality through its type attribute: type="text" is a one-line text box, and later you will meet email, number, checkbox, and more. Two other attributes matter from day one: name, which labels the data when the form is sent (name="plant" means the answer arrives as plant=birch), and placeholder, the gray hint text shown while the box is empty.',
      },
      {
        type: 'tip',
        text: 'No name, no data — an input without a name attribute is skipped entirely when the form is submitted. Give every input one.',
      },
    ],
    exercise: {
      instructions:
        'Start a nursery survey: add a <form>, and inside it an <input> with type="text", a name of "plant", and a placeholder inviting people to type their favorite plant.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Nursery survey</h1>\n    <!-- your form goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'form',
          label: 'Your page has a <form>',
        },
        {
          type: 'selectorExists',
          selector: 'form input[name]',
          label: 'An input inside it has a name attribute',
        },
      ],
    },
  },
  {
    id: 'html-forms-media-2',
    blocks: [
      {
        type: 'p',
        text: 'A bare text box is a mystery — a <label> tells people what it is for. Connect the two with a matched pair of attributes: the input gets an id, and the label gets a for with the same value. Once linked, clicking the label focuses the input, and screen readers announce them together.',
      },
      {
        type: 'code',
        text: '<label for="size">Pot size</label>\n<select id="size">\n  <option>Small</option>\n  <option>Large</option>\n</select>\n<button>Order</button>',
      },
      {
        type: 'p',
        text: 'Two more controls round out most forms. <select> is a drop-down menu; each choice inside it is an <option>. And <button> is the big friendly trigger — inside a form it submits by default, and its text goes between the tags, not in an attribute.',
      },
      {
        type: 'tip',
        text: 'for and id must match exactly, character for character. A label with for="Size" will not connect to id="size".',
      },
    ],
    exercise: {
      instructions:
        'Finish the order form: add a <label> with for="grower" above the input, a <select> containing at least two <option> tree choices, and a <button> that says "Order".',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <!-- 1. a <label> for the input below -->\n      <input id="grower" type="text">\n      <!-- 2. a <select> with two <option>s -->\n      <!-- 3. a <button> -->\n\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'label',
          attr: 'for',
          value: 'grower',
          label: 'Your <label> is connected to the input (for="grower")',
        },
        {
          type: 'selectorExists',
          selector: 'select option',
          label: 'A drop-down offers <option> choices',
        },
        {
          type: 'selectorExists',
          selector: 'form button',
          label: 'There is a <button> to place the order',
        },
      ],
    },
  },
  {
    id: 'html-forms-media-3',
    blocks: [
      {
        type: 'p',
        text: 'People forget fields and mistype emails — and HTML can catch much of it before any code runs. Add the required attribute (it needs no value) and the browser refuses to submit while that field is empty, complete with a polite error bubble.',
      },
      {
        type: 'code',
        text: '<input type="email" name="email" required>\n<input type="password" name="pw" minlength="8">',
      },
      {
        type: 'p',
        text: 'The type attribute validates too: type="email" insists on something email-shaped, and type="number" only accepts digits. For lengths there are minlength and maxlength, and number inputs can set min and max. Together these are called constraint validation — guardrails you get for free, just by describing your data honestly.',
      },
      {
        type: 'tip',
        text: 'Browser validation is convenience, not security. Anyone determined can bypass it, so real apps must double-check on the server too.',
      },
    ],
    exercise: {
      instructions:
        'Add guardrails to this sign-up form: change the first input’s type to "email" and make it required, then give the password input a minlength of 8.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="email">Email</label>\n      <input id="email" type="text" name="email">\n      <label for="pw">Password</label>\n      <input id="pw" type="password" name="pw">\n      <button>Sign up</button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'input[type="email"]',
          label: 'The email field has type="email"',
        },
        {
          type: 'selectorExists',
          selector: 'input[required]',
          label: 'The email field is required',
        },
        {
          type: 'selectorExists',
          selector: 'input[minlength]',
          label: 'The password sets a minimum length',
        },
      ],
    },
  },
  {
    id: 'html-forms-media-4',
    blocks: [
      {
        type: 'p',
        text: 'Sound and moving pictures get first-class elements: <audio> and <video>. Both work the same way — point src at a media file, and add the controls attribute so the browser shows play, pause, and volume buttons. Without controls, visitors have no way to start playback at all.',
      },
      {
        type: 'code',
        text: '<video src="garden.mp4" controls width="320">\n  Sorry, your browser cannot play this video.\n</video>\n<audio src="birdsong.mp3" controls></audio>',
      },
      {
        type: 'p',
        text: 'The text between the tags is a fallback, shown only by browsers too old to play media. Video also takes width and height, and a poster attribute for the image shown before play. One attribute to use with care: autoplay. Browsers mostly block it with sound on — and visitors rarely forgive a page that shouts first.',
      },
      {
        type: 'tip',
        text: 'Like images with placeholder paths, a player with a made-up src will not actually play here — the structure is what we are practicing.',
      },
    ],
    exercise: {
      instructions:
        'Build the nature-cam page: add a <video> with src="garden.mp4" and the controls attribute, then an <audio> player with src="birdsong.mp3" and controls.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden nature cam</h1>\n    <!-- video player, then audio player -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'video[controls]',
          label: 'A <video> player has visible controls',
        },
        {
          type: 'selectorExists',
          selector: 'audio[controls]',
          label: 'An <audio> player has visible controls',
        },
      ],
    },
  },
  {
    id: 'html-forms-media-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to assemble a proper contact form — labels, validation, the lot. One new element joins the team: <textarea>, a multi-line text box for messages. Unlike <input> it has a closing tag, and a rows attribute sets its visible height.',
      },
      {
        type: 'code',
        text: '<label for="message">Message</label>\n<textarea id="message" name="message" rows="4"></textarea>',
      },
      {
        type: 'p',
        text: 'A trustworthy contact form has a labelled field for the name, a labelled email field that is required and email-typed, a labelled textarea for the message, and a clear button to send it. Work field by field: label first, control second, ids matching the fors. This is the exact form you will wire up for real once you learn some JavaScript.',
      },
      {
        type: 'tip',
        text: 'Leave nothing unlabelled. If every control has a matching label, keyboard and screen-reader users glide through your form like everyone else.',
      },
    ],
    exercise: {
      instructions:
        'Build the contact form: a labelled text input for the name, a labelled <input> with type="email" and required, a labelled <textarea> for the message, and a <button> that says "Send". Use matching for/id pairs on every field.',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <main>\n      <h1>Contact the nursery</h1>\n      <form>\n        <!-- name field (label + input) -->\n        <!-- email field (label + input, required) -->\n        <!-- message (label + textarea) -->\n        <!-- send button -->\n\n      </form>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'label[for]',
          label: 'Fields have connected <label>s',
        },
        {
          type: 'selectorExists',
          selector: 'input[type="email"][required]',
          label: 'The email field is email-typed and required',
        },
        {
          type: 'selectorExists',
          selector: 'form textarea',
          label: 'A <textarea> collects the message',
        },
        {
          type: 'selectorExists',
          selector: 'form button',
          label: 'A button sends the form',
        },
      ],
    },
  },
];

export default lessons;
