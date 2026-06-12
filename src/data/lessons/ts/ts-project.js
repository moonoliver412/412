// Topic: Typing a Real App (ts-project) — 5 lessons.

const lessons = [
  {
    id: 'ts-project-1',
    blocks: [
      {
        type: 'p',
        text: 'Real apps work with data — users, posts, products. TypeScript shines when you define that data with interfaces upfront. Everything else flows from there.',
      },
      {
        type: 'code',
        text: 'interface Task {\n  id: number;\n  title: string;\n  done: boolean;\n}\n\nconst tasks: Task[] = [\n  { id: 1, title: "Learn TypeScript", done: false },\n  { id: 2, title: "Build a project", done: false },\n];\n\nconsole.log(tasks[0].title);',
      },
      {
        type: 'p',
        text: 'Once you have an interface, TypeScript checks every task you create. You can not accidentally forget a property or set done to "yes" instead of true.',
      },
      {
        type: 'tip',
        text: 'Start every project by sketching your data interfaces first. They become the backbone of your whole app.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an interface Note with id (number), text (string), and pinned (boolean). Create a const notes typed as Note[] with two notes. Log notes[0].text.',
      starter: '// Define Note and create notes array\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'interface\\s+Note',
          label: 'Note interface is defined',
          hint: 'Write: interface Note { id: number; text: string; pinned: boolean; }',
        },
        {
          type: 'sourceMatches',
          pattern: 'notes\\s*:\\s*Note\\[\\]',
          label: 'notes is typed as Note[]',
          hint: 'Write: const notes: Note[] = [...];',
        },
        {
          type: 'sourceMatches',
          pattern: 'console\\.log',
          label: 'You logged notes[0].text',
        },
      ],
      hints: [
        'Define the interface first with all three properties.',
        'Add two objects to the array, each matching the Note shape.',
      ],
      solution:
        'interface Note {\n  id: number;\n  text: string;\n  pinned: boolean;\n}\nconst notes: Note[] = [\n  { id: 1, text: "Buy milk", pinned: true },\n  { id: 2, text: "Call Sam", pinned: false },\n];\nconsole.log(notes[0].text);',
    },
  },
  {
    id: 'ts-project-2',
    blocks: [
      {
        type: 'p',
        text: 'An enum is a set of named values. Instead of remembering that 0 means "pending" and 1 means "done", you give each state a clear name.',
      },
      {
        type: 'code',
        text: 'enum Status {\n  Pending = "pending",\n  Active = "active",\n  Closed = "closed",\n}\n\nconst current: Status = Status.Active;\nconsole.log(current);',
      },
      {
        type: 'p',
        text: 'String enums are easy to read in logs and debugging. Numeric enums (the default) are more compact but harder to trace.',
      },
      {
        type: 'tip',
        text: 'TypeScript compiles enums to plain objects. The stripper in this app converts them the same way, so they work fine in exercises.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an enum Priority with Low = "low", Medium = "medium", High = "high". Declare a const p typed as Priority set to Priority.High. Log p.',
      starter: '// Define Priority enum\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'enum\\s+Priority',
          label: 'Priority enum is defined',
          hint: 'Write: enum Priority { Low = "low", Medium = "medium", High = "high" }',
        },
        {
          type: 'sourceMatches',
          pattern: 'Priority\\.High',
          label: 'You used Priority.High',
          hint: 'Write: const p: Priority = Priority.High;',
        },
        {
          type: 'logIncludes',
          text: 'high',
          label: 'You logged the value "high"',
        },
      ],
      hints: [
        'Enum values use string literals: Low = "low", Medium = "medium", High = "high"',
        'Declare: const p: Priority = Priority.High; then log p.',
      ],
      solution:
        'enum Priority {\n  Low = "low",\n  Medium = "medium",\n  High = "high",\n}\nconst p: Priority = Priority.High;\nconsole.log(p);',
    },
  },
  {
    id: 'ts-project-3',
    blocks: [
      {
        type: 'p',
        text: 'TypeScript has built-in utility types that transform other types. Two of the most useful are Partial and Readonly.',
      },
      {
        type: 'p',
        text: 'Partial<T> makes every property in T optional. This is perfect for update functions where you only change some fields.',
      },
      {
        type: 'code',
        text: 'interface User {\n  name: string;\n  age: number;\n}\n\n// Only need to pass the fields you want to update\nfunction updateUser(base: User, changes: Partial<User>): User {\n  return { ...base, ...changes };\n}\n\nconst u = updateUser({ name: "Ada", age: 17 }, { age: 18 });\nconsole.log(u.name, u.age);',
      },
      {
        type: 'tip',
        text: 'Readonly<T> makes every property readonly. Use it for config objects or anything that should never change after creation.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an interface Config with host (string) and port (number). Declare a const cfg typed as Readonly<Config> with host "localhost" and port 3000. Log cfg.host.',
      starter: '// Define Config and create cfg\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'interface\\s+Config',
          label: 'Config interface is defined',
          hint: 'Write: interface Config { host: string; port: number; }',
        },
        {
          type: 'sourceMatches',
          pattern: 'Readonly<Config>',
          label: 'cfg is typed as Readonly<Config>',
          hint: 'Write: const cfg: Readonly<Config> = { host: "localhost", port: 3000 };',
        },
        {
          type: 'logIncludes',
          text: 'localhost',
          label: 'You logged cfg.host',
        },
      ],
      hints: [
        'Define the interface, then wrap the type with Readonly<Config>.',
        'Log cfg.host to confirm it works.',
      ],
      solution:
        'interface Config {\n  host: string;\n  port: number;\n}\nconst cfg: Readonly<Config> = { host: "localhost", port: 3000 };\nconsole.log(cfg.host);',
    },
  },
  {
    id: 'ts-project-4',
    blocks: [
      {
        type: 'p',
        text: 'One of the best things TypeScript does is catch bugs before you run your code. Let\'s look at a common mistake — accessing a property on something that could be undefined.',
      },
      {
        type: 'code',
        text: 'interface Post {\n  title: string;\n  author?: string;\n}\n\nfunction display(post: Post): void {\n  // Safe: check before using optional property\n  const by = post.author ? post.author : "Anonymous";\n  console.log(post.title, "by", by);\n}\n\ndisplay({ title: "Hello TS" });\ndisplay({ title: "Deep Dive", author: "Ada" });',
      },
      {
        type: 'p',
        text: 'TypeScript forces you to handle the undefined case for optional properties. This discipline catches a whole class of runtime crashes before they happen.',
      },
      {
        type: 'tip',
        text: 'You can also use the ?? operator (nullish coalescing) as a shorthand: post.author ?? "Anonymous" returns "Anonymous" when author is undefined or null.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an interface Item with name (string) and qty (optional number). Write a function describe(item: Item): void that logs item.name and the qty or 0 if missing. Call it twice.',
      starter: '// Define Item and write describe\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'qty\\?\\s*:\\s*number',
          label: 'qty is optional',
          hint: 'Write: qty?: number; in the interface.',
        },
        {
          type: 'sourceMatches',
          pattern: 'describe\\s*\\(\\s*item\\s*:\\s*Item',
          label: 'describe takes an Item parameter',
          hint: 'Write: function describe(item: Item): void { ... }',
        },
        {
          type: 'logIncludes',
          text: 'Book',
          label: 'You logged an item name',
        },
      ],
      hints: [
        'Handle the optional qty: const q = item.qty ?? 0; then log item.name and q.',
        'Call once without qty and once with a qty value.',
      ],
      solution:
        'interface Item {\n  name: string;\n  qty?: number;\n}\nfunction describe(item: Item): void {\n  const q = item.qty ?? 0;\n  console.log(item.name, q);\n}\ndescribe({ name: "Book" });\ndescribe({ name: "Pen", qty: 5 });',
    },
  },
  {
    id: 'ts-project-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone: ship a typed module. You will bring together interfaces, an enum, a generic function, and a typed array into one small self-contained program.',
      },
      {
        type: 'code',
        text: 'enum Category {\n  Code = "code",\n  Art = "art",\n}\n\ninterface Project {\n  id: number;\n  name: string;\n  category: Category;\n}\n\nfunction findById<T extends { id: number }>(list: T[], id: number): T | undefined {\n  return list.find((item) => item.id === id);\n}\n\nconst projects: Project[] = [\n  { id: 1, name: "Portfolio", category: Category.Code },\n  { id: 2, name: "Sketchbook", category: Category.Art },\n];\n\nconst found = findById(projects, 1);\nconsole.log(found ? found.name : "not found");',
      },
      {
        type: 'tip',
        text: 'This is the full TypeScript toolkit in one program: enums for fixed values, interfaces for shapes, generics for reusable logic, and typed arrays to hold it all.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an interface Lesson with id (number) and title (string). Create a lessons array with two entries. Write a generic function findById<T extends { id: number }>(list: T[], id: number): T | undefined and use it to find lesson id 2. Log the title.',
      starter:
        '// Define Lesson, create array, write findById\ninterface Lesson {\n  id: number;\n  title: string;\n}\n\nconst myLessons: Lesson[] = [\n  // add two lessons\n];\n\n// write findById here\n\n// find lesson with id 2 and log its title\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'function findById<T extends',
          label: 'findById is a constrained generic',
          hint: 'Write: function findById<T extends { id: number }>(list: T[], id: number): T | undefined',
        },
        {
          type: 'sourceMatches',
          pattern: 'list\\.find',
          label: 'You used list.find',
          hint: 'Return list.find((item) => item.id === id);',
        },
        {
          type: 'sourceMatches',
          pattern: 'console\\.log',
          label: 'You logged the result',
        },
      ],
      hints: [
        'Add two lessons like { id: 1, title: "..." } and { id: 2, title: "..." }.',
        'Call findById(myLessons, 2) and log the title with optional chaining or a ternary.',
      ],
      solution:
        'interface Lesson {\n  id: number;\n  title: string;\n}\nconst myLessons: Lesson[] = [\n  { id: 1, title: "Intro to TS" },\n  { id: 2, title: "Functions" },\n];\nfunction findById<T extends { id: number }>(list: T[], id: number): T | undefined {\n  return list.find((item) => item.id === id);\n}\nconst lesson = findById(myLessons, 2);\nconsole.log(lesson ? lesson.title : "not found");',
    },
  },
];

export default lessons;
