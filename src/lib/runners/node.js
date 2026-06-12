// Node/Express runner — reuses the JS sandbox with a preamble that mocks the
// Node bits teens learn: module.exports / require, a tiny in-memory `fs`, and
// an Express-shaped `express()` whose routes can be exercised by checks via a
// provided `request(app, method, path, body)` helper.
//
// The handler logic is REAL JavaScript — only the I/O is mocked. Checks use
// exprTruthy against `module.exports`, `request(...)`, or logIncludes; plus
// sourceIncludes for "did you write app.get(...)" style assertions.

export const NODE_PREAMBLE = `
var module = { exports: {} };
var exports = module.exports;
var __files = {};
function __makeApp() {
  var routes = [];
  var mws = [];
  function add(method) {
    return function (path, handler) { routes.push({ method: method, path: path, handler: handler }); return app; };
  }
  var app = {
    get: add('GET'), post: add('POST'), put: add('PUT'), delete: add('DELETE'), patch: add('PATCH'),
    use: function () { var a = arguments; var h = a[a.length - 1]; if (typeof h === 'function') mws.push(h); return app; },
    listen: function () { return app; },
    __routes: routes, __mws: mws,
  };
  return app;
}
function express() { return __makeApp(); }
express.json = function () { return function (req, res, next) { if (next) next(); }; };
express.urlencoded = function () { return function (req, res, next) { if (next) next(); }; };
function require(name) {
  if (name === 'express') return express;
  if (name === 'fs') return {
    writeFileSync: function (p, c) { __files[p] = String(c); },
    readFileSync: function (p) { return __files[p] != null ? __files[p] : ''; },
    existsSync: function (p) { return __files[p] != null; },
  };
  if (name === 'http') return { createServer: function (h) { return { __handler: h, listen: function () { return this; } }; } };
  if (name === 'path') return { join: function () { return Array.prototype.join.call(arguments, '/'); } };
  return {};
}
function __matchRoute(routes, method, path) {
  for (var i = 0; i < routes.length; i++) {
    var r = routes[i];
    if (r.method !== method) continue;
    var rp = r.path.split('/'); var pp = path.split('?')[0].split('/');
    if (rp.length !== pp.length) continue;
    var params = {}; var ok = true;
    for (var j = 0; j < rp.length; j++) {
      if (rp[j].charAt(0) === ':') params[rp[j].slice(1)] = decodeURIComponent(pp[j]);
      else if (rp[j] !== pp[j]) { ok = false; break; }
    }
    if (ok) return { route: r, params: params };
  }
  return null;
}
function request(app, method, path, body) {
  var q = {}; var qs = path.split('?')[1];
  if (qs) qs.split('&').forEach(function (pair) { var kv = pair.split('='); q[kv[0]] = decodeURIComponent(kv[1] || ''); });
  var match = __matchRoute(app.__routes || [], method, path);
  var captured = { status: 200, body: undefined, ended: false };
  var res = {
    status: function (c) { captured.status = c; return res; },
    json: function (o) { captured.body = o; captured.ended = true; return res; },
    send: function (o) { captured.body = o; captured.ended = true; return res; },
    end: function (o) { if (o !== undefined) captured.body = o; captured.ended = true; return res; },
    set: function () { return res; }, setHeader: function () { return res; },
  };
  if (!match) { captured.status = 404; return captured; }
  var req = { method: method, path: path.split('?')[0], params: match.params, query: q, body: body || {} };
  try {
    for (var k = 0; k < (app.__mws || []).length; k++) app.__mws[k](req, res, function () {});
    match.route.handler(req, res);
  } catch (e) { window.__csError = String(e && e.message || e); }
  return captured;
}
`;
