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
];

export default lessons;
