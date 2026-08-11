/**
 * Module 1 — "What is current?" — IMPLEMENTATION LAYER
 *
 * Physics only. No React, no Astro, no canvas.
 *
 * SCOPE, DELIBERATELY SMALL
 * -------------------------
 * Charge is countable; charge crosses a chosen surface; current is the rate of
 * that crossing. Nothing else. There is no carrier density, no drift velocity,
 * no conductor model and no circuit here, because Module 1 does not teach them
 * and must not imply them.
 *
 * Everything below rests on `E` alone, which is exact by SI definition. The
 * module has no measured inputs; the only empirical values in the page live in
 * the illustrative comparison panel and are declared as ranges.
 *
 * IMPLEMENTATION vs VERIFICATION ROUTE
 * ------------------------------------
 * `countCrossings` advances markers in time steps and detects sign changes
 * across the surface. The test suite compares that against a closed-form
 * integer count derived from the marker spacing — a different route, so
 * agreement carries information.
 *
 * See model.yaml for the declared statements, assumptions and validity.
 */

/**
 * Elementary charge, coulombs. Exact by SI definition (2019).
 *
 * `E` is POSITIVE by definition. It is the size of the charge on a proton, and
 * the size — not the value — of the charge on an electron.
 */
export const E = 1.602176634e-19;

/** Charge on a proton: +e. */
export const PROTON_CHARGE = E;

/**
 * Charge on an electron: −e.
 *
 * Named explicitly because an earlier version of Scene 1 told students the
 * electron "carries e = 1.602…e-19 C", which is wrong by a sign. Charge comes
 * in two kinds and the module cannot claim Q = Ne without saying so.
 */
export const ELECTRON_CHARGE = -E;

// ---------------------------------------------------------------------------
// Counting charge
// ---------------------------------------------------------------------------

/**
 * How many elementary charges make up a charge Q.
 * Signed: a negative Q returns a negative count.
 */
export const countFromCharge = (Q: number): number => Q / E;

/**
 * The charge carried by N elementary charges, signed.
 * `chargeFromCount(-3)` is the charge of three excess electrons.
 */
export const chargeFromCount = (N: number): number => N * E;

/** A mixed collection of charged particles. Both counts are non-negative. */
export interface Population {
  /** number of +e particles (protons, positive ions) */
  positive: number;
  /** number of −e particles (electrons, negative ions) */
  negative: number;
}

function assertPopulation(p: Population): void {
  for (const [k, v] of [['positive', p.positive], ['negative', p.negative]] as const) {
    if (!Number.isFinite(v) || v < 0 || !Number.isInteger(v)) {
      throw new Error(
        `netCharge: ${k} count must be a non-negative whole number of particles (got ${v}). ` +
          `Sign lives in which population a particle belongs to, not in the count.`
      );
    }
  }
}

/**
 * Net count of elementary charges: positive minus negative.
 *
 * This is what "charge is countable" actually means. Not "how many particles
 * are there" — a neutral object is full of charged particles — but "how many
 * more of one kind than the other".
 */
export function netCount(p: Population): number {
  assertPopulation(p);
  return p.positive - p.negative;
}

/** Net charge of a mixed population, Q = (N₊ − N₋) e. Signed. */
export function netCharge(p: Population): number {
  return netCount(p) * E;
}

/** True when the two populations balance exactly. */
export const isNeutral = (p: Population): boolean => netCount(p) === 0;

export interface QuantisationVerdict {
  /** Q expressed in elementary charges. */
  n: number;
  /** Nearest whole number of elementary charges. */
  nearest: number;
  /** Is some integer multiple of E within the measurement uncertainty? */
  consistent: boolean;
  /** Distance to the nearest allowed value, in coulombs. */
  shortfall: number;
}

/**
 * Is a *measured* charge consistent with quantisation?
 *
 * This requires an uncertainty and will throw without one. A percentage
 * deviation cannot answer the question: "0.14% from an integer" says nothing
 * until you know whether the measurement is good to 0.01% or to 1%. That error
 * was present in an earlier draft of the specification and is guarded here so
 * it cannot recur in the UI.
 */
export function consistentWithQuantisation(
  Q: number,
  uncertainty: number
): QuantisationVerdict {
  if (!(uncertainty > 0)) {
    throw new Error(
      'consistentWithQuantisation: a measurement uncertainty is required. ' +
        'Consistency with quantisation cannot be decided from the central value alone.'
    );
  }
  const n = Q / E;
  const nearest = Math.round(n);
  const shortfall = Math.abs(Q - nearest * E);
  return { n, nearest, consistent: shortfall <= uncertainty, shortfall };
}

// ---------------------------------------------------------------------------
// Charge crossing a chosen surface
// ---------------------------------------------------------------------------

/**
 * A uniform stream of charge markers.
 *
 * REPRESENTATION, DECLARED: a marker is not an electron. 10 C is about
 * 6.2e19 elementary charges and cannot be drawn. Each marker stands for
 * `chargePerMarker` coulombs, and the UI must state that number on screen —
 * otherwise the granularity of Scene 1 silently becomes a lie in Scene 2.
 */
export interface Stream {
  /** Distance between successive markers, metres. */
  spacing: number;
  /** Marker speed, m/s. Not exposed to the student in Module 1. */
  speed: number;
  /** Charge represented by one marker, coulombs. */
  chargePerMarker: number;
  /** Position of marker index 0 at t = 0, metres. */
  offset?: number;
}

/** Position of marker k at time t. */
export const markerPosition = (s: Stream, k: number, t: number): number =>
  k * s.spacing + (s.offset ?? 0) + s.speed * t;

/**
 * Count markers crossing `surfaceX` during [t0, t1], by stepping in time and
 * detecting sign changes. This is the *simulation* route.
 */
export function countCrossings(
  s: Stream,
  surfaceX: number,
  t0: number,
  t1: number,
  dt = 1e-4
): number {
  if (!(s.speed > 0)) throw new Error('countCrossings: stream speed must be positive');
  if (!(s.spacing > 0)) throw new Error('countCrossings: spacing must be positive');
  if (t1 <= t0) throw new Error('countCrossings: window must have positive duration');

  // Which markers can cross during the window?
  //
  //   marker k is at  k*d + off + v*t,  so it meets the surface when
  //   k*d = surfaceX - off - v*t   for some t in [t0, t1].
  //
  // Bug found by the closed-form cross-check on the first run: an earlier
  // version derived these bounds from the window LENGTH (t1 - t0) rather than
  // from t0 and t1 themselves. That is correct only when t0 = 0, and silently
  // undercounted for any window not starting at zero. The stepping loop was
  // fine; the search range was not.
  const off = s.offset ?? 0;
  const kLo = Math.floor((surfaceX - off - s.speed * t1) / s.spacing) - 1;
  const kHi = Math.ceil((surfaceX - off - s.speed * t0) / s.spacing) + 1;

  let count = 0;
  for (let k = kLo; k <= kHi; k++) {
    let prev = markerPosition(s, k, t0) - surfaceX;
    for (let t = t0 + dt; t <= t1 + dt / 2; t += dt) {
      const cur = markerPosition(s, k, t) - surfaceX;
      if (prev < 0 && cur >= 0) {
        count++;
        break;
      }
      prev = cur;
    }
  }
  return count;
}

/** Charge that crossed the surface during the window. */
export const chargeCrossed = (
  s: Stream,
  surfaceX: number,
  t0: number,
  t1: number,
  dt?: number
): number => countCrossings(s, surfaceX, t0, t1, dt) * s.chargePerMarker;

// ---------------------------------------------------------------------------
// Rate
// ---------------------------------------------------------------------------

/**
 * The definition. This is the whole module.
 *
 * Stated as a definition, not a law: nothing is solved, integrated or derived.
 */
export function rate(deltaQ: number, deltaT: number): number {
  if (!(deltaT > 0)) {
    throw new Error(
      'rate: a positive time interval is required. Charge alone does not ' +
        'determine a rate — which is the point of this module.'
    );
  }
  return deltaQ / deltaT;
}

/**
 * Marker count needed to represent a target charge.
 * The visual is generated FROM the chosen charge, never set independently of
 * it, so the picture and the number cannot disagree.
 */
export const markersForCharge = (Q: number, chargePerMarker: number): number =>
  Math.round(Q / chargePerMarker);

// ---------------------------------------------------------------------------
// Interval arithmetic for the illustrative comparison panel
// ---------------------------------------------------------------------------

export type Interval = readonly [number, number];

export const mAhToCoulomb = (mAh: number): number => (mAh / 1000) * 3600;

/** Ratio of two positive intervals. */
export function ratioRange(a: Interval, b: Interval): Interval {
  const [aLo, aHi] = a;
  const [bLo, bHi] = b;
  if (aLo <= 0 || bLo <= 0) {
    throw new Error('ratioRange: both intervals must be strictly positive');
  }
  return [aLo / bHi, aHi / bLo];
}
