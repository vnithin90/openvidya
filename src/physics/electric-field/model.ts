/**
 * Electric field of a set of point charges — IMPLEMENTATION LAYER
 *
 * Physics only. No React, no Astro, no canvas.
 *
 * This concept is structurally different from projectile motion, and that is
 * the point of building both: it is a FIELD over space rather than a
 * trajectory through time. There is no initial condition, no time stepping,
 * and no "solution" in the ODE sense. The model is a rule that assigns a
 * vector to every point of the domain.
 *
 * IMPLEMENTATION ROUTE
 * --------------------
 * Direct pointwise superposition of Coulomb's law:
 *
 *   E(r) = Σ_i  k q_i (r - r_i) / |r - r_i|^3
 *
 * VERIFICATION ROUTE (see tests/electric-field.test.ts)
 * ----------------------------------------------------
 * Gauss's law as a numerical surface integral, a closed line integral, and the
 * relation E = -∇V evaluated from an independently summed scalar potential.
 * None of those recompute the pointwise sum above, so agreement is evidence.
 *
 * See model.yaml for the declared model, assumptions and validity domain.
 */

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface PointCharge {
  /** Charge in coulombs. Sign is meaningful. */
  q: number;
  /** Position in metres. */
  r: Vec3;
  id?: string;
}

/** Coulomb constant, 1/(4 π ε₀), N·m²/C². */
export const K_E = 8.9875517873681764e9;
/** Vacuum permittivity, C²/(N·m²). */
export const EPSILON_0 = 8.8541878128e-12;

export const vec = (x = 0, y = 0, z = 0): Vec3 => ({ x, y, z });
export const add = (a: Vec3, b: Vec3): Vec3 => vec(a.x + b.x, a.y + b.y, a.z + b.z);
export const sub = (a: Vec3, b: Vec3): Vec3 => vec(a.x - b.x, a.y - b.y, a.z - b.z);
export const scale = (a: Vec3, s: number): Vec3 => vec(a.x * s, a.y * s, a.z * s);
export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;
export const norm = (a: Vec3): number => Math.sqrt(dot(a, a));
export const unit = (a: Vec3): Vec3 => {
  const n = norm(a);
  return n === 0 ? vec(0, 0, 0) : scale(a, 1 / n);
};

/**
 * The governing law, stated once.
 *
 * Returns null at a charge location: the point-charge model has a genuine
 * singularity there. Returning a large finite number instead would be a lie
 * the visualization could then draw. The singularity is a real limitation of
 * the model and is declared in model.yaml.
 */
export function electricField(charges: PointCharge[], p: Vec3, softening = 0): Vec3 | null {
  let out = vec(0, 0, 0);
  for (const c of charges) {
    const d = sub(p, c.r);
    const r2 = dot(d, d) + softening * softening;
    if (r2 === 0) return null;
    const r = Math.sqrt(r2);
    out = add(out, scale(d, (K_E * c.q) / (r * r * r)));
  }
  return out;
}

/** Scalar potential, V = Σ k q_i / |r - r_i|. Summed independently of E. */
export function potential(charges: PointCharge[], p: Vec3, softening = 0): number | null {
  let v = 0;
  for (const c of charges) {
    const d = sub(p, c.r);
    const r = Math.sqrt(dot(d, d) + softening * softening);
    if (r === 0) return null;
    v += (K_E * c.q) / r;
  }
  return v;
}

/** Force on a test charge placed in the field. F = qE. */
export function forceOn(charges: PointCharge[], test: PointCharge): Vec3 | null {
  const e = electricField(charges, test.r);
  return e === null ? null : scale(e, test.q);
}

/**
 * Trace one field line by integrating dr/ds = ±Ê with RK4 in arc length.
 * Used by the visualization; also gives the tests something to check
 * (field lines must never cross, and must terminate on charges).
 */
export function traceFieldLine(
  charges: PointCharge[],
  start: Vec3,
  opts: { direction?: 1 | -1; step?: number; maxSteps?: number; stopRadius?: number; bound?: number } = {}
): Vec3[] {
  const dir = opts.direction ?? 1;
  const h = opts.step ?? 0.02;
  const maxSteps = opts.maxSteps ?? 4000;
  const stopRadius = opts.stopRadius ?? 0.05;
  const bound = opts.bound ?? 50;

  const path: Vec3[] = [start];
  let p = start;

  const dirField = (q: Vec3): Vec3 | null => {
    const e = electricField(charges, q);
    if (e === null) return null;
    const n = norm(e);
    if (n === 0 || !Number.isFinite(n)) return null;
    return scale(e, dir / n);
  };

  for (let i = 0; i < maxSteps; i++) {
    const k1 = dirField(p);
    if (!k1) break;
    const k2 = dirField(add(p, scale(k1, h / 2)));
    if (!k2) break;
    const k3 = dirField(add(p, scale(k2, h / 2)));
    if (!k3) break;
    const k4 = dirField(add(p, scale(k3, h)));
    if (!k4) break;

    const inc = scale(
      vec(
        k1.x + 2 * k2.x + 2 * k3.x + k4.x,
        k1.y + 2 * k2.y + 2 * k3.y + k4.y,
        k1.z + 2 * k2.z + 2 * k3.z + k4.z
      ),
      h / 6
    );
    p = add(p, inc);
    path.push(p);

    if (norm(p) > bound) break;
    if (charges.some((c) => norm(sub(p, c.r)) < stopRadius)) break;
  }
  return path;
}

/** Total charge of the configuration. */
export const totalCharge = (charges: PointCharge[]): number =>
  charges.reduce((s, c) => s + c.q, 0);

/** Charge enclosed by a sphere of radius R centred at c. */
export const enclosedCharge = (charges: PointCharge[], centre: Vec3, R: number): number =>
  charges.reduce((s, ch) => (norm(sub(ch.r, centre)) < R ? s + ch.q : s), 0);

/** Electric dipole moment, p = Σ q_i r_i (origin-independent when Σq_i = 0). */
export function dipoleMoment(charges: PointCharge[]): Vec3 {
  return charges.reduce((acc, c) => add(acc, scale(c.r, c.q)), vec(0, 0, 0));
}
