// Topic: Lists & Keys (react-lists) — 5 lessons.

const lessons = [
  {
    id: 'react-lists-1',
    blocks: [
      {
        type: 'p',
        text: 'To render a list of items, use the .map() method on an array. Each item becomes a JSX element.',
      },
      {
        type: 'code',
        text: 'const fruits = ["Apple", "Banana", "Cherry"];\nfunction App() {\n  return (\n    <ul>\n      {fruits.map(fruit => <li>{fruit}</li>)}\n    </ul>\n  );\n}',
      },
      {
        type: 'tip',
        text: '.map() returns a new array — one element for each item. React renders that array as a list of nodes.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create an array "colors" with three strings: "red", "green", "blue". Render a <ul> with one <li> per color using .map().',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'ul',
          label: 'A <ul> is rendered',
          hint: 'Return a <ul> element.',
        },
        {
          type: 'selectorExists',
          selector: 'li',
          count: 3,
          label: 'Three <li> elements are rendered',
          hint: 'Your colors array has 3 items — map produces 3 <li> elements.',
        },
        {
          type: 'sourceIncludes',
          text: '.map(',
          label: '.map() is used to render the list',
          hint: 'Use colors.map(color => <li>{color}</li>) inside the <ul>.',
        },
      ],
      hints: [
        'const colors = ["red", "green", "blue"]; — declare outside or inside App.',
        '{colors.map(color => <li>{color}</li>)} inside a <ul>.',
      ],
      solution:
        'const colors = ["red", "green", "blue"];\nfunction App() {\n  return (\n    <ul>\n      {colors.map(color => <li>{color}</li>)}\n    </ul>\n  );\n}',
    },
  },
  {
    id: 'react-lists-2',
    blocks: [
      {
        type: 'p',
        text: 'React needs a "key" on each list item so it can track which element is which when the list changes. Use a unique value — often the item itself or an id.',
      },
      {
        type: 'code',
        text: 'fruits.map(fruit => <li key={fruit}>{fruit}</li>)',
      },
      {
        type: 'tip',
        text: 'Keys must be unique among siblings. Never use the array index as a key unless the list never reorders — index keys can cause subtle bugs.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create an array "skills" with "HTML", "CSS", "JS". Render a <ul> with a <li key={skill}> for each one.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'li',
          count: 3,
          label: 'Three <li> elements are rendered',
          hint: 'Your skills array has 3 items.',
        },
        {
          type: 'sourceIncludes',
          text: 'key=',
          label: 'Each <li> has a key prop',
          hint: 'Add key={skill} to each <li>.',
        },
        {
          type: 'textIncludes',
          text: 'html',
          selector: 'ul',
          label: 'The list includes "HTML"',
          hint: 'Make sure "HTML" is in your skills array.',
        },
      ],
      hints: [
        'const skills = ["HTML", "CSS", "JS"];',
        'skills.map(skill => <li key={skill}>{skill}</li>)',
      ],
      solution:
        'const skills = ["HTML", "CSS", "JS"];\nfunction App() {\n  return (\n    <ul>\n      {skills.map(skill => <li key={skill}>{skill}</li>)}\n    </ul>\n  );\n}',
    },
  },
  {
    id: 'react-lists-3',
    blocks: [
      {
        type: 'p',
        text: 'Real data is often an array of objects. Map over it and pull out the fields you need.',
      },
      {
        type: 'code',
        text: 'const users = [\n  { id: 1, name: "Mia" },\n  { id: 2, name: "Leo" },\n];\nfunction App() {\n  return (\n    <ul>\n      {users.map(u => <li key={u.id}>{u.name}</li>)}\n    </ul>\n  );\n}',
      },
      {
        type: 'tip',
        text: 'Use the object id as the key — it is unique and stable. Avoid using the array index because it changes when items are added or removed.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create an array "items" with 3 objects, each having an id and a name. Render a <ul> with a <li key={item.id}> showing each item.name.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'li',
          count: 3,
          label: 'Three <li> elements are rendered',
          hint: 'Your items array needs 3 objects.',
        },
        {
          type: 'sourceIncludes',
          text: '.id',
          label: '.id is used as the key',
          hint: 'Write key={item.id} on each <li>.',
        },
        {
          type: 'sourceIncludes',
          text: '.name',
          label: '.name is rendered in each <li>',
          hint: 'Render {item.name} inside the <li>.',
        },
      ],
      hints: [
        'const items = [{ id: 1, name: "Sprout" }, { id: 2, name: "Oak" }, { id: 3, name: "Pine" }];',
        'items.map(item => <li key={item.id}>{item.name}</li>)',
      ],
      solution:
        'const items = [\n  { id: 1, name: "Sprout" },\n  { id: 2, name: "Oak" },\n  { id: 3, name: "Pine" },\n];\nfunction App() {\n  return (\n    <ul>\n      {items.map(item => <li key={item.id}>{item.name}</li>)}\n    </ul>\n  );\n}',
    },
  },
  {
    id: 'react-lists-4',
    blocks: [
      {
        type: 'p',
        text: 'State can hold an array. When you update it, React re-renders and the list changes automatically.',
      },
      {
        type: 'code',
        text: 'const [items, setItems] = useState(["first"]);\n// Add an item:\nsetItems(prev => [...prev, "new item"]);',
      },
      {
        type: 'tip',
        text: 'Never mutate the array directly (no push or splice). Always return a new array using the spread operator or .filter(). React only re-renders when the reference changes.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a state array "notes" starting with ["Hello"]. Render a <ul> with one <li> per note. Add a button that appends "New note" to the array.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState is used',
          hint: 'const [notes, setNotes] = useState(["Hello"]);',
        },
        {
          type: 'selectorExists',
          selector: 'li',
          label: 'At least one <li> is rendered initially',
          hint: 'Map over notes and render a <li> for each.',
        },
        {
          type: 'sourceIncludes',
          text: '...prev',
          label: 'Spread syntax is used to add an item',
          hint: 'setNotes(prev => [...prev, "New note"])',
        },
      ],
      hints: [
        'const [notes, setNotes] = useState(["Hello"]);',
        'onClick={() => setNotes(prev => [...prev, "New note"])}',
      ],
      solution:
        'function App() {\n  const [notes, setNotes] = useState(["Hello"]);\n  return (\n    <div>\n      <ul>\n        {notes.map((note, i) => <li key={i}>{note}</li>)}\n      </ul>\n      <button onClick={() => setNotes(prev => [...prev, "New note"])}>Add</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-lists-5',
    blocks: [
      {
        type: 'p',
        text: 'useEffect runs code after a render. You can use it to load data, set a title, or start a timer.',
      },
      {
        type: 'code',
        text: 'useEffect(() => {\n  // runs once after the first render\n}, []); // empty array = run once',
      },
      {
        type: 'tip',
        text: 'The second argument to useEffect is the dependency array. An empty array [] means "run only once, when the component first appears."',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create a "planets" state starting as an empty array. Use useEffect (with []) to set it to ["Mercury", "Venus", "Earth"]. Render a <ul> with a <li key={p}> for each planet.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useEffect',
          label: 'useEffect is used',
          hint: 'Call useEffect(() => { ... }, []) inside App.',
        },
        {
          type: 'selectorExists',
          selector: 'li',
          count: 3,
          label: 'Three <li> elements are rendered',
          hint: 'Set planets to an array of 3 strings inside useEffect.',
        },
        {
          type: 'sourceIncludes',
          text: 'setPlanets',
          label: 'The state is updated inside useEffect',
          hint: 'Call setPlanets(["Mercury", "Venus", "Earth"]) inside the effect.',
        },
      ],
      hints: [
        'const [planets, setPlanets] = useState([]);',
        'useEffect(() => { setPlanets(["Mercury", "Venus", "Earth"]); }, []);',
      ],
      solution:
        'function App() {\n  const [planets, setPlanets] = useState([]);\n  useEffect(() => {\n    setPlanets(["Mercury", "Venus", "Earth"]);\n  }, []);\n  return (\n    <ul>\n      {planets.map(p => <li key={p}>{p}</li>)}\n    </ul>\n  );\n}',
    },
  },
];

export default lessons;
