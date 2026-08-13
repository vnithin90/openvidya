/**
 * SCENE 1 · Charge can be counted (high-school-first)
 *
 * Visualization only. Numbers from src/physics/current/model.ts.
 *
 * Pedagogy:
 *  1. Step mode first — add one elementary charge at a time (concrete).
 *  2. Large-number mode second — log scale when dots are impossible.
 *  3. Symbol size never encodes amount (targets A2).
 *  4. Metrology / uncertainty checker is optional "go deeper".
 */

import { useMemo, useState } from 'react';
import {
  E,
  chargeFromCount,
  consistentWithQuantisation,
  netCount,
  netCharge,
  isNeutral,
} from '../../physics/current/model';

const SECONDS_PER_YEAR = 3.15576e7;
const AGE_OF_UNIVERSE_YEARS = 1.38e10; // optional analogy only; ⚠ unsourced

const fmtExp = (x: number) => {
  if (x === 0) return { mant: '0', exp: 0 };
  const p = Math.floor(Math.log10(Math.abs(x)));
  return { mant: (x / 10 ** p).toFixed(2), exp: p };
};

export default function Scene1Counting() {
  const [mode, setMode] = useState<'step' | 'large'>('step');
  const [nPos, setNPos] = useState(3);
  const [nNeg, setNNeg] = useState(3);
  const [logN, setLogN] = useState(6); // 0…20 when in large mode
  const [showYardstick, setShowYardstick] = useState(false);

  const pop = { positive: nPos, negative: nNeg };
  const net = netCount(pop);
  const neutral = isNeutral(pop);

  const N = mode === 'step' ? net : 10 ** logN;
  const Q = mode === 'step' ? netCharge(pop) : chargeFromCount(10 ** logN);
  const showDots = mode === 'step' || N <= 200;
  const years = useMemo(() => Math.abs(N) / SECONDS_PER_YEAR, [N]);

  // optional metrology panel
  const [measured, setMeasured] = useState(4.8);
  const [uncert, setUncert] = useState(0.02);
  const verdict = useMemo(
    () => consistentWithQuantisation(measured * 1e-19, uncert * 1e-19),
    [measured, uncert]
  );

  return (
    <div className="sim">
      <p className="scene-label">Scene 1 · Charge can be counted</p>

      <p className="s3-task">
        <b>Your job:</b> build a charge by counting particles. Two things to watch. The dots
        never change <b>size</b> — only how many there are. And there are <b>two kinds</b>,
        which cancel each other.
      </p>

      <div className="s1-symbol s1-legend">
        <div className="s1-legend-row">
          <span className="s1-dot pos">+</span>
          <div>
            <b>proton</b> — charge <b>+e</b> = +{E.toExponential(3)} C
          </div>
        </div>
        <div className="s1-legend-row">
          <span className="s1-dot neg">−</span>
          <div>
            <b>electron</b> — charge <b>−e</b> = −{E.toExponential(3)} C
          </div>
        </div>
        <p className="muted" style={{ margin: '.5rem 0 0' }}>
          <b>e</b> is the <i>elementary charge</i>, and it is a positive number. A proton
          carries <b>+e</b>; an electron carries <b>−e</b>. Same size, opposite kind.
          <br />
          Symbols, not realistic pictures of particles.
        </p>
      </div>

      <div className="sim-buttons s1-mode">
        <button className={mode === 'step' ? 'active' : ''} onClick={() => setMode('step')}>
          1 · Count by ones
        </button>
        <button className={mode === 'large' ? 'active' : ''} onClick={() => setMode('large')}>
          2 · Jump to huge numbers
        </button>
      </div>

      {mode === 'step' ? (
        <>
          <div className="s1-two-kinds">
            <div className="s1-kind pos">
              <span className="k">protons (+e)</span>
              <div className="s1-stepper">
                <button className="s1-step-btn" aria-label="Remove one proton"
                  onClick={() => setNPos((n) => Math.max(0, n - 1))}>−</button>
                <span className="v">{nPos}</span>
                <button className="s1-step-btn" aria-label="Add one proton"
                  onClick={() => setNPos((n) => Math.min(24, n + 1))}>+</button>
              </div>
            </div>
            <div className="s1-kind neg">
              <span className="k">electrons (−e)</span>
              <div className="s1-stepper">
                <button className="s1-step-btn" aria-label="Remove one electron"
                  onClick={() => setNNeg((n) => Math.max(0, n - 1))}>−</button>
                <span className="v">{nNeg}</span>
                <button className="s1-step-btn" aria-label="Add one electron"
                  onClick={() => setNNeg((n) => Math.min(24, n + 1))}>+</button>
              </div>
            </div>
          </div>

          <div className={`s1-net ${neutral ? 'neutral' : net > 0 ? 'pos' : 'neg'}`}>
            <span className="k">net charge</span>
            <span className="v">
              {neutral ? 'zero — neutral' : `${net > 0 ? '+' : ''}${net} e`}
            </span>
            <span className="sub">
              {neutral ? (
                <>
                  {nPos + nNeg} charged particles here, and the object is still neutral.
                  Neutral does not mean empty — it means balanced.
                </>
              ) : (
                <>
                  {nPos} protons − {nNeg} electrons = {net > 0 ? '+' : ''}{net} e.
                  Only the <b>difference</b> is countable as charge.
                </>
              )}
            </span>
          </div>

          <p className="s1-axis-note" style={{ marginTop: '.6rem' }}>
            Add one of each and nothing changes. That is what makes charge countable:
            not how many particles there are, but how many more of one kind than the other.
          </p>
        </>
      ) : (
        <>
          <div className="s1-axis">
            <div className="s1-axis-line">
              {Array.from({ length: 8 }, (_, i) => i * 3).map((p) => (
                <span
                  key={p}
                  className={`s1-tick ${logN >= p ? 'on' : ''}`}
                  style={{ left: `${(p / 21) * 100}%` }}
                >
                  <i />
                  <em>
                    10<sup>{p}</sup>
                  </em>
                </span>
              ))}
              <span className="s1-marker" style={{ left: `${(logN / 21) * 100}%` }} />
            </div>
            <p className="s1-axis-note">
              Each equal step is <b>×1000</b>, not +1000. We use a log axis because 10²⁰
              cannot sit next to 1 on a normal ruler.
            </p>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={logN}
            onChange={(e) => setLogN(+e.target.value)}
            className="s1-range"
          />
        </>
      )}

      <div className="s1-readout">
        <div>
          <span className="k">N (net count)</span>
          <span className="v">
            {Math.abs(N) < 1e6 ? N.toLocaleString() : <>10<sup>{logN}</sup></>}
          </span>
          <span className="muted">whole particles only, and signed</span>
        </div>
        <div>
          <span className="k">Q = N × e</span>
          <span className="v">
            {Q < 1e-3 ? (
              <>
                {fmtExp(Q).mant}×10<sup>{fmtExp(Q).exp}</sup> C
              </>
            ) : (
              <>{Q.toPrecision(3)} C</>
            )}
          </span>
        </div>
      </div>

      <div className="s1-dots" aria-hidden>
        {mode === 'step' ? (
          <>
            {Array.from({ length: nPos }, (_, i) => (
              <span key={`p${i}`} className="s1-dot sm pos">+</span>
            ))}
            {Array.from({ length: nNeg }, (_, i) => (
              <span key={`n${i}`} className="s1-dot sm neg">−</span>
            ))}
          </>
        ) : showDots ? (
          Array.from({ length: Math.min(Math.round(Math.abs(N)), 200) }, (_, i) => (
            <span key={i} className="s1-dot sm" />
          ))
        ) : (
          <p className="s1-uncountable">
            Too many to draw as dots. The number still means a count of particles. Drawing more circles would only fill the screen. It would not show 10<sup>{logN}</sup>.
          </p>
        )}
      </div>

      {mode === 'large' && (
        <>
          <button className="s1-toggle" onClick={() => setShowYardstick((v) => !v)}>
            {showYardstick ? 'Hide' : 'Show'} “counting one per second” comparison
          </button>
          {showYardstick && (
            <div className="s1-yardstick">
              Counting these one per second would take{' '}
              <b>
                {years < 1
                  ? `${N.toPrecision(3)} s`
                  : `${fmtExp(years).mant}×10^${fmtExp(years).exp} years`}
              </b>
              {years > AGE_OF_UNIVERSE_YEARS && (
                <>
                  {' '}
                  — about <b>{Math.round(years / AGE_OF_UNIVERSE_YEARS)}×</b> the age of the
                  universe.
                </>
              )}
              <p className="muted">
                An analogy to feel the size of the number — not a picture of the charge
                itself. ⚠ age-of-universe figure currently unsourced.
              </p>
            </div>
          )}
        </>
      )}

      <details className="s1-deeper">
        <summary>Go deeper: is a measured charge “allowed” by quantisation?</summary>
        <p className="muted">
          Optional. You need a measurement <b>and</b> its uncertainty. A single number alone
          cannot answer.
        </p>
        <div className="sim-controls">
          <label>
            measured charge <output>{measured.toFixed(2)}×10⁻¹⁹ C</output>
            <input
              type="range"
              min={1}
              max={8}
              step={0.05}
              value={measured}
              onChange={(e) => setMeasured(+e.target.value)}
            />
          </label>
          <label>
            uncertainty ± <output>{uncert.toFixed(3)}×10⁻¹⁹ C</output>
            <input
              type="range"
              min={0.001}
              max={0.1}
              step={0.001}
              value={uncert}
              onChange={(e) => setUncert(+e.target.value)}
            />
          </label>
        </div>
        <p className={`s1-verdict ${verdict.consistent ? 'ok' : 'no'}`}>
          {verdict.n.toFixed(3)} e — nearest whole number is <b>{verdict.nearest} e</b>.{' '}
          {verdict.consistent
            ? 'Consistent: a whole multiple lies inside the uncertainty.'
            : 'Not consistent: no whole multiple lies inside the uncertainty.'}
        </p>
      </details>
    </div>
  );
}
