// Topic: Generics (ts-generics) — 5 lessons.

const lessons = [
  {
    id: 'ts-generics-1',
    blocks: [
      {
        type: 'p',
        text: 'Generics let you write one function or type that works with many different types — without losing type safety. Think of a generic as a placeholder that gets filled in when you use it.',
      },
      {
        type: 'p',
        text: 'Without generics, you might reach for any. But any turns off checking. Generics keep the checks while staying flexible.',
      },
      {
        type: 'code',
        text: '// Without generics — loses type info\nfunction echo(value: any): any {\n  return value;\n}\n\n// With a generic — keeps type info\nfunction identity<T>(value: T): T {\n  return value;\n}\n\nconsole.log(identity(42));\nconsole.log(identity("hello"));',
      },
      {
        type: 'tip',
        text: 'T is just a name — a placeholder. You can call it anything, but T (short for "Type") is the convention. TypeScript fills it in based on what you pass.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Write a generic function called wrap<T>(value: T): T[] that returns [value]. Log wrap(5) and wrap("cat").',
      starter: '// Write the generic wrap function\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'function wrap<T>',
          label: 'wrap is a generic function',
          hint: 'Write: function wrap<T>(value: T): T[] { return [value]; }',
        },
        {
          type: 'logIncludes',
          text: '5',
          label: 'wrap(5) is logged',
        },
        {
          type: 'logIncludes',
          text: 'cat',
          label: 'wrap("cat") is logged',
        },
      ],
      hints: [
        'Put the type parameter in angle brackets: function wrap<T>(value: T): T[]',
        'Return [value]; then log both calls.',
      ],
      solution:
        'function wrap<T>(value: T): T[] {\n  return [value];\n}\nconsole.log(wrap(5));\nconsole.log(wrap("cat"));',
    },
  },
  {
    id: 'ts-generics-2',
    blocks: [
      {
        type: 'p',
        text: 'You can use a generic function with any type. TypeScript figures out T from what you pass in — you rarely need to write it out by hand.',
      },
      {
        type: 'code',
        text: 'function first<T>(arr: T[]): T {\n  return arr[0];\n}\n\nconsole.log(first([10, 20, 30]));\nconsole.log(first(["a", "b", "c"]));',
      },
      {
        type: 'p',
        text: 'Here T is inferred as number in the first call and as string in the second. One function, two types, full safety.',
      },
      {
        type: 'tip',
        text: 'You can also pass the type explicitly: first<number>([10, 20, 30]). This is useful when TypeScript cannot infer it from context.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Write a generic function called last<T>(arr: T[]): T that returns the last element of an array. Log last([1, 2, 3]) and last(["x", "y"]).',
      starter: '// Write last here\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'function last<T>',
          label: 'last is a generic function',
          hint: 'Write: function last<T>(arr: T[]): T { return arr[arr.length - 1]; }',
        },
        {
          type: 'logIncludes',
          text: '3',
          label: 'last([1, 2, 3]) returns 3',
        },
        {
          type: 'logIncludes',
          text: 'y',
          label: 'last(["x", "y"]) returns "y"',
        },
      ],
      hints: [
        'Return arr[arr.length - 1] to get the last item.',
        'Log both: console.log(last([1, 2, 3])); console.log(last(["x", "y"]));',
      ],
      solution:
        'function last<T>(arr: T[]): T {\n  return arr[arr.length - 1];\n}\nconsole.log(last([1, 2, 3]));\nconsole.log(last(["x", "y"]));',
    },
  },
  {
    id: 'ts-generics-3',
    blocks: [
      {
        type: 'p',
        text: 'Sometimes you want a generic but with a rule — T must have at least certain properties. You add a constraint with the extends keyword.',
      },
      {
        type: 'code',
        text: '// T must have a name property\nfunction getName<T extends { name: string }>(obj: T): string {\n  return obj.name;\n}\n\nconsole.log(getName({ name: "Ada", score: 10 }));\nconsole.log(getName({ name: "Sam" }));',
      },
      {
        type: 'p',
        text: 'The constraint T extends { name: string } means you can pass any object — as long as it has a name. TypeScript will reject anything without that property.',
      },
      {
        type: 'tip',
        text: 'Constraints let you keep generics flexible while still calling specific properties or methods safely.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Write a generic function called getLength<T extends { length: number }>(val: T): number that returns val.length. Log getLength("hello") and getLength([1, 2, 3]).',
      starter: '// Write getLength here\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'getLength<T extends',
          label: 'getLength has a constraint',
          hint: 'Write: function getLength<T extends { length: number }>(val: T): number',
        },
        {
          type: 'logIncludes',
          text: '5',
          label: 'getLength("hello") returns 5',
        },
        {
          type: 'logIncludes',
          text: '3',
          label: 'getLength([1, 2, 3]) returns 3',
        },
      ],
      hints: [
        'The constraint is <T extends { length: number }> — T must have a .length.',
        'Return val.length; then log both calls.',
      ],
      solution:
        'function getLength<T extends { length: number }>(val: T): number {\n  return val.length;\n}\nconsole.log(getLength("hello"));\nconsole.log(getLength([1, 2, 3]));',
    },
  },
  {
    id: 'ts-generics-4',
    blocks: [
      {
        type: 'p',
        text: 'Interfaces can also be generic. You add the type parameter after the interface name. This lets you describe a "container" shape that works for any type of content.',
      },
      {
        type: 'code',
        text: 'interface Box<T> {\n  value: T;\n  label: string;\n}\n\nconst numBox: Box<number> = { value: 42, label: "score" };\nconst strBox: Box<string> = { value: "hello", label: "message" };\n\nconsole.log(numBox.value, strBox.value);',
      },
      {
        type: 'p',
        text: 'When you create a Box<number>, TypeScript knows value must be a number. When you create Box<string>, value must be a string.',
      },
      {
        type: 'tip',
        text: 'Generic interfaces are a great way to describe data structures — like a response envelope, a paginated list, or a result type with a value and an error.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define a generic interface Pair<T> with first (T) and second (T). Create a const coords typed as Pair<number> with first: 10 and second: 20. Log coords.first.',
      starter: '// Define Pair<T> and create coords\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'interface\\s+Pair<T>',
          label: 'Pair<T> interface is defined',
          hint: 'Write: interface Pair<T> { first: T; second: T; }',
        },
        {
          type: 'sourceMatches',
          pattern: 'coords\\s*:\\s*Pair<number>',
          label: 'coords is typed as Pair<number>',
          hint: 'Write: const coords: Pair<number> = { first: 10, second: 20 };',
        },
        {
          type: 'logIncludes',
          text: '10',
          label: 'You logged coords.first',
        },
      ],
      hints: [
        'Define the interface with T as a placeholder for both properties.',
        'Fill in the type when you create the object: Pair<number>.',
      ],
      solution:
        'interface Pair<T> {\n  first: T;\n  second: T;\n}\nconst coords: Pair<number> = { first: 10, second: 20 };\nconsole.log(coords.first);',
    },
  },
  {
    id: 'ts-generics-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone: build a typed Box. It holds one value of any type, and has a method to transform the value using a function you pass in.',
      },
      {
        type: 'code',
        text: 'interface Box<T> {\n  value: T;\n}\n\nfunction mapBox<T, U>(box: Box<T>, fn: (v: T) => U): Box<U> {\n  return { value: fn(box.value) };\n}\n\nconst numBox: Box<number> = { value: 5 };\nconst strBox = mapBox(numBox, (n) => "score: " + n);\nconsole.log(strBox.value);',
      },
      {
        type: 'tip',
        text: 'mapBox uses two type parameters: T for what goes in and U for what comes out. This is a real pattern used in functional programming and in libraries like fp-ts.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define interface Box<T> with value (T). Write a function unbox<T>(b: Box<T>): T that returns b.value. Create a Box<string> with value "TypeScript" and log unbox on it.',
      starter: '// Define Box<T> and write unbox\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'interface\\s+Box<T>',
          label: 'Box<T> is defined',
          hint: 'Write: interface Box<T> { value: T; }',
        },
        {
          type: 'sourceMatches',
          pattern: 'function unbox<T>',
          label: 'unbox is generic',
          hint: 'Write: function unbox<T>(b: Box<T>): T { return b.value; }',
        },
        {
          type: 'logIncludes',
          text: 'TypeScript',
          label: 'unbox returns the value',
        },
      ],
      hints: [
        'Define Box<T> with a single value: T property.',
        'Then: const b: Box<string> = { value: "TypeScript" }; console.log(unbox(b));',
      ],
      solution:
        'interface Box<T> {\n  value: T;\n}\nfunction unbox<T>(b: Box<T>): T {\n  return b.value;\n}\nconst b: Box<string> = { value: "TypeScript" };\nconsole.log(unbox(b));',
    },
  },
];

export default lessons;
