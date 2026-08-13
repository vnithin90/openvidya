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

/**
 * EVERY student-facing surface, not only the three investigations.
 *
 * The first version of this file watched E1–E3 and nothing else. That is how a
 * standard rots: the lessons get fixed, the concept pages drift, and the check
 * stays green while a student meets grade-9 prose two clicks away.
 */
const SURFACES = [
  ['E1', 'src/components/investigate/E1Investigation.tsx'],
  ['E2', 'src/components/investigate/E2Investigation.tsx'],
  ['E3', 'src/components/investigate/E3Investigation.tsx'],
  ['E4', 'src/components/investigate/E4Investigation.tsx'],
  ['home', 'src/pages/index.astro'],
  ['models index', 'src/pages/models/index.astro'],
  ['models · charge', 'src/pages/models/charge.astro'],
  ['what is current', 'src/pages/electricity/what-is-current.mdx'],
  ['what determines current', 'src/pages/electricity/what-determines-current.mdx'],
  ['electric field', 'src/pages/fields/electric-field.mdx'],
  ['projectile motion', 'src/pages/mechanics/projectile-motion.mdx'],
  ['Scene1 counting', 'src/components/physics/Scene1Counting.tsx'],
  ['Scene2 surface', 'src/components/physics/Scene2Surface.tsx'],
  ['Scene3 rate', 'src/components/physics/Scene3Rate.tsx'],
  ['M2 factors', 'src/components/physics/M2Factors.tsx'],
  ['M2 twin', 'src/components/physics/M2Twin.tsx'],
  ['M2 drift', 'src/components/physics/M2DriftEstimate.tsx'],
  ['charge rate panel', 'src/components/physics/ChargeRatePanel.tsx'],
] as const;

/** Student-facing sentences: <p>/<li> bodies plus MDX body text. */
function sentences(file: string): string[] {
  let s = readFileSync(file, 'utf8');
  s = s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  s = s.replace(/^---[\s\S]*?^---/m, '');          // astro / mdx frontmatter
  s = s.replace(/^import .*$/gm, '');
  s = s.replace(/<style[\s\S]*?<\/style>/g, '');
  const blocks: string[] = [];
  for (const m of s.matchAll(/<(p|li)\b[^>]*>([\s\S]*?)<\/\1>/g)) blocks.push(m[2]);
  if (/\.mdx?$/.test(file)) {
    /**
     * ⚠ Markdown prose WRAPS. An earlier version of this took each line as a
     * block, so a three-line paragraph became three fragments and the checker
     * reported "Everything else about electricity —" as a hard sentence. It was
     * about to drive a rewrite of prose that was not broken.
     *
     * Join consecutive non-blank lines into paragraphs first; a blank line ends
     * one. Fenced code, tables, headings and JSX are skipped whole.
     */
    let para: string[] = [];
    let inFence = false;
    const flush = () => {
      if (para.length) blocks.push(para.join(' '));
      para = [];
    };
    for (const line of s.split('\n')) {
      const t = line.trim();
      if (t.startsWith('```')) { inFence = !inFence; flush(); continue; }
      if (inFence) continue;
      if (!t || /^[#<|:\-*>]/.test(t)) { flush(); continue; }
      para.push(t);
    }
    flush();
  }
  return blocks
    .map((b) =>
      b.replace(/<[^>]+>/g, ' ')
        .replace(/\{[^{}]*\}/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`]/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter((t) => t.split(' ').length > 4)
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

describe.each(SURFACES)('%s reads at the level it is aimed at', (name, file) => {
  const all = sentences(file);

  it('has prose to check at all', () => {
    // Small surfaces (a model card, a scene caption) legitimately have few
    // sentences. Zero means the extractor broke, which is worth catching.
    expect(all.length).toBeGreaterThan(2);
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

  /**
   * The same limitation that killed the per-sentence check applies to short
   * surfaces. A model card with three sentences has no meaningful average: two
   * polysyllables move it a whole grade. Twenty sentences is where the mean
   * starts to describe the prose rather than the vocabulary of one caption.
   *
   * The STRUCTURAL checks above still run on every surface, at any size, because
   * a 30-word sentence is a 30-word sentence whether it has company or not.
   */
  const ENOUGH_FOR_AN_AVERAGE = 20;

  /**
   * TWO BARS, BECAUSE THERE ARE TWO KINDS OF PAGE — and this is a real
   * distinction in the project, not a threshold tuned until it passed.
   *
   * The E-series investigations refuse jargon on principle: nothing is named
   * before it is earned, so there is no "acceleration", no "superposition", no
   * "field" until the lesson has bought it. Their vocabulary is chosen, so a
   * grade-7 average is a fair demand.
   *
   * The concept modules are the opposite by design. They document a physical
   * model for a reader who has the words. "Force sets acceleration, not
   * velocity" is five words long and scores grade 17, because Flesch-Kincaid
   * counts syllables and *acceleration* has five. Shortening that sentence
   * cannot help; the only way to move the number is to stop using the correct
   * term.
   *
   * So the structural limits — sentence length, dash-split clauses — apply
   * everywhere, because they measure writing. The syllable average is held to
   * grade 7 where vocabulary is a choice, and grade 8 where the subject fixes
   * it.
   */
  const isInvestigation = /investigate\//.test(file);
  const bar = isInvestigation ? 7.0 : 8.0;

  it.skipIf(all.length < ENOUGH_FOR_AN_AVERAGE)(
    `reads at grade ${bar} or below on average`,
    () => {
      const mean = all.reduce((n, s) => n + fleschKincaid(s), 0) / all.length;
      expect(mean, `${name} mean Flesch-Kincaid grade`).toBeLessThanOrEqual(bar);
    },
  );

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
