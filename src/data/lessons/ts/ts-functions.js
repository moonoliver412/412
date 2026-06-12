// Topic: Typing Functions (ts-functions) — 5 lessons.

const lessons = [
  {
    id: 'ts-functions-1',
    blocks: [
      {
        type: 'p',
        text: 'Functions in TypeScript can have typed parameters and a typed return value. You annotate each parameter just like a variable — name, colon, type. The return type goes after the closing parenthesis.',
      },
      {
        type: 'code',
        text: 'function greet(name: string): string {\n  return "Hello, " + name;\n}\n\nconsole.log(greet("Ada"));',
      },
      {
        type: 'p',
        text: 'If you call greet(42), TypeScript warns you right away. The parameter expects a string, not a number.',
      },
      {
        type: 'tip',
        text: 'Always annotate function parameters. TypeScript cannot infer them from context. The return type is optional — TypeScript can often infer it — but writing it makes your intent clear.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Write a function called double that takes a num parameter (number) and returns num * 2 (return type number). Log double(7).',
      starter: '// Write double here\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'num\\s*:\\s*number',
          label: 'Parameter num is typed as number',
          hint: 'Write: function double(num: number): number { ... }',
        },
        {
          type: 'sourceMatches',
          pattern: '\\)\\s*:\\s*number',
          label: 'Return type is number',
          hint: 'Add ): number after the closing parenthesis.',
        },
        {
          type: 'logIncludes',
          text: '14',
          label: 'double(7) returns 14',
        },
      ],
      hints: [
        'Start with: function double(num: number): number {',
        'Return num * 2, then log: console.log(double(7));',
      ],
      solution:
        'function double(num: number): number {\n  return num * 2;\n}\nconsole.log(double(7));',
    },
  },
  {
    id: 'ts-functions-2',
    blocks: [
      {
        type: 'p',
        text: 'Sometimes a parameter should be optional — the caller can leave it out. Mark it with a question mark right before the colon.',
      },
      {
        type: 'code',
        text: 'function greet(name: string, title?: string): string {\n  if (title) {\n    return title + " " + name;\n  }\n  return name;\n}\n\nconsole.log(greet("Ada"));\nconsole.log(greet("Ada", "Dr."));',
      },
      {
        type: 'p',
        text: 'You can also give a parameter a default value. If the caller skips it, TypeScript uses your default.',
      },
      {
        type: 'code',
        text: 'function power(base: number, exp: number = 2): number {\n  return Math.pow(base, exp);\n}\n\nconsole.log(power(3));   // 9\nconsole.log(power(3, 3)); // 27',
      },
      {
        type: 'tip',
        text: 'A parameter with a default value is automatically optional. You do not need both a ? and a default.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Write a function called welcome(name: string, greeting: string = "Hello") that returns greeting + " " + name. Log welcome("Sam") and welcome("Sam", "Hey").',
      starter: '// Write welcome here\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'greeting\\s*:\\s*string\\s*=',
          label: 'greeting has a default value',
          hint: 'Write: greeting: string = "Hello"',
        },
        {
          type: 'logIncludes',
          text: 'Hello Sam',
          label: 'welcome("Sam") works',
        },
        {
          type: 'logIncludes',
          text: 'Hey Sam',
          label: 'welcome("Sam", "Hey") works',
        },
      ],
      hints: [
        'Function signature: function welcome(name: string, greeting: string = "Hello"): string',
        'Return greeting + " " + name; then log both calls.',
      ],
      solution:
        'function welcome(name: string, greeting: string = "Hello"): string {\n  return greeting + " " + name;\n}\nconsole.log(welcome("Sam"));\nconsole.log(welcome("Sam", "Hey"));',
    },
  },
  {
    id: 'ts-functions-3',
    blocks: [
      {
        type: 'p',
        text: 'In TypeScript, functions are values. You can store them in variables. A function type describes what parameters it takes and what it returns.',
      },
      {
        type: 'code',
        text: '// A variable that holds a function\nconst add: (a: number, b: number) => number = (a, b) => a + b;\n\nconsole.log(add(3, 4));',
      },
      {
        type: 'p',
        text: 'You can also use a function type as a parameter type. This lets you pass one function into another.',
      },
      {
        type: 'code',
        text: 'function apply(fn: (x: number) => number, value: number): number {\n  return fn(value);\n}\n\nconsole.log(apply((x) => x * 3, 5)); // 15',
      },
      {
        type: 'tip',
        text: 'Arrow functions and regular functions work the same way for types. Pick whichever style looks cleaner to you.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Declare a const called square typed as (n: number) => number. Set it to an arrow function that returns n * n. Log square(6).',
      starter: '// Declare square with a function type\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'square\\s*:\\s*\\(n\\s*:\\s*number\\)\\s*=>\\s*number',
          label: 'square has the right function type',
          hint: 'Write: const square: (n: number) => number = (n) => n * n;',
        },
        {
          type: 'logIncludes',
          text: '36',
          label: 'square(6) returns 36',
        },
      ],
      hints: [
        'The type goes right after the colon: (n: number) => number',
        'Then assign the arrow function: = (n) => n * n; and log square(6).',
      ],
      solution:
        'const square: (n: number) => number = (n) => n * n;\nconsole.log(square(6));',
    },
  },
  {
    id: 'ts-functions-4',
    blocks: [
      {
        type: 'p',
        text: 'Some functions do not return a value — they just do something, like logging. The return type for these is void.',
      },
      {
        type: 'code',
        text: 'function logScore(score: number): void {\n  console.log("Score:", score);\n}\n\nlogScore(42);',
      },
      {
        type: 'p',
        text: 'There is also never. A function has a never return type if it never finishes — for example, it always throws an error or runs forever. This is rare, but useful when you want TypeScript to know a code path is impossible.',
      },
      {
        type: 'code',
        text: 'function fail(message: string): never {\n  throw new Error(message);\n}\n\nconsole.log("before fail");',
      },
      {
        type: 'tip',
        text: 'Use void for functions that do work but return nothing. Use never only when a function is guaranteed to throw or loop forever.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Write a function called printLabel(label: string): void that logs "Label: " + label. Call it with "TypeScript".',
      starter: '// Write printLabel here\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: '\\)\\s*:\\s*void',
          label: 'Return type is void',
          hint: 'Add ): void after the parameter list.',
        },
        {
          type: 'logIncludes',
          text: 'Label: TypeScript',
          label: 'Correct output logged',
        },
      ],
      hints: [
        'Write: function printLabel(label: string): void {',
        'Inside, log "Label: " + label, then call printLabel("TypeScript");',
      ],
      solution:
        'function printLabel(label: string): void {\n  console.log("Label: " + label);\n}\nprintLabel("TypeScript");',
    },
  },
  {
    id: 'ts-functions-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone: build a typed calculator. You will write four functions — add, subtract, multiply, divide — each with typed parameters and return types. Then wire them together with an operate function.',
      },
      {
        type: 'code',
        text: 'type Op = "add" | "subtract" | "multiply" | "divide";\n\nfunction operate(a: number, b: number, op: Op): number {\n  if (op === "add") return a + b;\n  if (op === "subtract") return a - b;\n  if (op === "multiply") return a * b;\n  return a / b;\n}\n\nconsole.log(operate(10, 2, "multiply")); // 20',
      },
      {
        type: 'tip',
        text: 'Notice Op is a union of string literals. TypeScript checks that you only pass a valid operation name — it will warn you if you type "mulitply" by mistake.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Write an add function (a: number, b: number): number and a subtract function with the same signature. Then log add(8, 3) and subtract(8, 3).',
      starter: '// Write add and subtract\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'function add\\s*\\(\\s*a\\s*:\\s*number',
          label: 'add has typed parameters',
          hint: 'Write: function add(a: number, b: number): number { return a + b; }',
        },
        {
          type: 'logIncludes',
          text: '11',
          label: 'add(8, 3) returns 11',
        },
        {
          type: 'logIncludes',
          text: '5',
          label: 'subtract(8, 3) returns 5',
        },
      ],
      hints: [
        'Both functions take (a: number, b: number): number as their signature.',
        'Log both: console.log(add(8, 3)); console.log(subtract(8, 3));',
      ],
      solution:
        'function add(a: number, b: number): number {\n  return a + b;\n}\nfunction subtract(a: number, b: number): number {\n  return a - b;\n}\nconsole.log(add(8, 3));\nconsole.log(subtract(8, 3));',
    },
  },
];

export default lessons;
