/**
 * Shared investigation runtime — storage, records, and two small components
 * every lesson needs.
 *
 * ─── WHY SESSION STORAGE, NOT LOCAL ───────────────────────────────────────
 *
 * Every lesson used `localStorage` until now. That is wrong for the room this
 * course is actually used in.
 *
 * A school computer lab is shared. With `localStorage`, the next student to sit
 * down opens E2 and finds someone else's locked predictions already there,
 * their judgments already committed, and the reveals already open. The lock —
 * the mechanism the whole course rests on — becomes somebody else's lock, and
 * the new student is shown answers before they have been asked the questions.
 *
 * `sessionStorage` survives a refresh, so a student cannot escape a commitment
 * by reloading. It dies with the tab, so the machine is clean for the next one.
 *
 * ─── AND WHY THAT ALONE WOULD BE WORSE ────────────────────────────────────
 *
 * E2 spans a bench session that may not happen in one sitting: charge the
 * balls, wait for a dry day, come back. Losing everything at tab close would
 * punish exactly the students doing the experiment properly.
 *
 * So the record is downloadable. A student keeps a JSON file and opens it again
 * next time — and, usefully, can hand it to a teacher. Nothing is sent anywhere;
 * there is no server, and this course collects nothing.
 *
 * The idea, and the reasoning about shared machines, is taken from the parallel
 * plain-JS build. Credit where it is due — it is a better answer than mine was.
 */

import { useRef, useState } from 'react';

const PREFIX = 'openvidya.';
const LESSONS = ['e1', 'e2', 'e3', 'e4'] as const;
export type LessonKey = (typeof LESSONS)[number];

/* ------------------------------------------------------------------ storage */

export function loadRun<T>(key: LessonKey, blank: () => T): T {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (raw) return { ...blank(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return blank();
}

export function saveRun<T>(key: LessonKey, state: T): void {
  try { sessionStorage.setItem(PREFIX + key, JSON.stringify(state)); } catch { /* ignore */ }
}

export function clearRun(key: LessonKey): void {
  try { sessionStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
}

export function earnedModels(): string[] {
  try { return JSON.parse(sessionStorage.getItem(`${PREFIX}models`) || '[]'); }
  catch { return []; }
}

export function earnModel(id: string): void {
  try {
    const list = earnedModels();
    if (!list.includes(id)) sessionStorage.setItem(`${PREFIX}models`, JSON.stringify([...list, id]));
  } catch { /* ignore */ }
}

/* ------------------------------------------------------------------- record */

interface Record {
  kind: 'openvidya-record';
  v: 1;
  saved: string;
  models: string[];
  runs: Partial<Record2>;
}
type Record2 = { [K in LessonKey]: unknown };

export function exportRecord(): Record {
  const runs: Partial<Record2> = {};
  for (const k of LESSONS) {
    try {
      const raw = sessionStorage.getItem(PREFIX + k);
      if (raw) runs[k] = JSON.parse(raw);
    } catch { /* ignore */ }
  }
  return { kind: 'openvidya-record', v: 1, saved: new Date().toISOString(), models: earnedModels(), runs };
}

export function importRecord(obj: unknown): boolean {
  const r = obj as Record;
  if (!r || r.kind !== 'openvidya-record') return false;
  try {
    if (r.models) sessionStorage.setItem(`${PREFIX}models`, JSON.stringify(r.models));
    for (const k of LESSONS) {
      if (r.runs?.[k]) sessionStorage.setItem(PREFIX + k, JSON.stringify(r.runs[k]));
    }
    return true;
  } catch { return false; }
}

/**
 * Keep a copy / open a saved copy.
 *
 * Shown at the end of every lesson, because that is when a student has
 * something worth keeping and is about to close the tab.
 */
export function RecordBar() {
  const input = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const save = () => {
    const blob = new Blob([JSON.stringify(exportRecord(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'openvidya-my-record.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 500);
    setMsg('Saved to your downloads.');
  };

  const open = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        if (importRecord(JSON.parse(String(reader.result)))) location.reload();
        else setMsg('That file is not an OpenVidya record.');
      } catch { setMsg('That file could not be read.'); }
    };
    reader.readAsText(f);
  };

  return (
    <div className="card quiet recordbar">
      <p style={{ marginTop: 0 }}>
        <strong>Work in this tab is forgotten when you close it.</strong> That keeps a shared
        computer clean for the next person. Keep a copy if you are coming back another day.
      </p>
      <div className="actions">
        <button className="btn" onClick={save}>Keep a copy</button>
        <button className="btn" onClick={() => input.current?.click()}>Open a saved copy</button>
        <input
          ref={input}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={(e) => open(e.target.files?.[0])}
        />
      </div>
      {msg && <p className="small muted" style={{ marginBottom: 0 }}>{msg}</p>}
      <p className="small muted" style={{ marginBottom: 0 }}>
        The file stays on your computer. Nothing is sent anywhere.
      </p>
    </div>
  );
}

/* --------------------------------------------------------------- components */

/**
 * Predicted against observed.
 *
 * The verdict line matters as much as the two boxes. A MATCH must not read as
 * "correct, you may stop" — one agreement is not evidence, and the course spends
 * three lessons making that point. And a mismatch is never "Wrong": the charter
 * allows only *you predicted X, the experiment produced Y*.
 *
 * NOT to be used for the `.then-now` panels in E2 and E3. Those show what the
 * student believed at the start against what they believe now — a change of
 * mind, with no experiment in between. A verdict line there would be a lie
 * about where the second column came from.
 */
export function Contrast({
  predicted, observed, predictedLabel, observedLabel,
}: { predicted?: string; observed?: string; predictedLabel: string; observedLabel: string }) {
  /**
   * THREE outcomes, not two.
   *
   * Several screens offer "I cannot say" as a prediction, and the course means
   * it: refusing to guess is a legitimate answer, not a wrong one. Pass
   * `predicted={undefined}` in that case. Scoring it as a mismatch — "that is
   * not what you expected" — would be false, and it would teach the student
   * that saying *I don't know* is punished. That is the opposite of the lesson.
   */
  const open = predicted === undefined;
  const agree = !open && predicted === observed;
  return (
    <div className={`contrast ${open ? 'open' : agree ? 'agree' : 'mismatch'}`}>
      <div className="side">
        <span className="lab">You predicted</span>
        <strong>{predictedLabel}</strong>
      </div>
      <div className="vs">and then</div>
      <div className="side">
        <span className="lab">The experiment produced</span>
        <strong>{observedLabel}</strong>
      </div>
      <p className="verdict">
        {open
          ? 'You said you could not tell, so there is nothing to compare. Now you have a result. What would you predict next time?'
          : agree
            ? 'That matches what you expected. One match is not enough to stop. Keep going.'
            : 'That is not what you expected. Something needs explaining.'}
      </p>
    </div>
  );
}

/**
 * A soft prerequisite notice.
 *
 * Tells the student what they are missing and lets them continue anyway. A hard
 * gate would be worse: a student sent by a teacher, or arriving from a link, is
 * not helped by a locked door, and the earned-models list is only a record of
 * what happened in THIS tab.
 */
export function PrereqNote({
  needs, label, href,
}: { needs: string; label: string; href: string }) {
  if (earnedModels().includes(needs)) return null;
  return (
    <div className="card quiet">
      <p style={{ margin: 0 }}>
        This one works best after <a href={href}>{label}</a>, which is where the ideas it leans on
        come from. You can carry on without it.
      </p>
    </div>
  );
}
