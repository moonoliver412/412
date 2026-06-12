// Topic: Strings (py-strings) — 5 lessons.

const lessons = [
  {
    id: 'py-strings-1',
    blocks: [
      {
        type: 'p',
        text: 'Strings have built-in methods that transform them. .upper() makes everything uppercase. .lower() makes everything lowercase.',
      },
      {
        type: 'p',
        text: '.strip() removes extra spaces from both ends. .replace(old, new) swaps one part for another.',
      },
      {
        type: 'code',
        text: 'msg = "  hello world  "\nprint(msg.strip())\nprint(msg.strip().upper())',
      },
      {
        type: 'tip',
        text: 'Methods can be chained: msg.strip().upper() runs strip first, then upper on the result.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Store " python is cool " in a variable s. Print s stripped of spaces. Then print it stripped and uppercased.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'python is cool',
          label: 'You printed the stripped string',
          hint: 's.strip() removes the leading and trailing spaces.',
        },
        {
          type: 'logIncludes',
          text: 'PYTHON IS COOL',
          label: 'You printed the uppercase version',
          hint: 's.strip().upper()',
        },
      ],
      hints: [
        's = " python is cool " then print(s.strip())',
        'print(s.strip().upper()) chains two methods.',
      ],
      solution:
        's = " python is cool "\nprint(s.strip())\nprint(s.strip().upper())',
    },
  },
  {
    id: 'py-strings-2',
    blocks: [
      {
        type: 'p',
        text: 'An f-string lets you put variables directly inside a string. Start the string with f and wrap variables in curly braces.',
      },
      {
        type: 'p',
        text: 'F-strings are usually cleaner than joining strings with +.',
      },
      {
        type: 'code',
        text: 'name = "Jordan"\nage = 16\nprint(f"{name} is {age} years old.")',
      },
      {
        type: 'tip',
        text: 'You can put any expression inside the braces: f"Double: {n * 2}".',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Store "Earth" in planet and 8 in moons. Print an f-string: "Earth has 8 moons." using both variables.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'f"',
          label: 'You used an f-string',
          hint: 'Start the string with f before the opening quote.',
        },
        {
          type: 'logIncludes',
          text: 'earth has 8 moons',
          label: 'You printed the correct sentence',
          hint: 'f"{planet} has {moons} moons."',
        },
      ],
      hints: [
        'planet = "Earth" and moons = 8',
        'print(f"{planet} has {moons} moons.")',
      ],
      solution: 'planet = "Earth"\nmoons = 8\nprint(f"{planet} has {moons} moons.")',
    },
  },
  {
    id: 'py-strings-3',
    blocks: [
      {
        type: 'p',
        text: '.split() breaks a string into a list using a separator. .join() does the opposite — it merges a list into one string.',
      },
      {
        type: 'p',
        text: 'These two methods are opposites and work great as a pair.',
      },
      {
        type: 'code',
        text: 'sentence = "the cat sat"\nwords = sentence.split()\nprint(words)\nprint("-".join(words))',
      },
      {
        type: 'tip',
        text: '.split() with no argument splits on any whitespace. Pass a character to split on something else: "a,b".split(",").',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Start with csv = "red,green,blue". Split it on "," to get a list. Then join that list with " | " and print the result.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: '.split(',
          label: 'You used .split()',
          hint: 'csv.split(",") splits on the comma.',
        },
        {
          type: 'logIncludes',
          text: 'red | green | blue',
          label: 'You printed the joined string',
          hint: '" | ".join(colors)',
        },
      ],
      hints: [
        'colors = csv.split(",")',
        'print(" | ".join(colors))',
      ],
      solution:
        'csv = "red,green,blue"\ncolors = csv.split(",")\nprint(" | ".join(colors))',
    },
  },
  {
    id: 'py-strings-4',
    blocks: [
      {
        type: 'p',
        text: 'A string is a sequence of characters. You can loop through it just like a list.',
      },
      {
        type: 'p',
        text: 'Slicing lets you grab a section: word[1:4] gives characters at index 1, 2, and 3.',
      },
      {
        type: 'code',
        text: 'word = "sprout"\nfor ch in word:\n    print(ch)\nprint(word[0:3])',
      },
      {
        type: 'tip',
        text: 'word[:3] is the same as word[0:3]. You can omit the start or end of a slice.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Store "champion" in word. Loop through its characters and print each one. Then print just the first 4 characters using a slice.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'c',
          label: 'Your loop printed individual characters',
          hint: 'for ch in word: print(ch)',
        },
        {
          type: 'logIncludes',
          text: 'cham',
          label: 'You printed the first 4 characters',
          hint: 'print(word[:4]) gives "cham".',
        },
      ],
      hints: [
        'for ch in word: print(ch)',
        'print(word[:4]) slices the first 4 characters.',
      ],
      solution: 'word = "champion"\nfor ch in word:\n    print(ch)\nprint(word[:4])',
    },
  },
  {
    id: 'py-strings-5',
    blocks: [
      {
        type: 'p',
        text: 'You can count letters, build new strings, and check if a word is a palindrome — the same forwards and backwards.',
      },
      {
        type: 'p',
        text: 'word[::-1] reverses a string. Compare it to the original to check for a palindrome.',
      },
      {
        type: 'code',
        text: 'def is_palindrome(w):\n    return w == w[::-1]\n\nprint(is_palindrome("racecar"))\nprint(is_palindrome("hello"))',
      },
      {
        type: 'tip',
        text: 'Use .lower() before comparing so "Racecar" and "racecar" both count as palindromes.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Write a function called check_palindrome that takes word, lowercases it, and prints "yes" if it is a palindrome or "no" if not. Test it with "Level" and "code".',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'yes',
          label: 'check_palindrome("Level") printed yes',
          hint: '"level" reversed is "level" — that is a palindrome.',
        },
        {
          type: 'logIncludes',
          text: 'no',
          label: 'check_palindrome("code") printed no',
          hint: '"code" reversed is "edoc" — not a palindrome.',
        },
      ],
      hints: [
        'def check_palindrome(word): w = word.lower()',
        'if w == w[::-1]: print("yes") else: print("no")',
      ],
      solution:
        'def check_palindrome(word):\n    w = word.lower()\n    if w == w[::-1]:\n        print("yes")\n    else:\n        print("no")\n\ncheck_palindrome("Level")\ncheck_palindrome("code")',
    },
  },
];

export default lessons;
