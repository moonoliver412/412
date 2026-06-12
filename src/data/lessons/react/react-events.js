// Topic: Events (react-events) — 5 lessons.

const lessons = [
  {
    id: 'react-events-1',
    blocks: [
      {
        type: 'p',
        text: 'Events let your app respond when the user does something — click a button, type in a field, or submit a form.',
      },
      {
        type: 'p',
        text: 'In React you attach an event handler with an attribute like onClick. Pass a function, not a function call:',
      },
      {
        type: 'code',
        text: '// Correct — pass the function\n<button onClick={handleClick}>Click me</button>\n\n// Wrong — this calls it immediately at render\n<button onClick={handleClick()}>Click me</button>',
      },
      {
        type: 'tip',
        text: 'An arrow function inline is also fine: onClick={() => doSomething()}. This gives you control over arguments.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a function handleClick that calls alert("clicked!"). Render a <button> with that function as its onClick handler.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'onClick',
          label: 'The button has an onClick attribute',
          hint: 'Add onClick={handleClick} to your <button>.',
        },
        {
          type: 'sourceIncludes',
          text: 'handleClick',
          label: 'handleClick is defined',
          hint: 'Define function handleClick() { alert("clicked!"); } inside App.',
        },
        {
          type: 'selectorExists',
          selector: 'button',
          label: 'A <button> is rendered',
          hint: 'Return a <button> from App.',
        },
      ],
      hints: [
        'Define function handleClick() { alert("clicked!"); } before the return.',
        'Give the button onClick={handleClick} — no parentheses.',
      ],
      solution:
        'function App() {\n  function handleClick() {\n    alert("clicked!");\n  }\n  return <button onClick={handleClick}>Click me</button>;\n}',
    },
  },
  {
    id: 'react-events-2',
    blocks: [
      {
        type: 'p',
        text: 'React passes an event object to your handler. You can use it to get details about what happened.',
      },
      {
        type: 'code',
        text: 'function App() {\n  function handleClick(event) {\n    console.log(event.type); // "click"\n  }\n  return <button onClick={handleClick}>Go</button>;\n}',
      },
      {
        type: 'tip',
        text: 'You can also use an arrow function to ignore the event: onClick={() => doThing()}. You only need event when you want details like key pressed or input value.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a state variable "label" starting at "Waiting". Render it in a <p>. Add a <button> with an inline arrow onClick that sets label to "Clicked!".',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState is used',
          hint: 'const [label, setLabel] = useState("Waiting");',
        },
        {
          type: 'textIncludes',
          text: 'waiting',
          selector: 'p',
          label: 'The initial label "Waiting" is shown',
          hint: 'Render {label} in a <p>.',
        },
        {
          type: 'sourceIncludes',
          text: 'onClick',
          label: 'A button has an onClick handler',
          hint: 'Add onClick={() => setLabel("Clicked!")} to the button.',
        },
      ],
      hints: [
        'const [label, setLabel] = useState("Waiting");',
        'Button: <button onClick={() => setLabel("Clicked!")}>Click</button>',
      ],
      solution:
        'function App() {\n  const [label, setLabel] = useState("Waiting");\n  return (\n    <div>\n      <p>{label}</p>\n      <button onClick={() => setLabel("Clicked!")}>Click</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-events-3',
    blocks: [
      {
        type: 'p',
        text: 'The onChange event fires every time the value in an input changes. Use it to keep state in sync with what the user types.',
      },
      {
        type: 'code',
        text: 'function App() {\n  const [text, setText] = useState("");\n  return (\n    <input\n      value={text}\n      onChange={e => setText(e.target.value)}\n    />\n  );\n}',
      },
      {
        type: 'tip',
        text: 'e.target.value is the current text in the input. Storing it in state makes the input a "controlled" component — React controls what is shown.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a "text" state starting at "". Render a controlled <input> that updates text on change. Show the current value of text in a <p> below the input.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'onChange',
          label: 'The input has an onChange handler',
          hint: 'Add onChange={e => setText(e.target.value)} to the input.',
        },
        {
          type: 'selectorExists',
          selector: 'input',
          label: 'An <input> is rendered',
          hint: 'Return an <input> element from App.',
        },
        {
          type: 'selectorExists',
          selector: 'p',
          label: 'A <p> is rendered to show the text',
          hint: 'Add a <p>{text}</p> below the input.',
        },
      ],
      hints: [
        'const [text, setText] = useState("");',
        '<input value={text} onChange={e => setText(e.target.value)} />',
      ],
      solution:
        'function App() {\n  const [text, setText] = useState("");\n  return (\n    <div>\n      <input value={text} onChange={e => setText(e.target.value)} />\n      <p>{text}</p>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-events-4',
    blocks: [
      {
        type: 'p',
        text: 'You can pass data to a handler using an arrow function wrapper. This is useful when you have multiple buttons that differ only by their value.',
      },
      {
        type: 'code',
        text: 'function App() {\n  const [color, setColor] = useState("blue");\n  return (\n    <div>\n      <p style={{ color }}>{color}</p>\n      <button onClick={() => setColor("red")}>Red</button>\n      <button onClick={() => setColor("blue")}>Blue</button>\n    </div>\n  );\n}',
      },
      {
        type: 'tip',
        text: 'Each button has its own inline arrow function. The arrow captures a different value, so each button does a different thing.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a "size" state starting at "small". Render the current size in a <p>. Add two buttons: one sets size to "small", the other sets it to "large".',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState is used',
          hint: 'const [size, setSize] = useState("small");',
        },
        {
          type: 'textIncludes',
          text: 'small',
          selector: 'p',
          label: 'The initial size "small" is shown in the <p>',
          hint: 'Render {size} in a <p>. useState("small") sets the default.',
        },
        {
          type: 'sourceIncludes',
          text: 'setSize',
          label: 'setSize is called in a handler',
          hint: 'Add onClick={() => setSize("large")} to one button.',
        },
      ],
      hints: [
        'const [size, setSize] = useState("small");',
        'Two buttons: onClick={() => setSize("small")} and onClick={() => setSize("large")}.',
      ],
      solution:
        'function App() {\n  const [size, setSize] = useState("small");\n  return (\n    <div>\n      <p>{size}</p>\n      <button onClick={() => setSize("small")}>Small</button>\n      <button onClick={() => setSize("large")}>Large</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-events-5',
    blocks: [
      {
        type: 'p',
        text: 'Forms use onSubmit to run code when the user submits. Call e.preventDefault() to stop the page from reloading.',
      },
      {
        type: 'code',
        text: 'function App() {\n  const [sent, setSent] = useState(false);\n  function handleSubmit(e) {\n    e.preventDefault();\n    setSent(true);\n  }\n  return (\n    <form onSubmit={handleSubmit}>\n      <button type="submit">Send</button>\n      {sent && <p>Sent!</p>}\n    </form>\n  );\n}',
      },
      {
        type: 'tip',
        text: 'Without e.preventDefault(), submitting a form causes the browser to navigate away and your app resets. Always call it in form handlers.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a "submitted" state starting at false. Render a <form> with a submit button. On submit, call e.preventDefault() and set submitted to true. Show a <p> saying "Done!" when submitted is true.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'onSubmit',
          label: 'The form has an onSubmit handler',
          hint: 'Add onSubmit={handleSubmit} to the <form>.',
        },
        {
          type: 'sourceIncludes',
          text: 'preventDefault',
          label: 'e.preventDefault() is called',
          hint: 'Call e.preventDefault(); inside your submit handler.',
        },
        {
          type: 'selectorExists',
          selector: 'form',
          label: 'A <form> is rendered',
          hint: 'Return a <form> element from App.',
        },
      ],
      hints: [
        'const [submitted, setSubmitted] = useState(false);',
        'function handleSubmit(e) { e.preventDefault(); setSubmitted(true); }',
      ],
      solution:
        'function App() {\n  const [submitted, setSubmitted] = useState(false);\n  function handleSubmit(e) {\n    e.preventDefault();\n    setSubmitted(true);\n  }\n  return (\n    <form onSubmit={handleSubmit}>\n      <button type="submit">Send</button>\n      {submitted && <p>Done!</p>}\n    </form>\n  );\n}',
    },
  },
];

export default lessons;
