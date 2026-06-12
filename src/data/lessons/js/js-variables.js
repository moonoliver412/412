// Topic: Variables & Types (js-variables) — 5 lessons.

const lessons = [
  {
    id: 'js-variables-1',
    blocks: [
      {
        type: 'p',
        text: 'JavaScript makes a web page interactive. But first it needs to remember things — that is what variables are for. A variable is a labelled box. You give it a name, and you can put any value inside.',
      },
      {
        type: 'p',
        text: 'Modern JavaScript gives you two keywords for creating variables: const and let. Use const when the value will never change — a name, a fixed price, the wheel count on a bike. Use let when you know the value will change later.',
      },
      {
        type: 'code',
        text: 'const treeName = "Maple";\nlet age = 3;\n\nconsole.log(treeName); // Maple\nconsole.log(age);      // 3',
      },
      {
        type: 'p',
        text: 'The = sign does not mean "equals" like in maths. It means assign — you are putting the value on the right into the box on the left. console.log() prints values to the console so you can see what is inside each variable.',
      },
      {
        type: 'tip',
        text: 'Start with const every time. If your code tries to reassign it, change it to let. Using const by default helps you catch bugs early.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Declare a const called species set to the name of any tree, and a let called rings set to any number. Then log both of them.',
      hints: [
        'A variable needs a keyword (const or let), a name, an = sign, and a value. Strings go in quotes; numbers do not.',
        'Declare const species = "Oak"; then let rings = 5; then console.log(species, rings) at the end.',
      ],
      starter:
        '// Declare your variables here\n// your code here\n\n// Log them\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof species === "string" && species.length > 0',
          label: 'species is declared as a non-empty string',
          hint: 'Assign any tree name string to a const called species.',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof rings === "number"',
          label: 'rings is declared as a number',
          hint: 'Assign any number to a let called rings.',
        },
        {
          type: 'logIncludes',
          text: '',
          label: 'Both values are logged to the console',
        },
      ],
      solution:
        'const species = "Oak";\nlet rings = 5;\n\nconsole.log(species, rings);\n',
    },
  },
  {
    id: 'js-variables-2',
    blocks: [
      {
        type: 'p',
        text: 'Every value in JavaScript has a type. The two you will use most are numbers and strings. Numbers are just digits — no quotes needed. Strings are text wrapped in quote marks: single, double, or backtick.',
      },
      {
        type: 'code',
        text: 'const height = 42;            // number\nconst greeting = "Hello!";    // string\nconst message = `Height: ${height}m`; // template literal\nconsole.log(message); // Height: 42m',
      },
      {
        type: 'p',
        text: 'The backtick string is special. It is called a template literal. Inside it, ${...} is a slot where you write any expression. JavaScript converts the result to text and drops it right in. That is much cleaner than joining strings with + signs.',
      },
      {
        type: 'tip',
        text: 'You can do maths directly on numbers: const area = width * height. But "3" + 4 gives "34" not 7 — JavaScript treats "3" as a string and joins them. The typeof operator tells you the type of any value.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Declare a number called diameter and a string called bark. Then use a template literal to log a sentence that includes both — something like "Bark: rough, diameter: 12cm".',
      hints: [
        'A template literal uses backticks (`). Inside it, wrap any variable in ${} to drop its value into the text.',
        'Write console.log(`Bark: ${bark}, diameter: ${diameter}cm`); using the two variables already declared.',
      ],
      starter:
        'const diameter = 12;\nconst bark = "rough";\n\n// Log a sentence using a template literal\n// your code here\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof diameter === "number"',
          label: 'diameter is a number',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof bark === "string"',
          label: 'bark is a string',
        },
        {
          type: 'logIncludes',
          text: '12',
          label: 'The logged sentence includes the diameter value',
          hint: 'Use ${diameter} inside your template literal so the number 12 appears in the output.',
        },
      ],
      solution:
        'const diameter = 12;\nconst bark = "rough";\n\nconsole.log(`Bark: ${bark}, diameter: ${diameter}cm`);\n',
    },
  },
  {
    id: 'js-variables-3',
    blocks: [
      {
        type: 'p',
        text: 'The third important type is boolean — a value that is either true or false. Booleans come from comparisons. Is 5 greater than 3? Are these two strings equal? JavaScript answers with true or false.',
      },
      {
        type: 'code',
        text: 'const score = 85;\nconst passed = score >= 60;  // true\nconst perfect = score === 100; // false\nconsole.log(passed);  // true',
      },
      {
        type: 'p',
        text: 'Use === (three equals signs) to compare values. It checks both the value and the type, which prevents surprises. The !== operator checks "not equal". You will use these all the time inside if statements.',
      },
      {
        type: 'tip',
        text: 'Six values are falsy in JavaScript — false, 0, "", null, undefined, NaN. Everything else is truthy. Learning this list now saves you a lot of confusion later.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Declare a const called seedCount set to any number. Then declare a const called hasSprouted that is true if seedCount is greater than 0. Log hasSprouted.',
      hints: [
        'A comparison like seedCount > 0 gives you true or false. You can store that result directly in a const.',
        'Write const hasSprouted = seedCount > 0; — the > operator produces the boolean you need.',
      ],
      starter:
        'const seedCount = 5;\n\n// Declare hasSprouted using a comparison\n// your code here\n\nconsole.log(hasSprouted);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof hasSprouted === "boolean"',
          label: 'hasSprouted is a boolean',
          hint: 'Set hasSprouted equal to the result of the comparison seedCount > 0.',
        },
        {
          type: 'exprTruthy',
          expr: 'hasSprouted === (seedCount > 0)',
          label: 'hasSprouted correctly reflects whether seedCount is above 0',
        },
        {
          type: 'logIncludes',
          text: 'true',
          label: 'true is logged to the console',
        },
      ],
      solution:
        'const seedCount = 5;\n\nconst hasSprouted = seedCount > 0;\n\nconsole.log(hasSprouted);\n',
    },
  },
  {
    id: 'js-variables-4',
    blocks: [
      {
        type: 'p',
        text: 'Sometimes a value has the wrong type — a number stored as a string, or a string that should be a number. JavaScript has built-in tools to convert between types. Number() turns a string into a number. String() turns a number into text.',
      },
      {
        type: 'code',
        text: 'const input = "42";         // string from a text box\nconst n = Number(input);    // 42 as a number\nconst label = String(n);    // "42" as a string\nconsole.log(n + 8);         // 50 (number math)\nconsole.log(label + " rings"); // "42 rings"',
      },
      {
        type: 'p',
        text: 'Number("hello") gives NaN — Not a Number — that is JavaScript saying the conversion failed. You can check for it with Number.isNaN(). Use typeof any time you want to confirm the type of a value.',
      },
      {
        type: 'tip',
        text: 'parseInt() and parseFloat() work like Number() but stop reading at the first non-digit character: parseInt("12px") gives 12. That is handy when you need to pull numbers out of CSS values.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The variable heightStr holds a height as a string. Convert it to a number, add 10 to it, and log the result. Then log the type of your converted number to confirm it.',
      hints: [
        'Number() converts a string to a number. Pass the string variable inside the parentheses and store the result.',
        'Write const h = Number(heightStr); then console.log(h + 10); and console.log(typeof h);',
      ],
      starter:
        'const heightStr = "28";\n\n// Convert to number and add 10\n// your code here\n\n// Log typeof to confirm\n// your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: '38',
          label: 'The result 38 is logged',
          hint: 'Convert heightStr with Number(), then add 10 before logging.',
        },
        {
          type: 'logIncludes',
          text: 'number',
          label: '"number" is logged from typeof',
          hint: 'Log typeof applied to your converted variable to print "number".',
        },
      ],
      solution:
        'const heightStr = "28";\n\nconst h = Number(heightStr);\nconsole.log(h + 10);\n\nconsole.log(typeof h);\n',
    },
  },
  {
    id: 'js-variables-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put it all together. A tiny calculator needs variables for inputs, maths to process them, and template literals to show the result. You have practised all three of those things.',
      },
      {
        type: 'code',
        text: 'const a = 15;\nconst b = 4;\nconst sum     = a + b;\nconst product = a * b;\nconst quotient = a / b;\nconsole.log(`${a} + ${b} = ${sum}`);\nconsole.log(`${a} × ${b} = ${product}`);\nconsole.log(`${a} / ${b} = ${quotient}`);\n',
      },
      {
        type: 'p',
        text: 'Real calculators also need to handle dividing by zero. In JavaScript, dividing by zero gives Infinity — not an error. It is good practice to check for it first. A simple if statement is enough. You will learn if statements properly in the next topic.',
      },
      {
        type: 'tip',
        text: 'The % operator gives the remainder after division — this is called modulo. 17 % 5 is 2. It is very useful. Checking whether a number is even (n % 2 === 0) is one of the most common patterns in all of coding.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Build a tiny calculator: given the two numbers below, compute and log their sum, difference, product, and remainder (using %). Format each result as a readable sentence using template literals.',
      hints: [
        'You need four operations: + for sum, - for difference, * for product, and % for remainder. Store each in its own const.',
        'Declare const sum = x + y; const diff = x - y; const product = x * y; const rem = x % y; then console.log each in a template literal.',
      ],
      starter:
        'const x = 17;\nconst y = 5;\n\n// Compute and log sum, difference, product, and remainder\n// your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: '22',
          label: 'The sum (22) is logged',
          hint: 'x + y equals 22 — log it in any sentence.',
        },
        {
          type: 'logIncludes',
          text: '12',
          label: 'The difference (12) is logged',
        },
        {
          type: 'logIncludes',
          text: '85',
          label: 'The product (85) is logged',
        },
        {
          type: 'logIncludes',
          text: '2',
          label: 'The remainder (2) is logged',
        },
      ],
      solution:
        'const x = 17;\nconst y = 5;\n\nconst sum = x + y;\nconst diff = x - y;\nconst product = x * y;\nconst rem = x % y;\n\nconsole.log(`${x} + ${y} = ${sum}`);\nconsole.log(`${x} - ${y} = ${diff}`);\nconsole.log(`${x} * ${y} = ${product}`);\nconsole.log(`${x} % ${y} = ${rem}`);\n',
    },
  },
];

export default lessons;
