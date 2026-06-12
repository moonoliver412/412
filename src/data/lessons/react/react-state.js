// Topic: State & useState (react-state) — 5 lessons.

const lessons = [
  {
    id: 'react-state-1',
    blocks: [
      {
        type: 'p',
        text: 'State is data that can change over time. When state changes, React re-renders the component with the new value.',
      },
      {
        type: 'p',
        text: 'You create state with the useState hook. It gives you the current value and a function to update it:',
      },
      {
        type: 'code',
        text: 'const [count, setCount] = useState(0);',
      },
      {
        type: 'tip',
        text: 'The argument to useState is the starting value. You can use 0, "", false, or anything you need.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a state variable "count" starting at 0. Render its value in a <p>. Add a <button> that calls setCount(count + 1) when clicked.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState is used',
          hint: 'Write const [count, setCount] = useState(0); inside App.',
        },
        {
          type: 'selectorExists',
          selector: 'button',
          label: 'A <button> is rendered',
          hint: 'Add a <button> element to your JSX.',
        },
        {
          type: 'sourceIncludes',
          text: 'onClick',
          label: 'The button has an onClick handler',
          hint: 'Add onClick={() => setCount(count + 1)} to the button.',
        },
      ],
      hints: [
        'const [count, setCount] = useState(0); — put this inside App, before the return.',
        'Give your button onClick={() => setCount(count + 1)}.',
      ],
      solution:
        'function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>{count}</p>\n      <button onClick={() => setCount(count + 1)}>Add</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-state-2',
    blocks: [
      {
        type: 'p',
        text: 'You can start state at any value — a string, a boolean, or a number. Render it just like any variable.',
      },
      {
        type: 'code',
        text: 'const [name, setName] = useState("stranger");\nreturn <p>Hello, {name}</p>;',
      },
      {
        type: 'tip',
        text: 'State variable names are up to you. Pick something that describes what the data is — count, name, isOpen, items.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a "mood" state starting at "happy". Render it in an <h2>. Add a <button> that sets mood to "excited" when clicked.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState is used',
          hint: 'Write const [mood, setMood] = useState("happy");',
        },
        {
          type: 'selectorExists',
          selector: 'h2',
          label: 'An <h2> is rendered',
          hint: 'Return an <h2> showing {mood}.',
        },
        {
          type: 'textIncludes',
          text: 'happy',
          selector: 'h2',
          label: 'The initial mood "happy" is shown in the <h2>',
          hint: 'useState("happy") sets the starting value.',
        },
      ],
      hints: [
        'const [mood, setMood] = useState("happy");',
        'Add <button onClick={() => setMood("excited")}>Change</button>.',
      ],
      solution:
        'function App() {\n  const [mood, setMood] = useState("happy");\n  return (\n    <div>\n      <h2>{mood}</h2>\n      <button onClick={() => setMood("excited")}>Change</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-state-3',
    blocks: [
      {
        type: 'p',
        text: 'The setter function replaces the old state value. You can also compute the next value based on the previous one.',
      },
      {
        type: 'code',
        text: '// Safe pattern: pass a function to the setter\nsetCount(prev => prev + 1);',
      },
      {
        type: 'tip',
        text: 'Using the function form of the setter (prev => prev + 1) is safer when the new value depends on the old one. React guarantees prev is always up to date.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a "score" state starting at 10. Render it in a <p>. Add a button that doubles the score using the function form of the setter: setScore(prev => prev * 2).',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState is used',
          hint: 'const [score, setScore] = useState(10);',
        },
        {
          type: 'textIncludes',
          text: '10',
          selector: 'p',
          label: 'The initial score of 10 is shown',
          hint: 'Render {score} in a <p>.',
        },
        {
          type: 'sourceIncludes',
          text: 'prev =>',
          label: 'The functional setter form is used',
          hint: 'Write setScore(prev => prev * 2) in your onClick.',
        },
      ],
      hints: [
        'const [score, setScore] = useState(10); — put inside App before the return.',
        'onClick={() => setScore(prev => prev * 2)}',
      ],
      solution:
        'function App() {\n  const [score, setScore] = useState(10);\n  return (\n    <div>\n      <p>{score}</p>\n      <button onClick={() => setScore(prev => prev * 2)}>Double</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-state-4',
    blocks: [
      {
        type: 'p',
        text: 'You can have more than one state variable in the same component. Each useState call is independent.',
      },
      {
        type: 'code',
        text: 'const [likes, setLikes] = useState(0);\nconst [title, setTitle] = useState("My Post");',
      },
      {
        type: 'tip',
        text: 'Keep each piece of state focused on one thing. Two separate state variables are cleaner than one big object when the values change independently.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create two state variables: "step" starting at 1 and "done" starting at false. Render step in an <h3> and show "Complete" in a <p> if done is true (use a ternary). Add a button that sets done to true.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState is used',
          hint: 'Call useState twice — once for step, once for done.',
        },
        {
          type: 'selectorExists',
          selector: 'h3',
          label: 'An <h3> is rendered',
          hint: 'Return an <h3> showing {step}.',
        },
        {
          type: 'sourceIncludes',
          text: 'setDone',
          label: 'setDone is called somewhere',
          hint: 'Call setDone(true) inside a button onClick.',
        },
      ],
      hints: [
        'const [step, setStep] = useState(1); const [done, setDone] = useState(false);',
        'Render {done ? "Complete" : ""} in a <p>.',
      ],
      solution:
        'function App() {\n  const [step, setStep] = useState(1);\n  const [done, setDone] = useState(false);\n  return (\n    <div>\n      <h3>Step {step}</h3>\n      <p>{done ? "Complete" : "In progress"}</p>\n      <button onClick={() => setDone(true)}>Finish</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-state-5',
    blocks: [
      {
        type: 'p',
        text: 'Now combine what you know: state, rendering, and a button that updates the UI. This is the core loop of React.',
      },
      {
        type: 'p',
        text: 'A simple counter shows the full cycle — state starts at a value, a button fires the setter, and React re-draws the new value.',
      },
      {
        type: 'code',
        text: 'function App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>+1</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}',
      },
      {
        type: 'tip',
        text: 'Two buttons — one to increment, one to reset — is a great way to practice both setter forms at once.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Build a life counter. State starts at 3. Render the count in an <h2>. Add a "-1" button (setLives(prev => prev - 1)) and a "Reset" button (setLives(3)).',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState is used',
          hint: 'const [lives, setLives] = useState(3);',
        },
        {
          type: 'textIncludes',
          text: '3',
          selector: 'h2',
          label: 'The initial lives count of 3 is shown in the <h2>',
          hint: 'Render {lives} in an <h2>.',
        },
        {
          type: 'sourceIncludes',
          text: 'setLives',
          label: 'setLives is called in at least one handler',
          hint: 'Add onClick handlers to both buttons.',
        },
      ],
      hints: [
        'const [lives, setLives] = useState(3);',
        'Two buttons: onClick={() => setLives(prev => prev - 1)} and onClick={() => setLives(3)}.',
      ],
      solution:
        'function App() {\n  const [lives, setLives] = useState(3);\n  return (\n    <div>\n      <h2>{lives}</h2>\n      <button onClick={() => setLives(prev => prev - 1)}>-1</button>\n      <button onClick={() => setLives(3)}>Reset</button>\n    </div>\n  );\n}',
    },
  },
];

export default lessons;
