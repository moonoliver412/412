// Topic: Props (react-props) — 5 lessons.

const lessons = [
  {
    id: 'react-props-1',
    blocks: [
      {
        type: 'p',
        text: 'Props are values you pass into a component — like settings. The component receives them as an object and uses them to decide what to render.',
      },
      {
        type: 'p',
        text: 'Here a parent passes a name prop to a child:',
      },
      {
        type: 'code',
        text: 'function Greeting(props) {\n  return <p>Hello, {props.name}</p>;\n}\nfunction App() {\n  return <Greeting name="Sam" />;\n}',
      },
      {
        type: 'tip',
        text: 'The App component is the one that renders. Greeting is a helper. Grade checks run on what App renders to the page.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Write a Tag component that takes a "label" prop and renders it in a <span>. Then have App render <Tag label="React" />.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'span',
          label: 'A <span> is rendered',
          hint: 'Have Tag return a <span> with {props.label} inside.',
        },
        {
          type: 'textIncludes',
          text: 'react',
          selector: 'span',
          label: 'The span shows "React"',
          hint: 'Pass label="React" to <Tag> in App.',
        },
        {
          type: 'sourceIncludes',
          text: 'props.label',
          label: 'Tag uses props.label',
          hint: 'Read the label with {props.label} inside the component.',
        },
      ],
      hints: [
        'Define function Tag(props) { return <span>{props.label}</span>; } above App.',
        'In App return <Tag label="React" />;',
      ],
      solution:
        'function Tag(props) {\n  return <span>{props.label}</span>;\n}\nfunction App() {\n  return <Tag label="React" />;\n}',
    },
  },
  {
    id: 'react-props-2',
    blocks: [
      {
        type: 'p',
        text: 'You can pass multiple props to a component — any number you need.',
      },
      {
        type: 'code',
        text: 'function Card(props) {\n  return (\n    <div>\n      <h2>{props.title}</h2>\n      <p>{props.body}</p>\n    </div>\n  );\n}',
      },
      {
        type: 'tip',
        text: 'Destructuring makes props shorter to write. Instead of props.title you write { title } in the parameter list.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Write a Badge component that takes "name" and "score" props. Render them in a <div>: an <h3> for name and a <p> for score. Have App render <Badge name="Alex" score={99} />.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'h3',
          label: 'An <h3> is rendered',
          hint: 'Return an <h3> with the name prop inside Badge.',
        },
        {
          type: 'textIncludes',
          text: 'alex',
          selector: 'h3',
          label: 'The <h3> shows "Alex"',
          hint: 'Pass name="Alex" to Badge in App.',
        },
        {
          type: 'textIncludes',
          text: '99',
          selector: 'p',
          label: 'The <p> shows 99',
          hint: 'Pass score={99} to Badge in App.',
        },
      ],
      hints: [
        'Define function Badge(props) { ... } above App with an <h3> and <p>.',
        'In App return <Badge name="Alex" score={99} />;',
      ],
      solution:
        'function Badge(props) {\n  return (\n    <div>\n      <h3>{props.name}</h3>\n      <p>{props.score}</p>\n    </div>\n  );\n}\nfunction App() {\n  return <Badge name="Alex" score={99} />;\n}',
    },
  },
  {
    id: 'react-props-3',
    blocks: [
      {
        type: 'p',
        text: 'Destructuring lets you pull props out by name right in the function signature. It keeps the code clean.',
      },
      {
        type: 'code',
        text: 'function Label({ text, color }) {\n  return <span style={{ color }}>{text}</span>;\n}',
      },
      {
        type: 'tip',
        text: 'The double curly braces in style={{ color }} are not a typo. The outer {} is JSX expression syntax. The inner {} is a JavaScript object.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Write a Pill component that destructures a "word" prop and renders it in a <span>. Have App render <Pill word="Awesome" />.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'span',
          label: 'A <span> is rendered',
          hint: 'Return a <span> from Pill.',
        },
        {
          type: 'textIncludes',
          text: 'awesome',
          selector: 'span',
          label: 'The span shows "Awesome"',
          hint: 'Pass word="Awesome" to <Pill> in App.',
        },
        {
          type: 'sourceIncludes',
          text: '{ word }',
          label: 'You destructured the word prop',
          hint: 'Write function Pill({ word }) in the component definition.',
        },
      ],
      hints: [
        'function Pill({ word }) { return <span>{word}</span>; }',
        'In App return <Pill word="Awesome" />;',
      ],
      solution:
        'function Pill({ word }) {\n  return <span>{word}</span>;\n}\nfunction App() {\n  return <Pill word="Awesome" />;\n}',
    },
  },
  {
    id: 'react-props-4',
    blocks: [
      {
        type: 'p',
        text: 'Default props let a component work even when a prop is not passed. You set the default with = in the destructured parameter.',
      },
      {
        type: 'code',
        text: 'function Greeting({ name = "friend" }) {\n  return <p>Hey, {name}!</p>;\n}',
      },
      {
        type: 'tip',
        text: 'If someone passes a name, they get that. If not, they get "friend". Always set defaults for optional props so nothing is blank.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Write a Notice component with a "message" prop that defaults to "All good!". Render a <p> with the message. Have App render <Notice /> with no props so the default shows.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'p',
          label: 'A <p> is rendered',
          hint: 'Return a <p> from Notice.',
        },
        {
          type: 'textIncludes',
          text: 'all good',
          selector: 'p',
          label: 'The default message "All good!" is shown',
          hint: 'Set the default: function Notice({ message = "All good!" }).',
        },
        {
          type: 'sourceIncludes',
          text: '= "All good!"',
          label: 'A default value is set for the message prop',
          hint: 'Use default parameter syntax: message = "All good!".',
        },
      ],
      hints: [
        'function Notice({ message = "All good!" }) { return <p>{message}</p>; }',
        'In App return <Notice />; — no props needed to show the default.',
      ],
      solution:
        'function Notice({ message = "All good!" }) {\n  return <p>{message}</p>;\n}\nfunction App() {\n  return <Notice />;\n}',
    },
  },
  {
    id: 'react-props-5',
    blocks: [
      {
        type: 'p',
        text: 'The special "children" prop holds whatever you put between the opening and closing tags of a component.',
      },
      {
        type: 'code',
        text: 'function Box({ children }) {\n  return <div className="box">{children}</div>;\n}\nfunction App() {\n  return <Box><p>I am inside the box.</p></Box>;\n}',
      },
      {
        type: 'tip',
        text: 'children is just a prop with a reserved name. Use it to build wrapper components like cards, modals, or layout containers.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Write a Frame component that wraps its children in a <section>. Have App render <Frame> with an <h2> saying "Framed!" inside it.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'section',
          label: 'A <section> is rendered',
          hint: 'Return a <section> from Frame with {children} inside.',
        },
        {
          type: 'selectorExists',
          selector: 'section h2',
          label: 'An <h2> is inside the <section>',
          hint: 'Put <h2>Framed!</h2> between <Frame> and </Frame>.',
        },
        {
          type: 'textIncludes',
          text: 'framed',
          selector: 'h2',
          label: 'The <h2> says "Framed!"',
        },
      ],
      hints: [
        'function Frame({ children }) { return <section>{children}</section>; }',
        'In App: return <Frame><h2>Framed!</h2></Frame>;',
      ],
      solution:
        'function Frame({ children }) {\n  return <section>{children}</section>;\n}\nfunction App() {\n  return <Frame><h2>Framed!</h2></Frame>;\n}',
    },
  },
];

export default lessons;
