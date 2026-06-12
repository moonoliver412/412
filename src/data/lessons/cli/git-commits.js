// Topic: Commits and History (git-commits) — 5 lessons.

const lessons = [
  {
    id: 'git-commits-1',
    blocks: [
      {
        type: 'p',
        text: 'A commit is a saved snapshot of your staged files. It is the heart of Git.',
      },
      {
        type: 'p',
        text: 'git commit -m "message" saves everything that is staged. The message describes what you did.',
      },
      {
        type: 'code',
        text: 'git init\ntouch app.js\ngit add app.js\ngit commit -m "add app.js"',
      },
      {
        type: 'tip',
        text: 'Write commit messages in plain English. "add login page" is better than "stuff" or "asdf".',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, create hello.txt, stage it, and commit it with the message "first commit".',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 1,
          label: 'At least one commit exists',
          hint: 'Run git commit -m "first commit" after staging.',
        },
        {
          type: 'sourceIncludes',
          text: 'git commit',
          label: 'You used git commit',
          hint: 'Type git commit -m "first commit".',
        },
      ],
      hints: [
        'git init',
        'touch hello.txt',
        'git add hello.txt',
      ],
      solution: 'git init\ntouch hello.txt\ngit add hello.txt\ngit commit -m "first commit"',
    },
  },
  {
    id: 'git-commits-2',
    blocks: [
      {
        type: 'p',
        text: 'git log shows the history of all commits. Each entry has an ID, the author, the date, and your message.',
      },
      {
        type: 'p',
        text: 'The most recent commit is at the top. Scroll down to see older ones.',
      },
      {
        type: 'code',
        text: 'git log',
      },
      {
        type: 'tip',
        text: 'The long string of letters and numbers is the commit ID (called a hash). No two commits ever share one.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, commit any file, then run git log to see your commit.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 1,
          label: 'At least one commit exists',
          hint: 'git add and git commit before running git log.',
        },
        {
          type: 'sourceIncludes',
          text: 'git log',
          label: 'You ran git log',
          hint: 'Type git log at the end.',
        },
      ],
      hints: [
        'git init',
        'touch file.txt && git add . && git commit -m "init"',
        'git log',
      ],
      solution: 'git init\ntouch file.txt\ngit add .\ngit commit -m "init"\ngit log',
    },
  },
  {
    id: 'git-commits-3',
    blocks: [
      {
        type: 'p',
        text: 'Good commit messages make your history useful. A clear message tells future-you exactly what changed.',
      },
      {
        type: 'p',
        text: 'Use short, active phrases. Start with a verb: "add", "fix", "update", "remove".',
      },
      {
        type: 'code',
        text: 'git commit -m "add navigation bar"\ngit commit -m "fix typo in title"\ngit commit -m "remove unused styles"',
      },
      {
        type: 'tip',
        text: 'Aim for under 50 characters. If you need more, the change might be too big for one commit.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, create nav.html, stage it, and commit it with a message that starts with "add".',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 1,
          label: 'A commit was made',
          hint: 'Run git commit -m "add nav.html".',
        },
        {
          type: 'fileExists',
          path: '/home/coder/nav.html',
          label: 'nav.html exists',
          hint: 'touch nav.html',
        },
      ],
      hints: [
        'git init',
        'touch nav.html',
        'git add nav.html',
      ],
      solution: 'git init\ntouch nav.html\ngit add nav.html\ngit commit -m "add nav.html"',
    },
  },
  {
    id: 'git-commits-4',
    blocks: [
      {
        type: 'p',
        text: 'You can make many commits in a row. Each one adds to the history.',
      },
      {
        type: 'p',
        text: 'A project usually has hundreds or thousands of commits over its life.',
      },
      {
        type: 'code',
        text: 'touch index.html\ngit add .\ngit commit -m "add index page"\ntouch about.html\ngit add .\ngit commit -m "add about page"',
      },
      {
        type: 'tip',
        text: 'git log will show both commits. The newest is always on top.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo. Make two commits: one for header.html and one for footer.html.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 2,
          label: 'At least two commits exist',
          hint: 'Make sure you commit twice, once per file.',
        },
        {
          type: 'fileExists',
          path: '/home/coder/footer.html',
          label: 'footer.html exists',
          hint: 'touch footer.html',
        },
      ],
      hints: [
        'git init',
        'touch header.html && git add . && git commit -m "add header"',
        'touch footer.html && git add . && git commit -m "add footer"',
      ],
      solution:
        'git init\ntouch header.html\ngit add .\ngit commit -m "add header"\ntouch footer.html\ngit add .\ngit commit -m "add footer"',
    },
  },
  {
    id: 'git-commits-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone time. The full init-add-commit-log cycle is the daily rhythm of every developer.',
      },
      {
        type: 'p',
        text: 'Three commits, three clear messages, then read the history back with git log.',
      },
      {
        type: 'code',
        text: 'git init\ntouch setup.js\ngit add .\ngit commit -m "add setup"\ntouch config.js\ngit add .\ngit commit -m "add config"\ntouch app.js\ngit add .\ngit commit -m "add app"\ngit log',
      },
      {
        type: 'tip',
        text: 'After this you can do the same thing on any real project. The commands are identical.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo. Commit three files one at a time: one.txt, two.txt, three.txt, each with its own message. Then run git log.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 3,
          label: 'Three commits in history',
          hint: 'Stage and commit each file separately.',
        },
        {
          type: 'sourceIncludes',
          text: 'git log',
          label: 'You ran git log',
          hint: 'Type git log at the end.',
        },
        {
          type: 'fileExists',
          path: '/home/coder/three.txt',
          label: 'three.txt was created',
          hint: 'touch three.txt',
        },
      ],
      hints: [
        'git init',
        'touch one.txt && git add . && git commit -m "add one"',
        'touch two.txt && git add . && git commit -m "add two"',
      ],
      solution:
        'git init\ntouch one.txt\ngit add .\ngit commit -m "add one"\ntouch two.txt\ngit add .\ngit commit -m "add two"\ntouch three.txt\ngit add .\ngit commit -m "add three"\ngit log',
    },
  },
];

export default lessons;
