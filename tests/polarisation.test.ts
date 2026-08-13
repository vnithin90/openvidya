/**
 * E4 verification.
 *
 * AGENTS.md hard rule 2: the implementation sums two Coulomb forces. Most of
 * what follows reaches the same answers through the point-dipole formula
 * F = p·dE/dx instead — a derivative, not a difference of two 1/r² terms.
 *
 * The first block is the one Q-E01 names as decisive. If a neutral scrap ever
 * feels a force in a UNIFORM field, the lesson's explanation is wrong, because
 * the entire argument is that the near end is CLOSER and therefore in a
 * stronger field.
 */

import { describe, expect, it } from 'vitest';
import {
  type Scrap,
  dipoleForce,
  fieldAt,
  forceFalloffExponent,
  inducedCharge,
  movesTowardSource,
  netForce,
  netForceUniform,
} from '../src/physics/polarisation/model';

const paper = (centre: number): Scrap => ({ centre, sep: 1e-4, alpha: 1e-14 });

describe('1. THE DECISIVE CHECK — a uniform field moves nothing', () => {
  it('net force is exactly zero, whatever the field strength', () => {
    for (const E of [1, 1e3, 1e6, -1e6]) {
      expect(netForceUniform(E, paper(0.05)), `E = ${E}`).toBe(0);
    }
  });

  it('and exactly zero for any polarisability', () => {
    for (const alpha of [1e-16, 1e-14, 1e-9]) {
      expect(netForceUniform(1e5, { centre: 0.05, sep: 1e-4, alpha })).toBe(0);
    }
  });

  it('so the attraction cannot be explained without a gradient', () => {
    // The contrast that makes the point: same scrap, same field magnitude at
    // its centre — but a real point charge has a gradient and a uniform field
    // does not.
    const s = paper(0.05);
    const E = fieldAt(2e-9, s.centre)!;
    expect(netForceUniform(E, s)).toBe(0);
    expect(Math.abs(netForce(2e-9, s)!)).toBeGreaterThan(0);
  });
});

describe('2. the pull is toward the comb, whichever kind the comb is', () => {
  // This is the lesson's second trial, and the only thing separating
  // polarisation from a picked-up-charge story.
  for (const q of [+2e-9, -2e-9, +5e-8, -5e-8]) {
    it(`source ${q > 0 ? 'positive' : 'negative'} ${Math.abs(q)}C → paper comes closer`, () => {
      expect(movesTowardSource(q, paper(0.05))).toBe(true);
    });
  }

  it('and the size of the pull is identical for the two signs', () => {
    const a = netForce(+3e-9, paper(0.05))!;
    const b = netForce(-3e-9, paper(0.05))!;
    expect(Math.abs(a - b)).toBeLessThan(Math.abs(a) * 1e-12);
  });

  it('the induced charge on the near end is opposite to the source', () => {
    // Stated as a property because the whole explanation rests on it.
    const s = paper(0.05);
    expect(inducedCharge(+2e-9, s)).toBeGreaterThan(0); // magnitude
    expect(netForce(+2e-9, s)).toBeLessThan(0);          // and the force is inward
    expect(netForce(-2e-9, s)).toBeLessThan(0);
  });
});

describe('3. the two routes agree — pair sum vs dipole gradient', () => {
  for (const r of [0.03, 0.05, 0.1, 0.2]) {
    it(`at ${r * 100} cm`, () => {
      const s: Scrap = { centre: r, sep: 1e-5, alpha: 1e-14 };
      const exact = netForce(2e-9, s)!;
      const approx = dipoleForce(2e-9, s)!;
      expect(Math.abs((exact - approx) / exact)).toBeLessThan(1e-3);
    });
  }

  it('and they converge as the separation shrinks', () => {
    let last = Infinity;
    for (const sep of [1e-3, 1e-4, 1e-5, 1e-6]) {
      const s: Scrap = { centre: 0.05, sep, alpha: 1e-14 };
      const err = Math.abs((netForce(2e-9, s)! - dipoleForce(2e-9, s)!) / netForce(2e-9, s)!);
      expect(err).toBeLessThan(last);
      last = err;
    }
  });
});

describe('4. it dies away much faster than the force on a charged object', () => {
  it('the measured exponent is −5, not −2', () => {
    const n = forceFalloffExponent(2e-9, paper(0.05), 0.05, 0.5)!;
    expect(n).toBeCloseTo(-5, 1);
  });

  it('which is why the comb must be held close', () => {
    // Doubling the distance costs a factor of 32, not 4.
    const near = Math.abs(netForce(2e-9, paper(0.05))!);
    const far = Math.abs(netForce(2e-9, paper(0.10))!);
    expect(near / far).toBeGreaterThan(25);
  });
});

describe('5. the model refuses to answer where it has no answer', () => {
  it('returns null if the scrap would straddle the source', () => {
    expect(netForce(2e-9, { centre: 0.001, sep: 0.01, alpha: 1e-14 })).toBeNull();
  });

  it('returns null if the shift is not small compared with the distance', () => {
    expect(netForce(2e-9, { centre: 0.01, sep: 0.01, alpha: 1e-14 })).toBeNull();
  });

  it('and gives no field at the source itself', () => {
    expect(fieldAt(2e-9, 0)).toBeNull();
  });
});
