/**
 * Module 2 · Scene 2 — Same current, different mixes
 *
 * Two wires can share I with different (n, A, v_d). Counters B2a.
 */

import { useMemo, useState } from 'react';
import { E, currentMagnitude, mm2_to_m2 } from '../../physics/current-factors/model';

const TARGET = 0.5; // A — pedagogical target

const fmtI = (I: number) => `${I.toFixed(3)} A`;
const fmtVd = (v: number) => `${(v * 1e3).toFixed(2)} mm/s`;

interface WireControls {
  n28: number;
  Amm2: number;
  vdUms: number;
}

function wireI(w: WireControls): number {
  return currentMagnitude({
    n: w.n28 * 1e28,
    q: E,
    A: mm2_to_m2(w.Amm2),
    v_d: w.vdUms * 1e-6,
  });
}

function WirePanel({
  title,
  color,
  w,
  setW,
}: {
  title: string;
  color: string;
  w: WireControls;
  setW: (w: WireControls) => void;
}) {
  const I = wireI(w);
  const close = Math.abs(I - TARGET) / TARGET < 0.05;

  return (
    <div className="m2-wire-card" style={{ borderColor: color }}>
      <h4 style={{ color }}>{title}</h4>
      <div className={`m2-I-sm ${close ? 'ok' : ''}`}>
        <span className="k">I</span>
        <span className="v">{fmtI(I)}</span>
        {close && <span className="badge-ok">near target</span>}
      </div>
      <label>
        n / 10²⁸ m⁻³ <output>{w.n28.toFixed(2)}</output>
        <input
          type="range"
          min={0.3}
          max={2.5}
          step={0.05}
          value={w.n28}
          onChange={(e) => setW({ ...w, n28: +e.target.value })}
        />
      </label>
      <label>
        A (mm²) <output>{w.Amm2.toFixed(2)}</output>
        <input
          type="range"
          min={0.3}
          max={3}
          step={0.05}
          value={w.Amm2}
          onChange={(e) => setW({ ...w, Amm2: +e.target.value })}
        />
      </label>
      <label>
        v_d (µm/s) <output>{w.vdUms.toFixed(0)}</output>
        <input
          type="range"
          min={20}
          max={500}
          step={5}
          value={w.vdUms}
          onChange={(e) => setW({ ...w, vdUms: +e.target.value })}
        />
      </label>
      <p className="m2-tip">
        Drift here: <b>{fmtVd(w.vdUms * 1e-6)}</b>
      </p>
    </div>
  );
}

export default function M2Twin() {
  const [a, setA] = useState<WireControls>({ n28: 0.8, Amm2: 1.0, vdUms: 200 });
  const [b, setB] = useState<WireControls>({ n28: 1.6, Amm2: 2.0, vdUms: 50 });

  const Ia = useMemo(() => wireI(a), [a]);
  const Ib = useMemo(() => wireI(b), [b]);
  const aOk = Math.abs(Ia - TARGET) / TARGET < 0.05;
  const bOk = Math.abs(Ib - TARGET) / TARGET < 0.05;
  const both = aOk && bOk;
  const vdRatio = a.vdUms / b.vdUms;

  const applyPreset = () => {
    // Same I by construction: B has 2× n, 2× A, (1/4)× v_d relative scaling demo
    // Actually set known equal products.
    // I ∝ n A v_d (q fixed)
    // Wire A: n=1e28, A=1mm², vd chosen for target
    // Wire B: n=2e28, A=2mm² → nA is 4× → vd must be 1/4 for same I
    setA({ n28: 1.0, Amm2: 1.0, vdUms: 180 });
    setB({ n28: 2.0, Amm2: 2.0, vdUms: 45 }); // 2*2*(45) = 1*1*180
  };

  return (
    <div className="sim">
      <p className="scene-label">Scene 2 · Same current, different mixes</p>
      <p className="s3-task">
        <b>Your job:</b> get <b>both</b> wires to about <b>{TARGET} A</b>. You may use
        different densities, thicknesses, and drift speeds. Larger current does{' '}
        <b>not</b> always mean larger drift speed.
      </p>

      <div className="m2-target">
        Target current: <b>{TARGET.toFixed(2)} A</b>
        <span className="muted"> (within ~5%)</span>
      </div>

      <div className="m2-twin-grid">
        <WirePanel title="Wire A" color="#1d4ed8" w={a} setW={setA} />
        <WirePanel title="Wire B" color="#b45309" w={b} setW={setB} />
      </div>

      <div className="sim-buttons">
        <button type="button" onClick={applyPreset}>
          Show one solution (same I, different v_d)
        </button>
      </div>

      {both && (
        <div className="m2-check ok">
          Both wires are near the target.
          <br />
          Drift speeds: A = <b>{fmtVd(a.vdUms * 1e-6)}</b>, B ={' '}
          <b>{fmtVd(b.vdUms * 1e-6)}</b>
          {Math.abs(vdRatio - 1) > 0.15 && (
            <>
              {' '}
              — ratio about <b>{vdRatio.toFixed(2)}</b>. Same current, different drift.
            </>
          )}
        </div>
      )}

      <p className="sim-note">
        Compensation: if you double area and keep everything else fixed, I doubles — unless
        you cut drift speed in half. The product stays the same. That is the point of
        I = n q A v_d.
      </p>
    </div>
  );
}
