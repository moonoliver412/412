// Topic: Errors & Debugging (js-debugging) — 5 lessons.

const lessons = [
  {
    id: 'js-debugging-1',
    blocks: [
      {
        type: 'p',
        text: 'Every developer spends more time reading error messages than writing code. A JS error message is not an insult — it is useful information. It tells you the error type, a plain-language description, and the file and line number where things broke. Read it carefully and you already know most of what you need to fix it.',
      },
      {
        type: 'p',
        text: 'The three most common error types are ReferenceError (you used a name that does not exist), TypeError (you called something that is not a function, or read a property from undefined), and SyntaxError (you wrote JavaScript the engine cannot read). Each has its own pattern and fix.',
      },
      {
        type: 'code',
        text: '// ReferenceError: can\'t find the name\nconsole.log(treeName);         // ReferenceError: treeName is not defined\n\n// TypeError: wrong type for the operation\nconst age = null;\nconsole.log(age.years);        // TypeError: Cannot read properties of null\n\n// SyntaxError: bad code shape\nfunction grow( { }             // SyntaxError: Unexpected token \'{\'',
      },
      {
        type: 'tip',
        text: 'Read the error type first, then the message, then the line number. The message usually contains the exact name or symbol that broke. Search your code for it.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The starter code has a bug. It tries to log a variable that has not been declared. Fix it by declaring the variable first using const treeName = "oak", then log it.',
      starter:
        '// This line will throw a ReferenceError — fix it!\nconsole.log(treeName);',
      checks: [
        {
          type: 'logIncludes',
          text: 'oak',
          label: '"oak" is logged with no errors thrown',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof treeName !== "undefined"',
          label: 'treeName is declared and accessible',
        },
      ],
    },
  },
  {
    id: 'js-debugging-2',
    blocks: [
      {
        type: 'p',
        text: 'console.log is your first debugging tool, but the console has a whole toolkit. console.warn and console.error print with colored icons — great when you want warnings to stand out. console.table turns arrays of objects into a tidy grid. console.group and console.groupEnd indent related messages so a busy log stays readable.',
      },
      {
        type: 'p',
        text: 'The most underused tool is console.assert. It prints nothing when the condition is true, and fires a loud error when it is false. Use it to state what you believe to be true at a point in your code. When it fires, you know exactly where your assumption was wrong.',
      },
      {
        type: 'code',
        text: 'const trees = [\n  { species: "oak", age: 5 },\n  { species: "maple", age: 3 },\n];\n\nconsole.table(trees);          // prints a formatted table\nconsole.assert(trees.length > 0, "trees array should not be empty");\n\nconsole.group("oak details");\nconsole.log("species:", trees[0].species);\nconsole.log("age:", trees[0].age);\nconsole.groupEnd();',
      },
      {
        type: 'tip',
        text: 'Add a label to your debug logs: console.log("DEBUG age:", age). Then you can search for "DEBUG" and delete them all before you ship.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The starter code has a bug. The assert fires because the array is empty. Fix it by adding at least one tree object with a species and age to the trees array, so the assert passes silently and the table has something to show.',
      starter:
        'const trees = [\n  // bug: no trees — add at least one { species, age } object\n];\n\nconsole.table(trees);\nconsole.assert(trees.length > 0, "trees array should not be empty");',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(trees) && trees.length > 0',
          label: 'Your trees array has at least one entry',
        },
        {
          type: 'exprTruthy',
          expr: 'trees[0] && typeof trees[0].species === "string"',
          label: 'The first entry has a species property',
        },
      ],
    },
  },
  {
    id: 'js-debugging-3',
    blocks: [
      {
        type: 'p',
        text: 'Console logs are great for quick checks, but the browser\'s built-in debugger is more powerful. Set a breakpoint on a line and execution pauses right there. You can inspect every variable in scope, hover over expressions to see their values, and step through the code one line at a time.',
      },
      {
        type: 'p',
        text: 'You can trigger a breakpoint in code using the debugger statement. When DevTools are open, execution pauses on that line — exactly like clicking the gutter. When DevTools are closed, debugger is silently ignored. Safe to leave in while you work, but remove it before you ship.',
      },
      {
        type: 'code',
        text: 'function plantTree(species) {\n  debugger; // pause here when DevTools is open\n  const tree = { species, planted: new Date() };\n  return tree;\n}\n\nconst t = plantTree("birch");\nconsole.log(t.species);',
      },
      {
        type: 'tip',
        text: 'Stepping "into" a function follows execution inside it. Stepping "over" treats the whole function call as one line. Use "into" when you think the bug is inside the function. Use "over" when you trust it.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The function below has a bug. It should return the species in uppercase, but it returns undefined. Fix the bug by adding the missing return statement. Then log the result of calling formatSpecies("oak").',
      starter:
        'function formatSpecies(species) {\n  const upper = species.toUpperCase();\n  // bug: the return statement is missing!\n  // your code here\n}\n\nconsole.log(formatSpecies("oak"));',
      checks: [
        {
          type: 'logIncludes',
          text: 'OAK',
          label: '"OAK" is logged in all caps',
        },
        {
          type: 'exprTruthy',
          expr: 'formatSpecies("maple") === "MAPLE"',
          label: 'formatSpecies returns the species in uppercase',
        },
      ],
    },
  },
  {
    id: 'js-debugging-4',
    blocks: [
      {
        type: 'p',
        text: 'Some errors are not bugs you wrote. They are things that can go wrong at runtime — a network request fails, a user types something unexpected, a value comes back null from an API. try/catch lets you handle these situations gracefully instead of crashing.',
      },
      {
        type: 'p',
        text: 'Put the risky code inside try. If anything throws an error, execution jumps straight to the catch block, where you get the error object. The remaining code in try is skipped. Your catch can log the error, show a friendly message, or try a fallback. The finally block runs no matter what — useful for cleanup like hiding a loading spinner.',
      },
      {
        type: 'code',
        text: 'function parseAge(input) {\n  const n = Number(input);\n  if (isNaN(n)) throw new Error(`"${input}" is not a valid age`);\n  return n;\n}\n\ntry {\n  const age = parseAge("five");\n  console.log("age:", age);\n} catch (err) {\n  console.log("caught:", err.message);\n} finally {\n  console.log("done");\n}',
      },
      {
        type: 'tip',
        text: 'throw new Error("message") is the right way to signal a problem in your code. You can throw anything, but Error objects carry a .message and a .stack property — both very helpful when debugging.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The starter code calls JSON.parse on a broken string, which throws a SyntaxError. Wrap the call in a try/catch. In the catch block, log "parse failed" and fall back to an empty object {}. Log the result either way.',
      starter:
        'const broken = "{ bad json ";\n\n// Wrap in try/catch:\n// - try: parse broken with JSON.parse, log the result\n// - catch: log "parse failed", use {} as fallback and log it\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'parse failed',
          label: '"parse failed" is logged when the parse throws',
        },
        {
          type: 'logIncludes',
          text: '{}',
          label: 'The fallback empty object {} is logged',
        },
      ],
    },
  },
  {
    id: 'js-debugging-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to be a detective. This capstone gives you a small app with three bugs hidden inside it. These bugs do not throw obvious errors — they quietly produce wrong output. Your job: read the code carefully, trace what each line does, and fix every bug.',
      },
      {
        type: 'p',
        text: 'Professional debugging is a loop. Form a hypothesis — "I think the sum is wrong because…". Add a console.log to test it. Look at the output. Revise your hypothesis. Repeat. Try explaining the code out loud to nobody. Say what each line does. The wrong line will stand out.',
      },
      {
        type: 'code',
        text: '// Debugging loop:\n// 1. Read the error (or the wrong output)\n// 2. Form a hypothesis about the cause\n// 3. Add a console.log near the suspicious line\n// 4. Run, read, refine\n// 5. Fix, remove the debug log, verify',
      },
      {
        type: 'tip',
        text: 'Fix one bug at a time. Change three things at once and you will not know which fix worked — and two fixes might accidentally cancel each other out.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<ul id="list"></ul><p id="total"></p>',
      instructions:
        'The code below has three bugs. Bug 1: the area function uses + instead of * to multiply width × height — fix the operator. Bug 2: the for loop uses >= instead of < so it never runs — fix the condition. Bug 3: appendChild is misspelled as appendChld — fix the typo. Fix all three so the list shows three items and the total shows 6.',
      starter:
        'function area(w, h) {\n  // Bug 1: should multiply, not add\n  return w + h;\n}\n\nconst sizes = [{ w: 1, h: 1 }, { w: 2, h: 1 }, { w: 3, h: 1 }];\nlet total = 0;\n\n// Bug 2: loop condition is wrong — should be i < sizes.length\nfor (let i = 0; i >= sizes.length; i++) {\n  const s = sizes[i];\n  total += area(s.w, s.h);\n\n  const li = document.createElement("li");\n  li.textContent = `${s.w}×${s.h} = ${area(s.w, s.h)}`;\n  // Bug 3: typo in method name\n  document.getElementById("list").appendChld(li);\n}\n\ndocument.getElementById("total").textContent = "total: " + total;',
      checks: [
        {
          type: 'textIncludes',
          text: '6',
          selector: '#total',
          label: 'The total of 6 appears on the page',
        },
        {
          type: 'selectorExists',
          selector: '#list li',
          count: 3,
          label: 'Three list items show up on the page',
        },
      ],
    },
  },
];

export default lessons;
