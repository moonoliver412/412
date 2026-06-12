import { describe, expect, it } from 'vitest';
import { runTerminal } from './terminal.js';

const pass = (script, check) => runTerminal(script, [check]).results[0];

describe('terminal runner — shell', () => {
  it('pwd and echo produce output', () => {
    expect(pass('pwd', { type: 'output', text: '/home/coder' })).toBe(true);
    expect(pass('echo hello', { type: 'output', text: 'hello' })).toBe(true);
  });

  it('mkdir and touch create dirs and files', () => {
    expect(pass('mkdir src', { type: 'dirExists', path: 'src' })).toBe(true);
    expect(pass('touch app.js', { type: 'fileExists', path: 'app.js' })).toBe(true);
  });

  it('cd changes directory and nested paths resolve', () => {
    const r = runTerminal('mkdir src\ncd src\ntouch index.js', [
      { type: 'fileExists', path: '/home/coder/src/index.js' },
    ]);
    expect(r.results[0]).toBe(true);
  });

  it('echo > writes file content; cat reads it', () => {
    expect(
      pass('echo hi there > note.txt', {
        type: 'fileContains',
        path: 'note.txt',
        text: 'hi there',
      })
    ).toBe(true);
    const r = runTerminal('echo hi > a.txt\ncat a.txt', [
      { type: 'output', text: 'hi' },
    ]);
    expect(r.results[0]).toBe(true);
  });

  it('mv renames files', () => {
    const r = runTerminal('touch old.txt\nmv old.txt new.txt', [
      { type: 'fileExists', path: 'new.txt' },
    ]);
    expect(r.results[0]).toBe(true);
    expect(runTerminal('touch old.txt\nmv old.txt new.txt', [{ type: 'fileExists', path: 'old.txt' }]).results[0]).toBe(false);
  });
});

describe('terminal runner — git', () => {
  it('init creates a repo', () => {
    expect(pass('git init', { type: 'gitInited' })).toBe(true);
    expect(pass('echo x', { type: 'gitInited' })).toBe(false);
  });

  it('add stages files', () => {
    const r = runTerminal('git init\ntouch a.js\ngit add a.js', [
      { type: 'gitStaged', path: 'a.js' },
    ]);
    expect(r.results[0]).toBe(true);
  });

  it('commit records history and clears staging', () => {
    const script = 'git init\ntouch a.js\ngit add .\ngit commit -m "first"';
    expect(runTerminal(script, [{ type: 'gitCommits', count: 1 }]).results[0]).toBe(true);
    expect(runTerminal(script, [{ type: 'gitStaged' }]).results[0]).toBe(false);
  });

  it('branches and checkout -b work', () => {
    const r = runTerminal('git init\ngit checkout -b feature', [
      { type: 'gitBranch', name: 'feature', current: true },
    ]);
    expect(r.results[0]).toBe(true);
  });

  it('remote add registers a remote', () => {
    const r = runTerminal('git init\ngit remote add origin url', [
      { type: 'gitRemote' },
    ]);
    expect(r.results[0]).toBe(true);
  });

  it('never throws on nonsense input', () => {
    expect(() => runTerminal('flibble\ngit florp\ncd /nowhere', [])).not.toThrow();
  });
});
