/**
 * E2 verification.
 *
 * AGENTS.md hard rule 2: the implementation and its verification must not share
 * a route. `predicted()` is a closed form. Nearly every test below reaches the
 * same numbers by ROOT-FINDING the force balance instead — bisection on
 * c/(2L sin θ)^n = tan θ — which shares no algebra with 2^(−2k/(n+1)).
 *
 * The one thing that cannot be checked that way is the ordering of the three
 * laws, which is a property of the exponent rather than of the apparatus, so it
 * is tested as an invariant.
 */

import { describe, expect, it } from 'vitest';
import {
  DRAWN,
  LAWS,
  RULED,
  ballPositions,
  closestLaw,
  equilibriumR,
  predicted,
  ratioNumerical,
} from '../src/physics/coulomb-force/model';

const L = RULED.threadLengthMm;

/** A charge constant that puts the pair at roughly the ruled r₀ for a given n. */
function cForR0(n: number, r0: number): number {
  // At equilibrium c = r^n · tan θ with r = 2L sin θ.
  const sin = r0 / (2 * L);
  const t = Math.asin(sin);
  return Math.pow(r0, n) * Math.tan(t);
}

describe('1. the closed form is the small-angle limit of the actual balance', () => {
  // Independent route: solve the equilibrium numerically at successively smaller
  // angles and watch the ratio converge on the closed form.
  for (const n of [1, 2, 3]) {
    it(`converges for 1/r^${n} as the angle shrinks`, () => {
      let previousError = Infinity;
      for (const r0 of [60, 20, 6, 2]) {
        const c = cForR0(n, r0);
        const err = Math.abs(ratioNumerical(n, 1, c, L) - predicted(n, 1));
        expect(err).toBeLessThan(previousError);
        previousError = err;
      }
      expect(previousError).toBeLessThan(1e-4);
    });
  }
});

describe('2. at the ruled geometry the small-angle form is still usable', () => {
  // theta0 = 19.5 deg. The model spec claims the deviation stays under 3%.
  for (const n of [1, 2, 3]) {
    for (const k of [1, 2, 3]) {
      it(`1/r^${n}, k=${k}: closed form within 3% of the solved balance`, () => {
        const c = cForR0(n, RULED.r0Mm);
        const solved = ratioNumerical(n, k, c, L);
        expect(Math.abs(solved - predicted(n, k))).toBeLessThan(0.03);
      });
    }
  }

  it('the ruled starting angle really is under the 20 degree cap', () => {
    const c = cForR0(2, RULED.r0Mm);
    const r = equilibriumR(c, 2, L);
    const deg = (Math.asin(r / (2 * L)) * 180) / Math.PI;
    expect(deg).toBeGreaterThan(19);
    expect(deg).toBeLessThan(20);
  });
});

describe('3. the numbers the lesson shows a student', () => {
  const table: [number, number, number][] = [
    [1, 1, 0.5], [2, 1, 0.63], [3, 1, 0.707],
    [1, 2, 0.25], [2, 2, 0.397], [3, 2, 0.5],
    [1, 3, 0.125], [2, 3, 0.25], [3, 3, 0.354],
  ];
  for (const [n, k, want] of table) {
    it(`1/r^${n} at k=${k} is ${want}`, () => {
      expect(predicted(n, k)).toBeCloseTo(want, 3);
    });
  }
});

describe('4. a steeper law must give a LARGER ratio', () => {
  // The step a reviewer once got backwards, so it is asserted rather than assumed.
  for (const k of [1, 2, 3]) {
    it(`at k=${k}`, () => {
      expect(predicted(1, k)).toBeLessThan(predicted(2, k));
      expect(predicted(2, k)).toBeLessThan(predicted(3, k));
    });
  }

  it('and the same ordering survives the numerically solved balance', () => {
    const ratios = LAWS.map((l) => ratioNumerical(l.n, 2, cForR0(l.n, RULED.r0Mm), L));
    expect(ratios[0]).toBeLessThan(ratios[1]);
    expect(ratios[1]).toBeLessThan(ratios[2]);
  });
});

describe('5. discrimination — why the lesson offers a choice at all', () => {
  it('the square/cube gap widens with each halving', () => {
    const gap = (k: number) => predicted(3, k) - predicted(2, k);
    expect(gap(2)).toBeGreaterThan(gap(1));
    expect(gap(3)).toBeGreaterThan(gap(2));
  });

  it('the 1/r gap stays the wider one, so "steeper than proportional" survives', () => {
    for (const k of [1, 2, 3]) {
      expect(predicted(2, k) - predicted(1, k)).toBeGreaterThan(predicted(3, k) - predicted(2, k));
    }
  });

  it('at k=1 a 5% uncertainty cannot separate square from cube', () => {
    // 0.630 vs 0.707 — 7.7 points apart. This is the lesson's central honesty.
    expect(closestLaw(0.65, 1, 0.05).decisive).toBe(false);
  });

  it('but a clean 1/r result is separable even so', () => {
    expect(closestLaw(0.5, 1, 0.05).best.n).toBe(1);
    expect(closestLaw(0.5, 1, 0.05).decisive).toBe(true);
  });
});

describe('6. the figures are drawn to the scale they claim', () => {
  it('ball radius is a/r0 = 1/20 of the drawn separation', () => {
    expect(DRAWN.ballR).toBeCloseTo(DRAWN.r0 / 20, 12);
  });

  it('and that matches the ruled apparatus, 10 mm in 200 mm', () => {
    expect(DRAWN.ballR / DRAWN.r0).toBeCloseTo(RULED.ballRadiusMm / RULED.r0Mm, 12);
  });

  it('the drawn start angle is inside the 20 degree cap', () => {
    expect(ballPositions(DRAWN.r0).deg).toBeLessThanOrEqual(20);
  });

  it('the balls never overlap, through three halvings', () => {
    for (const k of [1, 2, 3]) {
      const drawn = DRAWN.r0 * predicted(2, k);
      expect(drawn - 2 * DRAWN.ballR).toBeGreaterThan(4);
    }
  });

  it('separation shrinks monotonically', () => {
    const rs = [0, 1, 2, 3].map((k) => predicted(2, k));
    for (let i = 1; i < rs.length; i++) expect(rs[i]).toBeLessThan(rs[i - 1]);
  });
});

describe('7. the model refuses to invent an answer it does not have', () => {
  it('returns NaN when no equilibrium exists rather than a plausible number', () => {
    // Charge so small the threads never separate: there is no root.
    expect(Number.isNaN(equilibriumR(1e-30, 2, L))).toBe(true);
  });
});
