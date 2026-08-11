/**
 * Module 2 — "What determines the current?" — IMPLEMENTATION LAYER
 *
 * Physics only. No React, no Astro, no canvas.
 *
 * MODEL
 * -----
 * Steady single-carrier conduction in a uniform wire:
 *
 *   I = n q A v_d
 *
 * This is a *model* relating the rate of charge flow (Module 1's definition of
 * current) to four microscopic / geometric factors. It is not a second
 * definition of current.
 *
 * IMPLEMENTATION vs VERIFICATION
 * ------------------------------
 * The implementation multiplies the four factors. Tests check proportionality,
 * the inverse formula for v_d, and the flux identity ΔQ = I Δt = n q A v_d Δt
 * by independent arithmetic routes.
 *
 * See model.yaml and docs/specs/module-2-what-determines-current.md.
 */

/** Elementary charge, C. Exact by SI definition (2019). */
export const E = 1.602176634e-19;

/**
 * Typical order-of-magnitude mobile-electron density for copper in the
 * free-electron model. MODEL-DEPENDENT — not measured by this module.
 * ⚠ Cite a textbook/table before publication.
 */
export const N_COPPER_MODEL = 8.5e28; // m⁻³

export interface ConductionFactors {
  /** Mobile carrier number density, m⁻³ */
  n: number;
  /** Charge per carrier, C (usually +e or −e magnitude for electrons as |q|=e) */
  q: number;
  /** Cross-sectional area, m² */
  A: number;
  /** Drift speed, m/s (net advance of the carrier population along the wire) */
  v_d: number;
}

function assertPositive(name: string, x: number): void {
  if (!(x > 0) || !Number.isFinite(x)) {
    throw new Error(`${name} must be a positive finite number (got ${x})`);
  }
}

/**
 * Current from the product model, amperes.
 *
 * q may be negative (electron charge); I uses |q| conventions in some texts.
 * Here we take the physical charge per carrier including sign, and return the
 * *signed* current in the direction of positive-carrier drift. For teaching
 * magnitude, pass q = +E and treat electrons via density of charge carriers.
 */
export function currentFromFactors(f: ConductionFactors): number {
  assertPositive('n', f.n);
  assertPositive('A', f.A);
  assertPositive('v_d', f.v_d);
  if (!Number.isFinite(f.q) || f.q === 0) {
    throw new Error(`q must be a non-zero finite number (got ${f.q})`);
  }
  return f.n * f.q * f.A * f.v_d;
}

/** Magnitude of current when only |q| is of interest (usual school form). */
export function currentMagnitude(f: Omit<ConductionFactors, 'q'> & { q?: number }): number {
  const q = Math.abs(f.q ?? E);
  return Math.abs(currentFromFactors({ ...f, q }));
}

/**
 * Drift speed implied by a measured/assumed current in this model.
 * v_d = I / (n q A)   with q > 0 for the school form.
 */
export function driftFromCurrent(I: number, n: number, q: number, A: number): number {
  if (!(Math.abs(I) > 0) || !Number.isFinite(I)) {
    throw new Error(`I must be a non-zero finite number (got ${I})`);
  }
  assertPositive('n', n);
  assertPositive('A', A);
  const qa = Math.abs(q);
  assertPositive('|q|', qa);
  return Math.abs(I) / (n * qa * A);
}

/** Charge that crosses a section in time Δt if current is steady: ΔQ = I Δt. */
export function chargeInInterval(I: number, deltaT: number): number {
  if (!(deltaT > 0)) throw new Error('deltaT must be positive');
  if (!Number.isFinite(I)) throw new Error('I must be finite');
  return I * deltaT;
}

/**
 * Charge that the product model says crosses in Δt:
 *   ΔQ = n q A v_d Δt
 * Same physics as I Δt when I = n q A v_d — used as a cross-check route.
 */
export function chargeFlux(f: ConductionFactors, deltaT: number): number {
  if (!(deltaT > 0)) throw new Error('deltaT must be positive');
  return f.n * f.q * f.A * f.v_d * deltaT;
}

/** Format helpers for UI (not physics). */
export const mm2_to_m2 = (mm2: number): number => mm2 * 1e-6;
export const m2_to_mm2 = (m2: number): number => m2 * 1e6;
