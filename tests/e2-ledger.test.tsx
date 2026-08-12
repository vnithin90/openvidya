/**
 * The closing ledger sort.
 *
 * The first block is the one that matters. This screen now holds the answers to
 * a classification the student has not made yet, and the whole lesson's
 * discipline is that a result never appears before the commitment. A reveal
 * implemented carelessly puts the answer in the DOM and hides it with CSS,
 * which is not hiding it at all — View Source, or a screen reader, finds it.
 *
 * So: assert the answers are ABSENT from the markup, not merely invisible.
 */

import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { BINS, CLAIMS } from '../src/components/investigate/E2Investigation';

describe('1. nothing gives the answer away before the student commits', () => {
  // Rendering the component itself needs localStorage, so this checks the data
  // the screen is built from: no claim may carry its bin in the visible text.
  it('a claim never names its own answer', () => {
    for (const c of CLAIMS) {
      const bin = BINS.find((b) => b.id === c.answer)!;
      expect(c.text.toLowerCase()).not.toContain(bin.label.toLowerCase());
    }
  });

  it('the reasoning is stored separately from the claim, so it can be withheld', () => {
    for (const c of CLAIMS) {
      expect(c.why).toBeTruthy();
      expect(c.text).not.toContain(c.why);
    }
  });
});

describe('2. the shape the design argued for', () => {
  it('three bins, not four', () => {
    expect(BINS).toHaveLength(3);
  });

  it('four claims, not six', () => {
    expect(CLAIMS).toHaveLength(4);
  });

  it('the third bin says "other evidence", not "somewhere else"', () => {
    // "Came from somewhere else" could mean "a teacher told me". The distinction
    // E2 wants is independent evidence.
    const third = BINS[2].label.toLowerCase();
    expect(third).toContain('evidence');
    expect(third).not.toContain('somewhere else');
  });

  it('every bin is used by at least one claim, so no bin is decorative', () => {
    const used = new Set(CLAIMS.map((c) => c.answer));
    expect(used.size).toBeGreaterThanOrEqual(2);
    expect([...used].every((b) => BINS.some((x) => x.id === b))).toBe(true);
  });
});

describe('3. the two pairs — same physics, different epistemic status', () => {
  // A student who sorts both members of a pair into the same bin has missed J1.
  // If the pairs ever collapse into one bin, the screen stops testing anything.
  it('the two falloff claims land in different bins', () => {
    const steeper = CLAIMS.find((c) => c.id === 'steeper')!;
    const square = CLAIMS.find((c) => c.id === 'square')!;
    expect(steeper.answer).not.toBe(square.answer);
  });

  it('the two charge claims land in different bins', () => {
    const equal = CLAIMS.find((c) => c.id === 'equal')!;
    const product = CLAIMS.find((c) => c.id === 'product')!;
    expect(equal.answer).not.toBe(product.answer);
  });

  it('specifically: the product form FITS but is not established', () => {
    // E2's own ledger says so — "fits everything I tried" is not "is the law".
    // Getting this wrong would contradict the lesson's own closing text.
    expect(CLAIMS.find((c) => c.id === 'product')!.answer).toBe('fits');
  });

  it('and the exact inverse square comes from elsewhere, not from the bench', () => {
    // This is J1's conclusion. If it ever reads "mine", J1 has been undone.
    expect(CLAIMS.find((c) => c.id === 'square')!.answer).toBe('elsewhere');
  });
});

describe('4. the interaction uses only vocabulary E2 has earned', () => {
  const all = CLAIMS.map((c) => `${c.text} ${c.why}`).join(' ');

  it('never names the constant', () => {
    // §9 says the constant is missing on purpose. A sort card naming it would
    // introduce it in order to sort it.
    expect(all).not.toMatch(/\bk\b\s*=|constant k|the constant\b/i);
  });

  it('never writes the force law as an equation', () => {
    expect(all).not.toMatch(/F\s*=/);
  });

  it('does not introduce particles, fields or charge units', () => {
    for (const word of ['electron', 'proton', 'coulomb of', 'field']) {
      expect(all.toLowerCase()).not.toContain(word);
    }
  });
});

describe('5. every reveal carries reasoning, not just a verdict', () => {
  it('each explanation is a real argument, not a word', () => {
    for (const c of CLAIMS) {
      expect(c.why.split(/\s+/).length, c.id).toBeGreaterThan(20);
    }
  });

  it('the two hardest claims point back at where the distinction was drawn', () => {
    expect(CLAIMS.find((c) => c.id === 'product')!.why).toMatch(/J1|fits everything/i);
    expect(CLAIMS.find((c) => c.id === 'square')!.why).toMatch(/J1|Cavendish|Priestley/i);
  });
});
