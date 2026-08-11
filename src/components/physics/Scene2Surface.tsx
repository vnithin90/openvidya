/**
 * SCENE 2 · Charge can cross a chosen surface (high-school-first)
 *
 * Visualization only. Q ↔ N conversion uses the physics layer.
 *
 * Pedagogy:
 *  - Finite packet of markers (a story with a start and an end).
 *  - Two counting lines at once so moving a surface does not feel like "resetting physics".
 *  - Flash + "+1" on each crossing so the count is an event, not a distant number.
 *  - No clock (rate belongs in Scene 3). No word "current".
 *  - Colour change after crossing is only "already counted", not a gate mechanism.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { countFromCharge } from '../../physics/current/model';
import SciNum from '../ui/SciNum';

const W = 720;
const H = 220;
const N_MARKERS = 12;
const CHARGE_PER_MARKER = 0.5; // C — stated on screen
const SPEED = 90; // px/s — fixed visual crawl; not a student control
const START_X = -40;
const SPACING = 48;

interface Marker {
  id: number;
  x: number;
  countedA: boolean;
  countedB: boolean;
}

interface Flash {
  x: number;
  y: number;
  text: string;
  life: number;
}

export default function Scene2Surface() {
  const [surfaceA] = useState(0.28); // fixed reference line
  const [surfaceB, setSurfaceB] = useState(0.72); // student-moved line
  const [countA, setCountA] = useState(0);
  const [countB, setCountB] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const markersRef = useRef<Marker[]>([]);
  const flashesRef = useRef<Flash[]>([]);

  const initMarkers = useCallback(() => {
    markersRef.current = Array.from({ length: N_MARKERS }, (_, i) => ({
      id: i,
      x: START_X - i * SPACING,
      countedA: false,
      countedB: false,
    }));
    flashesRef.current = [];
    setCountA(0);
    setCountB(0);
    setFinished(false);
  }, []);

  useEffect(() => {
    initMarkers();
  }, [initMarkers, runKey]);

  const startPacket = () => {
    initMarkers();
    setRunning(true);
    setFinished(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();

    const draw = (now: number) => {
      const dt = running ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // channel
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, H / 2 - 40, W, 80);
      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(0, H / 2 - 40);
      ctx.lineTo(W, H / 2 - 40);
      ctx.moveTo(0, H / 2 + 40);
      ctx.lineTo(W, H / 2 + 40);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px ui-sans-serif, system-ui, sans-serif';
      ctx.fillText('charge packet travels this way →', 12, H / 2 - 48);

      const xA = surfaceA * W;
      const xB = surfaceB * W;

      const drawSurface = (x: number, label: string, color: string) => {
        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, 28);
        ctx.lineTo(x, H - 28);
        ctx.stroke();
        ctx.restore();
        ctx.fillStyle = color;
        ctx.font = '600 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(label, x + 6, 22);
        ctx.font = '10px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('count only — not a wall', x + 6, H - 12);
      };

      drawSurface(xA, 'Count place A', '#4f46e5');
      drawSurface(xB, 'Count place B (you move this)', '#0d9488');

      // advance markers
      let allPast = true;
      for (const m of markersRef.current) {
        if (running) m.x += SPEED * dt;
        if (m.x < W + 30) allPast = false;

        // crossing events
        if (running && !m.countedA && m.x >= xA) {
          m.countedA = true;
          setCountA((c) => c + 1);
          flashesRef.current.push({ x: xA, y: H / 2 - 28, text: '+1 at A', life: 0.7 });
        }
        if (running && !m.countedB && m.x >= xB) {
          m.countedB = true;
          setCountB((c) => c + 1);
          flashesRef.current.push({ x: xB, y: H / 2 + 18, text: '+1 at B', life: 0.7 });
        }

        // marker
        const pastBoth = m.countedA && m.countedB;
        ctx.beginPath();
        ctx.arc(m.x, H / 2, 12, 0, Math.PI * 2);
        ctx.fillStyle = pastBoth ? '#94a3b8' : '#1d4ed8';
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText('●', m.x - 4, H / 2 + 4);
      }

      // flashes
      flashesRef.current = flashesRef.current
        .map((f) => ({ ...f, life: f.life - dt }))
        .filter((f) => f.life > 0);
      for (const f of flashesRef.current) {
        const a = Math.min(1, f.life / 0.35);
        ctx.fillStyle = `rgba(15, 23, 42, ${a})`;
        ctx.font = '700 13px ui-sans-serif, system-ui, sans-serif';
        ctx.fillText(f.text, f.x + 8, f.y);
      }

      if (running && allPast && markersRef.current.every((m) => m.x > W + 20)) {
        setRunning(false);
        setFinished(true);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [running, surfaceA, surfaceB]);

  const QA = countA * CHARGE_PER_MARKER;
  const QB = countB * CHARGE_PER_MARKER;

  return (
    <div className="sim">
      <p className="scene-label">Scene 2 · Count charge as it goes past</p>

      <p className="s3-task">
        <b>Your job:</b> send a <b>packet</b> of charge past two counting places. Move place
        B. Watch both counters — you are only choosing <i>where to count</i>, not blocking
        anything.
      </p>

      <canvas
        ref={canvasRef}
        style={{ width: '100%', maxWidth: W, height: H, display: 'block', borderRadius: 8 }}
      />

      <div className="sim-controls">
        <label>
          move count place B <output>{Math.round(surfaceB * 100)}% along</output>
          <input
            type="range"
            min={0.4}
            max={0.9}
            step={0.01}
            value={surfaceB}
            onChange={(e) => setSurfaceB(+e.target.value)}
          />
        </label>
      </div>

      <div className="s2-dual-readout">
        <div className="s2-card" style={{ borderColor: '#4f46e5' }}>
          <span className="k">At place A</span>
          <span className="v">{countA} markers</span>
          <span className="sub">
            {QA.toFixed(1)} C · <SciNum value={countFromCharge(QA)} /> particles
          </span>
        </div>
        <div className="s2-card" style={{ borderColor: '#0d9488' }}>
          <span className="k">At place B</span>
          <span className="v">{countB} markers</span>
          <span className="sub">
            {QB.toFixed(1)} C · <SciNum value={countFromCharge(QB)} /> particles
          </span>
        </div>
      </div>

      <div className="sim-buttons">
        <button className="reveal" onClick={startPacket} disabled={running}>
          {running ? 'Packet moving…' : 'Send packet'}
        </button>
        <button
          onClick={() => {
            setRunning(false);
            setRunKey((k) => k + 1);
          }}
          disabled={running}
        >
          Reset
        </button>
      </div>

      {finished && (
        <p className="s2-done">
          Packet finished. Both places counted the <b>same</b> {N_MARKERS} markers (
          {(N_MARKERS * CHARGE_PER_MARKER).toFixed(1)} C), if the whole packet passed each
          line. Moving B only chooses a different counting place — it does not change how
          much charge is in the packet.
        </p>
      )}

      <p className="sim-note">
        Each ● stands for <b>{CHARGE_PER_MARKER} C</b> (
        <SciNum value={countFromCharge(CHARGE_PER_MARKER)} sig={1} /> elementary charges). Real
        electrons are far too many to draw. The dashed lines are imaginary surfaces you
        choose — like deciding where to stand and count people walking by, not a door that
        stops them.
      </p>
    </div>
  );
}
