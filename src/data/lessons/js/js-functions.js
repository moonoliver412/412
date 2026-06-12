// Topic: Functions & Logic (js-functions) — 5 lessons.

const lessons = [
  {
    id: 'js-functions-1',
    blocks: [
      {
        type: 'p',
        text: 'A function is a named recipe: you describe the steps once, give the recipe a name, and then you can run those steps any time just by calling the name. Without functions, you would copy-paste the same code everywhere — and fixing a bug would mean fixing every copy.',
      },
      {
        type: 'p',
        text: 'There are two popular ways to write a function. The classic declaration uses the function keyword. The modern arrow function uses =>. Both work the same way in most situations; the arrow form is shorter and is the style you will see most often in new codebases.',
      },
      {
        type: 'code',
        text: '// Classic declaration\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Arrow function\nconst greet = (name) => `Hello, ${name}!`;\n\nconsole.log(greet("Maple")); // Hello, Maple!',
      },
      {
        type: 'tip',
        text: 'A function that reaches its closing } without a return statement quietly returns undefined. If your function should produce a value, always double-check there is a return on every code path.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write a function called greet that takes a name parameter and returns the string "Hello, <name>!" — for example greet("Ada") returns "Hello, Ada!". Log the result of calling it with any name.',
      starter:
        '// Write your greet function here\n// your code here\n\nconsole.log(greet("Ada"));\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof greet === "function"',
          label: 'greet is a function',
        },
        {
          type: 'exprTruthy',
          expr: 'greet("Ada") === "Hello, Ada!"',
          label: 'greet("Ada") returns "Hello, Ada!"',
        },
        {
          type: 'logIncludes',
          text: 'hello',
          label: 'The greeting is logged to the console',
        },
      ],
    },
  },
  {
    id: 'js-functions-2',
    blocks: [
      {
        type: 'p',
        text: 'A function that always does exactly the same thing is useful but limited. Conditionals let a function make decisions. The if / else if / else chain says: "try this condition; if it does not match, try the next one; if none match, do this fallback."',
      },
      {
        type: 'code',
        text: 'function waterAdvice(litres) {\n  if (litres < 1) {\n    return "Thirsty seedling — water now!";\n  } else if (litres < 3) {\n    return "Looking good, keep it up.";\n  } else {\n    return "Overwatered — ease off.";\n  }\n}',
      },
      {
        type: 'p',
        text: 'Conditions can combine with && (both true), || (either true), and ! (flip true/false). You can also use the ternary operator for short two-way decisions: condition ? valueIfTrue : valueIfFalse. Keep ternaries shallow — deeply nested ones are hard to read.',
      },
      {
        type: 'tip',
        text: 'Resist the urge to write else after a return. If the if block always returns, the else is redundant — the code below the if only runs when the condition was false anyway.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write a function called classify that takes a number called score and returns "pass" if score is 60 or above, or "fail" otherwise. Log the result for scores 80 and 45.',
      starter:
        '// Write your classify function here\n// your code here\n\nconsole.log(classify(80));\nconsole.log(classify(45));\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof classify === "function"',
          label: 'classify is a function',
        },
        {
          type: 'exprTruthy',
          expr: 'classify(80) === "pass" && classify(45) === "fail" && classify(60) === "pass"',
          label: 'classify returns the correct result for various scores',
        },
        {
          type: 'logIncludes',
          text: 'pass',
          label: '"pass" is logged for a high score',
        },
      ],
    },
  },
  {
    id: 'js-functions-3',
    blocks: [
      {
        type: 'p',
        text: 'When you need to repeat an action a known number of times, or work through every item in a collection, you reach for a loop. The for loop is the workhorse: it sets a counter, runs the body while the condition is true, and steps the counter after each run.',
      },
      {
        type: 'code',
        text: 'for (let i = 0; i < 5; i++) {\n  console.log(`Ring ${i + 1}`);\n}\n// Ring 1\n// Ring 2\n// Ring 3\n// Ring 4\n// Ring 5',
      },
      {
        type: 'p',
        text: 'The while loop is simpler when you do not know upfront how many times to run — you keep going as long as a condition stays true. But be careful: if the condition never becomes false, the loop runs forever and locks up the program.',
      },
      {
        type: 'tip',
        text: 'Prefer for...of when you want every item in an array without needing the index: for (const item of fruits) { ... }. It is cleaner and almost impossible to get wrong.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Use a for loop to log the numbers 1 through 5, each on its own line. Then write a function called sumTo that takes a number n and returns the sum of all integers from 1 to n (e.g. sumTo(5) returns 15).',
      starter:
        '// Log 1 through 5\n// your code here\n\n// Write sumTo\n// your code here\n\nconsole.log(sumTo(5));\n',
      checks: [
        {
          type: 'logIncludes',
          text: '1',
          label: 'Numbers 1-5 are logged',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof sumTo === "function" && sumTo(5) === 15 && sumTo(3) === 6',
          label: 'sumTo correctly sums 1 through n',
        },
        {
          type: 'logIncludes',
          text: '15',
          label: 'sumTo(5) logs 15',
        },
      ],
    },
  },
  {
    id: 'js-functions-4',
    blocks: [
      {
        type: 'p',
        text: 'Scope is the rule about which code can see which variables. A variable declared inside a function only exists inside that function — it vanishes the moment the function returns. That is called local scope, and it keeps functions from accidentally interfering with each other.',
      },
      {
        type: 'code',
        text: 'function makeCounter() {\n  let count = 0;          // local to makeCounter\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst tick = makeCounter();\nconsole.log(tick()); // 1\nconsole.log(tick()); // 2\nconsole.log(tick()); // 3',
      },
      {
        type: 'p',
        text: 'The inner function above is a closure: it was born inside makeCounter and still has access to that count variable even after makeCounter has finished running. The closure keeps count alive in its memory. This is one of JavaScript\'s most powerful patterns.',
      },
      {
        type: 'tip',
        text: 'Closures are not magic — they are just functions that remember where they were born. Any time you see a function returning another function, there is probably a closure involved.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write a function called makeAdder that takes a number called base and returns a new function. The returned function should take a number n and return base + n. Then create addFive = makeAdder(5) and log addFive(3) and addFive(10).',
      starter:
        '// Write makeAdder\n// your code here\n\nconst addFive = makeAdder(5);\nconsole.log(addFive(3));\nconsole.log(addFive(10));\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof makeAdder === "function"',
          label: 'makeAdder is a function',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof makeAdder(5) === "function" && makeAdder(5)(3) === 8 && makeAdder(10)(4) === 14',
          label: 'makeAdder returns a function that correctly adds to the base',
        },
        {
          type: 'logIncludes',
          text: '8',
          label: 'addFive(3) logs 8',
        },
      ],
    },
  },
  {
    id: 'js-functions-5',
    blocks: [
      {
        type: 'p',
        text: 'Let us build something that uses every idea from this topic: a number-guessing game. The program picks a secret number, the player submits a guess, and the game returns a hint — "too low", "too high", or "correct!" — until the player wins.',
      },
      {
        type: 'code',
        text: 'function makeGame(secret) {\n  let attempts = 0;\n  return function guess(n) {\n    attempts++;\n    if (n < secret)  return `Too low! (attempt ${attempts})`;\n    if (n > secret)  return `Too high! (attempt ${attempts})`;\n    return `Correct in ${attempts} attempt(s)!`;\n  };\n}',
      },
      {
        type: 'p',
        text: 'The secret is locked inside the closure, invisible to the outside world. The attempts counter persists across calls because the inner function keeps the outer scope alive. Notice how functions, conditionals, loops (implicit in repeated calls), and closures all play together here.',
      },
      {
        type: 'tip',
        text: 'Separating "make a game" from "take a guess" is good design — the factory function handles setup, the returned function handles play. This pattern shows up in real libraries all the time.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Create a game with makeGame(7). Then call the returned guess function with at least two wrong guesses and finally the correct answer (7). Log the return value of each call.',
      starter:
        'function makeGame(secret) {\n  let attempts = 0;\n  return function guess(n) {\n    attempts++;\n    if (n < secret) return `Too low! (attempt ${attempts})`;\n    if (n > secret) return `Too high! (attempt ${attempts})`;\n    return `Correct in ${attempts} attempt(s)!`;\n  };\n}\n\nconst guess = makeGame(7);\n// your code here — call guess with wrong numbers, then 7\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'too',
          label: 'A "too low" or "too high" hint is logged',
        },
        {
          type: 'logIncludes',
          text: 'correct',
          label: 'The "correct" message is logged',
        },
        {
          type: 'logIncludes',
          text: 'attempt',
          label: 'The attempt count appears in a message',
        },
      ],
    },
  },
];

export default lessons;
