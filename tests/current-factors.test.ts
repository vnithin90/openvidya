/**
 * INDEPENDENT VERIFICATION — Module 2, I = n q A v_d
 *
 * Implementation multiplies four factors. Checks use proportionality,
 * algebraic rearrangement, and the flux identity via a different grouping.
 */

import { describe, it, expect } from 'vitest';
import {
  E,
  N_COPPER_MODEL,
  currentFromFactors,
  currentMagnitude,
  driftFromCurrent,
  chargeInInterval,
  chargeFlux,
  mm2_to_m2,
  type ConductionFactors,
} from '../src/physics/current-factors/model';

const base: ConductionFactors = {
  n: 1e28,
  q: E,
  A: mm2_to_m2(1), // 1 mm²
  v_d: 1e-4, // 0.1 mm/s
};

describe('product model I = n q A v_d', () => {
  it('matches a regrouped product (independent association)', () => {
    const I = currentFromFactors(base);
    // Different association order — not a copy of the implementation line.
    const regrouped = (base.n * base.A) * (base.q * base.v_d);
    expect(Math.abs(I - regrouped) / Math.abs(I)).toBeLessThan(1e-15);
  });

  it('doubling any single factor doubles I', () => {
    const I0 = currentMagnitude(base);
    expect(currentMagnitude({ ...base, n: base.n * 2 }) / I0).toBeCloseTo(2, 12);
    expect(currentMagnitude({ ...base, A: base.A * 2 }) / I0).toBeCloseTo(2, 12);
    expect(currentMagnitude({ ...base, v_d: base.v_d * 2 }) / I0).toBeCloseTo(2, 12);
    expect(currentMagnitude({ ...base, q: base.q * 2 }) / I0).toBeCloseTo(2, 12);
  });

  it('halving one factor and doubling another leaves I unchanged', () => {
    const I0 = currentMagnitude(base);
    const twin = currentMagnitude({ ...base, A: base.A * 2, v_d: base.v_d / 2 });
    expect(Math.abs(twin - I0) / I0).toBeLessThan(1e-12);
  });

  it('rejects non-positive factors', () => {
    expect(() => currentFromFactors({ ...base, n: 0 })).toThrow(/n/);
    expect(() => currentFromFactors({ ...base, A: -1 })).toThrow(/A/);
    expect(() => currentFromFactors({ ...base, v_d: 0 })).toThrow(/v_d/);
    expect(() => currentFromFactors({ ...base, q: 0 })).toThrow(/q/);
  });
});

describe('inverse: v_d from I', () => {
  it('recovers the original drift speed', () => {
    const I = currentMagnitude(base);
    const vd = driftFromCurrent(I, base.n, base.q, base.A);
    expect(Math.abs(vd - base.v_d) / base.v_d).toBeLessThan(1e-12);
  });

  it('re-product of inverted v_d recovers I', () => {
    const I = 2.5;
    const vd = driftFromCurrent(I, base.n, E, base.A);
    const I2 = currentMagnitude({ n: base.n, q: E, A: base.A, v_d: vd });
    expect(Math.abs(I2 - I) / I).toBeLessThan(1e-12);
  });
});

describe('flux identity ΔQ = I Δt = n q A v_d Δt', () => {
  it('charge from current×time matches charge from factors×time', () => {
    const I = currentFromFactors(base);
    const dt = 3.5;
    const viaI = chargeInInterval(I, dt);
    const viaFactors = chargeFlux(base, dt);
    expect(Math.abs(viaI - viaFactors) / Math.abs(viaI)).toBeLessThan(1e-12);
  });

  it('links Module 1 definition to Module 2 model', () => {
    // I_def = ΔQ/Δt  and  I_model = nqAv_d  agree for this steady model.
    const dt = 2;
    const dQ = chargeFlux(base, dt);
    const I_def = dQ / dt;
    const I_model = currentFromFactors(base);
    expect(Math.abs(I_def - I_model) / Math.abs(I_model)).toBeLessThan(1e-12);
  });
});

describe('copper order-of-magnitude (declared model n)', () => {
  it('household-ish current through 1 mm² gives sub-mm/s drift', () => {
    // I = 1 A, A = 1 mm², n = N_COPPER_MODEL, q = e
    const I = 1;
    const A = mm2_to_m2(1);
    const vd = driftFromCurrent(I, N_COPPER_MODEL, E, A);
    // Rough school expectation: ~10⁻⁴ m/s order (0.1 mm/s scale).
    expect(vd).toBeGreaterThan(1e-5);
    expect(vd).toBeLessThan(1e-3);
  });

  it('larger area at fixed I lowers drift speed', () => {
    const I = 1;
    const thin = driftFromCurrent(I, N_COPPER_MODEL, E, mm2_to_m2(0.5));
    const thick = driftFromCurrent(I, N_COPPER_MODEL, E, mm2_to_m2(2));
    expect(thick).toBeLessThan(thin);
    expect(thin / thick).toBeCloseTo(4, 10);
  });
});
