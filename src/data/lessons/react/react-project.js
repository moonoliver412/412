// Topic: React Project (react-project) — 5 lessons.

const lessons = [
  {
    id: 'react-project-1',
    blocks: [
      {
        type: 'p',
        text: 'Time to build something real. You will make a to-do app step by step over the next five lessons.',
      },
      {
        type: 'p',
        text: 'First: render a static list of tasks. No state yet — just an array and a .map().',
      },
      {
        type: 'code',
        text: 'const tasks = ["Buy milk", "Water plants", "Push code"];\nfunction App() {\n  return (\n    <ul>\n      {tasks.map(t => <li key={t}>{t}</li>)}\n    </ul>\n  );\n}',
      },
      {
        type: 'tip',
        text: 'Starting with static data first is a good habit. Get the shape right, then add interactivity.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Create an array "tasks" with at least 3 strings. Render them as <li> elements inside a <ul> using .map(). Give each <li> a key.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'ul',
          label: 'A <ul> is rendered',
          hint: 'Return a <ul> from App.',
        },
        {
          type: 'selectorExists',
          selector: 'li',
          count: 3,
          label: 'At least 3 <li> elements are shown',
          hint: 'Put 3 items in your tasks array.',
        },
        {
          type: 'sourceIncludes',
          text: '.map(',
          label: '.map() is used to build the list',
          hint: 'Use tasks.map(t => <li key={t}>{t}</li>).',
        },
      ],
      hints: [
        'const tasks = ["Task one", "Task two", "Task three"];',
        'tasks.map(t => <li key={t}>{t}</li>) inside a <ul>.',
      ],
      solution:
        'const tasks = ["Buy milk", "Water plants", "Push code"];\nfunction App() {\n  return (\n    <ul>\n      {tasks.map(t => <li key={t}>{t}</li>)}\n    </ul>\n  );\n}',
    },
  },
  {
    id: 'react-project-2',
    blocks: [
      {
        type: 'p',
        text: 'Now move the task list into state. This lets the app update the list over time.',
      },
      {
        type: 'p',
        text: 'Replace the plain array with useState:',
      },
      {
        type: 'code',
        text: 'const [tasks, setTasks] = useState(["Buy milk", "Water plants"]);',
      },
      {
        type: 'tip',
        text: 'useState can hold any type — including an array. The list renders the same way; now you just have a setter to change it.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Move your tasks list into state with useState. Keep the same .map() render. Add a button that appends "New task" to the list when clicked.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'useState',
          label: 'useState holds the task list',
          hint: 'const [tasks, setTasks] = useState([...]);',
        },
        {
          type: 'selectorExists',
          selector: 'li',
          label: 'At least one <li> is rendered',
          hint: 'Map over the tasks state to render <li> items.',
        },
        {
          type: 'sourceIncludes',
          text: '...prev',
          label: 'Spread syntax appends a new task',
          hint: 'setTasks(prev => [...prev, "New task"])',
        },
      ],
      hints: [
        'const [tasks, setTasks] = useState(["Buy milk", "Water plants"]);',
        'onClick={() => setTasks(prev => [...prev, "New task"])}',
      ],
      solution:
        'function App() {\n  const [tasks, setTasks] = useState(["Buy milk", "Water plants"]);\n  return (\n    <div>\n      <ul>\n        {tasks.map(t => <li key={t}>{t}</li>)}\n      </ul>\n      <button onClick={() => setTasks(prev => [...prev, "New task"])}>Add</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-project-3',
    blocks: [
      {
        type: 'p',
        text: 'Now add a text input so the user can type their own task. Use a controlled input with its own state variable.',
      },
      {
        type: 'code',
        text: 'const [input, setInput] = useState("");\n// In the JSX:\n<input value={input} onChange={e => setInput(e.target.value)} />',
      },
      {
        type: 'tip',
        text: 'Two state variables, two jobs: input tracks what the user is typing, tasks holds the saved list. Keep them separate.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Add a controlled <input> with its own "input" state. Add a button that appends the input value to the tasks list and then clears the input back to "". Render the task list as before.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'input',
          label: 'A text <input> is rendered',
          hint: 'Add an <input> with value and onChange.',
        },
        {
          type: 'sourceIncludes',
          text: 'onChange',
          label: 'The input has an onChange handler',
          hint: 'onChange={e => setInput(e.target.value)}',
        },
        {
          type: 'sourceIncludes',
          text: 'setInput("")',
          label: 'The input is cleared after adding a task',
          hint: 'Call setInput("") after pushing the new task into the list.',
        },
      ],
      hints: [
        'const [input, setInput] = useState("");',
        'In the add handler: setTasks(prev => [...prev, input]); setInput("");',
      ],
      solution:
        'function App() {\n  const [tasks, setTasks] = useState(["Buy milk"]);\n  const [input, setInput] = useState("");\n  function addTask() {\n    if (!input.trim()) return;\n    setTasks(prev => [...prev, input]);\n    setInput("");\n  }\n  return (\n    <div>\n      <ul>{tasks.map(t => <li key={t}>{t}</li>)}</ul>\n      <input value={input} onChange={e => setInput(e.target.value)} />\n      <button onClick={addTask}>Add</button>\n    </div>\n  );\n}',
    },
  },
  {
    id: 'react-project-4',
    blocks: [
      {
        type: 'p',
        text: 'Let users remove tasks. Use .filter() to return a new array that leaves out the one being deleted.',
      },
      {
        type: 'code',
        text: '// Remove the task at a given index:\nsetTasks(prev => prev.filter((_, i) => i !== index));',
      },
      {
        type: 'tip',
        text: '.filter() keeps items where the callback returns true. Returning i !== index drops only the item at that position.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Add a "Remove" button next to each task. When clicked, remove that task from the list using .filter(). Use the index from .map() to identify which task to remove.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: '.filter(',
          label: '.filter() is used to remove a task',
          hint: 'Use setTasks(prev => prev.filter((_, i) => i !== index)).',
        },
        {
          type: 'selectorExists',
          selector: 'li',
          label: 'Task <li> elements are rendered',
          hint: 'Map over tasks and render an <li> for each.',
        },
        {
          type: 'sourceIncludes',
          text: 'onClick',
          label: 'A remove button has an onClick handler',
          hint: 'Add a <button onClick={() => remove(index)}>Remove</button> inside each <li>.',
        },
      ],
      hints: [
        'In the map callback, use the second argument for the index: tasks.map((t, i) => ...).',
        'onClick={() => setTasks(prev => prev.filter((_, j) => j !== i))}',
      ],
      solution:
        'function App() {\n  const [tasks, setTasks] = useState(["Buy milk", "Water plants", "Push code"]);\n  function remove(index) {\n    setTasks(prev => prev.filter((_, i) => i !== index));\n  }\n  return (\n    <ul>\n      {tasks.map((t, i) => (\n        <li key={t}>\n          {t}\n          <button onClick={() => remove(i)}>Remove</button>\n        </li>\n      ))}\n    </ul>\n  );\n}',
    },
  },
  {
    id: 'react-project-5',
    blocks: [
      {
        type: 'p',
        text: 'Finish your to-do app. Combine the input, the list, and the remove button into one working app.',
      },
      {
        type: 'p',
        text: 'You have used: useState, .map(), .filter(), onChange, onClick, and controlled inputs. That is real React.',
      },
      {
        type: 'code',
        text: '// The full pattern in one place:\n// 1. State: tasks array + input string\n// 2. Add: spread old tasks + new input, clear input\n// 3. Remove: filter out the tapped index\n// 4. Render: map tasks, show input + buttons',
      },
      {
        type: 'tip',
        text: 'Guard against empty input with if (!input.trim()) return; before adding. It stops blank tasks from sneaking in.',
      },
    ],
    exercise: {
      kind: 'react',
      instructions:
        'Build the complete to-do app: tasks state (at least 2 items), an input+button to add new tasks, and a Remove button on each task. Guard against empty input.',
      starter: 'function App() {\n  return null;\n}\n',
      checks: [
        {
          type: 'selectorExists',
          selector: 'input',
          label: 'A text input is rendered',
          hint: 'Add a controlled <input> tied to an "input" state variable.',
        },
        {
          type: 'sourceIncludes',
          text: '.filter(',
          label: '.filter() is used to remove tasks',
          hint: 'Remove a task with setTasks(prev => prev.filter(...)).',
        },
        {
          type: 'sourceIncludes',
          text: 'trim()',
          label: 'Empty input is guarded with .trim()',
          hint: 'Add if (!input.trim()) return; before pushing to the list.',
        },
      ],
      hints: [
        'Two state vars: const [tasks, setTasks] = useState([...]); const [input, setInput] = useState("");',
        'Add guard: if (!input.trim()) return; then setTasks and setInput("").',
      ],
      solution:
        'function App() {\n  const [tasks, setTasks] = useState(["Water the forest", "Commit code"]);\n  const [input, setInput] = useState("");\n  function add() {\n    if (!input.trim()) return;\n    setTasks(prev => [...prev, input]);\n    setInput("");\n  }\n  function remove(i) {\n    setTasks(prev => prev.filter((_, j) => j !== i));\n  }\n  return (\n    <div>\n      <ul>\n        {tasks.map((t, i) => (\n          <li key={i}>\n            {t}\n            <button onClick={() => remove(i)}>Remove</button>\n          </li>\n        ))}\n      </ul>\n      <input value={input} onChange={e => setInput(e.target.value)} />\n      <button onClick={add}>Add</button>\n    </div>\n  );\n}',
    },
  },
];

export default lessons;
