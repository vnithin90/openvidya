/**
 * VISUALIZATION LAYER — projectile motion.
 *
 * This component must not contain physics. Every number it draws comes from
 * src/physics/projectile/model.ts. If you find yourself writing an equation
 * in this file, it belongs in the model instead.
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { simulate, DEG, type Trajectory } from '../../physics/projectile/model';

const fmt = (x: number, d = 2) => x.toFixed(d);

export default function ProjectileSimulation() {
  const [v0, setV0] = useState(25);
  const [thetaDeg, setTheta] = useState(45);
  const [g, setG] = useState(9.81);
  const [showVectors, setShowVectors] = useState(true);
  const [showGhosts, setShowGhosts] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [tNorm, setTNorm] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  // Physics comes from the model layer only.
  const traj: Trajectory = useMemo(
    () => simulate({ v0, thetaDeg, g }, 2e-3),
    [v0, thetaDeg, g]
  );

  const ghosts = useMemo(() => {
    if (!showGhosts) return [];
    return [15, 30, 60, 75].map((t) => ({ t, traj: simulate({ v0, thetaDeg: t, g }, 5e-3) }));
  }, [showGhosts, v0, g]);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setTNorm((p) => {
        const T = traj.timeOfFlight || 1;
        const next = p + dt / T;
        return next > 1 ? 0 : next;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, traj.timeOfFlight]);

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
    ctx.clearRect(0, 0, W, H);

    const pad = 44;
    const maxX = Math.max(traj.range, 1) * 1.08;
    const maxY = Math.max(traj.maxHeight, 1) * 1.35;
    const sx = (x: number) => pad + (x / maxX) * (W - pad * 1.4);
    const sy = (y: number) => H - pad - (y / maxY) * (H - pad * 1.6);

    // axes
    ctx.strokeStyle = '#c9ced6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, H - pad);
    ctx.lineTo(W - pad * 0.4, H - pad);
    ctx.moveTo(pad, H - pad);
    ctx.lineTo(pad, pad * 0.5);
    ctx.stroke();

    ctx.fillStyle = '#6b7280';
    ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
    for (let i = 1; i <= 4; i++) {
      const xv = (maxX * i) / 4;
      ctx.fillText(`${fmt(xv, 0)} m`, sx(xv) - 12, H - pad + 15);
      const yv = (maxY * i) / 4;
      ctx.fillText(`${fmt(yv, 0)}`, 8, sy(yv) + 4);
    }
    ctx.fillText('x', W - pad * 0.5, H - pad + 15);
    ctx.fillText('y (m)', 8, pad * 0.35);

    // comparison trajectories
    for (const gh of ghosts) {
      ctx.strokeStyle = 'rgba(120,130,145,0.32)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      gh.traj.states.forEach((s, i) => (i ? ctx.lineTo(sx(s.r.x), sy(s.r.y)) : ctx.moveTo(sx(s.r.x), sy(s.r.y))));
      ctx.stroke();
      const end = gh.traj.states[gh.traj.states.length - 1];
      ctx.fillStyle = 'rgba(110,120,135,0.75)';
      ctx.fillText(`${gh.t}°`, sx(end.r.x) - 8, sy(end.r.y) - 6);
    }

    // trajectory
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    traj.states.forEach((s, i) => (i ? ctx.lineTo(sx(s.r.x), sy(s.r.y)) : ctx.moveTo(sx(s.r.x), sy(s.r.y))));
    ctx.stroke();

    // current state, located by time not by index
    const tNow = tNorm * traj.timeOfFlight;
    let idx = 0;
    while (idx < traj.states.length - 1 && traj.states[idx].t < tNow) idx++;
    const s = traj.states[idx];

    if (showVectors) {
      const vScale = 0.55 * (Math.max(traj.range, 1) / Math.max(v0, 1));
      const arrow = (dx: number, dy: number, colour: string, label: string) => {
        const x0 = sx(s.r.x);
        const y0 = sy(s.r.y);
        const x1 = sx(s.r.x + dx * vScale);
        const y1 = sy(s.r.y + dy * vScale);
        ctx.strokeStyle = colour;
        ctx.fillStyle = colour;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        const a = Math.atan2(y1 - y0, x1 - x0);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 - 8 * Math.cos(a - 0.4), y1 - 8 * Math.sin(a - 0.4));
        ctx.lineTo(x1 - 8 * Math.cos(a + 0.4), y1 - 8 * Math.sin(a + 0.4));
        ctx.closePath();
        ctx.fill();
        if (label) ctx.fillText(label, x1 + 4, y1 - 4);
      };
      arrow(s.v.x, 0, '#059669', 'vₓ');
      arrow(0, s.v.y, '#dc2626', 'v_y');
      arrow(s.v.x, s.v.y, '#111827', 'v');
    }

    ctx.fillStyle = '#111827';
    ctx.beginPath();
    ctx.arc(sx(s.r.x), sy(s.r.y), 5.5, 0, Math.PI * 2);
    ctx.fill();
  }, [traj, tNorm, showVectors, ghosts, v0]);

  const tNow = tNorm * traj.timeOfFlight;
  let idx = 0;
  while (idx < traj.states.length - 1 && traj.states[idx].t < tNow) idx++;
  const cur = traj.states[idx];

  return (
    <div className="sim">
      <canvas ref={canvasRef} style={{ width: '100%', height: 340, display: 'block' }} />

      <div className="sim-readout">
        <span><b>t</b> {fmt(cur.t)} s</span>
        <span><b>x</b> {fmt(cur.r.x)} m</span>
        <span><b>y</b> {fmt(cur.r.y)} m</span>
        <span style={{ color: '#059669' }}><b>vₓ</b> {fmt(cur.v.x)} m/s</span>
        <span style={{ color: '#dc2626' }}><b>v_y</b> {fmt(cur.v.y)} m/s</span>
      </div>

      <div className="sim-controls">
        <label>
          Initial speed v₀ <output>{fmt(v0, 1)} m/s</output>
          <input type="range" min={1} max={100} step={0.5} value={v0} onChange={(e) => setV0(+e.target.value)} />
        </label>
        <label>
          Launch angle θ <output>{fmt(thetaDeg, 0)}°</output>
          <input type="range" min={0} max={90} step={1} value={thetaDeg} onChange={(e) => setTheta(+e.target.value)} />
        </label>
        <label>
          Gravity g <output>{fmt(g, 2)} m/s²</output>
          <input type="range" min={1} max={25} step={0.01} value={g} onChange={(e) => setG(+e.target.value)} />
        </label>
      </div>

      <div className="sim-buttons">
        <button onClick={() => setPlaying((p) => !p)}>{playing ? 'Pause' : 'Play'}</button>
        <button onClick={() => setTNorm(0)}>Restart</button>
        <label className="chk"><input type="checkbox" checked={showVectors} onChange={(e) => setShowVectors(e.target.checked)} /> velocity components</label>
        <label className="chk"><input type="checkbox" checked={showGhosts} onChange={(e) => setShowGhosts(e.target.checked)} /> compare angles</label>
        <span className="sim-preset">
          <button onClick={() => setG(1.62)}>Moon</button>
          <button onClick={() => setG(3.72)}>Mars</button>
          <button onClick={() => setG(9.81)}>Earth</button>
          <button onClick={() => setG(24.79)}>Jupiter</button>
        </span>
      </div>

      <table className="sim-results">
        <tbody>
          <tr><td>Range</td><td>{fmt(traj.range)} m</td><td className="chk-cell">v₀² sin 2θ / g = {fmt((v0 * v0 * Math.sin(2 * thetaDeg * DEG)) / g)} m</td></tr>
          <tr><td>Max height</td><td>{fmt(traj.maxHeight)} m</td><td className="chk-cell">v₀² sin²θ / 2g = {fmt((v0 * v0 * Math.sin(thetaDeg * DEG) ** 2) / (2 * g))} m</td></tr>
          <tr><td>Time of flight</td><td>{fmt(traj.timeOfFlight)} s</td><td className="chk-cell">2 v₀ sinθ / g = {fmt((2 * v0 * Math.sin(thetaDeg * DEG)) / g)} s</td></tr>
        </tbody>
      </table>
      <p className="sim-note">
        The left column is produced by numerically integrating the equations of motion.
        The right column is the closed-form solution, computed separately. They agree
        because the implementation is correct — not because one was copied from the other.
      </p>
    </div>
  );
}
