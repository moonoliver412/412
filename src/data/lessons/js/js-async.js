// Topic: Async & Fetch (js-async) — 5 lessons.

const lessons = [
  {
    id: 'js-async-1',
    blocks: [
      {
        type: 'p',
        text: 'JavaScript runs one task at a time — but the world does not wait. When you ask a server for data, you do not want your whole program frozen while it travels. That is where asynchronous (async) code comes in. Async means "not right now". You kick off a job and give it a callback — a function to call when the job finishes.',
      },
      {
        type: 'p',
        text: 'The simplest async tool is setTimeout. It schedules a callback to run after a delay. The rest of your code keeps going in the meantime. You set a timer and walk away — you do not stand there staring at it.',
      },
      {
        type: 'code',
        text: 'console.log("planting…");\nsetTimeout(() => {\n  console.log("sapling sprouted!");\n}, 1000);\nconsole.log("watering in the meantime");',
      },
      {
        type: 'p',
        text: 'Read through that code in your head. The order is: "planting…", then "watering in the meantime", then — after the delay — "sapling sprouted!". setTimeout does not block. It just registers a note for later. The callback is the note.',
      },
      {
        type: 'tip',
        text: 'A callback is a function you hand to another function to call later. The name is not magic — any function can be a callback.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Log "starting" right away. Then use setTimeout with a 50ms delay to log "done". The checks run at 250ms, so your timer will finish in plenty of time.',
      starter:
        'console.log("starting");\n\n// schedule a log of "done" after 50ms\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'starting',
          label: '"starting" is logged right away',
        },
        {
          type: 'logIncludes',
          text: 'done',
          label: '"done" is logged after the timer fires',
        },
      ],
    },
  },
  {
    id: 'js-async-2',
    blocks: [
      {
        type: 'p',
        text: 'Callbacks work, but nesting them gets messy fast. Imagine fetching a user, then their posts, then comments on the first post — three callbacks nested inside each other. Developers call this "callback hell". It is exactly as painful as it sounds.',
      },
      {
        type: 'p',
        text: 'Promises solve this. A Promise is an object that holds a value that is not ready yet. It starts as "pending". It eventually either "fulfills" with a value or "rejects" with a reason. Chain .then() to handle success and .catch() to handle errors — no nesting needed.',
      },
      {
        type: 'code',
        text: 'const p = new Promise((resolve) => {\n  setTimeout(() => resolve("acorn found!"), 50);\n});\n\np.then(value => console.log(value))\n .catch(err => console.log("error:", err));',
      },
      {
        type: 'p',
        text: 'The function you pass to new Promise receives two tools: resolve and reject. Call resolve with the success value. Call reject when something goes wrong. The .then() chain only runs when the promise fulfills — your code stays flat and easy to read.',
      },
      {
        type: 'tip',
        text: 'Promise.resolve(value) is a shortcut that creates a promise already fulfilled with that value. It is great for testing, or when you want to wrap a plain value in the promise interface.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Create a Promise that resolves with the string "sprouted" after 30ms. Chain a .then() that logs the resolved value.',
      starter:
        'const grow = new Promise((resolve) => {\n  // resolve with "sprouted" after 30ms\n  // your code here\n});\n\n// chain .then() to log the value\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'sprouted',
          label: '"sprouted" is logged when the promise resolves',
        },
        {
          type: 'exprTruthy',
          expr: 'grow instanceof Promise',
          label: 'grow is defined as a Promise',
        },
      ],
    },
  },
  {
    id: 'js-async-3',
    blocks: [
      {
        type: 'p',
        text: 'Promise chains are cleaner than callbacks, but your logic still gets spread across .then() calls. async/await is a cleaner way to write the same thing. "Syntactic sugar" means it is just nicer-looking syntax for promises under the hood. Your code reads like a straight list of steps — the way you naturally think.',
      },
      {
        type: 'p',
        text: 'Mark a function with async and you can use await inside it. await pauses that one function — not the whole program — until a promise settles. Then it gives you the value. The function picks up right where it paused, so you can store the result in a plain variable and use it on the next line.',
      },
      {
        type: 'code',
        text: 'async function growTree() {\n  const result = await Promise.resolve("oak");\n  console.log("species:", result);\n}\n\ngrowTree();',
      },
      {
        type: 'p',
        text: 'An async function always returns a Promise, even if you return a plain string inside it. That means you can chain .then() on the outside, or await it from another async function. Everything fits together neatly.',
      },
      {
        type: 'tip',
        text: 'You can only use await inside an async function. Try it at the top level of a regular script and you will get a SyntaxError.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write an async function called harvest. Inside it, await Promise.resolve("berries") and log the result. Call harvest() after you define it.',
      starter:
        'async function harvest() {\n  // await Promise.resolve("berries") and log it\n  // your code here\n}\n\nharvest();',
      checks: [
        {
          type: 'logIncludes',
          text: 'berries',
          label: '"berries" is logged from inside harvest',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof harvest === "function"',
          label: 'harvest is defined',
        },
      ],
    },
  },
  {
    id: 'js-async-4',
    blocks: [
      {
        type: 'p',
        text: 'fetch() is the browser\'s built-in tool for loading data from a URL. It returns a Promise that resolves to a Response object — an object representing what the server sent back. You then call .json() on that response, which is another Promise, to read the body as JSON data. Two awaits and you have your data.',
      },
      {
        type: 'p',
        text: 'In the exercise sandbox you cannot make real network calls, so you will simulate fetch using Promise.resolve() with a pre-built object. Real fetch code looks exactly the same — the awaits, the .json() call, the variable that holds the data. Learn the pattern here and you will understand real fetch too.',
      },
      {
        type: 'code',
        text: '// Real-world shape of a fetch call:\nasync function loadData(url) {\n  const response = await fetch(url);\n  const data = await response.json();\n  return data;\n}\n\n// Simulated (works in any sandbox):\nasync function loadMock() {\n  const data = await Promise.resolve({ species: "maple", age: 4 });\n  console.log(data.species);\n}',
      },
      {
        type: 'tip',
        text: 'Always await response.json() on its own line — it is a separate async step. Skip that second await and you get a Promise object, not the actual data.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write an async function called getTree. Inside it, await Promise.resolve({ name: "maple", height: 12 }). Log the tree\'s name and height as two separate console.log calls. Call getTree() after you define it.',
      starter:
        'async function getTree() {\n  // await the mock data object and log name, then height\n  // your code here\n}\n\ngetTree();',
      checks: [
        {
          type: 'logIncludes',
          text: 'maple',
          label: 'The tree name "maple" is logged to the console',
        },
        {
          type: 'logIncludes',
          text: '12',
          label: 'The height 12 is logged to the console',
        },
      ],
    },
  },
  {
    id: 'js-async-5',
    blocks: [
      {
        type: 'p',
        text: 'Now put everything together. A weather widget is a classic async exercise — you need a loading state, a data fetch, and a result shown on screen. In a real app that means fetch() and a loading spinner. Here you will simulate the fetch with a resolved Promise and write the result into the DOM.',
      },
      {
        type: 'p',
        text: 'The pattern is always the same. Show "loading…" in your output element. Await your data — real or simulated. Then replace the loading text with the real content. If anything goes wrong, a try/catch block lets you show a friendly error message instead.',
      },
      {
        type: 'code',
        text: 'async function loadWeather() {\n  const out = document.getElementById("weather");\n  out.textContent = "loading…";\n  try {\n    const data = await Promise.resolve({ city: "Sprout City", temp: 22 });\n    out.textContent = `${data.city}: ${data.temp}°C`;\n  } catch (e) {\n    out.textContent = "could not load weather";\n  }\n}\n\nloadWeather();',
      },
      {
        type: 'tip',
        text: 'try/catch works with async errors just as well as with normal errors when you use await. No extra .catch() chaining needed.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<div id="weather"></div>',
      instructions:
        'Write an async function loadWeather. First set the #weather element\'s text to "loading…". Then await Promise.resolve({ city: "Sprout City", temp: 22 }). Finally set the text to a string that includes both the city name and the temperature. Call loadWeather() after you define it.',
      starter:
        'async function loadWeather() {\n  const out = document.getElementById("weather");\n  out.textContent = "loading…";\n\n  // await the mock data and update out.textContent\n  // your code here\n}\n\nloadWeather();',
      checks: [
        {
          type: 'textIncludes',
          text: 'Sprout City',
          selector: '#weather',
          label: 'The city name shows up in the weather widget',
        },
        {
          type: 'textIncludes',
          text: '22',
          selector: '#weather',
          label: 'The temperature shows up in the weather widget',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof loadWeather === "function"',
          label: 'loadWeather is defined as a function',
        },
      ],
    },
  },
];

export default lessons;
