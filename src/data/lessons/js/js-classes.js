// Topic: Classes & Modules (js-classes) — 5 lessons.

const lessons = [
  {
    id: 'js-classes-1',
    blocks: [
      {
        type: 'p',
        text: 'A class is a blueprint. Just as an architectural drawing describes every house of a certain design, a class describes every object of a certain kind. When you build an actual house from the drawing, you call that a class instance. In JavaScript you create instances with the new keyword.',
      },
      {
        type: 'p',
        text: 'Inside a class, the constructor is a special method that runs once when each instance is created. You use it to set the object\'s initial state — the properties unique to that particular instance. Inside any method, this refers to the current instance.',
      },
      {
        type: 'code',
        text: 'class Tree {\n  constructor(species) {\n    this.species = species;\n    this.age = 0;\n  }\n}\n\nconst oak = new Tree("oak");\nconsole.log(oak.species); // "oak"\nconsole.log(oak.age);     // 0',
      },
      {
        type: 'tip',
        text: 'Class names start with a capital letter by convention — Tree, not tree. This signals to every reader that you are describing a blueprint, not a value.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Define a class Sprout with a constructor that takes a species string and stores it as this.species. Create an instance called mySprout with the species "birch" and log its species.',
      starter:
        'class Sprout {\n  constructor(species) {\n    // store species on this\n    // your code here\n  }\n}\n\nconst mySprout = new Sprout("birch");\n// log mySprout.species\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'birch',
          label: 'The species "birch" is logged',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof Sprout === "function" && new Sprout("oak").species === "oak"',
          label: 'Sprout stores its species correctly',
        },
      ],
    },
  },
  {
    id: 'js-classes-2',
    blocks: [
      {
        type: 'p',
        text: 'A class without methods is just a data bag. Methods are the behaviors — the things instances can do. You define them inside the class body without the function keyword; they automatically live on every instance and can read and update the instance\'s state through this.',
      },
      {
        type: 'p',
        text: 'Getters are a special kind of method that look like a property access from the outside. You prefix the method with get and it runs whenever someone reads that "property". They are perfect for derived values — values you could calculate from the stored state rather than store separately.',
      },
      {
        type: 'code',
        text: 'class Tree {\n  constructor(species, age) {\n    this.species = species;\n    this.age = age;\n  }\n\n  birthday() {\n    this.age += 1;\n  }\n\n  get label() {\n    return `${this.species} (age ${this.age})`;\n  }\n}\n\nconst t = new Tree("maple", 3);\nt.birthday();\nconsole.log(t.label); // "maple (age 4)"',
      },
      {
        type: 'tip',
        text: 'Call a getter without parentheses — t.label, not t.label(). Adding () would try to call the string it returns as a function and throw a TypeError.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Add a grow() method to the Sprout class that increases this.height by 1. Also add a get description() getter that returns the string "A <species> of height <height>". Create an instance with height 0, call grow() twice, then log the description.',
      starter:
        'class Sprout {\n  constructor(species) {\n    this.species = species;\n    this.height = 0;\n  }\n\n  grow() {\n    // increase height by 1\n    // your code here\n  }\n\n  get description() {\n    // return "A <species> of height <height>"\n    // your code here\n  }\n}\n\nconst s = new Sprout("pine");\ns.grow();\ns.grow();\nconsole.log(s.description);',
      checks: [
        {
          type: 'logIncludes',
          text: 'pine',
          label: 'The description includes the species',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ const s = new Sprout("oak"); s.grow(); s.grow(); return s.height === 2; })()',
          label: 'grow() increases height by 1 each call',
        },
      ],
    },
  },
  {
    id: 'js-classes-3',
    blocks: [
      {
        type: 'p',
        text: 'One of the most powerful ideas in object-oriented code is inheritance: a new class can extend an existing one, automatically gaining all its methods, and then add or override only the parts that make it different. The keyword is extends.',
      },
      {
        type: 'p',
        text: 'When your child class has a constructor, you must call super() first — it runs the parent\'s constructor and sets up the inherited state. After super() returns, you can add properties that belong only to the child. This keeps your code dry: the common logic lives once in the parent.',
      },
      {
        type: 'code',
        text: 'class Tree {\n  constructor(species) {\n    this.species = species;\n  }\n  describe() {\n    return `a ${this.species} tree`;\n  }\n}\n\nclass FruitTree extends Tree {\n  constructor(species, fruit) {\n    super(species);\n    this.fruit = fruit;\n  }\n  describe() {\n    return `${super.describe()} bearing ${this.fruit}`;\n  }\n}\n\nconst apple = new FruitTree("apple", "apples");\nconsole.log(apple.describe());',
      },
      {
        type: 'tip',
        text: 'super.method() calls the parent\'s version of a method. Use it to build on the parent\'s behavior rather than completely replace it.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Create a class Plant with a constructor that takes name and stores it. Add a greet() method that returns "I am a <name>". Then extend Plant with a class Flower that adds a color property and overrides greet() to return "I am a <color> <name>". Log the result of calling greet() on a new Flower("rose", "red").',
      starter:
        'class Plant {\n  constructor(name) {\n    this.name = name;\n  }\n  greet() {\n    return `I am a ${this.name}`;\n  }\n}\n\nclass Flower extends Plant {\n  constructor(name, color) {\n    // call super, store color\n    // your code here\n  }\n  greet() {\n    // return "I am a <color> <name>"\n    // your code here\n  }\n}\n\nconst rose = new Flower("rose", "red");\nconsole.log(rose.greet());',
      checks: [
        {
          type: 'logIncludes',
          text: 'red',
          label: 'The color "red" appears in the greeting',
        },
        {
          type: 'logIncludes',
          text: 'rose',
          label: 'The name "rose" appears in the greeting',
        },
        {
          type: 'exprTruthy',
          expr: 'new Flower("lily", "white") instanceof Plant',
          label: 'Flower instances are also Plants',
        },
      ],
    },
  },
  {
    id: 'js-classes-4',
    blocks: [
      {
        type: 'p',
        text: 'As your JS codebase grows, keeping everything in one file becomes chaos — like cramming a whole forest into a single pot. Modules let you split code across files. Each file is its own scope: nothing leaks out unless you deliberately export it.',
      },
      {
        type: 'p',
        text: 'You export a value with the export keyword. Named exports let a single file share many things; a default export is the one main thing a file provides. On the other side, import pulls those values into the file that needs them. In the browser and in modern bundlers, this works natively with type="module" script tags.',
      },
      {
        type: 'code',
        text: '// tree.js\nexport const SPECIES = ["oak", "maple", "birch"];\n\nexport function describe(s) {\n  return `a ${s} tree`;\n}\n\nexport default class Tree {\n  constructor(s) { this.species = s; }\n}\n\n// main.js\nimport Tree, { SPECIES, describe } from "./tree.js";\nconsole.log(describe(SPECIES[0]));',
      },
      {
        type: 'tip',
        text: 'Because modules have their own scope, top-level variables in one module are invisible to another — no accidental globals. This is a feature, not a bug.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'In this single-file exercise, practice the export/import pattern by defining an object GARDEN with a key "species" set to "oak", then log GARDEN.species. (Real module import/export requires separate files, so here we\'re just verifying you can declare and use named values the way exports work.)',
      starter:
        '// Imagine this is a module you would export:\nconst GARDEN = {\n  species: "oak",\n  size: "small",\n};\n\n// Log the species\n// your code here',
      checks: [
        {
          type: 'logIncludes',
          text: 'oak',
          label: 'GARDEN.species "oak" is logged',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof GARDEN === "object" && GARDEN.species === "oak"',
          label: 'GARDEN is defined with the right species',
        },
      ],
    },
  },
  {
    id: 'js-classes-5',
    blocks: [
      {
        type: 'p',
        text: 'Let\'s build a modular widget — a small self-contained piece of UI with its own state and logic packed into a class. A good widget knows how to render itself, update its state, and stay in sync with the DOM. It is the seed of every component model you will ever use.',
      },
      {
        type: 'p',
        text: 'The pattern: the constructor accepts a container element and any initial data, sets up state, and calls a render() method. render() reads this.state and writes HTML into the container. Any interaction calls a method that updates state and calls render() again. Clean, predictable, reusable.',
      },
      {
        type: 'code',
        text: 'class Counter {\n  constructor(el) {\n    this.el = el;\n    this.count = 0;\n    this.render();\n  }\n  increment() {\n    this.count += 1;\n    this.render();\n  }\n  render() {\n    this.el.textContent = `Count: ${this.count}`;\n  }\n}\n\nconst c = new Counter(document.getElementById("app"));\nc.increment();\nc.increment();',
      },
      {
        type: 'tip',
        text: 'Calling render() at the end of every state-changing method keeps the DOM in sync without you ever having to remember to update it manually.',
      },
    ],
    exercise: {
      kind: 'js',
      html: '<div id="garden"></div>',
      instructions:
        'Build a GardenWidget class: constructor takes an element and a species string, stores them, sets this.trees = 0, and calls render(). Add a plant() method that increments this.trees and calls render(). Add render() that sets the element\'s textContent to "<species> garden: <trees> tree(s)". Create an instance with #garden and "maple", call plant() twice.',
      starter:
        'class GardenWidget {\n  constructor(el, species) {\n    this.el = el;\n    this.species = species;\n    this.trees = 0;\n    this.render();\n  }\n\n  plant() {\n    // increment trees and re-render\n    // your code here\n  }\n\n  render() {\n    // set el.textContent to "<species> garden: <trees> tree(s)"\n    // your code here\n  }\n}\n\nconst widget = new GardenWidget(document.getElementById("garden"), "maple");\nwidget.plant();\nwidget.plant();',
      checks: [
        {
          type: 'textIncludes',
          text: 'maple',
          selector: '#garden',
          label: 'The species appears in the widget',
        },
        {
          type: 'textIncludes',
          text: '2',
          selector: '#garden',
          label: 'The tree count of 2 appears in the widget',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof GardenWidget === "function"',
          label: 'GardenWidget class is defined',
        },
      ],
    },
  },
];

export default lessons;
