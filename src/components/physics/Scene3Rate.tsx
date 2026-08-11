/**
 * SCENE 3 · Rate of transfer (high-school-first visualization)
 *
 * Visualization only. Physics numbers come from src/physics/current/model.ts.
 *
 * Pedagogy constraints:
 *  - Same charge in both runs; only the time window differs.
 *  - Do NOT make the shorter window look like "faster dots" as the main cue.
 *    Primary cue = side-by-side clocks + charge bars filling to the same height.
 *  - Name "current" arrives after the student sees the comparison.
 *  - No speed slider.
 */

import { useEffect, useState } from 'react';
import { rate, countFromCharge } from '../../physics/current/model';
import SciNum from '../ui/SciNum';

type Prediction = 'A' | 'B' | 'same' | null;

const Q_FIXED = 10; // coulombs — both runs transfer the same charge
const RUN_A_DT = 10; // seconds
const RUN_B_DT = 2; // seconds

type Phase = 'idle' | 'running' | 'done';

interface RunState {
  elapsed: number;
  phase: Phase;
}

function ChargeBar({
  label,
  dt,
  elapsed,
  Q,
  accent,
}: {
  label: string;
  dt: number;
  elapsed: number;
  Q: number;
  accent: string;
}) {
  const frac = Math.min(1, elapsed / dt);
  const Qnow = frac * Q;
  const finished = frac >= 1;
  const r = rate(Q, dt);

  return (
    <div className="s3-lane">
      <div className="s3-lane-head">
        <span className="s3-lane-title">{label}</span>
        <span className="s3-lane-sub">same charge, different time</span>
      </div>

      <div className="s3-clock" style={{ borderColor: accent }}>
        <span className="s3-clock-label">time</span>
        <span className="s3-clock-val" style={{ color: accent }}>
          {elapsed.toFixed(1)}
          <small> / {dt.toFixed(0)} s</small>
        </span>
      </div>

      <div className="s3-bar-wrap">
        <div className="s3-bar-meta">
          <span>charge crossed</span>
          <span>
            {Qnow.toFixed(1)} / {Q.toFixed(0)} C
          </span>
        </div>
        <div className="s3-bar-track" aria-hidden>
          <div
            className="s3-bar-fill"
            style={{ width: `${frac * 100}%`, background: accent }}
          />
        </div>
        <p className="s3-bar-hint">
          Both bars finish at the <b>same height</b> ({Q} C). Only the clock differs.
        </p>
      </div>

      <div className={`s3-lane-result ${finished ? 'on' : ''}`}>
        {finished ? (
          <>
            <span className="s3-eq-line">
              {Q.toFixed(0)} C ÷ {dt.toFixed(0)} s = <b>{r.toFixed(1)} C/s</b>
            </span>
          </>
        ) : (
          <span className="muted">Waiting for this run to finish…</span>
        )}
      </div>
    </div>
  );
}

export default function Scene3Rate() {
  const [a, setA] = useState<RunState>({ elapsed: 0, phase: 'idle' });
  const [b, setB] = useState<RunState>({ elapsed: 0, phase: 'idle' });
  const [revealed, setRevealed] = useState(false);
  const [prediction, setPrediction] = useState<Prediction>(null);
  const [showExplore, setShowExplore] = useState(false);
  const [customQ, setCustomQ] = useState(10);
  const [customDt, setCustomDt] = useState(5);

  const bothDone = a.phase === 'done' && b.phase === 'done';
  const running = a.phase === 'running' || b.phase === 'running';

  // Drive both clocks from one rAF so they stay synchronized.
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const d = Math.min(0.05, (now - last) / 1000);
      last = now;

      setA((prev) => {
        if (prev.phase !== 'running') return prev;
        const next = prev.elapsed + d;
        if (next >= RUN_A_DT) return { elapsed: RUN_A_DT, phase: 'done' };
        return { elapsed: next, phase: 'running' };
      });
      setB((prev) => {
        if (prev.phase !== 'running') return prev;
        const next = prev.elapsed + d;
        if (next >= RUN_B_DT) return { elapsed: RUN_B_DT, phase: 'done' };
        return { elapsed: next, phase: 'running' };
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const startBoth = () => {
    setRevealed(false);
    setA({ elapsed: 0, phase: 'running' });
    setB({ elapsed: 0, phase: 'running' });
  };

  const reset = () => {
    setA({ elapsed: 0, phase: 'idle' });
    setB({ elapsed: 0, phase: 'idle' });
    setRevealed(false);
  };

  const rateA = rate(Q_FIXED, RUN_A_DT);
  const rateB = rate(Q_FIXED, RUN_B_DT);
  const customR = rate(customQ, customDt);

  return (
    <div className="sim">
      <p className="scene-label">Scene 3 · Same charge, different time</p>

      {/* Commit before revealing. Most students pick B, and being wrong on
          purpose is what makes the result stick. */}
      <div className="s3-predict">
        <p className="s3-predict-q">
          <b>First, commit to a guess.</b> Run B will finish much sooner than Run A. When
          both have finished, which run will have moved <b>more charge in total</b>?
        </p>
        <div className="s3-predict-opts">
          {([
            ['A', 'Run A — the slow one'],
            ['B', 'Run B — the quick one'],
            ['same', 'Both exactly the same'],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              className={prediction === k ? 'picked' : ''}
              onClick={() => setPrediction(k)}
              disabled={running}
            >
              {label}
            </button>
          ))}
        </div>
        {prediction && (
          <p className="s3-predict-locked">
            Guess locked in. Now run it and see.
          </p>
        )}
      </div>

      <p className="s3-task">
        <b>Your job:</b> press <b>Start both runs</b>. Watch the two clocks and the two
        charge bars. Both transfer <b>{Q_FIXED} C</b> — the same pile of charge.
        One finishes sooner. That is the whole idea.
      </p>

      <div className="s3-dual">
        <ChargeBar
          label="Run A"
          dt={RUN_A_DT}
          elapsed={a.elapsed}
          Q={Q_FIXED}
          accent="#1d4ed8"
        />
        <ChargeBar
          label="Run B"
          dt={RUN_B_DT}
          elapsed={b.elapsed}
          Q={Q_FIXED}
          accent="#b45309"
        />
      </div>

      {/* The wait is not dead time — it IS the lesson. Name it while it happens. */}
      {b.phase === 'done' && a.phase === 'running' && (
        <p className="s3-waiting">
          Run B has <b>already finished</b>. Run A is still going — and it will end up
          delivering exactly the same {Q_FIXED} C. Watch its bar catch up.
        </p>
      )}

      <div className="sim-buttons">
        <button className="reveal" onClick={startBoth} disabled={running}>
          {running ? 'Running…' : bothDone ? 'Replay both' : 'Start both runs'}
        </button>
        <button onClick={reset} disabled={running}>
          Reset
        </button>
      </div>

      {bothDone && (
        <div className="s3-compare">
          {prediction && (
            <p className={`s3-verdict ${prediction === 'same' ? 'ok' : 'no'}`}>
              {prediction === 'same' ? (
                <>You predicted <b>both the same</b> — and that is right. Same charge, different time.</>
              ) : (
                <>
                  You predicted <b>Run {prediction}</b> moved more charge. It did not — both
                  moved exactly {Q_FIXED} C. Run B was not carrying <i>more</i>; it was
                  carrying the same amount in less time.
                </>
              )}
            </p>
          )}

          <p>
            <b>Same charge</b> ({Q_FIXED} C ≈ <SciNum value={countFromCharge(Q_FIXED)} />{' '}
            elementary charges) crossed in both runs.
          </p>
          <ul>
            <li>
              Run A took <b>{RUN_A_DT} s</b> → <b>{rateA.toFixed(1)} C every second</b>
            </li>
            <li>
              Run B took <b>{RUN_B_DT} s</b> → <b>{rateB.toFixed(1)} C every second</b>
            </li>
          </ul>
          <p className="muted">
            Nothing here showed “how fast a particle flies.” Only how much charge crossed,
            and how long that took.
          </p>

          {!revealed ? (
            <button className="reveal" onClick={() => setRevealed(true)}>
              What is this rate called?
            </button>
          ) : (
            <div className="s3-reveal">
              The rate at which charge crosses a surface is called{' '}
              <b>electric current</b>, written <b>I</b>, measured in <b>amperes</b> (A).
              <div className="s3-eq">
                I = ΔQ / Δt &nbsp;→&nbsp; Run A: {rateA.toFixed(1)} A &nbsp;·&nbsp; Run B:{' '}
                {rateB.toFixed(1)} A
              </div>
              <span className="muted">
                Larger current means more charge per second — not “faster electrons” in this
                picture.
              </span>
            </div>
          )}
        </div>
      )}

      <details className="s3-explore" open={showExplore} onToggle={(e) => setShowExplore((e.target as HTMLDetailsElement).open)}>
        <summary>Try your own numbers (after the comparison)</summary>
        <div className="sim-controls">
          <label>
            charge to cross <output>{customQ.toFixed(1)} C</output>
            <input
              type="range"
              min={1}
              max={20}
              step={0.5}
              value={customQ}
              onChange={(e) => setCustomQ(+e.target.value)}
            />
          </label>
          <label>
            time taken <output>{customDt.toFixed(1)} s</output>
            <input
              type="range"
              min={0.5}
              max={20}
              step={0.5}
              value={customDt}
              onChange={(e) => setCustomDt(+e.target.value)}
            />
          </label>
        </div>
        <div className="s3-quotient">
          <div>
            <span className="k">charge</span>
            <span className="v">{customQ.toFixed(1)} C</span>
          </div>
          <div className="op">÷</div>
          <div>
            <span className="k">time</span>
            <span className="v">{customDt.toFixed(1)} s</span>
          </div>
          <div className="op">=</div>
          <div className="res">
            <span className="v">{customR.toFixed(2)}</span>
            <span className="k">C/s (= A)</span>
          </div>
        </div>
        <p className="sim-note">
          Shorter time with the same charge → larger current. More charge in the same time →
          larger current. Charge alone never tells you the current.
        </p>
      </details>
    </div>
  );
}
