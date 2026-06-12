// Topic: Unions & Narrowing (ts-unions) — 5 lessons.

const lessons = [
  {
    id: 'ts-unions-1',
    blocks: [
      {
        type: 'p',
        text: 'A union type says a value can be one of several types. You write it with a pipe character between the types.',
      },
      {
        type: 'code',
        text: 'let id: number | string;\n\nid = 42;\nconsole.log(id);\n\nid = "user-99";\nconsole.log(id);',
      },
      {
        type: 'p',
        text: 'This is useful when a value could come in more than one form. For example, an ID might be a plain number or a string like "user-99".',
      },
      {
        type: 'tip',
        text: 'When you use a union, TypeScript only lets you call methods that exist on ALL the types in the union. To use number-only or string-only methods, you need to narrow first (see lesson 3).',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Declare a let called code typed as number | string. Assign it 404, log it, then reassign it to "not-found" and log it again.',
      starter: '// Declare code as a union type\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'code\\s*:\\s*number\\s*\\|\\s*string',
          label: 'code is typed as number | string',
          hint: 'Write: let code: number | string;',
        },
        {
          type: 'logIncludes',
          text: '404',
          label: 'You logged 404',
        },
        {
          type: 'logIncludes',
          text: 'not-found',
          label: 'You logged "not-found"',
        },
      ],
      hints: [
        'Declare with: let code: number | string;',
        'Assign 404 and log, then reassign "not-found" and log again.',
      ],
      solution:
        'let code: number | string;\ncode = 404;\nconsole.log(code);\ncode = "not-found";\nconsole.log(code);',
    },
  },
  {
    id: 'ts-unions-2',
    blocks: [
      {
        type: 'p',
        text: 'A literal type is an exact value as a type. Instead of just string, you can say the only valid value is "red" or "blue".',
      },
      {
        type: 'code',
        text: 'let direction: "left" | "right" | "up" | "down";\n\ndirection = "left";\nconsole.log(direction);\n\n// direction = "diagonal"; // Error — not in the union',
      },
      {
        type: 'p',
        text: 'Literal unions are great for things like status codes, directions, or any small fixed set of choices.',
      },
      {
        type: 'tip',
        text: 'TypeScript will autocomplete valid values for you when you type a literal union. This catches typos before they become bugs.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Declare a let called size typed as "small" | "medium" | "large". Set it to "medium" and log it.',
      starter: '// Declare size as a literal union\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'size\\s*:\\s*"small"\\s*\\|\\s*"medium"\\s*\\|\\s*"large"',
          label: 'size is a three-way literal union',
          hint: 'Write: let size: "small" | "medium" | "large";',
        },
        {
          type: 'logIncludes',
          text: 'medium',
          label: 'You logged "medium"',
        },
      ],
      hints: [
        'Use string literals in the union: "small" | "medium" | "large"',
        'Assign size = "medium"; then log it.',
      ],
      solution:
        'let size: "small" | "medium" | "large";\nsize = "medium";\nconsole.log(size);',
    },
  },
  {
    id: 'ts-unions-3',
    blocks: [
      {
        type: 'p',
        text: 'When a value has a union type, TypeScript does not know which member it is yet. Narrowing means checking at runtime so TypeScript can be sure. The typeof operator is the most common way.',
      },
      {
        type: 'code',
        text: 'function show(value: number | string): void {\n  if (typeof value === "number") {\n    console.log("Number:", value.toFixed(2));\n  } else {\n    console.log("String:", value.toUpperCase());\n  }\n}\n\nshow(3.14159);\nshow("hello");',
      },
      {
        type: 'p',
        text: 'Inside the if block, TypeScript knows value is a number. Inside the else, it knows it is a string. You can safely call number or string methods.',
      },
      {
        type: 'tip',
        text: 'Narrowing is not a TypeScript trick — it is just a regular if statement. TypeScript watches your conditions and tracks what the type must be inside each branch.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Write a function called describe(val: number | string): void. If val is a number, log "num: " + val. Otherwise log "str: " + val. Call both describe(5) and describe("hi").',
      starter: '// Write describe here\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'typeof\\s+val\\s*===\\s*"number"',
          label: 'You narrowed with typeof',
          hint: 'Write: if (typeof val === "number") { ... }',
        },
        {
          type: 'logIncludes',
          text: 'num: 5',
          label: 'describe(5) logs correctly',
        },
        {
          type: 'logIncludes',
          text: 'str: hi',
          label: 'describe("hi") logs correctly',
        },
      ],
      hints: [
        'Use typeof val === "number" to narrow inside the function.',
        'One branch logs "num: " + val, the other logs "str: " + val.',
      ],
      solution:
        'function describe(val: number | string): void {\n  if (typeof val === "number") {\n    console.log("num: " + val);\n  } else {\n    console.log("str: " + val);\n  }\n}\ndescribe(5);\ndescribe("hi");',
    },
  },
  {
    id: 'ts-unions-4',
    blocks: [
      {
        type: 'p',
        text: 'A type alias gives a name to any type — a union, a primitive, or an object shape. You create one with the type keyword.',
      },
      {
        type: 'code',
        text: 'type ID = number | string;\ntype Direction = "north" | "south" | "east" | "west";\n\nlet userId: ID = 42;\nlet heading: Direction = "north";\n\nconsole.log(userId, heading);',
      },
      {
        type: 'p',
        text: 'Type aliases and interfaces can both describe object shapes, but aliases are more flexible — they can also name unions, primitives, and tuples.',
      },
      {
        type: 'tip',
        text: 'Use a type alias when the type is a union or when you want a short name for something complex. Use an interface when describing an object that might be extended.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Create a type alias Status equal to "active" | "inactive" | "pending". Declare a const s typed as Status set to "active". Log s.',
      starter: '// Create the Status type alias\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'type\\s+Status\\s*=',
          label: 'Status type alias is defined',
          hint: 'Write: type Status = "active" | "inactive" | "pending";',
        },
        {
          type: 'sourceMatches',
          pattern: 's\\s*:\\s*Status',
          label: 's is typed as Status',
          hint: 'Write: const s: Status = "active";',
        },
        {
          type: 'logIncludes',
          text: 'active',
          label: 'You logged s',
        },
      ],
      hints: [
        'Define the alias: type Status = "active" | "inactive" | "pending";',
        'Then declare: const s: Status = "active"; and log it.',
      ],
      solution:
        'type Status = "active" | "inactive" | "pending";\nconst s: Status = "active";\nconsole.log(s);',
    },
  },
  {
    id: 'ts-unions-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone: build a simple status machine. You will use a type alias for the states, narrowing to handle each state, and log the right message for each.',
      },
      {
        type: 'code',
        text: 'type State = "idle" | "loading" | "done" | "error";\n\nfunction handleState(state: State): void {\n  if (state === "idle") console.log("Waiting...");\n  else if (state === "loading") console.log("Loading...");\n  else if (state === "done") console.log("All done!");\n  else console.log("Something went wrong.");\n}\n\nhandleState("idle");\nhandleState("loading");\nhandleState("done");\nhandleState("error");',
      },
      {
        type: 'tip',
        text: 'This pattern — a union of string literals + a function that handles each case — shows up everywhere in real apps. React state machines, fetch status, form validation steps, and more.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define a type alias Phase equal to "start" | "play" | "end". Write a function tick(phase: Phase): void that logs a different message for each phase. Call all three phases.',
      starter: '// Define Phase and write tick\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'type\\s+Phase\\s*=',
          label: 'Phase type alias is defined',
          hint: 'Write: type Phase = "start" | "play" | "end";',
        },
        {
          type: 'sourceMatches',
          pattern: 'tick\\s*\\(\\s*phase\\s*:\\s*Phase',
          label: 'tick takes a Phase parameter',
          hint: 'Write: function tick(phase: Phase): void { ... }',
        },
        {
          type: 'sourceMatches',
          pattern: 'console\\.log',
          label: 'You logged something in tick',
        },
      ],
      hints: [
        'Define Phase first, then write tick with three if/else branches.',
        'Call tick("start"); tick("play"); tick("end"); after the function.',
      ],
      solution:
        'type Phase = "start" | "play" | "end";\nfunction tick(phase: Phase): void {\n  if (phase === "start") console.log("Game starting!");\n  else if (phase === "play") console.log("Playing...");\n  else console.log("Game over!");\n}\ntick("start");\ntick("play");\ntick("end");',
    },
  },
];

export default lessons;
