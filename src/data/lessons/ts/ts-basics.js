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
];

export default lessons;
