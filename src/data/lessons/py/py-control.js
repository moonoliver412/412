// Topic: Control Flow (py-control) — 5 lessons.

const lessons = [
  {
    id: 'py-control-1',
    blocks: [
      {
        type: 'p',
        text: 'An if statement runs code only when a condition is True. If the condition is False, Python skips that block.',
      },
      {
        type: 'p',
        text: 'The block under if must be indented — use 4 spaces. That indentation is how Python knows which lines belong together.',
      },
      {
        type: 'code',
        text: 'age = 15\nif age >= 13:\n    print("You are a teen.")',
      },
      {
        type: 'tip',
        text: 'Do not forget the colon at the end of the if line. Python will throw an error without it.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Create a variable called temperature set to 30. If temperature is greater than 25, print "It is hot."',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'if ',
          label: 'You used an if statement',
          hint: 'Start with: if temperature > 25:',
        },
        {
          type: 'logIncludes',
          text: 'it is hot',
          label: 'You printed the hot message',
          hint: 'Indent the print line 4 spaces under the if.',
        },
      ],
      hints: [
        'temperature = 30 then if temperature > 25:',
        'Indent 4 spaces: print("It is hot.")',
      ],
      solution: 'temperature = 30\nif temperature > 25:\n    print("It is hot.")',
    },
  },
  {
    id: 'py-control-2',
    blocks: [
      {
        type: 'p',
        text: 'else runs when the if condition is False. elif lets you check a second condition before falling through to else.',
      },
      {
        type: 'p',
        text: 'Python checks conditions from top to bottom. It stops at the first one that is True.',
      },
      {
        type: 'code',
        text: 'score = 72\nif score >= 90:\n    print("A grade")\nelif score >= 70:\n    print("B grade")\nelse:\n    print("Keep trying")',
      },
      {
        type: 'tip',
        text: 'You can have many elif blocks but only one else. else is always last.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Set speed to 80. If speed > 100 print "Too fast". If speed is between 60 and 100 (inclusive) print "Good speed". Otherwise print "Too slow".',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'elif',
          label: 'You used elif',
          hint: 'Add elif speed >= 60: after the first if block.',
        },
        {
          type: 'logIncludes',
          text: 'good speed',
          label: 'You printed the correct message for speed 80',
          hint: '80 is between 60 and 100 so "Good speed" should print.',
        },
      ],
      hints: [
        'speed = 80 then if speed > 100: / elif speed >= 60: / else:',
        'speed 80 falls in the elif range so "Good speed" prints.',
      ],
      solution:
        'speed = 80\nif speed > 100:\n    print("Too fast")\nelif speed >= 60:\n    print("Good speed")\nelse:\n    print("Too slow")',
    },
  },
  {
    id: 'py-control-3',
    blocks: [
      {
        type: 'p',
        text: 'A for loop repeats code for every item in a sequence. range(n) gives you the numbers 0 up to n-1.',
      },
      {
        type: 'p',
        text: 'The variable after for (usually i or item) holds the current value on each pass.',
      },
      {
        type: 'code',
        text: 'for i in range(5):\n    print(i)',
      },
      {
        type: 'tip',
        text: 'range(1, 6) gives 1, 2, 3, 4, 5. The second number is the stop — not included.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Use a for loop with range to print the numbers 1 through 5, one per line.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'for ',
          label: 'You used a for loop',
          hint: 'for i in range(1, 6):',
        },
        {
          type: 'logIncludes',
          text: '5',
          label: 'Your loop reached 5',
          hint: 'range(1, 6) includes 1, 2, 3, 4, 5.',
        },
      ],
      hints: [
        'for i in range(1, 6): starts at 1 and stops before 6.',
        'Indent print(i) under the for loop.',
      ],
      solution: 'for i in range(1, 6):\n    print(i)',
    },
  },
  {
    id: 'py-control-4',
    blocks: [
      {
        type: 'p',
        text: 'A while loop keeps running as long as its condition stays True. When the condition becomes False, the loop stops.',
      },
      {
        type: 'p',
        text: 'You need to change something inside the loop. Otherwise the condition never becomes False and the loop runs forever.',
      },
      {
        type: 'code',
        text: 'count = 0\nwhile count < 5:\n    print(count)\n    count = count + 1',
      },
      {
        type: 'tip',
        text: 'count += 1 is a short way to write count = count + 1.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Start a variable n at 10. Use a while loop to print n and subtract 3 each time, stopping before n goes below 1.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'while ',
          label: 'You used a while loop',
          hint: 'while n >= 1:',
        },
        {
          type: 'logIncludes',
          text: '10',
          label: 'You printed 10 on the first pass',
          hint: 'Print n before subtracting.',
        },
      ],
      hints: [
        'n = 10 then while n >= 1:',
        'Inside the loop: print(n) then n = n - 3.',
      ],
      solution: 'n = 10\nwhile n >= 1:\n    print(n)\n    n = n - 3',
    },
  },
  {
    id: 'py-control-5',
    blocks: [
      {
        type: 'p',
        text: 'You can combine everything: loops that contain if statements, or conditions that use and and or.',
      },
      {
        type: 'p',
        text: 'and means both sides must be True. or means at least one side must be True. not flips True to False.',
      },
      {
        type: 'code',
        text: 'for i in range(1, 11):\n    if i % 2 == 0 and i > 5:\n        print(str(i) + " is even and big")',
      },
      {
        type: 'tip',
        text: 'i % 2 == 0 is a classic way to check if a number is even. The % gives the remainder.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Loop through numbers 1 to 10. Print only the numbers that are odd and less than 8.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: '7',
          label: 'You printed 7 (odd and less than 8)',
          hint: 'Check i % 2 != 0 and i < 8.',
        },
        {
          type: 'sourceIncludes',
          text: 'and',
          label: 'You used and to combine conditions',
          hint: 'if i % 2 != 0 and i < 8:',
        },
      ],
      hints: [
        'for i in range(1, 11): then if i % 2 != 0 and i < 8:',
        'Odd numbers have a remainder of 1 when divided by 2.',
      ],
      solution:
        'for i in range(1, 11):\n    if i % 2 != 0 and i < 8:\n        print(i)',
    },
  },
];

export default lessons;
