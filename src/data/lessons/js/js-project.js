// Topic: Projects & Practice (js-project) — 5 lessons.

const lessons = [
  {
    id: 'js-project-1',
    blocks: [
      {
        type: 'p',
        text: 'The hardest part of any project is not the code — it is starting. A blank file feels impossible. Break through it with a simple technique: list everything the app needs to do, pick the smallest item, and write just enough code to make that one thing work.',
      },
      {
        type: 'p',
        text: 'This is called vertical slicing. Instead of building all the data, then all the logic, then all the UI one after another, you build one tiny working feature end-to-end first. Every slice proves the whole system works and gives you something you can show. Progress builds on progress.',
      },
      {
        type: 'code',
        text: '// Planning a seed-tracker app — start with a list of features:\n// 1. Add a seed to a collection          ← first slice\n// 2. List all seeds\n// 3. Mark a seed as planted\n// 4. Count how many are planted\n//\n// First slice in code:\nconst seeds = [];\nfunction addSeed(name) {\n  seeds.push({ name, planted: false });\n}\naddSeed("sunflower");\nconsole.log(seeds);',
      },
      {
        type: 'tip',
        text: 'Write the simplest thing that could possibly work. You can always improve it later. A simple working version is far more useful than a perfect version that does not exist yet.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write the first slice of a tiny note-taking app. Create an array called notes and a function addNote(text) that pushes { text, done: false } into it. Call addNote twice with different strings, then log notes.length.',
      hints: [
        'Inside addNote, use notes.push({ text, done: false }); — that creates an object with the text you passed and done starting as false.',
        'Add notes.push({ text: text, done: false }); inside the addNote function body.',
      ],
      starter:
        'const notes = [];\n\nfunction addNote(text) {\n  // push { text, done: false } into notes\n  // your code here\n}\n\naddNote("water the oak");\naddNote("plant the maple");\n\nconsole.log(notes.length);',
      checks: [
        {
          type: 'logIncludes',
          text: '2',
          label: 'notes.length is 2 after adding two notes',
          hint: 'Make sure addNote pushes one object per call so notes.length reaches 2.',
        },
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(notes) && notes.length === 2 && notes[0].done === false',
          label: 'Every note starts with done set to false',
          hint: 'Include done: false in the object you push inside addNote.',
        },
      ],
      solution:
        'const notes = [];\n\nfunction addNote(text) {\n  notes.push({ text: text, done: false });\n}\n\naddNote("water the oak");\naddNote("plant the maple");\n\nconsole.log(notes.length);\n',
    },
  },
  {
    id: 'js-project-2',
    blocks: [
      {
        type: 'p',
        text: 'Good code structure means everything has a place. The pattern that works at almost any scale is to separate your data, your logic, and your display into distinct sections — even if they all live in one file at first.',
      },
      {
        type: 'p',
        text: 'Data lives in plain objects and arrays at the top. Logic lives in pure functions — functions that take data and return data, with no side effects. Display functions take data and update the DOM. When each layer has one job, bugs stay small and easy to find.',
      },
      {
        type: 'code',
        text: '// DATA\nlet garden = [];\n\n// LOGIC — pure, no DOM\nfunction addPlant(name, species) {\n  return [...garden, { name, species, watered: false }];\n}\n\nfunction countWatered(plants) {\n  return plants.filter(p => p.watered).length;\n}\n\n// DISPLAY — DOM only\nfunction renderCount(n) {\n  document.getElementById("count").textContent = `Watered: ${n}`;\n}',
      },
      {
        type: 'tip',
        text: 'If a function both calculates something and touches the DOM, split it in two. The calculation can be tested on its own. The DOM part just calls the calculation and shows the result.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<p id="status"></p>',
      instructions:
        'Write a pure function getTotalCost(items) that returns the sum of item.price across all items. Then write a display function showCost(items) that sets #status\'s textContent to "Total: <number>". Call showCost with two items.',
      hints: [
        'Use reduce to sum all item.price values in getTotalCost. In showCost, set document.getElementById("status").textContent using a template literal.',
        'getTotalCost: return items.reduce((sum, item) => sum + item.price, 0); showCost: document.getElementById("status").textContent = `Total: ${total}`;',
      ],
      starter:
        'function getTotalCost(items) {\n  // sum item.price across all items and return it\n  // your code here\n}\n\nfunction showCost(items) {\n  const total = getTotalCost(items);\n  // set document.getElementById("status").textContent to "Total: <total>"\n  // your code here\n}\n\nconst cart = [\n  { name: "trowel", price: 8 },\n  { name: "seeds", price: 4 },\n];\n\nshowCost(cart);',
      checks: [
        {
          type: 'textIncludes',
          text: '12',
          selector: '#status',
          label: 'The total of 12 shows up on the page',
          hint: 'Set #status textContent to a string that includes the total returned by getTotalCost.',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof getTotalCost === "function" && getTotalCost([{ price: 5 }, { price: 3 }]) === 8',
          label: 'getTotalCost returns the correct sum',
          hint: 'Use reduce with a starting value of 0 to add up all item.price values.',
        },
      ],
      solution:
        'function getTotalCost(items) {\n  return items.reduce((sum, item) => sum + item.price, 0);\n}\n\nfunction showCost(items) {\n  const total = getTotalCost(items);\n  document.getElementById("status").textContent = `Total: ${total}`;\n}\n\nconst cart = [\n  { name: "trowel", price: 8 },\n  { name: "seeds", price: 4 },\n];\n\nshowCost(cart);\n',
    },
  },
  {
    id: 'js-project-3',
    blocks: [
      {
        type: 'p',
        text: 'Every real app encounters data it did not expect — missing fields, the wrong type, a network hiccup that returns null. Defensive code plans for these moments. Before you use a value, ask: what is the worst shape it could arrive in, and what should I do then?',
      },
      {
        type: 'p',
        text: 'Three tools cover most defensive patterns. Optional chaining (?.) gives you undefined instead of throwing when a property does not exist. The nullish coalescing operator (??) gives you a default value when something is null or undefined. A simple if-check before a risky operation stops a crash before it starts.',
      },
      {
        type: 'code',
        text: 'function getTreeName(tree) {\n  // Safe even if tree is null or missing .name\n  return tree?.name ?? "unknown";\n}\n\nconsole.log(getTreeName({ name: "birch" })); // "birch"\nconsole.log(getTreeName(null));              // "unknown"\nconsole.log(getTreeName({}));                // "unknown"',
      },
      {
        type: 'tip',
        text: '?. and ?? are your seatbelts when working with data from APIs and forms. Use them early — crashes always happen at the worst moment.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write a function safeLabel(item) that returns item?.label ?? "unlabelled". Call it three times and log each result: once with { label: "oak pot" }, once with null, and once with {}.',
      hints: [
        '?. means "read this property only if the value exists — otherwise give undefined". ?? means "use this fallback if the left side is null or undefined".',
        'Write return item?.label ?? "unlabelled"; inside the function body — that one line covers all three cases.',
      ],
      starter:
        'function safeLabel(item) {\n  // return item?.label ?? "unlabelled"\n  // your code here\n}\n\nconsole.log(safeLabel({ label: "oak pot" }));\nconsole.log(safeLabel(null));\nconsole.log(safeLabel({}));',
      checks: [
        {
          type: 'logIncludes',
          text: 'oak pot',
          label: '"oak pot" is returned when the label exists',
        },
        {
          type: 'logIncludes',
          text: 'unlabelled',
          label: '"unlabelled" is returned when label is null or missing',
          hint: 'Use ?? "unlabelled" so that null and missing labels all fall back to the default.',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof safeLabel === "function" && safeLabel(null) === "unlabelled" && safeLabel({ label: "pine" }) === "pine"',
          label: 'safeLabel works correctly for all three cases',
          hint: 'Use item?.label to safely read the property without crashing when item is null.',
        },
      ],
      solution:
        'function safeLabel(item) {\n  return item?.label ?? "unlabelled";\n}\n\nconsole.log(safeLabel({ label: "oak pot" }));\nconsole.log(safeLabel(null));\nconsole.log(safeLabel({}));\n',
    },
  },
  {
    id: 'js-project-4',
    blocks: [
      {
        type: 'p',
        text: 'Once your app works, polish is what makes it feel real. Polish is not decoration — it is clarity. Clear labels, feedback that confirms actions worked, and empty states that explain what to do next. Without these, a technically correct app feels broken.',
      },
      {
        type: 'p',
        text: 'Three UI patterns cover most polish needs. Update a status area after every state change. Show an empty state when a list has no items. Disable a button until the form is valid. Each is a small if-check in your render function, but together they turn a rough prototype into a real product.',
      },
      {
        type: 'code',
        text: 'function render(items) {\n  const list = document.getElementById("list");\n  const status = document.getElementById("status");\n\n  if (items.length === 0) {\n    list.textContent = "No items yet — add one above.";\n  } else {\n    list.innerHTML = items.map(i => `<li>${i}</li>`).join("");\n  }\n\n  status.textContent = `${items.length} item(s)`;\n}',
      },
      {
        type: 'tip',
        text: 'Always show the empty state on purpose. A blank space where content should be looks like a bug, even when it is technically correct.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<ul id="plants"></ul><p id="info"></p>',
      instructions:
        'Write a renderPlants(names) function. If names is empty, set #plants textContent to "No plants yet". Otherwise set its innerHTML to names mapped to <li> elements. Always set #info textContent to "<count> plant(s)". Call it first with [] then with ["oak", "fern"].',
      hints: [
        'For the else branch, set list.innerHTML = names.map(n => `<li>${n}</li>`).join(""); to build the list from the array.',
        'After the if/else, set info.textContent = `${names.length} plant(s)`; — this runs for both the empty and non-empty cases.',
      ],
      starter:
        'function renderPlants(names) {\n  const list = document.getElementById("plants");\n  const info = document.getElementById("info");\n\n  if (names.length === 0) {\n    // set list.textContent to "No plants yet"\n    // your code here\n  } else {\n    // set list.innerHTML to mapped <li> items\n    // your code here\n  }\n\n  // set info.textContent to "<count> plant(s)"\n  // your code here\n}\n\nrenderPlants([]);\nrenderPlants(["oak", "fern"]);',
      checks: [
        {
          type: 'selectorExists',
          selector: '#plants li',
          count: 2,
          label: 'Two plant list items appear on the page',
          hint: 'In the else branch set list.innerHTML to names.map(n => `<li>${n}</li>`).join("") to create two <li> elements.',
        },
        {
          type: 'textIncludes',
          text: '2',
          selector: '#info',
          label: 'The info area shows the correct plant count',
          hint: 'Set info.textContent to a string containing names.length after the if/else block.',
        },
      ],
      solution:
        'function renderPlants(names) {\n  const list = document.getElementById("plants");\n  const info = document.getElementById("info");\n\n  if (names.length === 0) {\n    list.textContent = "No plants yet";\n  } else {\n    list.innerHTML = names.map(n => `<li>${n}</li>`).join("");\n  }\n\n  info.textContent = `${names.length} plant(s)`;\n}\n\nrenderPlants([]);\nrenderPlants(["oak", "fern"]);\n',
    },
  },
  {
    id: 'js-project-5',
    blocks: [
      {
        type: 'p',
        text: 'You have planned, structured, handled bad data, and polished the UI. Now ship it. In this capstone you will build a tiny seed-tracker app end-to-end: an in-memory list, a function to add seeds, a function to mark one as planted, and a render function that shows everything in the DOM.',
      },
      {
        type: 'p',
        text: 'The finished app does not need to be large — it needs to work. A user should be able to call addSeed(), call markPlanted(), and see the DOM update correctly. Every skill you built in this topic comes together on this one page. Ship it and grow from here.',
      },
      {
        type: 'code',
        text: '// The shape of the finished app:\n// let seeds = [];\n// function addSeed(name) { … }\n// function markPlanted(name) { … }\n// function render() { /* writes seeds to #seeds */ }\n// addSeed("sunflower"); addSeed("lavender");\n// markPlanted("sunflower");\n// render();',
      },
      {
        type: 'tip',
        text: 'Build in order: data first, then logic, then display. Each layer is one function. Test each layer with a console.log before connecting the next one.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<ul id="seeds"></ul><p id="planted-count"></p>',
      instructions:
        'Build the seed tracker. Declare let seeds = []. Write addSeed(name) that pushes { name, planted: false } into seeds. Write markPlanted(name) that finds the matching seed and sets its planted to true. Write render() that sets #seeds innerHTML to one <li> per seed — include the name and "(planted)" for planted ones — and sets #planted-count textContent to "Planted: <n>". Finally call addSeed("sunflower"), addSeed("lavender"), markPlanted("sunflower"), and render().',
      hints: [
        'In markPlanted, use seeds.find(s => s.name === name) to get the matching object, then set .planted = true on it. In render, use filter and .length to count planted seeds.',
        'render innerHTML: seeds.map(s => `<li>${s.name}${s.planted ? " (planted)" : ""}</li>`).join(""); planted count: seeds.filter(s => s.planted).length',
      ],
      starter:
        'let seeds = [];\n\nfunction addSeed(name) {\n  // push { name, planted: false }\n  // your code here\n}\n\nfunction markPlanted(name) {\n  // find the seed with this name and set planted = true\n  // your code here\n}\n\nfunction render() {\n  const list = document.getElementById("seeds");\n  const count = document.getElementById("planted-count");\n  // set list.innerHTML and count.textContent\n  // your code here\n}\n\naddSeed("sunflower");\naddSeed("lavender");\nmarkPlanted("sunflower");\nrender();',
      checks: [
        {
          type: 'selectorExists',
          selector: '#seeds li',
          count: 2,
          label: 'Two seed items appear in the list',
          hint: 'Map every seed to a <li> element in render() so both sunflower and lavender appear.',
        },
        {
          type: 'textIncludes',
          text: 'planted',
          selector: '#seeds',
          label: 'The planted status shows up in the list',
          hint: 'Include "(planted)" in the li text for seeds where s.planted is true.',
        },
        {
          type: 'textIncludes',
          text: '1',
          selector: '#planted-count',
          label: 'The planted count correctly shows 1',
        },
      ],
      solution:
        'let seeds = [];\n\nfunction addSeed(name) {\n  seeds.push({ name: name, planted: false });\n}\n\nfunction markPlanted(name) {\n  const seed = seeds.find(s => s.name === name);\n  if (seed) seed.planted = true;\n}\n\nfunction render() {\n  const list = document.getElementById("seeds");\n  const count = document.getElementById("planted-count");\n  list.innerHTML = seeds.map(s => `<li>${s.name}${s.planted ? " (planted)" : ""}</li>`).join("");\n  count.textContent = "Planted: " + seeds.filter(s => s.planted).length;\n}\n\naddSeed("sunflower");\naddSeed("lavender");\nmarkPlanted("sunflower");\nrender();\n',
    },
  },
];

export default lessons;
