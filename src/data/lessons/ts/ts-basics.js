// Topic: Types & Inference (ts-basics) — 5 lessons.

const lessons = [
  {
    id: 'ts-basics-1',
    blocks: [
      {
        type: 'p',
        text: 'TypeScript is JavaScript with one big extra: types. A type is a label that says what kind of value a variable holds — a number, a word, a yes/no, and so on. The browser still runs plain JavaScript, but while you write, TypeScript checks that your values match their labels and warns you before bugs reach your users.',
      },
      {
        type: 'p',
        text: 'You add a type with a colon right after the name. This is called a type annotation.',
      },
      {
        type: 'code',
        text: 'let score: number = 0;\nlet playerName: string = "Ada";\nlet alive: boolean = true;',
      },
      {
        type: 'tip',
        text: 'Annotations never change what the code does — they only describe it. If you set a number variable to a word, TypeScript flags the mistake.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Make a const named coins with the type number, set it to 5, then log it with console.log.',
      starter: '// your code here\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'coins\\s*:\\s*number',
          label: 'coins is typed as a number',
          hint: 'Write the type after the name: const coins: number = 5;',
        },
        {
          type: 'logIncludes',
          text: '5',
          label: 'You logged the value',
        },
      ],
      hints: [
        'A type annotation goes after the name and a colon: const coins: number = 5;',
        'Then print it: console.log(coins);',
      ],
      solution: 'const coins: number = 5;\nconsole.log(coins);',
    },
  },
  {
    id: 'ts-basics-2',
    blocks: [
      {
        type: 'p',
        text: 'You have already seen annotations on variables. You can annotate any variable — let, const, or var. The three most common types are number, string, and boolean.',
      },
      {
        type: 'code',
        text: 'let age: number = 16;\nlet username: string = "Sam";\nlet isLoggedIn: boolean = false;\n\nconsole.log(age, username, isLoggedIn);',
      },
      {
        type: 'p',
        text: 'If you assign the wrong kind of value, TypeScript shows an error right in your editor — before you even run the code. That is the whole point.',
      },
      {
        type: 'tip',
        text: 'You do not need to annotate every variable. If you write `const score = 10;`, TypeScript already knows it is a number. Annotations are most useful when a value starts undefined or comes from outside your code.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Declare three variables: level (number = 1), hero (string = "Aria"), and active (boolean = true). Log all three on one line.',
      starter: '// Declare level, hero, and active here\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'level\\s*:\\s*number',
          label: 'level is typed as a number',
          hint: 'Write: let level: number = 1;',
        },
        {
          type: 'sourceMatches',
          pattern: 'hero\\s*:\\s*string',
          label: 'hero is typed as a string',
          hint: 'Write: let hero: string = "Aria";',
        },
        {
          type: 'logIncludes',
          text: 'Aria',
          label: 'You logged the values',
        },
      ],
      hints: [
        'Annotate each variable with a colon and its type: let level: number = 1;',
        'Log them all at once: console.log(level, hero, active);',
      ],
      solution:
        'let level: number = 1;\nlet hero: string = "Aria";\nlet active: boolean = true;\nconsole.log(level, hero, active);',
    },
  },
  {
    id: 'ts-basics-3',
    blocks: [
      {
        type: 'p',
        text: 'TypeScript can figure out a type on its own. When you write `const score = 42;`, TypeScript infers — that means it reads — the value and knows score is a number. You do not need to write the annotation.',
      },
      {
        type: 'code',
        text: '// TypeScript infers these types automatically\nconst score = 42;       // inferred: number\nconst name = "Jordan";  // inferred: string\nconst done = false;     // inferred: boolean\n\nconsole.log(score, name, done);',
      },
      {
        type: 'p',
        text: 'There is also a special type called any. It turns off type-checking for that variable. Use it as little as possible — it removes the safety net TypeScript provides.',
      },
      {
        type: 'tip',
        text: 'If TypeScript infers a type correctly, you can skip the annotation. But always annotate function parameters — TypeScript cannot infer those from context.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Let TypeScript infer the type of points by writing `const points = 100;` (no annotation). Then log points.',
      starter: '// Let TypeScript infer the type\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'const\\s+points\\s*=\\s*100',
          label: 'points is declared without an annotation',
          hint: 'Just write: const points = 100; — no colon needed.',
        },
        {
          type: 'logIncludes',
          text: '100',
          label: 'You logged 100',
        },
      ],
      hints: [
        'Write `const points = 100;` — no type annotation. TypeScript infers it.',
        'Then add: console.log(points);',
      ],
      solution: 'const points = 100;\nconsole.log(points);',
    },
  },
  {
    id: 'ts-basics-4',
    blocks: [
      {
        type: 'p',
        text: 'An array is a list of values. In TypeScript you type an array by writing the item type followed by []. So a list of numbers is number[], and a list of strings is string[].',
      },
      {
        type: 'code',
        text: 'const scores: number[] = [10, 20, 30];\nconst names: string[] = ["Ada", "Sam", "Jo"];\n\nconsole.log(scores[0], names[1]);',
      },
      {
        type: 'p',
        text: 'A tuple is a fixed-length array where each position has its own type. You write the types inside square brackets, separated by commas.',
      },
      {
        type: 'code',
        text: '// Tuple: first item is a string, second is a number\nconst player: [string, number] = ["Ada", 99];\n\nconsole.log(player[0], player[1]);',
      },
      {
        type: 'tip',
        text: 'Use arrays when the list can grow. Use tuples when you always have a fixed set of values — like a name-and-score pair.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Create a const called tags typed as string[] and set it to ["html", "css", "ts"]. Then log tags[0].',
      starter: '// Declare a string array called tags\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'tags\\s*:\\s*string\\[\\]',
          label: 'tags is typed as string[]',
          hint: 'Write: const tags: string[] = ["html", "css", "ts"];',
        },
        {
          type: 'logIncludes',
          text: 'html',
          label: 'You logged the first tag',
        },
      ],
      hints: [
        'The type goes after the name: const tags: string[] = [...];',
        'Log the first item: console.log(tags[0]);',
      ],
      solution:
        'const tags: string[] = ["html", "css", "ts"];\nconsole.log(tags[0]);',
    },
  },
  {
    id: 'ts-basics-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put it all together. A scoreboard stores player names and their scores. You can model that with a typed array and a tuple — plus a little logic to find the top score.',
      },
      {
        type: 'code',
        text: '// Each entry: [name, score]\nconst board: [string, number][] = [\n  ["Ada", 120],\n  ["Sam", 95],\n  ["Jo", 150],\n];\n\nconst topScore: number = Math.max(...board.map((e) => e[1]));\nconsole.log("Top score:", topScore);',
      },
      {
        type: 'tip',
        text: 'When you add TS types, the code still runs the same. TypeScript only checks — it never changes what your program does at runtime.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Build a scoreboard. Declare a const board typed as [string, number][] with at least two entries. Find the top score with Math.max and log it.',
      starter:
        '// Typed scoreboard\nconst board: [string, number][] = [\n  // add at least two entries\n];\n\n// find and log the top score\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'board\\s*:\\s*\\[string,\\s*number\\]\\[\\]',
          label: 'board is typed as [string, number][]',
          hint: 'The type annotation should be: [string, number][]',
        },
        {
          type: 'sourceMatches',
          pattern: 'Math\\.max',
          label: 'You used Math.max',
          hint: 'Use Math.max(...board.map((e) => e[1])) to find the highest score.',
        },
        {
          type: 'sourceMatches',
          pattern: 'console\\.log',
          label: 'You logged the result',
        },
      ],
      hints: [
        'Add two entries like ["Ada", 120] and ["Sam", 95] to the board array.',
        'Get all scores with board.map((e) => e[1]), then spread into Math.max.',
      ],
      solution:
        'const board: [string, number][] = [\n  ["Ada", 120],\n  ["Sam", 95],\n];\nconst topScore: number = Math.max(...board.map((e) => e[1]));\nconsole.log("Top score:", topScore);',
    },
  },
];

export default lessons;
