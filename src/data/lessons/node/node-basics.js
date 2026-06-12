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
];

export default lessons;
