/**
 * Projectile motion — IMPLEMENTATION LAYER
 *
 * This file contains physics only. It imports nothing from React, Astro, or
 * any rendering layer, and it must stay that way.
 *
 * DELIBERATE DESIGN CHOICE
 * ------------------------
 * This module solves the equations of motion by NUMERICAL INTEGRATION (RK4).
 * It does NOT use the closed-form solution x(t) = v0 cos(theta) t, etc.
 *
 * Why: the test suite verifies this module against the closed-form analytical
 * results. If the implementation were itself the closed form, that test would
 * be checking trigonometric identities in JavaScript rather than checking
 * physics. Integrating numerically and comparing to the analytical solution
 * means the two routes are independent, so the comparison carries information.
 *
 * See model.yaml for the declared model, assumptions and validity domain.
 */

export interface Vec2 {
  x: number;
  y: number;
}

export interface ProjectileParams {
  /** Initial speed, m/s */
  v0: number;
  /** Launch angle above horizontal, degrees */
  thetaDeg: number;
  /** Gravitational field strength, m/s^2 (positive number; acts downward) */
  g: number;
  /** Launch height above the ground plane, m */
  y0?: number;
}

export interface State {
  t: number;
  r: Vec2;
  v: Vec2;
}

export const DEG = Math.PI / 180;

/**
 * The physical model, stated once as a derivative function.
 *
 *   dr/dt = v
 *   dv/dt = (0, -g)
 *
 * Everything else in this file is numerics applied to THIS.
 */
function derivative(s: State, g: number): { dr: Vec2; dv: Vec2 } {
  return {
    dr: { x: s.v.x, y: s.v.y },
    dv: { x: 0, y: -g },
  };
}

export function initialState(p: ProjectileParams): State {
  const th = p.thetaDeg * DEG;
  return {
    t: 0,
    r: { x: 0, y: p.y0 ?? 0 },
    v: { x: p.v0 * Math.cos(th), y: p.v0 * Math.sin(th) },
  };
}

/** One classical fourth-order Runge-Kutta step. */
export function rk4Step(s: State, dt: number, g: number): State {
  const k1 = derivative(s, g);

  const s2: State = {
    t: s.t + dt / 2,
    r: { x: s.r.x + (dt / 2) * k1.dr.x, y: s.r.y + (dt / 2) * k1.dr.y },
    v: { x: s.v.x + (dt / 2) * k1.dv.x, y: s.v.y + (dt / 2) * k1.dv.y },
  };
  const k2 = derivative(s2, g);

  const s3: State = {
    t: s.t + dt / 2,
    r: { x: s.r.x + (dt / 2) * k2.dr.x, y: s.r.y + (dt / 2) * k2.dr.y },
    v: { x: s.v.x + (dt / 2) * k2.dv.x, y: s.v.y + (dt / 2) * k2.dv.y },
  };
  const k3 = derivative(s3, g);

  const s4: State = {
    t: s.t + dt,
    r: { x: s.r.x + dt * k3.dr.x, y: s.r.y + dt * k3.dr.y },
    v: { x: s.v.x + dt * k3.dv.x, y: s.v.y + dt * k3.dv.y },
  };
  const k4 = derivative(s4, g);

  return {
    t: s.t + dt,
    r: {
      x: s.r.x + (dt / 6) * (k1.dr.x + 2 * k2.dr.x + 2 * k3.dr.x + k4.dr.x),
      y: s.r.y + (dt / 6) * (k1.dr.y + 2 * k2.dr.y + 2 * k3.dr.y + k4.dr.y),
    },
    v: {
      x: s.v.x + (dt / 6) * (k1.dv.x + 2 * k2.dv.x + 2 * k3.dv.x + k4.dv.x),
      y: s.v.y + (dt / 6) * (k1.dv.y + 2 * k2.dv.y + 2 * k3.dv.y + k4.dv.y),
    },
  };
}

export interface Trajectory {
  states: State[];
  /** Horizontal distance travelled when the particle returns to y = 0. */
  range: number;
  /** Maximum height reached above y = 0. */
  maxHeight: number;
  /** Time of flight until the particle reaches y = 0. */
  timeOfFlight: number;
}

/**
 * Integrate until the particle crosses the ground plane (y = 0), refining the
 * crossing by bisection so the landing point is not limited by the step size.
 */
export function simulate(p: ProjectileParams, dt = 1e-3, maxSteps = 400_000): Trajectory {
  if (!(p.g > 0)) {
    throw new Error(
      `simulate: g must be a positive magnitude (got ${p.g}). ` +
        `The downward direction is applied inside the model, not by the sign of g.`
    );
  }

  let s = initialState(p);
  const states: State[] = [s];

  // A launch angle of exactly 0 from the ground never leaves the ground.
  if (s.v.y <= 0 && s.r.y <= 0) {
    return { states, range: 0, maxHeight: 0, timeOfFlight: 0 };
  }

  let steps = 0;
  let prev = s;
  let landed = false;
  while (steps < maxSteps) {
    prev = s;
    s = rk4Step(s, dt, p.g);
    steps++;
    if (s.r.y < 0) {
      landed = true;
      break;
    }
    states.push(s);
  }

  // Fail loudly rather than returning a meaningless "range".
  //
  // Found by mutation testing: flipping the sign of the acceleration made the
  // particle rise forever, and the old code silently accumulated millions of
  // states until the process ran out of memory. An OOM is not a test failure —
  // it destroys the run and reports nothing useful. A bounded model that
  // cannot terminate is a broken model and must say so.
  if (!landed) {
    throw new Error(
      `simulate: the particle did not return to y = 0 within ${maxSteps} steps ` +
        `(t = ${(maxSteps * dt).toFixed(1)} s). Under the declared model a projectile ` +
        `launched from the ground always returns to it, so this indicates the ` +
        `equations of motion are wrong — most likely the sign of the acceleration.`
    );
  }

  // Bisect on the sub-interval [0, dt] from `prev` to locate y = 0.
  let lo = 0;
  let hi = dt;
  let landing = s;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    const test = rk4Step(prev, mid, p.g);
    if (test.r.y > 0) {
      lo = mid;
    } else {
      hi = mid;
      landing = test;
    }
    if (hi - lo < 1e-15) break;
  }
  states.push(landing);

  const maxHeight = states.reduce((m, st) => Math.max(m, st.r.y), 0);

  return {
    states,
    range: landing.r.x,
    maxHeight,
    timeOfFlight: landing.t,
  };
}

/** Specific mechanical energy, J/kg. Used as a conserved-quantity check. */
export function specificEnergy(s: State, g: number): number {
  return 0.5 * (s.v.x * s.v.x + s.v.y * s.v.y) + g * s.r.y;
}
