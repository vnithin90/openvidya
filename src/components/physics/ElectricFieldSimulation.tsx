/**
 * VISUALIZATION LAYER — electric field of point charges.
 *
 * No physics in this file. Every vector drawn comes from
 * src/physics/electric-field/model.ts.
 *
 * Representation choices that are NOT physics, and are declared as such in the
 * caption and in model.yaml:
 *   - arrows are normalised in length and coloured by magnitude, because |E|
 *     spans many orders of magnitude near a charge;
 *   - this is a 2D slice (z = 0) through a 3D field.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  electricField,
  potential,
  traceFieldLine,
  totalCharge,
  vec,
  norm,
  sub,
  type PointCharge,
  type Vec3,
} from '../../physics/electric-field/model';

const nC = 1e-9;

type Preset = 'dipole' | 'like-pair' | 'single' | 'quadrupole';

const PRESETS: Record<Preset, PointCharge[]> = {
  single: [{ q: 2 * nC, r: vec(0, 0, 0), id: 'a' }],
  dipole: [
    { q: 2 * nC, r: vec(-0.35, 0, 0), id: 'a' },
    { q: -2 * nC, r: vec(0.35, 0, 0), id: 'b' },
  ],
  'like-pair': [
    { q: 2 * nC, r: vec(-0.35, 0, 0), id: 'a' },
    { q: 2 * nC, r: vec(0.35, 0, 0), id: 'b' },
  ],
  quadrupole: [
    { q: 2 * nC, r: vec(-0.35, -0.35, 0), id: 'a' },
    { q: -2 * nC, r: vec(0.35, -0.35, 0), id: 'b' },
    { q: -2 * nC, r: vec(-0.35, 0.35, 0), id: 'c' },
    { q: 2 * nC, r: vec(0.35, 0.35, 0), id: 'd' },
  ],
};

const EXTENT = 1.2; // metres, half-width of the viewport

export default function ElectricFieldSimulation() {
  const [preset, setPreset] = useState<Preset>('dipole');
  const [charges, setCharges] = useState<PointCharge[]>(PRESETS.dipole);
  const [mode, setMode] = useState<'arrows' | 'lines'>('arrows');
  const [showEquipotentials, setShowEquipotentials] = useState(false);
  const [probe, setProbe] = useState<Vec3 | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => setCharges(PRESETS[preset].map((c) => ({ ...c, r: { ...c.r } }))), [preset]);

  const net = useMemo(() => totalCharge(charges), [charges]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#fbfcfe';
    ctx.fillRect(0, 0, W, H);

    const scaleF = Math.min(W, H) / (2 * EXTENT);
    const toPx = (p: Vec3) => ({ x: W / 2 + p.x * scaleF, y: H / 2 - p.y * scaleF });

    if (showEquipotentials) {
      const N = 140;
      const img = ctx.createImageData(W, H);
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const wx = (px - W / 2) / scaleF;
          const wy = -(py - H / 2) / scaleF;
          const v = potential(charges, vec(wx, wy, 0), 0.02);
          const i = (py * W + px) * 4;
          if (v === null) continue;
          const t = Math.tanh(v / 120);
          img.data[i] = t > 0 ? 255 : 235 + 20 * (1 + t);
          img.data[i + 1] = 240 - Math.abs(t) * 40;
          img.data[i + 2] = t < 0 ? 255 : 235 + 20 * (1 - t);
          img.data[i + 3] = Math.min(190, Math.abs(t) * 230);
        }
      }
      ctx.putImageData(img, 0, 0);
      void N;
    }

    if (mode === 'arrows') {
      const step = 26;
      let maxMag = 0;
      const samples: { p: Vec3; e: Vec3; mag: number }[] = [];
      for (let px = step / 2; px < W; px += step) {
        for (let py = step / 2; py < H; py += step) {
          const wx = (px - W / 2) / scaleF;
          const wy = -(py - H / 2) / scaleF;
          const p = vec(wx, wy, 0);
          const e = electricField(charges, p);
          if (!e) continue;
          const mag = norm(e);
          if (!Number.isFinite(mag)) continue;
          samples.push({ p, e, mag });
          maxMag = Math.max(maxMag, mag);
        }
      }
      for (const s of samples) {
        const { x, y } = toPx(s.p);
        const ux = s.e.x / s.mag;
        const uy = s.e.y / s.mag;
        const L = step * 0.62; // fixed length: direction is physical, length is not
        const t = Math.min(1, Math.log10(1 + s.mag) / Math.log10(1 + maxMag));
        ctx.strokeStyle = `rgba(${Math.round(30 + 200 * t)},${Math.round(90 - 60 * t)},${Math.round(190 - 130 * t)},${0.35 + 0.55 * t})`;
        ctx.lineWidth = 1 + 1.4 * t;
        const x0 = x - (ux * L) / 2;
        const y0 = y + (uy * L) / 2;
        const x1 = x + (ux * L) / 2;
        const y1 = y - (uy * L) / 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        const a = Math.atan2(y1 - y0, x1 - x0);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 5 * Math.cos(a - 0.5), y1 - 5 * Math.sin(a - 0.5));
        ctx.lineTo(x1 - 5 * Math.cos(a + 0.5), y1 - 5 * Math.sin(a + 0.5));
        ctx.closePath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
    } else {
      ctx.lineWidth = 1.2;
      for (const c of charges) {
        const nLines = Math.max(8, Math.round(Math.abs(c.q / nC) * 8));
        for (let i = 0; i < nLines; i++) {
          const a = (2 * Math.PI * i) / nLines + 0.13;
          const start = vec(c.r.x + 0.045 * Math.cos(a), c.r.y + 0.045 * Math.sin(a), 0);
          const path = traceFieldLine(charges, start, {
            direction: c.q > 0 ? 1 : -1,
            step: 0.012,
            maxSteps: 2200,
            stopRadius: 0.05,
            bound: EXTENT * 2.2,
          });
          ctx.strokeStyle = c.q > 0 ? 'rgba(190,40,50,0.62)' : 'rgba(30,70,190,0.62)';
          ctx.beginPath();
          path.forEach((p, k) => {
            const q = toPx(p);
            k ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y);
          });
          ctx.stroke();
        }
      }
    }

    // probe
    if (probe) {
      const e = electricField(charges, probe);
      const pp = toPx(probe);
      ctx.strokeStyle = '#111827';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      if (e) {
        const m = norm(e);
        const ux = e.x / m;
        const uy = e.y / m;
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(pp.x, pp.y);
        ctx.lineTo(pp.x + ux * 44, pp.y - uy * 44);
        ctx.stroke();
      }
    }

    // charges
    for (const c of charges) {
      const p = toPx(c.r);
      const R = 11 + 5 * Math.min(1, Math.abs(c.q) / (3 * nC));
      ctx.beginPath();
      ctx.arc(p.x, p.y, R, 0, Math.PI * 2);
      ctx.fillStyle = c.q > 0 ? '#dc2626' : '#1d4ed8';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText(c.q > 0 ? '+' : '−', p.x - 4, p.y + 5);
    }
  }, [charges, mode, showEquipotentials, probe]);

  const pointerToWorld = (ev: React.PointerEvent<HTMLCanvasElement>): Vec3 => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleF = Math.min(rect.width, rect.height) / (2 * EXTENT);
    return vec(
      (ev.clientX - rect.left - rect.width / 2) / scaleF,
      -(ev.clientY - rect.top - rect.height / 2) / scaleF,
      0
    );
  };

  const onDown = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    const w = pointerToWorld(ev);
    const hit = charges.findIndex((c) => norm(sub(c.r, w)) < 0.09);
    if (hit >= 0) {
      setDragging(hit);
      ev.currentTarget.setPointerCapture(ev.pointerId);
    } else {
      setProbe(w);
    }
  };

  const onMove = (ev: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragging === null) return;
    const w = pointerToWorld(ev);
    setCharges((cs) => cs.map((c, i) => (i === dragging ? { ...c, r: w } : c)));
  };

  const probeE = probe ? electricField(charges, probe) : null;
  const probeV = probe ? potential(charges, probe) : null;

  return (
    <div className="sim">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: 400, display: 'block', borderRadius: 8, cursor: dragging !== null ? 'grabbing' : 'crosshair' }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => setDragging(null)}
        onPointerCancel={() => setDragging(null)}
      />

      <div className="sim-buttons">
        {(['single', 'dipole', 'like-pair', 'quadrupole'] as Preset[]).map((p) => (
          <button key={p} onClick={() => setPreset(p)} className={preset === p ? 'active' : ''}>
            {p}
          </button>
        ))}
        <span className="sim-preset">
          <button onClick={() => setMode('arrows')} className={mode === 'arrows' ? 'active' : ''}>arrows</button>
          <button onClick={() => setMode('lines')} className={mode === 'lines' ? 'active' : ''}>field lines</button>
        </span>
        <label className="chk">
          <input type="checkbox" checked={showEquipotentials} onChange={(e) => setShowEquipotentials(e.target.checked)} /> potential
        </label>
      </div>

      <div className="sim-controls">
        {charges.map((c, i) => (
          <label key={c.id ?? i}>
            Charge {i + 1} <output>{(c.q / nC).toFixed(1)} nC</output>
            <input
              type="range" min={-5} max={5} step={0.1} value={c.q / nC}
              onChange={(e) => setCharges((cs) => cs.map((x, k) => (k === i ? { ...x, q: +e.target.value * nC } : x)))}
            />
          </label>
        ))}
      </div>

      <div className="sim-readout">
        <span><b>net charge</b> {(net / nC).toFixed(1)} nC</span>
        {probe && probeE && (
          <>
            <span><b>|E|</b> {norm(probeE).toPrecision(3)} V/m</span>
            <span><b>V</b> {probeV!.toPrecision(3)} V</span>
            <span><b>at</b> ({probe.x.toFixed(2)}, {probe.y.toFixed(2)}) m</span>
          </>
        )}
        {!probe && <span style={{ color: '#6b7280' }}>drag a charge, or click empty space to probe the field</span>}
      </div>

      <p className="sim-note">
        Arrows have <b>fixed length</b> and are coloured by magnitude. Length here carries no
        physical meaning — near a charge |E| grows without bound, so drawing arrows to scale
        would make everything else invisible. This is a slice through the plane z = 0 of a
        three-dimensional field.
      </p>
    </div>
  );
}
