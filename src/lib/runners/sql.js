// SQL runner — real SQLite in the browser via sql.js (WASM, offline once
// cached). Each exercise seeds a fresh database, the learner writes a query,
// and checks grade the result set (or, for INSERT/UPDATE/CREATE lessons, a
// verification query run afterwards).
//
// exercise: { kind:'sql', seed:'CREATE TABLE…; INSERT…;', starter:'SELECT…', checks }
// Check types:
//   { type:'queryRowCount', count }                 result has exactly N rows
//   { type:'queryHasColumns', columns:['a','b'] }   result includes these columns
//   { type:'queryReturns', rows:[['Ada',9]] }       result contains each row (subset, order-free)
//   { type:'queryCellIncludes', text:'Ada' }        any result cell contains text
//   { type:'verifyRowCount', query:'SELECT…', count } run query, assert N rows
//   plus sourceIncludes / sourceMatches on the learner SQL.

import { runSourceCheck, SOURCE_CHECK_TYPES } from '../sourceChecks.js';

let sqlPromise = null;

async function getSql() {
  if (!sqlPromise) {
    sqlPromise = (async () => {
      const [{ default: initSqlJs }, wasmUrl] = await Promise.all([
        import('sql.js'),
        import('sql.js/dist/sql-wasm.wasm?url'),
      ]);
      return initSqlJs({ locateFile: () => wasmUrl.default });
    })();
  }
  return sqlPromise;
}

function rowsContain(result, wanted) {
  if (!result) return false;
  const have = result.values.map((row) => row.map((c) => String(c)));
  return wanted.every((wRow) =>
    have.some(
      (hRow) =>
        wRow.length <= hRow.length &&
        wRow.every((cell, i) => String(cell) === hRow[i])
    )
  );
}

/** Run a SQL exercise. Returns { logs, error, results } where logs is a
 *  one-line preview of the result table. */
export async function runSql(code, exercise, checks) {
  let db = null;
  let result = null;
  let error = null;
  const logs = [];
  try {
    const SQL = await getSql();
    db = new SQL.Database();
    if (exercise.seed) db.run(exercise.seed);
    try {
      const out = db.exec(code);
      result = out.length ? out[out.length - 1] : null;
    } catch (e) {
      error = String(e?.message ?? e);
    }
    if (result) {
      logs.push(result.columns.join(' | '));
      for (const row of result.values.slice(0, 20)) logs.push(row.join(' | '));
    } else if (!error) {
      logs.push('(no rows returned)');
    }

    const results = (checks ?? []).map((c) => {
      try {
        if (c.type === 'queryRowCount') return !!result && result.values.length === c.count;
        if (c.type === 'queryHasColumns')
          return (
            !!result &&
            c.columns.every((col) =>
              result.columns.map((x) => x.toLowerCase()).includes(col.toLowerCase())
            )
          );
        if (c.type === 'queryReturns') return rowsContain(result, c.rows);
        if (c.type === 'queryCellIncludes') {
          if (!result) return false;
          const want = String(c.text).toLowerCase();
          return result.values.some((row) =>
            row.some((cell) => String(cell).toLowerCase().includes(want))
          );
        }
        if (c.type === 'verifyRowCount') {
          const out = db.exec(c.query);
          const r = out.length ? out[out.length - 1] : null;
          return !!r && r.values.length === c.count;
        }
        if (SOURCE_CHECK_TYPES.has(c.type)) return runSourceCheck(c, code);
        return false;
      } catch {
        return false;
      }
    });
    return { logs, error, results };
  } catch (e) {
    return {
      logs,
      error: `SQL engine failed to load: ${String(e?.message ?? e)}`,
      results: (checks ?? []).map(() => false),
    };
  } finally {
    if (db) db.close();
  }
}
