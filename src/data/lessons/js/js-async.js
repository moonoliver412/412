// Topic: Async & Fetch (js-async) — 5 lessons.

const lessons = [
  {
    id: 'js-async-1',
    blocks: [
      {
        type: 'p',
        text: 'JavaScript runs one task at a time — but the world does not wait. When you ask for data from a server, you do not want your whole program frozen while it travels down the wire. That is where asynchronous code comes in: you kick off a job and give it a callback — a function to call when it finishes.',
      },
      {
        type: 'p',
        text: 'The simplest async tool you have is setTimeout. It schedules a callback to run after a delay, but crucially the rest of your code keeps going in the meantime. Think of it like dropping a letter in the post box: you do not stand there staring at the box waiting for a reply.',
      },
      {
        type: 'code',
        text: 'console.log("planting…");\nsetTimeout(() => {\n  console.log("sapling sprouted!");\n}, 1000);\nconsole.log("watering in the meantime");',
      },
      {
        type: 'p',
        text: 'Run that in your head and you will see the order: "planting…", then "watering in the meantime", and then — after the delay — "sapling sprouted!". setTimeout does not block; it just registers a note for later. The callback is the note.',
      },
      {
        type: 'tip',
        text: 'A callback is just a function you hand to another function to call later. The name is not special — any function can be a callback.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Log "starting" immediately, then use setTimeout with a 50ms delay to log "done". The checks run at 250ms, so your timer will have fired well in time.',
      starter:
        'console.log("starting");\n\n// schedule a log of "done" after 50ms\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'starting',
          label: '"starting" logged immediately',
        },
        {
          type: 'logIncludes',
          text: 'done',
          label: '"done" logged after the timer fires',
        },
      ],
    },
  },
  {
    id: 'js-async-2',
    blocks: [
      {
        type: 'p',
        text: 'Callbacks work, but nesting them is a trap. Imagine fetching a user, then fetching their posts, then fetching the comments on the first post — three callbacks inside callbacks inside callbacks. Developers called this "callback hell", and it is exactly as unpleasant as it sounds.',
      },
      {
        type: 'p',
        text: 'Promises solve this. A Promise is an object that represents a value that is not ready yet. It starts as "pending" and eventually either "fulfills" with a value or "rejects" with a reason. You chain .then() to handle the success and .catch() to handle errors — no nesting required.',
      },
      {
        type: 'code',
        text: 'const p = new Promise((resolve) => {\n  setTimeout(() => resolve("acorn found!"), 50);\n});\n\np.then(value => console.log(value))\n .catch(err => console.log("error:", err));',
      },
      {
        type: 'p',
        text: 'The executor function you pass to new Promise receives two tools: resolve (call it with the success value) and reject (call it when something goes wrong). The .then() chain runs only when the promise fulfills, so your logic stays flat and readable.',
      },
      {
        type: 'tip',
        text: 'Promise.resolve(value) is a shortcut that creates an already-fulfilled promise — useful for testing or wrapping a plain value in the promise interface.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Create a Promise that resolves with the string "sprouted" after a 30ms timeout. Chain a .then() that logs the resolved value.',
      starter:
        'const grow = new Promise((resolve) => {\n  // resolve with "sprouted" after 30ms\n  // your code here\n});\n\n// chain .then() to log the value\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'sprouted',
          label: '"sprouted" logged when the promise resolves',
        },
        {
          type: 'exprTruthy',
          expr: 'grow instanceof Promise',
          label: 'grow is a Promise',
        },
      ],
    },
  },
  {
    id: 'js-async-3',
    blocks: [
      {
        type: 'p',
        text: 'Promise chains are cleaner than callbacks, but they still scatter your logic across .then() calls. async/await is syntactic sugar that lets you write asynchronous code that reads like a straight list of steps — the way your brain naturally thinks about sequences.',
      },
      {
        type: 'p',
        text: 'Mark a function with async and you can use await inside it. await pauses that function (not the whole program) until a promise settles, then hands you the value. The function resumes right where it left off, so you can store the result in a plain variable and use it on the next line.',
      },
      {
        type: 'code',
        text: 'async function growTree() {\n  const result = await Promise.resolve("oak");\n  console.log("species:", result);\n}\n\ngrowTree();',
      },
      {
        type: 'p',
        text: 'An async function always returns a Promise itself, even if you just return a plain string. That means you can .then() an async function from the outside, or await it from another async function. Everything composes cleanly.',
      },
      {
        type: 'tip',
        text: 'You can only use await inside an async function. If you try it at the top level of a regular script you will get a SyntaxError.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write an async function called harvest that awaits Promise.resolve("berries") and logs the result. Call the function.',
      starter:
        'async function harvest() {\n  // await Promise.resolve("berries") and log it\n  // your code here\n}\n\nharvest();',
      checks: [
        {
          type: 'logIncludes',
          text: 'berries',
          label: '"berries" logged from inside harvest',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof harvest === "function"',
          label: 'harvest is defined as a function',
        },
      ],
    },
  },
  {
    id: 'js-async-4',
    blocks: [
      {
        type: 'p',
        text: 'fetch() is the browser\'s built-in tool for retrieving data from a URL. It returns a Promise that resolves to a Response object. You then call .json() on the response — another Promise — to parse the body as JSON. Together, two awaits and you have your data.',
      },
      {
        type: 'p',
        text: 'In the exercise environment you cannot make real network calls, but you can simulate the same pattern using Promise.resolve() with a pre-made object. Real fetch code looks identical — the awaits, the .json() call, the variable that holds the data. Understand the pattern here and you have understood real fetch.',
      },
      {
        type: 'code',
        text: '// Real-world shape of a fetch call:\nasync function loadData(url) {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}\n\n// Simulated (works in any sandbox):\nasync function loadMock() {\n  const data = await Promise.resolve({ species: "maple", age: 4 });\n  console.log(data.species);\n}',
      },
      {
        type: 'tip',
        text: 'Always await response.json() separately — it is its own async operation. Forgetting the second await gives you a Promise, not the data.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write an async function called getTree that awaits Promise.resolve({ name: "maple", height: 12 }) and logs the tree\'s name and height as separate console.log calls. Call the function.',
      starter:
        'async function getTree() {\n  // await the mock data object and log name, then height\n  // your code here\n}\n\ngetTree();',
      checks: [
        {
          type: 'logIncludes',
          text: 'maple',
          label: 'The tree name "maple" is logged',
        },
        {
          type: 'logIncludes',
          text: '12',
          label: 'The height 12 is logged',
        },
      ],
    },
  },
  {
    id: 'js-async-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to wire everything together. A weather widget is the classic "async from scratch" exercise: you need a loading state, a data fetch, and a rendered result. In a real app that means fetch() and a spinner; here you will simulate the fetch with a resolved Promise and write the result into the DOM.',
      },
      {
        type: 'p',
        text: 'The pattern is always the same: show "loading…" in your output element, await your data (real or simulated), then replace the loading text with the real content. If anything goes wrong, wrap in try/catch and show an error message instead.',
      },
      {
        type: 'code',
        text: 'async function loadWeather() {\n  const out = document.getElementById("weather");\n  out.textContent = "loading…";\n  try {\n    const data = await Promise.resolve({ city: "Sprout City", temp: 22 });\n    out.textContent = `${data.city}: ${data.temp}°C`;\n  } catch (e) {\n    out.textContent = "could not load weather";\n  }\n}\n\nloadWeather();',
      },
      {
        type: 'tip',
        text: 'try/catch wraps async errors just as naturally as synchronous ones when you use await. No extra .catch() chaining needed.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<div id="weather"></div>',
      instructions:
        'Finish the weather widget: write an async function loadWeather that sets #weather\'s text to "loading…", awaits Promise.resolve({ city: "Sprout City", temp: 22 }), then sets the text to a string containing the city name and temperature. Call the function.',
      starter:
        'async function loadWeather() {\n  const out = document.getElementById("weather");\n  out.textContent = "loading…";\n\n  // await the mock data and update out.textContent\n  // your code here\n}\n\nloadWeather();',
      checks: [
        {
          type: 'textIncludes',
          text: 'Sprout City',
          selector: '#weather',
          label: 'The city name appears in the widget',
        },
        {
          type: 'textIncludes',
          text: '22',
          selector: '#weather',
          label: 'The temperature appears in the widget',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof loadWeather === "function"',
          label: 'loadWeather is defined',
        },
      ],
    },
  },
];

export default lessons;
