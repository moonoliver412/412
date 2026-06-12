// Topic: Branches (git-branches) — 5 lessons.

const lessons = [
  {
    id: 'git-branches-1',
    blocks: [
      {
        type: 'p',
        text: 'A branch is a separate line of work. You can try new ideas on a branch without touching the main code.',
      },
      {
        type: 'p',
        text: 'git branch shows all branches. The one with a * is the one you are on.',
      },
      {
        type: 'code',
        text: 'git init\ntouch app.js\ngit add .\ngit commit -m "init"\ngit branch',
      },
      {
        type: 'tip',
        text: 'Every repo starts on a branch called main. All your commits so far have been on main.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, make one commit, then run git branch to see the branch list.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 1,
          label: 'At least one commit exists',
          hint: 'You need a commit before branches show up.',
        },
        {
          type: 'sourceIncludes',
          text: 'git branch',
          label: 'You ran git branch',
          hint: 'Type git branch at the end.',
        },
      ],
      hints: [
        'git init',
        'touch app.js && git add . && git commit -m "init"',
        'git branch',
      ],
      solution: 'git init\ntouch app.js\ngit add .\ngit commit -m "init"\ngit branch',
    },
  },
  {
    id: 'git-branches-2',
    blocks: [
      {
        type: 'p',
        text: 'git checkout -b name creates a new branch and moves you onto it right away.',
      },
      {
        type: 'p',
        text: 'You can also use git switch -c name — same result, newer style.',
      },
      {
        type: 'code',
        text: 'git checkout -b feature',
      },
      {
        type: 'tip',
        text: 'Name branches after what you are building: feature/login, fix/typo, experiment/dark-mode.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, make a commit, then create and switch to a branch called feature.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitBranch',
          name: 'feature',
          current: true,
          label: 'feature branch exists and is current',
          hint: 'Use git checkout -b feature.',
        },
        {
          type: 'gitCommits',
          count: 1,
          label: 'You made a commit before branching',
          hint: 'git add . then git commit -m "init" first.',
        },
      ],
      hints: [
        'git init',
        'touch app.js && git add . && git commit -m "init"',
        'git checkout -b feature',
      ],
      solution:
        'git init\ntouch app.js\ngit add .\ngit commit -m "init"\ngit checkout -b feature',
    },
  },
  {
    id: 'git-branches-3',
    blocks: [
      {
        type: 'p',
        text: 'Commits on a branch only live on that branch. Main does not see them until you merge.',
      },
      {
        type: 'p',
        text: 'Switch back to main with git checkout main, then run git merge branchname to bring the changes in.',
      },
      {
        type: 'code',
        text: 'git checkout main\ngit merge feature',
      },
      {
        type: 'tip',
        text: 'After a merge the commits from the branch appear in main\'s history.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, commit a file on main, create a branch called update, commit a second file there, then merge update back into main.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 2,
          label: 'At least two commits exist',
          hint: 'Make one commit on main and one on the update branch.',
        },
        {
          type: 'sourceIncludes',
          text: 'git merge',
          label: 'You used git merge',
          hint: 'Run git merge update from the main branch.',
        },
      ],
      hints: [
        'git init && touch a.txt && git add . && git commit -m "init"',
        'git checkout -b update',
        'touch b.txt && git add . && git commit -m "add b"',
      ],
      solution:
        'git init\ntouch a.txt\ngit add .\ngit commit -m "init"\ngit checkout -b update\ntouch b.txt\ngit add .\ngit commit -m "add b"\ngit checkout main\ngit merge update',
    },
  },
  {
    id: 'git-branches-4',
    blocks: [
      {
        type: 'p',
        text: 'You can have many branches at once. List them all with git branch.',
      },
      {
        type: 'p',
        text: 'To switch to a branch that already exists use git checkout name or git switch name.',
      },
      {
        type: 'code',
        text: 'git branch\ngit checkout main\ngit checkout feature',
      },
      {
        type: 'tip',
        text: 'Branches are cheap in Git. Make one whenever you start something new.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo with a commit, then create two branches: design and backend. Switch to design at the end.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitBranch',
          name: 'design',
          current: true,
          label: 'design branch is current',
          hint: 'Use git checkout design or git checkout -b design.',
        },
        {
          type: 'gitBranch',
          name: 'backend',
          label: 'backend branch exists',
          hint: 'Use git checkout -b backend.',
        },
      ],
      hints: [
        'git init && touch app.js && git add . && git commit -m "init"',
        'git checkout -b design',
        'git checkout main',
      ],
      solution:
        'git init\ntouch app.js\ngit add .\ngit commit -m "init"\ngit checkout -b design\ngit checkout main\ngit checkout -b backend\ngit checkout design',
    },
  },
  {
    id: 'git-branches-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone: the full branch workflow used in real teams every day.',
      },
      {
        type: 'p',
        text: 'You start on main, branch off for a feature, commit your work, then merge it back.',
      },
      {
        type: 'code',
        text: 'git init\ntouch index.html\ngit add . && git commit -m "init"\ngit checkout -b nav\ntouch nav.html\ngit add . && git commit -m "add nav"\ngit checkout main\ngit merge nav\ngit log',
      },
      {
        type: 'tip',
        text: 'After the merge, delete the branch with git branch -d nav to keep things tidy.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo. Commit index.html on main. Create a branch called sidebar, commit sidebar.html there, merge it into main, then run git log.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 2,
          label: 'At least two commits in history',
          hint: 'Make one commit on main and one on the sidebar branch.',
        },
        {
          type: 'sourceIncludes',
          text: 'git merge',
          label: 'You merged the branch',
          hint: 'Run git merge sidebar from main.',
        },
        {
          type: 'sourceIncludes',
          text: 'git log',
          label: 'You ran git log',
          hint: 'Type git log at the end.',
        },
      ],
      hints: [
        'git init && touch index.html && git add . && git commit -m "init"',
        'git checkout -b sidebar',
        'touch sidebar.html && git add . && git commit -m "add sidebar"',
      ],
      solution:
        'git init\ntouch index.html\ngit add .\ngit commit -m "init"\ngit checkout -b sidebar\ntouch sidebar.html\ngit add .\ngit commit -m "add sidebar"\ngit checkout main\ngit merge sidebar\ngit log',
    },
  },
];

export default lessons;
