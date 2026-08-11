/**
 * Module 2 · Scene 1 — Four factors (aggregate representation)
 *
 * No particle swarm. Density bar, section width, labelled drift — product I.
 */

import { useMemo, useState } from 'react';
import { E, currentMagnitude, mm2_to_m2 } from '../../physics/current-factors/model';

const fmtI = (I: number) => {
  if (I >= 1) return `${I.toFixed(2)} A`;
  if (I >= 1e-3) return `${(I * 1e3).toFixed(2)} mA`;
  return `${I.toExponential(2)} A`;
};

const fmtN = (n: number) => `${(n / 1e28).toFixed(2)}×10²⁸ m⁻³`;
const fmtVd = (v: number) => {
  if (v >= 1e-3) return `${(v * 1e3).toFixed(2)} mm/s`;
  return `${(v * 1e6).toFixed(1)} µm/s`;
};

export default function M2Factors() {
  // Pedagogical ranges (not measured lab values).
  const [n28, setN28] = useState(1.0); // ×10^28 m⁻³
  const [Amm2, setAmm2] = useState(1.0); // mm²
  const [vdUms, setVdUms] = useState(100); // µm/s

  const n = n28 * 1e28;
  const A = mm2_to_m2(Amm2);
  const v_d = vdUms * 1e-6;
  const q = E;

  const I = useMemo(
    () => currentMagnitude({ n, q, A, v_d }),
    [n, A, v_d]
  );

  // Visual scales (representation only).
  const densPct = Math.min(100, (n28 / 3) * 100);
  const widthPct = Math.min(100, (Amm2 / 4) * 100);
  const driftPct = Math.min(100, (vdUms / 400) * 100);

  return (
    <div className="sim">
      <p className="scene-label">Scene 1 · Four factors make the current</p>
      <p className="s3-task">
        <b>Your job:</b> change <b>one</b> slider at a time. Watch the current. Each factor
        multiplies into <b>I = n q A v_d</b>. Speed is only one of the four.
      </p>

      <div className="m2-product">
        <div className="m2-I">
          <span className="k">current I</span>
          <span className="v">{fmtI(I)}</span>
        </div>
        <p className="m2-eq">
          I = n × q × A × v_d
          <br />
          <span className="muted">
            q fixed at e = {E.toExponential(4)} C (elementary charge)
          </span>
        </p>
      </div>

      <div className="m2-factors">
        <div className="m2-factor">
          <div className="m2-factor-head">
            <b>n</b> · how many carriers per volume
            <output>{fmtN(n)}</output>
          </div>
          <div className="m2-vis-bar" aria-hidden>
            <div className="m2-vis-fill dens" style={{ width: `${densPct}%` }} />
          </div>
          <input
            type="range"
            min={0.2}
            max={3}
            step={0.05}
            value={n28}
            onChange={(e) => setN28(+e.target.value)}
          />
          <p className="m2-tip">Denser carriers → more charge can cross per second.</p>
        </div>

        <div className="m2-factor">
          <div className="m2-factor-head">
            <b>A</b> · cross-section of the wire
            <output>{Amm2.toFixed(2)} mm²</output>
          </div>
          <div className="m2-wire-wrap" aria-hidden>
            <div className="m2-wire" style={{ width: `${20 + widthPct * 0.7}%` }} />
          </div>
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.05}
            value={Amm2}
            onChange={(e) => setAmm2(+e.target.value)}
          />
          <p className="m2-tip">Thicker wire (larger area) → more room for the same flow pattern.</p>
        </div>

        <div className="m2-factor">
          <div className="m2-factor-head">
            <b>v_d</b> · net drift speed
            <output>{fmtVd(v_d)}</output>
          </div>
          <div className="m2-drift" aria-hidden>
            <div className="m2-drift-track">
              <div className="m2-drift-arrow" style={{ left: `calc(${driftPct * 0.75}% - 8px)` }}>
                →
              </div>
            </div>
            <span className="muted">net drift of the population (not thermal speed)</span>
          </div>
          <input
            type="range"
            min={10}
            max={400}
            step={5}
            value={vdUms}
            onChange={(e) => setVdUms(+e.target.value)}
          />
          <p className="m2-tip">Faster net drift → more charge past a section each second.</p>
        </div>
      </div>

      <div className="m2-check">
        <b>Try this:</b> double n (roughly). Does I roughly double? Reset, double A only.
        Same idea. Drift is not special — it is one multiplier among four.
      </div>

      <p className="sim-note">
        These pictures are <b>aggregate</b>: density bar, wire width, drift marker. They are
        not a movie of individual electrons. The classical “glide” picture is incomplete —
        Module 3 repairs that.
      </p>
    </div>
  );
}
