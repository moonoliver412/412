// Topic: JSX & Components (react-jsx) — 5 lessons.

const lessons = [
  {
    id: 'react-jsx-1',
    blocks: [
      {
        type: 'p',
        text: 'React builds pages out of components — small, reusable pieces of UI. A component is just a function that returns what should appear on screen. You write that UI in JSX, which looks like HTML living inside your JavaScript.',
      },
      {
        type: 'p',
        text: 'A component name always starts with a capital letter. Here is one that shows a heading:',
      },
      {
        type: 'code',
        text: 'function Welcome() {\n  return <h1>Hello, gardener</h1>;\n}',
      },
      {
        type: 'tip',
        text: 'JSX must return one top-level element. Wrap several elements in one parent (like a <div>) if you need more than one.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Make a component named App that returns an <h1> saying "Hello React".',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h1',
          label: 'Your component renders an <h1>',
          hint: 'Return <h1>…</h1> instead of null.',
        },
        {
          type: 'textIncludes',
          text: 'hello react',
          selector: 'h1',
          label: 'The heading says Hello React',
        },
      ],
      hints: [
        'Replace return null with return <h1>Hello React</h1>;',
        'Keep the component named App so it renders.',
      ],
      solution: 'function App() {\n  return <h1>Hello React</h1>;\n}',
    },
  },
  {
    id: 'react-jsx-2',
    blocks: [
      {
        type: 'p',
        text: 'JSX lets you drop JavaScript values right into your UI. Wrap the value in curly braces and React will render it.',
      },
      {
        type: 'p',
        text: 'You can embed a variable, a number, or any expression inside JSX:',
      },
      {
        type: 'code',
        text: 'const name = "Alex";\nfunction App() {\n  return <p>Hello, {name}!</p>;\n}',
      },
      {
        type: 'tip',
        text: 'Curly braces work anywhere inside JSX — in text, in attributes, or nested deep.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a variable called "language" set to "React". Render a <p> that says "I am learning React" using that variable inside curly braces.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'p',
          label: 'Your component renders a <p>',
          hint: 'Return a <p> element from App.',
        },
        {
          type: 'textIncludes',
          text: 'i am learning react',
          selector: 'p',
          label: 'The paragraph says "I am learning React"',
          hint: 'Embed the language variable inside the text with curly braces.',
        },
        {
          type: 'sourceIncludes',
          text: '{language}',
          label: 'You used the variable in curly braces',
          hint: 'Write {language} inside your JSX to embed the value.',
        },
      ],
      hints: [
        'Declare const language = "React"; above the function.',
        'Inside the return, write <p>I am learning {language}</p>.',
      ],
      solution:
        'const language = "React";\nfunction App() {\n  return <p>I am learning {language}</p>;\n}',
    },
  },
  {
    id: 'react-jsx-3',
    blocks: [
      {
        type: 'p',
        text: 'You can compute values right inside curly braces — not just variables. Any JavaScript expression works.',
      },
      {
        type: 'code',
        text: 'function App() {\n  const score = 42;\n  return <p>Your score: {score * 2}</p>;\n}',
      },
      {
        type: 'tip',
        text: 'An expression is anything that produces a value: math, a ternary, a function call. Statements (like if or for) do not go inside curly braces.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a variable "year" set to 2024. Render an <h2> that shows "Year: 2024" using the variable inside curly braces.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h2',
          label: 'Your component renders an <h2>',
          hint: 'Return an <h2> element from App.',
        },
        {
          type: 'textIncludes',
          text: '2024',
          selector: 'h2',
          label: 'The heading shows 2024',
          hint: 'Embed the year variable with {year}.',
        },
        {
          type: 'sourceIncludes',
          text: '{year}',
          label: 'You used the year variable in curly braces',
          hint: 'Write {year} inside your <h2>.',
        },
      ],
      hints: [
        'Declare const year = 2024; inside the function body.',
        'Return <h2>Year: {year}</h2>;',
      ],
      solution:
        'function App() {\n  const year = 2024;\n  return <h2>Year: {year}</h2>;\n}',
    },
  },
  {
    id: 'react-jsx-4',
    blocks: [
      {
        type: 'p',
        text: 'You can nest JSX elements inside each other, just like HTML. One element wraps another.',
      },
      {
        type: 'p',
        text: 'Here is a card built from nested elements:',
      },
      {
        type: 'code',
        text: 'function App() {\n  return (\n    <div>\n      <h2>My Card</h2>\n      <p>Some text here.</p>\n    </div>\n  );\n}',
      },
      {
        type: 'tip',
        text: 'When your JSX spans more than one line, wrap it in parentheses after the return keyword. This stops JavaScript from inserting a semicolon too early.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Build an App that renders a <div> containing an <h1> saying "My Profile" and a <p> saying "I write code."',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'div',
          label: 'There is a <div> wrapper',
          hint: 'Wrap both elements in a <div>.',
        },
        {
          type: 'selectorExists',
          selector: 'div h1',
          label: 'An <h1> is inside the <div>',
          hint: 'Put <h1>My Profile</h1> inside the <div>.',
        },
        {
          type: 'textIncludes',
          text: 'i write code',
          selector: 'p',
          label: 'The <p> says "I write code."',
          hint: 'Add <p>I write code.</p> inside the <div>.',
        },
      ],
      hints: [
        'Return a <div> and put the <h1> and <p> inside it.',
        'Use parentheses: return (\n  <div>...</div>\n);',
      ],
      solution:
        'function App() {\n  return (\n    <div>\n      <h1>My Profile</h1>\n      <p>I write code.</p>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-jsx-5',
    blocks: [
      {
        type: 'p',
        text: 'JSX attributes look like HTML attributes, but they follow JavaScript rules. Class becomes className. You set them with a string or a curly-brace value.',
      },
      {
        type: 'code',
        text: 'function App() {\n  const highlight = true;\n  return (\n    <div>\n      <p className="note">Learn JSX</p>\n      <img src="tree.png" alt="a tree" />\n    </div>\n  );\n}',
      },
      {
        type: 'tip',
        text: 'Self-closing tags (like <img />) need the slash in JSX. HTML lets you skip it; JSX does not.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Render a <div> that contains an <h1> with className "title" saying "JSX Capstone", and a <p> with className "subtitle" saying "Attributes work too."',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h1.title',
          label: 'An <h1> with className "title" is rendered',
          hint: 'Add className="title" to your <h1>.',
        },
        {
          type: 'textIncludes',
          text: 'jsx capstone',
          selector: 'h1',
          label: 'The <h1> says "JSX Capstone"',
        },
        {
          type: 'selectorExists',
          selector: 'p.subtitle',
          label: 'A <p> with className "subtitle" is rendered',
          hint: 'Add className="subtitle" to your <p>.',
        },
      ],
      hints: [
        'Use className="title" on the <h1>, not class="title".',
        'Wrap both inside a <div> and return with parentheses.',
      ],
      solution:
        'function App() {\n  return (\n    <div>\n      <h1 className="title">JSX Capstone</h1>\n      <p className="subtitle">Attributes work too.</p>\n    </div>\n  );\n}',
    },
  },
];

export default lessons;
