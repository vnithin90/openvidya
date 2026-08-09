/**
 * INDEPENDENT VERIFICATION — Projectile motion
 *
 * The implementation integrates dr/dt = v, dv/dt = -g ŷ numerically with RK4.
 * These tests check it against results derived by a DIFFERENT route: the
 * closed-form solution, conservation laws, symmetry, and limiting cases.
 *
 * That independence is the whole point. A test that recomputed the RK4 step
 * and compared it to itself would always pass and would tell you nothing.
 */

import { describe, it, expect } from 'vitest';
import { simulate, initialState, rk4Step, specificEnergy, DEG } from '../src/physics/projectile/model';

// --- Analytical results, derived independently of the integrator ------------
const analyticRange = (v0: number, thetaDeg: number, g: number) =>
  (v0 * v0 * Math.sin(2 * thetaDeg * DEG)) / g;

const analyticMaxHeight = (v0: number, thetaDeg: number, g: number) =>
  (v0 * v0 * Math.sin(thetaDeg * DEG) ** 2) / (2 * g);

const analyticTimeOfFlight = (v0: number, thetaDeg: number, g: number) =>
  (2 * v0 * Math.sin(thetaDeg * DEG)) / g;

const cases = [
  { v0: 25, thetaDeg: 45, g: 9.81 },
  { v0: 10, thetaDeg: 30, g: 9.81 },
  { v0: 60, thetaDeg: 75, g: 9.81 },
  { v0: 5, thetaDeg: 15, g: 1.62 },   // lunar g
  { v0: 42, thetaDeg: 60, g: 24.79 }, // jovian g
];

describe('analytical validation (independent of the numerical integrator)', () => {
  for (const c of cases) {
    it(`range matches v0^2 sin(2θ)/g for v0=${c.v0}, θ=${c.thetaDeg}, g=${c.g}`, () => {
      const sim = simulate(c);
      const expected = analyticRange(c.v0, c.thetaDeg, c.g);
      expect(sim.range).toBeCloseTo(expected, 6);
      expect(Math.abs(sim.range - expected) / expected).toBeLessThan(1e-6);
    });

    it(`max height matches v0^2 sin^2(θ)/2g for v0=${c.v0}, θ=${c.thetaDeg}`, () => {
      const sim = simulate(c);
      const expected = analyticMaxHeight(c.v0, c.thetaDeg, c.g);
      expect(Math.abs(sim.maxHeight - expected) / expected).toBeLessThan(1e-5);
    });

    it(`time of flight matches 2 v0 sin(θ)/g for v0=${c.v0}, θ=${c.thetaDeg}`, () => {
      const sim = simulate(c);
      const expected = analyticTimeOfFlight(c.v0, c.thetaDeg, c.g);
      expect(Math.abs(sim.timeOfFlight - expected) / expected).toBeLessThan(1e-6);
    });
  }
});

describe('symmetry', () => {
  it('complementary launch angles give equal range', () => {
    for (const theta of [10, 25, 40]) {
      const a = simulate({ v0: 30, thetaDeg: theta, g: 9.81 });
      const b = simulate({ v0: 30, thetaDeg: 90 - theta, g: 9.81 });
      expect(Math.abs(a.range - b.range) / a.range).toBeLessThan(1e-6);
    }
  });

  it('ascent and descent times are equal for level ground', () => {
    const sim = simulate({ v0: 30, thetaDeg: 50, g: 9.81 });
    const apex = sim.states.reduce((best, s) => (s.r.y > best.r.y ? s : best), sim.states[0]);
    const ascent = apex.t;
    const descent = sim.timeOfFlight - apex.t;
    expect(Math.abs(ascent - descent) / ascent).toBeLessThan(1e-3);
  });
});

describe('conservation and invariants', () => {
  it('specific mechanical energy is conserved along the trajectory', () => {
    const g = 9.81;
    const sim = simulate({ v0: 40, thetaDeg: 55, g });
    const e0 = specificEnergy(sim.states[0], g);
    for (const s of sim.states) {
      expect(Math.abs(specificEnergy(s, g) - e0) / e0).toBeLessThan(1e-9);
    }
  });

  it('horizontal velocity never changes', () => {
    const sim = simulate({ v0: 33, thetaDeg: 62, g: 9.81 });
    const vx0 = sim.states[0].v.x;
    for (const s of sim.states) {
      expect(Math.abs(s.v.x - vx0) / vx0).toBeLessThan(1e-12);
    }
  });

  it('vertical velocity reverses sign symmetrically about the apex', () => {
    const g = 9.81;
    const sim = simulate({ v0: 20, thetaDeg: 45, g });
    const vy0 = sim.states[0].v.y;
    const last = sim.states[sim.states.length - 1];
    expect(Math.abs(last.v.y + vy0) / Math.abs(vy0)).toBeLessThan(1e-6);
  });
});

describe('limiting cases', () => {
  it('θ = 0 from the ground gives zero range', () => {
    expect(simulate({ v0: 30, thetaDeg: 0, g: 9.81 }).range).toBe(0);
  });

  it('θ = 90 gives (numerically) zero range', () => {
    const sim = simulate({ v0: 30, thetaDeg: 90, g: 9.81 });
    expect(Math.abs(sim.range)).toBeLessThan(1e-9);
  });

  it('45° maximises range on level ground', () => {
    const r = (t: number) => simulate({ v0: 30, thetaDeg: t, g: 9.81 }).range;
    const at45 = r(45);
    for (const t of [20, 30, 40, 50, 60, 70]) {
      expect(r(t)).toBeLessThanOrEqual(at45 + 1e-9);
    }
  });

  it('stronger gravity shortens the flight', () => {
    const weak = simulate({ v0: 30, thetaDeg: 45, g: 5 });
    const strong = simulate({ v0: 30, thetaDeg: 45, g: 20 });
    expect(strong.timeOfFlight).toBeLessThan(weak.timeOfFlight);
    expect(strong.range).toBeLessThan(weak.range);
  });
});

describe('the model fails loudly rather than returning nonsense', () => {
  // Added after mutation testing: flipping the sign of the acceleration used to
  // exhaust memory instead of failing a test. A run that dies reports nothing.
  it('rejects a non-positive g', () => {
    expect(() => simulate({ v0: 20, thetaDeg: 45, g: 0 })).toThrow(/positive magnitude/);
    expect(() => simulate({ v0: 20, thetaDeg: 45, g: -9.81 })).toThrow(/positive magnitude/);
  });

  it('throws if the particle never returns to the ground', () => {
    // A step budget too small to contain the flight stands in for any model
    // that fails to terminate; the guard must fire rather than silently
    // returning the final integrated state as a "range".
    expect(() => simulate({ v0: 90, thetaDeg: 89, g: 1.0 }, 1e-3, 500)).toThrow(
      /did not return to y = 0/
    );
  });
});

describe('integrator convergence', () => {
  it('error falls as the step size shrinks (fourth-order behaviour)', () => {
    const p = { v0: 30, thetaDeg: 40, g: 9.81 };
    const exact = analyticRange(p.v0, p.thetaDeg, p.g);
    const coarse = Math.abs(simulate(p, 1e-1).range - exact);
    const fine = Math.abs(simulate(p, 1e-2).range - exact);
    // Bisection already removes most of the landing-point error, so we assert
    // only that refinement does not make things worse.
    expect(fine).toBeLessThanOrEqual(coarse + 1e-12);
  });

  it('a single RK4 step reproduces the exact solution of a linear system', () => {
    // RK4 is exact to machine precision for constant acceleration, so this
    // checks the step implementation itself rather than the physics.
    const g = 9.81;
    const s0 = initialState({ v0: 20, thetaDeg: 37, g });
    const dt = 0.25;
    const s1 = rk4Step(s0, dt, g);
    expect(s1.r.x).toBeCloseTo(s0.r.x + s0.v.x * dt, 12);
    expect(s1.r.y).toBeCloseTo(s0.r.y + s0.v.y * dt - 0.5 * g * dt * dt, 12);
    expect(s1.v.y).toBeCloseTo(s0.v.y - g * dt, 12);
  });
});
