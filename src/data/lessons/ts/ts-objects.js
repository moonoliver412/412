// Topic: Interfaces & Objects (ts-objects) — 5 lessons.

const lessons = [
  {
    id: 'ts-objects-1',
    blocks: [
      {
        type: 'p',
        text: 'An object in TypeScript can have an inline type. You list the property names and their types inside curly braces. This is called an object type.',
      },
      {
        type: 'code',
        text: 'const player: { name: string; score: number } = {\n  name: "Ada",\n  score: 100,\n};\n\nconsole.log(player.name, player.score);',
      },
      {
        type: 'p',
        text: 'If you add a property that is not in the type, TypeScript warns you. If you forget a required property, it warns you too.',
      },
      {
        type: 'tip',
        text: 'Inline object types work for simple cases. When you need the same shape in more than one place, use an interface instead (next lesson).',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Declare a const called item typed as { label: string; price: number }. Give it a label of "Book" and a price of 12. Log item.label.',
      starter: '// Declare item with an inline object type\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'label\\s*:\\s*string',
          label: 'label is typed as string',
          hint: 'Write: const item: { label: string; price: number } = { label: "Book", price: 12 };',
        },
        {
          type: 'sourceMatches',
          pattern: 'price\\s*:\\s*number',
          label: 'price is typed as number',
          hint: 'Make sure price is typed as number in the object type.',
        },
        {
          type: 'logIncludes',
          text: 'Book',
          label: 'You logged item.label',
        },
      ],
      hints: [
        'Put the type right after the colon: const item: { label: string; price: number } = ...',
        'Then log: console.log(item.label);',
      ],
      solution:
        'const item: { label: string; price: number } = { label: "Book", price: 12 };\nconsole.log(item.label);',
    },
  },
  {
    id: 'ts-objects-2',
    blocks: [
      {
        type: 'p',
        text: 'An interface is a named object type. You define it once and then use the name everywhere you need that shape.',
      },
      {
        type: 'code',
        text: 'interface Player {\n  name: string;\n  score: number;\n}\n\nconst p: Player = { name: "Sam", score: 80 };\nconsole.log(p.name, p.score);',
      },
      {
        type: 'p',
        text: 'Interfaces make your code easier to read. Instead of repeating the full shape, you just write Player.',
      },
      {
        type: 'tip',
        text: 'Interface names start with a capital letter by convention. This helps you tell types apart from regular values at a glance.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an interface called Product with name (string) and price (number). Create a const shoe typed as Product. Log shoe.name.',
      starter: '// Define the Product interface, then create shoe\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'interface\\s+Product',
          label: 'Product interface is defined',
          hint: 'Write: interface Product { name: string; price: number; }',
        },
        {
          type: 'sourceMatches',
          pattern: 'shoe\\s*:\\s*Product',
          label: 'shoe is typed as Product',
          hint: 'Write: const shoe: Product = { ... };',
        },
        {
          type: 'sourceMatches',
          pattern: 'console\\.log',
          label: 'You logged shoe.name',
        },
      ],
      hints: [
        'Define the interface first, then use the name as the type annotation.',
        'Example: const shoe: Product = { name: "Sneaker", price: 60 };',
      ],
      solution:
        'interface Product {\n  name: string;\n  price: number;\n}\nconst shoe: Product = { name: "Sneaker", price: 60 };\nconsole.log(shoe.name);',
    },
  },
  {
    id: 'ts-objects-3',
    blocks: [
      {
        type: 'p',
        text: 'Properties can be optional. Add a ? after the name to say "this might not be there." TypeScript will remind you to check before you use it.',
      },
      {
        type: 'code',
        text: 'interface User {\n  name: string;\n  bio?: string;\n}\n\nconst u: User = { name: "Jo" };\nconsole.log(u.name, u.bio); // "Jo" undefined',
      },
      {
        type: 'p',
        text: 'You can also mark a property readonly. That means it can be set when the object is created, but never changed after that.',
      },
      {
        type: 'code',
        text: 'interface Point {\n  readonly x: number;\n  readonly y: number;\n}\n\nconst pt: Point = { x: 3, y: 4 };\nconsole.log(pt.x, pt.y);\n// pt.x = 10; // Error — cannot reassign',
      },
      {
        type: 'tip',
        text: 'Use readonly for values that should never change after creation — like coordinates or IDs.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an interface called Card with a readonly id (number) and an optional label (string). Create a const card with id 1 and no label. Log card.id.',
      starter: '// Define Card interface\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'readonly\\s+id\\s*:\\s*number',
          label: 'id is readonly number',
          hint: 'Write: readonly id: number; inside the interface.',
        },
        {
          type: 'sourceMatches',
          pattern: 'label\\?\\s*:\\s*string',
          label: 'label is optional string',
          hint: 'Write: label?: string; inside the interface.',
        },
        {
          type: 'logIncludes',
          text: '1',
          label: 'You logged card.id',
        },
      ],
      hints: [
        'In the interface, put readonly before id and ? after label.',
        'Create: const card: Card = { id: 1 }; then log card.id.',
      ],
      solution:
        'interface Card {\n  readonly id: number;\n  label?: string;\n}\nconst card: Card = { id: 1 };\nconsole.log(card.id);',
    },
  },
  {
    id: 'ts-objects-4',
    blocks: [
      {
        type: 'p',
        text: 'One interface can extend another. The new interface gets all the properties of the old one, plus any extras you add.',
      },
      {
        type: 'code',
        text: 'interface Animal {\n  name: string;\n}\n\ninterface Dog extends Animal {\n  breed: string;\n}\n\nconst d: Dog = { name: "Rex", breed: "Lab" };\nconsole.log(d.name, d.breed);',
      },
      {
        type: 'p',
        text: 'Extending interfaces helps you build up from simple shapes to more specific ones without repeating properties.',
      },
      {
        type: 'tip',
        text: 'You can extend more than one interface by separating them with commas: interface C extends A, B { ... }',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an interface Shape with color (string). Then define Circle extending Shape with radius (number). Create a const ring typed as Circle and log ring.color.',
      starter: '// Define Shape and Circle interfaces\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'interface\\s+Shape',
          label: 'Shape interface is defined',
          hint: 'Write: interface Shape { color: string; }',
        },
        {
          type: 'sourceMatches',
          pattern: 'interface\\s+Circle\\s+extends\\s+Shape',
          label: 'Circle extends Shape',
          hint: 'Write: interface Circle extends Shape { radius: number; }',
        },
        {
          type: 'sourceMatches',
          pattern: 'console\\.log',
          label: 'You logged ring.color',
        },
      ],
      hints: [
        'Use the extends keyword: interface Circle extends Shape { ... }',
        'Create: const ring: Circle = { color: "red", radius: 5 }; then log ring.color.',
      ],
      solution:
        'interface Shape {\n  color: string;\n}\ninterface Circle extends Shape {\n  radius: number;\n}\nconst ring: Circle = { color: "red", radius: 5 };\nconsole.log(ring.color);',
    },
  },
  {
    id: 'ts-objects-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone: model a user for an app. You will define interfaces, use optional and readonly fields, and write a function that accepts your typed object.',
      },
      {
        type: 'code',
        text: 'interface Profile {\n  readonly id: number;\n  username: string;\n  bio?: string;\n}\n\nfunction showProfile(p: Profile): void {\n  const info = p.bio ? p.bio : "No bio";\n  console.log(p.id, p.username, info);\n}\n\nshowProfile({ id: 1, username: "Ada" });\nshowProfile({ id: 2, username: "Sam", bio: "Loves TS" });',
      },
      {
        type: 'tip',
        text: 'Real apps almost always have a User or Profile interface. Getting comfortable with these shapes is a key TypeScript skill.',
      },
    ],
    exercise: {
      kind: 'ts',
      instructions:
        'Define an interface User with readonly id (number), name (string), and optional email (string). Write a function greetUser(u: User): void that logs "Hi " + u.name. Call it twice — once with email, once without.',
      starter: '// Define User interface and greetUser function\n',
      checks: [
        {
          type: 'sourceMatches',
          pattern: 'interface\\s+User',
          label: 'User interface is defined',
          hint: 'Write: interface User { readonly id: number; name: string; email?: string; }',
        },
        {
          type: 'sourceMatches',
          pattern: 'greetUser\\s*\\(\\s*u\\s*:\\s*User',
          label: 'greetUser takes a User parameter',
          hint: 'Write: function greetUser(u: User): void { ... }',
        },
        {
          type: 'logIncludes',
          text: 'Hi ',
          label: 'You logged a greeting',
        },
      ],
      hints: [
        'Start with the interface, then the function. The function logs "Hi " + u.name.',
        'Call it once as { id: 1, name: "Ada" } and once with an email property too.',
      ],
      solution:
        'interface User {\n  readonly id: number;\n  name: string;\n  email?: string;\n}\nfunction greetUser(u: User): void {\n  console.log("Hi " + u.name);\n}\ngreetUser({ id: 1, name: "Ada" });\ngreetUser({ id: 2, name: "Sam", email: "sam@example.com" });',
    },
  },
];

export default lessons;
