// Topic: Functions & Logic (js-functions) — 5 lessons.

const lessons = [
  {
    id: 'js-functions-1',
    blocks: [
      {
        type: 'p',
        text: 'A function is a named recipe. You write the steps once, give the recipe a name, and run those steps any time by calling that name. Without functions you would copy-paste code everywhere. Then fixing one bug would mean fixing every copy.',
      },
      {
        type: 'p',
        text: 'There are two common ways to write a function. The classic style uses the function keyword. The modern style uses => and is called an arrow function. Both work the same way in most situations. You will see arrow functions most often in newer code.',
      },
      {
        type: 'code',
        text: '// Classic declaration\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\n// Arrow function\nconst greet = (name) => `Hello, ${name}!`;\n\nconsole.log(greet("Maple")); // Hello, Maple!',
      },
      {
        type: 'tip',
        text: 'A function that reaches its closing } without a return statement quietly returns undefined. If your function should produce a value, check that every path through it has a return.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write a function called greet that takes a name parameter and returns the string "Hello, <name>!" — for example greet("Ada") returns "Hello, Ada!". Log the result of calling it with any name.',
      hints: [
        'A function needs the function keyword, a name, parentheses for parameters, curly braces for the body, and a return statement.',
        'Write function greet(name) { return `Hello, ${name}!`; } — the template literal builds the exact string needed.',
      ],
      starter:
        '// Write your greet function here\n// your code here\n\nconsole.log(greet("Ada"));\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof greet === "function"',
          label: 'greet is a function',
          hint: 'Declare greet using the function keyword so it is available as a function.',
        },
        {
          type: 'exprTruthy',
          expr: 'greet("Ada") === "Hello, Ada!"',
          label: 'greet("Ada") returns "Hello, Ada!"',
          hint: 'Return a template literal that starts with "Hello, " and ends with "!".',
        },
        {
          type: 'logIncludes',
          text: 'hello',
          label: 'The greeting is logged to the console',
        },
      ],
      solution:
        'function greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("Ada"));\n',
    },
  },
  {
    id: 'js-functions-2',
    blocks: [
      {
        type: 'p',
        text: 'A function that always does the same thing is useful but limited. Conditionals let a function make decisions. The if / else if / else chain works like this: try this condition; if it does not match, try the next; if none match, use the fallback.',
      },
      {
        type: 'code',
        text: 'function waterAdvice(litres) {\n  if (litres < 1) {\n    return "Thirsty seedling — water now!";\n  } else if (litres < 3) {\n    return "Looking good, keep it up.";\n  } else {\n    return "Overwatered — ease off.";\n  }\n}',
      },
      {
        type: 'p',
        text: 'Conditions can combine with && (both must be true), || (either can be true), and ! (flips true to false and back). You can also use the ternary operator for quick two-way decisions: condition ? valueIfTrue : valueIfFalse. Do not nest ternaries — they get hard to read fast.',
      },
      {
        type: 'tip',
        text: 'Skip the else after a return. If the if block always returns, the else does nothing extra — the code after the if block only runs when the condition was false anyway.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write a function called classify that takes a number called score and returns "pass" if score is 60 or above, or "fail" otherwise. Log the result for scores 80 and 45.',
      hints: [
        'Use an if statement inside your function. The condition checks whether score is >= 60, and each branch returns a string.',
        'Write function classify(score) { if (score >= 60) { return "pass"; } return "fail"; }',
      ],
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
          hint: 'Use >= 60 so that exactly 60 also returns "pass".',
        },
        {
          type: 'logIncludes',
          text: 'pass',
          label: '"pass" is logged for a high score',
        },
      ],
      solution:
        'function classify(score) {\n  if (score >= 60) {\n    return "pass";\n  }\n  return "fail";\n}\n\nconsole.log(classify(80));\nconsole.log(classify(45));\n',
    },
  },
  {
    id: 'js-functions-3',
    blocks: [
      {
        type: 'p',
        text: 'When you need to repeat an action a set number of times, or go through every item in a list, you use a loop. The for loop is the most common one. It sets a counter, runs the body while the condition is true, and steps the counter after each run.',
      },
      {
        type: 'code',
        text: 'for (let i = 0; i < 5; i++) {\n  console.log(`Ring ${i + 1}`);\n}\n// Ring 1\n// Ring 2\n// Ring 3\n// Ring 4\n// Ring 5',
      },
      {
        type: 'p',
        text: 'The while loop is useful when you do not know in advance how many times to run. It keeps going as long as a condition is true. Be careful: if the condition never becomes false, the loop runs forever and freezes the program.',
      },
      {
        type: 'tip',
        text: 'Use for...of when you want every item in an array and do not need the index number: for (const item of fruits) { ... }. It is cleaner and hard to get wrong.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Use a for loop to log the numbers 1 through 5, each on its own line. Then write a function called sumTo that takes a number n and returns the sum of all integers from 1 to n (e.g. sumTo(5) returns 15).',
      hints: [
        'A for loop starts at 1 and runs while i <= 5. Inside sumTo, start a total at 0 and add each number from 1 up to n.',
        'Write for (let i = 1; i <= 5; i++) { console.log(i); } then function sumTo(n) { let total = 0; for (let i = 1; i <= n; i++) { total += i; } return total; }',
      ],
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
          hint: 'Add up every integer from 1 to n inside a loop and return the total.',
        },
        {
          type: 'logIncludes',
          text: '15',
          label: 'sumTo(5) logs 15',
          hint: 'Call console.log(sumTo(5)) after defining the function.',
        },
      ],
      solution:
        'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}\n\nfunction sumTo(n) {\n  let total = 0;\n  for (let i = 1; i <= n; i++) {\n    total += i;\n  }\n  return total;\n}\n\nconsole.log(sumTo(5));\n',
    },
  },
  {
    id: 'js-functions-4',
    blocks: [
      {
        type: 'p',
        text: 'Scope is the rule about which code can see which variables. A variable declared inside a function only exists inside that function. It disappears when the function returns. That is called local scope. It keeps functions from accidentally changing each other\'s data.',
      },
      {
        type: 'code',
        text: 'function makeCounter() {\n  let count = 0;          // local to makeCounter\n  return function () {\n    count++;\n    return count;\n  };\n}\n\nconst tick = makeCounter();\nconsole.log(tick()); // 1\nconsole.log(tick()); // 2\nconsole.log(tick()); // 3',
      },
      {
        type: 'p',
        text: 'The inner function above is a closure — it was created inside makeCounter and still has access to the count variable even after makeCounter has finished. The closure keeps count alive in memory. This is one of the most powerful patterns in JavaScript.',
      },
      {
        type: 'tip',
        text: 'Closures are not magic. They are just functions that remember where they were created. When you see a function returning another function, there is almost always a closure involved.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Write a function called makeAdder that takes a number called base and returns a new function. The returned function should take a number n and return base + n. Then create addFive = makeAdder(5) and log addFive(3) and addFive(10).',
      hints: [
        'A closure returns a function from inside another function. The inner function can still see the outer function\'s variables.',
        'Write function makeAdder(base) { return function(n) { return base + n; }; } — the inner function closes over base.',
      ],
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
          hint: 'Make sure makeAdder returns a function (not just a value) that takes n and returns base + n.',
        },
        {
          type: 'logIncludes',
          text: '8',
          label: 'addFive(3) logs 8',
        },
      ],
      solution:
        'function makeAdder(base) {\n  return function(n) {\n    return base + n;\n  };\n}\n\nconst addFive = makeAdder(5);\nconsole.log(addFive(3));\nconsole.log(addFive(10));\n',
    },
  },
  {
    id: 'js-functions-5',
    blocks: [
      {
        type: 'p',
        text: 'Let\'s build something that uses every idea from this topic: a number-guessing game. The program picks a secret number. The player submits a guess. The game returns a hint — "too low", "too high", or "correct!" — until the player wins.',
      },
      {
        type: 'code',
        text: 'function makeGame(secret) {\n  let attempts = 0;\n  return function guess(n) {\n    attempts++;\n    if (n < secret)  return `Too low! (attempt ${attempts})`;\n    if (n > secret)  return `Too high! (attempt ${attempts})`;\n    return `Correct in ${attempts} attempt(s)!`;\n  };\n}',
      },
      {
        type: 'p',
        text: 'The secret is locked inside the closure. Nothing outside can reach it. The attempts counter survives between calls because the inner function keeps the outer scope alive. Functions, conditionals, and closures all work together here.',
      },
      {
        type: 'tip',
        text: 'Keeping "make a game" separate from "take a guess" is good design. The outer function handles setup. The returned function handles play. This pattern appears in real libraries all the time.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Create a game with makeGame(7). Then call the returned guess function with at least two wrong guesses and finally the correct answer (7). Log the return value of each call.',
      hints: [
        'Call guess() with a number lower than 7, then higher than 7, then 7. Log each return value with console.log.',
        'Write console.log(guess(3)); console.log(guess(9)); console.log(guess(7)); after the const guess = makeGame(7); line.',
      ],
      starter:
        'function makeGame(secret) {\n  let attempts = 0;\n  return function guess(n) {\n    attempts++;\n    if (n < secret) return `Too low! (attempt ${attempts})`;\n    if (n > secret) return `Too high! (attempt ${attempts})`;\n    return `Correct in ${attempts} attempt(s)!`;\n  };\n}\n\nconst guess = makeGame(7);\n// your code here — call guess with wrong numbers, then 7\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'too',
          label: 'A "too low" or "too high" hint is logged',
          hint: 'Call guess() with a number that is not 7 first so a "too low" or "too high" message is logged.',
        },
        {
          type: 'logIncludes',
          text: 'correct',
          label: 'The "correct" message is logged',
          hint: 'Call guess(7) last and log the result — it returns the "Correct" message.',
        },
        {
          type: 'logIncludes',
          text: 'attempt',
          label: 'The attempt count appears in a message',
        },
      ],
      solution:
        'function makeGame(secret) {\n  let attempts = 0;\n  return function guess(n) {\n    attempts++;\n    if (n < secret) return `Too low! (attempt ${attempts})`;\n    if (n > secret) return `Too high! (attempt ${attempts})`;\n    return `Correct in ${attempts} attempt(s)!`;\n  };\n}\n\nconst guess = makeGame(7);\nconsole.log(guess(3));\nconsole.log(guess(9));\nconsole.log(guess(7));\n',
    },
  },
];

export default lessons;
