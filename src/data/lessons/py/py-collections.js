// Topic: Collections (py-collections) — 5 lessons.

const lessons = [
  {
    id: 'py-collections-1',
    blocks: [
      {
        type: 'p',
        text: 'A list holds many values in one variable. You write it with square brackets and separate items with commas.',
      },
      {
        type: 'p',
        text: 'Each item has an index — a position number starting at 0. Use list[0] to get the first item.',
      },
      {
        type: 'code',
        text: 'colors = ["red", "green", "blue"]\nprint(colors[0])\nprint(colors[2])\nprint(len(colors))',
      },
      {
        type: 'tip',
        text: 'Negative indexes count from the end. colors[-1] is the last item.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Create a list called fruits with "apple", "banana", and "mango". Print the first item. Print the last item.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'fruits',
          label: 'You created a list called fruits',
          hint: 'fruits = ["apple", "banana", "mango"]',
        },
        {
          type: 'logIncludes',
          text: 'apple',
          label: 'You printed the first item',
          hint: 'print(fruits[0]) gives "apple".',
        },
      ],
      hints: [
        'fruits = ["apple", "banana", "mango"]',
        'print(fruits[0]) for first, print(fruits[-1]) for last.',
      ],
      solution:
        'fruits = ["apple", "banana", "mango"]\nprint(fruits[0])\nprint(fruits[-1])',
    },
  },
  {
    id: 'py-collections-2',
    blocks: [
      {
        type: 'p',
        text: 'Lists have built-in methods to change them. append() adds an item to the end. pop() removes the last item.',
      },
      {
        type: 'p',
        text: 'You can also change an item directly by assigning to its index.',
      },
      {
        type: 'code',
        text: 'items = ["pen", "ruler"]\nitems.append("eraser")\nprint(items)\nitems.pop()\nprint(items)',
      },
      {
        type: 'tip',
        text: 'pop() also returns the removed item, so you can store it: removed = items.pop().',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Start with a list called bag containing "torch" and "map". Append "water". Then change index 1 to "compass". Print the final list.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'append',
          label: 'You used append()',
          hint: 'bag.append("water")',
        },
        {
          type: 'logIncludes',
          text: 'compass',
          label: 'Your list contains compass',
          hint: 'bag[1] = "compass" replaces "map".',
        },
      ],
      hints: [
        'bag = ["torch", "map"] then bag.append("water")',
        'bag[1] = "compass" then print(bag)',
      ],
      solution:
        'bag = ["torch", "map"]\nbag.append("water")\nbag[1] = "compass"\nprint(bag)',
    },
  },
  {
    id: 'py-collections-3',
    blocks: [
      {
        type: 'p',
        text: 'A for loop can walk through every item in a list. You do not need an index — Python hands you each value in turn.',
      },
      {
        type: 'p',
        text: 'This is the most common way to process a whole list.',
      },
      {
        type: 'code',
        text: 'scores = [88, 95, 72]\nfor s in scores:\n    print(s)',
      },
      {
        type: 'tip',
        text: 'Use a meaningful variable name in the loop: for fruit in fruits reads better than for x in fruits.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Create a list called temps with values 22, 35, 18, 29. Loop through it and print only the values greater than 20.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: '35',
          label: 'You printed 35',
          hint: '35 is greater than 20.',
        },
        {
          type: 'sourceIncludes',
          text: 'for ',
          label: 'You used a for loop',
          hint: 'for t in temps:',
        },
      ],
      hints: [
        'temps = [22, 35, 18, 29] then for t in temps:',
        'if t > 20: print(t) — indented inside the loop.',
      ],
      solution:
        'temps = [22, 35, 18, 29]\nfor t in temps:\n    if t > 20:\n        print(t)',
    },
  },
  {
    id: 'py-collections-4',
    blocks: [
      {
        type: 'p',
        text: 'A dictionary stores key-value pairs. A key is a label, and the value is the data attached to it.',
      },
      {
        type: 'p',
        text: 'Use curly braces and colons. Look up a value by its key using square brackets.',
      },
      {
        type: 'code',
        text: 'player = {"name": "Zara", "score": 150}\nprint(player["name"])\nplayer["score"] = 200\nprint(player["score"])',
      },
      {
        type: 'tip',
        text: 'Adding a new key is the same as updating one: player["level"] = 3 creates it if it does not exist.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Create a dict called book with keys "title" set to "Dune" and "pages" set to 412. Print the title. Then update pages to 500 and print it.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'dune',
          label: 'You printed the title',
          hint: 'print(book["title"])',
        },
        {
          type: 'logIncludes',
          text: '500',
          label: 'You printed the updated page count',
          hint: 'book["pages"] = 500 then print(book["pages"])',
        },
      ],
      hints: [
        'book = {"title": "Dune", "pages": 412}',
        'book["pages"] = 500 then print(book["pages"])',
      ],
      solution:
        'book = {"title": "Dune", "pages": 412}\nprint(book["title"])\nbook["pages"] = 500\nprint(book["pages"])',
    },
  },
  {
    id: 'py-collections-5',
    blocks: [
      {
        type: 'p',
        text: 'You can loop through a dictionary using .items(). Each pass gives you both the key and the value.',
      },
      {
        type: 'p',
        text: 'A list of dicts is a common pattern for storing many similar records — like a leaderboard or a contact list.',
      },
      {
        type: 'code',
        text: 'person = {"name": "Leo", "age": 17}\nfor key, value in person.items():\n    print(key + ": " + str(value))',
      },
      {
        type: 'tip',
        text: 'str(value) converts the value to text so you can join it with a string.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Create a list called crew with two dicts: {"name": "Ana", "role": "pilot"} and {"name": "Bo", "role": "engineer"}. Loop through crew and print each person\'s name and role on one line like "Ana - pilot".',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'ana - pilot',
          label: 'You printed Ana\'s entry',
          hint: 'print(member["name"] + " - " + member["role"])',
        },
        {
          type: 'logIncludes',
          text: 'bo - engineer',
          label: 'You printed Bo\'s entry',
          hint: 'Loop: for member in crew:',
        },
      ],
      hints: [
        'crew = [{"name": "Ana", "role": "pilot"}, {"name": "Bo", "role": "engineer"}]',
        'for member in crew: print(member["name"] + " - " + member["role"])',
      ],
      solution:
        'crew = [{"name": "Ana", "role": "pilot"}, {"name": "Bo", "role": "engineer"}]\nfor member in crew:\n    print(member["name"] + " - " + member["role"])',
    },
  },
];

export default lessons;
