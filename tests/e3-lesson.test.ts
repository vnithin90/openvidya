/**
 * E3's content rules, checked against the source of the lesson rather than
 * against the specification that describes it.
 *
 * The two authority rulings this lesson exists under are both the sort of thing
 * that decays quietly under editing:
 *
 *   §17.1  the field is a JUDGMENT with stated criteria, not an established
 *          fact. J1's answer is "neither".
 *   §17.2  §5a is DEFERRED. The student predicts a map and never measures one,
 *          and the screen says when and why.
 *
 * A later edit that tidies "neither" into "A" would read perfectly well and
 * would undo the lesson.
 */

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BENCH_ACTIONS } from '../src/components/investigate/E3Investigation';

const SRC = readFileSync('src/components/investigate/E3Investigation.tsx', 'utf8');
/** Prose only — comments explain the rules and would otherwise trip them. */
const PROSE = SRC.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

/**
 * Source is wrapped at 100 columns, so any phrase longer than a few words is
 * split across a line break and an indent. Three tests in this project have now
 * failed on that — matching a proxy (the exact byte sequence) instead of the
 * property (does the lesson say this). Collapse whitespace once, here.
 */
const FLAT = PROSE.replace(/\s+/g, ' ');

describe('1. §17.1 — the judgment stays open', () => {
  it('J1 offers "neither" as an option at all', () => {
    expect(FLAT).toMatch(/Neither — the map cannot tell them apart/);
  });

  it('and the reveal says neither, not one of the two accounts', () => {
    expect(PROSE).toMatch(/<strong>Neither\.<\/strong>/);
  });

  /**
   * ⚠ THE FIRST VERSION OF THIS TEST WAS WRONG, and in the same way as the
   * build check was: it forbade the STRING "the field is real" and failed on a
   * lesson that was completely correct. The phrase appears in the closing
   * ledger, inside the column headed "You did not establish" — a negation.
   *
   * Forbidding a string is a proxy. The property is that the lesson must never
   * ASSERT it, which is a question of placement, so placement is what is tested.
   */
  it('"the field is real" appears only where it is being denied', () => {
    const ledger = PROSE.slice(PROSE.indexOf("case 'ledger'"));
    const noList = /<ul className="no">([\s\S]*?)<\/ul>/.exec(ledger);
    expect(noList, 'the ledger must have a did-not-establish list').not.toBeNull();

    const phrase = /the field is real/gi;
    const everywhere = [...PROSE.matchAll(phrase)].length;
    const inTheNoList = [...noList![1].matchAll(phrase)].length;

    expect(everywhere, 'the lesson should say it at least once, as a denial').toBeGreaterThan(0);
    expect(inTheNoList, 'and every occurrence must sit in the did-not-establish column')
      .toBe(everywhere);
  });

  it('and no other form of the claim is asserted anywhere', () => {
    for (const phrase of [/we have shown the field/i, /this proves/i, /the field was established/i]) {
      expect(PROSE, `forbidden claim: ${phrase}`).not.toMatch(phrase);
    }
  });

  it('and says outright that nothing here could establish it', () => {
    expect(PROSE).toMatch(/Nothing here could/);
  });

  it('the explanation separates what the student did from what physics does', () => {
    expect(PROSE).toContain('What you established');
    expect(PROSE).toContain('What physics does anyway');
  });
});

describe('2. §17.2 — the deferral is declared, and stated to the student', () => {
  it('exactly one screen is declared deferred', () => {
    // It used to be a screen of its own and is now a card on `observe`. §B
    // requires the declaration, never a particular container.
    const deferred = Object.entries(BENCH_ACTIONS).filter(([, v]) => v === 'deferred');
    expect(deferred.map(([k]) => k)).toEqual(['observe']);
  });

  it('every screen has a declaration — none may be silently absent', () => {
    for (const [k, v] of Object.entries(BENCH_ACTIONS)) {
      expect(['none', 'performable', 'deferred'], k).toContain(v);
    }
  });

  it('says plainly that nobody has measured it', () => {
    expect(FLAT).toMatch(/Nobody has measured this — not you, and not us/);
  });

  it('says WHY it is not available', () => {
    expect(FLAT).toMatch(/never been built and checked/);
  });

  it('and why it is being said at all rather than left out', () => {
    expect(FLAT).toMatch(/hands you a procedure nobody has tried/);
  });

  it('but does NOT explain the rod — a design post-mortem is not a lesson', () => {
    // 211-word screen, a third of it about an apparatus the student was never
    // offered. Cut. The full reasoning lives in docs/LESSON_E3 §5a.
    expect(PROSE).not.toMatch(/does not point straight out/);
    expect(PROSE).not.toMatch(/The first version of this experiment/);
  });
});

describe('3. nothing is named before it is earned', () => {
  it('no field lines — the student drew six arrows, not curves', () => {
    expect(PROSE).toMatch(/No field lines/);
    // and the lesson must not quietly draw them anyway
    expect(PROSE).not.toMatch(/field line[s]? (?:show|reveal|are drawn)/i);
  });

  it('no formula for the field of a charge', () => {
    // E = F/q_test is the definition and is allowed. kq/r² is not.
    expect(PROSE).not.toMatch(/kq\s*\/\s*r/);
    expect(PROSE).not.toMatch(/E\s*=\s*k/);
  });

  it('no particles', () => {
    for (const w of ['electron', 'proton', 'nucleus']) {
      expect(PROSE.toLowerCase(), w).not.toContain(w);
    }
  });

  it('the definition it does give is the one E3 earned', () => {
    expect(PROSE).toMatch(/E &nbsp;=&nbsp; F \/ q/);
  });
});

describe('4. the timing question is asked and deliberately not answered', () => {
  it('P3 is committed', () => {
    expect(PROSE).toMatch(/timinglocked/);
  });

  it('and the screen says this lesson will not answer it', () => {
    expect(FLAT).toMatch(/Nothing in this lesson answers that/);
  });

  it('the delay is quoted as ~3 ns, the figure that was computed', () => {
    // An earlier draft of the spec said 0.3 ns. 1 m / c = 3.34 ns.
    expect(FLAT).toMatch(/three nanoseconds/);
    expect(PROSE).not.toMatch(/0\.3 nanosecond/);
  });
});

describe('5. the history is quarantined until it is sourced', () => {
  it('Faraday is off the spine, not in STEPS', () => {
    // Off-spine screens must not count against "screen N of M".
    const steps = /const STEPS: Step\[\] = \[([\s\S]*?)\];/.exec(SRC)![1];
    expect(steps).not.toContain('faraday');
  });

  it('and carries its own unsourced warning', () => {
    expect(PROSE).toMatch(/not yet sourced/);
  });

  it('which says the course does not ship unsourced history as fact', () => {
    expect(FLAT).toMatch(/does not put unsourced history in front of/);
  });
});

describe('6. the lesson ends with what it did not establish', () => {
  it('has a "you did not establish" column', () => {
    expect(PROSE).toContain('You did not establish');
  });

  it('and points at the next question', () => {
    expect(PROSE).toMatch(/q = 0 predicts nothing happens|charged comb/);
  });

  it('the student sees their own first answer again at the end', () => {
    const ledger = PROSE.slice(PROSE.indexOf("case 'ledger'"));
    expect(ledger).toContain('p1why');
  });
});
