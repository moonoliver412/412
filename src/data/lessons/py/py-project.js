// Topic: Mini Projects (py-project) — 5 lessons.

const lessons = [
  {
    id: 'py-project-1',
    blocks: [
      {
        type: 'p',
        text: 'A number guessing game is a classic first project. The program picks a secret number and checks your guess.',
      },
      {
        type: 'p',
        text: 'Here you will simulate one round: define the secret, take a "guess" as a variable, and give feedback.',
      },
      {
        type: 'code',
        text: 'secret = 42\nguess = 30\nif guess == secret:\n    print("You got it!")\nelif guess < secret:\n    print("Too low")\nelse:\n    print("Too high")',
      },
      {
        type: 'tip',
        text: 'Real games would loop until the player guesses right. That is the next step after this lesson.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Set secret to 17. Set guess to 17. Write if/elif/else to print "You got it!" when equal, "Too low" when guess is less, and "Too high" when guess is more.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'you got it',
          label: 'You printed the correct win message',
          hint: 'guess == secret triggers the first branch.',
        },
        {
          type: 'sourceIncludes',
          text: 'elif',
          label: 'You handled all three cases with elif',
          hint: 'Use if / elif / else.',
        },
      ],
      hints: [
        'if guess == secret: print("You got it!")',
        'Add elif guess < secret: and else: branches.',
      ],
      solution:
        'secret = 17\nguess = 17\nif guess == secret:\n    print("You got it!")\nelif guess < secret:\n    print("Too low")\nelse:\n    print("Too high")',
    },
  },
  {
    id: 'py-project-2',
    blocks: [
      {
        type: 'p',
        text: 'A grade calculator takes a list of scores and works out the average.',
      },
      {
        type: 'p',
        text: 'Add all scores together, then divide by the number of scores. Python has a built-in sum() and len() to help.',
      },
      {
        type: 'code',
        text: 'scores = [80, 90, 70]\ntotal = sum(scores)\naverage = total / len(scores)\nprint(average)',
      },
      {
        type: 'tip',
        text: 'sum(list) adds every number in the list. It is cleaner than a manual loop for simple totals.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Create a list grades with values 85, 92, 78, 90, 88. Calculate the average. Print "Average: " followed by the average.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'average:',
          label: 'You printed the Average label',
          hint: 'print("Average: " + str(average)) or use an f-string.',
        },
        {
          type: 'logIncludes',
          text: '86',
          label: 'Your average is correct (86.6)',
          hint: 'sum([85, 92, 78, 90, 88]) / 5 = 86.6',
        },
      ],
      hints: [
        'average = sum(grades) / len(grades)',
        'print(f"Average: {average}") or print("Average: " + str(average))',
      ],
      solution:
        'grades = [85, 92, 78, 90, 88]\naverage = sum(grades) / len(grades)\nprint(f"Average: {average}")',
    },
  },
  {
    id: 'py-project-3',
    blocks: [
      {
        type: 'p',
        text: 'A word counter takes a sentence and counts how many times each word appears.',
      },
      {
        type: 'p',
        text: 'Split the sentence into words, then loop through them. Use a dict to keep a running count.',
      },
      {
        type: 'code',
        text: 'text = "the cat sat on the mat"\nwords = text.split()\ncounts = {}\nfor w in words:\n    if w in counts:\n        counts[w] = counts[w] + 1\n    else:\n        counts[w] = 1\nprint(counts)',
      },
      {
        type: 'tip',
        text: 'if w in counts checks whether the key already exists in the dict.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Use the sentence "go go go stop stop go". Build a word count dict. Print the count for "go" and the count for "stop".',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: '4',
          label: 'You printed the count for go (4)',
          hint: '"go" appears 4 times.',
        },
        {
          type: 'logIncludes',
          text: '2',
          label: 'You printed the count for stop (2)',
          hint: '"stop" appears 2 times.',
        },
      ],
      hints: [
        'Build the counts dict with a for loop and if/else.',
        'print(counts["go"]) then print(counts["stop"])',
      ],
      solution:
        'text = "go go go stop stop go"\nwords = text.split()\ncounts = {}\nfor w in words:\n    if w in counts:\n        counts[w] = counts[w] + 1\n    else:\n        counts[w] = 1\nprint(counts["go"])\nprint(counts["stop"])',
    },
  },
  {
    id: 'py-project-4',
    blocks: [
      {
        type: 'p',
        text: 'A simple cipher shifts each letter forward by a fixed number. It is one of the oldest secret codes.',
      },
      {
        type: 'p',
        text: 'Loop through a message. For each character, find it in the alphabet and shift it. Print the encoded result.',
      },
      {
        type: 'code',
        text: 'alpha = "abcdefghijklmnopqrstuvwxyz"\nmsg = "hello"\nshift = 3\nresult = ""\nfor ch in msg:\n    idx = alpha.find(ch)\n    result = result + alpha[(idx + shift) % 26]\nprint(result)',
      },
      {
        type: 'tip',
        text: '% 26 wraps around — so z shifted by 1 becomes a, not a character off the end.',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Encode the message "cat" using a shift of 1. Use the alphabet string "abcdefghijklmnopqrstuvwxyz". Print the encoded result.',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'dbu',
          label: 'You correctly encoded "cat" to "dbu"',
          hint: 'c+1=d, a+1=b, t+1=u',
        },
        {
          type: 'sourceIncludes',
          text: 'for ',
          label: 'You used a loop to encode each character',
          hint: 'for ch in msg:',
        },
      ],
      hints: [
        'alpha = "abcdefghijklmnopqrstuvwxyz", msg = "cat", shift = 1',
        'idx = alpha.find(ch), result += alpha[(idx + shift) % 26]',
      ],
      solution:
        'alpha = "abcdefghijklmnopqrstuvwxyz"\nmsg = "cat"\nshift = 1\nresult = ""\nfor ch in msg:\n    idx = alpha.find(ch)\n    result = result + alpha[(idx + shift) % 26]\nprint(result)',
    },
  },
  {
    id: 'py-project-5',
    blocks: [
      {
        type: 'p',
        text: 'Put everything together: a leaderboard program that stores players in a list of dicts, sorts by score, and prints the top 3.',
      },
      {
        type: 'p',
        text: 'sorted() returns a new sorted list. Pass key=lambda p: p["score"] to sort by the score field. Pass reverse=True for highest first.',
      },
      {
        type: 'code',
        text: 'players = [\n    {"name": "Ali", "score": 88},\n    {"name": "Sam", "score": 95},\n    {"name": "Jay", "score": 72},\n]\ntop = sorted(players, key=lambda p: p["score"], reverse=True)\nfor p in top:\n    print(p["name"] + ": " + str(p["score"]))',
      },
      {
        type: 'tip',
        text: 'A lambda is a tiny one-line function. lambda p: p["score"] means "given player p, return their score".',
      },
    ],
    exercise: {
      kind: 'python',
      instructions:
        'Create a players list with three dicts: {"name":"Zoe","score":91}, {"name":"Max","score":85}, {"name":"Nia","score":98}. Sort by score descending. Print each player as "Name: score" and label the first one "1st Place: Nia - 98".',
      starter: '# your code here\n',
      checks: [
        {
          type: 'logIncludes',
          text: 'nia',
          label: 'Nia appears in your output',
          hint: 'Nia has the highest score (98) and should print first.',
        },
        {
          type: 'sourceIncludes',
          text: 'sorted(',
          label: 'You used sorted() to rank the players',
          hint: 'sorted(players, key=lambda p: p["score"], reverse=True)',
        },
      ],
      hints: [
        'top = sorted(players, key=lambda p: p["score"], reverse=True)',
        "Loop with index: for i, p in enumerate(top): print(f\"{i+1}. {p['name']}: {p['score']}\")",
      ],
      solution:
        "players = [{\"name\": \"Zoe\", \"score\": 91}, {\"name\": \"Max\", \"score\": 85}, {\"name\": \"Nia\", \"score\": 98}]\ntop = sorted(players, key=lambda p: p[\"score\"], reverse=True)\nfor i, p in enumerate(top):\n    print(f\"{i + 1}. {p['name']}: {p['score']}\")",
    },
  },
];

export default lessons;
