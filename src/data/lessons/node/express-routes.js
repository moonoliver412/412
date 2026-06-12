// Topic: Express Routes (express-routes) — 5 lessons.

const lessons = [
  {
    id: 'express-routes-1',
    blocks: [
      {
        type: 'p',
        text: 'Express is a Node package that makes routing clean. Instead of one big if/else, you register each route with app.get(), app.post(), and so on.',
      },
      {
        type: 'code',
        text: 'var express = require("express");\nvar app = express();\n\napp.get("/", function (req, res) {\n  res.send("Home page");\n});\n\napp.listen(3000);',
      },
      {
        type: 'p',
        text: 'app.get(path, handler) says: when a GET request arrives at path, run handler. That is the whole idea.',
      },
      {
        type: 'tip',
        text: 'res.send() works for text or objects. res.json() is the same but always sets the Content-Type to JSON.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Create an Express app. Add a GET route at "/" that responds with the text "Hello Express!". Call app.listen(3000).',
      starter: 'var express = require("express");\nvar app = express();\n// add your route\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/").body === "Hello Express!"',
          label: 'GET / responds with "Hello Express!"',
          hint: 'app.get("/", function(req, res) { res.send("Hello Express!"); });',
        },
        {
          type: 'sourceIncludes',
          text: 'app.listen',
          label: 'You called app.listen',
        },
      ],
      hints: [
        'app.get("/", function(req, res) { res.send("Hello Express!"); });',
        'Then app.listen(3000); at the bottom.',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.get("/", function (req, res) {\n  res.send("Hello Express!");\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-routes-2',
    blocks: [
      {
        type: 'p',
        text: 'You can add as many routes as you want. Each one handles a different path.',
      },
      {
        type: 'code',
        text: 'app.get("/hello", function (req, res) {\n  res.send("Hello!");\n});\napp.get("/bye", function (req, res) {\n  res.send("Goodbye!");\n});',
      },
      {
        type: 'p',
        text: 'Express matches the path exactly. A request to "/hello" never triggers the "/bye" handler.',
      },
      {
        type: 'tip',
        text: 'Order matters. Express tries routes in the order you registered them and stops at the first match.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Add two GET routes. "/dogs" should respond with "Woof!". "/cats" should respond with "Meow!".',
      starter: 'var express = require("express");\nvar app = express();\n// add two routes\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/dogs").body === "Woof!"',
          label: 'GET /dogs responds with "Woof!"',
          hint: 'app.get("/dogs", function(req, res) { res.send("Woof!"); });',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/cats").body === "Meow!"',
          label: 'GET /cats responds with "Meow!"',
          hint: 'app.get("/cats", function(req, res) { res.send("Meow!"); });',
        },
      ],
      hints: [
        'app.get("/dogs", function(req, res) { res.send("Woof!"); });',
        'app.get("/cats", function(req, res) { res.send("Meow!"); });',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.get("/dogs", function (req, res) { res.send("Woof!"); });\napp.get("/cats", function (req, res) { res.send("Meow!"); });\napp.listen(3000);',
    },
  },
  {
    id: 'express-routes-3',
    blocks: [
      {
        type: 'p',
        text: 'Route parameters let one route handle many different values. A colon in the path marks a parameter.',
      },
      {
        type: 'code',
        text: 'app.get("/users/:id", function (req, res) {\n  res.send("User " + req.params.id);\n});\n// GET /users/42  ->  "User 42"\n// GET /users/99  ->  "User 99"',
      },
      {
        type: 'p',
        text: 'req.params is an object. The key matches the name after the colon. The value is whatever was in the URL.',
      },
      {
        type: 'tip',
        text: 'Route params are always strings, even if the value looks like a number. Use parseInt() when you need math.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Add a GET route at "/greet/:name" that responds with "Hey, " + the name param + "!".',
      starter: 'var express = require("express");\nvar app = express();\n// add your route\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/greet/Jordan").body === "Hey, Jordan!"',
          label: 'GET /greet/Jordan responds with "Hey, Jordan!"',
          hint: 'res.send("Hey, " + req.params.name + "!");',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/greet/Sam").body === "Hey, Sam!"',
          label: 'Works for any name',
        },
      ],
      hints: [
        'app.get("/greet/:name", function(req, res) { ... });',
        'res.send("Hey, " + req.params.name + "!");',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.get("/greet/:name", function (req, res) {\n  res.send("Hey, " + req.params.name + "!");\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-routes-4',
    blocks: [
      {
        type: 'p',
        text: 'Query strings are key=value pairs after a ? in the URL. Express parses them into req.query automatically.',
      },
      {
        type: 'code',
        text: '// GET /search?term=node\napp.get("/search", function (req, res) {\n  var term = req.query.term;\n  res.send("You searched: " + term);\n});',
      },
      {
        type: 'p',
        text: 'req.query is just an object. If the URL is /search?term=express&lang=js, then req.query.term is "express" and req.query.lang is "js".',
      },
      {
        type: 'tip',
        text: 'Query strings are for optional filters and search. Route params are for required IDs.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Add a GET route at "/calc" that reads two query params: a and b. Respond with their sum as a number. Example: /calc?a=3&b=4 -> 7.',
      starter: 'var express = require("express");\nvar app = express();\n// add your route\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/calc?a=3&b=4").body === 7',
          label: '/calc?a=3&b=4 returns 7',
          hint: 'res.send(parseInt(req.query.a) + parseInt(req.query.b)); — note: res.send with a number sets body to that number.',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/calc?a=10&b=5").body === 15',
          label: 'Works for different numbers too',
        },
      ],
      hints: [
        'var a = parseInt(req.query.a); var b = parseInt(req.query.b);',
        'res.send(a + b); — the runner stores whatever you pass to send as the body.',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.get("/calc", function (req, res) {\n  var a = parseInt(req.query.a);\n  var b = parseInt(req.query.b);\n  res.send(a + b);\n});\napp.listen(3000);',
    },
  },
  {
    id: 'express-routes-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone. Pull it all together: basic routes, route params, and query strings in one app.',
      },
      {
        type: 'p',
        text: 'A real API often needs all three. The path says what resource you want. A param identifies which one. A query string filters or customises it.',
      },
      {
        type: 'code',
        text: '// GET /         -> home\n// GET /items/:id -> one item\n// GET /search?q= -> filtered list',
      },
      {
        type: 'tip',
        text: 'Three route patterns, three lines of app.get(). That is the core of any Express API.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Build an Express app with three routes. GET "/" responds with "Welcome". GET "/items/:id" responds with "Item " + id. GET "/search" responds with "Results for " + req.query.q (or "Results for " if q is missing).',
      starter: 'var express = require("express");\nvar app = express();\n// add 3 routes\napp.listen(3000);\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/").body === "Welcome"',
          label: 'GET / responds with "Welcome"',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/items/42").body === "Item 42"',
          label: 'GET /items/42 responds with "Item 42"',
          hint: 'res.send("Item " + req.params.id);',
        },
        {
          type: 'exprTruthy',
          expr: 'request(app, "GET", "/search?q=shoes").body === "Results for shoes"',
          label: 'GET /search?q=shoes responds with "Results for shoes"',
          hint: 'res.send("Results for " + (req.query.q || ""));',
        },
      ],
      hints: [
        'Three separate app.get() calls — one per route.',
        'For /search: res.send("Results for " + (req.query.q || ""));',
      ],
      solution:
        'var express = require("express");\nvar app = express();\napp.get("/", function (req, res) { res.send("Welcome"); });\napp.get("/items/:id", function (req, res) { res.send("Item " + req.params.id); });\napp.get("/search", function (req, res) { res.send("Results for " + (req.query.q || "")); });\napp.listen(3000);',
    },
  },
];

export default lessons;
