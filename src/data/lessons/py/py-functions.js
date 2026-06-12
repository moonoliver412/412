// Topic: Functions (py-functions) — 5 lessons.

const lessons = [
  {
    id: 'py-functions-1',
    blocks: [
      {
        type: 'p',
        text: 'A function is a named block of code you can run whenever you want. You define it once and call it many times.',
      },
      {
        type: 'p',
        text: 'Use def to define a function. The code inside must be indented. Call it by writing its name with ().',
      },
      {
        type: 'code',
        text: 'def greet():\n    print("Hey there!")\n\ngreet()\ngreet()',
      },
      {
        type: 'tip',
        text: 'Nothing runs when you define a function. It only runs when you call it.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Define a function called launch that prints "3... 2... 1... Go!". Then call it twice.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'def launch',
          label: 'You defined a function called launch',
          hint: 'def launch():',
        },
        {
          type: 'logIncludes',
          text: 'go',
          label: 'launch() printed the countdown',
          hint: 'Print the message inside the function then call launch().',
        },
      ],
      hints: [
        'def launch(): then indent the print line.',
        'Call the function: launch() — do this twice after the definition.',
      ],
      solution:
        'def launch():\n    print("3... 2... 1... Go!")\n\nlaunch()\nlaunch()',
    },
  },
  {
    id: 'py-functions-2',
    blocks: [
      {
        type: 'p',
        text: 'Parameters are variables that receive values when you call a function. You list them in the parentheses after the name.',
      },
      {
        type: 'p',
        text: 'Each call can pass different values, making the function reusable for many situations.',
      },
      {
        type: 'code',
        text: 'def greet(name):\n    print("Hello, " + name + "!")\n\ngreet("Maya")\ngreet("Dev")',
      },
      {
        type: 'tip',
        text: 'The parameter name only exists inside the function. It is created fresh each call.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Define a function called square that takes one parameter n and prints n times n. Call it with 4 and then with 7.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'def square',
          label: 'You defined a function called square',
          hint: 'def square(n):',
        },
        {
          type: 'logIncludes',
          text: '49',
          label: 'square(7) printed 49',
          hint: 'print(n * n) inside the function.',
        },
      ],
      hints: [
        'def square(n): then print(n * n) indented inside.',
        'Call: square(4) and square(7).',
      ],
      solution:
        'def square(n):\n    print(n * n)\n\nsquare(4)\nsquare(7)',
    },
  },
  {
    id: 'py-functions-3',
    blocks: [
      {
        type: 'p',
        text: 'return sends a value back from a function. The calling code can store or use that value.',
      },
      {
        type: 'p',
        text: 'A function that returns a value is like a calculator — you give it inputs and get an answer back.',
      },
      {
        type: 'code',
        text: 'def add(a, b):\n    return a + b\n\nresult = add(3, 4)\nprint(result)',
      },
      {
        type: 'tip',
        text: 'return stops the function immediately. Code after a return never runs.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Write a function called celsius_to_f that takes c and returns c * 9 / 5 + 32. Call it with 100 and print the result.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'return',
          label: 'Your function uses return',
          hint: 'return c * 9 / 5 + 32',
        },
        {
          type: 'logIncludes',
          text: '212',
          label: 'celsius_to_f(100) returned 212',
          hint: '100 Celsius equals 212 Fahrenheit.',
        },
      ],
      hints: [
        'def celsius_to_f(c): then return c * 9 / 5 + 32',
        'print(celsius_to_f(100)) should output 212.0',
      ],
      solution:
        'def celsius_to_f(c):\n    return c * 9 / 5 + 32\n\nprint(celsius_to_f(100))',
    },
  },
  {
    id: 'py-functions-4',
    blocks: [
      {
        type: 'p',
        text: 'A default parameter has a value that is used when the caller does not pass one. You set it with = in the definition.',
      },
      {
        type: 'p',
        text: 'Default parameters make functions flexible. Callers can use the default or override it.',
      },
      {
        type: 'code',
        text: 'def power(base, exp=2):\n    return base ** exp\n\nprint(power(3))\nprint(power(3, 3))',
      },
      {
        type: 'tip',
        text: 'Required parameters must come before default parameters in the definition.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Write a function called repeat_word that takes word and count=3 and prints word count times on one line (use word * count). Call it with just "hi", then call it with "go" and 5.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'hihihi',
          label: 'repeat_word("hi") printed "hi" three times',
          hint: 'Default count is 3, so "hi" * 3 = "hihihi".',
        },
        {
          type: 'logIncludes',
          text: 'gogogogogo',
          label: 'repeat_word("go", 5) printed "go" five times',
          hint: '"go" * 5 = "gogogogogo".',
        },
      ],
      hints: [
        'def repeat_word(word, count=3): then print(word * count)',
        'repeat_word("hi") uses the default. repeat_word("go", 5) overrides it.',
      ],
      solution:
        'def repeat_word(word, count=3):\n    print(word * count)\n\nrepeat_word("hi")\nrepeat_word("go", 5)',
    },
  },
  {
    id: 'py-functions-5',
    blocks: [
      {
        type: 'p',
        text: 'Variables made inside a function stay inside. Code outside the function cannot see them. This is called scope.',
      },
      {
        type: 'p',
        text: 'Functions can call other functions. Breaking a big problem into small functions makes code easier to read and fix.',
      },
      {
        type: 'code',
        text: 'def double(n):\n    return n * 2\n\ndef quad(n):\n    return double(double(n))\n\nprint(quad(3))',
      },
      {
        type: 'tip',
        text: 'Keep each function focused on one job. If a function does too much, split it.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Write a function called shout that takes text and returns text.upper() + "!!!". Write a function called announce that takes text, calls shout on it, and prints the result. Call announce with "hello".',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'def shout',
          label: 'You defined shout',
          hint: 'def shout(text): return text.upper() + "!!!"',
        },
        {
          type: 'logIncludes',
          text: 'hello!!!',
          label: 'announce printed HELLO!!!',
          hint: '"hello".upper() becomes "HELLO" then add "!!!".',
        },
      ],
      hints: [
        'def shout(text): return text.upper() + "!!!"',
        'def announce(text): print(shout(text)) then call announce("hello")',
      ],
      solution:
        'def shout(text):\n    return text.upper() + "!!!"\n\ndef announce(text):\n    print(shout(text))\n\nannounce("hello")',
    },
  },
];

export default lessons;
