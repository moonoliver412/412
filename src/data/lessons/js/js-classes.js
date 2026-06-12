// Topic: Classes & Modules (js-classes) — 5 lessons.

const lessons = [
  {
    id: 'js-classes-1',
    blocks: [
      {
        type: 'p',
        text: 'A class is a blueprint. A blueprint describes every house of a certain design. A class describes every object of a certain kind. When you build an actual object from the blueprint, that object is called an instance. In JavaScript you create instances with the new keyword.',
      },
      {
        type: 'p',
        text: 'Inside a class, the constructor is a special method — a function defined on a class — that runs once when each instance is created. Use it to set the object\'s starting values, called properties. Inside any method, the keyword this refers to the current instance.',
      },
      {
        type: 'code',
        text: 'class Tree {\n  constructor(species) {\n    this.species = species;\n    this.age = 0;\n  }\n}\n\nconst oak = new Tree("oak");\nconsole.log(oak.species); // "oak"\nconsole.log(oak.age);     // 0',
      },
      {
        type: 'tip',
        text: 'Class names start with a capital letter by convention — Tree, not tree. That signals to anyone reading your code: this is a blueprint, not a plain value.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Define a class Sprout. Give it a constructor that takes a species string and stores it as this.species. Create an instance called mySprout with the species "birch". Log mySprout.species.',
      hints: [
        'Inside the constructor, use this.species = species; to store the value on the instance. Then call console.log(mySprout.species) outside the class.',
        'Add this.species = species; inside the constructor body, then log mySprout.species after the class definition.',
      ],
      starter:
        'class Sprout {\n  constructor(species) {\n    // store species on this\n    // your code here\n  }\n}\n\nconst mySprout = new Sprout("birch");\n// log mySprout.species\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'birch',
          label: 'The species "birch" is logged to the console',
          hint: 'Add console.log(mySprout.species); after creating the instance.',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof Sprout === "function" && new Sprout("oak").species === "oak"',
          label: 'Sprout stores any species correctly',
          hint: 'Assign this.species = species; inside the constructor so the value is saved on the instance.',
        },
      ],
      solution:
        'class Sprout {\n  constructor(species) {\n    this.species = species;\n  }\n}\n\nconst mySprout = new Sprout("birch");\nconsole.log(mySprout.species);\n',
    },
  },
  {
    id: 'js-classes-2',
    blocks: [
      {
        type: 'p',
        text: 'A class without methods is just a container for data. Methods are the behaviors — the things instances can do. Define them inside the class body without the function keyword. They live on every instance automatically and can read or update the instance\'s state through this.',
      },
      {
        type: 'p',
        text: 'Getters are a special kind of method that look like a property from the outside. Add the get keyword before the method name. It runs automatically whenever someone reads that "property". Getters are great for derived values — values you can calculate from the stored state instead of storing separately.',
      },
      {
        type: 'code',
        text: 'class Tree {\n  constructor(species, age) {\n    this.species = species;\n    this.age = age;\n  }\n\n  birthday() {\n    this.age += 1;\n  }\n\n  get label() {\n    return `${this.species} (age ${this.age})`;\n  }\n}\n\nconst t = new Tree("maple", 3);\nt.birthday();\nconsole.log(t.label); // "maple (age 4)"',
      },
      {
        type: 'tip',
        text: 'Call a getter without parentheses — t.label, not t.label(). Adding () would try to call the string it returns as a function, which throws a TypeError.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Add a grow() method to the Sprout class that increases this.height by 1. Also add a get description() getter that returns the string "A <species> of height <height>". Create an instance, call grow() twice, then log the description.',
      hints: [
        'In the grow() body write this.height += 1; In the getter body write return `A ${this.species} of height ${this.height}`;',
        'The getter uses the get keyword before the method name and no parentheses when you read it: s.description not s.description().',
      ],
      starter:
        'class Sprout {\n  constructor(species) {\n    this.species = species;\n    this.height = 0;\n  }\n\n  grow() {\n    // increase height by 1\n    // your code here\n  }\n\n  get description() {\n    // return "A <species> of height <height>"\n    // your code here\n  }\n}\n\nconst s = new Sprout("pine");\ns.grow();\ns.grow();\nconsole.log(s.description);',
      checks: [
        {
          type: 'logIncludes',
          text: 'pine',
          label: 'The description includes the species name',
          hint: 'Return a template literal that includes this.species in the description getter.',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ const s = new Sprout("oak"); s.grow(); s.grow(); return s.height === 2; })()',
          label: 'grow() correctly adds 1 to height each time',
          hint: 'Write this.height += 1; inside the grow() method body.',
        },
      ],
      solution:
        'class Sprout {\n  constructor(species) {\n    this.species = species;\n    this.height = 0;\n  }\n\n  grow() {\n    this.height += 1;\n  }\n\n  get description() {\n    return `A ${this.species} of height ${this.height}`;\n  }\n}\n\nconst s = new Sprout("pine");\ns.grow();\ns.grow();\nconsole.log(s.description);\n',
    },
  },
  {
    id: 'js-classes-3',
    blocks: [
      {
        type: 'p',
        text: 'One of the most powerful ideas in classes is inheritance. A new class can extend an existing one, automatically getting all its methods. Then it adds or changes only the parts that make it different. The keyword for this is extends.',
      },
      {
        type: 'p',
        text: 'When your child class has a constructor, you must call super() first. super() runs the parent\'s constructor and sets up the inherited values. After super() you can add properties that belong only to the child. The shared logic lives once in the parent — you never repeat it.',
      },
      {
        type: 'code',
        text: 'class Tree {\n  constructor(species) {\n    this.species = species;\n  }\n  describe() {\n    return `a ${this.species} tree`;\n  }\n}\n\nclass FruitTree extends Tree {\n  constructor(species, fruit) {\n    super(species);\n    this.fruit = fruit;\n  }\n  describe() {\n    return `${super.describe()} bearing ${this.fruit}`;\n  }\n}\n\nconst apple = new FruitTree("apple", "apples");\nconsole.log(apple.describe());',
      },
      {
        type: 'tip',
        text: 'super.method() calls the parent\'s version of a method. Use it to build on the parent\'s behavior instead of replacing it entirely.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Create a class Plant with a constructor that takes name and stores it as this.name. Add a greet() method that returns "I am a <name>". Extend Plant with a class Flower that adds a color property. Override greet() in Flower to return "I am a <color> <name>". Log the result of greet() on a new Flower("rose", "red").',
      hints: [
        'In the Flower constructor, call super(name) first — that runs Plant\'s constructor. Then store color with this.color = color.',
        'In Flower\'s greet() write return `I am a ${this.color} ${this.name}`; — this.name comes from Plant via super.',
      ],
      starter:
        'class Plant {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `I am a ${this.name}`;\n  }\n}\n\nclass Flower extends Plant {\n  constructor(name, color) {\n    // call super, store color\n    // your code here\n  }\n  greet() {\n    // return "I am a <color> <name>"\n    // your code here\n  }\n}\n\nconst rose = new Flower("rose", "red");\nconsole.log(rose.greet());',
      checks: [
        {
          type: 'logIncludes',
          text: 'red',
          label: 'The greeting includes the color "red"',
          hint: 'Include this.color in the string returned by Flower\'s greet() method.',
        },
        {
          type: 'logIncludes',
          text: 'rose',
          label: 'The greeting includes the name "rose"',
        },
        {
          type: 'exprTruthy',
          expr: 'new Flower("lily", "white") instanceof Plant',
          label: 'Every Flower instance is also a Plant',
          hint: 'Make Flower extend Plant and call super(name) so instanceof Plant works.',
        },
      ],
      solution:
        'class Plant {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `I am a ${this.name}`;\n  }\n}\n\nclass Flower extends Plant {\n  constructor(name, color) {\n    super(name);\n    this.color = color;\n  }\n  greet() {\n    return `I am a ${this.color} ${this.name}`;\n  }\n}\n\nconst rose = new Flower("rose", "red");\nconsole.log(rose.greet());\n',
    },
  },
  {
    id: 'js-classes-4',
    blocks: [
      {
        type: 'p',
        text: 'As your codebase grows, keeping everything in one file becomes a mess. Modules let you split code across files. Each file is its own scope — nothing leaks out unless you deliberately export it.',
      },
      {
        type: 'p',
        text: 'The export keyword shares a value with other files. Named exports let one file share many things. A default export is the one main thing a file provides. The import keyword pulls those values into any file that needs them. In the browser this works natively with type="module" script tags.',
      },
      {
        type: 'code',
        text: '// tree.js\nexport const SPECIES = ["oak", "maple", "birch"];\n\nexport function describe(s) {\n  return `a ${s} tree`;\n}\n\nexport default class Tree {\n  constructor(s) { this.species = s; }\n}\n\n// main.js\nimport Tree, { SPECIES, describe } from "./tree.js";\nconsole.log(describe(SPECIES[0]));',
      },
      {
        type: 'tip',
        text: 'Because modules have their own scope, top-level variables in one module are invisible to another. No accidental globals. That is a feature, not a bug.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Practice the export/import pattern. Define an object GARDEN with a key "species" set to "oak". Then log GARDEN.species. Real modules need separate files — here you are just making sure you can declare and use named values the way exports work.',
      hints: [
        'GARDEN is already defined in the starter. You just need to add a console.log line to read its species property.',
        'Write console.log(GARDEN.species); — that accesses the "species" key on the object and prints "oak".',
      ],
      starter:
        '// Imagine this is a module you would export:\nconst GARDEN = {\n  species: "oak",\n  size: "small",\n};\n\n// Log the species\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'oak',
          label: 'GARDEN.species "oak" is logged to the console',
          hint: 'Add console.log(GARDEN.species); to log the value "oak".',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof GARDEN === "object" && GARDEN.species === "oak"',
          label: 'GARDEN is defined with species set to "oak"',
        },
      ],
      solution:
        'const GARDEN = {\n  species: "oak",\n  size: "small",\n};\n\nconsole.log(GARDEN.species);\n',
    },
  },
  {
    id: 'js-classes-5',
    blocks: [
      {
        type: 'p',
        text: 'Now build a modular widget — a small, self-contained piece of UI with its own state and logic packed into a class. A good widget knows how to show itself on screen, update its state, and stay in sync with the DOM. It is the seed of every component model you will ever use.',
      },
      {
        type: 'p',
        text: 'The pattern works like this. The constructor accepts a container element and any starting data, sets up state, and calls render(). render() reads the state and writes HTML into the container. Any user action calls a method that updates state and calls render() again. Clean, predictable, and reusable.',
      },
      {
        type: 'code',
        text: 'class Counter {\n  constructor(el) {\n    this.el = el;\n    this.count = 0;\n    this.render();\n  }\n  increment() {\n    this.count += 1;\n    this.render();\n  }\n  render() {\n    this.el.textContent = `Count: ${this.count}`;\n  }\n}\n\nconst c = new Counter(document.getElementById("app"));\nc.increment();\nc.increment();',
      },
      {
        type: 'tip',
        text: 'Call render() at the end of every method that changes state. That keeps the DOM in sync automatically — you never have to remember to update it by hand.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<div id="garden"></div>',
      instructions:
        'Build a GardenWidget class. The constructor takes an element and a species string, stores both, sets this.trees = 0, and calls render(). Add a plant() method that adds 1 to this.trees and calls render(). Add render() which sets the element\'s textContent to "<species> garden: <trees> tree(s)". Create an instance using #garden and "maple", then call plant() twice.',
      hints: [
        'In plant(), write this.trees += 1; this.render(); In render(), set this.el.textContent to a template literal with this.species and this.trees.',
        'render() body: this.el.textContent = `${this.species} garden: ${this.trees} tree(s)`;',
      ],
      starter:
        'class GardenWidget {\n  constructor(el, species) {\n    this.el = el;\n    this.species = species;\n    this.trees = 0;\n    this.render();\n  }\n\n  plant() {\n    // increment trees and re-render\n    // your code here\n  }\n\n  render() {\n    // set el.textContent to "<species> garden: <trees> tree(s)"\n    // your code here\n  }\n}\n\nconst widget = new GardenWidget(document.getElementById("garden"), "maple");\nwidget.plant();\nwidget.plant();',
      checks: [
        {
          type: 'textIncludes',
          text: 'maple',
          selector: '#garden',
          label: 'The species name shows up in the widget',
          hint: 'Use this.species in the template literal inside render() so the species appears in #garden.',
        },
        {
          type: 'textIncludes',
          text: '2',
          selector: '#garden',
          label: 'The tree count of 2 shows up in the widget',
          hint: 'Call this.trees += 1; and then this.render(); inside the plant() method.',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof GardenWidget === "function"',
          label: 'GardenWidget is defined as a class',
        },
      ],
      solution:
        'class GardenWidget {\n  constructor(el, species) {\n    this.el = el;\n    this.species = species;\n    this.trees = 0;\n    this.render();\n  }\n\n  plant() {\n    this.trees += 1;\n    this.render();\n  }\n\n  render() {\n    this.el.textContent = `${this.species} garden: ${this.trees} tree(s)`;\n  }\n}\n\nconst widget = new GardenWidget(document.getElementById("garden"), "maple");\nwidget.plant();\nwidget.plant();\n',
    },
  },
];

export default lessons;
