// Topic: Starting with Git (git-start) — 5 lessons.

const lessons = [
  {
    id: 'git-start-1',
    blocks: [
      {
        type: 'p',
        text: 'Git is a tool that tracks every change you make to your code. Think of it as a save history that never loses anything.',
      },
      {
        type: 'p',
        text: 'git init turns any folder into a Git project. Run it once at the start of a project.',
      },
      {
        type: 'code',
        text: 'mkdir myapp\ncd myapp\ngit init',
      },
      {
        type: 'tip',
        text: 'git init creates a hidden .git folder. That folder is where Git stores everything it tracks.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a folder called tracker, move into it, and run git init.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitInited',
          label: 'Git was initialized',
          hint: 'Run git init inside the folder.',
        },
        {
          type: 'dirExists',
          path: '/home/coder/tracker',
          label: 'The tracker folder exists',
          hint: 'mkdir tracker creates it.',
        },
      ],
      hints: [
        'mkdir tracker',
        'cd tracker',
        'git init',
      ],
      solution: 'mkdir tracker\ncd tracker\ngit init',
    },
  },
  {
    id: 'git-start-2',
    blocks: [
      {
        type: 'p',
        text: 'git status shows you what is going on right now. It lists changed files and tells you what is tracked.',
      },
      {
        type: 'p',
        text: 'Run it often. Developers check status before and after almost every step.',
      },
      {
        type: 'code',
        text: 'git init\ntouch README.md\ngit status',
      },
      {
        type: 'tip',
        text: 'Untracked files are ones Git sees but has never been told to watch. They show up in red in a real terminal.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, create a file called notes.txt, then run git status.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitInited',
          label: 'Git was initialized',
          hint: 'Run git init first.',
        },
        {
          type: 'fileExists',
          path: '/home/coder/notes.txt',
          label: 'notes.txt exists',
          hint: 'Use touch notes.txt.',
        },
        {
          type: 'output',
          text: 'notes.txt',
          label: 'git status shows notes.txt',
          hint: 'Run git status after creating the file.',
        },
      ],
      hints: [
        'git init',
        'touch notes.txt',
        'git status',
      ],
      solution: 'git init\ntouch notes.txt\ngit status',
    },
  },
  {
    id: 'git-start-3',
    blocks: [
      {
        type: 'p',
        text: 'git add tells Git which files to include in the next save. This is called staging.',
      },
      {
        type: 'p',
        text: 'git add filename stages one file. git add . stages everything in the current folder.',
      },
      {
        type: 'code',
        text: 'git add README.md\ngit status',
      },
      {
        type: 'tip',
        text: 'Staged files show up in green in a real terminal. Not staged = not included in the next save.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, create app.js, then stage it with git add.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitInited',
          label: 'Git was initialized',
          hint: 'Run git init first.',
        },
        {
          type: 'gitStaged',
          path: 'app.js',
          label: 'app.js is staged',
          hint: 'Run git add app.js after creating the file.',
        },
      ],
      hints: [
        'git init',
        'touch app.js',
        'git add app.js',
      ],
      solution: 'git init\ntouch app.js\ngit add app.js',
    },
  },
  {
    id: 'git-start-4',
    blocks: [
      {
        type: 'p',
        text: 'git add . is a shortcut. The dot means "everything in this folder and all sub-folders".',
      },
      {
        type: 'p',
        text: 'It is handy when you have many new files and want to stage them all at once.',
      },
      {
        type: 'code',
        text: 'touch index.js styles.css\ngit add .\ngit status',
      },
      {
        type: 'tip',
        text: 'Use git add . carefully. It stages every file, including ones you might not want to save yet.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, create two files (a.txt and b.txt), then stage both using git add .',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitInited',
          label: 'Git was initialized',
          hint: 'Run git init first.',
        },
        {
          type: 'gitStaged',
          label: 'Files are staged',
          hint: 'Run git add . after creating the files.',
        },
      ],
      hints: [
        'git init',
        'touch a.txt b.txt',
        'git add .',
      ],
      solution: 'git init\ntouch a.txt\ntouch b.txt\ngit add .',
    },
  },
  {
    id: 'git-start-5',
    blocks: [
      {
        type: 'p',
        text: 'Let\'s put the whole starting flow together: init, create files, check status, add, check status again.',
      },
      {
        type: 'p',
        text: 'Checking status twice helps you see what changed when you staged. This habit prevents surprises.',
      },
      {
        type: 'code',
        text: 'git init\ntouch index.html\ngit status\ngit add index.html\ngit status',
      },
      {
        type: 'tip',
        text: 'Before: untracked. After: staged. Two git status calls tell the whole story.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, create style.css, run git status, stage the file, then run git status again.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitInited',
          label: 'Git was initialized',
          hint: 'Run git init.',
        },
        {
          type: 'gitStaged',
          path: 'style.css',
          label: 'style.css is staged',
          hint: 'Run git add style.css.',
        },
        {
          type: 'output',
          text: 'style.css',
          label: 'git status mentioned style.css',
          hint: 'Run git status at least once.',
        },
      ],
      hints: [
        'git init',
        'touch style.css',
        'git status',
      ],
      solution: 'git init\ntouch style.css\ngit status\ngit add style.css\ngit status',
    },
  },
];

export default lessons;
