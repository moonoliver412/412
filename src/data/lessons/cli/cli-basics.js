// Topic: The Command Line (cli-basics) — 5 lessons.

const lessons = [
  {
    id: 'cli-basics-1',
    blocks: [
      {
        type: 'p',
        text: 'The command line is a way to talk to your computer by typing instead of clicking. Developers live in it because it is fast and exact. You type a command, press enter, and the computer does it.',
      },
      {
        type: 'p',
        text: 'Two commands tell you where you are. pwd prints your current folder ("print working directory"), and ls lists what is inside it.',
      },
      {
        type: 'code',
        text: 'pwd\nls',
      },
      {
        type: 'tip',
        text: 'In this lab you write one command per line, then run them all at once — like a tiny script.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Print your current location with pwd, then list the files with ls.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'pwd',
          label: 'You used pwd',
          hint: 'Type pwd on its own line.',
        },
        {
          type: 'output',
          text: '/home/coder',
          label: 'pwd printed your location',
        },
      ],
      hints: [
        'Put pwd on the first line.',
        'Put ls on the second line.',
      ],
      solution: 'pwd\nls',
    },
  },
  {
    id: 'cli-basics-2',
    blocks: [
      {
        type: 'p',
        text: 'cd means "change directory". It moves you into a folder.',
      },
      {
        type: 'p',
        text: 'Type cd followed by the folder name. Type cd .. to go up one level.',
      },
      {
        type: 'code',
        text: 'cd projects\npwd',
      },
      {
        type: 'tip',
        text: 'The folder must already exist before you can cd into it.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Move into the projects folder, then print your new location.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'dirExists',
          path: '/home/coder/projects',
          label: 'The projects folder exists',
          hint: 'Use mkdir projects to create it first.',
        },
        {
          type: 'output',
          text: '/home/coder/projects',
          label: 'pwd shows you are inside projects',
          hint: 'Type cd projects then pwd.',
        },
      ],
      hints: [
        'First create the folder: mkdir projects',
        'Then move into it: cd projects',
        'Then print your location: pwd',
      ],
      solution: 'mkdir projects\ncd projects\npwd',
    },
  },
  {
    id: 'cli-basics-3',
    blocks: [
      {
        type: 'p',
        text: 'You can read a file right in the terminal. cat prints the contents of a file.',
      },
      {
        type: 'p',
        text: 'echo writes text to the screen. Add > filename to save it to a file instead.',
      },
      {
        type: 'code',
        text: 'echo "Hello world" > hello.txt\ncat hello.txt',
      },
      {
        type: 'tip',
        text: '> creates or overwrites a file. >> adds to the end without erasing what is already there.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a file called note.txt with the text "my note", then print its contents with cat.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'fileExists',
          path: '/home/coder/note.txt',
          label: 'note.txt was created',
          hint: 'Use echo "my note" > note.txt',
        },
        {
          type: 'fileContains',
          path: '/home/coder/note.txt',
          text: 'my note',
          label: 'note.txt contains "my note"',
          hint: 'Make sure your echo text says my note.',
        },
        {
          type: 'output',
          text: 'my note',
          label: 'cat printed the file',
          hint: 'Type cat note.txt after creating the file.',
        },
      ],
      hints: [
        'Type: echo "my note" > note.txt',
        'Then type: cat note.txt',
      ],
      solution: 'echo "my note" > note.txt\ncat note.txt',
    },
  },
  {
    id: 'cli-basics-4',
    blocks: [
      {
        type: 'p',
        text: 'Paths tell the terminal exactly where a file or folder is.',
      },
      {
        type: 'p',
        text: 'An absolute path starts from the root: /home/coder/projects. A relative path starts from where you are now: projects/app.',
      },
      {
        type: 'code',
        text: 'ls /home/coder\ncd /home/coder',
      },
      {
        type: 'tip',
        text: '/ at the very start means the root of the whole system. ~ is a shortcut for your home folder.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a folder called work inside /home/coder, then list its parent folder using the absolute path.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'dirExists',
          path: '/home/coder/work',
          label: 'The work folder was created',
          hint: 'Use mkdir work from /home/coder.',
        },
        {
          type: 'output',
          text: 'work',
          label: 'ls shows the work folder',
          hint: 'Type ls /home/coder to list files there.',
        },
      ],
      hints: [
        'Type: mkdir work',
        'Then type: ls /home/coder',
      ],
      solution: 'mkdir work\nls /home/coder',
    },
  },
  {
    id: 'cli-basics-5',
    blocks: [
      {
        type: 'p',
        text: 'Time to put it all together. Real developers chain these commands constantly.',
      },
      {
        type: 'p',
        text: 'You will create a folder, move into it, create a file with text, and read the file back.',
      },
      {
        type: 'code',
        text: 'mkdir myproject\ncd myproject\necho "started" > status.txt\ncat status.txt',
      },
      {
        type: 'tip',
        text: 'This four-step flow is how most coding sessions begin: make the folder, go in, create a file, check it.',
      },
    ],
    exercise: {
      kind: 'terminal',
      instructions:
        'Create a folder called lab, move into it, write "ready" into a file called go.txt, then print go.txt.',
      starter: '# type one command per line\n',
      checks: [
        {
          type: 'dirExists',
          path: '/home/coder/lab',
          label: 'The lab folder exists',
          hint: 'Use mkdir lab.',
        },
        {
          type: 'fileContains',
          path: '/home/coder/lab/go.txt',
          text: 'ready',
          label: 'go.txt contains "ready"',
          hint: 'cd into lab first, then echo "ready" > go.txt.',
        },
        {
          type: 'output',
          text: 'ready',
          label: 'cat printed the file',
          hint: 'Type cat go.txt at the end.',
        },
      ],
      hints: [
        'mkdir lab, then cd lab',
        'echo "ready" > go.txt',
        'cat go.txt',
      ],
      solution: 'mkdir lab\ncd lab\necho "ready" > go.txt\ncat go.txt',
    },
  },
];

export default lessons;
