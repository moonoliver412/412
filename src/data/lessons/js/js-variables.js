// Topic: Variables & Types (js-variables) — 5 lessons.

const lessons = [
  {
    id: 'js-variables-1',
    blocks: [
      {
        type: 'p',
        text: 'JavaScript is the layer that makes a page think. But before it can think, it needs somewhere to remember things — and that is what variables are for. A variable is a labelled box: you give it a name, and you can put any value inside.',
      },
      {
        type: 'p',
        text: 'Modern JavaScript has two keywords for creating variables: const and let. Use const when the value will not change — a name, a fixed price, the number of wheels on a bicycle. Use let when you know the value will be updated later.',
      },
      {
        type: 'code',
        text: 'const treeName = "Maple";\nlet age = 3;\n\nconsole.log(treeName); // Maple\nconsole.log(age);      // 3',
      },
      {
        type: 'p',
        text: 'The = sign is not "equals" the way maths uses it — it means assign. You are putting the value on the right into the box on the left. console.log() is your best friend: it prints values to the console panel so you can see exactly what is in each box.',
      },
      {
        type: 'tip',
        text: 'Start with const. If the linter (or your own code) complains that you tried to reassign it, change it to let. Defaulting to const catches bugs early.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Declare a const called species set to the name of any tree, and a let called rings set to any number. Then log both of them.',
      starter:
        '// Declare your variables here\n// your code here\n\n// Log them\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof species === "string" && species.length > 0',
          label: 'species is declared as a non-empty string',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof rings === "number"',
          label: 'rings is declared as a number',
        },
        {
          type: 'logIncludes',
          text: '',
          label: 'Both values are logged to the console',
        },
      ],
    },
  },
  {
    id: 'js-variables-2',
    blocks: [
      {
        type: 'p',
        text: 'Every value in JavaScript has a type. The two you will use most in your first weeks are numbers and strings. Numbers are just digits — no quotes needed. Strings are text wrapped in quotes, either single, double, or backtick.',
      },
      {
        type: 'code',
        text: 'const height = 42;            // number\nconst greeting = "Hello!";    // string\nconst message = `Height: ${height}m`; // template literal\nconsole.log(message); // Height: 42m',
      },
      {
        type: 'p',
        text: 'The backtick string is special — it is called a template literal. Inside it, ${...} is a little window where you can drop any expression, and JavaScript will convert the result to text and stitch it right in. This is far neater than joining strings with + signs.',
      },
      {
        type: 'tip',
        text: 'You can do arithmetic on numbers directly: const area = width * height. But "3" + 4 gives "34" not 7 — that is JavaScript silently treating "3" as a string. The typeof operator reveals the type of any value.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Declare a number called diameter and a string called bark. Then use a template literal to log a sentence that includes both — something like "Bark: rough, diameter: 12cm".',
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
        },
      ],
    },
  },
  {
    id: 'js-variables-3',
    blocks: [
      {
        type: 'p',
        text: 'The third fundamental type is boolean — a value that is either true or false, nothing in between. Booleans come from comparisons. Is 5 greater than 3? Is this string equal to that string? JavaScript answers with true or false.',
      },
      {
        type: 'code',
        text: 'const score = 85;\nconst passed = score >= 60;  // true\nconst perfect = score === 100; // false\nconsole.log(passed);  // true',
      },
      {
        type: 'p',
        text: 'Use === (three equals signs) to compare values, not == (two). The triple version checks both the value AND the type, which prevents surprises. The !== operator checks "not equal." You will use these constantly inside if statements.',
      },
      {
        type: 'tip',
        text: 'Six values are falsy in JavaScript — false, 0, "", null, undefined, NaN — everything else is truthy. Knowing this list saves hours of head-scratching later.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Declare a const called seedCount set to any number. Then declare a const called hasSprouted that is true if seedCount is greater than 0. Log hasSprouted.',
      starter:
        'const seedCount = 5;\n\n// Declare hasSprouted using a comparison\n// your code here\n\nconsole.log(hasSprouted);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof hasSprouted === "boolean"',
          label: 'hasSprouted is a boolean',
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
    },
  },
  {
    id: 'js-variables-4',
    blocks: [
      {
        type: 'p',
        text: 'Sometimes a value arrives as the wrong type — a number disguised as a string, or a string that should be a number. JavaScript gives you built-in tools to convert between types: Number() turns a string into a number, and String() turns a number into text.',
      },
      {
        type: 'code',
        text: 'const input = "42";         // string from a text box\nconst n = Number(input);    // 42 as a number\nconst label = String(n);    // "42" as a string\nconsole.log(n + 8);         // 50 (number math)\nconsole.log(label + " rings"); // "42 rings"',
      },
      {
        type: 'p',
        text: 'Number("hello") gives NaN — Not a Number — which is JavaScript\'s polite way of saying "that conversion failed." You can test for it with Number.isNaN(). The typeof operator is always handy to confirm what type you are actually dealing with.',
      },
      {
        type: 'tip',
        text: 'parseInt() and parseFloat() are older cousins of Number() that stop reading at the first non-numeric character: parseInt("12px") gives 12. Handy when parsing CSS values.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'The variable heightStr holds a height as a string. Convert it to a number, add 10 to it, and log the result. Then log the type of your converted number to confirm it.',
      starter:
        'const heightStr = "28";\n\n// Convert to number and add 10\n// your code here\n\n// Log typeof to confirm\n// your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: '38',
          label: 'The result 38 is logged',
        },
        {
          type: 'logIncludes',
          text: 'number',
          label: '"number" is logged from typeof',
        },
      ],
    },
  },
  {
    id: 'js-variables-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put the whole topic together and build something that actually calculates. A tiny calculator needs variables for the inputs, arithmetic to process them, and template literals to display the result — exactly the three things you have practised.',
      },
      {
        type: 'code',
        text: 'const a = 15;\nconst b = 4;\nconst sum     = a + b;\nconst product = a * b;\nconst quotient = a / b;\nconsole.log(`${a} + ${b} = ${sum}`);\nconsole.log(`${a} × ${b} = ${product}`);\nconsole.log(`${a} / ${b} = ${quotient}`);\n',
      },
      {
        type: 'p',
        text: 'Real calculators also need to handle the case where someone tries to divide by zero. In JavaScript, dividing by zero gives Infinity rather than an error, so it is kind to check first. A simple if statement — which you will study properly in the next topic — is enough.',
      },
      {
        type: 'tip',
        text: 'The % operator is the remainder after division (modulo): 17 % 5 is 2. It is surprisingly useful — checking whether a number is even (n % 2 === 0) is one of the most common one-liners in all of coding.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Build a tiny calculator: given the two numbers below, compute and log their sum, difference, product, and remainder (using %). Format each result as a readable sentence using template literals.',
      starter:
        'const x = 17;\nconst y = 5;\n\n// Compute and log sum, difference, product, and remainder\n// your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: '22',
          label: 'The sum (22) is logged',
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
    },
  },
];

export default lessons;
