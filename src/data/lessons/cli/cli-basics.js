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
];

export default lessons;
