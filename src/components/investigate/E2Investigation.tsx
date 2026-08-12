/**
 * E2 — What decides how hard two charges push? Student investigation runtime.
 *
 * Design source: docs/LESSON_E2_what-decides-the-push.md and
 * docs/LESSON_E2_AMENDMENTS.md (seven authority rulings, blockers B1–B3).
 * This file is the student-facing path only — not the design record.
 *
 * Prose ported verbatim from the static tree. It has been corrected repeatedly
 * against real defects and the corrections are load-bearing:
 *   · the observe screen must not print the predicted fractions;
 *   · P1 and P3 are declared as reasoning, not measurement, because the
 *     apparatus genuinely cannot perform them (template §B);
 *   · the entry screen tells the student, in their own words, that nobody has
 *     built this apparatus yet (blocker B3).
 *
 * No equations here — AGENTS.md hard rule 1. Every number comes from
 * src/physics/coulomb-force/model.ts.
 */

import { useCallback, useEffect, useState } from 'react';
import { predicted } from '../../physics/coulomb-force/model';
import DevJump from './DevJump';
import {
  ChargingFigure,
  ConductionFigure,
  HalvingFigure,
  LawChart,
  NullTestFigure,
  PairFigure,
  ProductFigure,
  SequenceFigure,
} from './scenes/E2Scenes';

type P1 = 'half' | 'quarter' | 'eighth' | 'same';
type P2 = 'big' | 'small' | 'equal';
type P3 = 'same' | 'twice' | 'four' | 'other';
type J1 = 'A' | 'B';
type J2 = 'bigout' | 'smallout' | 'same';

/**
 * The closing ledger, as a judgment rather than a summary.
 *
 * It used to tell the student what they had established. That is backwards: the
 * student did the work, so the student should classify it, and only then see
 * whether they agree with us.
 *
 * DESIGN CONSTRAINTS, each of which was arrived at the hard way:
 *
 *  · THREE bins, not four. A fourth ("supported but not established" as distinct
 *    from "not determined") asks for a distinction E2 never draws. These three
 *    are the distinction J1 taught, reused.
 *
 *  · FOUR claims, not six. A six-item sort at the very end, after the bench, is
 *    something a tired student clicks through — which converts a passive screen
 *    into a pseudo-active one, worse because it looks like engagement.
 *
 *  · EVERY claim is in E2's existing vocabulary. An earlier draft included "the
 *    constant k was measured". E2 never introduces k — §9 says the constant is
 *    missing on purpose — so that card would have introduced k in order to sort
 *    it. The interaction must be built from the lesson's vocabulary, never add
 *    vocabulary for the interaction's sake.
 *
 *  · The claims form TWO PAIRS. Within each pair the physics is the same and the
 *    epistemic status differs, which is the whole point:
 *      – falloff steeper than proportional (established) vs exactly inverse
 *        square (from elsewhere);
 *      – equal and opposite forces (established) vs the product form (fits, but
 *        not established).
 *    A student who sorts both members of a pair into the same bin has missed J1.
 *
 *  · Placing a card correctly is not the outcome. The REASONING is, so each
 *    reveal carries the argument the student should be able to give.
 */
type Bin = 'mine' | 'fits' | 'elsewhere';

export const BINS: { id: Bin; label: string }[] = [
  { id: 'mine', label: 'My experiment established this' },
  { id: 'fits', label: 'My measurements fit this, but did not establish it' },
  // Not "came from somewhere else" — that could mean "a teacher told me".
  // The distinction E2 wants is independent evidence.
  { id: 'elsewhere', label: 'Established by other evidence' },
];

export const CLAIMS: { id: string; text: string; answer: Bin; why: string }[] = [
  {
    id: 'equal',
    text: 'Each ball feels the same size of push, however unequal the charges.',
    answer: 'mine',
    why: 'You hung a lopsided pair and both threads made the same angle. Equal angles on equal weights means equal forces — you watched it, and nothing else was needed.',
  },
  {
    id: 'product',
    text: 'The push depends on the two charges multiplied together.',
    answer: 'fits',
    why: 'The lopsided pair and the balanced pair hung at the same separation, which fits the product. But you compared four charge states along one line and one arrangement off it — and “fits everything I tried” is not “is the law”. That is the same distinction you drew for the exponent in J1, and it applies here too.',
  },
  {
    id: 'steeper',
    text: 'The push falls off with distance faster than simple proportion.',
    answer: 'mine',
    why: 'The 1/r tick was never close to your measurement. Whatever else stayed open, your own halvings ruled out “half as strong”.',
  },
  {
    id: 'square',
    text: 'The push falls off as one over the distance squared.',
    answer: 'elsewhere',
    why: 'Your measurement could not cleanly separate square from cube — that was J1. Priestley argued it from a null result, and Cavendish bounded the exponent to within one part in fifty of 2 by measuring something that was supposed to be, and was, exactly zero.',
  },
];

type Step =
  | 'entry' | 'encounter'
  | 'predict1' | 'predict2' | 'predict3'
  | 'conduction' | 'method' | 'spares'
  | 'observe' | 'compare'
  | 'judge1' | 'explore'
  | 'judge2' | 'model' | 'recall1' | 'recall3' | 'history' | 'ledger'
  | 'coulomb';

/** The spine. `coulomb` is deliberately absent — it is optional, and must not
 *  count against "screen N of M". */
const STEPS: Step[] = [
  'entry', 'encounter',
  'predict1', 'predict2', 'predict3',
  'conduction', 'method', 'spares',
  'observe', 'compare',
  'judge1', 'explore',
  'judge2', 'model', 'recall1', 'recall3', 'history', 'ledger',
];

/**
 * Template §B — performability, declared per screen rather than inferred.
 * A crude imperative-detector produces false positives; a declaration can be
 * wrong, but it is wrong visibly.
 */
export const BENCH_ACTIONS: Record<Step, 'none' | 'performable' | 'deferred'> = {
  entry: 'none',
  encounter: 'none',
  predict1: 'deferred',
  predict2: 'deferred',
  predict3: 'deferred',
  conduction: 'performable',
  method: 'performable',
  spares: 'performable',
  observe: 'performable',
  compare: 'none',
  judge1: 'none',
  explore: 'none',
  judge2: 'performable',
  model: 'none',
  recall1: 'none',
  recall3: 'none',
  history: 'none',
  ledger: 'none',
  coulomb: 'none',
};

interface RunState {
  step: Step;
  p1?: P1; p1why: string; p1locked: boolean;
  p2?: P2; p2locked: boolean;
  p3?: P3; p3locked: boolean;
  r0: string; r1: string; r2: string; r3: string;
  j1?: J1; j1locked: boolean;
  j2?: J2; j2locked: boolean;
  sort: Record<string, Bin>; sortLocked: boolean;
  /** Active recall of P1 and P3, derived from the relation rather than told. */
  recall1?: P1; recall1locked: boolean;
  recall3?: P3; recall3locked: boolean;
}

const STORAGE_KEY = 'openvidya-e2-run-v1';
const MODEL_KEY = 'openvidya-models-earned';

function defaultRun(): RunState {
  return {
    step: 'entry',
    p1why: '', p1locked: false,
    p2locked: false,
    p3locked: false,
    r0: '', r1: '', r2: '', r3: '',
    j1locked: false,
    j2locked: false,
    sort: {},
    sortLocked: false,
    recall1locked: false,
    recall3locked: false,
  };
}

function loadRun(): RunState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...defaultRun(), ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultRun();
}

function earnModel(id: string) {
  try {
    const raw = localStorage.getItem(MODEL_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(id)) localStorage.setItem(MODEL_KEY, JSON.stringify([...list, id]));
  } catch { /* ignore */ }
}

const num = (v: string): number | null => {
  const x = parseFloat(v);
  return Number.isFinite(x) && x > 0 ? x : null;
};

/** How many halvings the student has actually recorded, contiguously. */
function recordedK(r: RunState): number {
  const vals = [r.r0, r.r1, r.r2, r.r3];
  if (!num(vals[0])) return 0;
  let k = 0;
  for (let i = 1; i < 4; i++) {
    if (num(vals[i])) k = i;
    else break;
  }
  return k;
}

function ratioAt(r: RunState, k: number): number | null {
  const a = num(r.r0);
  const b = num([r.r0, r.r1, r.r2, r.r3][k]);
  return a && b ? b / a : null;
}

const P1_LABEL: Record<P1, string> = {
  half: 'Half as strong', quarter: 'A quarter', eighth: 'An eighth', same: 'No change',
};
const P2_LABEL: Record<P2, string> = {
  big: 'The bigger charge pushes harder',
  small: 'The smaller charge pushes harder',
  equal: 'They push each other equally hard',
};
const P3_LABEL: Record<P3, string> = {
  same: 'unchanged', twice: 'twice as strong', four: 'four times as strong', other: 'something else',
};

/* ------------------------------------------------------------------ widgets */

function Rail({ step }: { step: Step }) {
  const i = STEPS.indexOf(step);
  const stage =
    i <= 1 ? 'question' : i <= 4 ? 'predict' : i <= 9 ? 'observe' : i <= 12 ? 'judge' : 'model';
  const order = ['question', 'predict', 'observe', 'judge', 'model'] as const;
  const labels = { question: 'Question', predict: 'Predict', observe: 'Observe', judge: 'Judge', model: 'Model' };
  const idx = order.indexOf(stage as (typeof order)[number]);
  return (
    <ul className="ep-strip" aria-label="Where you are in the investigation">
      {order.map((s, n) => (
        <li key={s} className={n < idx ? 'done' : n === idx ? 'now' : ''}>{labels[s]}</li>
      ))}
    </ul>
  );
}

function Choices<T extends string>({
  options, value, locked, onPick,
}: {
  options: { id: T; label: string }[];
  value?: T;
  locked: boolean;
  onPick: (v: T) => void;
}) {
  return (
    <div className="choices" role="radiogroup">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          disabled={locked}
          className={`choice ${value === o.id ? 'on' : ''}`}
          onClick={() => onPick(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Locked({ label, value, note }: { label: string; value?: string; note?: string }) {
  return (
    <div className="locked-note">
      <span className="lab">{label}</span>
      <strong>{value ?? 'not recorded'}</strong>
      {note && <span className="small muted"> {note}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------- screens */

export default function E2Investigation() {
  const [run, setRun] = useState<RunState>(defaultRun);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setRun(loadRun()); setHydrated(true); }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(run)); } catch { /* ignore */ }
  }, [run, hydrated]);

  const go = useCallback((step: Step) => {
    setRun((r) => ({ ...r, step }));
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const set = useCallback(<K extends keyof RunState>(k: K, v: RunState[K]) => {
    setRun((r) => ({ ...r, [k]: v }));
  }, []);

  const k = recordedK(run);
  const step = run.step;

  const Next = ({ to, label, enabled = true }: { to: Step; label: string; enabled?: boolean }) => (
    <button className="btn primary" disabled={!enabled} onClick={() => go(to)}>{label}</button>
  );
  const Back = ({ to }: { to: Step }) => (
    <button className="btn ghost" onClick={() => go(to)}>Back</button>
  );

  const body = () => {
    switch (step) {
      /* ------------------------------------------------------------- entry */
      case 'entry':
        return (
          <>
            <p className="kicker">Investigation E2 · Electricity</p>
            <h1>What decides how hard two charges push?</h1>
            <p className="lead">
              E1 showed you <em>that</em> charges push and pull. This one asks what decides{' '}
              <em>how hard</em> — and ends somewhere you may not expect.
            </p>
            <div className="card warn">
              <p style={{ marginTop: 0 }}>
                <strong>This one needs equipment.</strong> E1 needed two balloons. This needs a bench
                setup, and the page cannot do it for you.
              </p>
              <p style={{ marginBottom: 0 }}>
                What this page <em>is</em>: your lab notebook. It holds your predictions so you cannot
                quietly revise them, and it does the arithmetic on your measurements. Every number in
                it will be one you measured.
              </p>
            </div>
            <div className="card quiet">
              <h3 style={{ marginTop: 0 }}>You will need</h3>
              <ul>
                <li><strong>Eight identical metal-coated balls, 20 mm across.</strong> Two to hang, six spare. Weigh them; they must match within about 5%.</li>
                <li><strong>Thread, 30 cm</strong>, both pieces the same length, hung from one point.</li>
                <li><strong>A millimetre ruler.</strong></li>
                <li><strong>A plastic rod and a piece of wool</strong> — a PVC pipe, a plastic ruler or a comb, rubbed hard. Dry hair works too.</li>
                <li>A dry day. Damp air drains the charge away while you are still measuring.</li>
              </ul>
              <p className="small muted" style={{ marginBottom: 0 }}>
                <strong>One setup rule that matters more than it looks:</strong> the starting
                separation must be no more than <strong>0.68 × the thread length</strong> — about
                20 cm on 30 cm threads. Beyond that the arithmetic this page does stops being accurate
                enough to answer the question. You will see why at the end.
              </p>
            </div>
            <div className="card warn">
              <p style={{ marginTop: 0 }}><strong>Something you are entitled to know before you start.</strong></p>
              <p style={{ marginBottom: 0 }}>
                Nobody has built this apparatus yet. The separations this page predicts come from the
                physics, not from anyone having stood at a bench and measured them. We think it will
                work; we have not watched it work. If you build it, the most useful thing you can send
                back is not whether you got the “right” answer — it is <em>how long the balls took to
                stop swinging, and how fast the charge drained away while you waited</em>. If those two
                times turn out to be similar, this experiment cannot be done as described, and we would
                rather find that out from you than pretend otherwise.
              </p>
            </div>
            <p className="small muted">Your predictions lock once you commit them.</p>
            <div className="actions"><Next to="encounter" label="Begin" /></div>
          </>
        );

      /* --------------------------------------------------------- encounter */
      case 'encounter':
        return (
          <>
            <p className="kicker">The question</p>
            <h2 style={{ marginTop: '.2rem' }}>Two charged balls, hanging apart.</h2>
            <PairFigure showRule caption="they settle where the push balances their weight" />
            <p className="small muted">
              Getting charge onto them takes a rod and a knack, and you will be shown exactly how
              before you need to do it. For now, just look at what happens once they are charged.
            </p>
            <p>They stop somewhere. Not touching, not flying off — a particular gap, and the same gap every time you set it up the same way.</p>
            <p><strong>That gap is a measurement.</strong> A bigger push holds them further apart, so the separation tells you about the force without your ever having to feel it.</p>
            <div className="card accent">
              <p style={{ marginTop: 0 }}>Two things to be clear about before you start, because between them they decide what you can and cannot do.</p>
              <p style={{ margin: '0 0 .5rem' }}><strong>You do not get to choose the separation.</strong> It is set by the charge, the weight and the thread. It is the reading, not the dial.</p>
              <p style={{ margin: 0 }}><strong>And you cannot pick the balls up and move them.</strong> Your hand would take the charge with it, and there would be nothing left to measure. Everything in this investigation has to be done without ever touching a charged ball with your fingers.</p>
            </div>
            <div className="actions"><Back to="entry" /><Next to="predict1" label="Make my predictions" /></div>
          </>
        );

      /* ---------------------------------------------------------- predict1 */
      case 'predict1':
        return (
          <>
            <p className="kicker">Prediction 1 of 3 · <span className="ptag reason">reasoning — the apparatus cannot test this</span></p>
            <h2 style={{ marginTop: '.2rem' }}>If the two were twice as far apart, how hard would they push?</h2>
            <p>Same charges on them. Just further away from each other.</p>
            <div className="card quiet">
              <p className="small" style={{ marginTop: 0 }}><strong>You are not about to go and do this, and it is worth saying why.</strong></p>
              <p className="small" style={{ margin: '0 0 .5rem' }}>
                You would have to hold them apart, which means touching them, which means the charge
                leaves down your arm. And even then you could not feel the push — it is far too small
                for that. Nothing about this force is available to your hands.
              </p>
              <p className="small" style={{ margin: 0 }}>
                But this is the question the whole investigation is built to answer. You will get at it
                sideways, by a route that never requires you to touch anything or feel anything. Commit
                to an answer now, while it is still a guess.
              </p>
            </div>
            <Choices
              options={[
                { id: 'half' as P1, label: 'Half as strong' },
                { id: 'quarter' as P1, label: 'A quarter as strong' },
                { id: 'eighth' as P1, label: 'An eighth as strong' },
                { id: 'same' as P1, label: 'No change — distance does not matter' },
              ]}
              value={run.p1}
              locked={run.p1locked}
              onPick={(v) => set('p1', v)}
            />
            <p className="small muted" style={{ marginBottom: '.3rem' }}>Why do you think so? One sentence.</p>
            <textarea
              value={run.p1why}
              disabled={run.p1locked}
              placeholder="Because…"
              onChange={(e) => set('p1why', e.target.value)}
            />
            {run.p1locked ? (
              <>
                <Locked label="Locked prediction" value={run.p1 && P1_LABEL[run.p1]} note="This cannot be changed now." />
                <div className="actions"><Next to="predict2" label="Next prediction" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.p1} onClick={() => set('p1locked', true)}>Commit this prediction</button>
                <span className="small muted">Locks permanently.</span>
              </div>
            )}
          </>
        );

      /* ---------------------------------------------------------- predict2 */
      case 'predict2':
        return (
          <>
            <p className="kicker">Prediction 2 of 3 · <span className="ptag test">you will test this one</span></p>
            <h2 style={{ marginTop: '.2rem' }}>One ball carries far more charge than the other.</h2>
            <p>Not a little more — say four times as much. They are the same size and the same weight; only the charge differs.</p>
            <p><strong>Which one pushes harder on the other?</strong></p>
            <div className="card quiet">
              <p className="small" style={{ marginTop: 0 }}><strong>This one you really will test — but not yet.</strong></p>
              <p className="small" style={{ margin: '0 0 .4rem' }}>
                You cannot feel a push, so it will be settled by looking: hang the two and compare the
                thread angles. The weights are equal, so whichever ball is being pushed harder has to
                swing further out. <strong>The angle is the reading.</strong>
              </p>
              <p className="small" style={{ margin: 0 }}>
                What you do not have yet is any way to put <em>different</em> amounts of charge on two
                balls. That comes later, and it turns out to be the same trick the whole experiment runs
                on — so it would spoil things to hand it over now. Commit your answer; you will come
                back and check it near the end.
              </p>
            </div>
            <Choices
              options={[
                { id: 'big' as P2, label: 'The one with more charge pushes harder' },
                { id: 'small' as P2, label: 'The one with less charge pushes harder' },
                { id: 'equal' as P2, label: 'They push each other equally hard' },
              ]}
              value={run.p2}
              locked={run.p2locked}
              onPick={(v) => set('p2', v)}
            />
            {run.p2locked ? (
              <>
                <Locked label="Locked prediction" value={run.p2 && P2_LABEL[run.p2]} />
                <div className="actions"><Next to="predict3" label="Next prediction" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.p2} onClick={() => set('p2locked', true)}>Commit this prediction</button>
              </div>
            )}
          </>
        );

      /* ---------------------------------------------------------- predict3 */
      case 'predict3':
        return (
          <>
            <p className="kicker">Prediction 3 of 3 · <span className="ptag reason">reasoning — the apparatus cannot test this</span></p>
            <h2 style={{ marginTop: '.2rem' }}>Now double the charge on <em>both</em> balls at once.</h2>
            <p>Both of them, twice as much charge, and imagine you could hold the separation fixed while you did it. What happens to the push?</p>
            <Choices
              options={[
                { id: 'same' as P3, label: 'Unchanged' },
                { id: 'twice' as P3, label: 'Twice as strong' },
                { id: 'four' as P3, label: 'Four times as strong' },
                { id: 'other' as P3, label: 'Something else' },
              ]}
              value={run.p3}
              locked={run.p3locked}
              onPick={(v) => set('p3', v)}
            />
            <div className="card quiet">
              <p className="small" style={{ marginTop: 0 }}><strong>Why “imagine”.</strong> Two separate reasons, and the second is the interesting one.</p>
              <p className="small" style={{ margin: '0 0 .5rem' }}>
                First, the separation is a reading, not a dial — change the charges and the balls move,
                so “everything else the same” never happens.
              </p>
              <p className="small" style={{ margin: 0 }}>
                <strong>Second, and worse: you cannot double the charge at all.</strong> The only tool
                you have for changing it is letting two identical balls touch, and that always leaves
                each with the <em>average</em> of what they had. An average never exceeds the larger of
                the two numbers. So contact can halve, and thirds, and quarters — but there is no move
                on this bench that multiplies. Doubling would need a supply of charge the apparatus does
                not have.
              </p>
              <p className="small" style={{ margin: '.5rem 0 0' }}>
                So this one is not like the first prediction. That one you cannot <em>perform</em>, but
                the measurement gets at it anyway. This one the apparatus cannot reach at all, and it
                gets settled at the end by reasoning from what the measurements do establish. It is not
                a measurement you are about to make, and this page will not pretend otherwise.
              </p>
            </div>
            {run.p3locked ? (
              <>
                <Locked label="Locked prediction" value={run.p3 && P3_LABEL[run.p3]} />
                <div className="actions"><Next to="conduction" label="To the bench" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.p3} onClick={() => set('p3locked', true)}>Commit this prediction</button>
              </div>
            )}
          </>
        );

      /* -------------------------------------------------------- conduction */
      case 'conduction':
        return (
          <>
            <p className="kicker">Before you can measure</p>
            <h2 style={{ marginTop: '.2rem' }}>Does charge stay where you put it?</h2>
            <p>In E1 you rubbed a balloon in one place and it worked. Metal is not like that, and the difference is what makes the rest of this investigation possible.</p>
            <ConductionFigure />
            <p>Touch a charged metal ball once, anywhere, and it loses everything — the pair drops straight down. Touch one patch of a rubbed balloon and the rest carries on attracting.</p>
            <div className="card accent">
              <p style={{ marginTop: 0 }}><strong>In metal, charge moves freely. In rubber it does not.</strong></p>
              <p style={{ marginBottom: 0 }}>
                Which gives you an instrument. Touch a charged metal ball to an identical uncharged one.
                The two are the same size, the same metal, in the same situation — so there is nothing
                to make the charge prefer one over the other. It ends up <strong>split equally</strong>.
                Each carries half.
              </p>
            </div>
            <div className="card warn">
              <p style={{ margin: 0 }}>
                <strong>Being straight with you about that last step.</strong> The equal split is a{' '}
                <em>symmetry argument</em>, not something you have measured. Nothing you do today tests
                it — and it turns out nothing you <em>could</em> do with this apparatus would test it
                either. We are asking you to take it, and telling you that we are.
              </p>
            </div>
            <div className="actions"><Back to="predict3" /><Next to="method" label="How the measurement works" /></div>
          </>
        );

      /* ------------------------------------------------------------ method */
      case 'method':
        return (
          <>
            <p className="kicker">The method</p>
            <h2 style={{ marginTop: '.2rem' }}>First, getting charge onto them.</h2>
            <p>Rub a plastic rod hard on wool or dry hair — a PVC pipe, a plastic ruler, a comb. Then stroke it across the two balls, several times. A few passes are worth more than one.</p>
            <ChargingFigure />
            <p>
              <strong>Do it while they are still touching.</strong> Uncharged, the two hang straight
              down — against each other. So charge arriving finds two identical balls in contact: the
              situation you just met, with the same answer. They share it evenly, push apart, and
              separating breaks the contact, which fixes the split.
            </p>
            <div className="card accent">
              <p style={{ marginTop: 0 }}><strong>You will never find out how much charge you put on. You do not need to.</strong></p>
              <p style={{ marginBottom: 0 }}>
                Every number here is a <em>ratio</em> — one separation compared with the one before it.
                Rub the rod twice as hard and both grow together; the ratio does not move. A measurement
                that does not depend on a quantity you cannot control is a much better measurement than
                one that does.
              </p>
            </div>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}><strong>Three different “the same” — worth keeping apart.</strong></p>
              <table className="results">
                <tbody>
                  <tr><td>The two balls must have <strong>the same mass</strong></td><td>required</td></tr>
                  <tr><td>Contact must split charge <strong>into two equal halves</strong></td><td>required</td></tr>
                  <tr><td>The two balls must start with <strong>the same amount of charge</strong></td><td>not required</td></tr>
                </tbody>
              </table>
              <p style={{ marginBottom: 0 }}>
                The last one surprises people. Halving <em>both</em> divides the product of the two
                charges by four every round, whatever the two started at — so every ratio comes out the
                same either way. The first two you cannot do without.
              </p>
            </div>
            <h2>Now: you cannot move them, so change the charge instead.</h2>
            <p>The separation is a reading. But the <em>charge</em> is something you can change, and now you know how: touch each hanging ball with a fresh uncharged sphere, and it keeps half.</p>
            <HalvingFigure />
            <p><strong>Both balls, every round</strong>, each with its own <em>uncharged</em> sphere. A spare that has just been used is carrying half of what it took; put it straight back and it averages two charged balls instead of halving one.</p>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}><strong>You can reuse a spare — reset it first.</strong></p>
              <p style={{ marginBottom: 0 }}>
                Touch it properly with your hand. You saw a moment ago what that does to a charged piece
                of metal: it loses the lot. Then put it back through the spare-check below before it goes
                near the experiment again. The method only ever needs two clean spares at once — six
                means you are rarely waiting for one, and the later parts of the investigation need
                spares too.
              </p>
            </div>
            <div className="actions"><Back to="conduction" /><Next to="spares" label="One thing left to check" /></div>
          </>
        );

      /* ------------------------------------------------------------ spares */
      case 'spares':
        return (
          <>
            <p className="kicker">The method · trusting a spare</p>
            <h2 style={{ marginTop: '.2rem' }}>How do you know a spare is really uncharged?</h2>
            <p>Everything above rests on the fresh sphere being clean. One that has picked up a little charge from your hands does not halve — it does something else, and it does it invisibly.</p>
            <p>You can find out using nothing but the apparatus already in front of you:</p>
            <NullTestFigure />
            <p>Bring the spare to <strong>5 cm from the nearer ball, on the line joining the two, outside the pair</strong>. Watch the separation. Take it away. If it moved by more than about 2 mm while the spare was there, that spare is not clean enough.</p>
            <div className="card warn">
              <p style={{ marginTop: 0 }}><strong>Where you hold it decides whether the test works at all.</strong></p>
              <NullTestFigure wrong />
              <p style={{ marginBottom: 0 }}>
                Held below the pair, or off to one side, the push is sideways rather than along the gap.
                The balls swing together instead of apart, the separation barely changes, and{' '}
                <strong>every spare passes — including one that is nowhere near clean</strong>. A test
                that always says yes is not a test.
              </p>
            </div>
            <div className="actions"><Back to="method" /><Next to="observe" label="Record my measurements" /></div>
          </>
        );

      /* ----------------------------------------------------------- observe */
      case 'observe': {
        const rows: [keyof RunState, string, string][] = [
          ['r0', 'Starting separation', 'before any halving'],
          ['r1', 'After 1 round', 'both balls halved once'],
          ['r2', 'After 2 rounds', 'stop here if it is getting hard to read'],
          ['r3', 'After 3 rounds', 'only if the reading is still trustworthy'],
        ];
        return (
          <>
            <p className="kicker">Observation</p>
            <h2 style={{ marginTop: '.2rem' }}>Measure, halve, measure again.</h2>
            {/* Fractions withheld on purpose — see the scenes file header. */}
            <SequenceFigure />
            <p className="small muted" style={{ marginTop: '-.6rem' }}>
              Each round brings them closer together. How much closer is exactly what you are about to find out.
            </p>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}><strong>Reading the gap.</strong> Four things, and every one of them has caught somebody out.</p>
              <ul style={{ marginBottom: 0 }}>
                <li>Hold the ruler <strong>behind</strong> the balls. Never touching — a ruler against a charged ball is a hand against a charged ball.</li>
                <li>Measure <strong>centre to centre</strong>, and look straight on. From an angle you will read a gap that is not there.</li>
                <li>Wait for the swinging to stop, but not longer. A moving ball has not finished telling you where it sits.</li>
                <li>Then read it <strong>quickly</strong>. Charge leaks the whole time you are standing there, so a slow measurement is an accurate measurement of something that has already changed.</li>
              </ul>
            </div>
            <div className="datasheet">
              {rows.map(([key, lab, hint]) => (
                <div className="datarow" key={key as string}>
                  <label htmlFor={`in-${key as string}`}>{lab}</label>
                  <input
                    id={`in-${key as string}`}
                    type="number"
                    inputMode="decimal"
                    min={1}
                    step={0.5}
                    placeholder="mm"
                    value={run[key] as string}
                    onChange={(e) => set(key, e.target.value as RunState[typeof key])}
                  />
                  <span className="unit">mm</span>
                  <span className="hint">{hint}</span>
                </div>
              ))}
            </div>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}><strong>When to stop is your decision, and it is a real one.</strong></p>
              <p style={{ marginBottom: 0 }}>
                Each round separates the possible answers further apart — so more rounds means a sharper
                test. Each round also loses a little charge, and the balls end up close enough that a
                millimetre of ruler error matters more. Somewhere those cross. Deciding where is the
                experiment.
              </p>
            </div>
            {num(run.r0) && k >= 1 && (
              <p className="small muted">Recorded: {k + 1} separations, {k} halving{k > 1 ? 's' : ''}.</p>
            )}
            <div className="actions">
              <Back to="spares" />
              <Next to="compare" label="See what my data says" enabled={!!(num(run.r0) && k >= 1)} />
            </div>
          </>
        );
      }

      /* ----------------------------------------------------------- compare */
      case 'compare': {
        if (k < 1) {
          return (
            <>
              <p className="kicker">Comparison</p>
              <h2>No measurements yet.</h2>
              <p>Go back and record at least a starting separation and one halving.</p>
              <div className="actions"><Back to="observe" /></div>
            </>
          );
        }
        const m = ratioAt(run, k)!;
        return (
          <>
            <p className="kicker">Comparison</p>
            <h2 style={{ marginTop: '.2rem' }}>Your {k} halving{k > 1 ? 's' : ''}, against the three candidates.</h2>
            <table className="results">
              <tbody>
                <tr><td>Starting separation</td><td>{num(run.r0)!.toFixed(1)} mm</td></tr>
                <tr><td>After {k} halving{k > 1 ? 's' : ''}</td><td>{num([run.r0, run.r1, run.r2, run.r3][k])!.toFixed(1)} mm</td></tr>
                <tr><td>Ratio</td><td>{m.toFixed(3)}</td></tr>
              </tbody>
            </table>
            <LawChart k={k} measured={m} />
            <p>Each tick is what one of the three laws predicts your ratio would be, if that law were the right one. Your measurement is the arrow.</p>
            <p className="small muted">Nothing on this page decided anything. Those three numbers come from the geometry of hanging threads; yours came off your ruler.</p>
            <div className="actions"><Back to="observe" /><Next to="judge1" label="Now judge it" /></div>
          </>
        );
      }

      /* ------------------------------------------------------------ judge1 */
      case 'judge1': {
        const kk = Math.max(1, k);
        const gap = ((predicted(3, kk) - predicted(2, kk)) * 100).toFixed(1);
        return (
          <>
            <p className="kicker">Judgment</p>
            <h2 style={{ marginTop: '.2rem' }}>Two students look at that chart.</h2>
            <div className="models">
              <button
                type="button"
                className={`model-card ${run.j1 === 'A' ? 'on' : ''}`}
                aria-pressed={run.j1 === 'A'}
                disabled={run.j1locked}
                onClick={() => set('j1', 'A')}
              >
                <span className="tag">Student A</span>
                <p>“It landed nearest the inverse-square tick. So the force goes as one over distance squared. Done.”</p>
              </button>
              <button
                type="button"
                className={`model-card ${run.j1 === 'B' ? 'on' : ''}`}
                aria-pressed={run.j1 === 'B'}
                disabled={run.j1locked}
                onClick={() => set('j1', 'B')}
              >
                <span className="tag">Student B</span>
                <p>
                  “Nearest is not the same as established. Those two ticks are only {gap} points apart.
                  My ruler, my leaking charge and my not-quite-clean spares could easily be worth that
                  much. I do not think this measurement can separate them.”
                </p>
              </button>
            </div>
            <p className="small muted">Which student is being more careful?</p>
            {run.j1locked ? (
              <>
                <div className={`card ${run.j1 === 'B' ? 'accent' : 'warn'}`}>
                  {run.j1 === 'B' ? (
                    <>
                      <p style={{ marginTop: 0 }}>
                        <strong>B, and this is the point of the investigation.</strong> “My data cannot
                        settle this” is a real scientific conclusion. It is not what you say when the
                        experiment failed — it is what you say when you have understood what your
                        measurement is worth.
                      </p>
                      <p style={{ marginBottom: 0 }}>A student who lands on the right exponent by luck has done worse physics than one who says they cannot tell and can say why.</p>
                    </>
                  ) : (
                    <>
                      <p style={{ marginTop: 0 }}>
                        <strong>Look at the size of that gap again.</strong> The two ticks are {gap}{' '}
                        points apart. Now think about your own run: how accurately did you read the
                        ruler, how long did the charge sit there leaking, how sure are you the spares
                        were clean?
                      </p>
                      <p style={{ marginBottom: 0 }}>
                        If those could add up to more than the gap, then landing nearer one tick than the
                        other has not told you which law is right. You cannot change your answer now —
                        but you can see it.
                      </p>
                    </>
                  )}
                </div>
                <div className="actions"><Next to="explore" label="So what would settle it?" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.j1} onClick={() => set('j1locked', true)}>Commit my judgment</button>
              </div>
            )}
          </>
        );
      }

      /* ----------------------------------------------------------- explore */
      case 'explore': {
        const r0 = num(run.r0) ?? 200;
        return (
          <>
            <p className="kicker">After the judgment, not before</p>
            <h2 style={{ marginTop: '.2rem' }}>What would it take to tell them apart?</h2>
            <div className="computed">
              <p className="computed-flag">
                ▲ Everything below this line is <strong>computed</strong>, not measured. It is the two
                laws worked out on paper, using your starting separation of {r0.toFixed(0)} mm. It is not
                evidence for anything — it is a way of looking at the limit you just ran into.
              </p>
              <table className="results">
                <thead>
                  <tr><th>rounds</th><th>if 1/r²</th><th>if 1/r³</th><th>gap between them</th><th /></tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map((n) => {
                    const sq = predicted(2, n);
                    const cu = predicted(3, n);
                    return (
                      <tr key={n} className={n === k ? 'yours' : undefined}>
                        <td>{n}</td>
                        <td>{(sq * r0).toFixed(1)} mm</td>
                        <td>{(cu * r0).toFixed(1)} mm</td>
                        <td><strong>{((cu - sq) * r0).toFixed(1)} mm</strong></td>
                        <td className="small muted">{n === k ? 'you stopped here' : ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p style={{ marginBottom: 0 }}>
                The gap widens every round. So the answer to “how do I tell?” is partly <em>keep going</em>{' '}
                — except that each round also costs you charge, and the separations shrink toward the size
                of the balls themselves, where a ruler stops meaning much. That trade-off is not a flaw in
                your apparatus. It <strong>is</strong> your apparatus.
              </p>
            </div>
            <p>
              There is another way out, and it is worth holding on to: instead of measuring a difference
              more and more carefully, find a situation where the right answer is <strong>nothing at
              all</strong>. You already used one today — the spare-sphere check. Nothing moved, and that
              told you more than a careful reading would have.
            </p>
            <div className="actions"><Next to="judge2" label="Back to the bench — one more thing" /></div>
          </>
        );
      }

      /* ------------------------------------------------------------ judge2 */
      case 'judge2':
        return (
          <>
            <p className="kicker">Judgment, second part</p>
            <h2 style={{ marginTop: '.2rem' }}>The lopsided pair.</h2>
            <p>Halve one ball twice and leave the other alone. Now one carries four times the charge of the other. Your locked prediction said:</p>
            <Locked label="Your prediction" value={run.p2 ? P2_LABEL[run.p2] : undefined} />
            <p><strong>Hang them and look at the two threads.</strong> The balls weigh the same, so whichever is pushed harder must hang further out. What do you see?</p>
            <Choices
              options={[
                { id: 'bigout' as J2, label: 'The heavily charged ball hangs further out' },
                { id: 'smallout' as J2, label: 'The lightly charged ball hangs further out' },
                { id: 'same' as J2, label: 'Both threads make the same angle' },
              ]}
              value={run.j2}
              locked={run.j2locked}
              onPick={(v) => set('j2', v)}
            />
            {run.j2locked ? (
              <>
                <div className="card accent">
                  <p style={{ marginTop: 0 }}>
                    {run.j2 === 'same' ? (
                      <strong>The same angle — so the same force on each.</strong>
                    ) : (
                      <>
                        <strong>Worth checking your masses.</strong> Equal angles is what equal forces
                        look like on this apparatus, and equal forces is what happens here. If one hangs
                        further out, the likeliest culprit is that the two balls are not the same weight.
                      </>
                    )}
                  </p>
                  <p style={{ marginBottom: 0 }}>
                    However lopsided the charges, each ball feels the same size of push. Four times the
                    charge does not buy you a harder shove.{' '}
                    {run.p2 === 'big' && (
                      <>You predicted otherwise — and so does almost everyone, including people who can state Newton’s third law from memory. Being able to say a rule and actually reaching for it are different things.</>
                    )}
                  </p>
                </div>
                <h3>And a second look, which is stranger</h3>
                <p>Set up two arrangements: both balls halved once, and one ball halved twice with the other untouched. Very different-looking pairs.</p>
                <ProductFigure />
                <p>They hang at <strong>the same separation</strong>. What the two charges are, individually, turns out not to matter — only what you get when you multiply them.</p>
                <div className="actions"><Next to="model" label="Write it down" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.j2} onClick={() => set('j2locked', true)}>Record what I saw</button>
              </div>
            )}
          </>
        );

      /* ------------------------------------------------------------- model */
      /* SPLIT, per docs/specs/E2-morsel-pass.md. This screen carried five jobs
       * in 430 words: the relation, a three-way ledger, why the constant is
       * absent, P1 answered, P3 answered. It now carries one — the compression
       * and what is deliberately missing from it. P1 and P3 became recall1 and
       * recall3, where the student derives them instead of being told.
       *
       * THE THREE-WAY PANEL WAS DELETED, not moved, and that fixed a leak I had
       * introduced. Its columns were "your experiment established / established
       * by other evidence / still open" — which is the ledger sort's three bins,
       * displayed four screens before the student is asked to classify anything.
       * The sort was being answered in advance by a panel written long before
       * the sort existed. */
      case 'model':
        return (
          <>
            <p className="kicker">Compression</p>
            <h2 style={{ marginTop: '.2rem' }}>All of that, in one line.</h2>
            <p>Two things came out of the bench. The push depends on <strong>both</strong> charges, and your measurements fit their product. And it falls off with distance <strong>faster than simple proportion</strong> — that much your halvings did settle, because the 1/r tick was never close.</p>
            <div className="eq">F &nbsp;∝&nbsp; q<span className="sub">1</span> q<span className="sub">2</span> / r²</div>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}>
                <strong>Read the symbol in the middle carefully.</strong> It says <em>proportional to</em>,
                not <em>equals</em>. There is a constant that belongs in front, and it is missing on
                purpose: <strong>nothing you measured today tells you its value.</strong> You measured
                ratios. Ratios cannot see a constant that divides out of both sides.
              </p>
              <p style={{ marginBottom: 0 }}>You will meet it when something gives you a reason for its size. Writing it here would be handing you a number and calling it a result.</p>
            </div>
            <p className="small muted">You have earned the <strong>force model</strong>. It stays available.</p>
            <div className="actions"><Next to="recall1" label="Now use it" /></div>
          </>
        );

      /* CONVERT. These two used to be paragraphs on `model` telling the student
       * what their locked predictions came to. They have the relation in front
       * of them and the derivation is one step, so they do it. The payoff is
       * seeing their own answer then against their answer now. */
      case 'recall1': {
        const right = run.recall1 === 'quarter';
        return (
          <>
            <p className="kicker">Your first prediction, revisited</p>
            <h2 style={{ marginTop: '.2rem' }}>You have the relation. Use it.</h2>
            <p>
              Right at the start you were asked what doubling the distance would do to the push —
              and told in the same breath that you would never be doing it. You never did. You
              never moved them, never held them, never felt anything. You changed the charge and
              read a gap.
            </p>
            <p><strong>So work it out. Twice as far apart, same charges. What happens to the push?</strong></p>
            <Choices
              options={[
                { id: 'half' as P1, label: 'Half as strong' },
                { id: 'quarter' as P1, label: 'A quarter as strong' },
                { id: 'eighth' as P1, label: 'An eighth as strong' },
                { id: 'same' as P1, label: 'No change' },
              ]}
              value={run.recall1}
              locked={run.recall1locked}
              onPick={(v) => set('recall1', v)}
            />
            {run.recall1locked ? (
              <>
                <div className={`card ${right ? 'accent' : 'warn'}`}>
                  <p style={{ marginTop: 0 }}>
                    <strong>{right ? 'Yes — a quarter.' : 'A quarter.'}</strong> An r² underneath
                    means doubling the distance quarters the push. That is a claim about an
                    experiment nobody performed, reached through measurements that never went near
                    it — which is not a trick, but the main thing a model is <em>for</em>. It
                    connects what you could do to what you wanted to know.
                  </p>
                  <p style={{ marginBottom: 0 }} className="small muted">
                    With the caveat you already committed to: your own halvings could not sharply
                    separate r² from r³. What they did settle is that the falloff is steeper than
                    simple proportion — so <em>half as strong</em> is ruled out, whatever else
                    stays open.
                  </p>
                </div>
                <div className="then-now">
                  <div><span className="lab">At the start you said</span><strong>{run.p1 ? P1_LABEL[run.p1] : 'not recorded'}</strong></div>
                  <div><span className="lab">Now you say</span><strong>{run.recall1 ? P1_LABEL[run.recall1] : '—'}</strong></div>
                </div>
                <div className="actions"><Next to="recall3" label="And the third one" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.recall1} onClick={() => set('recall1locked', true)}>
                  Commit
                </button>
                <span className="small muted">Your original answer stays locked either way.</span>
              </div>
            )}
          </>
        );
      }

      case 'recall3': {
        const right = run.recall3 === 'four';
        return (
          <>
            <p className="kicker">Your third prediction, revisited</p>
            <h2 style={{ marginTop: '.2rem' }}>Double both charges at once.</h2>
            <p>
              The apparatus could never do this — there is no move on that bench that multiplies.
              But the line you just wrote down can answer it.
            </p>
            <p><strong>Double q<span className="sub">1</span> and double q<span className="sub">2</span>. What happens to the push?</strong></p>
            <Choices
              options={[
                { id: 'same' as P3, label: 'Unchanged' },
                { id: 'twice' as P3, label: 'Twice as strong' },
                { id: 'four' as P3, label: 'Four times as strong' },
                { id: 'other' as P3, label: 'Something else' },
              ]}
              value={run.recall3}
              locked={run.recall3locked}
              onPick={(v) => set('recall3', v)}
            />
            {run.recall3locked ? (
              <>
                <div className={`card ${right ? 'accent' : 'warn'}`}>
                  <p style={{ margin: 0 }}>
                    <strong>{right ? 'Yes — four times.' : 'Four times.'}</strong> Double
                    q<span className="sub">1</span> and the product doubles. Double
                    q<span className="sub">2</span> as well and it doubles again. Four times the
                    push, from doubling each of two things once.
                  </p>
                </div>
                {run.recall3 === 'twice' && (
                  <div className="card quiet">
                    <p style={{ margin: 0 }}>
                      Twice is the natural answer and the one most people give. It comes from
                      tracking one change when there are two. Nothing about it is careless — it is
                      just a step short.
                    </p>
                  </div>
                )}
                <div className="then-now">
                  <div><span className="lab">At the start you said</span><strong>{run.p3 ? P3_LABEL[run.p3] : 'not recorded'}</strong></div>
                  <div><span className="lab">Now you say</span><strong>{run.recall3 ? P3_LABEL[run.recall3] : '—'}</strong></div>
                </div>
                <div className="actions"><Next to="history" label="Who else has stood here?" /></div>
              </>
            ) : (
              <div className="actions">
                <button className="btn primary" disabled={!run.recall3} onClick={() => set('recall3locked', true)}>
                  Commit
                </button>
              </div>
            )}
          </>
        );
      }

      case 'history':
        return (
          <>
            <p className="kicker">1767 · 1773</p>
            <h2 style={{ marginTop: '.2rem' }}>The difficulty you hit is <em>the</em> difficulty.</h2>
            <p>You have just concluded that measuring this force directly is delicate, and that your numbers cannot cleanly separate the candidates. That is not a beginner’s problem. Two people got past it, and neither did it by measuring more carefully.</p>
            <h3>Priestley, 1767 — who did not measure it at all</h3>
            <p>Franklin had noticed that small corks lowered inside a highly electrified metal can are neither pulled nor pushed. <strong>Nothing happens.</strong> Joseph Priestley repeated it and recognised the shape of the result: Newton had shown that inside a hollow shell, gravity also does nothing — and that this follows from its being an inverse-square law.</p>
            <p>So he ran the argument backwards. Nothing inside the can, therefore the electrical force must be inverse-square too. No delicate measurement. A null result and an argument.</p>
            <h3>Cavendish, about 1773 — who turned nothing into a number</h3>
            <p>Henry Cavendish built that into a real experiment and asked how well it held. His answer: <strong>the exponent cannot differ from 2 by more than about one part in fifty.</strong></p>
            <p>Compare that with your afternoon. You have been trying to tell 2 from 3 and finding it hard. He had it inside 2 ± 0.02 — by measuring something that was supposed to be, and was, exactly zero.</p>
            <div className="card accent">
              <p style={{ marginTop: 0 }}>
                <strong>That is the thing worth carrying out of today.</strong> A measurement of a
                difference gives you a number and leaves you arguing about how much to trust it. A
                question whose answer should be <em>nothing</em> gives you something else:{' '}
                <strong>a stated limit on how wrong you could be.</strong>
              </p>
              <p style={{ marginBottom: 0 }}>You already used one. When you held a spare sphere near the pair and watched for a change that never came, that was the same move.</p>
            </div>
            <p className="small muted">Cavendish never published it. Maxwell found the papers and put them into print in 1879, more than a century later.</p>
            <div className="card quiet">
              <p style={{ marginTop: 0 }}>
                <strong>And the other route?</strong> Twelve years after Cavendish, Coulomb measured the
                force head-on with a torsion balance and published three numbers. Historians have been
                arguing about those three numbers for thirty years.
              </p>
              <p style={{ marginBottom: 0 }}>
                <button className="btn" onClick={() => go('coulomb')}>Read what happened →</button>{' '}
                <span className="small muted">Optional. Nothing later depends on it.</span>
              </p>
            </div>
            <div className="actions"><Next to="ledger" label="What have we actually established?" /></div>
          </>
        );

      /* --------------------------------------------- coulomb (off-spine) */
      case 'coulomb':
        return (
          <>
            <p className="kicker">Optional · 1785</p>
            <h2 style={{ marginTop: '.2rem' }}>Coulomb, and three numbers that are still being argued about.</h2>
            <p>Coulomb measured the force directly, with a <strong>torsion balance</strong>: a fine wire that twists by an amount you can read, letting you weigh a push far too small to feel.</p>
            <p>He did not build it for this. He had developed it for compass needles, and worked out how twisted wire behaves, years before he ever pointed it at charge. The instrument came first and the question came to it.</p>
            <p>His paper reports <strong>three measurements</strong>.</p>
            <table className="results">
              <thead><tr><th>trial</th><th>wire twisted by</th><th>separation</th></tr></thead>
              <tbody>
                <tr><td>1</td><td>0°</td><td>36°</td></tr>
                <tr><td>2</td><td>126°</td><td>18°</td></tr>
                <tr><td>3</td><td>567°</td><td>8.5°</td></tr>
              </tbody>
            </table>
            <p>Halve the separation, four times the twist. Halve it again, four times again. In the third trial he notes it misses perfection by half a degree.</p>
            <div className="card warn">
              <p style={{ marginTop: 0 }}><strong>You have spent an afternoon on an apparatus like this. Look at that table again.</strong></p>
              <p style={{ marginBottom: 0 }}>
                Three readings. No repeats, no scatter, no stated uncertainty, agreeing with the answer
                almost exactly. Peter Heering rebuilt the instrument and found it so unruly — the ball
                drifting two or three degrees every few seconds — that he concluded Coulomb cannot have
                obtained those numbers by measuring. Alberto Martínez rebuilt it again and concluded the
                opposite. It is not settled.
              </p>
            </div>
            <p><strong>Two things worth taking from that, pulling in different directions.</strong> Data that agrees with its conclusion perfectly is not automatically better data — sometimes it is a reason to ask harder questions. And a famous name on a result does not close the question of how the result was obtained.</p>
            <div className="card accent">
              <p style={{ margin: 0 }}>
                It also sharpens the comparison from the previous screen. Cavendish could state a bound:
                within one part in fifty. Coulomb gave three numbers and <strong>no uncertainty at
                all</strong>. That is not a contest between two men — Cavendish came <em>before</em>{' '}
                Coulomb and sat unpublished for a century, so the two never competed. It is a difference
                between two <em>ways of asking</em>.
              </p>
            </div>
            <div className="actions"><Back to="history" /><Next to="ledger" label="On to what we established" /></div>
          </>
        );

      /* ------------------------------------------------------------ ledger */
      case 'ledger': {
        const allPlaced = CLAIMS.every((c) => run.sort[c.id]);
        const score = CLAIMS.filter((c) => run.sort[c.id] === c.answer).length;
        return (
          <>
            <p className="kicker">Investigation complete</p>
            <h2 style={{ marginTop: '.2rem' }}>What do we know now?</h2>

            {/* The student classifies before being told. Nothing below this
                block reveals an answer until sortLocked is true. */}
            <p>
              You did the work, so you make the call. <strong>Four claims. Where does each
              one belong?</strong>
            </p>
            <div className="sorter">
              {CLAIMS.map((c) => {
                const picked = run.sort[c.id];
                const right = run.sortLocked && picked === c.answer;
                return (
                  <div key={c.id} className={`claim ${run.sortLocked ? (right ? 'right' : 'wrong') : ''}`}>
                    <p className="claim-txt">{c.text}</p>
                    <div className="bins">
                      {BINS.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          className={`bin ${picked === b.id ? 'on' : ''} ${
                            run.sortLocked && b.id === c.answer ? 'answer' : ''
                          }`}
                          aria-pressed={picked === b.id}
                          disabled={run.sortLocked}
                          onClick={() => setRun((r) => ({ ...r, sort: { ...r.sort, [c.id]: b.id } }))}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                    {run.sortLocked && (
                      <p className="claim-why">
                        <strong>{right ? 'Yes.' : 'Not quite.'}</strong> {c.why}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {!run.sortLocked ? (
              <div className="actions">
                <button
                  className="btn primary"
                  disabled={!allPlaced}
                  onClick={() => setRun((r) => ({ ...r, sortLocked: true }))}
                >
                  Commit my classification
                </button>
                <span className="small muted">
                  {allPlaced ? 'Locks permanently.' : 'Place all four first.'}
                </span>
              </div>
            ) : (
              <div className={`card ${score === 4 ? 'accent' : 'warn'}`}>
                <p style={{ margin: 0 }}>
                  {score === 4 ? (
                    <>
                      <strong>All four.</strong> Notice that two pairs of claims are about the
                      same physics — the falloff, and the two charges — and land in different
                      bins. Which bin a claim belongs in depends on how sharp the claim is, not
                      on what it is about.
                    </>
                  ) : (
                    <>
                      <strong>{score} of four.</strong> The two pairs are the thing to look at:
                      “falls off faster than proportional” and “falls off as one over distance
                      squared” are about the same behaviour, and they do not belong in the same
                      bin. Neither do the two claims about the charges. How sharp a claim is
                      decides what it takes to establish it.
                    </>
                  )}
                </p>
              </div>
            )}

            <h3>The full picture</h3>
            <div className="card">
              <div className="ledger">
                <div>
                  <h3 style={{ marginTop: 0 }}>You established</h3>
                  <ul className="yes">
                    <li>The push depends on <strong>both</strong> charges. A lopsided pair and a balanced one with the same product hang at the same distance — so the product form <em>fits everything you measured</em></li>
                    <li>Each ball feels the same size of push, however unequal the charges</li>
                    <li>The force falls off with distance faster than simple proportion</li>
                    <li>How far your own apparatus can be trusted, and where it stops</li>
                  </ul>
                </div>
                <div>
                  <h3 style={{ marginTop: 0 }}>You did not establish</h3>
                  <ul className="no">
                    <li><strong>That the force really goes as the product.</strong> You compared four charge states along one line, and one arrangement off it. Everything fitted — but “fits everything I tried” and “is the law” are the same two things you separated for the exponent, and they stay separate here.</li>
                    <li>
                      <strong>The exact exponent.</strong>{' '}
                      {k >= 1
                        ? `Your ${k} halving${k > 1 ? 's' : ''} separated the candidates by a margin your errors can reach.`
                        : 'You would need the measurements for this.'}
                    </li>
                    <li>The constant in front — you measured ratios, and ratios cannot see it</li>
                    <li>That the charge really splits equally on contact — you assumed it</li>
                    <li><strong>How the push gets from one ball to the other.</strong> Nothing today touched the space between them</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card accent">
              <p style={{ margin: 0 }}>
                That last one is the next investigation. Two objects, not touching, and somehow each one
                knows the other is there.{' '}
                <strong>E3 · How does one charge know the other is there?</strong>
              </p>
            </div>
            <div className="actions">
              <a className="btn primary" href="/learn/electricity/how-does-it-know">Go to E3 →</a>
              <a className="btn" href="/models">See the models you have earned</a>
              <button
                className="btn ghost"
                onClick={() => {
                  if (confirm('Start E2 from the beginning? Your locked predictions will be cleared.')) {
                    localStorage.removeItem(STORAGE_KEY);
                    setRun(defaultRun());
                  }
                }}
              >
                Run it again
              </button>
            </div>
          </>
        );
      }
    }
  };

  // The model is earned on reaching the compression screen, not before.
  useEffect(() => {
    if (step === 'model') earnModel('coulomb-force');
  }, [step]);

  const n = STEPS.indexOf(step);
  return (
    <div className="inv-card">
      <DevJump
        label="E2"
        steps={[...STEPS, 'coulomb' as Step]}
        current={step}
        onJump={go}
        onSeed={() =>
          setRun((r) => ({
            ...r,
            p1: 'quarter', p1locked: true,
            p2: 'big', p2locked: true,
            p3: 'twice', p3locked: true,
            r0: '200', r1: '126', r2: '79', r3: '52',
            j1: 'B', j1locked: true,
            j2: 'same', j2locked: true,
            recall1: 'quarter', recall1locked: true,
            recall3: 'four', recall3locked: true,
          }))
        }
      />
      <Rail step={step} />
      {n >= 0 && (
        <p className="screen-of" aria-live="polite">
          Screen {n + 1} of {STEPS.length}
        </p>
      )}
      {body()}
    </div>
  );
}
