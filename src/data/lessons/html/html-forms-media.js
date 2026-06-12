// Topic: Forms & Media (html-forms-media) — 5 lessons.

const lessons = [
  {
    id: 'html-forms-media-1',
    blocks: [
      {
        type: 'p',
        text: 'So far your pages talk at people. Forms let people talk back. Search boxes, sign-ups, and comment fields are all forms. The <form> element is the container. Inside it live controls — the most common one is <input>.',
      },
      {
        type: 'code',
        text: '<form>\n  <input type="text" name="plant" placeholder="e.g. silver birch">\n</form>',
      },
      {
        type: 'p',
        text: '<input> is a void element — it changes its behavior through the type attribute. type="text" gives you a one-line text box. Later you will meet email, number, checkbox, and more. Two other attributes matter right away. name labels the data when the form is sent — name="plant" means the answer arrives as plant=birch. placeholder is the gray hint text shown while the box is empty.',
      },
      {
        type: 'tip',
        text: 'No name, no data. An input without a name attribute is skipped when the form is sent. Give every input a name.',
      },
    ],
    exercise: {
      instructions:
        'Start a nursery survey: add a <form>, and inside it an <input> with type="text", a name of "plant", and a placeholder inviting people to type their favorite plant.',
      hints: [
        'A <form> is the container for all form controls. The <input> goes inside it and needs a name attribute so its data is sent correctly.',
        'Add <form> containing <input type="text" name="plant" placeholder="e.g. silver birch">.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Nursery survey</h1>\n    <form>\n      <input type="text" name="plant" placeholder="e.g. silver birch">\n    </form>\n\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Nursery survey</h1>\n    <!-- your form goes here -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'form',
          label: 'Your page has a <form>',
          hint: 'Add a <form> element to the page.',
        },
        {
          type: 'selectorExists',
          selector: 'form input[name]',
          label: 'An input inside it has a name attribute',
          hint: 'Your <input> needs a name attribute — without it, its data never gets sent.',
        },
      ],
    },
  },
  {
    id: 'html-forms-media-2',
    blocks: [
      {
        type: 'p',
        text: 'A bare text box is a mystery. A <label> tells people what it is for. Connect the two with a matched pair of attributes: the input gets an id, and the label gets a for set to the same value. Once linked, clicking the label focuses the input. Screen readers read them together.',
      },
      {
        type: 'code',
        text: '<label for="size">Pot size</label>\n<select id="size">\n  <option>Small</option>\n  <option>Large</option>\n</select>\n<button>Order</button>',
      },
      {
        type: 'p',
        text: 'Two more controls complete most forms. <select> is a drop-down menu. Each choice inside it is an <option>. <button> is the trigger — inside a form it submits by default. Its label text goes between the opening and closing tags, not in an attribute.',
      },
      {
        type: 'tip',
        text: 'for and id must match exactly — every character counts. A label with for="Size" will not connect to id="size".',
      },
    ],
    exercise: {
      instructions:
        'Finish the order form: add a <label> with for="grower" above the input, a <select> containing at least two <option> tree choices, and a <button> that says "Order".',
      hints: [
        'A <label> connects to its input using for (on the label) and id (on the input) — they must be the same value. A <select> holds <option> elements as its choices.',
        'Add <label for="grower">Grower name</label> above the input, then a <select> with two <option> elements, then <button>Order</button>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="grower">Grower name</label>\n      <input id="grower" type="text">\n      <select>\n        <option>Oak</option>\n        <option>Maple</option>\n      </select>\n      <button>Order</button>\n\n    </form>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <!-- 1. a <label> for the input below -->\n      <input id="grower" type="text">\n      <!-- 2. a <select> with two <option>s -->\n      <!-- 3. a <button> -->\n\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'attrEquals',
          selector: 'label',
          attr: 'for',
          value: 'grower',
          label: 'Your <label> is connected to the input (for="grower")',
          hint: 'Add a <label> with for="grower" — this must match the input\'s id exactly.',
        },
        {
          type: 'selectorExists',
          selector: 'select option',
          label: 'A drop-down offers <option> choices',
          hint: 'Add a <select> element with at least two <option> elements inside it.',
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
        text: 'People forget fields and mistype emails. HTML can catch many of these mistakes before any code runs. Add the required attribute — it needs no value — and the browser blocks submission while that field is empty. It even shows a polite error bubble.',
      },
      {
        type: 'code',
        text: '<input type="email" name="email" required>\n<input type="password" name="pw" minlength="8">',
      },
      {
        type: 'p',
        text: 'The type attribute validates too. type="email" requires something email-shaped. type="number" only accepts digits. For length limits, use minlength and maxlength. Number inputs can also set min and max. Together these are called constraint validation — guardrails you get for free, just by describing your data accurately.',
      },
      {
        type: 'tip',
        text: 'Browser validation is a convenience, not a security wall. Anyone can bypass it, so real apps always check again on the server.',
      },
    ],
    exercise: {
      instructions:
        'Add guardrails to this sign-up form: change the first input\'s type to "email" and make it required, then give the password input a minlength of 8.',
      hints: [
        'type="email" tells the browser to validate for an email shape. required blocks submission if the field is empty. minlength sets how short a value can be.',
        'On the email input: change type="text" to type="email" and add required. On the password input: add minlength="8".',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="email">Email</label>\n      <input id="email" type="email" name="email" required>\n      <label for="pw">Password</label>\n      <input id="pw" type="password" name="pw" minlength="8">\n      <button>Sign up</button>\n    </form>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <form>\n      <label for="email">Email</label>\n      <input id="email" type="text" name="email">\n      <label for="pw">Password</label>\n      <input id="pw" type="password" name="pw">\n      <button>Sign up</button>\n    </form>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'input[type="email"]',
          label: 'The email field has type="email"',
          hint: 'Change type="text" to type="email" on the email input.',
        },
        {
          type: 'selectorExists',
          selector: 'input[required]',
          label: 'The email field is required',
          hint: 'Add the required attribute to the email input (no value needed).',
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
        text: 'Sound and video get their own elements: <audio> and <video>. Both work the same way. Point src at a media file and add the controls attribute. Controls tells the browser to show play, pause, and volume buttons. Without controls, visitors have no way to start playback.',
      },
      {
        type: 'code',
        text: '<video src="garden.mp4" controls width="320">\n  Sorry, your browser cannot play this video.\n</video>\n<audio src="birdsong.mp3" controls></audio>',
      },
      {
        type: 'p',
        text: 'Text between the tags is a fallback. Only very old browsers that cannot play media will show it. Video also takes width and height, and a poster attribute for the image shown before play. Use autoplay with care. Browsers mostly block it when sound is on — and nobody likes a page that blasts audio at them.',
      },
      {
        type: 'tip',
        text: 'A player with a made-up src will not play here — and that is fine. The structure is what you are practicing, not the media file.',
      },
    ],
    exercise: {
      instructions:
        'Build the nature-cam page: add a <video> with src="garden.mp4" and the controls attribute, then an <audio> player with src="birdsong.mp3" and controls.',
      hints: [
        '<video> and <audio> both use src for the file and controls to show the play button. Without controls, visitors have no way to start playback.',
        'Add <video src="garden.mp4" controls></video> then <audio src="birdsong.mp3" controls></audio>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden nature cam</h1>\n    <video src="garden.mp4" controls></video>\n    <audio src="birdsong.mp3" controls></audio>\n\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <h1>Garden nature cam</h1>\n    <!-- video player, then audio player -->\n\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'video[controls]',
          label: 'A <video> player has visible controls',
          hint: 'Add a <video> element with src="garden.mp4" and the controls attribute.',
        },
        {
          type: 'selectorExists',
          selector: 'audio[controls]',
          label: 'An <audio> player has visible controls',
          hint: 'Add an <audio> element with src="birdsong.mp3" and the controls attribute.',
        },
      ],
    },
  },
  {
    id: 'html-forms-media-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to build a proper contact form — labels, validation, everything. One new element joins the team: <textarea>, a multi-line text box for messages. Unlike <input>, it has a closing tag. The rows attribute sets its visible height.',
      },
      {
        type: 'code',
        text: '<label for="message">Message</label>\n<textarea id="message" name="message" rows="4"></textarea>',
      },
      {
        type: 'p',
        text: 'A good contact form has a labelled name field, a labelled email field (required and type="email"), a labelled textarea for the message, and a clear send button. Work field by field: label first, control second, ids matching the fors. This is the form you will wire up for real once you meet JavaScript.',
      },
      {
        type: 'tip',
        text: 'Leave nothing unlabelled. When every control has a matching label, keyboard and screen-reader users can use your form just as easily as anyone else.',
      },
    ],
    exercise: {
      instructions:
        'Build the contact form: a labelled text input for the name, a labelled <input> with type="email" and required, a labelled <textarea> for the message, and a <button> that says "Send". Use matching for/id pairs on every field.',
      hints: [
        'Every field needs a <label> connected by for/id. Build field by field: label first, then the control, ids must match the fors exactly.',
        'Add three field pairs: <label for="name">Name</label><input id="name" type="text">, <label for="email">Email</label><input id="email" type="email" required>, <label for="message">Message</label><textarea id="message"></textarea>, then <button>Send</button>.',
      ],
      solution:
        '<!doctype html>\n<html>\n  <body>\n    <main>\n      <h1>Contact the nursery</h1>\n      <form>\n        <label for="name">Name</label>\n        <input id="name" type="text">\n        <label for="email">Email</label>\n        <input id="email" type="email" required>\n        <label for="message">Message</label>\n        <textarea id="message"></textarea>\n        <button>Send</button>\n\n      </form>\n    </main>\n  </body>\n</html>',
      starter:
        '<!doctype html>\n<html>\n  <body>\n    <main>\n      <h1>Contact the nursery</h1>\n      <form>\n        <!-- name field (label + input) -->\n        <!-- email field (label + input, required) -->\n        <!-- message (label + textarea) -->\n        <!-- send button -->\n\n      </form>\n    </main>\n  </body>\n</html>',
      checks: [
        {
          type: 'selectorExists',
          selector: 'label[for]',
          label: 'Fields have connected <label>s',
          hint: 'Each <label> needs a for attribute that matches its input\'s id.',
        },
        {
          type: 'selectorExists',
          selector: 'input[type="email"][required]',
          label: 'The email field is email-typed and required',
          hint: 'One <input> needs both type="email" and required.',
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
