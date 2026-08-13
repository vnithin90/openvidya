/**
 * Readability of student-facing prose.
 *
 * WHY THIS EXISTS — the first real student evidence in the project.
 *
 * Undergraduates reading E1–E3 reported having to read sentences two or three
 * times to understand them. That is worse than it sounds: the target is
 * Grades 8–12, and undergraduates are older and more practised readers. If they
 * need three passes, Class 8 does not get in at all.
 *
 * Measurement afterwards found the cause, and it is structural rather than a
 * matter of vocabulary. The offending sentences nearly all have one shape:
 *
 *     one sentence, two clauses, joined by a dash or a colon,
 *     the second qualifying or reversing the first
 *
 *   "…is not whether you got the right answer — it is how long the balls took…"
 *   "…is partly keep going — except that each round also costs you charge…"
 *   "…that electrostatics alone does not force — and one that becomes far more…"
 *
 * The reader has to hold clause one in memory, parse an interruption, then
 * integrate. Splitting at the dash costs nothing and removes the re-read.
 *
 * A parallel build written to a plain-language brief scores FK 6.1 on the same
 * lesson where this one scored 8.3, with the same physics — so the target is
 * demonstrably reachable and these limits are not arbitrary.
 *
 * THE LIMITS ARE DELIBERATELY CRUDE. Flesch-Kincaid counts syllables, not
 * sense; it cannot see that a short sentence is confusing or that a long one is
 * clear. It is a smoke alarm, not a judge. Passing this file does not mean the
 * writing is good — only that it is not obviously out of reach.
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const LESSONS = [
  ['E1', 'src/components/investigate/E1Investigation.tsx'],
  ['E2', 'src/components/investigate/E2Investigation.tsx'],
  ['E3', 'src/components/investigate/E3Investigation.tsx'],
] as const;

/** Student-facing sentences only: <p> and <li> bodies, comments and JSX stripped. */
function sentences(file: string): string[] {
  let s = readFileSync(file, 'utf8');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  const blocks: string[] = [];
  for (const m of s.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    const t = m[2].replace(/<[^>]+>/g, ' ').replace(/\{[^{}]*\}/g, ' ').replace(/\s+/g, ' ').trim();
    if (t.split(' ').length > 4) blocks.push(t);
  }
  return blocks
    .flatMap((b) => b.split(/(?<=[.!?]) +/))
    .map((x) => x.trim())
    .filter((x) => x.split(' ').length > 4);
}

const syllables = (w: string) => Math.max(1, (w.toLowerCase().match(/[aeiouy]+/g) || []).length);

function fleschKincaid(text: string): number {
  const words = text.match(/[A-Za-z']+/g) || [];
  if (!words.length) return 0;
  const sy = words.reduce((n, w) => n + syllables(w), 0) / words.length;
  return 0.39 * words.length + 11.8 * sy - 15.59;
}

describe.each(LESSONS)('%s reads at the level it is aimed at', (name, file) => {
  const all = sentences(file);

  it('has prose to check at all', () => {
    expect(all.length).toBeGreaterThan(30);
  });

  it('no sentence runs past 25 words', () => {
    const long = all.filter((s) => s.split(/\s+/).length > 25);
    expect(long, `${name}: ${long.length} over-long sentence(s)\n  · ${long.join('\n  · ')}`).toEqual([]);
  });

  it('no sentence hides a second clause behind a dash', () => {
    // One trailing dash before a short tail is fine. Two dashes, or a dash in a
    // long sentence, is the shape students reported re-reading.
    const bad = all.filter((s) => {
      const dashes = (s.match(/—/g) || []).length;
      return dashes >= 2 || (dashes === 1 && s.split(/\s+/).length > 20);
    });
    expect(bad, `${name}: ${bad.length} dash-split sentence(s)\n  · ${bad.join('\n  · ')}`).toEqual([]);
  });

  it('reads at grade 7 or below on average', () => {
    const mean = all.reduce((n, s) => n + fleschKincaid(s), 0) / all.length;
    expect(mean, `${name} mean Flesch-Kincaid grade`).toBeLessThanOrEqual(7.0);
  });

  /**
   * ⚠ A PER-SENTENCE FLESCH-KINCAID CHECK WAS HERE AND WAS REMOVED, because it
   * was wrong in the way this project keeps getting wrong: it measured a proxy
   * instead of the property.
   *
   * It flagged these as "above grade 12":
   *
   *   "Almost everyone draws the same thing: arrows pointing away from the ball
   *    everywhere, shorter further out."
   *   "Every one of those arrows was drawn by imagining something placed there."
   *
   * Both are plain. Flesch-Kincaid divides by sentence count, so on a single
   * short sentence a few polysyllables — *interaction*, *electric*, *magnetic* —
   * swamp the average. The formula is only meaningful over a corpus, and using
   * it per sentence produces noise that would have driven a rewrite of prose
   * that was already fine.
   *
   * What survives are the two STRUCTURAL checks above — sentence length and the
   * dash-split clause. Those describe the shape students actually reported
   * re-reading, and they do not depend on syllable counting at all.
   */
  it('the corpus average is the only Flesch-Kincaid claim made', () => {
    // Guard against the per-sentence check being reintroduced by someone who
    // reasonably assumes stricter is better.
    const src = readFileSync('tests/readability.test.ts', 'utf8');
    const perSentence = /fleschKincaid\(s\)\s*[<>]/.test(src);
    expect(perSentence, 'per-sentence FK is noise — see the note above').toBe(false);
  });
});
