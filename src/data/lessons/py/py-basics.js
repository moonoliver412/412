// Topic: Variables & Types (py-basics) — 5 lessons.

const lessons = [
  {
    id: 'py-basics-1',
    blocks: [
      {
        type: 'p',
        text: 'Python is famous for reading almost like plain English, which is why it is many people\'s first language. It runs everywhere — websites, games, robots, and the science labs behind the news.',
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
  {
    id: 'py-basics-2',
    blocks: [
      {
        type: 'p',
        text: 'Python works with numbers straight away. Whole numbers are called integers. Decimals are called floats.',
      },
      {
        type: 'p',
        text: 'You can add, subtract, multiply, and divide. Use ** for powers and % to get the remainder of a division.',
      },
      {
        type: 'code',
        text: 'score = 42\nbonus = 8\nprint(score + bonus)\nprint(score ** 2)',
      },
      {
        type: 'tip',
        text: 'print() can take a number directly. You do not need to wrap it in quotes.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Store the number 15 in a variable called base. Store 3 in a variable called multiplier. Print their product (base times multiplier).',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'base',
          label: 'You created a variable called base',
        },
        {
          type: 'logIncludes',
          text: '45',
          label: 'You printed the correct product (45)',
          hint: '15 times 3 equals 45.',
        },
      ],
      hints: [
        'base = 15 and multiplier = 3',
        'print(base * multiplier) will show the answer.',
      ],
      solution: 'base = 15\nmultiplier = 3\nprint(base * multiplier)',
    },
  },
  {
    id: 'py-basics-3',
    blocks: [
      {
        type: 'p',
        text: 'A string is any text you put in quotes. Python is fine with single quotes or double quotes.',
      },
      {
        type: 'p',
        text: 'You can join strings with +. You can repeat a string with *. len() tells you how many characters are inside.',
      },
      {
        type: 'code',
        text: 'word = "spark"\nprint(word * 3)\nprint(len(word))',
      },
      {
        type: 'tip',
        text: 'You cannot add a string and a number directly. Wrap the number: str(42).',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Store "code" in a variable called word. Print word repeated 4 times. Then print the length of word.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'codecodecodecode',
          label: 'You printed word repeated 4 times',
          hint: 'Use word * 4 inside print().',
        },
        {
          type: 'logIncludes',
          text: '4',
          label: 'You printed the length of the word',
          hint: 'len("code") is 4.',
        },
      ],
      hints: [
        'word = "code" then print(word * 4)',
        'print(len(word)) prints the number of characters.',
      ],
      solution: 'word = "code"\nprint(word * 4)\nprint(len(word))',
    },
  },
  {
    id: 'py-basics-4',
    blocks: [
      {
        type: 'p',
        text: 'A boolean is a value that is either True or False. That is it — only two options.',
      },
      {
        type: 'p',
        text: 'You use booleans whenever you compare things. The comparison gives you True or False automatically.',
      },
      {
        type: 'code',
        text: 'age = 16\ncan_drive = age >= 16\nprint(can_drive)\nprint(10 == 10)\nprint(5 > 9)',
      },
      {
        type: 'tip',
        text: 'One = sets a variable. Two == checks if two things are equal.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Store 20 in a variable called score. Print whether score is greater than 15. Then print whether score equals 20.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'true',
          label: 'You printed True for score > 15',
          hint: 'print(score > 15) should print True.',
        },
        {
          type: 'sourceIncludes',
          text: '==',
          label: 'You used == to check equality',
          hint: 'print(score == 20) checks if score equals 20.',
        },
      ],
      hints: [
        'score = 20 then print(score > 15)',
        'print(score == 20) uses == to test equality.',
      ],
      solution: 'score = 20\nprint(score > 15)\nprint(score == 20)',
    },
  },
  {
    id: 'py-basics-5',
    blocks: [
      {
        type: 'p',
        text: 'You can mix variables of different types in one program. Variables can also be reassigned — just write the name again with a new value.',
      },
      {
        type: 'p',
        text: 'Use str() to turn a number into text so you can join it with a string.',
      },
      {
        type: 'code',
        text: 'lives = 3\nprint("Lives: " + str(lives))\nlives = lives - 1\nprint("Lives: " + str(lives))',
      },
      {
        type: 'tip',
        text: 'Reassigning a variable does not create a second one. The old value is replaced.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Create a variable points set to 100. Print "Points: 100". Then add 50 to points and print "Points: 150".',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'points: 100',
          label: 'You printed Points: 100',
          hint: 'print("Points: " + str(points)) where points is 100.',
        },
        {
          type: 'logIncludes',
          text: 'points: 150',
          label: 'You printed Points: 150 after adding 50',
          hint: 'points = points + 50 then print again.',
        },
      ],
      hints: [
        'points = 100 then print("Points: " + str(points))',
        'points = points + 50 then print("Points: " + str(points))',
      ],
      solution:
        'points = 100\nprint("Points: " + str(points))\npoints = points + 50\nprint("Points: " + str(points))',
    },
  },
];

export default lessons;
