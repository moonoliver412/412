// Topic: Variables & Types (py-basics) — 5 lessons.

const lessons = [
  {
    id: 'py-basics-1',
    blocks: [
      {
        type: 'p',
        text: 'Python is famous for reading almost like plain English, which is why it is many people’s first language. It runs everywhere — websites, games, robots, and the science labs behind the news.',
      },
      {
        type: 'p',
        text: 'You show something on screen with print, and you store a value in a variable just by naming it. No type labels, no semicolons.',
      },
      {
        type: 'code',
        text: 'name = "Ada"\nprint("Hello " + name)',
      },
      {
        type: 'tip',
        text: 'Python cares about spacing. Keep your lines starting at the left edge until a lesson tells you to indent.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Make a variable called name set to any name, then print a greeting that includes the word Hello.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'print(',
          label: 'You used print()',
          hint: 'Show text with print("...").',
        },
        {
          type: 'logIncludes',
          text: 'hello',
          label: 'You printed a greeting with Hello',
        },
      ],
      hints: [
        'First store the name: name = "Ada"',
        'Then print it: print("Hello " + name)',
      ],
      solution: 'name = "Ada"\nprint("Hello " + name)',
    },
  },
];

export default lessons;
