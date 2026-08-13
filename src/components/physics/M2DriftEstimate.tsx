/**
 * Module 2 · Scene 3 — How small is drift speed?
 *
 * v_d = I / (n q A) with declared model n for copper.
 */

import { useMemo, useState } from 'react';
import {
  E,
  N_COPPER_MODEL,
  driftFromCurrent,
  currentMagnitude,
  mm2_to_m2,
} from '../../physics/current-factors/model';

const fmtVd = (v: number) => {
  if (v >= 1e-3) return `${(v * 1e3).toFixed(3)} mm/s`;
  if (v >= 1e-6) return `${(v * 1e6).toFixed(2)} µm/s`;
  return `${v.toExponential(2)} m/s`;
};

export default function M2DriftEstimate() {
  const [I, setI] = useState(1.0); // A
  const [Amm2, setAmm2] = useState(1.0); // mm²
  const [n28, setN28] = useState(N_COPPER_MODEL / 1e28);

  const n = n28 * 1e28;
  const A = mm2_to_m2(Amm2);

  const v_d = useMemo(() => driftFromCurrent(I, n, E, A), [I, n, A]);

  // Sanity: product recovers I
  const Icheck = useMemo(
    () => currentMagnitude({ n, q: E, A, v_d }),
    [n, A, v_d]
  );

  const snail = v_d < 1e-3; // slower than 1 mm/s

  return (
    <div className="sim">
      <p className="scene-label">Scene 3 · How small is drift speed?</p>
      <p className="s3-task">
        <b>Your job:</b> pick a current and a wire thickness. The page computes the drift
        speed this model needs. Watch how <b>small</b> v_d usually is — even when I is not.
      </p>

      <div className="sim-controls">
        <label>
          current I <output>{I.toFixed(2)} A</output>
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.1}
            value={I}
            onChange={(e) => setI(+e.target.value)}
          />
        </label>
        <label>
          area A <output>{Amm2.toFixed(2)} mm²</output>
          <input
            type="range"
            min={0.2}
            max={5}
            step={0.05}
            value={Amm2}
            onChange={(e) => setAmm2(+e.target.value)}
          />
        </label>
        <label>
          model n / 10²⁸ m⁻³ <output>{n28.toFixed(2)}</output>
          <input
            type="range"
            min={2}
            max={12}
            step={0.1}
            value={n28}
            onChange={(e) => setN28(+e.target.value)}
          />
        </label>
      </div>

      <div className="m2-estimate">
        <div className="m2-eq-block">
          v_d = I / (n q A)
          <div className="m2-eq-result">{fmtVd(v_d)}</div>
        </div>
        <p className="muted">
          Check: n q A v_d → <b>{Icheck.toFixed(3)} A</b> (should match I = {I.toFixed(2)} A)
        </p>
        {snail && (
          <p className="m2-check ok">
            For these values the net drift is slower than 1 mm each second. The current can still be amperes because n and A are huge in SI terms. That means many carriers in a thick enough section.
          </p>
        )}
      </div>

      <div className="m2-warn">
        <b>n is an input to the model</b>, not something this lesson measures. The default
        (~{N_COPPER_MODEL.toExponential(1)} m⁻³) is a free-electron order-of-magnitude for
        copper. ⚠ Cite a table before publication. Changing n changes v_d for the same I and
        A — that is honesty about the model, not a lab result.
      </div>

      <p className="sim-note">
        Link to Module 1: current still means charge per time. Here that rate is supplied by
        the product n q A v_d. Large I does not require large v_d if n A is large.
      </p>
    </div>
  );
}
