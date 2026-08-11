/**
 * E2 — what decides how hard two charges push.
 *
 * Declared in src/content/electrostatics/what-decides-the-push/model.yaml.
 * Framework-free by AGENTS.md hard rule 1: no React, no DOM, no equations
 * anywhere in the view layer.
 *
 * The student never measures a force. They measure a SEPARATION, at which the
 * electrostatic push balances the restoring pull of two threads. Everything
 * below is about that equilibrium.
 */

/** Geometry ruled by authority decision — see LESSON_E2_AMENDMENTS §2, §7. */
export const RULED = {
  ballRadiusMm: 10,
  threadLengthMm: 300,
  r0Mm: 200,
} as const;

/** Drawing geometry. Kept here, not in the component, so the figures cannot
 *  drift away from the scale they claim. a/r₀ = 10/200 = 1/20. */
export const DRAWN = {
  susX: 200,
  susY: 22,
  thread: 170,
  r0: 116,
  get ballR() {
    return this.r0 / 20;
  },
} as const;

/**
 * Separation ratio after halving BOTH charges k times, under F ∝ q₁q₂/rⁿ.
 *
 * Small-angle result. At equilibrium F = mg·tan θ and r = 2L·sin θ; for small θ
 * both reduce to r ∝ θ, giving r ∝ q^(2/(n+1)), so halving both charges k times
 * multiplies r by 2^(−2k/(n+1)).
 *
 * The apparatus runs at 19.5°, where this is an approximation. How good is
 * measured by the numerical solver below, not asserted.
 */
export function predicted(n: number, k: number): number {
  return Math.pow(2, (-2 * k) / (n + 1));
}

/** Hanging geometry for the drawn figure: half-angle and ball centres. */
export function ballPositions(rDrawn: number) {
  const half = rDrawn / 2;
  const sin = Math.min(1, half / DRAWN.thread);
  const rad = Math.asin(sin);
  return {
    deg: (rad * 180) / Math.PI,
    leftX: DRAWN.susX - half,
    rightX: DRAWN.susX + half,
    y: DRAWN.susY + DRAWN.thread * Math.cos(rad),
  };
}

/**
 * Equilibrium separation, solved directly rather than from the closed form.
 *
 * This exists so the tests can check `predicted` by a route that never uses it.
 * Balance, with the pair hanging from a common point on threads of length L:
 *
 *     F(r) = mg · tan θ,      r = 2L · sin θ
 *
 * Substituting r for θ gives one equation in θ. Solved by bisection, which
 * shares no algebra with 2^(−2k/(n+1)).
 *
 * `c` absorbs charge and every constant; only ratios are ever compared, so its
 * value is irrelevant provided it is held fixed across a comparison.
 */
export function equilibriumTheta(c: number, n: number, L: number): number {
  // f(θ) = c/(2L sin θ)^n − tan θ. Positive at small θ, negative approaching π/2.
  const f = (t: number) => c / Math.pow(2 * L * Math.sin(t), n) - Math.tan(t);
  let lo = 1e-9;
  let hi = Math.PI / 2 - 1e-9;
  if (f(lo) < 0) return NaN; // no equilibrium: charge too small for this geometry
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Separation at equilibrium, from the numerically solved angle. */
export function equilibriumR(c: number, n: number, L: number): number {
  return 2 * L * Math.sin(equilibriumTheta(c, n, L));
}

/**
 * Ratio r_k/r₀ obtained by solving the balance twice, with no closed form.
 * Halving both charges divides the product q₁q₂ — and therefore c — by 4^k.
 */
export function ratioNumerical(n: number, k: number, c0: number, L: number): number {
  const r0 = equilibriumR(c0, n, L);
  const rk = equilibriumR(c0 / Math.pow(4, k), n, L);
  return rk / r0;
}

/** The three laws the lesson lets a student choose between. */
export const LAWS = [
  { n: 1, label: '1/r', name: 'proportional' },
  { n: 2, label: '1/r²', name: 'inverse square' },
  { n: 3, label: '1/r³', name: 'inverse cube' },
] as const;

/** Which law a measured ratio sits closest to, and whether that is decisive.
 *  Returns null for `decisive` when two laws are within the stated uncertainty —
 *  the honest outcome the lesson is built around. */
export function closestLaw(measured: number, k: number, uncertainty: number) {
  const scored = LAWS.map((l) => ({ ...l, gap: Math.abs(measured - predicted(l.n, k)) }));
  scored.sort((a, b) => a.gap - b.gap);
  const decisive = scored[1].gap - scored[0].gap > uncertainty;
  return { best: scored[0], runnerUp: scored[1], decisive };
}
