// Topic: Node & Modules (node-basics) — 5 lessons.

const lessons = [
  {
    id: 'node-basics-1',
    blocks: [
      {
        type: 'p',
        text: 'Node lets you run JavaScript outside the browser — on a server, on your laptop, anywhere. The same language you used for web pages now powers the back end too. That is the magic of full-stack JavaScript: one language, front to back.',
      },
      {
        type: 'p',
        text: 'Node splits programs into modules — separate files that share code. A file shares something by putting it on module.exports.',
      },
      {
        type: 'code',
        text: 'function add(a, b) {\n  return a + b;\n}\nmodule.exports.add = add;',
      },
      {
        type: 'tip',
        text: 'Another file would then write const { add } = require("./math") to use it. You will practice require next.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Write a function called greet that returns the text "Hello from Node". Put it on module.exports, then log greet().',
      starter: '// your code here\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof module.exports.greet === "function"',
          label: 'You exported a greet function',
          hint: 'Attach it: module.exports.greet = greet;',
        },
        {
          type: 'logIncludes',
          text: 'Hello from Node',
          label: 'greet() returns the greeting',
        },
      ],
      hints: [
        'Declare function greet() that returns "Hello from Node".',
        'Then module.exports.greet = greet; and console.log(greet());',
      ],
      solution:
        'function greet() {\n  return "Hello from Node";\n}\nmodule.exports.greet = greet;\nconsole.log(greet());',
    },
  },
  {
    id: 'node-basics-2',
    blocks: [
      {
        type: 'p',
        text: 'You can export more than one thing from a module. Just add more keys to module.exports.',
      },
      {
        type: 'code',
        text: 'function double(n) { return n * 2; }\nfunction square(n) { return n * n; }\nmodule.exports.double = double;\nmodule.exports.square = square;',
      },
      {
        type: 'tip',
        text: 'Think of module.exports as a bag. You put functions and values into the bag. Another file opens the bag with require().',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Export two functions: double(n) — returns n * 2 — and triple(n) — returns n * 3. Log both results for the number 5.',
      starter: '// write double and triple, then export and log them\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof module.exports.double === "function" && module.exports.double(5) === 10',
          label: 'double(5) returns 10',
          hint: 'function double(n) { return n * 2; }',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof module.exports.triple === "function" && module.exports.triple(5) === 15',
          label: 'triple(5) returns 15',
          hint: 'function triple(n) { return n * 3; }',
        },
        {
          type: 'logIncludes',
          text: '10',
          label: 'You logged the result of double(5)',
        },
      ],
      hints: [
        'Write both functions, then set module.exports.double = double; and module.exports.triple = triple;',
        'Finally: console.log(double(5)); console.log(triple(5));',
      ],
      solution:
        'function double(n) { return n * 2; }\nfunction triple(n) { return n * 3; }\nmodule.exports.double = double;\nmodule.exports.triple = triple;\nconsole.log(double(5));\nconsole.log(triple(5));',
    },
  },
  {
    id: 'node-basics-3',
    blocks: [
      {
        type: 'p',
        text: 'You can also export an object directly. This is a shortcut when you want to export several things at once.',
      },
      {
        type: 'code',
        text: 'module.exports = {\n  pi: 3.14159,\n  circleArea: function (r) { return 3.14159 * r * r; },\n};',
      },
      {
        type: 'p',
        text: 'Notice the whole export is just one object. The keys are the names other files will use.',
      },
      {
        type: 'tip',
        text: 'Both styles work. Pick the one that feels cleaner for the job.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Set module.exports to an object with two keys: a number called TAX_RATE set to 0.08, and a function called addTax(price) that returns price + price * 0.08.',
      starter: '// set module.exports = { ... }\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'module.exports.TAX_RATE === 0.08',
          label: 'TAX_RATE is 0.08',
          hint: 'Put TAX_RATE: 0.08 inside your exported object.',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof module.exports.addTax === "function" && Math.round(module.exports.addTax(100) * 100) === 10800',
          label: 'addTax(100) returns 108',
          hint: 'addTax: function(price) { return price + price * 0.08; }',
        },
      ],
      hints: [
        'module.exports = { TAX_RATE: 0.08, addTax: function(price) { ... } };',
        'Inside addTax, return price + price * TAX_RATE; — or just price * 1.08.',
      ],
      solution:
        'module.exports = {\n  TAX_RATE: 0.08,\n  addTax: function (price) { return price + price * 0.08; },\n};',
    },
  },
  {
    id: 'node-basics-4',
    blocks: [
      {
        type: 'p',
        text: 'require() loads another module. In the real world you pass a file path like "./math". In this sandbox require("fs"), require("http"), require("path"), and require("express") are already wired up.',
      },
      {
        type: 'code',
        text: 'var fs = require("fs");\nfs.writeFileSync("note.txt", "Hello!");\nvar content = fs.readFileSync("note.txt");\nconsole.log(content); // "Hello!"',
      },
      {
        type: 'tip',
        text: 'require() returns whatever the other module put on module.exports. It is just a function that gives you an object.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Use require("fs") to write the text "saved!" to a file called "data.txt", then read it back and log the contents.',
      starter: 'var fs = require("fs");\n// write and read data.txt\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'require("fs")',
          label: 'You called require("fs")',
        },
        {
          type: 'sourceIncludes',
          text: 'writeFileSync',
          label: 'You used fs.writeFileSync',
          hint: 'fs.writeFileSync("data.txt", "saved!");',
        },
        {
          type: 'logIncludes',
          text: 'saved!',
          label: 'You logged the file contents',
          hint: 'console.log(fs.readFileSync("data.txt"));',
        },
      ],
      hints: [
        'fs.writeFileSync("data.txt", "saved!"); writes the file.',
        'Then var content = fs.readFileSync("data.txt"); and console.log(content);',
      ],
      solution:
        'var fs = require("fs");\nfs.writeFileSync("data.txt", "saved!");\nvar content = fs.readFileSync("data.txt");\nconsole.log(content);',
    },
  },
  {
    id: 'node-basics-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone time. You now know how to export values and functions, export objects, and use require. Real Node programs chain all three ideas together.',
      },
      {
        type: 'p',
        text: 'Here is what a tiny utility module looks like in one file. It exports a config object and a helper function.',
      },
      {
        type: 'code',
        text: 'module.exports = {\n  version: "1.0.0",\n  shout: function (msg) { return msg.toUpperCase() + "!!!"; },\n};',
      },
      {
        type: 'tip',
        text: 'You are building the foundation every Node server needs. Modules keep big apps from becoming one giant mess.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Build a utility module. Export an object with: a string called appName set to "CodeSprout", a number called version set to 2, and a function called welcome(name) that returns "Welcome to CodeSprout, " + name + "!". Then log welcome("Alex").',
      starter: '// build your module exports here\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'module.exports.appName === "CodeSprout"',
          label: 'appName is "CodeSprout"',
        },
        {
          type: 'exprTruthy',
          expr: 'module.exports.version === 2',
          label: 'version is 2',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof module.exports.welcome === "function" && module.exports.welcome("Alex") === "Welcome to CodeSprout, Alex!"',
          label: 'welcome("Alex") returns the right string',
          hint: 'return "Welcome to CodeSprout, " + name + "!";',
        },
        {
          type: 'logIncludes',
          text: 'Welcome to CodeSprout, Alex!',
          label: 'You logged the welcome message',
        },
      ],
      hints: [
        'module.exports = { appName: "CodeSprout", version: 2, welcome: function(name) { ... } };',
        'Inside welcome: return "Welcome to CodeSprout, " + name + "!";',
      ],
      solution:
        'module.exports = {\n  appName: "CodeSprout",\n  version: 2,\n  welcome: function (name) { return "Welcome to CodeSprout, " + name + "!"; },\n};\nconsole.log(module.exports.welcome("Alex"));',
    },
  },
];

export default lessons;
