/**
 * INDEPENDENT VERIFICATION — Module 1, "What is current?"
 *
 * Five claims, per the scene review. Charge conservation was deliberately
 * REMOVED from this suite: it requires source/sink bookkeeping that expands the
 * module's conceptual scope, and Module 1 does not teach it.
 *
 * The crossing count is checked against a closed-form integer count derived
 * from the marker spacing. The implementation steps in time and detects sign
 * changes; the check counts integers in an interval. Different routes.
 */

import { describe, it, expect } from 'vitest';
import {
  E,
  PROTON_CHARGE,
  ELECTRON_CHARGE,
  netCount,
  netCharge,
  isNeutral,
  countFromCharge,
  chargeFromCount,
  consistentWithQuantisation,
  countCrossings,
  chargeCrossed,
  rate,
  markersForCharge,
  mAhToCoulomb,
  ratioRange,
  type Stream,
} from '../src/physics/current/model';

const stream: Stream = { spacing: 0.05, speed: 0.4, chargePerMarker: 0.5 };

// Closed-form count: markers cross surfaceX during [t0,t1] iff their index k
// satisfies  (x_s - v t1 - off)/d  <  k  <=  (x_s - v t0 - off)/d.
function analyticCount(s: Stream, x: number, t0: number, t1: number): number {
  const off = s.offset ?? 0;
  const hi = (x - s.speed * t0 - off) / s.spacing;
  const lo = (x - s.speed * t1 - off) / s.spacing;
  return Math.floor(hi) - Math.floor(lo);
}

describe('1. charge is quantised: Q/e is always a whole number of elementary charges', () => {
  it('round-trips count → charge → count exactly', () => {
    for (const N of [1, 7, 1000, 6.24e18]) {
      expect(countFromCharge(chargeFromCount(N))).toBeCloseTo(N, 6);
    }
  });

  it('one elementary charge is exactly E', () => {
    expect(chargeFromCount(1)).toBe(E);
    expect(countFromCharge(E)).toBeCloseTo(1, 12);
  });

  it('a whole number of elementary charges yields an integral count', () => {
    for (const N of [3, 42, 1_000_003]) {
      const n = countFromCharge(chargeFromCount(N));
      expect(Math.abs(n - Math.round(n))).toBeLessThan(1e-6);
    }
  });

  it('refuses to judge quantisation without an uncertainty', () => {
    // Guards the error present in an earlier draft of the specification:
    // "0.14% from an integer, therefore consistent" is not valid reasoning.
    expect(() => consistentWithQuantisation(4.8e-19, 0)).toThrow(/uncertainty is required/);
    expect(() => consistentWithQuantisation(4.8e-19, -1)).toThrow(/uncertainty is required/);
  });

  it('decides consistency by the uncertainty interval, not by percentage', () => {
    // 3e = 4.806529902e-19 C
    const tight = consistentWithQuantisation(4.8e-19, 0.001e-19);
    const loose = consistentWithQuantisation(4.8e-19, 0.02e-19);
    expect(tight.nearest).toBe(3);
    expect(loose.nearest).toBe(3);
    expect(tight.consistent).toBe(false); // 0.0065e-19 away, outside ±0.001e-19
    expect(loose.consistent).toBe(true); //                  inside ±0.02e-19
    // Same central value, opposite verdicts. Percentage deviation alone
    // could not have produced this.

    const half = consistentWithQuantisation(2.4e-19, 0.02e-19);
    expect(half.consistent).toBe(false);
    expect(Math.abs(half.n - 1.5)).toBeLessThan(0.01);
  });
});

describe('1b. charge comes in two kinds, and the signs are right', () => {
  // Added after review found Scene 1 telling students the electron carries
  // +1.602e-19 C. It carries -e. The elementary charge is positive by
  // definition; the electron's charge is not.
  it('the elementary charge is positive; the electron is negative', () => {
    expect(E).toBeGreaterThan(0);
    expect(PROTON_CHARGE).toBe(E);
    expect(ELECTRON_CHARGE).toBe(-E);
    expect(PROTON_CHARGE + ELECTRON_CHARGE).toBe(0);
  });

  it('equal populations are neutral, however large', () => {
    for (const n of [0, 1, 7, 1_000_000]) {
      expect(netCount({ positive: n, negative: n })).toBe(0);
      expect(netCharge({ positive: n, negative: n })).toBe(0);
      expect(isNeutral({ positive: n, negative: n })).toBe(true);
    }
  });

  it('a neutral object is not an empty one', () => {
    // The point of the scene: neutral means balanced, not "no charged particles".
    const balanced = { positive: 500, negative: 500 };
    expect(isNeutral(balanced)).toBe(true);
    expect(balanced.positive + balanced.negative).toBe(1000);
  });

  it('net charge is what is countable, and it is signed', () => {
    expect(netCharge({ positive: 5, negative: 3 })).toBeCloseTo(2 * E, 30);
    expect(netCharge({ positive: 3, negative: 5 })).toBeCloseTo(-2 * E, 30);
    expect(netCount({ positive: 0, negative: 4 })).toBe(-4);
  });

  it('swapping the populations flips the sign and nothing else', () => {
    const a = { positive: 12, negative: 5 };
    const b = { positive: 5, negative: 12 };
    expect(netCharge(a)).toBeCloseTo(-netCharge(b), 30);
  });

  it('net charge stays quantised for negative values too', () => {
    for (const p of [{ positive: 0, negative: 3 }, { positive: 2, negative: 9 }]) {
      const n = countFromCharge(netCharge(p));
      expect(Math.abs(n - Math.round(n))).toBeLessThan(1e-6);
      expect(Math.round(n)).toBeLessThan(0);
    }
  });

  it('adding one of each kind changes nothing', () => {
    const before = netCharge({ positive: 6, negative: 4 });
    const after = netCharge({ positive: 7, negative: 5 });
    expect(after).toBeCloseTo(before, 30);
  });

  it('refuses fractional or negative particle counts', () => {
    // Sign belongs to which population a particle is in, never to the count.
    expect(() => netCharge({ positive: -1, negative: 0 })).toThrow(/non-negative whole number/);
    expect(() => netCharge({ positive: 2.5, negative: 0 })).toThrow(/non-negative whole number/);
  });
});

describe('2. coulomb and elementary-charge readouts agree', () => {
  it('the two displays never disagree, by an independent conversion', () => {
    for (const Q of [1e-18, 1e-6, 0.5, 10, 9000]) {
      const viaModel = countFromCharge(Q);
      const viaIndependentPath = Q * (1 / 1.602176634e-19);
      expect(Math.abs(viaModel - viaIndependentPath) / viaModel).toBeLessThan(1e-12);
    }
  });

  it('10 C is about 6.24e19 elementary charges', () => {
    expect(countFromCharge(10)).toBeGreaterThan(6.2e19);
    expect(countFromCharge(10)).toBeLessThan(6.3e19);
  });
});

describe('3. the displayed rate equals charge ÷ window, recomputed independently', () => {
  it('matches a directly computed quotient', () => {
    for (const [Q, dt] of [[10, 10], [10, 2], [3, 0.25], [9000, 18000]] as const) {
      expect(rate(Q, dt)).toBeCloseTo(Q / dt, 12);
    }
  });

  it('the worked runs from the specification', () => {
    expect(rate(10, 10)).toBeCloseTo(1, 12);
    expect(rate(10, 2)).toBeCloseTo(5, 12);
  });

  it('same charge in a shorter window always gives a larger rate', () => {
    const Q = 10;
    let prev = 0;
    for (const dt of [10, 5, 2, 1, 0.5]) {
      const r = rate(Q, dt);
      expect(r).toBeGreaterThan(prev); // shorter window ⇒ larger rate
      prev = r;
    }
    expect(rate(Q, 0.5)).toBeCloseTo(20, 12);
  });

  it('refuses to produce a rate without a time interval', () => {
    // The module's objective, enforced in code: charge alone is not a rate.
    expect(() => rate(10, 0)).toThrow(/positive time interval/);
    expect(() => rate(10, -1)).toThrow(/positive time interval/);
  });

  it('the drawn markers are generated from the chosen charge', () => {
    for (const Q of [1, 2.5, 10]) {
      const m = markersForCharge(Q, 0.5);
      expect(m * 0.5).toBeCloseTo(Q, 12);
    }
  });
});

describe('4. the result does not depend on where the surface is drawn', () => {
  it('crossing counts agree across surface positions to within one marker', () => {
    const t0 = 0;
    const t1 = 5;
    const counts = [0.5, 0.9, 1.3, 1.7, 2.1].map((x) => countCrossings(stream, x, t0, t1));
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });

  it('the measured rate converges as the window grows, whatever the surface', () => {
    const expected = (stream.speed / stream.spacing) * stream.chargePerMarker; // C/s
    for (const x of [0.6, 1.4, 2.2]) {
      const Q = chargeCrossed(stream, x, 0, 200, 1e-3);
      expect(Math.abs(rate(Q, 200) - expected) / expected).toBeLessThan(0.01);
    }
  });

  it('the stepping implementation matches a closed-form integer count', () => {
    // Independent route: the implementation steps time and detects sign
    // changes; this counts integers in an interval.
    for (const x of [0.7, 1.1, 1.9]) {
      for (const [t0, t1] of [[0, 3], [1, 4.5], [0.25, 7]] as const) {
        const stepped = countCrossings(stream, x, t0, t1, 1e-5);
        const closed = analyticCount(stream, x, t0, t1);
        expect(Math.abs(stepped - closed)).toBeLessThanOrEqual(1);
      }
    }
  });

  it('rejects a degenerate stream or window', () => {
    expect(() => countCrossings({ ...stream, speed: 0 }, 1, 0, 1)).toThrow(/speed/);
    expect(() => countCrossings({ ...stream, spacing: 0 }, 1, 0, 1)).toThrow(/spacing/);
    expect(() => countCrossings(stream, 1, 2, 1)).toThrow(/positive duration/);
  });
});

describe('5. the comparison panel propagates its input ranges correctly', () => {
  it('mAh converts to coulombs', () => {
    expect(mAhToCoulomb(2000)).toBeCloseTo(7200, 9);
    expect(mAhToCoulomb(3000)).toBeCloseTo(10800, 9);
  });

  it('reproduces the published 360x-2160x range', () => {
    const cell: readonly [number, number] = [mAhToCoulomb(2000), mAhToCoulomb(3000)];
    const stroke: readonly [number, number] = [5, 20];
    const [lo, hi] = ratioRange(cell, stroke);
    expect(lo).toBeCloseTo(360, 6);
    expect(hi).toBeCloseTo(2160, 6);
  });

  it('the ratio interval is correct, not merely the ratio of midpoints', () => {
    const [lo, hi] = ratioRange([7200, 10800], [5, 20]);
    const midpointRatio = ((7200 + 10800) / 2) / ((5 + 20) / 2);
    expect(midpointRatio).toBeGreaterThan(lo);
    expect(midpointRatio).toBeLessThan(hi);
    // A single point value would hide a factor-of-six spread.
    expect(hi / lo).toBeCloseTo(6, 6);
  });

  it('refuses non-positive intervals', () => {
    expect(() => ratioRange([0, 1], [1, 2])).toThrow(/strictly positive/);
    expect(() => ratioRange([1, 2], [-1, 2])).toThrow(/strictly positive/);
  });
});
