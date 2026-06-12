// Topic: Projects & Practice (js-project) — 5 lessons.

const lessons = [
  {
    id: 'js-project-1',
    blocks: [
      {
        type: 'p',
        text: 'The hardest part of any project is not the code — it is starting. A blank file is paralyzing. Professional developers break the blank-page problem with a simple technique: list the things the app needs to do, pick the smallest one, and write just enough code to make that one thing work.',
      },
      {
        type: 'p',
        text: 'This is called vertical slicing: instead of building all the data, then all the logic, then all the UI in sequence, you build one tiny working feature end-to-end first. Every slice proves the whole system hangs together and gives you something you can show someone. Momentum is its own kind of energy.',
      },
      {
        type: 'code',
        text: '// Planning a seed-tracker app — start with a list of features:\n// 1. Add a seed to a collection          ← first slice\n// 2. List all seeds\n// 3. Mark a seed as planted\n// 4. Count how many are planted\n//\n// First slice in code:\nconst seeds = [];\nfunction addSeed(name) {\n  seeds.push({ name, planted: false });\n}\naddSeed("sunflower");\nconsole.log(seeds);',
      },
      {
        type: 'tip',
        text: 'Write the simplest thing that could possibly work. You can always make it smarter later. A working simple version is infinitely more useful than a perfect version that does not exist yet.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Plan a tiny note-taking app by writing its first slice: an array called notes and a function addNote(text) that pushes { text, done: false } into it. Call addNote twice with different strings, then log notes.length.',
      starter:
        'const notes = [];\n\nfunction addNote(text) {\n  // push { text, done: false } into notes\n  // your code here\n}\n\naddNote("water the oak");\naddNote("plant the maple");\n\nconsole.log(notes.length);',
      checks: [
        {
          type: 'logIncludes',
          text: '2',
          label: 'notes.length is 2 after two additions',
        },
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(notes) && notes.length === 2 && notes[0].done === false',
          label: 'Each note has a done: false property',
        },
      ],
    },
  },
  {
    id: 'js-project-2',
    blocks: [
      {
        type: 'p',
        text: 'Good code structure is like a tidy potting shed: everything has a place, and you can find the trowel without digging through seed packets. The pattern that works at almost any scale is to separate your data, your logic, and your display into distinct sections — even if they all live in one file at first.',
      },
      {
        type: 'p',
        text: 'Data lives in plain objects and arrays at the top. Logic lives in pure functions that take data and return data, with no side effects. Display functions take data and update the DOM — they call nothing except other display helpers and the DOM APIs. When each layer has one job, bugs stay small and easy to find.',
      },
      {
        type: 'code',
        text: '// DATA\nlet garden = [];\n\n// LOGIC — pure, no DOM\nfunction addPlant(name, species) {\n  return [...garden, { name, species, watered: false }];\n}\n\nfunction countWatered(plants) {\n  return plants.filter(p => p.watered).length;\n}\n\n// DISPLAY — DOM only\nfunction renderCount(n) {\n  document.getElementById("count").textContent = `Watered: ${n}`;\n}',
      },
      {
        type: 'tip',
        text: 'If a function both calculates something and touches the DOM, split it in two. The calculation can be tested in isolation; the DOM part just calls the calculation.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<p id="status"></p>',
      instructions:
        'Write a pure function getTotalCost(items) that returns the sum of item.price for all items. Then write a display function showCost(items) that sets #status\'s textContent to "Total: <number>". Call showCost with two items.',
      starter:
        'function getTotalCost(items) {\n  // sum item.price across all items and return it\n  // your code here\n}\n\nfunction showCost(items) {\n  const total = getTotalCost(items);\n  // set document.getElementById("status").textContent to "Total: <total>"\n  // your code here\n}\n\nconst cart = [\n  { name: "trowel", price: 8 },\n  { name: "seeds", price: 4 },\n];\n\nshowCost(cart);',
      checks: [
        {
          type: 'textIncludes',
          text: '12',
          selector: '#status',
          label: 'The total of 12 appears on the page',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof getTotalCost === "function" && getTotalCost([{ price: 5 }, { price: 3 }]) === 8',
          label: 'getTotalCost correctly sums prices',
        },
      ],
    },
  },
  {
    id: 'js-project-3',
    blocks: [
      {
        type: 'p',
        text: 'Every real app encounters data it did not expect: missing fields, the wrong type, a network blip that returns null. Defensive code anticipates these moments. Before you use a value, ask: what is the worst shape it could arrive in, and what should I do in that case?',
      },
      {
        type: 'p',
        text: 'Three tools cover most defensive patterns. Optional chaining (?.) short-circuits to undefined instead of throwing when a property does not exist. The nullish coalescing operator (??) provides a default when a value is null or undefined. And a simple if-check before a destructive operation stops the crash before it starts.',
      },
      {
        type: 'code',
        text: 'function getTreeName(tree) {\n  // Safe even if tree is null or missing .name\n  return tree?.name ?? "unknown";\n}\n\nconsole.log(getTreeName({ name: "birch" })); // "birch"\nconsole.log(getTreeName(null));              // "unknown"\nconsole.log(getTreeName({}));                // "unknown"',
      },
      {
        type: 'tip',
        text: '?. and ?? are your seatbelts for working with data from APIs and forms. Put them on before you need them — crashes always happen at the worst possible moment.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write a function safeLabel(item) that returns item?.label ?? "unlabelled". Log the result for three calls: one with { label: "oak pot" }, one with null, and one with {}.',
      starter:
        'function safeLabel(item) {\n  // return item?.label ?? "unlabelled"\n  // your code here\n}\n\nconsole.log(safeLabel({ label: "oak pot" }));\nconsole.log(safeLabel(null));\nconsole.log(safeLabel({}));',
      checks: [
        {
          type: 'logIncludes',
          text: 'oak pot',
          label: '"oak pot" is returned when label exists',
        },
        {
          type: 'logIncludes',
          text: 'unlabelled',
          label: '"unlabelled" is returned for null and missing label',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof safeLabel === "function" && safeLabel(null) === "unlabelled" && safeLabel({ label: "pine" }) === "pine"',
          label: 'safeLabel handles all three cases correctly',
        },
      ],
    },
  },
  {
    id: 'js-project-4',
    blocks: [
      {
        type: 'p',
        text: 'Once your app works, polish is what makes it feel like a real product. Polish is not decoration — it is clarity. Clear labels, feedback that confirms actions worked, and empty states that explain what to do next. Without these, a technically correct app feels broken.',
      },
      {
        type: 'p',
        text: 'In JavaScript, three UI patterns cover most polish needs: updating a status area after every state change, showing an empty state when a list has no items, and disabling a button until the form is valid. Each one is a small if-check in your render function, but together they transform a prototype into a product.',
      },
      {
        type: 'code',
        text: 'function render(items) {\n  const list = document.getElementById("list");\n  const status = document.getElementById("status");\n\n  if (items.length === 0) {\n    list.textContent = "No items yet — add one above.";\n  } else {\n    list.innerHTML = items.map(i => `<li>${i}</li>`).join("");\n  }\n\n  status.textContent = `${items.length} item(s)`;\n}',
      },
      {
        type: 'tip',
        text: 'Always render the empty state explicitly. A blank white space where content should be looks like a bug, even if it is technically correct.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<ul id="plants"></ul><p id="info"></p>',
      instructions:
        'Write a renderPlants(names) function: if names is empty, set #plants textContent to "No plants yet"; otherwise set its innerHTML to names mapped to <li> elements. Always set #info textContent to "<count> plant(s)". Call it first with [] then with ["oak", "fern"].',
      starter:
        'function renderPlants(names) {\n  const list = document.getElementById("plants");\n  const info = document.getElementById("info");\n\n  if (names.length === 0) {\n    // set list.textContent to "No plants yet"\n    // your code here\n  } else {\n    // set list.innerHTML to mapped <li> items\n    // your code here\n  }\n\n  // set info.textContent to "<count> plant(s)"\n  // your code here\n}\n\nrenderPlants([]);\nrenderPlants(["oak", "fern"]);',
      checks: [
        {
          type: 'selectorExists',
          selector: '#plants li',
          count: 2,
          label: 'Two plant list items are rendered',
        },
        {
          type: 'textIncludes',
          text: '2',
          selector: '#info',
          label: 'The info area shows the plant count',
        },
      ],
    },
  },
  {
    id: 'js-project-5',
    blocks: [
      {
        type: 'p',
        text: 'You have planned, structured, defended against errors, and polished the UI. Now ship it. In this capstone you will build a tiny seed-tracker app end-to-end: an in-memory list, a function to add seeds, a function to mark one planted, and a render function that displays everything in the DOM.',
      },
      {
        type: 'p',
        text: 'The finished app does not need to be large — it needs to work. A user should be able to call addSeed(), call markPlanted(), and see the DOM reflect the state accurately. Every feature you built across this topic lives in this one page. Ship it and grow from here.',
      },
      {
        type: 'code',
        text: '// The shape of the finished app:\n// let seeds = [];\n// function addSeed(name) { … }\n// function markPlanted(name) { … }\n// function render() { /* writes seeds to #seeds */ }\n// addSeed("sunflower"); addSeed("lavender");\n// markPlanted("sunflower");\n// render();',
      },
      {
        type: 'tip',
        text: 'Build it in order: data first, then logic, then display. Each layer is one function. Test each layer with a console.log before wiring up the next.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<ul id="seeds"></ul><p id="planted-count"></p>',
      instructions:
        'Build the seed tracker: declare let seeds = []. Write addSeed(name) that pushes { name, planted: false }. Write markPlanted(name) that finds the matching seed and sets its planted to true. Write render() that sets #seeds innerHTML to one <li> per seed (include the name and "(planted)" for planted ones), and sets #planted-count textContent to "Planted: <n>". Then call addSeed("sunflower"), addSeed("lavender"), markPlanted("sunflower"), render().',
      starter:
        'let seeds = [];\n\nfunction addSeed(name) {\n  // push { name, planted: false }\n  // your code here\n}\n\nfunction markPlanted(name) {\n  // find the seed with this name and set planted = true\n  // your code here\n}\n\nfunction render() {\n  const list = document.getElementById("seeds");\n  const count = document.getElementById("planted-count");\n  // set list.innerHTML and count.textContent\n  // your code here\n}\n\naddSeed("sunflower");\naddSeed("lavender");\nmarkPlanted("sunflower");\nrender();',
      checks: [
        {
          type: 'selectorExists',
          selector: '#seeds li',
          count: 2,
          label: 'Two seed items are rendered',
        },
        {
          type: 'textIncludes',
          text: 'planted',
          selector: '#seeds',
          label: 'The planted status appears in the list',
        },
        {
          type: 'textIncludes',
          text: '1',
          selector: '#planted-count',
          label: 'The planted count shows 1',
        },
      ],
    },
  },
];

export default lessons;
