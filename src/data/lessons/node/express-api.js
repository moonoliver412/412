// Topic: Express API (express-api) — 5 lessons.

const lessons = [
  {
    id: 'express-api-1',
    blocks: [
      {
        type: 'p',
        text: 'POST requests carry a body — data the client sends to the server. Express reads that body with middleware.',
      },
      {
        type: 'p',
        text: 'Add app.use(express.json()) before your routes. It parses JSON bodies and puts them on req.body.',
      },
      {
        type: 'code',
        text: 'var express = require("express");\nvar app = express();\napp.use(express.json());\n\napp.post("/echo", function (req, res) {\n  res.json(req.body);\n});',
      },
      {
        type: 'tip',
        text: 'Without express.json(), req.body is undefined. Always add it before POST routes.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Create an app with express.json() middleware. Add a POST route at "/echo" that responds with the request body as JSON.',
      starter: 'var express = require("express");\nvar app = express();\n// add middleware and route\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "POST", "/echo", { msg: "hi" }).body.msg === "hi"',
          label: 'POST /echo returns the body',
          hint: 'app.post("/echo", function(req, res) { res.json(req.body); });',
        },
        {
          type: 'sourceIncludes',
          text: 'express.json()',
          label: 'You added express.json() middleware',
          hint: 'app.use(express.json()); — put this before your routes.',
        },
      ],
      hints: [
        'app.use(express.json()); goes right after creating the app.',
        'app.post("/echo", function(req, res) { res.json(req.body); });',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\napp.post("/echo", function (req, res) {\n  res.json(req.body);\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-api-2',
    blocks: [
      {
        type: 'p',
        text: 'HTTP status codes tell the client what happened. 200 means OK. 201 means Created. 400 means bad request. 404 means not found.',
      },
      {
        type: 'code',
        text: 'app.post("/items", function (req, res) {\n  if (!req.body.name) {\n    return res.status(400).json({ error: "name required" });\n  }\n  res.status(201).json({ created: req.body.name });\n});',
      },
      {
        type: 'p',
        text: 'res.status(n) sets the code. Chain .json() or .send() after it to also send a body.',
      },
      {
        type: 'tip',
        text: 'Always send 201 when you create something new. It tells clients the request was handled differently from a normal 200 read.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Add a POST route at "/notes". If req.body.text exists, respond with status 201 and JSON { saved: true, text: req.body.text }. If not, respond with status 400 and { error: "text required" }.',
      starter: 'var express = require("express");\nvar app = express();\napp.use(express.json());\n// add your route\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "POST", "/notes", { text: "hello" }).status === 201',
          label: 'Valid POST /notes returns 201',
          hint: 'res.status(201).json({ saved: true, text: req.body.text });',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "POST", "/notes", { text: "hello" }).body.saved === true',
          label: 'Body includes saved: true',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "POST", "/notes", {}).status === 400',
          label: 'Missing text returns 400',
          hint: 'if (!req.body.text) { return res.status(400).json({ error: "text required" }); }',
        },
      ],
      hints: [
        'Check if (req.body.text) to branch between 201 and 400.',
        'res.status(201).json({...}); and res.status(400).json({...});',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\napp.post("/notes", function (req, res) {\n  if (!req.body.text) {\n    return res.status(400).json({ error: "text required" });\n  }\n  res.status(201).json({ saved: true, text: req.body.text });\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-api-3',
    blocks: [
      {
        type: 'p',
        text: 'An in-memory store is just a plain array declared outside your routes. Routes read and write it directly.',
      },
      {
        type: 'code',
        text: 'var items = [];\n\napp.get("/items", function (req, res) {\n  res.json(items);\n});\n\napp.post("/items", function (req, res) {\n  items.push(req.body);\n  res.status(201).json(req.body);\n});',
      },
      {
        type: 'p',
        text: 'The array lives in memory. It resets when the server restarts. For learning, that is perfect.',
      },
      {
        type: 'tip',
        text: 'This is the simplest possible database. Real apps use a real DB, but the route logic looks almost identical.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Create an in-memory list called todos (start empty). GET "/todos" returns the array as JSON. POST "/todos" pushes req.body into the array and returns status 201 with the new item.',
      starter: 'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar todos = [];\n// add GET and POST routes\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ request(app, "POST", "/todos", { task: "learn Node" }); return Array.isArray(request(app, "GET", "/todos").body); })()',
          label: 'GET /todos returns an array',
          hint: 'app.get("/todos", function(req, res) { res.json(todos); });',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ request(app, "POST", "/todos", { task: "test" }); var list = request(app, "GET", "/todos").body; return list.some(function(t){ return t.task === "test"; }); })()',
          label: 'POSTed items appear in GET /todos',
          hint: 'todos.push(req.body);',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "POST", "/todos", { task: "ship it" }).status === 201',
          label: 'POST /todos returns 201',
        },
      ],
      hints: [
        'app.get("/todos", function(req, res) { res.json(todos); });',
        'app.post("/todos", function(req, res) { todos.push(req.body); res.status(201).json(req.body); });',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar todos = [];\napp.get("/todos", function (req, res) { res.json(todos); });\napp.post("/todos", function (req, res) { todos.push(req.body); res.status(201).json(req.body); });\napp.listen(3000);',
    },
  },
  {
    id: 'express-api-4',
    blocks: [
      {
        type: 'p',
        text: 'DELETE removes an item. You identify it by ID in the route param, then splice it out of the array.',
      },
      {
        type: 'code',
        text: 'app.delete("/items/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var idx = items.findIndex(function (i) { return i.id === id; });\n  if (idx === -1) return res.status(404).json({ error: "not found" });\n  items.splice(idx, 1);\n  res.json({ deleted: id });\n});',
      },
      {
        type: 'p',
        text: 'findIndex() returns -1 when nothing matches. Always check for -1 and return 404 before you try to splice.',
      },
      {
        type: 'tip',
        text: 'PUT is used the same way but replaces the item instead of removing it. The pattern is identical.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Start with an array of books (provided). Add DELETE "/books/:id" that removes the book whose id matches, returning { deleted: id } on success or status 404 + { error: "not found" } if missing.',
      starter:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [\n  { id: 1, title: "Dune" },\n  { id: 2, title: "Neuromancer" },\n  { id: 3, title: "Snow Crash" },\n];\n// add DELETE route\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "DELETE", "/books/2").body.deleted === 2',
          label: 'DELETE /books/2 returns { deleted: 2 }',
          hint: 'var id = parseInt(req.params.id); and find + splice.',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "DELETE", "/books/99").status === 404',
          label: 'Unknown id returns 404',
          hint: 'if (idx === -1) return res.status(404).json({ error: "not found" });',
        },
      ],
      hints: [
        'var id = parseInt(req.params.id); var idx = books.findIndex(function(b){ return b.id === id; });',
        'if (idx === -1) return res.status(404).json({ error: "not found" }); books.splice(idx,1); res.json({ deleted: id });',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [\n  { id: 1, title: "Dune" },\n  { id: 2, title: "Neuromancer" },\n  { id: 3, title: "Snow Crash" },\n];\napp.delete("/books/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var idx = books.findIndex(function (b) { return b.id === id; });\n  if (idx === -1) return res.status(404).json({ error: "not found" });\n  books.splice(idx, 1);\n  res.json({ deleted: id });\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-api-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone. Build a full CRUD API — Create, Read, Update, Delete — all in one Express app with an in-memory store.',
      },
      {
        type: 'p',
        text: 'CRUD maps to HTTP methods: POST = create, GET = read, PUT = update, DELETE = delete.',
      },
      {
        type: 'code',
        text: '// POST   /tasks        -> add a task\n// GET    /tasks        -> list all\n// PUT    /tasks/:id    -> update one\n// DELETE /tasks/:id    -> remove one',
      },
      {
        type: 'tip',
        text: 'Every REST API you ever build follows this same four-verb pattern. You now know the core of the web.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Build a tasks CRUD API. var tasks = []; POST /tasks pushes { id: Date.now(), ...req.body } and returns 201. GET /tasks returns the array. PUT /tasks/:id finds by id and merges req.body, returning the updated item or 404. DELETE /tasks/:id removes and returns { deleted: id } or 404.',
      starter: 'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar tasks = [];\n// add 4 routes\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ var r = request(app, "POST", "/tasks", { title: "buy milk" }); return r.status === 201 && r.body.title === "buy milk"; })()',
          label: 'POST /tasks creates a task with status 201',
          hint: 'tasks.push({ id: Date.now(), ...req.body }); — or Object.assign({ id: Date.now() }, req.body);',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ request(app, "POST", "/tasks", { title: "wash car" }); return Array.isArray(request(app, "GET", "/tasks").body); })()',
          label: 'GET /tasks returns an array',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "DELETE", "/tasks/999").status === 404',
          label: 'DELETE unknown id returns 404',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "PUT", "/tasks/999", { title: "x" }).status === 404',
          label: 'PUT unknown id returns 404',
        },
      ],
      hints: [
        'For POST: var task = Object.assign({ id: Date.now() }, req.body); tasks.push(task); res.status(201).json(task);',
        'For PUT/DELETE: var id = parseInt(req.params.id); var idx = tasks.findIndex(function(t){ return t.id === id; });',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar tasks = [];\napp.post("/tasks", function (req, res) {\n  var task = Object.assign({ id: Date.now() }, req.body);\n  tasks.push(task);\n  res.status(201).json(task);\n});\napp.get("/tasks", function (req, res) { res.json(tasks); });\napp.put("/tasks/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var idx = tasks.findIndex(function (t) { return t.id === id; });\n  if (idx === -1) return res.status(404).json({ error: "not found" });\n  Object.assign(tasks[idx], req.body);\n  res.json(tasks[idx]);\n});\napp.delete("/tasks/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var idx = tasks.findIndex(function (t) { return t.id === id; });\n  if (idx === -1) return res.status(404).json({ error: "not found" });\n  tasks.splice(idx, 1);\n  res.json({ deleted: id });\n});\napp.listen(3000);',
    },
  },
];

export default lessons;
