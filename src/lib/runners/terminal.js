// Terminal runner — a small simulated shell + git, pure JS, no deps. The
// learner writes a short script (one command per line) in the editor; we run
// it against a fresh in-memory filesystem and git repo, capture output, and
// expose the final state to checks. This reuses the same edit → run → grade
// loop as every other language.
//
// Supported commands: pwd, ls, cd, mkdir, touch, cat, echo (> and >>), mv,
// cp, rm, clear, and git: init, status, add, commit, log, branch, checkout
// (incl. -b), switch (-c), merge, remote add, push, pull, clone.
//
// Check types (evaluated against the final state):
//   { type: 'output', text, label }        — stdout contains text
//   { type: 'fileExists', path, label }
//   { type: 'fileContains', path, text, label }
//   { type: 'dirExists', path, label }
//   { type: 'gitInited', label }
//   { type: 'gitStaged', path, label }      — path is staged (any path if omitted)
//   { type: 'gitCommits', count, label }    — at least `count` commits (default 1)
//   { type: 'gitBranch', name, label }      — branch exists (and is current if current:true)
//   { type: 'gitRemote', label }            — a remote is configured
//   plus sourceIncludes / sourceMatches on the raw script.

import { runSourceCheck, SOURCE_CHECK_TYPES } from '../sourceChecks.js';

function makeState() {
  return {
    cwd: '/home/coder',
    fs: { '/home/coder': { type: 'dir' } },
    out: [],
    git: null, // { staged:Set, commits:[], branches:Set, current, remotes:Set, lastMsg }
  };
}

function normPath(state, p) {
  if (!p) return state.cwd;
  let path = p.startsWith('/')
    ? p
    : state.cwd === '/'
      ? `/${p}`
      : `${state.cwd}/${p}`;
  const parts = [];
  for (const seg of path.split('/')) {
    if (seg === '' || seg === '.') continue;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  }
  return '/' + parts.join('/');
}

function parentOf(path) {
  const i = path.lastIndexOf('/');
  return i <= 0 ? '/' : path.slice(0, i);
}

function tokenize(line) {
  // Split on spaces but keep "quoted strings" together.
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
  let m;
  while ((m = re.exec(line))) out.push(m[1] ?? m[2] ?? m[3]);
  return out;
}

function ensureGit(state) {
  if (!state.git) {
    state.git = {
      staged: new Set(),
      commits: [],
      branches: new Set(['main']),
      current: 'main',
      remotes: new Set(),
      lastMsg: null,
    };
  }
  return state.git;
}

function runLine(state, raw) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) return;

  // Handle output redirection: echo text > file  /  >> file
  const redir = line.match(/^(.*?)\s*(>>?)\s*(\S+)\s*$/);
  if (redir && /^echo\b/.test(redir[1])) {
    const text = tokenize(redir[1]).slice(1).join(' ');
    const path = normPath(state, redir[3]);
    const prev =
      redir[2] === '>>' && state.fs[path]?.type === 'file'
        ? state.fs[path].content + '\n'
        : '';
    state.fs[path] = { type: 'file', content: prev + text };
    return;
  }

  const args = tokenize(line);
  const cmd = args[0];

  if (cmd === 'git') return runGit(state, args.slice(1));

  switch (cmd) {
    case 'pwd':
      state.out.push(state.cwd);
      return;
    case 'echo':
      state.out.push(args.slice(1).join(' '));
      return;
    case 'clear':
      state.out = [];
      return;
    case 'ls': {
      const dir = normPath(state, args[1]);
      const names = Object.keys(state.fs)
        .filter((p) => p !== dir && parentOf(p) === dir)
        .map((p) => p.slice(dir === '/' ? 1 : dir.length + 1));
      state.out.push(names.sort().join('  '));
      return;
    }
    case 'cd': {
      const target = normPath(state, args[1] ?? '/home/coder');
      if (state.fs[target]?.type === 'dir') state.cwd = target;
      else state.out.push(`cd: no such directory: ${args[1]}`);
      return;
    }
    case 'mkdir': {
      for (const a of args.slice(1).filter((x) => x !== '-p')) {
        state.fs[normPath(state, a)] = { type: 'dir' };
      }
      return;
    }
    case 'touch': {
      for (const a of args.slice(1)) {
        const path = normPath(state, a);
        if (!state.fs[path]) state.fs[path] = { type: 'file', content: '' };
      }
      return;
    }
    case 'cat': {
      const path = normPath(state, args[1]);
      if (state.fs[path]?.type === 'file') state.out.push(state.fs[path].content);
      else state.out.push(`cat: ${args[1]}: No such file`);
      return;
    }
    case 'mv': {
      const from = normPath(state, args[1]);
      const to = normPath(state, args[2]);
      if (state.fs[from]) {
        state.fs[to] = state.fs[from];
        delete state.fs[from];
      }
      return;
    }
    case 'cp': {
      const from = normPath(state, args[1]);
      const to = normPath(state, args[2]);
      if (state.fs[from]) state.fs[to] = { ...state.fs[from] };
      return;
    }
    case 'rm': {
      for (const a of args.slice(1).filter((x) => !x.startsWith('-'))) {
        delete state.fs[normPath(state, a)];
      }
      return;
    }
    default:
      state.out.push(`command not found: ${cmd}`);
  }
}

function runGit(state, args) {
  const sub = args[0];
  // init and clone don't need an existing repository.
  if (sub === 'init') {
    ensureGit(state);
    state.out.push('Initialized empty Git repository');
    return;
  }
  if (sub === 'clone') {
    const url = args[1] ?? 'repo';
    const folder =
      args[2] ?? (url.split('/').pop().replace(/\.git$/, '') || 'repo');
    const git = ensureGit(state);
    git.remotes.add('origin');
    state.fs[normPath(state, folder)] = { type: 'dir' };
    state.out.push(`Cloning into '${folder}'`);
    return;
  }
  const git = state.git;
  if (!git) {
    state.out.push('fatal: not a git repository');
    return;
  }
  switch (sub) {
    case 'status': {
      // Untracked = working-dir files that are neither staged nor committed.
      const committed = new Set(git.commits.flatMap((c) => c.files));
      const untracked = Object.keys(state.fs)
        .filter(
          (p) =>
            state.fs[p].type === 'file' &&
            !git.staged.has(p) &&
            !committed.has(p)
        )
        .map((p) => p.split('/').pop());
      const lines = [`On branch ${git.current}`];
      if (git.staged.size) {
        lines.push(
          `Changes to be committed:\n  ${[...git.staged]
            .map((p) => p.split('/').pop())
            .join('\n  ')}`
        );
      }
      if (untracked.length) {
        lines.push(`Untracked files:\n  ${untracked.join('\n  ')}`);
      }
      if (!git.staged.size && !untracked.length) lines.push('nothing to commit');
      state.out.push(lines.join('\n'));
      return;
    }
    case 'add': {
      const target = args[1];
      if (target === '.' || target === '-A') {
        Object.keys(state.fs)
          .filter((p) => state.fs[p].type === 'file')
          .forEach((p) => git.staged.add(p));
      } else {
        git.staged.add(normPath(state, target));
      }
      return;
    }
    case 'commit': {
      const mi = args.indexOf('-m');
      const msg = mi !== -1 ? args[mi + 1] : '(no message)';
      if (!git.staged.size && !git.commits.length) {
        state.out.push('nothing to commit');
        return;
      }
      git.commits.push({ msg, branch: git.current, files: [...git.staged] });
      git.lastMsg = msg;
      git.staged.clear();
      state.out.push(`[${git.current}] ${msg}`);
      return;
    }
    case 'log':
      state.out.push(
        git.commits.length
          ? git.commits.map((c) => `commit: ${c.msg}`).reverse().join('\n')
          : 'no commits yet'
      );
      return;
    case 'branch':
      if (args[1] && !args[1].startsWith('-')) git.branches.add(args[1]);
      else state.out.push([...git.branches].map((b) => (b === git.current ? `* ${b}` : `  ${b}`)).join('\n'));
      return;
    case 'checkout': {
      if (args[1] === '-b') {
        git.branches.add(args[2]);
        git.current = args[2];
      } else if (git.branches.has(args[1])) {
        git.current = args[1];
      }
      state.out.push(`Switched to branch '${git.current}'`);
      return;
    }
    case 'switch': {
      if (args[1] === '-c') {
        git.branches.add(args[2]);
        git.current = args[2];
      } else if (git.branches.has(args[1])) {
        git.current = args[1];
      }
      state.out.push(`Switched to branch '${git.current}'`);
      return;
    }
    case 'merge':
      state.out.push(`Merged ${args[1]} into ${git.current}`);
      return;
    case 'remote':
      if (args[1] === 'add') {
        git.remotes.add(args[2] ?? 'origin');
        state.out.push('');
      } else {
        state.out.push([...git.remotes].join('\n'));
      }
      return;
    case 'push':
      state.out.push(git.remotes.size ? `Pushing to ${[...git.remotes][0]}` : 'fatal: no remote');
      return;
    case 'pull':
      state.out.push('Already up to date');
      return;
    default:
      state.out.push(`git: '${sub}' is not a git command`);
  }
}

function evalCheck(check, state, source) {
  const git = state.git;
  switch (check.type) {
    case 'output':
      return state.out.join('\n').toLowerCase().includes(String(check.text).toLowerCase());
    case 'fileExists':
      return state.fs[normPath(state, check.path)]?.type === 'file';
    case 'dirExists':
      return state.fs[normPath(state, check.path)]?.type === 'dir';
    case 'fileContains': {
      const f = state.fs[normPath(state, check.path)];
      return (
        f?.type === 'file' &&
        f.content.toLowerCase().includes(String(check.text).toLowerCase())
      );
    }
    case 'gitInited':
      return !!git;
    case 'gitStaged':
      return !!git && (check.path ? git.staged.has(normPath(state, check.path)) : git.staged.size > 0);
    case 'gitCommits':
      return !!git && git.commits.length >= (check.count ?? 1);
    case 'gitBranch':
      return (
        !!git &&
        git.branches.has(check.name) &&
        (!check.current || git.current === check.name)
      );
    case 'gitRemote':
      return !!git && git.remotes.size > 0;
    default:
      if (SOURCE_CHECK_TYPES.has(check.type)) return runSourceCheck(check, source);
      return false;
  }
}

/** Run a shell script and grade it. Returns { logs, error, results }. */
export function runTerminal(script, checks) {
  const state = makeState();
  let error = null;
  try {
    for (const line of String(script ?? '').split('\n')) runLine(state, line);
  } catch (e) {
    error = String(e?.message ?? e);
  }
  const results = (checks ?? []).map((c) => {
    try {
      return evalCheck(c, state, script);
    } catch {
      return false;
    }
  });
  return { logs: state.out, error, results };
}
