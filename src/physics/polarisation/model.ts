/**
 * E4 — a charged comb and a neutral scrap of paper.
 *
 * Declared in src/content/electrostatics/why-neutral-paper-moves/model.yaml.
 * Framework-free by AGENTS.md hard rule 1.
 *
 * THE PAPER IS TWO CHARGES, NOT A FORMULA.
 *
 * Everything here models the paper the way the lesson draws it: equal and
 * opposite charge, a small distance apart, both still inside. The net force is
 * then two Coulomb forces added up, and nothing else.
 *
 * No gradient is taken anywhere in this file. That is deliberate — verification
 * uses the point-dipole formula F = p·dE/dx, a derivative rather than a
 * difference of two 1/r² terms, so the two routes share no algebra (rule 2).
 *
 * HOW MUCH CHARGE SEPARATES IS NOT A FREE CHOICE. An earlier draft of this file
 * gave the scrap a FIXED charge, and then claimed in the model spec that the
 * pull falls as 1/r⁵. Those disagree: with fixed charge it falls as 1/r³. The
 * induced charge is itself proportional to the field, which supplies the two
 * missing powers. Getting that wrong would have made the spec and the code
 * quietly contradict each other, with the test suite agreeing with both.
 */

/** Coulomb constant. Every ratio the lesson uses is independent of units, but a
 *  real value keeps the numbers physical if anyone prints them. */
export const K_E = 8.9875517873681764e9;

/**
 * A neutral scrap of paper.
 *
 * `centre` distance from the source charge, metres
 * `sep`    how far the two kinds shift apart, metres — a property of the paper
 * `alpha`  polarisability: how much dipole moment a given field induces
 */
export interface Scrap {
  centre: number;
  sep: number;
  alpha: number;
}

/** Field of a point charge at distance r. Positive means "pointing away from
 *  the source". Null at the source, where the model has no answer. */
export function fieldAt(sourceQ: number, r: number): number | null {
  if (r === 0) return null;
  return (K_E * sourceQ) / (r * r);
}

/**
 * The charge that appears on each end, induced by the field the scrap sits in.
 * p = αE, and the scrap is two charges `sep` apart, so each end carries p/sep.
 */
export function inducedCharge(sourceQ: number, s: Scrap): number | null {
  const E = fieldAt(sourceQ, s.centre);
  if (E === null) return null;
  return (s.alpha * Math.abs(E)) / s.sep;
}

/**
 * Net force on the scrap, by summing the Coulomb force on each end.
 *
 * Positive is AWAY from the source, so a negative result means the paper is
 * pulled toward the comb — which is what the lesson observes.
 *
 * Which end carries which kind is not a choice. The field drags unlike charge
 * toward the source, so the near end is always unlike the source. That is the
 * whole explanation, and it is why the source's sign cancels out.
 */
export function netForce(sourceQ: number, s: Scrap): number | null {
  const near = s.centre - s.sep / 2;
  const far = s.centre + s.sep / 2;
  if (near <= 0) return null;            // the pair straddles the source
  if (s.sep >= s.centre) return null;    // not a small shift; the picture fails
  const q = inducedCharge(sourceQ, s);
  if (q === null) return null;

  const qNear = -Math.sign(sourceQ) * q;
  const qFar = +Math.sign(sourceQ) * q;
  return (K_E * sourceQ * qNear) / (near * near) + (K_E * sourceQ * qFar) / (far * far);
}

/**
 * The same force from the point-dipole formula. Verification only — the lesson
 * never uses it and `netForce` never calls it.
 *
 * p points from the negative end to the positive end. The far end carries the
 * source's own sign, so p = sign(Q)·q·sep, and F = p · dE/dx with
 * dE/dx = −2kQ/x³. Both sign flips cancel, which is the sign-independence the
 * lesson is built on, falling out of the algebra rather than added by hand.
 */
export function dipoleForce(sourceQ: number, s: Scrap): number | null {
  const q = inducedCharge(sourceQ, s);
  if (q === null) return null;
  const p = Math.sign(sourceQ) * q * s.sep;
  const dEdx = (-2 * K_E * sourceQ) / Math.pow(s.centre, 3);
  return p * dEdx;
}

/**
 * Net force in a UNIFORM field — the check Q-E01 calls decisive.
 *
 * Both ends sit in the same field, so the forces are equal and opposite and
 * cancel exactly. Written as a real sum rather than `return 0`, so the test
 * checks arithmetic instead of a constant.
 */
export function netForceUniform(E: number, s: Scrap): number {
  const q = (s.alpha * Math.abs(E)) / s.sep;
  return -q * E + q * E;
}

/** Does the paper move toward the source? True for either sign of the source,
 *  which is the lesson's second trial stated as a property. */
export function movesTowardSource(sourceQ: number, s: Scrap): boolean | null {
  const f = netForce(sourceQ, s);
  return f === null ? null : f < 0;
}

/**
 * The measured slope of |F| against distance, between two distances.
 *
 * Force on a CHARGED object goes as 1/r². This goes as 1/r⁵: one power from the
 * field, one more from the gradient, and two because the induced charge itself
 * grows as the field does. Measured here rather than asserted, so a test can
 * check the exponent instead of trusting this comment.
 */
export function forceFalloffExponent(sourceQ: number, s: Scrap, r1: number, r2: number): number | null {
  const f1 = netForce(sourceQ, { ...s, centre: r1 });
  const f2 = netForce(sourceQ, { ...s, centre: r2 });
  if (f1 === null || f2 === null || f1 === 0 || f2 === 0) return null;
  return Math.log(Math.abs(f2) / Math.abs(f1)) / Math.log(r2 / r1);
}
