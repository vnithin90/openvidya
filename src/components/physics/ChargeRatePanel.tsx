/**
 * CONTEXT PANEL · How much, and how fast (high-school-first)
 *
 * Not a carrier animation. Live comparison of total charge vs rough rate,
 * shown as order-of-magnitude bars so the punchline is visible, not only textual.
 */

import { useState } from 'react';
import { mAhToCoulomb, ratioRange } from '../../physics/current/model';

/** Map a positive value to a bar width on a log scale between min and max. */
function logBarPct(value: number, min: number, max: number): number {
  const v = Math.max(min, Math.min(max, value));
  const t = (Math.log10(v) - Math.log10(min)) / (Math.log10(max) - Math.log10(min));
  return Math.round(8 + t * 92);
}

export default function ChargeRatePanel() {
  const [strokeLo, setStrokeLo] = useState(5);
  const [strokeHi, setStrokeHi] = useState(20);
  const [cellLo, setCellLo] = useState(2000);
  const [cellHi, setCellHi] = useState(3000);

  const cellC: readonly [number, number] = [mAhToCoulomb(cellLo), mAhToCoulomb(cellHi)];
  const strokeC: readonly [number, number] = [strokeLo, strokeHi];
  const [rLo, rHi] = ratioRange(cellC, strokeC);

  // Representative midpoints for the visual only (ranges remain in the text).
  const strokeChargeMid = (strokeLo + strokeHi) / 2;
  const cellChargeMid = (cellC[0] + cellC[1]) / 2;
  // Rough rates for the picture (orders of magnitude stated on the page).
  const strokeRate = 3e4; // A, order of magnitude
  const cellRate = 0.2; // A, order of magnitude

  const chargeStrokePct = logBarPct(strokeChargeMid, 1, 2e4);
  const chargeCellPct = logBarPct(cellChargeMid, 1, 2e4);
  const rateStrokePct = logBarPct(strokeRate, 0.01, 1e5);
  const rateCellPct = logBarPct(cellRate, 0.01, 1e5);

  return (
    <div className="sim panel">
      <p className="scene-label">Context · How much charge vs how fast</p>

      <p className="s3-task">
        <b>Look at the bars:</b> the <i>longer</i> bar wins that contest. Total charge and
        rate can rank the two situations <b>opposite</b> ways.
      </p>

      <div className="panel-vis">
        <div className="panel-vis-block">
          <h4>Total charge transferred</h4>
          <div className="panel-bar-row">
            <span className="panel-bar-label">Lightning</span>
            <div className="panel-bar-track">
              <div className="panel-bar-fill stroke" style={{ width: `${chargeStrokePct}%` }} />
            </div>
            <span className="panel-bar-num">
              {strokeLo}–{strokeHi} C
            </span>
          </div>
          <div className="panel-bar-row">
            <span className="panel-bar-label">AA cell</span>
            <div className="panel-bar-track">
              <div className="panel-bar-fill cell" style={{ width: `${chargeCellPct}%` }} />
            </div>
            <span className="panel-bar-num">
              {cellC[0].toFixed(0)}–{cellC[1].toFixed(0)} C
            </span>
          </div>
          <p className="panel-vis-win">
            Winner on <b>total charge</b>: AA cell (
            <b>
              {rLo.toFixed(0)}×–{rHi.toFixed(0)}×
            </b>{' '}
            more than the stroke)
          </p>
        </div>

        <div className="panel-vis-block">
          <h4>Rate (rough order of magnitude)</h4>
          <div className="panel-bar-row">
            <span className="panel-bar-label">Lightning</span>
            <div className="panel-bar-track">
              <div className="panel-bar-fill stroke" style={{ width: `${rateStrokePct}%` }} />
            </div>
            <span className="panel-bar-num">~10⁴ A</span>
          </div>
          <div className="panel-bar-row">
            <span className="panel-bar-label">AA cell</span>
            <div className="panel-bar-track">
              <div className="panel-bar-fill cell" style={{ width: `${rateCellPct}%` }} />
            </div>
            <span className="panel-bar-num">~10⁻¹ A</span>
          </div>
          <p className="panel-vis-win">
            Winner on <b>rate</b>: lightning (tens of thousands of times larger)
          </p>
        </div>
      </div>

      <div className="panel-result">
        Same two situations, <b>opposite rankings</b>. Knowing how much charge moved does
        <b> not</b> tell you the current. You also need the time.
      </div>

      <table className="panel-table">
        <thead>
          <tr>
            <th></th>
            <th>charge transferred</th>
            <th>over roughly</th>
            <th>rate</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>lightning stroke</td>
            <td>
              {strokeLo}–{strokeHi} C
            </td>
            <td>tens of microseconds</td>
            <td>
              order 10<sup>4</sup> A
            </td>
          </tr>
          <tr>
            <td>AA cell</td>
            <td>
              {cellC[0].toFixed(0)}–{cellC[1].toFixed(0)} C
            </td>
            <td>hours</td>
            <td>
              order 10<sup>-1</sup> A
            </td>
          </tr>
        </tbody>
      </table>

      <details className="panel-inputs">
        <summary>Adjust the ranges (why we use ranges, not a single precise number)</summary>
        <div className="sim-controls">
          <label>
            stroke charge, low <output>{strokeLo} C</output>
            <input
              type="range"
              min={1}
              max={15}
              step={1}
              value={strokeLo}
              onChange={(e) => setStrokeLo(Math.min(+e.target.value, strokeHi - 1))}
            />
          </label>
          <label>
            stroke charge, high <output>{strokeHi} C</output>
            <input
              type="range"
              min={6}
              max={60}
              step={1}
              value={strokeHi}
              onChange={(e) => setStrokeHi(Math.max(+e.target.value, strokeLo + 1))}
            />
          </label>
          <label>
            cell capacity, low <output>{cellLo} mAh</output>
            <input
              type="range"
              min={800}
              max={2500}
              step={100}
              value={cellLo}
              onChange={(e) => setCellLo(Math.min(+e.target.value, cellHi - 100))}
            />
          </label>
          <label>
            cell capacity, high <output>{cellHi} mAh</output>
            <input
              type="range"
              min={1500}
              max={4000}
              step={100}
              value={cellHi}
              onChange={(e) => setCellHi(Math.max(+e.target.value, cellLo + 100))}
            />
          </label>
        </div>
        <ul className="panel-src">
          <li>
            <b>Cell capacity</b> is a rated charge under specified load — not “charge sitting
            in the battery.” ⚠ currently unsourced.
          </li>
          <li>
            <b>Stroke charge</b> varies a lot between events. ⚠ currently unsourced.
          </li>
          <li>Bars use a log scale so huge and small values can share one picture.</li>
        </ul>
      </details>
    </div>
  );
}
