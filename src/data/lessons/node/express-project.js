// Topic: Express Project (express-project) — 5 lessons.

const lessons = [
  {
    id: 'express-project-1',
    blocks: [
      {
        type: 'p',
        text: 'You are building a real API step by step across this topic. Each lesson adds one piece until you have a working back end.',
      },
      {
        type: 'p',
        text: 'First, plan your data shape. An API for a book club needs books. Each book has an id, a title, and an author.',
      },
      {
        type: 'code',
        text: 'var books = [\n  { id: 1, title: "The Martian", author: "Andy Weir" },\n  { id: 2, title: "Ready Player One", author: "Ernest Cline" },\n];',
      },
      {
        type: 'tip',
        text: 'Designing your data before writing routes saves a lot of rewrites. Spend one minute thinking before coding.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Create an Express app. Declare a books array with at least 2 objects (each has id, title, author). Add GET "/books" that returns the full array as JSON.',
      starter: 'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [];\n// populate books and add GET /books\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(request(app, "GET", "/books").body) && request(app, "GET", "/books").body.length >= 2',
          label: 'GET /books returns at least 2 books',
          hint: 'app.get("/books", function(req, res) { res.json(books); });',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/books").body.every(function(b){ return b.id && b.title && b.author; })',
          label: 'Every book has id, title, and author',
          hint: 'Make sure each object in your array has all three keys.',
        },
      ],
      hints: [
        'Add at least 2 book objects to the books array, each with id, title, and author.',
        'app.get("/books", function(req, res) { res.json(books); });',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [\n  { id: 1, title: "The Martian", author: "Andy Weir" },\n  { id: 2, title: "Ready Player One", author: "Ernest Cline" },\n];\napp.get("/books", function (req, res) { res.json(books); });\napp.listen(3000);',
    },
  },
  {
    id: 'express-project-2',
    blocks: [
      {
        type: 'p',
        text: 'Now add the ability to fetch one book by id, and handle the case where the book does not exist.',
      },
      {
        type: 'code',
        text: 'app.get("/books/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var book = books.find(function (b) { return b.id === id; });\n  if (!book) return res.status(404).json({ error: "not found" });\n  res.json(book);\n});',
      },
      {
        type: 'p',
        text: 'find() returns the first item that passes the test, or undefined if none do.',
      },
      {
        type: 'tip',
        text: 'Always handle the not-found case. An API that crashes or hangs on a missing item is broken.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Build the same books array as before. Add GET "/books" and GET "/books/:id". The :id route returns the matching book or status 404 + { error: "not found" }.',
      starter: 'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [\n  { id: 1, title: "The Martian", author: "Andy Weir" },\n  { id: 2, title: "Ready Player One", author: "Ernest Cline" },\n];\n// add both routes\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/books/1").body.title === "The Martian"',
          label: 'GET /books/1 returns The Martian',
          hint: 'var book = books.find(function(b){ return b.id === parseInt(req.params.id); });',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/books/99").status === 404',
          label: 'GET /books/99 returns 404',
          hint: 'if (!book) return res.status(404).json({ error: "not found" });',
        },
      ],
      hints: [
        'app.get("/books/:id", function(req, res) { var id = parseInt(req.params.id); ... });',
        'var book = books.find(function(b){ return b.id === id; }); then check if (!book).',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [\n  { id: 1, title: "The Martian", author: "Andy Weir" },\n  { id: 2, title: "Ready Player One", author: "Ernest Cline" },\n];\napp.get("/books", function (req, res) { res.json(books); });\napp.get("/books/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var book = books.find(function (b) { return b.id === id; });\n  if (!book) return res.status(404).json({ error: "not found" });\n  res.json(book);\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-project-3',
    blocks: [
      {
        type: 'p',
        text: 'Time to add Create. A POST route reads req.body, assigns a new id, pushes the book, and returns 201.',
      },
      {
        type: 'code',
        text: 'var nextId = 3;\napp.post("/books", function (req, res) {\n  var book = { id: nextId++, title: req.body.title, author: req.body.author };\n  books.push(book);\n  res.status(201).json(book);\n});',
      },
      {
        type: 'p',
        text: 'nextId++ gives the current value and then increments it. Every new book gets a unique id.',
      },
      {
        type: 'tip',
        text: 'Validate req.body.title before pushing. If it is missing, send 400 right away.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Keep the books array and GET /books. Add POST "/books". If req.body.title or req.body.author is missing, return status 400 + { error: "title and author required" }. Otherwise push a new book with a unique id, return status 201 + the new book.',
      starter: 'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [\n  { id: 1, title: "The Martian", author: "Andy Weir" },\n];\nvar nextId = 2;\n// add POST /books\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ var r = request(app, "POST", "/books", { title: "Ender\'s Game", author: "Orson Scott Card" }); return r.status === 201 && r.body.title === "Ender\'s Game"; })()',
          label: 'Valid POST returns 201 with new book',
          hint: 'var book = { id: nextId++, title: req.body.title, author: req.body.author };',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "POST", "/books", { title: "Oops" }).status === 400',
          label: 'Missing author returns 400',
          hint: 'if (!req.body.title || !req.body.author) return res.status(400).json({ error: "title and author required" });',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ request(app, "POST", "/books", { title: "New", author: "Writer" }); return request(app, "GET", "/books").body.length >= 2; })()',
          label: 'New book appears in GET /books',
        },
      ],
      hints: [
        'Check !req.body.title || !req.body.author first and return 400.',
        'var book = { id: nextId++, title: req.body.title, author: req.body.author }; books.push(book); res.status(201).json(book);',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [{ id: 1, title: "The Martian", author: "Andy Weir" }];\nvar nextId = 2;\napp.get("/books", function (req, res) { res.json(books); });\napp.post("/books", function (req, res) {\n  if (!req.body.title || !req.body.author) {\n    return res.status(400).json({ error: "title and author required" });\n  }\n  var book = { id: nextId++, title: req.body.title, author: req.body.author };\n  books.push(book);\n  res.status(201).json(book);\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-project-4',
    blocks: [
      {
        type: 'p',
        text: 'Add search. A query param lets clients filter results without a separate route.',
      },
      {
        type: 'code',
        text: '// GET /books?author=Andy+Weir\napp.get("/books", function (req, res) {\n  var list = books;\n  if (req.query.author) {\n    list = books.filter(function (b) {\n      return b.author.toLowerCase().includes(req.query.author.toLowerCase());\n    });\n  }\n  res.json(list);\n});',
      },
      {
        type: 'p',
        text: 'includes() checks if one string contains another. Lowercasing both sides makes the search case-insensitive.',
      },
      {
        type: 'tip',
        text: 'This same pattern works for any field. Just swap "author" for "title" or any other key.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Build GET "/books" that returns all books, but if req.query.author is set, filters to books whose author contains that string (case-insensitive). Also keep GET "/books/:id" returning a single book or 404.',
      starter: 'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [\n  { id: 1, title: "The Martian", author: "Andy Weir" },\n  { id: 2, title: "Ready Player One", author: "Ernest Cline" },\n  { id: 3, title: "Artemis", author: "Andy Weir" },\n];\n// add filtered GET /books and GET /books/:id\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/books").body.length === 3',
          label: 'GET /books with no filter returns all 3',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var r = request(app, "GET", "/books?author=Andy%20Weir"); return r.body.length === 2 && r.body.every(function(b){ return b.author === "Andy Weir"; }); })()',
          label: 'GET /books?author=Andy%20Weir returns 2 books',
          hint: 'b.author.toLowerCase().includes(req.query.author.toLowerCase())',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/books/2").body.title === "Ready Player One"',
          label: 'GET /books/2 returns the right book',
        },
      ],
      hints: [
        'var list = books; if (req.query.author) { list = books.filter(...); } res.json(list);',
        'For :id: var book = books.find(function(b){ return b.id === parseInt(req.params.id); });',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [\n  { id: 1, title: "The Martian", author: "Andy Weir" },\n  { id: 2, title: "Ready Player One", author: "Ernest Cline" },\n  { id: 3, title: "Artemis", author: "Andy Weir" },\n];\napp.get("/books", function (req, res) {\n  var list = books;\n  if (req.query.author) {\n    list = books.filter(function (b) {\n      return b.author.toLowerCase().includes(req.query.author.toLowerCase());\n    });\n  }\n  res.json(list);\n});\napp.get("/books/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var book = books.find(function (b) { return b.id === id; });\n  if (!book) return res.status(404).json({ error: "not found" });\n  res.json(book);\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-project-5',
    blocks: [
      {
        type: 'p',
        text: 'Final capstone. You are building the full book club API in one shot: list, get one, create, and delete. Everything you learned across this track comes together here.',
      },
      {
        type: 'p',
        text: 'When you ship this, you have built a real REST API from scratch. That is a skill most people take months to pick up.',
      },
      {
        type: 'code',
        text: '// GET  /books          -> all books\n// GET  /books/:id       -> one book or 404\n// POST /books           -> create (needs title + author)\n// DELETE /books/:id     -> remove or 404',
      },
      {
        type: 'tip',
        text: 'Take it one route at a time. Write it, test it mentally, then move to the next.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Build the complete book club API. Start with books = [{ id:1, title:"The Martian", author:"Andy Weir" }] and nextId = 2. Four routes: GET /books, GET /books/:id (404 if missing), POST /books (400 if title or author missing, else 201), DELETE /books/:id (404 if missing, else { deleted: id }).',
      starter: 'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [{ id: 1, title: "The Martian", author: "Andy Weir" }];\nvar nextId = 2;\n// add 4 routes\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'Array.isArray(request(app, "GET", "/books").body)',
          label: 'GET /books returns an array',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/books/1").body.title === "The Martian"',
          label: 'GET /books/1 returns The Martian',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var r = request(app, "POST", "/books", { title: "Dune", author: "Frank Herbert" }); return r.status === 201 && r.body.author === "Frank Herbert"; })()',
          label: 'POST /books creates a book with status 201',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var r = request(app, "DELETE", "/books/1"); return r.body.deleted === 1 && request(app, "GET", "/books/1").status === 404; })()',
          label: 'DELETE /books/1 removes it and GET /books/1 then returns 404',
          hint: 'Make sure both the DELETE and the subsequent GET /books/:id work correctly.',
        },
      ],
      hints: [
        'Four separate app.get/post/delete calls. Build them one at a time.',
        'For DELETE: splice the item out, then res.json({ deleted: id }). For POST: check title + author, push, return 201.',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.use(express.json());\nvar books = [{ id: 1, title: "The Martian", author: "Andy Weir" }];\nvar nextId = 2;\napp.get("/books", function (req, res) { res.json(books); });\napp.get("/books/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var book = books.find(function (b) { return b.id === id; });\n  if (!book) return res.status(404).json({ error: "not found" });\n  res.json(book);\n});\napp.post("/books", function (req, res) {\n  if (!req.body.title || !req.body.author) {\n    return res.status(400).json({ error: "title and author required" });\n  }\n  var book = { id: nextId++, title: req.body.title, author: req.body.author };\n  books.push(book);\n  res.status(201).json(book);\n});\napp.delete("/books/:id", function (req, res) {\n  var id = parseInt(req.params.id);\n  var idx = books.findIndex(function (b) { return b.id === id; });\n  if (idx === -1) return res.status(404).json({ error: "not found" });\n  books.splice(idx, 1);\n  res.json({ deleted: id });\n});\napp.listen(3000);',
    },
  },
];

export default lessons;
