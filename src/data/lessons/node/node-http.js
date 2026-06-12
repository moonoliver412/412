// Topic: Node HTTP (node-http) — 5 lessons.

const lessons = [
  {
    id: 'node-http-1',
    blocks: [
      {
        type: 'p',
        text: 'A server is a program that listens for requests and sends back responses. HTTP is the language browsers and servers use to talk.',
      },
      {
        type: 'p',
        text: 'Every HTTP request has a method (like GET or POST) and a path (like "/home"). The server reads those and decides what to send back.',
      },
      {
        type: 'code',
        text: 'var http = require("http");\nvar server = http.createServer(function (req, res) {\n  res.end("Hello World");\n});\nserver.listen(3000);',
      },
      {
        type: 'tip',
        text: 'req is the request — what the browser sent. res is the response — what you send back. You will see req and res everywhere.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Create an HTTP server using require("http"). The handler function should call res.end("It works!"). Save the server in a variable called server and call server.listen(3000). Export the handler function as module.exports.handler.',
      starter: 'var http = require("http");\n// build your server\n',
      checks: [
        {
          type: 'sourceIncludes',
          text: 'http.createServer',
          label: 'You called http.createServer',
          hint: 'var server = http.createServer(function(req, res) { ... });',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var req = {}; var captured = ""; var res = { end: function(s){ captured = s; } }; module.exports.handler(req, res); return captured === "It works!"; })()',
          label: 'Handler sends "It works!"',
          hint: 'res.end("It works!");',
        },
        {
          type: 'sourceIncludes',
          text: '.listen(',
          label: 'You called server.listen',
        },
      ],
      hints: [
        'function handler(req, res) { res.end("It works!"); }',
        'var server = http.createServer(handler); server.listen(3000); module.exports.handler = handler;',
      ],
      solution:
        'var http = require("http");\nfunction handler(req, res) { res.end("It works!"); }\nvar server = http.createServer(handler);\nserver.listen(3000);\nmodule.exports.handler = handler;',
    },
  },
  {
    id: 'node-http-2',
    blocks: [
      {
        type: 'p',
        text: 'The req object tells you what the browser asked for. req.method is the HTTP verb ("GET", "POST"). req.url is the path ("/about").',
      },
      {
        type: 'code',
        text: 'function handler(req, res) {\n  if (req.url === "/hello") {\n    res.end("Hello!");\n  } else {\n    res.end("Not found");\n  }\n}',
      },
      {
        type: 'p',
        text: 'You can branch on req.url to serve different content at different paths. That is routing.',
      },
      {
        type: 'tip',
        text: 'This is exactly what Express automates. First you understand the raw version, then Express makes it easier.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Write a handler function that checks req.url. If it is "/ping", call res.end("pong"). Otherwise call res.end("404"). Export it as module.exports.handler.',
      starter: '// write handler and export it\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ var req = { url: "/ping" }; var out = ""; var res = { end: function(s){ out = s; } }; module.exports.handler(req, res); return out === "pong"; })()',
          label: 'GET /ping responds with "pong"',
          hint: 'if (req.url === "/ping") { res.end("pong"); }',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var req = { url: "/other" }; var out = ""; var res = { end: function(s){ out = s; } }; module.exports.handler(req, res); return out === "404"; })()',
          label: 'Any other path responds with "404"',
          hint: 'else { res.end("404"); }',
        },
      ],
      hints: [
        'function handler(req, res) { if (req.url === "/ping") { ... } else { ... } }',
        'module.exports.handler = handler;',
      ],
      solution:
        'function handler(req, res) {\n  if (req.url === "/ping") {\n    res.end("pong");\n  } else {\n    res.end("404");\n  }\n}\nmodule.exports.handler = handler;',
    },
  },
  {
    id: 'node-http-3',
    blocks: [
      {
        type: 'p',
        text: 'You can also check req.method to tell GET and POST apart. A GET request reads data. A POST request sends data.',
      },
      {
        type: 'code',
        text: 'function handler(req, res) {\n  if (req.method === "GET" && req.url === "/data") {\n    res.end("here is your data");\n  } else if (req.method === "POST" && req.url === "/data") {\n    res.end("data received");\n  } else {\n    res.end("not found");\n  }\n}',
      },
      {
        type: 'tip',
        text: 'Checking both method and url together is how raw Node HTTP routing works. Express will wrap this into cleaner app.get() and app.post() calls.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Write a handler that replies "read" when method is "GET" and url is "/items", "written" when method is "POST" and url is "/items", and "not found" for anything else. Export it as module.exports.handler.',
      starter: '// write handler and export it\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ var req = { method: "GET", url: "/items" }; var out = ""; var res = { end: function(s){ out = s; } }; module.exports.handler(req, res); return out === "read"; })()',
          label: 'GET /items returns "read"',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var req = { method: "POST", url: "/items" }; var out = ""; var res = { end: function(s){ out = s; } }; module.exports.handler(req, res); return out === "written"; })()',
          label: 'POST /items returns "written"',
          hint: 'else if (req.method === "POST" && req.url === "/items") { res.end("written"); }',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var req = { method: "GET", url: "/other" }; var out = ""; var res = { end: function(s){ out = s; } }; module.exports.handler(req, res); return out === "not found"; })()',
          label: 'Unknown path returns "not found"',
        },
      ],
      hints: [
        'Chain if / else if / else on req.method and req.url.',
        'module.exports.handler = handler; at the end.',
      ],
      solution:
        'function handler(req, res) {\n  if (req.method === "GET" && req.url === "/items") {\n    res.end("read");\n  } else if (req.method === "POST" && req.url === "/items") {\n    res.end("written");\n  } else {\n    res.end("not found");\n  }\n}\nmodule.exports.handler = handler;',
    },
  },
  {
    id: 'node-http-4',
    blocks: [
      {
        type: 'p',
        text: 'Servers can send back different content types. For JSON, you tell the browser by setting a header before calling res.end().',
      },
      {
        type: 'code',
        text: 'function handler(req, res) {\n  res.setHeader("Content-Type", "application/json");\n  res.end(JSON.stringify({ ok: true }));\n}',
      },
      {
        type: 'p',
        text: 'The browser uses the Content-Type header to know whether to treat the body as HTML, JSON, or plain text.',
      },
      {
        type: 'tip',
        text: 'Express sets Content-Type automatically when you call res.json(). Under the hood it does exactly this.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Write a handler that responds to any request with a JSON body. The body should be an object with two keys: status set to "ok" and time set to 2024. Use res.setHeader and res.end(JSON.stringify(...)). Export as module.exports.handler.',
      starter: '// write handler\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ var out = ""; var res = { setHeader: function(){}, end: function(s){ out = s; } }; module.exports.handler({}, res); var parsed = JSON.parse(out); return parsed.status === "ok"; })()',
          label: 'Response body has status "ok"',
          hint: 'JSON.stringify({ status: "ok", time: 2024 })',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var out = ""; var res = { setHeader: function(){}, end: function(s){ out = s; } }; module.exports.handler({}, res); var parsed = JSON.parse(out); return parsed.time === 2024; })()',
          label: 'Response body has time 2024',
        },
        {
          type: 'sourceIncludes',
          text: 'setHeader',
          label: 'You called res.setHeader',
        },
      ],
      hints: [
        'res.setHeader("Content-Type", "application/json");',
        'res.end(JSON.stringify({ status: "ok", time: 2024 }));',
      ],
      solution:
        'function handler(req, res) {\n  res.setHeader("Content-Type", "application/json");\n  res.end(JSON.stringify({ status: "ok", time: 2024 }));\n}\nmodule.exports.handler = handler;',
    },
  },
  {
    id: 'node-http-5',
    blocks: [
      {
        type: 'p',
        text: 'Capstone. You know raw HTTP routing: check the method and url, set headers, send a response. This is the foundation under every Node web server.',
      },
      {
        type: 'p',
        text: 'Build a mini router. It handles three paths and returns JSON for each.',
      },
      {
        type: 'code',
        text: '// Pattern:\n// GET /status  -> { alive: true }\n// GET /version -> { version: 1 }\n// anything else -> { error: "not found" }',
      },
      {
        type: 'tip',
        text: 'From here you are one step away from Express — which just wraps this pattern into a cleaner API.',
      },
    ],
    exercise: {
      kind: 'node',
      instructions:
        'Write a handler with three routes. GET /status -> JSON { alive: true }. GET /version -> JSON { version: 1 }. Anything else -> JSON { error: "not found" }. Export as module.exports.handler.',
      starter: '// write handler with 3 routes\n',
      checks: [
        {
          type: 'exprTruthy',
          expr: '(function(){ var out = ""; var res = { setHeader: function(){}, end: function(s){ out = s; } }; module.exports.handler({ method: "GET", url: "/status" }, res); return JSON.parse(out).alive === true; })()',
          label: 'GET /status returns { alive: true }',
          hint: 'if (req.url === "/status") { res.end(JSON.stringify({ alive: true })); }',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var out = ""; var res = { setHeader: function(){}, end: function(s){ out = s; } }; module.exports.handler({ method: "GET", url: "/version" }, res); return JSON.parse(out).version === 1; })()',
          label: 'GET /version returns { version: 1 }',
        },
        {
          type: 'exprTruthy',
          expr: '(function(){ var out = ""; var res = { setHeader: function(){}, end: function(s){ out = s; } }; module.exports.handler({ method: "GET", url: "/nope" }, res); return JSON.parse(out).error === "not found"; })()',
          label: 'Unknown path returns { error: "not found" }',
        },
      ],
      hints: [
        'Use if/else if/else on req.url. Return JSON.stringify(...) for each branch.',
        'module.exports.handler = handler; at the end.',
      ],
      solution:
        'function handler(req, res) {\n  res.setHeader("Content-Type", "application/json");\n  if (req.url === "/status") {\n    res.end(JSON.stringify({ alive: true }));\n  } else if (req.url === "/version") {\n    res.end(JSON.stringify({ version: 1 }));\n  } else {\n    res.end(JSON.stringify({ error: "not found" }));\n  }\n}\nmodule.exports.handler = handler;',
    },
  },
];

export default lessons;
