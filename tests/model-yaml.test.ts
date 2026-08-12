/**
 * Every model.yaml must actually parse — and until this file existed, none of
 * them was ever parsed by anything.
 *
 * `AGENTS.md` hard rule 4 says assumptions are declared in `model.yaml` before
 * code is written, and rules 2, 6 and 11 all point at fields inside it. The
 * whole architecture treats these files as the physics record.
 *
 * They were being treated as prose. A syntax error sat in
 * `what-decides-the-push/model.yaml` from the day it was created — a quote
 * opened, closed mid-line, and continued in bare text — and nothing failed,
 * because Astro's content collections never load them (ISSUES #8: the directory
 * holds no .md/.mdx, so the collection is empty) and no test read them.
 *
 * A file that declares the model, that nothing validates, is documentation
 * wearing a data format. This is rule 10 applied to our own physics record.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

const ROOT = 'src/content';

function findModels(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...findModels(p));
    else if (name === 'model.yaml') out.push(p);
  }
  return out;
}

const models = findModels(ROOT);

describe('0. there are models to check', () => {
  it('found at least four', () => {
    // Guards against the whole suite passing vacuously if the path ever moves.
    expect(models.length).toBeGreaterThanOrEqual(4);
  });
});

describe.each(models)('%s', (path) => {
  const raw = readFileSync(path, 'utf8');

  it('parses as YAML', () => {
    expect(() => parse(raw)).not.toThrow();
  });

  it('declares the fields the architecture depends on', () => {
    const d = parse(raw) as Record<string, unknown>;
    for (const field of ['concept', 'assumptions', 'implementation', 'verification', 'validity']) {
      expect(d[field], `${path} is missing ${field}`).toBeDefined();
    }
  });

  it('every verification states what it is independent of — hard rule 2', () => {
    const d = parse(raw) as { verification?: { name: string; independent_of?: string }[] };
    for (const v of d.verification ?? []) {
      expect(v.independent_of, `${path}: ${v.name} does not state its independence`).toBeTruthy();
    }
  });

  it('validity says both when it holds and when it breaks', () => {
    const d = parse(raw) as { validity?: Record<string, unknown> };
    expect(d.validity?.holds_when).toBeDefined();
    expect(d.validity?.breaks_when).toBeDefined();
  });

  it('the implementation file it names exists', () => {
    const d = parse(raw) as { implementation?: { file?: string } };
    const f = d.implementation?.file;
    if (!f) return;
    expect(() => statSync(f), `${path} points at a missing file: ${f}`).not.toThrow();
  });
});
