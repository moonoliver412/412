// Topic: Remote Repos (git-remote) — 5 lessons.

const lessons = [
  {
    id: 'git-remote-1',
    blocks: [
      {
        type: 'p',
        text: 'A remote is a copy of your repo stored somewhere else, like GitHub. It lets you back up your code and share it.',
      },
      {
        type: 'p',
        text: 'git remote add origin url links your local repo to a remote. origin is the standard name for the main remote.',
      },
      {
        type: 'code',
        text: 'git init\ngit remote add origin https://github.com/you/myapp.git',
      },
      {
        type: 'tip',
        text: 'You only run git remote add once per project. After that Git remembers the address.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, then add a remote called origin pointing to https://github.com/user/project.git.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitInited',
          label: 'Git was initialized',
          hint: 'Run git init first.',
        },
        {
          type: 'gitRemote',
          label: 'A remote is configured',
          hint: 'git remote add origin https://github.com/user/project.git',
        },
      ],
      hints: [
        'git init',
        'git remote add origin https://github.com/user/project.git',
      ],
      solution:
        'git init\ngit remote add origin https://github.com/user/project.git',
    },
  },
  {
    id: 'git-remote-2',
    blocks: [
      {
        type: 'p',
        text: 'git push sends your commits to the remote. Other people can then download your work.',
      },
      {
        type: 'p',
        text: 'git push origin main pushes the main branch. After the first push you can often just type git push.',
      },
      {
        type: 'code',
        text: 'git push origin main',
      },
      {
        type: 'tip',
        text: 'In this lab the remote is simulated. git push will succeed as long as a remote and commits exist.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, add a remote, commit a file, then push to origin main.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 1,
          label: 'At least one commit exists',
          hint: 'Stage and commit a file before pushing.',
        },
        {
          type: 'gitRemote',
          label: 'A remote is configured',
          hint: 'git remote add origin <url>',
        },
        {
          type: 'sourceIncludes',
          text: 'git push',
          label: 'You ran git push',
          hint: 'Type git push origin main.',
        },
      ],
      hints: [
        'git init',
        'touch app.js && git add . && git commit -m "init"',
        'git remote add origin https://github.com/user/app.git',
      ],
      solution:
        'git init\ntouch app.js\ngit add .\ngit commit -m "init"\ngit remote add origin https://github.com/user/app.git\ngit push origin main',
    },
  },
  {
    id: 'git-remote-3',
    blocks: [
      {
        type: 'p',
        text: 'git pull downloads the latest commits from the remote and adds them to your local branch.',
      },
      {
        type: 'p',
        text: 'Always pull before you start working. This keeps you in sync with teammates.',
      },
      {
        type: 'code',
        text: 'git pull origin main',
      },
      {
        type: 'tip',
        text: 'Pull before you push. If someone else committed since your last pull, Git will merge their changes in.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo, add a remote, make a commit, push, then pull from origin main.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitRemote',
          label: 'A remote is configured',
          hint: 'git remote add origin <url>',
        },
        {
          type: 'sourceIncludes',
          text: 'git pull',
          label: 'You ran git pull',
          hint: 'Type git pull origin main.',
        },
      ],
      hints: [
        'git init',
        'touch app.js && git add . && git commit -m "init"',
        'git remote add origin https://github.com/user/app.git',
      ],
      solution:
        'git init\ntouch app.js\ngit add .\ngit commit -m "init"\ngit remote add origin https://github.com/user/app.git\ngit push origin main\ngit pull origin main',
    },
  },
  {
    id: 'git-remote-4',
    blocks: [
      {
        type: 'p',
        text: 'git clone copies a remote repo to your computer. You get the full history, all files, and all branches.',
      },
      {
        type: 'p',
        text: 'git clone url creates a new folder with the repo inside. The remote is already set up for you.',
      },
      {
        type: 'code',
        text: 'git clone https://github.com/user/myapp.git',
      },
      {
        type: 'tip',
        text: 'Clone is how you start working on an existing project. You only need the URL.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Clone the repo at https://github.com/example/demo.git.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'git clone',
          label: 'You ran git clone',
          hint: 'Type git clone https://github.com/example/demo.git',
        },
        {
          type: 'dirExists',
          path: '/home/coder/demo',
          label: 'The demo folder was created',
          hint: 'git clone creates a folder named after the repo.',
        },
      ],
      hints: [
        'git clone https://github.com/example/demo.git',
      ],
      solution: 'git clone https://github.com/example/demo.git',
    },
  },
  {
    id: 'git-remote-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone: the full remote workflow that real developers use every day on every team.',
      },
      {
        type: 'p',
        text: 'Init, commit, add remote, push. Then pull to stay in sync.',
      },
      {
        type: 'code',
        text: 'git init\ntouch README.md\ngit add .\ngit commit -m "init repo"\ngit remote add origin https://github.com/you/myapp.git\ngit push origin main\ngit pull origin main',
      },
      {
        type: 'tip',
        text: 'After this lesson you know the full Git flow. Everything else builds on these same commands.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Initialize a repo. Commit two files. Add a remote. Push to origin main. Then pull from origin main.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'gitCommits',
          count: 1,
          label: 'At least one commit exists',
          hint: 'Stage and commit your files.',
        },
        {
          type: 'gitRemote',
          label: 'A remote is configured',
          hint: 'git remote add origin <url>',
        },
        {
          type: 'sourceIncludes',
          text: 'git push',
          label: 'You pushed to the remote',
          hint: 'git push origin main',
        },
        {
          type: 'sourceIncludes',
          text: 'git pull',
          label: 'You pulled from the remote',
          hint: 'git pull origin main',
        },
      ],
      hints: [
        'git init',
        'touch a.txt b.txt && git add . && git commit -m "add files"',
        'git remote add origin https://github.com/user/repo.git',
      ],
      solution:
        'git init\ntouch a.txt\ntouch b.txt\ngit add .\ngit commit -m "add files"\ngit remote add origin https://github.com/user/repo.git\ngit push origin main\ngit pull origin main',
    },
  },
];

export default lessons;
