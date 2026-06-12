// Topic: Arrays & Objects (js-arrays-objects) — 5 lessons.

const lessons = [
  {
    id: 'js-arrays-objects-1',
    blocks: [
      {
        type: 'p',
        text: 'An array is an ordered list — one variable that holds many values at once. You can store every tree name in a grove, a list of scores, or any sequence of things in one container. Arrays are created with square brackets and commas between items.',
      },
      {
        type: 'code',
        text: 'const grove = ["Maple", "Oak", "Birch", "Pine"];\nconsole.log(grove[0]);       // "Maple"\nconsole.log(grove.length);   // 4\ngrove.push("Willow");        // add to the end\nconsole.log(grove.length);   // 5',
      },
      {
        type: 'p',
        text: 'Items are accessed by index. The first index is always 0, so a four-item array has indices 0, 1, 2, and 3. The length property tells you how many items are inside. push() adds an item to the end. pop() removes and returns the last item.',
      },
      {
        type: 'tip',
        text: 'Arrays declared with const can still be changed — push, pop, sort, and so on. const only stops you from replacing the array itself with a new one. To visit every item without a counter, use for...of.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Create an array called trees containing at least three tree names. Push one more name onto it, then log the array and its length.',
      hints: [
        'Arrays use square brackets and comma-separated values. The push() method adds a new item to the end.',
        'Call trees.push("Maple"); to add a fourth name — then the existing console.log lines will show the updated array and its length.',
      ],
      starter:
        'const trees = ["Oak", "Birch", "Pine"];\n\n// Push a fourth tree\n// your code here\n\nconsole.log(trees);\nconsole.log(trees.length);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(trees) && trees.length >= 4',
          label: 'trees has at least 4 items after the push',
          hint: 'Call trees.push("AnyName") to add a fourth item before the console.log lines.',
        },
        {
          type: 'logIncludes',
          text: '4',
          label: 'The length (4 or more) is logged',
        },
      ],
      solution:
        'const trees = ["Oak", "Birch", "Pine"];\n\ntrees.push("Maple");\n\nconsole.log(trees);\nconsole.log(trees.length);\n',
    },
  },
  {
    id: 'js-arrays-objects-2',
    blocks: [
      {
        type: 'p',
        text: 'Three array methods — map, filter, and reduce — are your main tools for working with data. Each takes a callback function and applies it to every item, but they do different jobs. map transforms each item. filter keeps only matching items. reduce collapses the whole array into one value.',
      },
      {
        type: 'code',
        text: 'const heights = [3, 8, 5, 12, 2];\n\nconst doubled   = heights.map(h => h * 2);        // [6, 16, 10, 24, 4]\nconst tall      = heights.filter(h => h >= 5);    // [8, 5, 12]\nconst total     = heights.reduce((sum, h) => sum + h, 0); // 30\n\nconsole.log(doubled, tall, total);',
      },
      {
        type: 'p',
        text: 'These methods never change the original array. They each return a new one — or, for reduce, a new value. You can chain them: heights.filter(h => h > 4).map(h => h * 2) first keeps only items above 4, then doubles each of those.',
      },
      {
        type: 'tip',
        text: 'The second argument to reduce is the starting value for the accumulator — always provide it. Without it, reduce uses the first item as the start. That silently breaks when the array is empty.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Given the ages array, use map to create a doubledAges array, filter to create a grownTrees array of ages 10 or above, and reduce to compute the totalAge. Log all three.',
      hints: [
        'map transforms each item, filter keeps matching items, and reduce collapses the array to one value. Each takes a callback.',
        'Write const doubledAges = ages.map(a => a * 2); const grownTrees = ages.filter(a => a >= 10); const totalAge = ages.reduce((sum, a) => sum + a, 0);',
      ],
      starter:
        'const ages = [4, 12, 7, 15, 2, 10];\n\n// your code here\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(doubledAges) && doubledAges[0] === 8',
          label: 'doubledAges correctly doubles each value',
          hint: 'Use ages.map(a => a * 2) and store the result in doubledAges.',
        },
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(grownTrees) && grownTrees.every(a => a >= 10)',
          label: 'grownTrees contains only ages 10 and above',
          hint: 'Use ages.filter(a => a >= 10) and store the result in grownTrees.',
        },
        {
          type: 'exprTruthy',
          expr: 'totalAge === 50',
          label: 'totalAge equals 50 (the sum of all ages)',
        },
      ],
      solution:
        'const ages = [4, 12, 7, 15, 2, 10];\n\nconst doubledAges = ages.map(a => a * 2);\nconst grownTrees = ages.filter(a => a >= 10);\nconst totalAge = ages.reduce((sum, a) => sum + a, 0);\n\nconsole.log(doubledAges);\nconsole.log(grownTrees);\nconsole.log(totalAge);\n',
    },
  },
  {
    id: 'js-arrays-objects-3',
    blocks: [
      {
        type: 'p',
        text: 'An object groups related values together under one roof. Instead of keeping a tree\'s name, height, and species in three separate variables, you can store them in a single object — a collection of key-value pairs inside curly braces.',
      },
      {
        type: 'code',
        text: 'const tree = {\n  name: "Ancient Oak",\n  height: 28,\n  species: "oak",\n  evergreen: false,\n};\n\nconsole.log(tree.name);        // "Ancient Oak"\nconsole.log(tree["height"]);   // 28',
      },
      {
        type: 'p',
        text: 'You access properties with dot notation (tree.name) or bracket notation (tree["name"]) — both work, but dot notation is cleaner when you know the key upfront. You can add a new property at any time by assigning to it, and delete a property with the delete keyword.',
      },
      {
        type: 'tip',
        text: 'Use Object.keys(obj) to get an array of all property names, Object.values(obj) for all values, and Object.entries(obj) for [key, value] pairs. These are great when you want to loop over an object.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Create an object called sapling with at least three properties: name (string), height (number), and species (string). Then log sapling.name and the number of keys using Object.keys(sapling).length.',
      hints: [
        'An object uses curly braces. Each entry is a key, a colon, and a value — like name: "Birch". Separate entries with commas.',
        'Write const sapling = { name: "Birch", height: 3, species: "birch" }; — the existing console.log lines will then pass.',
      ],
      starter:
        '// Create your sapling object\n// your code here\n\nconsole.log(sapling.name);\nconsole.log(Object.keys(sapling).length);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof sapling === "object" && sapling !== null && typeof sapling.name === "string"',
          label: 'sapling is an object with a name string',
          hint: 'Give sapling a name property that holds a string value.',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof sapling.height === "number" && typeof sapling.species === "string"',
          label: 'sapling has a numeric height and string species',
        },
        {
          type: 'exprTruthy',
          expr: 'Object.keys(sapling).length >= 3',
          label: 'sapling has at least 3 properties',
        },
      ],
      solution:
        'const sapling = {\n  name: "Birch",\n  height: 3,\n  species: "birch",\n};\n\nconsole.log(sapling.name);\nconsole.log(Object.keys(sapling).length);\n',
    },
  },
  {
    id: 'js-arrays-objects-4',
    blocks: [
      {
        type: 'p',
        text: 'Destructuring is a shortcut for pulling values out of arrays and objects into named variables in a single line. Instead of writing three separate assignments, you describe the shape you expect and JavaScript unpacks it for you.',
      },
      {
        type: 'code',
        text: '// Object destructuring\nconst { name, height } = tree;\nconsole.log(name, height); // "Ancient Oak" 28\n\n// Array destructuring\nconst [first, second] = grove;\nconsole.log(first); // "Maple"\n\n// Spread: clone & merge\nconst taller = { ...tree, height: 35 };\nconsole.log(taller.height); // 35 — tree.height still 28',
      },
      {
        type: 'p',
        text: 'The spread operator (...) copies all properties of an object into a new object, or all items of an array into a new array. It is the cleanest way to create a modified copy without mutating the original. Mutation is the source of many hard-to-find bugs.',
      },
      {
        type: 'tip',
        text: 'You can rename while destructuring: const { name: treeName } = tree gives you treeName not name. And you can set a default: const { rings = 0 } = tree gives 0 if tree has no rings property.',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Destructure the name and height from the tree object below. Then use spread to create a new object called grownTree that is a copy of tree but with height increased by 5. Log grownTree.height.',
      hints: [
        'Destructuring uses curly braces on the left of =. Spread copies all properties with ... then you override any you want to change.',
        'Write const { name, height } = tree; then const grownTree = { ...tree, height: height + 5 };',
      ],
      starter:
        'const tree = { name: "Elm", height: 14, species: "elm" };\n\n// Destructure name and height\n// your code here\n\n// Create grownTree using spread\n// your code here\n\nconsole.log(grownTree.height);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'typeof name === "string" && typeof height === "number"',
          label: 'name and height are destructured into variables',
          hint: 'Use const { name, height } = tree; to pull both values out in one line.',
        },
        {
          type: 'exprTruthy',
          expr: 'typeof grownTree === "object" && grownTree.height === 19',
          label: 'grownTree has height increased by 5 (19)',
          hint: 'Spread tree into a new object and set height: tree.height + 5 to get 19.',
        },
        {
          type: 'logIncludes',
          text: '19',
          label: 'The new height 19 is logged',
        },
      ],
      solution:
        'const tree = { name: "Elm", height: 14, species: "elm" };\n\nconst { name, height } = tree;\n\nconst grownTree = { ...tree, height: height + 5 };\n\nconsole.log(grownTree.height);\n',
    },
  },
  {
    id: 'js-arrays-objects-5',
    blocks: [
      {
        type: 'p',
        text: 'Real programs model the world as data — a grove is an array of tree objects. You can combine everything from this topic: build an array of objects, filter it, map it, and reduce it to produce meaningful output about your grove.',
      },
      {
        type: 'code',
        text: 'const grove = [\n  { name: "Maple",  height: 22, evergreen: false },\n  { name: "Pine",   height: 30, evergreen: true  },\n  { name: "Birch",  height: 18, evergreen: false },\n  { name: "Spruce", height: 27, evergreen: true  },\n];\n\nconst evergreens = grove.filter(t => t.evergreen);\nconst names      = grove.map(t => t.name);\nconst tallest    = grove.reduce((a, b) => a.height > b.height ? a : b);\nconsole.log(evergreens.length, names, tallest.name);',
      },
      {
        type: 'p',
        text: 'Notice that reduce here returns a whole object, not a number — the accumulator can be anything. Returning the taller tree each time leaves you with the tallest one at the end. Arrays of objects and these three methods cover a huge percentage of everyday data work.',
      },
      {
        type: 'tip',
        text: 'When you find yourself writing a loop that builds a new array, ask: is this a map or a filter? When you are collapsing many values into one, it is a reduce. Naming the pattern makes your intent clear to future readers (including future you).',
      },
    ],
    exercise: {
      kind: 'js',
      instructions:
        'Given the grove array below, compute: evergreens (filter for evergreen: true), tallNames (map to just the names of trees with height >= 20), and totalHeight (reduce to the sum of all heights). Log all three.',
      hints: [
        'chain filter and map to get tallNames: first filter for height >= 20, then map to t.name. Use reduce with a starting value of 0 for totalHeight.',
        'Write const evergreens = grove.filter(t => t.evergreen); const tallNames = grove.filter(t => t.height >= 20).map(t => t.name); const totalHeight = grove.reduce((sum, t) => sum + t.height, 0);',
      ],
      starter:
        'const grove = [\n  { name: "Maple",  height: 22, evergreen: false },\n  { name: "Pine",   height: 30, evergreen: true  },\n  { name: "Birch",  height: 18, evergreen: false },\n  { name: "Spruce", height: 27, evergreen: true  },\n];\n\n// your code here\n\nconsole.log(evergreens);\nconsole.log(tallNames);\nconsole.log(totalHeight);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(evergreens) && evergreens.length === 2 && evergreens.every(t => t.evergreen)',
          label: 'evergreens contains the 2 evergreen trees',
          hint: 'Filter grove by t.evergreen === true and store the result in evergreens.',
        },
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(tallNames) && tallNames.length === 3 && tallNames.every(n => typeof n === "string")',
          label: 'tallNames contains the 3 trees with height >= 20 as strings',
          hint: 'Filter for height >= 20 first, then map each tree to t.name to get an array of strings.',
        },
        {
          type: 'exprTruthy',
          expr: 'totalHeight === 97',
          label: 'totalHeight equals 97',
        },
      ],
      solution:
        'const grove = [\n  { name: "Maple",  height: 22, evergreen: false },\n  { name: "Pine",   height: 30, evergreen: true  },\n  { name: "Birch",  height: 18, evergreen: false },\n  { name: "Spruce", height: 27, evergreen: true  },\n];\n\nconst evergreens = grove.filter(t => t.evergreen);\nconst tallNames = grove.filter(t => t.height >= 20).map(t => t.name);\nconst totalHeight = grove.reduce((sum, t) => sum + t.height, 0);\n\nconsole.log(evergreens);\nconsole.log(tallNames);\nconsole.log(totalHeight);\n',
    },
  },
];

export default lessons;
