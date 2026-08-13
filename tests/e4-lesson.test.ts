/**
 * E4's content rules.
 *
 * The first block guards the thing a review found broken in a parallel build.
 * E4's second trial is the only evidence separating "the paper had a leftover"
 * from "charge shifted inside it". That trial only works if
 *
 *     story A's leftover is one the paper ALREADY HAD, and
 *     trial 2 uses THE SAME BITS.
 *
 * Break either and both stories predict attraction twice, the experiment
 * separates nothing, and the lesson's central claim becomes false while every
 * screen still reads perfectly well. See docs/specs/E4-grok-review.md.
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BENCH_ACTIONS, STORY_A, STORY_B } from '../src/components/investigate/E4Investigation';

const SRC = readFileSync('src/components/investigate/E4Investigation.tsx', 'utf8');
const PROSE = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
const FLAT = PROSE.replace(/\s+/g, ' ');

describe('1. the discriminating trial actually discriminates', () => {
  it("story A's leftover is pre-existing, not picked up from the comb", () => {
    // "picked up" would make fresh paper reset it, and trial 2 would prove nothing.
    expect(STORY_A).toMatch(/already had/i);
    expect(STORY_A).not.toMatch(/picked up|picks up|got from the comb/i);
  });

  it('story A therefore predicts a PUSH in trial 2', () => {
    expect(STORY_A).toMatch(/pushed away/i);
  });

  it('story B predicts a pull both times, for a stated reason', () => {
    expect(STORY_B).toMatch(/still (?:be )?pulled/i);
    expect(STORY_B).toMatch(/unlike/i);
  });

  it('the two stories disagree — that is the whole point', () => {
    const aPush = /pushed away/i.test(STORY_A);
    const bPush = /pushed away/i.test(STORY_B);
    expect(aPush, 'A must predict a push').toBe(true);
    expect(bPush, 'B must not').toBe(false);
  });

  it('trial 2 instructs the SAME bits, in bold, not fresh ones', () => {
    expect(FLAT).toMatch(/<strong>Use the same bits of paper\.<\/strong>/);
    expect(FLAT).toMatch(/Not fresh ones/);
  });

  it('and the lesson says why reusing them matters', () => {
    expect(FLAT).toMatch(/Why the same bits mattered/);
  });

  it('B is the answer, and A is refuted by naming the trial', () => {
    expect(FLAT).toMatch(/<strong>B, and trial 2 is why\.<\/strong>/);
    expect(FLAT).toMatch(/A predicts a push, on those same bits/);
  });
});

describe('2. the non-uniform field is required, not a footnote', () => {
  // Q-E01: "experiences a net force only if the field is non-uniform".
  it('has a screen of its own', () => {
    const steps = /const STEPS: Step\[\] = \[([\s\S]*?)\];/.exec(SRC)![1];
    expect(steps).toContain('gradient');
  });

  it('states that a uniform push moves nothing, however strong', () => {
    expect(FLAT).toMatch(/would not move at all, however strong the push was/);
  });

  it('and says the student inferred it rather than measured it', () => {
    expect(FLAT).toMatch(/did not measure that with a ruler/);
  });
});

describe('3. the paper never acquires net charge', () => {
  // The model spec's representation rule. Drawing or saying otherwise installs
  // exactly the misconception the lesson defeats.
  it('says nothing left the paper', () => {
    expect(FLAT).toMatch(/Nothing has left the paper/);
  });

  it('says the leftover stays zero', () => {
    expect(FLAT).toMatch(/leftover is still zero|leftover stays zero/i);
  });

  it('and never claims the paper became charged', () => {
    expect(PROSE).not.toMatch(/the paper (?:becomes|became|is now) charged/i);
    expect(PROSE).not.toMatch(/paper picks up charge/i);
  });
});

describe('4. nothing is named before it is earned', () => {
  /**
   * ⚠ The first version looked for the earliest 'polarisation' anywhere in the
   * file and failed on a correct lesson: `earnModel('polarisation')` is an
   * identifier near the top, not something a student reads.
   *
   * The property is where the word is SHOWN, so only screen text is searched.
   * Same proxy-versus-property slip this project keeps making.
   */
  it('polarisation is named only after the picture is built', () => {
    const screens = PROSE.slice(PROSE.indexOf('const body = ()'));
    const shown = [...screens.matchAll(/>[^<>{}]*polarisation/gi)].map((m) => m.index!);
    expect(shown.length, 'the word should be shown to the student once').toBeGreaterThan(0);
    const inside = screens.indexOf("case 'inside'");
    for (const at of shown) {
      expect(at, 'never shown before the inside screen').toBeGreaterThan(inside);
    }
  });

  it('and named as a word for the picture, not a new fact', () => {
    expect(FLAT).toMatch(/The name is not a new fact/);
  });

  it('no field lines', () => {
    expect(FLAT).toMatch(/No field lines/);
  });

  it('no particles, no dipole, no polarisability', () => {
    for (const w of ['electron', 'proton', 'dipole', 'polarisability', 'alpha']) {
      expect(PROSE.toLowerCase(), w).not.toContain(w);
    }
  });
});

describe('5. the assumption is declared, not smuggled', () => {
  it('says outright that charge shifting inside paper is assumed', () => {
    expect(FLAT).toMatch(/We are assuming something/);
    expect(FLAT).toMatch(/we are assuming it/);
  });

  it('and the ledger repeats it as something not established', () => {
    const ledger = PROSE.slice(PROSE.indexOf("case 'ledger'"));
    expect(ledger).toMatch(/You assumed it/);
  });
});

describe('6. structure', () => {
  it('every screen declares a bench action', () => {
    const steps = /const STEPS: Step\[\] = \[([\s\S]*?)\];/.exec(SRC)![1]
      .match(/'([a-z0-9]+)'/g)!.map((s) => s.replace(/'/g, ''));
    for (const s of steps) expect(BENCH_ACTIONS[s as keyof typeof BENCH_ACTIONS], s).toBeDefined();
  });

  it('the two trials are performable — this lesson needs no bench that does not exist', () => {
    expect(BENCH_ACTIONS.try1).toBe('performable');
    expect(BENCH_ACTIONS.try2).toBe('performable');
  });

  it('nothing is deferred, unlike E2 and E3', () => {
    expect(Object.values(BENCH_ACTIONS)).not.toContain('deferred');
  });

  it('ends with what was not established', () => {
    expect(PROSE).toContain('You did not establish');
  });
});
