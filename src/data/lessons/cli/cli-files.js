// Topic: Files and Folders (cli-files) — 5 lessons.

const lessons = [
  {
    id: 'cli-files-1',
    blocks: [
      {
        type: 'p',
        text: 'mkdir creates a new folder. You can make several at once by listing names.',
      },
      {
        type: 'p',
        text: 'touch creates an empty file. If the file already exists, touch just updates its timestamp.',
      },
      {
        type: 'code',
        text: 'mkdir src\ntouch src/index.js',
      },
      {
        type: 'tip',
        text: 'You can give a path to touch: touch src/index.js creates the file inside the src folder in one step.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a folder called app, then create an empty file called main.js inside it.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'dirExists',
          path: '/home/coder/app',
          label: 'The app folder was created',
          hint: 'Use mkdir app.',
        },
        {
          type: 'fileExists',
          path: '/home/coder/app/main.js',
          label: 'main.js exists inside app',
          hint: 'Use touch app/main.js.',
        },
      ],
      hints: [
        'mkdir app',
        'touch app/main.js',
      ],
      solution: 'mkdir app\ntouch app/main.js',
    },
  },
  {
    id: 'cli-files-2',
    blocks: [
      {
        type: 'p',
        text: 'mv moves a file or folder to a new location. It also renames things.',
      },
      {
        type: 'p',
        text: 'mv old new renames old to new. mv file folder/ moves the file into that folder.',
      },
      {
        type: 'code',
        text: 'mv draft.txt final.txt\nmv final.txt docs/',
      },
      {
        type: 'tip',
        text: 'mv does not ask "are you sure". The old name is gone the moment you run it.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a file called temp.txt, then rename it to keep.txt.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'fileExists',
          path: '/home/coder/keep.txt',
          label: 'keep.txt exists',
          hint: 'Use mv temp.txt keep.txt.',
        },
        {
          type: 'sourceIncludes',
          text: 'mv',
          label: 'You used the mv command',
          hint: 'mv renames a file: mv temp.txt keep.txt.',
        },
      ],
      hints: [
        'touch temp.txt to create it',
        'mv temp.txt keep.txt to rename it',
      ],
      solution: 'touch temp.txt\nmv temp.txt keep.txt',
    },
  },
  {
    id: 'cli-files-3',
    blocks: [
      {
        type: 'p',
        text: 'cp copies a file. The original stays and you get a new copy.',
      },
      {
        type: 'p',
        text: 'cp source destination. Use cp -r to copy a whole folder.',
      },
      {
        type: 'code',
        text: 'cp config.txt config.backup.txt\ncp -r src/ src-backup/',
      },
      {
        type: 'tip',
        text: 'Making a backup before you edit is a good habit. cp makes it instant.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a file called data.txt with any text, then copy it to data.backup.txt.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'fileExists',
          path: '/home/coder/data.txt',
          label: 'data.txt exists',
          hint: 'Use echo "text" > data.txt.',
        },
        {
          type: 'fileExists',
          path: '/home/coder/data.backup.txt',
          label: 'data.backup.txt was copied',
          hint: 'Use cp data.txt data.backup.txt.',
        },
      ],
      hints: [
        'echo "text" > data.txt',
        'cp data.txt data.backup.txt',
      ],
      solution: 'echo "text" > data.txt\ncp data.txt data.backup.txt',
    },
  },
  {
    id: 'cli-files-4',
    blocks: [
      {
        type: 'p',
        text: 'rm deletes a file. It is permanent — there is no trash can.',
      },
      {
        type: 'p',
        text: 'rm filename deletes a file. rm -r foldername deletes a folder and everything inside it.',
      },
      {
        type: 'code',
        text: 'rm old.txt\nrm -r build/',
      },
      {
        type: 'tip',
        text: 'Always double-check the name before you run rm. Deleted files do not come back.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a file called junk.txt, then delete it with rm.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'rm',
          label: 'You used rm',
          hint: 'Type rm junk.txt.',
        },
        {
          type: 'sourceIncludes',
          text: 'touch',
          label: 'You created the file first',
          hint: 'touch junk.txt makes the file before you delete it.',
        },
      ],
      hints: [
        'touch junk.txt to create it',
        'rm junk.txt to delete it',
      ],
      solution: 'touch junk.txt\nrm junk.txt',
    },
  },
  {
    id: 'cli-files-5',
    blocks: [
      {
        type: 'p',
        text: 'Now use all four commands together: mkdir, touch, mv, and cp.',
      },
      {
        type: 'p',
        text: 'A common flow is to set up a folder, add files, reorganize them, and back important ones up.',
      },
      {
        type: 'code',
        text: 'mkdir project\ntouch project/app.js\ncp project/app.js project/app.backup.js\nmv project/app.js project/main.js',
      },
      {
        type: 'tip',
        text: 'This kind of file organization is something every developer does every day.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a folder called site. Inside it, create index.html. Copy it to index.backup.html. Then rename index.html to home.html.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'dirExists',
          path: '/home/coder/site',
          label: 'The site folder exists',
          hint: 'mkdir site',
        },
        {
          type: 'fileExists',
          path: '/home/coder/site/home.html',
          label: 'home.html exists (renamed from index.html)',
          hint: 'mv site/index.html site/home.html',
        },
        {
          type: 'fileExists',
          path: '/home/coder/site/index.backup.html',
          label: 'index.backup.html was copied',
          hint: 'cp site/index.html site/index.backup.html before renaming',
        },
      ],
      hints: [
        'mkdir site && touch site/index.html',
        'cp site/index.html site/index.backup.html',
        'mv site/index.html site/home.html',
      ],
      solution:
        'mkdir site\ntouch site/index.html\ncp site/index.html site/index.backup.html\nmv site/index.html site/home.html',
    },
  },
];

export default lessons;
