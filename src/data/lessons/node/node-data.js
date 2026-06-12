// Topic: Node Data (node-data) — 5 lessons.

const lessons = [
  {
    id: 'node-data-1',
    blocks: [
      {
        type: 'p',
        text: 'Data travels between servers as JSON — JavaScript Object Notation. It looks like a JS object but it is just text.',
      },
      {
        type: 'p',
        text: 'JSON.stringify() turns an object into a JSON string. JSON.parse() turns a JSON string back into an object.',
      },
      {
        type: 'code',
        text: 'var user = { name: "Sam", age: 17 };\nvar json = JSON.stringify(user);\nconsole.log(json); // \'{"name":"Sam","age":17}\'\nvar back = JSON.parse(json);\nconsole.log(back.name); // "Sam"',
      },
      {
        type: 'tip',
        text: 'JSON keys must use double quotes. JS objects are more flexible. That is the only big difference.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Create an object called book with keys title ("Dune") and pages (412). Stringify it into a variable called json, then parse it back into a variable called parsed. Log parsed.title.',
      starter: '// create book, stringify, parse\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ var book = { title: "Dune", pages: 412 }; return JSON.parse(JSON.stringify(book)).title === "Dune"; })()',
          label: 'book has the right shape',
          hint: 'var book = { title: "Dune", pages: 412 };',
        },
        {
          type: 'sourceIncludes',
          text: 'JSON.stringify',
          label: 'You called JSON.stringify',
        },
        {
          type: 'logIncludes',
          text: 'Dune',
          label: 'You logged parsed.title',
          hint: 'console.log(parsed.title);',
        },
      ],
      hints: [
        'var json = JSON.stringify(book); var parsed = JSON.parse(json);',
        'Then console.log(parsed.title);',
      ],
      solution:
        'var book = { title: "Dune", pages: 412 };\nvar json = JSON.stringify(book);\nvar parsed = JSON.parse(json);\nconsole.log(parsed.title);',
    },
  },
  {
    id: 'node-data-2',
    blocks: [
      {
        type: 'p',
        text: 'Most real data is an array of records — like a list of users or products. Each record is an object with the same keys.',
      },
      {
        type: 'code',
        text: 'var products = [\n  { id: 1, name: "Pen", price: 1.5 },\n  { id: 2, name: "Notebook", price: 4.0 },\n];',
      },
      {
        type: 'p',
        text: 'You can loop the array with forEach or map to read every record.',
      },
      {
        type: 'tip',
        text: 'This is exactly what a database table looks like when it arrives as JSON. You will use this pattern in every API you build.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Create an array called fruits with three objects. Each object has a name (string) and calories (number). Use forEach to log each fruit\'s name.',
      starter: 'var fruits = [\n  // add 3 fruit objects\n];\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(fruits) && fruits.length === 3',
          label: 'fruits has 3 items',
          hint: 'Add 3 objects: { name: "apple", calories: 95 }',
        },
        {
          type: 'exprTruthy',
          expr: 'fruits.every(function(f){ return typeof f.name === "string" && typeof f.calories === "number"; })',
          label: 'Each fruit has a name and calories',
        },
        {
          type: 'sourceIncludes',
          text: 'forEach',
          label: 'You used forEach to loop',
          hint: 'fruits.forEach(function(f){ console.log(f.name); });',
        },
      ],
      hints: [
        'Each object: { name: "apple", calories: 95 }. Pick any 3 real fruits.',
        'fruits.forEach(function(f) { console.log(f.name); });',
      ],
      solution:
        'var fruits = [\n  { name: "apple", calories: 95 },\n  { name: "banana", calories: 89 },\n  { name: "mango", calories: 60 },\n];\nfruits.forEach(function (f) { console.log(f.name); });',
    },
  },
  {
    id: 'node-data-3',
    blocks: [
      {
        type: 'p',
        text: 'map() transforms an array into a new array. It runs a function on each item and collects the results.',
      },
      {
        type: 'code',
        text: 'var prices = [10, 20, 30];\nvar discounted = prices.map(function (p) { return p * 0.9; });\nconsole.log(discounted); // [9, 18, 27]',
      },
      {
        type: 'p',
        text: 'map() never changes the original array. You get a brand-new one back.',
      },
      {
        type: 'tip',
        text: 'filter() works the same way but keeps only items where your function returns true.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'You have an array of user objects. Use map() to create a new array called names that contains only each user\'s name string. Export names.',
      starter:
        'var users = [\n  { id: 1, name: "Jordan", score: 88 },\n  { id: 2, name: "Riley", score: 72 },\n  { id: 3, name: "Casey", score: 95 },\n];\n// create names with map()\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(module.exports.names) && module.exports.names.length === 3',
          label: 'names has 3 items',
          hint: 'var names = users.map(function(u){ return u.name; });',
        },
        {
          type: 'exprTruthy',
          expr: 'module.exports.names[0] === "Jordan" && module.exports.names[2] === "Casey"',
          label: 'names contains the correct name strings',
        },
        {
          type: 'sourceIncludes',
          text: '.map(',
          label: 'You used .map()',
        },
      ],
      hints: [
        'var names = users.map(function(u) { return u.name; });',
        'Then module.exports.names = names;',
      ],
      solution:
        'var users = [\n  { id: 1, name: "Jordan", score: 88 },\n  { id: 2, name: "Riley", score: 72 },\n  { id: 3, name: "Casey", score: 95 },\n];\nvar names = users.map(function (u) { return u.name; });\nmodule.exports.names = names;',
    },
  },
  {
    id: 'node-data-4',
    blocks: [
      {
        type: 'p',
        text: 'filter() keeps only the items that pass a test. It returns a new array — the original stays the same.',
      },
      {
        type: 'code',
        text: 'var scores = [45, 80, 92, 58, 76];\nvar passing = scores.filter(function (s) { return s >= 60; });\nconsole.log(passing); // [80, 92, 76]',
      },
      {
        type: 'p',
        text: 'You can chain map and filter. Filter first to narrow down, then map to reshape.',
      },
      {
        type: 'tip',
        text: 'find() is like filter() but stops at the first match and returns that one item (not an array).',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Start with the products array below. Export a variable called expensive that contains only products with price > 20, and a variable called names that maps expensive to just the name strings.',
      starter:
        'var products = [\n  { id: 1, name: "Pen", price: 1.5 },\n  { id: 2, name: "Headphones", price: 49.99 },\n  { id: 3, name: "Notebook", price: 4 },\n  { id: 4, name: "Keyboard", price: 79 },\n];\n// filter and map\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(module.exports.expensive) && module.exports.expensive.length === 2',
          label: 'expensive has 2 items (price > 20)',
          hint: 'var expensive = products.filter(function(p){ return p.price > 20; });',
        },
        {
          type: 'exprTruthy',
          expr: 'module.exports.expensive.every(function(p){ return p.price > 20; })',
          label: 'Every item in expensive costs more than 20',
        },
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(module.exports.names) && module.exports.names.includes("Headphones") && module.exports.names.includes("Keyboard")',
          label: 'names lists the expensive product names',
          hint: 'var names = expensive.map(function(p){ return p.name; });',
        },
      ],
      hints: [
        'var expensive = products.filter(function(p) { return p.price > 20; });',
        'var names = expensive.map(function(p) { return p.name; }); then export both.',
      ],
      solution:
        'var products = [\n  { id: 1, name: "Pen", price: 1.5 },\n  { id: 2, name: "Headphones", price: 49.99 },\n  { id: 3, name: "Notebook", price: 4 },\n  { id: 4, name: "Keyboard", price: 79 },\n];\nvar expensive = products.filter(function (p) { return p.price > 20; });\nvar names = expensive.map(function (p) { return p.name; });\nmodule.exports.expensive = expensive;\nmodule.exports.names = names;',
    },
  },
  {
    id: 'node-data-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone. Real servers receive JSON, transform it, and send back new JSON. You now have all the tools: parse, stringify, map, filter.',
      },
      {
        type: 'p',
        text: 'Here is the full pipeline: raw JSON string in, processed data out.',
      },
      {
        type: 'code',
        text: 'var raw = \'[{"name":"Ana","score":82},{"name":"Bo","score":54}]\';\nvar data = JSON.parse(raw);\nvar passing = data.filter(function (s) { return s.score >= 60; });\nconsole.log(JSON.stringify(passing));',
      },
      {
        type: 'tip',
        text: 'Every API you build will do something like this. You are already thinking like a back-end developer.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Parse the JSON string below into an array. Filter to keep only items where active is true. Map the result to objects with just id and name. Export the final array as activeUsers and log its length.',
      starter:
        'var raw = \'[{"id":1,"name":"Alex","active":true},{"id":2,"name":"Sam","active":false},{"id":3,"name":"Lee","active":true}]\';\n// parse, filter, map\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(module.exports.activeUsers) && module.exports.activeUsers.length === 2',
          label: 'activeUsers has 2 items',
          hint: 'Filter where item.active === true.',
        },
        {
          type: 'exprTruthy',
          expr: 'module.exports.activeUsers.every(function(u){ return Object.keys(u).sort().join(",") === "id,name"; })',
          label: 'Each item has only id and name',
          hint: 'map to return { id: u.id, name: u.name }',
        },
        {
          type: 'logIncludes',
          text: '2',
          label: 'You logged the count (2)',
          hint: 'console.log(module.exports.activeUsers.length);',
        },
      ],
      hints: [
        'var data = JSON.parse(raw); var filtered = data.filter(function(u){ return u.active; });',
        'var activeUsers = filtered.map(function(u){ return { id: u.id, name: u.name }; }); then export and log length.',
      ],
      solution:
        'var raw = \'[{"id":1,"name":"Alex","active":true},{"id":2,"name":"Sam","active":false},{"id":3,"name":"Lee","active":true}]\';\nvar data = JSON.parse(raw);\nvar filtered = data.filter(function (u) { return u.active; });\nvar activeUsers = filtered.map(function (u) { return { id: u.id, name: u.name }; });\nmodule.exports.activeUsers = activeUsers;\nconsole.log(activeUsers.length);',
    },
  },
];

export default lessons;
