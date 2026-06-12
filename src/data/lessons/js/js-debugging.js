// Topic: Errors & Debugging (js-debugging) — 5 lessons.

const lessons = [
  {
    id: 'js-debugging-1',
    blocks: [
      {
        type: 'p',
        text: 'Every developer spends more time reading error messages than writing code. A JS error message is not an insult — it is a gift. It tells you the type of error, a human-readable description, and the file and line number where things went wrong. If you learn to read it carefully, you already know 80% of what you need to fix it.',
      },
      {
        type: 'p',
        text: 'The three most common error types you will see are ReferenceError (you used a name that does not exist), TypeError (you called something that is not a function, or read a property on undefined), and SyntaxError (you wrote JavaScript the parser cannot understand). Each has a distinct pattern and a distinct fix.',
      },
      {
        type: 'code',
        text: '// ReferenceError: can\'t find the name\nconsole.log(treeName);         // ReferenceError: treeName is not defined\n\n// TypeError: wrong type for the operation\nconst age = null;\nconsole.log(age.years);        // TypeError: Cannot read properties of null\n\n// SyntaxError: bad code shape\nfunction grow( { }             // SyntaxError: Unexpected token \'{\'',
      },
      {
        type: 'tip',
        text: 'Read the error type first, then the message, then look at the line number. The message usually contains the exact name or token that broke — search your code for it.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The starter code has a bug: it tries to log a variable that has not been declared. Fix it by declaring the variable first (use const treeName = "oak") and then log it.',
      starter:
        '// This line will throw a ReferenceError — fix it!\nconsole.log(treeName);',
      checks: [
        {
          type: 'logIncludes',
          text: 'oak',
          label: '"oak" is logged without errors',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof treeName !== "undefined"',
          label: 'treeName is now declared',
        },
      ],
    },
  },
  {
    id: 'js-debugging-2',
    blocks: [
      {
        type: 'p',
        text: 'console.log is your first debugger, but the console has a whole toolkit. console.warn and console.error print with colored icons — useful when you want warnings to stand out. console.table turns arrays of objects into a tidy grid. console.group and console.groupEnd indent related messages so a noisy log does not become soup.',
      },
      {
        type: 'p',
        text: 'The most underused tool is console.assert: it prints nothing if the condition is true, and fires a big error if it is false. Use it to describe what you believe to be true at a point in your code. When it starts yelling, you know exactly where your assumption broke.',
      },
      {
        type: 'code',
        text: 'const trees = [\n  { species: "oak", age: 5 },\n  { species: "maple", age: 3 },\n];\n\nconsole.table(trees);          // prints a formatted table\nconsole.assert(trees.length > 0, "trees array should not be empty");\n\nconsole.group("oak details");\nconsole.log("species:", trees[0].species);\nconsole.log("age:", trees[0].age);\nconsole.groupEnd();',
      },
      {
        type: 'tip',
        text: 'Prefix your debug logs with a label: console.log("DEBUG age:", age). That way you can grep for "DEBUG" and delete them all before shipping.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The starter code has a bug: the assert fires because the array is empty. Fix it by adding at least one tree object to the trees array (any species and age), so the assert passes silently and the table has data to show.',
      starter:
        'const trees = [\n  // bug: no trees — add at least one { species, age } object\n];\n\nconsole.table(trees);\nconsole.assert(trees.length > 0, "trees array should not be empty");',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(trees) && trees.length > 0',
          label: 'The trees array has at least one entry',
        },
        {
          type: 'exprTruthy',
          expr: 'trees[0] && typeof trees[0].species === "string"',
          label: 'The first entry has a species string',
        },
      ],
    },
  },
  {
    id: 'js-debugging-3',
    blocks: [
      {
        type: 'p',
        text: 'Console logs are great for quick checks, but the browser\'s built-in debugger is more powerful. You set a breakpoint on a line, and execution pauses right there — you can inspect every variable in scope, hover over expressions to see their values, and step through the code one line at a time.',
      },
      {
        type: 'p',
        text: 'In your JS code you can trigger a breakpoint programmatically with the debugger statement. When the DevTools are open, execution pauses on that line exactly as if you had clicked the gutter. When DevTools are closed, debugger is silently ignored — safe to leave in while you work, just remove it before you ship.',
      },
      {
        type: 'code',
        text: 'function plantTree(species) {\n  debugger; // pause here when DevTools is open\n  const tree = { species, planted: new Date() };\n  return tree;\n}\n\nconst t = plantTree("birch");\nconsole.log(t.species);',
      },
      {
        type: 'tip',
        text: 'Stepping "into" a function follows execution inside it. Stepping "over" treats the whole function call as one line. Use "into" when you suspect the bug is inside the function, "over" when you trust it.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The function below has a bug: it is supposed to return the tree\'s species in uppercase, but it returns undefined. Fix the bug (add the missing return statement) and log the result of calling formatSpecies("oak").',
      starter:
        'function formatSpecies(species) {\n  const upper = species.toUpperCase();\n  // bug: the return statement is missing!\n  // your code here\n}\n\nconsole.log(formatSpecies("oak"));',
      checks: [
        {
          type: 'logIncludes',
          text: 'OAK',
          label: '"OAK" is logged in uppercase',
        },
        {
          type: 'exprTruthy',
          expr: 'formatSpecies("maple") === "MAPLE"',
          label: 'formatSpecies returns the uppercase species',
        },
      ],
    },
  },
  {
    id: 'js-debugging-4',
    blocks: [
      {
        type: 'p',
        text: 'Some errors are not bugs you wrote — they are conditions that can happen at runtime: a network request fails, a user types something unexpected, a value comes back null from an API. try/catch lets you handle these gracefully rather than crashing.',
      },
      {
        type: 'p',
        text: 'Put the risky code inside try. If anything throws, execution jumps to the catch block where you receive the error object. The code after the crash point in try is skipped, but your catch can log the error, show a friendly message, or attempt a fallback. finally runs regardless — useful for cleanup like hiding a spinner.',
      },
      {
        type: 'code',
        text: 'function parseAge(input) {\n  const n = Number(input);\n  if (isNaN(n)) throw new Error(`"${input}" is not a valid age`);\n  return n;\n}\n\ntry {\n  const age = parseAge("five");\n  console.log("age:", age);\n} catch (err) {\n  console.log("caught:", err.message);\n} finally {\n  console.log("done");\n}',
      },
      {
        type: 'tip',
        text: 'throw new Error("message") is the right way to signal a problem. You can throw anything, but Error objects carry a .message and a .stack — both invaluable when debugging.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The starter code calls JSON.parse on a broken string, which throws a SyntaxError. Wrap the call in a try/catch. In the catch, log the string "parse failed" and fall back to an empty object {}. Log the result either way.',
      starter:
        'const broken = "{ bad json ";\n\n// Wrap in try/catch:\n// - try: parse broken with JSON.parse, log the result\n// - catch: log "parse failed", use {} as fallback and log it\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'parse failed',
          label: '"parse failed" is logged when parsing throws',
        },
        {
          type: 'logIncludes',
          text: '{}',
          label: 'The fallback empty object is logged',
        },
      ],
    },
  },
  {
    id: 'js-debugging-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put your detective hat on. This capstone gives you a small app with three bugs hidden inside it — the kind that do not throw obvious errors but quietly produce wrong output. Your job: read the code carefully, trace what each line does, and fix every bug.',
      },
      {
        type: 'p',
        text: 'Professional debugging is a loop: form a hypothesis ("I think the sum is wrong because…"), add a console.log to test it, look at the output, revise the hypothesis. The rubber-duck technique — explaining the code aloud to an imaginary friend — finds bugs faster than staring in silence. Say out loud what each line does. The wrong one will announce itself.',
      },
      {
        type: 'code',
        text: '// Debugging loop:\n// 1. Read the error (or the wrong output)\n// 2. Form a hypothesis about the cause\n// 3. Add a console.log near the suspicious line\n// 4. Run, read, refine\n// 5. Fix, remove the debug log, verify',
      },
      {
        type: 'tip',
        text: 'Fix one bug at a time. Changing three things at once means you do not know which fix worked — and you might accidentally cancel two fixes out.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<ul id="list"></ul><p id="total"></p>',
      instructions:
        'The code below has three bugs. Bug 1: the area function uses + instead of * to compute width × height — fix the operator. Bug 2: the for loop condition uses >= instead of < so the loop body never runs — fix the condition. Bug 3: appendChild is misspelled as appendChld — fix the typo. Correct all three so the list shows three items and the total displays 6.',
      starter:
        'function area(w, h) {\n  // Bug 1: should multiply, not add\n  return w + h;\n}\n\nconst sizes = [{ w: 1, h: 1 }, { w: 2, h: 1 }, { w: 3, h: 1 }];\nlet total = 0;\n\n// Bug 2: loop condition is wrong — should be i < sizes.length\nfor (let i = 0; i >= sizes.length; i++) {\n  const s = sizes[i];\n  total += area(s.w, s.h);\n\n  const li = document.createElement("li");\n  li.textContent = `${s.w}×${s.h} = ${area(s.w, s.h)}`;\n  // Bug 3: typo in method name\n  document.getElementById("list").appendChld(li);\n}\n\ndocument.getElementById("total").textContent = "total: " + total;',
      checks: [
        {
          type: 'textIncludes',
          text: '6',
          selector: '#total',
          label: 'The total of 6 is shown on the page',
        },
        {
          type: 'selectorExists',
          selector: '#list li',
          count: 3,
          label: 'Three list items are rendered',
        },
      ],
    },
  },
];

export default lessons;
