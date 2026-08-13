/**
 * The shared investigation runtime.
 *
 * Two properties are worth defending here, and neither is about the code being
 * tidy.
 *
 * 1. NO LESSON MAY USE localStorage. A school computer is shared. With
 *    localStorage the next student opens E2 and finds the previous student's
 *    predictions already locked and the reveals already open — shown answers to
 *    questions they were never asked. This is the one storage fact the course's
 *    commitment mechanism rests on.
 *
 * 2. A RECORD MUST SURVIVE THE ROUND TRIP. Session storage dies with the tab,
 *    and E2 spans a bench session that may not happen in one sitting. Export
 *    then import must restore what was there, or the fix in (1) costs the
 *    students doing the experiment properly their whole run.
 *
 * Test (1) by parsing the source, not by grepping for a string: `localStorage`
 * appears legitimately inside runtime.tsx's own comments explaining why it is
 * not used, and a grep would either fail on the comment or be weakened until it
 * stopped catching real calls. The property is *a lesson calls the API*, so the
 * check looks for a call or a member access, and only in lesson sources.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import { clearRun, earnModel, earnedModels, exportRecord, importRecord, loadRun, saveRun } from '../src/components/investigate/runtime';

const DIR = 'src/components/investigate';

/**
 * A Storage stub, because the suite runs in `node` and there is no jsdom here.
 *
 * Adding jsdom for four methods would slow every test file down and put a
 * dependency in the manifest for one test's benefit. But a stub that is nicer
 * than the real thing is worse than no test, so the first case below pins the
 * two behaviours that actually bite: values are coerced to strings, and a
 * missing key gives `null`, not `undefined`. If the runtime ever starts relying
 * on something outside these four methods, this stub stops being adequate and
 * the honest move is to install jsdom rather than extend the stub.
 */
class MemStorage {
  private m = new Map<string, string>();
  getItem(k: string): string | null { return this.m.has(k) ? this.m.get(k)! : null; }
  setItem(k: string, v: unknown): void { this.m.set(String(k), String(v)); }
  removeItem(k: string): void { this.m.delete(String(k)); }
  clear(): void { this.m.clear(); }
}
(globalThis as unknown as { sessionStorage: MemStorage }).sessionStorage = new MemStorage();

describe('the storage stub behaves like the browser one', () => {
  it('returns null for an absent key and stores strings', () => {
    sessionStorage.clear();
    expect(sessionStorage.getItem('absent')).toBeNull();
    sessionStorage.setItem('n', 5 as unknown as string);
    expect(sessionStorage.getItem('n')).toBe('5');
  });
});

/** Every student-facing surface that keeps state. runtime.tsx is excluded — it
 *  is the one file allowed to name the API, and it names it only to refuse it. */
function statefulSources(): { name: string; src: string }[] {
  const out: { name: string; src: string }[] = [];
  for (const f of readdirSync(DIR)) {
    if (!f.endsWith('.tsx') || f === 'runtime.tsx') continue;
    out.push({ name: f, src: readFileSync(join(DIR, f), 'utf8') });
  }
  out.push({ name: 'models/index.astro', src: readFileSync('src/pages/models/index.astro', 'utf8') });
  return out;
}

/** Strip comments and strings, so only executable text is searched. */
function code(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ')
    .replace(/'(?:[^'\\]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\]|\\.)*"/g, '""');
}

describe('no lesson touches localStorage', () => {
  const sources = statefulSources();

  it('finds the lesson files at all', () => {
    const names = sources.map((s) => s.name);
    for (const l of ['E1Investigation.tsx', 'E2Investigation.tsx', 'E3Investigation.tsx', 'E4Investigation.tsx']) {
      expect(names).toContain(l);
    }
  });

  for (const { name, src } of sources) {
    it(`${name} calls no localStorage API`, () => {
      const hits = code(src).match(/localStorage\s*[.[]/g) ?? [];
      expect(hits, `${name} still stores state on the machine, not the tab`).toEqual([]);
    });
  }

  it('runtime.tsx is the only file that may name it, and only in prose', () => {
    const runtime = readFileSync(join(DIR, 'runtime.tsx'), 'utf8');
    expect(runtime).toContain('localStorage');            // the explanation is there
    expect(code(runtime).match(/localStorage\s*[.[]/g) ?? []).toEqual([]); // no call
  });
});

describe('a run survives storage', () => {
  beforeEach(() => sessionStorage.clear());

  it('round-trips through save and load', () => {
    saveRun('e2', { step: 'ledger', p1: 'closer', p1locked: true });
    expect(loadRun('e2', () => ({ step: 'entry', p1locked: false }))).toMatchObject({
      step: 'ledger', p1: 'closer', p1locked: true,
    });
  });

  it('fills in fields a newer version of the lesson added', () => {
    sessionStorage.setItem('openvidya.e3', JSON.stringify({ step: 'judge' }));
    const loaded = loadRun('e3', () => ({ step: 'entry', newField: 42 }));
    expect(loaded).toEqual({ step: 'judge', newField: 42 });
  });

  it('returns a blank run rather than throwing on corrupt data', () => {
    sessionStorage.setItem('openvidya.e1', 'not json {{{');
    expect(loadRun('e1', () => ({ step: 'entry' }))).toEqual({ step: 'entry' });
  });

  it('clears one lesson without touching the others', () => {
    saveRun('e1', { step: 'done' });
    saveRun('e4', { step: 'ledger' });
    clearRun('e1');
    expect(loadRun('e1', () => ({ step: 'entry' }))).toEqual({ step: 'entry' });
    expect(loadRun('e4', () => ({ step: 'entry' }))).toMatchObject({ step: 'ledger' });
  });
});

describe('earned models', () => {
  beforeEach(() => sessionStorage.clear());

  it('starts empty and does not duplicate', () => {
    expect(earnedModels()).toEqual([]);
    earnModel('charge');
    earnModel('charge');
    earnModel('coulomb-force');
    expect(earnedModels()).toEqual(['charge', 'coulomb-force']);
  });
});

describe('the record a student keeps', () => {
  beforeEach(() => sessionStorage.clear());

  it('restores every lesson and every model after the tab is gone', () => {
    saveRun('e1', { step: 'done', p1: 'attract' });
    saveRun('e2', { step: 'ledger', sortLocked: true });
    saveRun('e4', { step: 'judge', judge: 'B' });
    earnModel('charge');
    earnModel('polarisation');

    const kept = JSON.parse(JSON.stringify(exportRecord())); // as it would be written to disk
    sessionStorage.clear();                                  // the tab closes

    expect(importRecord(kept)).toBe(true);
    expect(loadRun('e1', () => ({}))).toMatchObject({ step: 'done', p1: 'attract' });
    expect(loadRun('e2', () => ({}))).toMatchObject({ step: 'ledger', sortLocked: true });
    expect(loadRun('e4', () => ({}))).toMatchObject({ step: 'judge', judge: 'B' });
    expect(earnedModels()).toEqual(['charge', 'polarisation']);
  });

  it('refuses a file that is not one of ours, and changes nothing', () => {
    saveRun('e1', { step: 'done' });
    expect(importRecord({ hello: 'world' })).toBe(false);
    expect(importRecord(null)).toBe(false);
    expect(importRecord('a string')).toBe(false);
    expect(loadRun('e1', () => ({}))).toMatchObject({ step: 'done' });
  });

  it('carries nothing that identifies the student', () => {
    saveRun('e1', { step: 'done' });
    earnModel('charge');
    const keys = Object.keys(exportRecord());
    expect(keys.sort()).toEqual(['kind', 'models', 'runs', 'saved', 'v']);
  });
});

describe('the models page agrees with the runtime', () => {
  const page = readFileSync('src/pages/models/index.astro', 'utf8');

  it('reads the key the runtime writes', () => {
    sessionStorage.clear();
    earnModel('charge');
    const key = page.match(/const KEY = '([^']+)'/)?.[1];
    expect(key, 'models page has no KEY constant').toBeTruthy();
    expect(sessionStorage.getItem(key!)).toBe('["charge"]');
  });

  it('has a name for every model a lesson can earn', () => {
    const earnable = readdirSync(DIR)
      .filter((f) => /^E\d+Investigation\.tsx$/.test(f))
      .flatMap((f) => [...readFileSync(join(DIR, f), 'utf8').matchAll(/earnModel\('([^']+)'\)/g)].map((m) => m[1]));
    expect(earnable.length).toBeGreaterThanOrEqual(4);
    for (const id of earnable) {
      expect(page, `models page would show the raw id "${id}"`).toMatch(
        new RegExp(`['"]?${id.replace('-', '\\-')}['"]?\\s*:\\s*\\[`),
      );
    }
  });
});
