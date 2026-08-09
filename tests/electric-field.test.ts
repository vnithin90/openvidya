/**
 * INDEPENDENT VERIFICATION — Electric field of point charges
 *
 * The implementation computes E by pointwise superposition of Coulomb terms.
 * These tests do NOT recompute that sum and compare it to itself. They check
 * CONSEQUENCES of the model that the implementation never evaluates:
 *
 *   - Gauss's law as a numerical surface integral   (integral form)
 *   - ∮E·dl = 0 as a numerical line integral        (conservative field)
 *   - E = -∇V by finite differences on the potential (separate summation)
 *   - far-field power laws                           (asymptotics)
 *
 * If the Coulomb sum had the wrong exponent, the wrong constant, or a sign
 * error, the flux integral would not land on Q/ε₀ and these tests would fail.
 */

import { describe, it, expect } from 'vitest';
import {
  electricField,
  potential,
  dipoleMoment,
  enclosedCharge,
  vec,
  add,
  sub,
  scale,
  dot,
  norm,
  unit,
  EPSILON_0,
  type PointCharge,
  type Vec3,
} from '../src/physics/electric-field/model';

const E = (charges: PointCharge[], p: Vec3): Vec3 => {
  const e = electricField(charges, p);
  if (e === null) throw new Error('field evaluated at a singularity');
  return e;
};

/**
 * Numerical closed-surface flux over a sphere, using an equal-area product
 * rule: u = cosθ uniform in [-1,1], φ uniform in [0,2π), midpoint in both.
 * Each cell carries equal area 4πR²/(Nu·Nphi).
 */
function sphereFlux(charges: PointCharge[], centre: Vec3, R: number, Nu = 400, Nphi = 800): number {
  const dA = (4 * Math.PI * R * R) / (Nu * Nphi);
  let flux = 0;
  for (let i = 0; i < Nu; i++) {
    const u = -1 + (2 * (i + 0.5)) / Nu;
    const s = Math.sqrt(Math.max(0, 1 - u * u));
    for (let j = 0; j < Nphi; j++) {
      const phi = (2 * Math.PI * (j + 0.5)) / Nphi;
      const n = vec(s * Math.cos(phi), s * Math.sin(phi), u); // outward unit normal
      const p = add(centre, scale(n, R));
      flux += dot(E(charges, p), n) * dA;
    }
  }
  return flux;
}

/** Numerical line integral of E along a closed polygon (midpoint rule). */
function loopIntegral(charges: PointCharge[], corners: Vec3[], perSide = 2000): number {
  let total = 0;
  for (let i = 0; i < corners.length; i++) {
    const a = corners[i];
    const b = corners[(i + 1) % corners.length];
    const seg = sub(b, a);
    const dl = scale(seg, 1 / perSide);
    for (let k = 0; k < perSide; k++) {
      const mid = add(a, scale(seg, (k + 0.5) / perSide));
      total += dot(E(charges, mid), dl);
    }
  }
  return total;
}

// --- configurations ---------------------------------------------------------
const nC = 1e-9;
const single: PointCharge[] = [{ q: 2 * nC, r: vec(0, 0, 0) }];
const dipole: PointCharge[] = [
  { q: 2 * nC, r: vec(-0.3, 0, 0) },
  { q: -2 * nC, r: vec(0.3, 0, 0) },
];
const likePair: PointCharge[] = [
  { q: 2 * nC, r: vec(-0.3, 0, 0) },
  { q: 2 * nC, r: vec(0.3, 0, 0) },
];

describe("Gauss's law (surface-integral route, independent of the Coulomb sum)", () => {
  it('flux through a sphere around one centred charge equals Q/ε₀', () => {
    const flux = sphereFlux(single, vec(0, 0, 0), 1.0, 200, 400);
    const expected = (2 * nC) / EPSILON_0;
    expect(Math.abs(flux - expected) / Math.abs(expected)).toBeLessThan(1e-9);
  });

  it('flux is independent of the radius of the enclosing sphere', () => {
    const expected = (2 * nC) / EPSILON_0;
    for (const R of [0.5, 1.0, 4.0]) {
      const flux = sphereFlux(single, vec(0, 0, 0), R, 200, 400);
      expect(Math.abs(flux - expected) / Math.abs(expected)).toBeLessThan(1e-9);
    }
  });

  it('flux around an OFF-CENTRE enclosed charge still equals Q/ε₀', () => {
    // This is the sharp version: the integrand is no longer uniform, so the
    // result depends on the whole angular structure of the field, not just
    // its magnitude at one radius.
    const off: PointCharge[] = [{ q: 3 * nC, r: vec(0.25, -0.1, 0.05) }];
    const flux = sphereFlux(off, vec(0, 0, 0), 1.0);
    const expected = (3 * nC) / EPSILON_0;
    expect(Math.abs(flux - expected) / Math.abs(expected)).toBeLessThan(5e-3);
  });

  it('flux through a surface enclosing no charge vanishes', () => {
    const flux = sphereFlux(single, vec(5, 0, 0), 1.0);
    const scaleOf = (2 * nC) / EPSILON_0;
    expect(Math.abs(flux) / scaleOf).toBeLessThan(1e-6);
  });

  it('flux through a sphere enclosing a dipole vanishes (net charge zero)', () => {
    const flux = sphereFlux(dipole, vec(0, 0, 0), 2.0);
    const scaleOf = (2 * nC) / EPSILON_0;
    expect(Math.abs(flux) / scaleOf).toBeLessThan(1e-6);
    expect(enclosedCharge(dipole, vec(0, 0, 0), 2.0)).toBeCloseTo(0, 20);
  });

  it('flux enclosing only one charge of a dipole equals that charge / ε₀', () => {
    const flux = sphereFlux(dipole, vec(-0.3, 0, 0), 0.2);
    const expected = (2 * nC) / EPSILON_0;
    expect(Math.abs(flux - expected) / Math.abs(expected)).toBeLessThan(5e-3);
  });
});

describe('conservative field (line-integral route)', () => {
  it('the closed loop integral of E vanishes', () => {
    const square = [vec(1, 1, 0), vec(2, 1, 0), vec(2, 2, 0), vec(1, 2, 0)];
    const circulation = loopIntegral(dipole, square);
    const scaleOf = norm(E(dipole, vec(1.5, 1.5, 0))) * 4;
    expect(Math.abs(circulation) / scaleOf).toBeLessThan(1e-4);
  });

  it('the line integral from A to B equals V(A) - V(B)', () => {
    const a = vec(1, 0.5, 0);
    const b = vec(2.5, 1.5, 0);
    const N = 20000;
    const seg = sub(b, a);
    const dl = scale(seg, 1 / N);
    let work = 0;
    for (let k = 0; k < N; k++) {
      work += dot(E(dipole, add(a, scale(seg, (k + 0.5) / N))), dl);
    }
    const dV = potential(dipole, a)! - potential(dipole, b)!;
    expect(Math.abs(work - dV) / Math.abs(dV)).toBeLessThan(1e-6);
  });
});

describe('E = -∇V (potential summed independently of the field)', () => {
  const gradV = (charges: PointCharge[], p: Vec3, h = 1e-6): Vec3 => {
    const d = (ax: 'x' | 'y' | 'z') => {
      const pp = { ...p, [ax]: p[ax] + h } as Vec3;
      const pm = { ...p, [ax]: p[ax] - h } as Vec3;
      return (potential(charges, pp)! - potential(charges, pm)!) / (2 * h);
    };
    return vec(d('x'), d('y'), d('z'));
  };

  for (const [name, cfg] of Object.entries({ single, dipole, likePair })) {
    it(`-∇V reproduces E for the ${name} configuration`, () => {
      for (const p of [vec(0.7, 0.4, 0.2), vec(-1.1, 0.9, -0.3), vec(2.0, -1.5, 0.8)]) {
        const field = E(cfg, p);
        const minusGrad = scale(gradV(cfg, p), -1);
        const err = norm(sub(field, minusGrad)) / norm(field);
        expect(err).toBeLessThan(1e-5);
      }
    });
  }
});

describe('far-field asymptotics', () => {
  const slope = (charges: PointCharge[], r1: number, r2: number, dir: Vec3): number => {
    const e1 = norm(E(charges, scale(unit(dir), r1)));
    const e2 = norm(E(charges, scale(unit(dir), r2)));
    return Math.log(e2 / e1) / Math.log(r2 / r1);
  };

  it('a net-charged configuration falls off as r^-2', () => {
    expect(slope(likePair, 500, 1000, vec(0, 1, 0))).toBeCloseTo(-2, 3);
  });

  it('a neutral dipole falls off as r^-3', () => {
    expect(slope(dipole, 500, 1000, vec(0, 1, 0))).toBeCloseTo(-3, 2);
  });

  it('dipole moment is non-zero and points from - to +', () => {
    const p = dipoleMoment(dipole);
    expect(norm(p)).toBeGreaterThan(0);
    expect(p.x).toBeLessThan(0); // +q sits at negative x
  });
});

describe('symmetry and linearity', () => {
  it('E vanishes at the midpoint of two equal like charges', () => {
    const e = E(likePair, vec(0, 0, 0));
    const scaleOf = norm(E(likePair, vec(0, 0.1, 0)));
    expect(norm(e) / scaleOf).toBeLessThan(1e-12);
  });

  it('E is antisymmetric under reflection for a dipole on the axis', () => {
    const a = E(dipole, vec(0, 0.4, 0));
    const b = E(dipole, vec(0, -0.4, 0));
    expect(Math.abs(a.x - b.x) / Math.abs(a.x)).toBeLessThan(1e-12);
    expect(Math.abs(a.y + b.y)).toBeLessThan(1e-12 * norm(a) + 1e-30);
  });

  it('superposition: E(A ∪ B) = E(A) + E(B)', () => {
    const A: PointCharge[] = [{ q: 2 * nC, r: vec(-0.3, 0, 0) }];
    const B: PointCharge[] = [{ q: -2 * nC, r: vec(0.3, 0, 0) }];
    const p = vec(0.9, 0.6, -0.2);
    const combined = E([...A, ...B], p);
    const summed = add(E(A, p), E(B, p));
    expect(norm(sub(combined, summed)) / norm(combined)).toBeLessThan(1e-12);
  });

  it('scaling every charge by λ scales E by λ', () => {
    const p = vec(0.8, 0.3, 0.1);
    const lambda = -2.5;
    const scaled = dipole.map((c) => ({ ...c, q: c.q * lambda }));
    const a = scale(E(dipole, p), lambda);
    const b = E(scaled, p);
    expect(norm(sub(a, b)) / norm(a)).toBeLessThan(1e-12);
  });
});

describe('declared model limitations are honoured, not papered over', () => {
  it('the field is undefined exactly at a charge, and says so', () => {
    expect(electricField(single, vec(0, 0, 0))).toBeNull();
    expect(potential(single, vec(0, 0, 0))).toBeNull();
  });

  it('magnitude grows without bound approaching a charge (model diverges)', () => {
    const near = norm(E(single, vec(1e-4, 0, 0)));
    const nearer = norm(E(single, vec(1e-5, 0, 0)));
    expect(nearer).toBeGreaterThan(near * 50);
  });
});
